import { useState } from 'react';
import * as yaml from 'js-yaml';
import { useToastContext } from '../contexts/ToastContext';
import { useFileOperations } from '../hooks/useFileOperations';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import ShortcutsModal from '../components/ShortcutsModal';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [format, setFormat] = useState<'json' | 'yaml'>('json');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { showToast } = useToastContext();
  const { uploadFile, downloadFile } = useFileOperations();

  const handleFormat = () => {
    setError('');
    try {
      if (format === 'json') {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = yaml.load(input);
        setOutput(yaml.dump(parsed, { indent: 2 }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid format');
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      if (format === 'json') {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed));
      } else {
        setError('Minify is only available for JSON');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const handleValidate = () => {
    setError('');
    try {
      if (format === 'json') {
        JSON.parse(input);
        setOutput('✅ Valid JSON');
      } else {
        yaml.load(input);
        setOutput('✅ Valid YAML');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid format');
    }
  };

  const handleConvert = () => {
    setError('');
    try {
      if (format === 'json') {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { indent: 2 }));
        setFormat('yaml');
      } else {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
        setFormat('json');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid format');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    showToast('Copied to clipboard!');
  };

  const handleUpload = async () => {
    const filters = format === 'json'
      ? [{ name: 'JSON', extensions: ['json'] }]
      : [{ name: 'YAML', extensions: ['yaml', 'yml'] }];

    const contents = await uploadFile(filters);
    if (contents) setInput(contents);
  };

  const handleDownload = async () => {
    if (!output) {
      showToast('No output to download', 'error');
      return;
    }

    const extension = format === 'json' ? 'json' : 'yaml';
    const filters = format === 'json'
      ? [{ name: 'JSON', extensions: ['json'] }]
      : [{ name: 'YAML', extensions: ['yaml', 'yml'] }];

    await downloadFile(output, `formatted.${extension}`, filters);
  };

  const shortcuts = useKeyboardShortcuts([
    { key: 'f', ctrl: true, handler: handleFormat, description: 'Format' },
    { key: 'm', ctrl: true, handler: handleMinify, description: 'Minify' },
    { key: 'v', ctrl: true, handler: handleValidate, description: 'Validate' },
    { key: 't', ctrl: true, handler: handleConvert, description: 'Convert' },
    { key: 'o', ctrl: true, handler: handleUpload, description: 'Upload File' },
    { key: 's', ctrl: true, handler: handleDownload, description: 'Download' },
    { key: '/', ctrl: true, handler: () => setShowShortcuts(true), description: 'Show Shortcuts' },
  ]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          📝 JSON/YAML Formatter
        </h2>

        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setFormat('json')}
            className={`px-4 py-2 rounded-lg font-medium ${
              format === 'json'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            JSON
          </button>
          <button
            onClick={() => setFormat('yaml')}
            className={`px-4 py-2 rounded-lg font-medium ${
              format === 'yaml'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            YAML
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Paste your ${format.toUpperCase()} here...`}
            />
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
              className="w-full h-96 p-4 font-mono text-sm text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg"
              placeholder="Output will appear here..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-mono text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleFormat}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Format
          </button>
          <button
            onClick={handleMinify}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
          >
            Minify
          </button>
          <button
            onClick={handleValidate}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
          >
            Validate
          </button>
          <button
            onClick={handleConvert}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
          >
            Convert to {format === 'json' ? 'YAML' : 'JSON'}
          </button>
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
