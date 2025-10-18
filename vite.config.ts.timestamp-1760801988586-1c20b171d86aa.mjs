// vite.config.ts
import { defineConfig } from "file:///C:/future-keepsake-delivery/node_modules/vite/dist/node/index.js";
import react from "file:///C:/future-keepsake-delivery/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
import { fileURLToPath } from "node:url";
import { componentTagger } from "file:///C:/future-keepsake-delivery/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/future-keepsake-delivery/vite.config.ts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = resolve(__filename, "..");
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  define: {
    "process.env": {},
    global: "globalThis"
  },
  server: {
    host: "::",
    port: 8080,
    headers: {
      "X-Content-Type-Options": "nosniff"
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  build: {
    target: "es2020",
    minify: "terser",
    sourcemap: false,
    chunkSizeWarningLimit: 2e3,
    rollupOptions: {
      external: [
        // '@supabase/supabase-js'
      ],
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          supabase: ["@supabase/ssr"],
          ui: ["@chakra-ui/react", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          utils: ["axios", "date-fns", "react-router-dom"],
          vendor: [
            // other vendor packages can go here
          ]
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxmdXR1cmUta2VlcHNha2UtZGVsaXZlcnlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXGZ1dHVyZS1rZWVwc2FrZS1kZWxpdmVyeVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovZnV0dXJlLWtlZXBzYWtlLWRlbGl2ZXJ5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xyXG5jb25zdCBfX2Rpcm5hbWUgPSByZXNvbHZlKF9fZmlsZW5hbWUsICcuLicpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXIoKSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICBkZWZpbmU6IHtcclxuICAgICdwcm9jZXNzLmVudic6IHt9LFxyXG4gICAgZ2xvYmFsOiAnZ2xvYmFsVGhpcycsXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6IFwiOjpcIixcclxuICAgIHBvcnQ6IDgwODAsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdYLUNvbnRlbnQtVHlwZS1PcHRpb25zJzogJ25vc25pZmYnLFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpXHJcbiAgICB9XHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgdGFyZ2V0OiAnZXMyMDIwJyxcclxuICAgIG1pbmlmeTogJ3RlcnNlcicsXHJcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogW1xyXG4gICAgICAgIC8vICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXHJcbiAgICAgIF0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgcmVhY3Q6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXHJcbiAgICAgICAgICBzdXBhYmFzZTogWydAc3VwYWJhc2Uvc3NyJ10sXHJcbiAgICAgICAgICB1aTogWydAY2hha3JhLXVpL3JlYWN0JywgJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLCAnQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnUnXSxcclxuICAgICAgICAgIHV0aWxzOiBbJ2F4aW9zJywgJ2RhdGUtZm5zJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcclxuICAgICAgICAgIHZlbmRvcjogW1xyXG4gICAgICAgICAgICAvLyBvdGhlciB2ZW5kb3IgcGFja2FnZXMgY2FuIGdvIGhlcmVcclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uW2V4dF0nXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxyXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVRLFNBQVMsb0JBQW9CO0FBQ3BTLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyx1QkFBdUI7QUFKaUksSUFBTSwyQ0FBMkM7QUFNbE4sSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLFFBQVEsWUFBWSxJQUFJO0FBRTFDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsRUFDNUMsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixRQUFRO0FBQUEsSUFDTixlQUFlLENBQUM7QUFBQSxJQUNoQixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLE1BQ1AsMEJBQTBCO0FBQUEsSUFDNUI7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsV0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCx1QkFBdUI7QUFBQSxJQUN2QixlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUE7QUFBQSxNQUVWO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixPQUFPLENBQUMsU0FBUyxXQUFXO0FBQUEsVUFDNUIsVUFBVSxDQUFDLGVBQWU7QUFBQSxVQUMxQixJQUFJLENBQUMsb0JBQW9CLDBCQUEwQiwrQkFBK0I7QUFBQSxVQUNsRixPQUFPLENBQUMsU0FBUyxZQUFZLGtCQUFrQjtBQUFBLFVBQy9DLFFBQVE7QUFBQTtBQUFBLFVBRVI7QUFBQSxRQUNGO0FBQUEsUUFDQSxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
