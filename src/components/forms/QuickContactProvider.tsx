"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { QuickContactModal } from "./QuickContactModal";

/**
 * Talebin hangi düğmeden geldiğini taşır.
 *
 * `ctaContext` panelde "bu ay gelen taleplerin kaçı kat planından, kaçı
 * hero'dan" sorusunu cevaplar. Şema bu alanları baştan beri destekliyordu
 * ama arayüzden hiç doldurulmuyordu.
 */
export type QuickContactOptions = {
  /** Proje slug'ı — lead kaydında projectId olarak saklanır. */
  project?: string;
  /** Plan kodu (ör. "A-Tipi") — planId olarak saklanır. */
  plan?: string;
  /** Talebi doğuran düğmenin kimliği (ör. "hero", "kat-plani"). */
  context?: string;
};

type Ctx = {
  isOpen: boolean;
  open: (options?: QuickContactOptions) => void;
  close: () => void;
  projectHint?: string;
  planHint?: string;
  ctaContext?: string;
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
  const [ctaContext, setCta] = useState<string | undefined>();

  const open = useCallback((opts?: QuickContactOptions) => {
    setProject(opts?.project);
    setPlan(opts?.plan);
    setCta(opts?.context);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close, projectHint, planHint, ctaContext }),
    [isOpen, open, close, projectHint, planHint, ctaContext]
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
