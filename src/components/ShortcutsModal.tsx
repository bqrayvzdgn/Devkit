interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: Array<{ keys: string; description: string }>;
}

export default function ShortcutsModal({ isOpen, onClose, shortcuts }: ShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Keyboard Shortcuts
        </h2>
        <div className="space-y-2">
          {shortcuts.map((s, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700"
            >
              <span className="text-gray-700 dark:text-gray-300">{s.description}</span>
              <kbd className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-mono text-sm">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
