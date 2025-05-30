gsap.registerPlugin(ScrollTrigger)

const scrollingText = document.querySelector('.scrolling-text');
const container = document.querySelector('.scrolling-text__container');
const text1 = document.querySelector('.scrolling-text__text-1');
const text2 = document.querySelector('.scrolling-text__text-2');

document.fonts.ready.then(() => {
    gsap.to(text1.children, {
        x: '-100%',
        ease: 'none',
        duration: 4,
        repeat: -1
    })
    gsap.from(text2.children, {
        x: '-100%',
        ease: 'none',
        duration: 4,
        repeat: -1,
    })
})

const onMouseEnter = (e) => {
    gsap.to(text1.children, {
        y: '-100%',
        ease: 'power1.inOut',
        duration: 0.2,
    });
    gsap.to(text2.children, {
        y: '0',
        ease: 'power1.inOut',
        duration: 0.2,
    });
}
const onMouseLeave = (e) => {
    gsap.to(text1.children, {
        y: '0',
        ease: 'power1.inOut',
        duration: 0.2,
    });
    gsap.to(text2.children, {
        y: '100%',
        ease: 'power1.inOut',
        duration: 0.2,
    });
}

container.addEventListener('mouseenter', onMouseEnter);
container.addEventListener('mouseleave', onMouseLeave);