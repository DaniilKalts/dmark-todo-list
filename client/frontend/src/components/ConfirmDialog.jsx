import { useEffect, useRef } from 'react';

export default function ConfirmDialog({
  open,
  title = 'Подтвердите действие',
  description,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  tone = 'danger',
  onConfirm,
  onClose,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const id = setTimeout(() => confirmRef.current?.focus(), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const confirmBtn =
    tone === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-md rounded-xl bg-white dark:bg-[#1E1E1E] shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            {description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
            )}

            <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center h-10 px-4 rounded-lg
                           border border-gray-300 dark:border-gray-600
                           text-gray-700 dark:text-gray-200
                           hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {cancelText}
              </button>

              <button
                ref={confirmRef}
                type="button"
                onClick={onConfirm}
                className={`inline-flex items-center justify-center h-10 px-4 rounded-lg ${confirmBtn}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
