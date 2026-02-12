export default function Home() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to Dev Utilities
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
          Your all-in-one developer toolkit for common tasks
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              📝 JSON/YAML Formatter
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Format, validate, and minify JSON and YAML files
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              🔐 Base64/URL Encoder
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Encode and decode Base64 and URL strings
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              #️⃣ Hash Generator
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate MD5, SHA256, and SHA512 hashes
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              🆔 UUID Generator
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate unique identifiers (UUID v4 and v5)
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              🕐 Timestamp Converter
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Convert between Unix timestamps, ISO 8601, and human-readable dates
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              🔑 JWT Debugger
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Decode and verify JSON Web Tokens with signature validation
            </p>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ✨ Privacy First
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            All processing happens locally on your machine. No data is ever sent to external servers.
          </p>
        </div>
      </div>
    </div>
  );
}
