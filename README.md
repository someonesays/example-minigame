# Example minigame for Someone Says

This is an example minigame for Someone Says.

## Setup

```bash
pnpm i
pnpm dev # start dev using TestingMinigameSdk
pnpm dev/prod # start dev using MinigameSdk
pnpm build # build the game
pnpm preview # preview the minigame using MinigameSdk
pnpm format
```

## Environmental variables

The environmental variables are:

- `VITE_MINIGAME_ID`: The minigame ID.
- `VITE_TESTING_ACCESS_CODE`: The minigame's testing access code.

Don't set the value for `VITE_TESTING_ACCESS_CODE` in `.env.production` because you don't want to be exposing this code in your build.
