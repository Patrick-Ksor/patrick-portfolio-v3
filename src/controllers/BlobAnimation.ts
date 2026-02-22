import gsap from "gsap";

/**
 * BlobAnimation
 * Animates the three hero background blobs with independent
 * yoyo loops creating a subtle, organic floating effect.
 */
export class BlobAnimation {
  readonly #blobs: NodeListOf<HTMLElement>;

  constructor() {
    this.#blobs = document.querySelectorAll<HTMLElement>(".hero__blob");
  }

  init = (): void => {
    this.#blobs.forEach((blob, i) => {
      // Independent float per blob
      gsap.to(blob, {
        x: i % 2 === 0 ? 40 : -40,
        y: i === 1 ? 60 : -50,
        scale: 1 + i * 0.05,
        duration: 6 + i * 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.8,
      });

      // Slow rotation layered on top
      gsap.to(blob, {
        rotation: i % 2 === 0 ? 20 : -20,
        duration: 10 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "none",
      });
    });
  };
}
