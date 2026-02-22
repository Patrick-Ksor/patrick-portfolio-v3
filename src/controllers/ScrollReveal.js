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
var _ScrollReveal_elements, _ScrollReveal_getFrom;
import gsap from "gsap";
/**
 * ScrollReveal
 * Reads [data-reveal] attributes and creates a ScrollTrigger
 * fromTo animation for each matching element.
 */
export class ScrollReveal {
    constructor() {
        _ScrollReveal_elements.set(this, void 0);
        Object.defineProperty(this, "init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                __classPrivateFieldGet(this, _ScrollReveal_elements, "f").forEach((el) => {
                    const direction = (el.dataset["reveal"] ?? "up");
                    const from = __classPrivateFieldGet(this, _ScrollReveal_getFrom, "f").call(this, direction);
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
            }
        });
        // ── Private ──────────────────────────────────────────────────────────────
        _ScrollReveal_getFrom.set(this, (direction) => {
            const base = { opacity: 0, x: 0, y: 0 };
            const offsets = {
                up: { y: 60 },
                left: { x: -60 },
                right: { x: 60 },
            };
            return { ...base, ...offsets[direction] };
        });
        __classPrivateFieldSet(this, _ScrollReveal_elements, document.querySelectorAll("[data-reveal]"), "f");
    }
}
_ScrollReveal_elements = new WeakMap(), _ScrollReveal_getFrom = new WeakMap();
