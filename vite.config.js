import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "robots.txt"],
      manifest: {
        name: "donlodinka - Video Downloader",
        short_name: "donlodinka",
        description: "Download video dari TikTok, Instagram, dan lainnya.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "wrdnika-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "wrdnika-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "wrdnika-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
