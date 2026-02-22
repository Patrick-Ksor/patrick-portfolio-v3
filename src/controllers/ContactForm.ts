import gsap from "gsap";

type FieldKey = "name" | "email" | "subject" | "message";

interface FormFields {
  name: HTMLInputElement;
  email: HTMLInputElement;
  subject: HTMLInputElement;
  message: HTMLTextAreaElement;
}

interface FormErrors {
  name: HTMLElement;
  email: HTMLElement;
  subject: HTMLElement;
  message: HTMLElement;
}

/**
 * ContactForm
 * Handles: live blur validation, shake on invalid submit,
 * loading/success button states, and a custom `form:success`
 * event for future analytics hooks.
 */
export class ContactForm {
  readonly #form: HTMLFormElement;
  readonly #submitBtn: HTMLButtonElement;
  readonly #fields: FormFields;
  readonly #errors: FormErrors;

  readonly #EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor() {
    this.#form = document.getElementById("contactForm") as HTMLFormElement;
    this.#submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;

    this.#fields = {
      name: document.getElementById("fieldName") as HTMLInputElement,
      email: document.getElementById("fieldEmail") as HTMLInputElement,
      subject: document.getElementById("fieldSubject") as HTMLInputElement,
      message: document.getElementById("fieldMessage") as HTMLTextAreaElement,
    };

    this.#errors = {
      name: document.getElementById("nameError") as HTMLElement,
      email: document.getElementById("emailError") as HTMLElement,
      subject: document.getElementById("subjectError") as HTMLElement,
      message: document.getElementById("messageError") as HTMLElement,
    };
  }

  init = (): void => {
    this.#bindFieldValidation();
    this.#form.addEventListener("submit", this.#handleSubmit);
  };

  // ── Private ──────────────────────────────────────────────────────────────

  /** Attach blur + input listeners to each field for live feedback. */
  #bindFieldValidation = (): void => {
    (Object.keys(this.#fields) as FieldKey[]).forEach((key) => {
      const field = this.#fields[key];

      // Validate on blur
      field.addEventListener("blur", () => this.#validateField(key));

      // Clear error as soon as field becomes valid while typing
      field.addEventListener("input", () => {
        if (field.classList.contains("has-error")) {
          this.#validateField(key);
        }
      });
    });
  };

  /** Returns true when the field passes validation. */
  #validateField = (key: FieldKey): boolean => {
    const field = this.#fields[key];
    const value = field.value.trim();
    let message = "";

    switch (key) {
      case "name":
        if (!value) message = "Name is required.";
        else if (value.length < 2)
          message = "Name must be at least 2 characters.";
        break;

      case "email":
        if (!value) message = "Email is required.";
        else if (!this.#EMAIL_RE.test(value))
          message = "Please enter a valid email address.";
        break;

      case "message":
        if (!value) message = "Message is required.";
        else if (value.length < 10)
          message = "Message must be at least 10 characters.";
        break;

      case "subject":
        // Optional — no validation rule
        break;
    }

    this.#setFieldState(field, this.#errors[key], message);
    return message === "";
  };

  #setFieldState = (
    field: HTMLElement,
    errorEl: HTMLElement,
    message: string,
  ): void => {
    if (message) {
      errorEl.textContent = message;
      errorEl.classList.add("visible");
      field.classList.add("has-error");
    } else {
      errorEl.textContent = "";
      errorEl.classList.remove("visible");
      field.classList.remove("has-error");
    }
  };

  /** Validate all required fields, returns true if all pass. */
  #validateAll = (): boolean =>
    (["name", "email", "message"] as FieldKey[])
      .map((key) => this.#validateField(key))
      .every(Boolean);

  #handleSubmit = (e: SubmitEvent): void => {
    e.preventDefault();

    if (!this.#validateAll()) {
      this.#shakeForm();
      return;
    }

    this.#setLoadingState();

    // Simulate async submission — replace with fetch() / Formspree / EmailJS
    setTimeout(this.#setSuccessState, 1800);
  };

  #shakeForm = (): void => {
    gsap.fromTo(
      this.#form,
      { x: -8 },
      { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" },
    );
  };

  #setLoadingState = (): void => {
    const textEl = this.#submitBtn.querySelector<HTMLElement>(".btn__text");
    if (textEl) textEl.textContent = "Sending…";
    this.#submitBtn.disabled = true;
    this.#submitBtn.classList.add("btn--loading");
  };

  #setSuccessState = (): void => {
    const textEl = this.#submitBtn.querySelector<HTMLElement>(".btn__text");
    if (textEl) textEl.textContent = "Sent ✓";
    this.#submitBtn.classList.remove("btn--loading");
    this.#submitBtn.classList.add("btn--success");

    // Dispatch event for analytics / side-effect hooks
    this.#form.dispatchEvent(
      new CustomEvent("form:success", { bubbles: true }),
    );

    setTimeout(this.#resetForm, 4000);
  };

  #resetForm = (): void => {
    this.#form.reset();
    this.#submitBtn.disabled = false;
    this.#submitBtn.classList.remove("btn--success");

    const textEl = this.#submitBtn.querySelector<HTMLElement>(".btn__text");
    if (textEl) textEl.textContent = "Send Message";

    (Object.keys(this.#fields) as FieldKey[]).forEach((key) => {
      this.#fields[key].classList.remove("has-error");
      this.#errors[key].textContent = "";
      this.#errors[key].classList.remove("visible");
    });
  };
}
