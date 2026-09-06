import { api } from "../api.js";

/** Comments hang off tasks directly: /tasks/:taskId/comments */
export const commentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: (taskId) => `/tasks/${taskId}/comments`,
      providesTags: (result, error, taskId) => [
        { type: "Comment", id: `TASK-${taskId}` },
      ],
    }),

    // createCommentSchema requires a userId even though the server takes the
    // author from the JWT, so the caller passes its own id for validation.
    createComment: builder.mutation({
      query: ({ taskId, ...body }) => ({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Comment", id: `TASK-${taskId}` },
      ],
    }),

    updateComment: builder.mutation({
      query: ({ taskId, commentId, content }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Comment", id: `TASK-${taskId}` },
      ],
    }),

    deleteComment: builder.mutation({
      query: ({ taskId, commentId }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Comment", id: `TASK-${taskId}` },
      ],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
