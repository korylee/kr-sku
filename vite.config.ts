import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'lib',
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'umd'],
      name:'@korylee/sku',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue-demi'],
      output: {
        global:{
          'vue-demi': 'vue-demi'
        }
      }
    }
  },
})
