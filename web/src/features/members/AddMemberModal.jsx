import { useMemo, useState } from "react";
import { Modal, ModalActions } from "../../components/ui/Modal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input, Select } from "../../components/ui/Field.jsx";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { Spinner } from "../../components/ui/Spinner.jsx";
import { useToast } from "../../hooks/useToast.js";
import { PROJECT_ROLE, PROJECT_ROLE_LIST } from "../../lib/constants.js";
import { useGetUsersQuery } from "../../services/endpoints/users.api.js";
import { useAddMemberMutation } from "../../services/endpoints/members.api.js";
import { cn } from "../../lib/cn.js";

/**
 * The API adds members by numeric userId and offers no user search, so this
 * lists GET /users and filters client-side.
 */
export function AddMemberModal({ open, onClose, projectId, existingMemberIds }) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [role, setRole] = useState(PROJECT_ROLE.MEMBER);

  const { data: users, isLoading } = useGetUsersQuery({ page: 1, limit: 100 }, { skip: !open });
  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();

  const candidates = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (users ?? [])
      .filter((user) => !existingMemberIds.includes(user.id))
      .filter(
        (user) =>
          !term ||
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
  }, [users, existingMemberIds, search]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!selectedId) return;

    try {
      await addMember({ projectId, userId: selectedId, role }).unwrap();
      toast.success("Member added.");
      setSelectedId(null);
      setSearch("");
      onClose();
    } catch (error) {
      toast.error(error, "Could not add the member.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a member"
      description="Pick a registered user and give them a role."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name or email"
        />

        <div className="scrollbar-slim max-h-56 overflow-y-auto rounded-lg border border-line">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Spinner className="text-ink-subtle" />
            </div>
          ) : candidates.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-ink-subtle">
              No matching users outside this project.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {candidates.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(user.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                      selectedId === user.id
                        ? "bg-brand-50"
                        : "hover:bg-zinc-50"
                    )}
                  >
                    <Avatar name={user.name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium">
                        {user.name}
                      </span>
                      <span className="block truncate text-[11px] text-ink-subtle">
                        {user.email}
                      </span>
                    </span>
                    {selectedId === user.id && (
                      <span className="text-xs text-brand-700">Selected</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Select
          label="Role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          {PROJECT_ROLE_LIST.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <ModalActions>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isAdding} disabled={!selectedId}>
            Add member
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
}
