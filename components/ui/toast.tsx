"use client";

type ToastProps = {
  message: string;
  icon: string;
  visible: boolean;
};

export function Toast({ message, icon, visible }: ToastProps) {
  return (
    <div className={`toast ${visible ? "show" : ""}`}>
      <i className={`fa-solid ${icon}`} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
