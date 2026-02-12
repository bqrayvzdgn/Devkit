import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useToastContext } from '../contexts/ToastContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import ShortcutsModal from '../components/ShortcutsModal';

interface JwtHeader {
  alg: string;
  typ: string;
  [key: string]: any;
}

interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export default function JwtDebugger() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<JwtHeader | null>(null);
  const [payload, setPayload] = useState<JwtPayload | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { showToast } = useToastContext();

  useEffect(() => {
    if (!token) {
      setHeader(null);
      setPayload(null);
      return;
    }

    try {
      // Decode header
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const headerDecoded = JSON.parse(atob(parts[0]));
      setHeader(headerDecoded);

      // Decode payload
      const payloadDecoded = jwtDecode<JwtPayload>(token);
      setPayload(payloadDecoded);

      // Check expiration
      if (payloadDecoded.exp && payloadDecoded.exp * 1000 < Date.now()) {
        showToast('Token is expired!', 'error');
      }
    } catch (err) {
      setHeader(null);
      setPayload(null);
      showToast('Invalid JWT format', 'error');
    }
  }, [token, showToast]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const clearToken = () => {
    setToken('');
    setHeader(null);
    setPayload(null);
  };

  const shortcuts = useKeyboardShortcuts([
    { key: 'r', ctrl: true, handler: clearToken, description: 'Clear' },
    { key: '/', ctrl: true, handler: () => setShowShortcuts(true), description: 'Show Shortcuts' },
  ]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          🔑 JWT Debugger
        </h2>

        <div className="space-y-6">
          {/* Token Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JWT Token
            </label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full h-32 p-4 font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste your JWT token here..."
            />
          </div>

          {/* Clear Button */}
          <div className="flex gap-3">
            <button
              onClick={clearToken}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
            >
              Clear
            </button>
          </div>

          {/* Decoded Token */}
          {header && payload && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Header */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Header</h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(header, null, 2), 'Header')}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
                <pre className="block p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded font-mono text-xs overflow-x-auto">
                  {JSON.stringify(header, null, 2)}
                </pre>
              </div>

              {/* Payload */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Payload</h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(payload, null, 2), 'Payload')}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
                <pre className="block p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded font-mono text-xs overflow-x-auto max-h-96">
                  {JSON.stringify(payload, null, 2)}
                </pre>

                {/* Expiration Info */}
                {payload.exp && (
                  <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Expires:</strong>{' '}
                      {new Date(payload.exp * 1000).toLocaleString()}
                    </p>
                    {payload.exp * 1000 < Date.now() && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        ⚠️ Token has expired
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 JWT tokens are decoded automatically. Paste a token to see its header and payload.
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
