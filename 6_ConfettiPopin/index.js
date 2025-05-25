import SpriteSheet from 'https://jacques-herrmann.github.io/_hacked/utils/sprite.js'

const sprite = document.querySelector('.popin__sprite')
const inner = document.querySelector('.popin__inner')
const cta = document.querySelector('.popin__cta')
const canvas = document.querySelector('.popin__sprite')

const spritesheet = new SpriteSheet(canvas)

const onReady = () => {
    paper.setup('confetti')
    run()
}

const run = () => {

    const tl = gsap.timeline()
    tl.fromTo(inner, {height: 0}, {
        duration: 0.4,
        height: '360px',
        ease: 'power3.out',
    })
    tl.fromTo(inner.children, {opacity: 0}, {
        duration: 0.5,
        opacity: 1,
        ease: 'linear'
    }, 0.35)

    tl.fromTo(sprite, {scale: 0}, {
        duration: 0.2,
        scale: 1,
        ease: 'linear',
    }, 0.3)

    tl.fromTo(cta, {opacity: 0}, {
        duration: 0.2,
        opacity: 1,
        ease: 'linear'
    }, 0.35)

    spritesheet.play('attack')
    setTimeout(() => {
        throwConfetti()
    }, 500)
}

// Confetti
const COUNT = 100
const S = 5
const V = 10
const confettis = []
const colors = ['#9d52e0', '#7edc8e', '#cc975b']
const shapes = ['circle', 'rectangle', 'square', 'hexagon', 'star']

const createConfetti = (color, shape, position) => {
    const c = {position}
    c.color = new paper.Color(color)
    switch (shape) {
        case 'circle':
            c.shape = new paper.Path.Circle({
                center: [position.x, position.y],
                radius: S,
                fillColor: color
            })
            break
        case 'rectangle':
            c.shape = new paper.Path.Rectangle({
                point: [position.x, position.y],
                size: [S, S * 3],
                fillColor: color
            })
            break
        case 'square':
            c.shape = new paper.Path.Rectangle({
                point: [position.x, position.y],
                size: [S, S],
                fillColor: color
            })
            break
        case 'hexagon':
            c.shape = new paper.Path.RegularPolygon({
                center: [position.x, position.y],
                sides: 6,
                radius: S,
                fillColor: color
            })
            break
        case 'star':
            c.shape = new paper.Path.Star({
                center: [position.x, position.y],
                points: 5,
                radius1: S,
                radius2: S / 2,
                fillColor: color
            })
            break
    }

    c.shape.rotate(Math.random() * 360)
    c.velocity = new paper.Point(Math.random() * V - V / 2, -Math.random() * V)
    c.rotation = Math.random() * 5
    c.fade = Math.random() * 0.001 + 0.005

    confettis.push(c)
}
const throwConfetti = () => {
    console.log('throw')
    const spriteBounds = sprite.getBoundingClientRect()
    const x = spriteBounds.left + spriteBounds.width / 2 + Math.random() * 40 - 20
    const y = spriteBounds.top + spriteBounds.height / 2

    for (let i = 0; i < COUNT; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)]
        const shape = shapes[Math.floor(Math.random() * shapes.length)]
        const position = new paper.Point(x, y)
        createConfetti(color, shape, position)
    }
    paper.view.on('frame', onUpdate)
}
const onUpdate = () => {
    confettis.forEach((c, i) => {
        c.velocity.y += 0.02 * V / 2
        c.shape.position = c.shape.position.add(c.velocity)
        c.shape.rotate(c.rotation)
        c.shape.opacity -= c.fade
        // if (c.shape.opacity <= 0.5) {
        //   c.shape.position = c.shape.position.add(new paper.Point(0, 10))
        //
        // }
        if (c.shape.opacity <= 0) {
            c.shape.remove()
            confettis.splice(i, 1)
        }
    })
}


onReady()
cta.addEventListener('click', run)