import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    basicSsl(),
    VitePWA({
      registerType: "autoUpdate",
      // Bật PWA trong dev mode để test không cần build
      devOptions: {
        enabled: true,
        type: "classic",
        suppressWarnings: true,
      },
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "pwa-192x192.png", "pwa-512x512.png"],
      // Workbox config: cache assets tĩnh + SPA fallback
      workbox: {
        navigateFallback: "/",
        navigateFallbackDenylist: [/^\/api/, /^\/uploads/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        id: "/",
        name: "Hệ Thống Chấm Công",
        short_name: "Chấm Công",
        description: "Ứng dụng điểm danh & chấm công thông minh",
        theme_color: "#2563eb",
        background_color: "#2563eb",
        display: "standalone",
        display_override: ["standalone"],
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        categories: ["business", "productivity"],
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    host: true, // Lắng nghe trên mọi IP
    port: 5173,
    allowedHosts: [
      "rsr0mppx-5173.asse.devtunnels.ms", // Thêm chính xác domain devtunnel của bạn vào đây
    ],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
