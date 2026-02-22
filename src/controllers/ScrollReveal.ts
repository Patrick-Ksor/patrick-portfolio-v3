import gsap from "gsap";

type RevealDirection = "up" | "left" | "right";

/**
 * ScrollReveal
 * Reads [data-reveal] attributes and creates a ScrollTrigger
 * fromTo animation for each matching element.
 */
export class ScrollReveal {
  readonly #elements: NodeListOf<HTMLElement>;

  constructor() {
    this.#elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
  }

  init = (): void => {
    this.#elements.forEach((el) => {
      const direction = (el.dataset["reveal"] ?? "up") as RevealDirection;
      const from = this.#getFrom(direction);

      gsap.fromTo(el, from, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    });
  };

  // ── Private ──────────────────────────────────────────────────────────────

  #getFrom = (direction: RevealDirection): gsap.TweenVars => {
    const base: gsap.TweenVars = { opacity: 0, x: 0, y: 0 };

    const offsets: Record<RevealDirection, Partial<gsap.TweenVars>> = {
      up: { y: 60 },
      left: { x: -60 },
      right: { x: 60 },
    };

    return { ...base, ...offsets[direction] };
  };
}
