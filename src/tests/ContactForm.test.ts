import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { batch: vi.fn() } }));

import { ContactForm } from "../controllers/ContactForm";

// ── Helpers ──────────────────────────────────────────────────────────────────

const buildDOM = () => {
  document.body.innerHTML = `
    <form id="contactForm" novalidate>
      <div class="form-group">
        <input  type="text"  id="fieldName"    name="name" />
        <span   id="nameError"></span>
      </div>
      <div class="form-group">
        <input  type="email" id="fieldEmail"   name="email" />
        <span   id="emailError"></span>
      </div>
      <div class="form-group">
        <input  type="text"  id="fieldSubject" name="subject" />
        <span   id="subjectError"></span>
      </div>
      <div class="form-group">
        <textarea             id="fieldMessage" name="message"></textarea>
        <span   id="messageError"></span>
      </div>
      <button type="submit" id="submitBtn">
        <span class="btn__text">Send Message</span>
      </button>
    </form>
  `;
};

/** Fill all required fields with valid values. */
const fillValidForm = () => {
  (document.getElementById("fieldName") as HTMLInputElement).value =
    "Patrick Ksor";
  (document.getElementById("fieldEmail") as HTMLInputElement).value =
    "patrick@example.com";
  (document.getElementById("fieldMessage") as HTMLTextAreaElement).value =
    "Hello, this is a test message.";
};

/** Fire a `blur` event on a field to trigger validation. */
const blur = (id: string) =>
  document.getElementById(id)!.dispatchEvent(new Event("blur"));

/** Fire an `input` event on a field. */
const input = (id: string) =>
  document.getElementById(id)!.dispatchEvent(new Event("input"));

/** Error text for a given error element. */
const errorText = (id: string) => document.getElementById(id)!.textContent;

/** Whether an error element is visible. */
const isVisible = (id: string) =>
  document.getElementById(id)!.classList.contains("visible");

// ── Tests ────────────────────────────────────────────────────────────────────

