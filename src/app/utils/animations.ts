// utils/animations.js
import gsap from 'gsap';

type RouterLike = {
  push: (href: string) => void;
};

const isHTMLElement = (el: HTMLElement | null): el is HTMLElement => Boolean(el);

export const animatedPageIn = () => {
  // grab front (black + text) and back (colorful) banners
  const front = [1,2,3,4].map((n) => document.getElementById(`banner-${n}`)).filter(isHTMLElement);
  const back  = [1,2,3,4].map((n) => document.getElementById(`banner-back-${n}`)).filter(isHTMLElement);

  if (front.length === 4 && back.length === 4) {
    const tl = gsap.timeline();

    // ensure both start at yPercent=0
    tl.set([...front, ...back], { yPercent: 0 })

      // animate front immediately
      .to(front, {
        yPercent: 100,
        stagger: 0.2,
        duration: 0.7,
        ease: 'power3.inOut'
      }, 0)

      // animate back at the same time, delayed by 0.1s
      .to(back, {
        yPercent: 100,
        stagger: 0.2,
        duration: 0.7,
        ease: 'power3.inOut'
      }, 0.1);
  }
};

export const animatedPageOut = (href: string, router: RouterLike) => {
  const front = [1,2,3,4].map((n) => document.getElementById(`banner-${n}`)).filter(isHTMLElement);
  const back  = [1,2,3,4].map((n) => document.getElementById(`banner-back-${n}`)).filter(isHTMLElement);

  if (front.length === 4 && back.length === 4) {
    const tl = gsap.timeline();

    // position both above
    tl.set([...front, ...back], { yPercent: -100 })

      // drop front back into place
      .to(front, {
        yPercent: 0,
        stagger: 0.2,
        duration: 0.7,
        ease: 'power3.inOut'
      }, 0)

      // drop back into place slightly after, then navigate
      .to(back, {
        yPercent: 0,
        stagger: 0.2,
        duration: 0.7,
        ease: 'power3.inOut',
        onComplete: () => router.push(href)
      }, 0.1);
  } else {
    router.push(href);
  }
};
