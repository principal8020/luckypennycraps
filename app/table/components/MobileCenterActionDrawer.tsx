"use client";

import type { ReactNode } from "react";

type MobileCenterActionDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function MobileCenterActionDrawer({
  open,
  onClose,
  children,
}: MobileCenterActionDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[140] lg:hidden">
      <button
        aria-label="Close center bets"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <section className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-2xl border-t border-emerald-500/70 bg-[#075f3d] p-2 pb-[max(.75rem,env(safe-area-inset-bottom))] shadow-[0_-20px_50px_rgba(0,0,0,.55)]">
        <div className="sticky top-0 z-20 mb-2 flex items-center justify-between rounded-lg border border-emerald-800/80 bg-[#03130e]/95 px-3 py-2 backdrop-blur">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-200">
              Center Bets
            </p>
            <p className="text-[8px] font-bold text-emerald-500">
              Hardways • one-roll • horn • hops
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-[10px] font-black text-white"
          >
            DONE
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}
