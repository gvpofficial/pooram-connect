import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ command, mode }) => {
  // Use '/pooram-connect/' when deploying to GitHub Pages, '/' in dev server, or relative base './' for offline build
  const isGithubPages = process.env.GITHUB_ACTIONS === 'true';
  const base = isGithubPages ? '/pooram-connect/' : (command === 'serve' ? '/' : './');

  return {
    base,
    plugins: [viteSingleFile()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    }
  };
});
