import { api } from "../api.js";

export const attachmentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAttachments: builder.query({
      query: (taskId) => `/tasks/${taskId}/attachments`,
      providesTags: (result, error, taskId) => [
        { type: "Attachment", id: `TASK-${taskId}` },
      ],
    }),

    // multer expects the field name "file". The body is FormData, so the base
    // query must not set a JSON content-type — fetchBaseQuery already skips it
    // for FormData, letting the browser add the multipart boundary.
    uploadAttachment: builder.mutation({
      query: ({ taskId, file }) => {
        const body = new FormData();
        body.append("file", file);

        return {
          url: `/tasks/${taskId}/attachments`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Attachment", id: `TASK-${taskId}` },
      ],
    }),

    // Admin-only on the server.
    deleteAttachment: builder.mutation({
      query: ({ taskId, attachmentId }) => ({
        url: `/tasks/${taskId}/attachments/${attachmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Attachment", id: `TASK-${taskId}` },
      ],
    }),
  }),
});

export const {
  useGetAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} = attachmentsApi;
