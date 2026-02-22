/**
 * Footer
 * Injects the current year into #footerYear.
 */
export class Footer {
  readonly #yearEl: HTMLElement;

  constructor() {
    this.#yearEl = document.getElementById("footerYear") as HTMLElement;
  }

  init = (): void => {
    this.#yearEl.textContent = new Date().getFullYear().toString();
  };
}
