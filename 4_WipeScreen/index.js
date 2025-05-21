import {mapRange} from "https://jacques-herrmann.github.io/_hacked/utils/math.js";

const tutorial = document.querySelector('.wipe-screen__tutorial')
const lottieElement = document.querySelector('.wipe-screen__lottie')
const canvas = document.querySelector('.wipe-screen__canvas')
const ctx = canvas.getContext('2d', {willReadFrequently: true})
const bounds = canvas.getBoundingClientRect()

let isDrawing = false
let discovered = false
const previous = {x: 0, y: 0}
const current = {x: 0, y: 0}
const path = []
let transparency = 0

const config = {
    lineWidth: 15
}
const mask = new Image()
mask.crossOrigin = 'anonymous'

mask.onload = () => {
    canvas.height = mask.height
    canvas.width = mask.width
    draw()
}
mask.src = "https://i.postimg.cc/R3kdd5pn/wipe-screen-after.png?no-from-cache"

lottie.loadAnimation({
    container: lottieElement,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://jacques-herrmann.github.io/_hacked/assets/lotties/wipe.json' // the path to the animation json
});

const onMouseMove = (e) => {
    if (isDrawing) {

        const c = {
            x: mapRange(e.clientX, bounds.left, bounds.right, 0, canvas.width),
            y: mapRange(e.clientY, bounds.top, bounds.bottom, 0, canvas.height)
        }

        previous.x = current.x
        previous.y = current.y

        current.x = c.x
        current.y = c.y

        path.push({
            from: {x: previous.x, y: previous.y},
            to: {x: current.x, y: current.y}
        })
        draw()
    }
}
const onMouseDown = (e) => {
    gsap.to(tutorial, {
        duration: 0.5,
        autoAlpha: 0,
    })
    isDrawing = true
    previous.x = current.x
    previous.y = current.y

    current.x = mapRange(e.clientX, bounds.left, bounds.right, 0, canvas.width)
    current.y = mapRange(e.clientY, bounds.top, bounds.bottom, 0, canvas.height)
}
const onMouseUp = (e) => {
    updateTransparency()
    isDrawing = false
}

// window.addEventListener('resize', onResize)
canvas.addEventListener('pointermove', onMouseMove)
canvas.addEventListener('pointerdown', onMouseDown)
canvas.addEventListener('pointerup', onMouseUp)


const updateTransparency = () => {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

    const alphaValues = data.filter((value, index) => index % 4 === (4 - 1) && value === 0)
    const maxPixels = canvas.width * canvas.height
    transparency = 1 - alphaValues.length / maxPixels
    if (transparency > 0.5 && !discovered) {
        discovered = true
    }
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineWidth = config.lineWidth
    path.forEach((p) => {
        ctx.beginPath()
        ctx.moveTo(p.from.x, p.from.y)
        ctx.lineTo(p.to.x, p.to.y)
        ctx.lineWidth = config.lineWidth
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.closePath()
    })
    ctx.globalCompositeOperation = 'source-in'
    drawImageProp(ctx, mask, 0, 0, canvas.width, canvas.height)
    ctx.restore()
}
const drawImageProp = (ctx, img, x, y, w, h, offsetX, offsetY) => {

    // default offset is center
    offsetX = typeof offsetX === 'number' ? offsetX : 0.5
    offsetY = typeof offsetY === 'number' ? offsetY : 0.5

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) {
        offsetX = 0
    }
    if (offsetY < 0) {
        offsetY = 0
    }
    if (offsetX > 1) {
        offsetX = 1
    }
    if (offsetY > 1) {
        offsetY = 1
    }

    const iw = img.width
    const ih = img.height
    const r = Math.min(w / iw, h / ih)
    let nw = iw * r // new prop. width
    let nh = ih * r // new prop. height
    let cx;
    let cy;
    let cw;
    let ch;
    let ar = 1

    // decide which gap to fill
    if (nw < w) {
        ar = w / nw
    }
    if (Math.abs(ar - 1) < 1e-14 && nh < h) {
        ar = h / nh
    } // updated
    nw *= ar
    nh *= ar

    // calc source rectangle
    cw = iw / (nw / w)
    ch = ih / (nh / h)

    cx = (iw - cw) * offsetX
    cy = (ih - ch) * offsetY

    // make sure source rectangle is valid
    if (cx < 0) {
        cx = 0
    }
    if (cy < 0) {
        cy = 0
    }
    if (cw > iw) {
        cw = iw
    }
    if (ch > ih) {
        ch = ih
    }

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h)
}


