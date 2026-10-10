"use client";
// Silme gibi geri alınamaz işlemler için onay ekranı gösterir.
export default function ConfirmButton({ children, message, className }) {
  return (
    <button
      className={className}
      onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}
    >
      {children}
    </button>
  );
}
