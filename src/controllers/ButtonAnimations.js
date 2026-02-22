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
var _ButtonAnimations_buttons, _ButtonAnimations_onEnter, _ButtonAnimations_onLeave, _ButtonAnimations_onPress, _ButtonAnimations_onRelease;
import gsap from 'gsap';
/**
 * ButtonAnimations
 * Attaches GSAP scale micro-animations to every .btn element.
 * Arrow methods ensure correct `this` binding when used as listeners.
 */
export class ButtonAnimations {
    constructor() {
        _ButtonAnimations_buttons.set(this, void 0);
        Object.defineProperty(this, "init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                __classPrivateFieldGet(this, _ButtonAnimations_buttons, "f").forEach(btn => {
                    btn.addEventListener('mouseenter', __classPrivateFieldGet(this, _ButtonAnimations_onEnter, "f"));
                    btn.addEventListener('mouseleave', __classPrivateFieldGet(this, _ButtonAnimations_onLeave, "f"));
                    btn.addEventListener('mousedown', __classPrivateFieldGet(this, _ButtonAnimations_onPress, "f"));
                    btn.addEventListener('mouseup', __classPrivateFieldGet(this, _ButtonAnimations_onRelease, "f"));
                });
            }
        });
        // ── Private ──────────────────────────────────────────────────────────────
        _ButtonAnimations_onEnter.set(this, (e) => {
            gsap.to(e.currentTarget, {
                scale: 1.05,
                duration: 0.25,
                ease: 'power2.out',
            });
        });
        _ButtonAnimations_onLeave.set(this, (e) => {
            gsap.to(e.currentTarget, {
                scale: 1,
                duration: 0.35,
                ease: 'elastic.out(1, 0.5)',
            });
        });
        _ButtonAnimations_onPress.set(this, (e) => {
            gsap.to(e.currentTarget, {
                scale: 0.96,
                duration: 0.1,
                ease: 'power2.in',
            });
        });
        _ButtonAnimations_onRelease.set(this, (e) => {
            gsap.to(e.currentTarget, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power2.out',
            });
        });
        __classPrivateFieldSet(this, _ButtonAnimations_buttons, document.querySelectorAll('.btn'), "f");
    }
}
_ButtonAnimations_buttons = new WeakMap(), _ButtonAnimations_onEnter = new WeakMap(), _ButtonAnimations_onLeave = new WeakMap(), _ButtonAnimations_onPress = new WeakMap(), _ButtonAnimations_onRelease = new WeakMap();
