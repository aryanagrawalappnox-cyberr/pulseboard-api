import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../features/auth/authSlice.js";
import { logRequest } from "../features/devtools/devLogSlice.js";
import { api } from "../services/api.js";
import { getSocket } from "../services/socket.js";

// Task events broadcast by src/controllers/tasks.controller.js.
const TASK_EVENTS = ["taskCreated", "taskUpdated", "taskDeleted"];

/**
 * Keeps a project's board live: joins the project's Socket.IO room and
 * refetches the task list when any member creates, updates or deletes a task.
 *
 * Event payloads are raw task rows without the author's name, so the list is
 * invalidated and refetched rather than patched in place.
 */
export function useProjectSocket(projectId) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  useEffect(() => {
    if (!token || !projectId) return undefined;

    const socket = getSocket(token);

    const log = (event, payload, ok = true) =>
      dispatch(
        logRequest({
          method: "WS",
          url: event,
          status: ok ? "event" : "error",
          ok,
          durationMs: 0,
          response: payload,
        })
      );

    // Rooms are not kept across reconnects, so join on every connect rather
    // than once.
    const onConnect = () => socket.emit("joinProject", projectId);

    // One handler per event so each can be logged under its own name and
    // detached precisely on cleanup.
    const taskHandlers = TASK_EVENTS.map((event) => [
      event,
      (task) => {
        log(event, task);

        if (Number(task?.project_id) !== projectId) return;

        dispatch(
          api.util.invalidateTags([
            { type: "Task", id: `PROJECT-${projectId}` },
            // Also refresh a single-task query for this id, if one is cached.
            { type: "Task", id: task.id },
          ])
        );
      },
    ]);

    const onProjectError = (message) => log("projectError", message, false);
    const onConnectError = (error) => log("connect_error", error.message, false);

    socket.on("connect", onConnect);
    taskHandlers.forEach(([event, handler]) => socket.on(event, handler));
    socket.on("projectError", onProjectError);
    socket.on("connect_error", onConnectError);

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.emit("leaveProject", projectId);
      socket.off("connect", onConnect);
      taskHandlers.forEach(([event, handler]) => socket.off(event, handler));
      socket.off("projectError", onProjectError);
      socket.off("connect_error", onConnectError);
    };
  }, [dispatch, token, projectId]);
}
