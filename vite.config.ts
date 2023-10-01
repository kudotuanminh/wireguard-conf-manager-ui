import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";

const env = loadEnv(
    'all',
    process.cwd()
);

let backendURL = env.VITE_BACKEND_URL;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        proxy: {
            "/api": {
                target: backendURL,
                changeOrigin: true,
                secure: false,
            },
        }
    },
})
