gsap.registerPlugin(CSSRulePlugin);

const btn = document.querySelector(".punch-button__inner")
const inner = document.querySelector('.punch-button__inner-front')
const shadow = CSSRulePlugin.getRule(".punch-button__inner-front:after");
const hit = CSSRulePlugin.getRule(".punch-button__base:after");

const tl = gsap.timeline({paused: true})


const init = () => {
    tl.to(inner, {
        duration: 0.25,
        transform: 'translate(0, 0)',
        ease: 'power2.inOut',
    }, 0)
    tl.to(shadow, {
        duration: 0.25,
        cssRule: {
            left: "30px"
        },
        ease: 'power2.inOut',
    }, 0)
    tl.to(inner, {
        duration: 0.25,
        transform: 'translate(0, -6px)',
        ease: 'power2.inOut',
    }, 0.25)
    tl.to(shadow, {
        duration: 0.25,
        cssRule: {
            left: 0
        },
        ease: 'power2.inOut',
    }, 0.25)
    tl.set(hit, {
        cssRule: {
            opacity: 1,
            height: '100%',
            width: '100%'
        }
    }, 0.05)
    tl.to(hit, {
        duration: 0.95,
        cssRule: {
            height: 'calc(100% + 40px)',
            width: 'calc(100% + 40px)'
        },
        ease: 'power2.out',
    }, 0.05)
    tl.to(hit, {
        duration: 1.5,
        cssRule: {
            opacity: 0
        },
        ease: 'power2.out',
    }, 0.15)
}

const onClick = () => {
    tl.play(0)
}

init()
btn.addEventListener('click', onClick)