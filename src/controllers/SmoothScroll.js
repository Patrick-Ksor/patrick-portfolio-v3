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
var _SmoothScroll_nav, _SmoothScroll_anchors, _SmoothScroll_handleClick;
/**
 * SmoothScroll
 * Intercepts all [href^="#"] anchor clicks and scrolls to the
 * target with a nav-height offset. Receives NavController as a
 * dependency to read the live nav height without a raw DOM query.
 */
export class SmoothScroll {
    constructor(nav) {
        _SmoothScroll_nav.set(this, void 0);
        _SmoothScroll_anchors.set(this, void 0);
        Object.defineProperty(this, "init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                __classPrivateFieldGet(this, _SmoothScroll_anchors, "f").forEach((anchor) => anchor.addEventListener("click", __classPrivateFieldGet(this, _SmoothScroll_handleClick, "f")));
            }
        });
        // ── Private ──────────────────────────────────────────────────────────────
        _SmoothScroll_handleClick.set(this, (e) => {
            const anchor = e.currentTarget;
            const href = anchor.getAttribute("href");
            if (!href || href === "#")
                return;
            const target = document.querySelector(href);
            if (!target)
                return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top +
                window.scrollY -
                __classPrivateFieldGet(this, _SmoothScroll_nav, "f").getHeight();
            window.scrollTo({ top, behavior: "smooth" });
        });
        __classPrivateFieldSet(this, _SmoothScroll_nav, nav, "f");
        __classPrivateFieldSet(this, _SmoothScroll_anchors, document.querySelectorAll('a[href^="#"]'), "f");
    }
}
_SmoothScroll_nav = new WeakMap(), _SmoothScroll_anchors = new WeakMap(), _SmoothScroll_handleClick = new WeakMap();
