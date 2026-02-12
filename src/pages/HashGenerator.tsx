import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { useToastContext } from '../contexts/ToastContext';
import { useFileOperations } from '../hooks/useFileOperations';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import ShortcutsModal from '../components/ShortcutsModal';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha256: '',
    sha512: '',
  });
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { showToast } = useToastContext();
  const { uploadFile } = useFileOperations();

  const generateHashes = (text: string) => {
    if (!text) {
      setHashes({ md5: '', sha256: '', sha512: '' });
      return;
    }

    setHashes({
      md5: CryptoJS.MD5(text).toString(),
      sha256: CryptoJS.SHA256(text).toString(),
      sha512: CryptoJS.SHA512(text).toString(),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInput(text);
    generateHashes(text);
  };

  const copyToClipboard = (text: string, algorithm: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${algorithm} hash copied!`);
  };

  const handleUpload = async () => {
    const contents = await uploadFile([{ name: 'All Files', extensions: ['*'] }]);
    if (contents) {
      setInput(contents);
      generateHashes(contents);
    }
  };

  const shortcuts = useKeyboardShortcuts([
    { key: 'o', ctrl: true, handler: handleUpload, description: 'Upload File to Hash' },
    { key: '/', ctrl: true, handler: () => setShowShortcuts(true), description: 'Show Shortcuts' },
  ]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          #️⃣ Hash Generator
        </h2>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Input Text
              </label>
              <button
                onClick={handleUpload}
                className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                📁 Upload File
              </button>
            </div>
            <textarea
              value={input}
              onChange={handleInputChange}
              className="w-full h-40 p-4 font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter text to hash..."
            />
          </div>

          <div className="space-y-4">
            {/* MD5 */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">MD5</h3>
                <button
                  onClick={() => copyToClipboard(hashes.md5, 'MD5')}
                  disabled={!hashes.md5}
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
              <code className="block p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded font-mono text-sm break-all">
                {hashes.md5 || 'Hash will appear here...'}
              </code>
            </div>

            {/* SHA-256 */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">SHA-256</h3>
                <button
                  onClick={() => copyToClipboard(hashes.sha256, 'SHA-256')}
                  disabled={!hashes.sha256}
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
              <code className="block p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded font-mono text-sm break-all">
                {hashes.sha256 || 'Hash will appear here...'}
              </code>
            </div>

            {/* SHA-512 */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">SHA-512</h3>
                <button
                  onClick={() => copyToClipboard(hashes.sha512, 'SHA-512')}
                  disabled={!hashes.sha512}
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
              <code className="block p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded font-mono text-sm break-all">
                {hashes.sha512 || 'Hash will appear here...'}
              </code>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Hashes are generated automatically as you type
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
