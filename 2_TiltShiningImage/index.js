import {lerp} from "../utils/math";

const card = document.querySelector('.reflecting-card__card')
const reflect = document.querySelector('.reflecting-card__reflect')

const L = 0.08
const MAX = 40
const target = {x: 0, y: 0}
const current = {x: 0, y: 0}

const onMouseMove = (ev) => {
    const rect = card.getBoundingClientRect();
    target.x = ((ev.clientX - rect.left) / rect.width) - 0.5;
    target.y = ((ev.clientY - rect.top) / rect.height) - 0.5;
}

const onMouseLeave = () => {
    target.x = 0
    target.y = 0
}

const tick = () => {
    requestAnimationFrame(tick)

    current.x = lerp(current.x, target.x, L)
    current.y = lerp(current.y, target.y, L)

    card.style.transform = `translate(-50%, -50%) rotateX(${-MAX * current.y}deg) rotateY(${MAX * current.x}deg)`
    reflect.style.opacity = 0.5 * Math.abs(current.x)
}

card.addEventListener('mousemove', onMouseMove)
card.addEventListener('mouseleave', onMouseLeave)
tick()