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
var _BlobAnimation_blobs;
import gsap from 'gsap';
/**
 * BlobAnimation
 * Animates the three hero background blobs with independent
 * yoyo loops creating a subtle, organic floating effect.
 */
export class BlobAnimation {
    constructor() {
        _BlobAnimation_blobs.set(this, void 0);
        Object.defineProperty(this, "init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                __classPrivateFieldGet(this, _BlobAnimation_blobs, "f").forEach((blob, i) => {
                    // Independent float per blob
                    gsap.to(blob, {
                        x: i % 2 === 0 ? 40 : -40,
                        y: i === 1 ? 60 : -50,
                        scale: 1 + i * 0.05,
                        duration: 6 + i * 1.5,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                        delay: i * 0.8,
                    });
                    // Slow rotation layered on top
                    gsap.to(blob, {
                        rotation: i % 2 === 0 ? 20 : -20,
                        duration: 10 + i * 2,
                        repeat: -1,
                        yoyo: true,
                        ease: 'none',
                    });
                });
            }
        });
        __classPrivateFieldSet(this, _BlobAnimation_blobs, document.querySelectorAll('.hero__blob'), "f");
    }
}
_BlobAnimation_blobs = new WeakMap();
