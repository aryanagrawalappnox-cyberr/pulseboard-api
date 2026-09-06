import { api } from "../api.js";

export const membersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Returns `{ id, name, email, role }` per member — also the only way for
    // the client to learn its own role in a project.
    getMembers: builder.query({
      query: (projectId) => `/projects/${projectId}/members`,
      providesTags: (result, error, projectId) => [
        { type: "Member", id: `PROJECT-${projectId}` },
      ],
    }),

    addMember: builder.mutation({
      query: ({ projectId, userId, role }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body: { userId, role },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Member", id: `PROJECT-${projectId}` },
      ],
    }),

    updateMemberRole: builder.mutation({
      query: ({ projectId, userId, role }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Member", id: `PROJECT-${projectId}` },
      ],
    }),

    removeMember: builder.mutation({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Member", id: `PROJECT-${projectId}` },
        // Removing yourself revokes access to the project entirely.
        { type: "Project", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useAddMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} = membersApi;
