const btn = document.querySelector(".encrypt-button")
const text = document.querySelector(".encrypt-button__text")
const scan = document.querySelector(".encrypt-button__scan")

const CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?'
const TEXT = 'ENCRYPT'
const SHUFFLE_TIME = 60
const TIME = 140

let shuffleInterval = null
let textInterval = null
let i = 0

const tl = gsap.timeline({paused: true, repeat: -1, yoyo: true})
tl.fromTo(scan, {top: '-70%'}, {
    top: '70%',
    duration: 0.75,
    ease: 'linear',
})

const shuffle = () => {
    let fixedPart = TEXT.split('').slice(0, i)
    let replacedPart = TEXT.split('').slice(i)
    let remaining = CHAR
    const replaced = replacedPart.map((c, i) => {
        if (c === ' ') {
            return ' '
        }

        const char = remaining[Math.floor(Math.random() * remaining.length)]
        remaining = remaining.replace(char, '')
        return char
    })

    text.innerHTML = [...fixedPart, ...replaced,].join('')

    if (i <= TEXT.length - 1) {
        shuffleInterval = setTimeout(() => {
            shuffle()
        }, SHUFFLE_TIME)
    }
}

const replaceText = () => {
    i++
    if (i <= TEXT.length - 1) {
        textInterval = setTimeout(() => {
            replaceText()
        }, TIME)
    }
}

const reset = () => {
    tl.pause(0)
    clearInterval(shuffleInterval)
    clearTimeout(textInterval)
    text.innerHTML = TEXT.toUpperCase()
    i = 0
}

const onMouseEnter = () => {
    shuffle()
    replaceText()
    gsap.to(scan, {
        opacity: 1,
        duration: 0.2,
    })
    tl.play(0)
}

const onMouseLeave = () => {
    reset()
    gsap.to(scan, {
        opacity: 0,
        duration: 0.2,
    })
}

btn.addEventListener('mouseenter', onMouseEnter)
btn.addEventListener('mouseleave', onMouseLeave)