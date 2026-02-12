import { useState, useEffect } from 'react';
import { useToastContext } from '../contexts/ToastContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import ShortcutsModal from '../components/ShortcutsModal';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [format, setFormat] = useState<'unix' | 'iso'>('unix');
  const [unixTimestamp, setUnixTimestamp] = useState('');
  const [isoTimestamp, setIsoTimestamp] = useState('');
  const [humanReadable, setHumanReadable] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { showToast } = useToastContext();

  useEffect(() => {
    if (!timestamp) {
      setUnixTimestamp('');
      setIsoTimestamp('');
      setHumanReadable('');
      return;
    }

    try {
      let date: Date;

      if (format === 'unix') {
        const num = parseInt(timestamp);
        if (isNaN(num)) throw new Error('Invalid number');
        // Handle both seconds and milliseconds
        date = new Date(num > 10000000000 ? num : num * 1000);
      } else {
        date = new Date(timestamp);
      }

      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }

      const unixSec = Math.floor(date.getTime() / 1000);
      setUnixTimestamp(String(unixSec));
      setIsoTimestamp(date.toISOString());
      setHumanReadable(date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }));
    } catch {
      setUnixTimestamp('');
      setIsoTimestamp('');
      setHumanReadable('Invalid timestamp');
    }
  }, [timestamp, format]);

  const useCurrentTimestamp = () => {
    const now = Date.now();
    if (format === 'unix') {
      setTimestamp(String(Math.floor(now / 1000)));
    } else {
      setTimestamp(new Date().toISOString());
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const shortcuts = useKeyboardShortcuts([
    { key: 'n', ctrl: true, handler: useCurrentTimestamp, description: 'Use Current Time' },
    { key: 't', ctrl: true, handler: () => setFormat(format === 'unix' ? 'iso' : 'unix'), description: 'Toggle Format' },
    { key: '/', ctrl: true, handler: () => setShowShortcuts(true), description: 'Show Shortcuts' },
  ]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          🕐 Timestamp Converter
        </h2>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input Format
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setFormat('unix')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  format === 'unix'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Unix Timestamp
              </button>
              <button
                onClick={() => setFormat('iso')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  format === 'iso'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                ISO 8601
              </button>
            </div>
          </div>

          {/* Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {format === 'unix' ? 'Unix Timestamp (seconds or milliseconds)' : 'ISO 8601 Timestamp'}
              </label>
              <button
                onClick={useCurrentTimestamp}
                className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ⏱️ Now
              </button>
            </div>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full px-4 py-3 font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={format === 'unix' ? 'e.g., 1234567890' : 'e.g., 2024-01-01T12:00:00Z'}
            />
          </div>

          {/* Results */}
          {timestamp && humanReadable !== 'Invalid timestamp' && (
            <div className="space-y-4">
              {/* Unix Timestamp */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Unix Timestamp (seconds)</h3>
                  <button
                    onClick={() => copyToClipboard(unixTimestamp, 'Unix timestamp')}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
                <code className="block p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded font-mono text-sm">
                  {unixTimestamp}
                </code>
              </div>

              {/* ISO 8601 */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">ISO 8601</h3>
                  <button
                    onClick={() => copyToClipboard(isoTimestamp, 'ISO 8601 timestamp')}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
                <code className="block p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded font-mono text-sm">
                  {isoTimestamp}
                </code>
              </div>

              {/* Human Readable */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Human Readable</h3>
                  <button
                    onClick={() => copyToClipboard(humanReadable, 'Human readable date')}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
                <code className="block p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded font-mono text-sm">
                  {humanReadable}
                </code>
              </div>
            </div>
          )}

          {timestamp && humanReadable === 'Invalid timestamp' && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 font-mono text-sm">
                Invalid timestamp format
              </p>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Timestamps are converted automatically as you type. Unix timestamps support both seconds and milliseconds.
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
