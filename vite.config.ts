import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    open: true,
    // host: 'fe.suanshubang.cc',
    host: '0.0.0.0',
    proxy: {
      '/qm':
      {
        // target: 'https://yapi.zuoyebang.cc/mock/9171',
        // target: 'http://10.250.24.95:8082',
        target: 'http://10.250.19.252:8082',
        // target: "http://10.250.34.74:8082",
        changeOrigin: true
      }
    }
  }
});
