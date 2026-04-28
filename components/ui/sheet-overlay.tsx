"use client";

import { ReactNode } from "react";

type SheetOverlayProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  headerAside?: ReactNode;
};

export function SheetOverlay({
  isOpen,
  title,
  onClose,
  children,
  footer,
  headerAside,
}: SheetOverlayProps) {
  return (
    <div className={`overlay ${isOpen ? "show" : ""}`} onClick={onClose} aria-hidden={!isOpen}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-drag-handle" />
        <div className="sheet-header">
          <div className="sheet-header-row">
            <h2 className="sheet-title">{title}</h2>
            {headerAside ? <div className="sheet-header-aside">{headerAside}</div> : null}
            <button className="sheet-close-btn" type="button" onClick={onClose} aria-label="Schliessen">
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="sheet-body">{children}</div>
        {footer ? <div className="sheet-actions">{footer}</div> : null}
      </div>
    </div>
  );
}
