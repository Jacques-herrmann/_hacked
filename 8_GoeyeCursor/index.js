import {lerp} from "https://jacques-herrmann.github.io/_hacked/utils/math.js";

const cursor = document.querySelector('.cursor');
// const inner = document.querySelector('.cursor__inner');
// const circle = document.querySelector('.cursor__inner--circle');
const dot = document.querySelector('.cursor__inner--dot');

const state = {
    scale: 1,
    lastScale: 1,
    opacity: 1,
    cursor: {x: 0, y: 0},
    lastCursor: {x: 0, y: 0},
}

const L = 0.15
const D = 5
const dots = []

const init = () => {
    for (let i = 0; i < D; i++) {
        const dot = document.createElement('div');
        dot.classList.add('cursor__inner--dot');
        dot.classList.add('cursor__inner');
        dot.style.opacity = 0;
        dot.style.transform = `scale(${1 - i * 0.1})`;
        cursor.appendChild(dot);
        dots.push(dot);
    }
}

const onMouseMove = (e) => {
    state.cursor.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    state.cursor.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
}

const tick = () => {
    requestAnimationFrame(tick);

    state.lastCursor.x = lerp(state.lastCursor.x, state.cursor.x, L);
    state.lastCursor.y = lerp(state.lastCursor.y, state.cursor.y, L);

    gsap.set(dot, {
        x: state.lastCursor.x,
        y: state.lastCursor.y,
        scale: state.lastScale,
        opacity: state.opacity,
        xPercent: -50,
        yPercent: -50,
    })

    dots.forEach((dot, i) => {
        const x = lerp(state.lastCursor.x, state.cursor.x, L + 0.06 * i);
        const y = lerp(state.lastCursor.y, state.cursor.y, L + 0.06 * i);
        const scale = 1 - i * 0.1;
        const opacity = 1 - i * 0.15;

        gsap.set(dot, {
            x: x,
            y: y,
            opacity: opacity,
            scale: scale,
            xPercent: -50,
            yPercent: -50,
        });
    });

}

init()
document.body.addEventListener('mousemove', onMouseMove);
tick();