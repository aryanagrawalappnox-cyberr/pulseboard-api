import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logo } from "./Logo.jsx";
import { Avatar } from "../ui/Avatar.jsx";
import { Button } from "../ui/Button.jsx";
import { Modal, ModalActions } from "../ui/Modal.jsx";
import { Input } from "../ui/Field.jsx";
import { logout } from "../../features/auth/authSlice.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../hooks/useToast.js";
import { useUpdateUserMutation } from "../../services/endpoints/users.api.js";

function ProfileModal({ open, onClose, user }) {
  const toast = useToast();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "" });

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateUser({ userId: user.id, ...form }).unwrap();
      toast.success("Profile updated.");
      onClose();
    } catch (error) {
      toast.error(error, "Could not update the profile.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Your profile"
      description="updateUserSchema requires both fields on every save."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Name" required value={form.name} onChange={update("name")} />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={update("email")}
        />
        <ModalActions>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Save changes
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
}

export function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/projects" className="rounded-lg">
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 transition-colors hover:bg-zinc-100"
          >
            <Avatar name={user?.name} size="sm" />
            <span className="hidden text-xs font-medium sm:block">
              {user?.name ?? "…"}
            </span>
          </button>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Sign out
          </Button>
        </div>
      </div>

      {user && (
        <ProfileModal
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          user={user}
        />
      )}
    </header>
  );
}
