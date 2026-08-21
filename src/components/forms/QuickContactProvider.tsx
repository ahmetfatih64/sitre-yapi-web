"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { QuickContactModal } from "./QuickContactModal";

type Ctx = {
  isOpen: boolean;
  open: (options?: { project?: string; plan?: string }) => void;
  close: () => void;
  projectHint?: string;
  planHint?: string;
};

const QuickContactContext = createContext<Ctx | null>(null);

export function QuickContactProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = useState(false);
  const [projectHint, setProject] = useState<string | undefined>();
  const [planHint, setPlan] = useState<string | undefined>();

  const open = useCallback((opts?: { project?: string; plan?: string }) => {
    setProject(opts?.project);
    setPlan(opts?.plan);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close, projectHint, planHint }),
    [isOpen, open, close, projectHint, planHint]
  );

  return (
    <QuickContactContext.Provider value={value}>
      {children}
      <QuickContactModal />
    </QuickContactContext.Provider>
  );
}

export function useQuickContact() {
  const ctx = useContext(QuickContactContext);
  if (!ctx)
    throw new Error("useQuickContact must be used inside QuickContactProvider");
  return ctx;
}
