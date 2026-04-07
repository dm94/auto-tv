# Auto TV

Auto TV is a frontend application built with React + TypeScript + Vite that simulates the experience of watching live television.

It includes channel switching, OSD (On Screen Display), an electronic program guide (EPG), volume control, and keyboard shortcuts for a TV-like experience.

## What does this project do?

- Simulates TV channels with per-channel video playlists.
- Supports channel zapping with keyboard, mouse wheel, or on-screen controls.
- Displays an OSD with current channel and current program information.
- Includes an electronic program guide (EPG) to browse content.
- Supports multiple languages with i18n (`es` and `en`).

## Tech stack

- React 18
- TypeScript
- Vite 6
- Zustand (global state)
- Tailwind CSS
- i18next + react-i18next

## Main structure

- `src/pages/Home.tsx`: main TV screen.
- `src/components/Player.tsx`: current channel video playback.
- `src/components/OSD.tsx`: real-time information overlay.
- `src/components/Guide.tsx`: program guide.
- `src/store/useStore.ts`: global state and player actions.
- `public/json/*.json`: mock channels and video assets.

## Available commands

This project uses `pnpm` as the package manager.

```bash
pnpm install
pnpm dev
pnpm lint
pnpm check
pnpm build
pnpm preview
```

## Controls

- `ArrowUp`: previous channel
- `ArrowDown`: next channel
- `ArrowRight` or `+`: volume up
- `ArrowLeft` or `-`: volume down
- `M`: mute/unmute
- `G` or `Escape`: open/close guide

You can also switch channels with the mouse wheel and use touch/on-screen controls.

## Reference

This project takes inspiration from [Channel Surfer](https://channelsurfer.tv/).
