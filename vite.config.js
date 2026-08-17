import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => {
  // Use '/pooram-connect/' when deploying to GitHub Pages, otherwise relative base './'
  const isGithubPages = process.env.GITHUB_ACTIONS === 'true';
  const base = isGithubPages ? '/pooram-connect/' : './';

  return {
    base,
    plugins: [viteSingleFile()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    }
  };
});
