import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "react-client", // React 앱의 루트 경로 지정
  plugins: [react()],
  build: {
    outDir: "../dist", // 빌드 결과물 위치 (서버가 서빙할 곳)
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
