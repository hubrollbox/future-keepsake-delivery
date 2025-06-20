import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "keepla - Presentes para o Futuro",
        short_name: "keepla",
        description: "Plataforma para agendar entregas de presentes físicos e digitais para datas futuras.",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1e293b",
        icons: [
          {
            src: "/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
