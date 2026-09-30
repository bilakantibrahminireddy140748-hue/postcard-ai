import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const isHmrDisabled = process.env.DISABLE_HMR === 'true';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // Configure HMR for iframe / proxied environments
      hmr: isHmrDisabled
        ? false
        : {
            protocol: 'wss',
            clientPort: 443,
          },
      // Disable file watching when DISABLE_HMR is true to save CPU during edits
      watch: isHmrDisabled ? null : {},
    },
  };
});
