import {lerp} from "https://jacques-herrmann.github.io/_hacked/utils/math.js";

const cursor = document.querySelector('.cursor');
const inner = document.querySelector('.cursor__inner');
const circle = document.querySelector('.cursor__inner--circle');
const dot = document.querySelector('.cursor__inner--dot');
const hoverItems = document.querySelectorAll('[data-hover]');

const state = {
    scale: 1,
    lastScale: 1,
    opacity: 1,
    cursor: {x: 0, y: 0},
    lastCursor: {x: 0, y: 0},
}

const L = 0.15
const D = 8
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

const onHover = (e) => {
    const filter = e.target.dataset.hover;
    gsap.to(circle, {
        duration: 0.5,
        r: 30,
        ease: 'elastic.out(1, 0.3)',
    });

    let primitive, timeline

    switch (filter) {
        case 'filter':
            primitive = {turbulence: 0};
            timeline = gsap.timeline({
                onStart: () => {
                    circle ? (circle.style.filter = `url(#filter)`) : null;
                },
                onUpdate: () => {
                    const filter = document.querySelector("#filter > feTurbulence");
                    filter
                        ? filter.setAttribute(
                            "baseFrequency",
                            primitive.turbulence.toString()
                        )
                        : null;
                },
                onComplete: () => {
                    circle ? (circle.style.filter = "none") : null;
                },
            })
                .to(primitive, {
                    duration: 0.5,
                    ease: "steps(10)",
                    startAt: {turbulence: 0.08},
                    turbulence: 0,
                });
            break;
        case 'filter-2':
            primitive = {scale: 0};
            timeline = gsap.timeline({
                onStart: () => {
                    circle ? (circle.style.filter = `url(#filter2)`) : null;
                },
                onUpdate: () => {
                    const filter = document.querySelector("#filter2 > feDisplacementMap");
                    filter
                        ? filter.setAttribute("scale", primitive.scale.toString())
                        : null;
                },
                onComplete: () => {
                    circle ? (circle.style.filter = "none") : null;
                },
            })
                .to(primitive, {
                    duration: 0.2,
                    ease: "Expo.easeOut",
                    startAt: {scale: 8},
                    scale: 55,
                })
                .to(primitive, {
                    duration: 0.4,
                    ease: "Back.easeOut",
                    scale: 0,
                });
            break;
        case 'filter-3':
            primitive = {turbulence: 0};
            timeline = gsap.timeline({
                onStart: () => {
                    circle ? (circle.style.filter = `url(#filter3)`) : null;
                },
                onUpdate: () => {
                    const filter = document.querySelector("#filter3 > feTurbulence");
                    filter
                        ? filter.setAttribute(
                            "baseFrequency",
                            primitive.turbulence.toString()
                        )
                        : null;
                },
                onComplete: () => {
                    circle ? (circle.style.filter = "none") : null;
                },
            })
                .to(primitive, {
                    duration: 0.35,
                    startAt: {turbulence: 0.08},
                    turbulence: 1,
                });
    }
}

const onHoverOut = () => {
    gsap.to(circle, {
        duration: 0.15,
        r: 0,
        ease: 'linear',
    });
}

const tick = () => {
    requestAnimationFrame(tick);

    state.lastCursor.x = lerp(state.lastCursor.x, state.cursor.x, L);
    state.lastCursor.y = lerp(state.lastCursor.y, state.cursor.y, L);

    gsap.set(dot, {
        x: state.lastCursor.x,
        y: state.lastCursor.y,
        xPercent: -50,
        yPercent: -50,
    })
    dots.forEach((dot, i) => {
        const factor = Math.pow(0.75, i + 1);
        const x = lerp(state.lastCursor.x, state.cursor.x, L * factor);
        const y = lerp(state.lastCursor.y, state.cursor.y, L * factor);
        const scale = 1 - factor;
        const opacity = 1 - (i + 1) * 0.05;

        gsap.set(dot, {
            x: x,
            y: y,
            opacity: opacity,
            scale: scale,
            xPercent: -50,
            yPercent: -50,
        });
    });

    gsap.set(inner, {
        x: state.lastCursor.x,
        y: state.lastCursor.y,
        xPercent: -50,
        yPercent: -50,
    });

}

init()
document.body.addEventListener('mousemove', onMouseMove);
hoverItems.forEach(item => {
    item.addEventListener('mouseenter', onHover);
    item.addEventListener('mouseleave', onHoverOut);
});
tick();