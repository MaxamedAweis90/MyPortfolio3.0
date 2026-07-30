// utils/animations.ts

type RouterLike = {
  push: (href: string) => void;
};

export const animatedPageIn = () => {
  // Legacy hook retained for backward compatibility
};

export const animatedPageOut = (href: string, router: RouterLike) => {
  router.push(href);
};
