import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';

const menuItems = [
  { path: '/json-formatter', label: 'JSON/YAML', icon: '📝' },
  { path: '/base64-encoder', label: 'Base64/URL', icon: '🔐' },
  { path: '/hash-generator', label: 'Hash', icon: '#️⃣' },
  { path: '/uuid-generator', label: 'UUID', icon: '🆔' },
  { path: '/timestamp-converter', label: 'Timestamp', icon: '🕐' },
  { path: '/jwt-debugger', label: 'JWT', icon: '🔑' },
];

export default function Layout() {
  const location = useLocation();
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            DevKit
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            All-in-one developer tools
          </p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                       bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                       text-gray-700 dark:text-gray-300 transition-colors"
          >
            <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
