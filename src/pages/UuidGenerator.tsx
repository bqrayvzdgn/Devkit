import { useState } from 'react';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { useToastContext } from '../contexts/ToastContext';
import { useFileOperations } from '../hooks/useFileOperations';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import ShortcutsModal from '../components/ShortcutsModal';

export default function UuidGenerator() {
  const [version, setVersion] = useState<4 | 5>(4);
  const [count, setCount] = useState(1);
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [uuids, setUuids] = useState<string[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { showToast } = useToastContext();
  const { downloadFile } = useFileOperations();

  const DNS_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  const URL_NAMESPACE = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';

  const generateUUIDs = () => {
    const generated: string[] = [];

    if (version === 4) {
      for (let i = 0; i < count; i++) {
        generated.push(uuidv4());
      }
    } else {
      // UUID v5 requires namespace and name
      const ns = namespace || DNS_NAMESPACE;
      const n = name || 'example';
      generated.push(uuidv5(n, ns));
    }

    setUuids(generated);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('UUID copied to clipboard!');
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    showToast(`Copied ${uuids.length} UUID${uuids.length > 1 ? 's' : ''} to clipboard!`);
  };

  const handleDownload = async () => {
    if (uuids.length === 0) {
      showToast('No UUIDs to download', 'error');
      return;
    }

    await downloadFile(uuids.join('\n'), 'uuids.txt', [{ name: 'Text Files', extensions: ['txt'] }]);
  };

  const toggleVersion = () => {
    setVersion(version === 4 ? 5 : 4);
  };

  const shortcuts = useKeyboardShortcuts([
    { key: 'g', ctrl: true, handler: generateUUIDs, description: 'Generate UUIDs' },
    { key: 'c', ctrl: true, handler: copyAll, description: 'Copy All' },
    { key: 't', ctrl: true, handler: toggleVersion, description: 'Toggle Version' },
    { key: 's', ctrl: true, handler: handleDownload, description: 'Download' },
    { key: '/', ctrl: true, handler: () => setShowShortcuts(true), description: 'Show Shortcuts' },
  ]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          🆔 UUID Generator
        </h2>

        <div className="space-y-6">
          {/* Version Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              UUID Version
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setVersion(4)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  version === 4
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Version 4 (Random)
              </button>
              <button
                onClick={() => setVersion(5)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  version === 5
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Version 5 (Name-based)
              </button>
            </div>
          </div>

          {/* UUID v4 Options */}
          {version === 4 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of UUIDs
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="w-32 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* UUID v5 Options */}
          {version === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Namespace (optional)
                </label>
                <input
                  type="text"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`DNS namespace: ${DNS_NAMESPACE}`}
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setNamespace(DNS_NAMESPACE)}
                    className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    Use DNS
                  </button>
                  <button
                    onClick={() => setNamespace(URL_NAMESPACE)}
                    className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    Use URL
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a name..."
                />
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateUUIDs}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Generate
          </button>

          {/* Results */}
          {uuids.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Generated UUIDs ({uuids.length})
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={copyAll}
                    className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Copy All
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    💾 Download
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {uuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600"
                  >
                    <code className="flex-1 font-mono text-sm text-gray-900 dark:text-gray-100">{uuid}</code>
                    <button
                      onClick={() => copyToClipboard(uuid)}
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>UUID v4:</strong> Randomly generated. <strong>UUID v5:</strong> Generated from namespace and name (deterministic).
            </p>
          </div>
        </div>

        <ShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
          shortcuts={shortcuts.map(s => ({
            keys: `Ctrl+${s.key.toUpperCase()}`,
            description: s.description
          }))}
        />
      </div>
    </div>
  );
}
