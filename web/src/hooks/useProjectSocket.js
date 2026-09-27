import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../features/auth/authSlice.js";
import { logRequest } from "../features/devtools/devLogSlice.js";
import { api } from "../services/api.js";
import { getSocket } from "../services/socket.js";

const taskTags = (projectId) => (task) =>
  // Task payloads carry project_id, so ignore anything for another project.
  Number(task?.project_id) === projectId
    ? [
        { type: "Task", id: `PROJECT-${projectId}` },
        // Also refresh a single-task query for this id, if one is cached.
        { type: "Task", id: task.id },
      ]
    : [];

// Comment payloads carry task_id but no project_id; they are only ever
// delivered to this project's room, which already scopes them.
const commentTags = (comment) =>
  comment?.task_id ? [{ type: "Comment", id: `TASK-${comment.task_id}` }] : [];

// Same scoping as comments: task_id only, delivered to this project's room.
const attachmentTags = (attachment) =>
  attachment?.task_id
    ? [{ type: "Attachment", id: `TASK-${attachment.task_id}` }]
    : [];

/**
 * Server events (src/controllers/*.controller.js) mapped to the RTK Query
 * cache tags they make stale. Payloads are raw rows without the author's
 * name, so affected lists are refetched rather than patched in place.
 *
 * Comment and attachment lists are only cached while their task drawer is
 * open, so events for other tasks invalidate nothing and cost no requests.
 */
const eventTags = (projectId) => ({
  taskCreated: taskTags(projectId),
  taskUpdated: taskTags(projectId),
  taskDeleted: taskTags(projectId),
  commentCreated: commentTags,
  commentUpdated: commentTags,
  commentDeleted: commentTags,
  attachmentCreated: attachmentTags,
  attachmentDeleted: attachmentTags,
});

/**
 * Keeps a project live: joins its Socket.IO room and refetches tasks and the
 * open task's comments and attachments when any member changes them.
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

    // One handler per event so each is logged under its own name and can be
    // detached precisely on cleanup.
    const handlers = Object.entries(eventTags(projectId)).map(([event, tagsFor]) => [
      event,
      (payload) => {
        log(event, payload);

        const tags = tagsFor(payload);
        if (tags.length) dispatch(api.util.invalidateTags(tags));
      },
    ]);

    const onProjectError = (message) => log("projectError", message, false);
    const onConnectError = (error) => log("connect_error", error.message, false);

    socket.on("connect", onConnect);
    handlers.forEach(([event, handler]) => socket.on(event, handler));
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
      handlers.forEach(([event, handler]) => socket.off(event, handler));
      socket.off("projectError", onProjectError);
      socket.off("connect_error", onConnectError);
    };
  }, [dispatch, token, projectId]);
}
