"use client";

import { useTransition } from "react";
import type { UserListItem } from "@sitre/db/repos/user";
import { updateUserRole, setUserDisabled } from "./actions";

const ROLES = ["OWNER", "ADMIN", "EDITOR", "SALES", "VIEWER"] as const;

export function UserRow({
  row,
  currentUserId,
  canMutate,
}: {
  row: UserListItem;
  currentUserId: string;
  canMutate: boolean;
}) {
  const [pending, start] = useTransition();
  const isSelf = row.id === currentUserId;
  const disabled = pending || isSelf || !canMutate;

  function changeRole(role: string) {
    const fd = new FormData();
    fd.set("id", row.id);
    fd.set("role", role);
    start(async () => {
      await updateUserRole(fd);
    });
  }

  function toggleDisabled() {
    const fd = new FormData();
    fd.set("id", row.id);
    fd.set("disabled", row.disabled ? "false" : "true");
    start(async () => {
      await setUserDisabled(fd);
    });
  }

  return (
    <tr className="border-t border-[var(--color-border)]">
      <td className="px-4 py-3">{row.email}</td>
      <td className="px-4 py-3">{row.name ?? "—"}</td>
      <td className="px-4 py-3">
        <select
          defaultValue={row.role}
          disabled={disabled}
          onChange={(e) => changeRole(e.target.value)}
          className="border border-[var(--color-border)] rounded px-2 py-1 text-sm bg-white"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        {isSelf ? (
          <span className="text-[var(--color-brand-soft)]">—</span>
        ) : (
          <button
            type="button"
            onClick={toggleDisabled}
            disabled={disabled}
            className="text-sm underline"
          >
            {row.disabled ? "Etkinleştir" : "Devre dışı"}
          </button>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {row.createdAt.toLocaleDateString("tr-TR")}
      </td>
    </tr>
  );
}
