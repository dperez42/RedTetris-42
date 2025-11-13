import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {   
      //https:true,
      port: env.VITE_CLIENT_PORT ? Number(env.VITE_CLIENT_PORT) : 5173, 
      host: '0.0.0.0', // par default: localhost
      strictPort: true,
    },
    plugins: [vue()],
    base: '/',
  }
})
