import { defineConfig, loadEnv } from "vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const minigameId = env.VITE_MINIGAME_ID;

  return defineConfig({
    base: `/.proxy/api/proxy/${minigameId}/`,
  });
};
