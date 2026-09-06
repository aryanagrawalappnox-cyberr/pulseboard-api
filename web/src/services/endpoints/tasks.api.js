import { api } from "../api.js";

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (projectId) => `/projects/${projectId}/tasks`,
      providesTags: (result, error, projectId) => [
        { type: "Task", id: `PROJECT-${projectId}` },
      ],
    }),

    getTask: builder.query({
      query: ({ projectId, taskId }) => `/projects/${projectId}/tasks/${taskId}`,
      providesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    createTask: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/tasks`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Task", id: `PROJECT-${projectId}` },
      ],
    }),

    // The API has no PATCH: updateTaskSchema requires title and status on every
    // update, so callers must send the whole task even to move a column.
    updateTask: builder.mutation({
      query: ({ projectId, taskId, ...body }) => ({
        url: `/projects/${projectId}/tasks/${taskId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { projectId, taskId }) => [
        { type: "Task", id: `PROJECT-${projectId}` },
        { type: "Task", id: taskId },
      ],
    }),

    deleteTask: builder.mutation({
      query: ({ projectId, taskId }) => ({
        url: `/projects/${projectId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Task", id: `PROJECT-${projectId}` },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
