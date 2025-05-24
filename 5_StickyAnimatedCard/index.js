import {clamp, mapRange} from "https://jacques-herrmann.github.io/_hacked/utils/math.js";

const parent = document.querySelector('.sticky-animated-card');
const inner = document.querySelector('.sticky-animated-card__inner');
const left = document.querySelector('.sticky-animated-card__column--left');
const right = document.querySelector('.sticky-animated-card__column--right');
const image = document.querySelector('.sticky-animated-card__image');

let height, bounds


class AnimationSteps {
    constructor(left, right) {
        this.left = left;
        this.right = right;

        this.leftTitle = left.querySelector('.sticky-animated-card__title');

        this.tl = gsap.timeline({paused: true});
        this.initLeft();
        this.initRight();
        this.tl.time(0)
    }

    initLeft() {
        this.tl.fromTo(this.left, {opacity: 0}, {
            opacity: 1,
            duration: 0.4,
        }, 0)
        this.tl.fromTo(this.left, {y: 450}, {
            y: 0,
            duration: 0.4,
        }, 0)
        this.tl.to(this.leftTitle, {
            opacity: 0,
            y: -40,
            duration: 0.3,
        }, 0.5)
        this.tl.to(this.left, {
            height: 75,
            duration: 0.4,
        }, 0.6)

    }

    initRight() {
        this.tl.fromTo(this.right, {opacity: 0}, {
            opacity: 1,
            duration: 0.4,
        }, 0)
        this.tl.fromTo(this.right, {y: 700}, {
            y: 100,
            duration: 0.4,
        }, 0)
        this.tl.to(this.right, {
            y: -50,
            duration: 0.3,
        }, 0.7)
        this.tl.to(this.right, {
            opacity: 0,
            duration: 0.3,
        }, 0.7)
    }

    update(percent) {
        this.tl.time(percent);
    }
}


const leftCards = Array.from(left.querySelectorAll('.sticky-animated-card__card'));
const rightCards = Array.from(right.querySelectorAll('.sticky-animated-card__card'));
const cards = [...leftCards].map((left) => {
    return new AnimationSteps(left, rightCards[leftCards.indexOf(left)]);
})

const onResize = () => {
    height = 5 * window.innerHeight;
    bounds = inner.getBoundingClientRect();
    parent.style.height = `${height}px`;
}

const onScroll = (ev) => {
    const percent = clamp(mapRange(window.scrollY, bounds.top, height - window.innerHeight, 0, 1), 0, 1)
    cards.forEach((card, i) => {
        card.update(clamp(mapRange(percent, i / cards.length, (i + 1) / cards.length, 0, 1), 0, 1));
    })
}

const lenis = new Lenis({
    autoRaf: true,
});

onResize()
window.addEventListener('resize', onResize);
window.addEventListener('scroll', onScroll);
