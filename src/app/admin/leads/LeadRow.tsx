"use client";

import { useTransition } from "react";
import type { LeadListItem } from "@sitre/db/repos/lead";
import { updateLeadStatus, assignLead } from "./actions";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const;

const STATUS_LABEL: Record<string, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişim Kuruldu",
  QUALIFIED: "Nitelikli",
  WON: "Kazanıldı",
  LOST: "Kaybedildi",
};

export function LeadRow({ row }: { row: LeadListItem }) {
  const [pending, start] = useTransition();

  function changeStatus(status: string) {
    const fd = new FormData();
    fd.set("id", row.id);
    fd.set("status", status);
    start(async () => {
      await updateLeadStatus(fd);
    });
  }

  function changeAssignee(assigneeId: string) {
    const fd = new FormData();
    fd.set("id", row.id);
    fd.set("assigneeId", assigneeId);
    start(async () => {
      await assignLead(fd);
    });
  }

  return (
    <tr className="border-t border-[var(--color-border)] align-top">
      <td className="px-4 py-3 whitespace-nowrap">
        {row.receivedAt.toLocaleDateString("tr-TR")}
      </td>
      <td className="px-4 py-3">{row.name}</td>
      <td className="px-4 py-3">
        <div>{row.email ?? "—"}</div>
        <div className="text-[var(--color-brand-soft)]">{row.phone ?? ""}</div>
      </td>
      <td className="px-4 py-3">{row.projectInterest ?? "—"}</td>
      <td className="px-4 py-3">
        <select
          defaultValue={row.status}
          disabled={pending}
          onChange={(e) => changeStatus(e.target.value)}
          className="border border-[var(--color-border)] rounded px-2 py-1 text-sm bg-white"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          defaultValue={row.assigneeId ?? ""}
          placeholder="user id"
          disabled={pending}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v !== (row.assigneeId ?? "")) changeAssignee(v);
          }}
          className="border border-[var(--color-border)] rounded px-2 py-1 text-sm font-mono w-32 bg-white"
        />
      </td>
    </tr>
  );
}
