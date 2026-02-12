import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import JsonFormatter from './pages/JsonFormatter';
import Base64Encoder from './pages/Base64Encoder';
import HashGenerator from './pages/HashGenerator';
import UuidGenerator from './pages/UuidGenerator';
import TimestampConverter from './pages/TimestampConverter';
import JwtDebugger from './pages/JwtDebugger';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/json-formatter" replace />} />
          <Route path="json-formatter" element={<JsonFormatter />} />
          <Route path="base64-encoder" element={<Base64Encoder />} />
          <Route path="hash-generator" element={<HashGenerator />} />
          <Route path="uuid-generator" element={<UuidGenerator />} />
          <Route path="timestamp-converter" element={<TimestampConverter />} />
          <Route path="jwt-debugger" element={<JwtDebugger />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
