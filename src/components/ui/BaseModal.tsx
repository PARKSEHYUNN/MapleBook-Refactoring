"use client";

import { createPortal } from "react-dom";

interface BaseModalProps {
  children: React.ReactNode;
  boxClassName?: string;
  onBackdropClick?: () => void;
  portal?: boolean;
}

export function BaseModal({ children, boxClassName = "", onBackdropClick, portal = false }: BaseModalProps) {
  const content = (
    <dialog className="modal modal-open" style={{ zIndex: 9999 }}>
      <div className={`modal-box rounded-2xl ${boxClassName}`}>{children}</div>
      {onBackdropClick && <div className="modal-backdrop" onClick={onBackdropClick} />}
    </dialog>
  );

  if (portal) {
    return createPortal(content, document.body);
  }
  return content;
}
