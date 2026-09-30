import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handlers to catch and suppress WebSocket and Vite HMR connection rejections in iframe previews
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const reasonStr = reason ? (typeof reason === 'string' ? reason : reason.message || reason.stack || '') : '';
  if (
    reasonStr.includes('WebSocket') ||
    reasonStr.includes('HMR') ||
    reasonStr.includes('ws://') ||
    reasonStr.includes('wss://')
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  const msg = event.message || '';
  if (
    msg.includes('WebSocket') ||
    msg.includes('HMR') ||
    msg.includes('ws://') ||
    msg.includes('wss://')
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
