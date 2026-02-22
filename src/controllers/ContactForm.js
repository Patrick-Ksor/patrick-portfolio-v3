var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ContactForm_form, _ContactForm_submitBtn, _ContactForm_fields, _ContactForm_errors, _ContactForm_EMAIL_RE, _ContactForm_bindFieldValidation, _ContactForm_validateField, _ContactForm_setFieldState, _ContactForm_validateAll, _ContactForm_handleSubmit, _ContactForm_shakeForm, _ContactForm_setLoadingState, _ContactForm_setSuccessState, _ContactForm_resetForm;
import gsap from "gsap";
/**
 * ContactForm
 * Handles: live blur validation, shake on invalid submit,
 * loading/success button states, and a custom `form:success`
 * event for future analytics hooks.
 */
export class ContactForm {
    constructor() {
        _ContactForm_form.set(this, void 0);
        _ContactForm_submitBtn.set(this, void 0);
        _ContactForm_fields.set(this, void 0);
        _ContactForm_errors.set(this, void 0);
        _ContactForm_EMAIL_RE.set(this, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        Object.defineProperty(this, "init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                __classPrivateFieldGet(this, _ContactForm_bindFieldValidation, "f").call(this);
                __classPrivateFieldGet(this, _ContactForm_form, "f").addEventListener("submit", __classPrivateFieldGet(this, _ContactForm_handleSubmit, "f"));
            }
        });
        // ── Private ──────────────────────────────────────────────────────────────
        /** Attach blur + input listeners to each field for live feedback. */
        _ContactForm_bindFieldValidation.set(this, () => {
            Object.keys(__classPrivateFieldGet(this, _ContactForm_fields, "f")).forEach((key) => {
                const field = __classPrivateFieldGet(this, _ContactForm_fields, "f")[key];
                // Validate on blur
                field.addEventListener("blur", () => __classPrivateFieldGet(this, _ContactForm_validateField, "f").call(this, key));
                // Clear error as soon as field becomes valid while typing
                field.addEventListener("input", () => {
                    if (field.classList.contains("has-error")) {
                        __classPrivateFieldGet(this, _ContactForm_validateField, "f").call(this, key);
                    }
                });
            });
        });
        /** Returns true when the field passes validation. */
        _ContactForm_validateField.set(this, (key) => {
            const field = __classPrivateFieldGet(this, _ContactForm_fields, "f")[key];
            const value = field.value.trim();
            let message = "";
            switch (key) {
                case "name":
                    if (!value)
                        message = "Name is required.";
                    else if (value.length < 2)
                        message = "Name must be at least 2 characters.";
                    break;
                case "email":
                    if (!value)
                        message = "Email is required.";
                    else if (!__classPrivateFieldGet(this, _ContactForm_EMAIL_RE, "f").test(value))
                        message = "Please enter a valid email address.";
                    break;
                case "message":
                    if (!value)
                        message = "Message is required.";
                    else if (value.length < 10)
                        message = "Message must be at least 10 characters.";
                    break;
                case "subject":
                    // Optional — no validation rule
                    break;
            }
            __classPrivateFieldGet(this, _ContactForm_setFieldState, "f").call(this, field, __classPrivateFieldGet(this, _ContactForm_errors, "f")[key], message);
            return message === "";
        });
        _ContactForm_setFieldState.set(this, (field, errorEl, message) => {
            if (message) {
                errorEl.textContent = message;
                errorEl.classList.add("visible");
                field.classList.add("has-error");
            }
            else {
                errorEl.textContent = "";
                errorEl.classList.remove("visible");
                field.classList.remove("has-error");
            }
        });
        /** Validate all required fields, returns true if all pass. */
        _ContactForm_validateAll.set(this, () => ["name", "email", "message"]
            .map((key) => __classPrivateFieldGet(this, _ContactForm_validateField, "f").call(this, key))
            .every(Boolean));
        _ContactForm_handleSubmit.set(this, (e) => {
            e.preventDefault();
            if (!__classPrivateFieldGet(this, _ContactForm_validateAll, "f").call(this)) {
                __classPrivateFieldGet(this, _ContactForm_shakeForm, "f").call(this);
                return;
            }
            __classPrivateFieldGet(this, _ContactForm_setLoadingState, "f").call(this);
            // Simulate async submission — replace with fetch() / Formspree / EmailJS
            setTimeout(__classPrivateFieldGet(this, _ContactForm_setSuccessState, "f"), 1800);
        });
        _ContactForm_shakeForm.set(this, () => {
            gsap.fromTo(__classPrivateFieldGet(this, _ContactForm_form, "f"), { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
        _ContactForm_setLoadingState.set(this, () => {
            const textEl = __classPrivateFieldGet(this, _ContactForm_submitBtn, "f").querySelector(".btn__text");
            if (textEl)
                textEl.textContent = "Sending…";
            __classPrivateFieldGet(this, _ContactForm_submitBtn, "f").disabled = true;
            __classPrivateFieldGet(this, _ContactForm_submitBtn, "f").classList.add("btn--loading");
        });
        _ContactForm_setSuccessState.set(this, () => {
            const textEl = __classPrivateFieldGet(this, _ContactForm_submitBtn, "f").querySelector(".btn__text");
            if (textEl)
                textEl.textContent = "Sent ✓";
            __classPrivateFieldGet(this, _ContactForm_submitBtn, "f").classList.remove("btn--loading");
            __classPrivateFieldGet(this, _ContactForm_submitBtn, "f").classList.add("btn--success");
            // Dispatch event for analytics / side-effect hooks
            __classPrivateFieldGet(this, _ContactForm_form, "f").dispatchEvent(new CustomEvent("form:success", { bubbles: true }));
            setTimeout(__classPrivateFieldGet(this, _ContactForm_resetForm, "f"), 4000);
        });
        _ContactForm_resetForm.set(this, () => {
            __classPrivateFieldGet(this, _ContactForm_form, "f").reset();
            __classPrivateFieldGet(this, _ContactForm_submitBtn, "f").disabled = false;
            __classPrivateFieldGet(this, _ContactForm_submitBtn, "f").classList.remove("btn--success");
            const textEl = __classPrivateFieldGet(this, _ContactForm_submitBtn, "f").querySelector(".btn__text");
            if (textEl)
                textEl.textContent = "Send Message";
            Object.keys(__classPrivateFieldGet(this, _ContactForm_fields, "f")).forEach((key) => {
                __classPrivateFieldGet(this, _ContactForm_fields, "f")[key].classList.remove("has-error");
                __classPrivateFieldGet(this, _ContactForm_errors, "f")[key].textContent = "";
                __classPrivateFieldGet(this, _ContactForm_errors, "f")[key].classList.remove("visible");
            });
        });
        __classPrivateFieldSet(this, _ContactForm_form, document.getElementById("contactForm"), "f");
        __classPrivateFieldSet(this, _ContactForm_submitBtn, document.getElementById("submitBtn"), "f");
        __classPrivateFieldSet(this, _ContactForm_fields, {
            name: document.getElementById("fieldName"),
            email: document.getElementById("fieldEmail"),
            subject: document.getElementById("fieldSubject"),
            message: document.getElementById("fieldMessage"),
        }, "f");
        __classPrivateFieldSet(this, _ContactForm_errors, {
            name: document.getElementById("nameError"),
            email: document.getElementById("emailError"),
            subject: document.getElementById("subjectError"),
            message: document.getElementById("messageError"),
        }, "f");
    }
}
_ContactForm_form = new WeakMap(), _ContactForm_submitBtn = new WeakMap(), _ContactForm_fields = new WeakMap(), _ContactForm_errors = new WeakMap(), _ContactForm_EMAIL_RE = new WeakMap(), _ContactForm_bindFieldValidation = new WeakMap(), _ContactForm_validateField = new WeakMap(), _ContactForm_setFieldState = new WeakMap(), _ContactForm_validateAll = new WeakMap(), _ContactForm_handleSubmit = new WeakMap(), _ContactForm_shakeForm = new WeakMap(), _ContactForm_setLoadingState = new WeakMap(), _ContactForm_setSuccessState = new WeakMap(), _ContactForm_resetForm = new WeakMap();