describe("ContactForm", () => {
  beforeEach(() => {
    buildDOM();
    vi.useFakeTimers();
  });

  // ── Name validation ───────────────────────────────────────────────────────

  describe("name field validation", () => {
    it('shows "Name is required." when name is empty on blur', () => {
      const form = new ContactForm();
      form.init();

      blur("fieldName");

      expect(errorText("nameError")).toBe("Name is required.");
      expect(isVisible("nameError")).toBe(true);
    });

    it("shows length error when name is a single character", () => {
      const form = new ContactForm();
      form.init();

      (document.getElementById("fieldName") as HTMLInputElement).value = "P";
      blur("fieldName");

      expect(errorText("nameError")).toBe(
        "Name must be at least 2 characters.",
      );
    });

    it("clears the error when a valid name is entered", () => {
      const form = new ContactForm();
      form.init();

      const field = document.getElementById("fieldName") as HTMLInputElement;

      // First trigger an error
      blur("fieldName");
      expect(isVisible("nameError")).toBe(true);

      // Now fix it
      field.value = "Patrick";
      blur("fieldName");

      expect(errorText("nameError")).toBe("");
      expect(isVisible("nameError")).toBe(false);
      expect(field.classList.contains("has-error")).toBe(false);
    });

    it("clears error on input once field becomes valid", () => {
      const form = new ContactForm();
      form.init();

      const field = document.getElementById("fieldName") as HTMLInputElement;
      blur("fieldName"); // trigger error
      field.classList.add("has-error");

      field.value = "Patrick Ksor";
      input("fieldName");

      expect(errorText("nameError")).toBe("");
    });
  });

  // ── Email validation ───────────────────────────────────────────────────────

  describe("email field validation", () => {
    it('shows "Email is required." when email is empty on blur', () => {
      const form = new ContactForm();
      form.init();

      blur("fieldEmail");

      expect(errorText("emailError")).toBe("Email is required.");
      expect(isVisible("emailError")).toBe(true);
    });

    it.each([
      "notanemail",
      "missing@tld",
      "@nodomain.com",
      "spaces in@email.com",
    ])('flags "%s" as an invalid email', (value) => {
      const form = new ContactForm();
      form.init();

      (document.getElementById("fieldEmail") as HTMLInputElement).value = value;
      blur("fieldEmail");

      expect(errorText("emailError")).toBe(
        "Please enter a valid email address.",
      );
    });

    it.each(["user@example.com", "pat.ksor+tag@subdomain.co.uk", "a@b.io"])(
      'accepts "%s" as a valid email',
      (value) => {
        const form = new ContactForm();
        form.init();

        (document.getElementById("fieldEmail") as HTMLInputElement).value =
          value;
        blur("fieldEmail");

        expect(errorText("emailError")).toBe("");
      },
    );
  });

  // ── Message validation ───────────────────────────────────────────────────

  describe("message field validation", () => {
    it('shows "Message is required." when message is empty', () => {
      const form = new ContactForm();
      form.init();

      blur("fieldMessage");

      expect(errorText("messageError")).toBe("Message is required.");
    });

    it("shows length error when message is fewer than 10 characters", () => {
      const form = new ContactForm();
      form.init();

      (document.getElementById("fieldMessage") as HTMLTextAreaElement).value =
        "Short";
      blur("fieldMessage");

      expect(errorText("messageError")).toBe(
        "Message must be at least 10 characters.",
      );
    });

    it("clears the error when a valid message is entered", () => {
      const form = new ContactForm();
      form.init();

      const field = document.getElementById(
        "fieldMessage",
      ) as HTMLTextAreaElement;
      blur("fieldMessage");

      field.value = "This is a valid message.";
      blur("fieldMessage");

      expect(errorText("messageError")).toBe("");
      expect(isVisible("messageError")).toBe(false);
    });
  });

  // ── Subject validation ────────────────────────────────────────────────────

  describe("subject field validation", () => {
    it("never shows an error for subject (it is optional)", () => {
      const form = new ContactForm();
      form.init();

      // Blur with empty value
      blur("fieldSubject");

      expect(errorText("subjectError")).toBe("");
      expect(isVisible("subjectError")).toBe(false);
    });
  });

  // ── Form submission ───────────────────────────────────────────────────────

  describe("form submission", () => {
    it("does NOT dispatch form:success when the form is invalid", () => {
      const form = new ContactForm();
      form.init();

      const handler = vi.fn();
      document
        .getElementById("contactForm")!
        .addEventListener("form:success", handler);

      document
        .getElementById("contactForm")!
        .dispatchEvent(
          new SubmitEvent("submit", { bubbles: true, cancelable: true }),
        );

      vi.runAllTimers();
      expect(handler).not.toHaveBeenCalled();
    });

    it('disables the submit button and shows "Sending…" while loading', () => {
      const form = new ContactForm();
      form.init();

      fillValidForm();

      document
        .getElementById("contactForm")!
        .dispatchEvent(
          new SubmitEvent("submit", { bubbles: true, cancelable: true }),
        );

      const btn = document.getElementById("submitBtn") as HTMLButtonElement;
      const btnText = btn.querySelector<HTMLElement>(".btn__text")!;

      expect(btn.disabled).toBe(true);
      expect(btn.classList.contains("btn--loading")).toBe(true);
      expect(btnText.textContent).toBe("Sending…");
    });

    it("dispatches form:success event after the simulated delay", () => {
      const form = new ContactForm();
      form.init();

      fillValidForm();

      const handler = vi.fn();
      document
        .getElementById("contactForm")!
        .addEventListener("form:success", handler);

      document
        .getElementById("contactForm")!
        .dispatchEvent(
          new SubmitEvent("submit", { bubbles: true, cancelable: true }),
        );

      expect(handler).not.toHaveBeenCalled(); // not yet

      vi.advanceTimersByTime(1800);
      expect(handler).toHaveBeenCalledOnce();
    });

    it('shows "Sent ✓" and adds btn--success class after success', () => {
      const form = new ContactForm();
      form.init();

      fillValidForm();

      document
        .getElementById("contactForm")!
        .dispatchEvent(
          new SubmitEvent("submit", { bubbles: true, cancelable: true }),
        );

      vi.advanceTimersByTime(1800);

      const btn = document.getElementById("submitBtn") as HTMLButtonElement;
      const btnText = btn.querySelector<HTMLElement>(".btn__text")!;

      expect(btnText.textContent).toBe("Sent ✓");
      expect(btn.classList.contains("btn--success")).toBe(true);
    });

    it("resets the form to its original state after 4 s", () => {
      const form = new ContactForm();
      form.init();

      fillValidForm();

      document
        .getElementById("contactForm")!
        .dispatchEvent(
          new SubmitEvent("submit", { bubbles: true, cancelable: true }),
        );

      vi.advanceTimersByTime(1800 + 4000);

      const btn = document.getElementById("submitBtn") as HTMLButtonElement;
      const btnText = btn.querySelector<HTMLElement>(".btn__text")!;

      expect(btn.disabled).toBe(false);
      expect(btn.classList.contains("btn--success")).toBe(false);
      expect(btnText.textContent).toBe("Send Message");
    });

    it("marks all invalid required fields when submitting empty", () => {
      const form = new ContactForm();
      form.init();

      document
        .getElementById("contactForm")!
        .dispatchEvent(
          new SubmitEvent("submit", { bubbles: true, cancelable: true }),
        );

      expect(isVisible("nameError")).toBe(true);
      expect(isVisible("emailError")).toBe(true);
      expect(isVisible("messageError")).toBe(true);
      // subject is optional — must remain clear
      expect(isVisible("subjectError")).toBe(false);
    });
  });

  // ── has-error class ───────────────────────────────────────────────────────

  describe("has-error class", () => {
    it("adds has-error to a field when validation fails", () => {
      const form = new ContactForm();
      form.init();

      blur("fieldName");

      expect(
        document.getElementById("fieldName")!.classList.contains("has-error"),
      ).toBe(true);
    });

    it("removes has-error from a field when validation passes", () => {
      const form = new ContactForm();
      form.init();

      const field = document.getElementById("fieldName") as HTMLInputElement;
      blur("fieldName"); // add error

      field.value = "Valid Name";
      blur("fieldName"); // clear error

      expect(field.classList.contains("has-error")).toBe(false);
    });
  });
});
