import { useState } from 'react';
import { useToastContext } from '../contexts/ToastContext';
import { useFileOperations } from '../hooks/useFileOperations';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import ShortcutsModal from '../components/ShortcutsModal';

export default function Base64Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'base64' | 'url'>('base64');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { showToast } = useToastContext();
  const { uploadFile, downloadFile } = useFileOperations();

  const handleEncode = () => {
    try {
      if (mode === 'base64') {
        const encoded = btoa(input);
        setOutput(encoded);
      } else {
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Encoding failed';
      setOutput('Error: ' + errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleDecode = () => {
    try {
      if (mode === 'base64') {
        const decoded = atob(input);
        setOutput(decoded);
      } else {
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Decoding failed';
      setOutput('Error: ' + errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    showToast('Copied to clipboard!');
  };

  const handleUpload = async () => {
    const contents = await uploadFile([{ name: 'Text Files', extensions: ['txt', '*'] }]);
    if (contents) setInput(contents);
  };

  const handleDownload = async () => {
    if (!output) {
      showToast('No output to download', 'error');
      return;
    }

    await downloadFile(output, 'output.txt', [{ name: 'Text Files', extensions: ['txt'] }]);
  };

  const toggleMode = () => {
    setMode(mode === 'base64' ? 'url' : 'base64');
  };

  const shortcuts = useKeyboardShortcuts([
    { key: 'e', ctrl: true, handler: handleEncode, description: 'Encode' },
    { key: 'd', ctrl: true, handler: handleDecode, description: 'Decode' },
    { key: 't', ctrl: true, handler: toggleMode, description: 'Toggle Mode' },
    { key: 'o', ctrl: true, handler: handleUpload, description: 'Upload File' },
    { key: 's', ctrl: true, handler: handleDownload, description: 'Download' },
    { key: '/', ctrl: true, handler: () => setShowShortcuts(true), description: 'Show Shortcuts' },
  ]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          🔐 Base64/URL Encoder
        </h2>

        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setMode('base64')}
            className={`px-4 py-2 rounded-lg font-medium ${
              mode === 'base64'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Base64
          </button>
          <button
            onClick={() => setMode('url')}
            className={`px-4 py-2 rounded-lg font-medium ${
              mode === 'url'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            URL Encoding
          </button>
        </div>

        <div className="mb-4 flex gap-3">
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
          >
            📁 Upload File
          </button>
          <button
            onClick={handleDownload}
            disabled={!output}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💾 Download
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-40 p-4 font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter text to ${mode === 'base64' ? 'encode/decode' : 'URL encode/decode'}...`}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleEncode}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              Encode
            </button>
            <button
              onClick={handleDecode}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
            >
              Decode
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-40 p-4 font-mono text-sm text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg"
              placeholder="Output will appear here..."
            />
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
