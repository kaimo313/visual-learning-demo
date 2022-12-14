import { Timing } from './timing.js';
// Animator 类，用来真正控制动画过程
export class Animator {
    constructor({ duration, iterations, easing }) {
        this.timing = { duration, iterations, easing };
    }

    animate(target, update) {
        let frameIndex = 0;
        const timing = new Timing(this.timing);

        return new Promise((resolve) => {
            function next() {
                if (update({ target, frameIndex, timing }) !== false && !timing.isFinished) {
                    requestAnimationFrame(next);
                } else {
                    resolve(timing);
                }
                frameIndex++;
            }
            next();
        });
    }
}