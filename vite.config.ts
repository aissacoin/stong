
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * STRONGTOOLS SECURITY PROTOCOL:
 * 
 * To ensure the integrity and security of the Sovereign Registry, API keys must NEVER be hardcoded.
 * 
 * DEVELOPMENT SETUP:
 * 1. Create a file named '.env.local' in the root directory.
 * 2. Add your keys as follows:
 *    VITE_GEMINI_API_KEY=your_gemini_key_here
 *    VITE_OPENROUTER_KEY=your_openrouter_key_here
 * 
 * PRODUCTION SETUP:
 * Set the corresponding environment variables in your deployment dashboard (e.g., Vercel, Netlify, Cloudflare).
 * 
 * IMPORTANT: '.env.local' is already listed in .gitignore to prevent accidental leakage to public repositories.
 */

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // The third parameter '' allows loading variables without the VITE_ prefix if needed,
    // though we prioritize VITE_ prefixed keys for standard Vite behavior.
    const env = loadEnv(mode, '.', '');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        /**
         * The Gemini SDK specifically looks for 'process.env.API_KEY'.
         * We map VITE_GEMINI_API_KEY to this global definition.
         * Defaulting to "" ensures no unauthorized placeholder usage.
         */
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ""),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ""),
        'process.env.OPENROUTER_KEY': JSON.stringify(env.VITE_OPENROUTER_KEY || "")
      },
      resolve: {
        alias: {
          '@': path.resolve('.'),
        }
      }
    };
});
