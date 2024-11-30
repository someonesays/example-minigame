import { defineConfig, loadEnv } from "vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const minigameId = env.VITE_MINIGAME_ID;

  const base = `/.proxy/api/proxy/${minigameId}/`;
  return defineConfig({
    base,
    build: {
      outDir: `dist/${base}`,
    },
  });
};
