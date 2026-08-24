import { defineConfig } from 'vite';
import angular from '@angular/build';

export default defineConfig(({ command, mode }) => {
  return {
    build: {
      target: ['es2020'],
    },
    server: {
      middlewareMode: true,
      // Aumentar timeout para evitar errores de abortados
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        timeout: 300000, // 5 minutos
      },
      // Aumentar timeout del servidor
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
    plugins: [angular()],
  };
});
