import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  // Use '/pooram-connect/' when deploying to GitHub Pages, otherwise default to '/'
  const isGithubPages = process.env.GITHUB_ACTIONS === 'true';
  const base = isGithubPages ? '/pooram-connect/' : '/';

  return {
    base,
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    }
  };
});
