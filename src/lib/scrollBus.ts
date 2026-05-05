// Cross-component scroll bus. Lenis writes; r3f and DOM read.
export const scrollBus = {
  progress: 0, // 0..1 across the whole page
  velocity: 0,
};
