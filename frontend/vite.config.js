import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // allow Vite Preview to listen on all interfaces
  preview: {
    host: '0.0.0.0',
    // add your Render-assigned hostname here:
    allowedHosts: [
      'tuinue-wasichana-ui-dw85.onrender.com'
    ]
  }
})
