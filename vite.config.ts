import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    watch:{
      include:['./src']
    },
    outDir: 'lib',
    lib: {
      entry: './src/index.ts',
      name:'@korylee/sku',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue-demi'],
      output: {
        globals:{
          'vue-demi': 'vue-demi'
        }
      }
    }
  },
})
