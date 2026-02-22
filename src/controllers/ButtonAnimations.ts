import gsap from "gsap";

/**
 * ButtonAnimations
 * Attaches GSAP scale micro-animations to every .btn element.
 * Arrow methods ensure correct `this` binding when used as listeners.
 */
export class ButtonAnimations {
  readonly #buttons: NodeListOf<HTMLElement>;

  constructor() {
    this.#buttons = document.querySelectorAll<HTMLElement>(".btn");
  }

  init = (): void => {
    this.#buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", this.#onEnter);
      btn.addEventListener("mouseleave", this.#onLeave);
      btn.addEventListener("mousedown", this.#onPress);
      btn.addEventListener("mouseup", this.#onRelease);
    });
  };

  // ── Private ──────────────────────────────────────────────────────────────

  #onEnter = (e: Event): void => {
    gsap.to(e.currentTarget as HTMLElement, {
      scale: 1.05,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  #onLeave = (e: Event): void => {
    gsap.to(e.currentTarget as HTMLElement, {
      scale: 1,
      duration: 0.35,
      ease: "elastic.out(1, 0.5)",
    });
  };

  #onPress = (e: Event): void => {
    gsap.to(e.currentTarget as HTMLElement, {
      scale: 0.96,
      duration: 0.1,
      ease: "power2.in",
    });
  };

  #onRelease = (e: Event): void => {
    gsap.to(e.currentTarget as HTMLElement, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
    });
  };
}
