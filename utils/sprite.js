const OPTIONS = {
    src: './exemple.png',
    rows: 8,
    columns: 5,
    animations: [{
        name: 'walk',
        start: 1,
        end: 5,
        fps: 10,
        repeat: -1
    }, {
        name: 'attack',
        start: 21,
        end: 25,
        fps: 10,
        repeat: -1
    }]
}

class SpriteSheetAnimation {
    constructor(name, start, end, fps, repeat) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.fps = fps;
        this.repeat = repeat;

        this.repeated = 0;
    }

    get totalFrames() {
        return this.end - this.start + 1;
    }
}

class SpriteSheet {
    constructor(domElement, options = {}) {
        this.options = Object.assign({}, OPTIONS, options);

        this.canvas = domElement;
        this.context = this.canvas.getContext('2d');

        this.currentFrame = 0;

        this.isPlaying = false;
        this.currentAnimation = null;
        this.animations = this.options.animations.map(anim => new SpriteSheetAnimation(anim.name, anim.start, anim.end, anim.fps, anim.repeat));

        this.load();
    }

    load() {
        this.image = new Image();
        this.image.onload = () => {
            if (this.isPlaying) {
                this.resize();
            }
            this.tick();
        };
        this.image.src = this.options.src;
    }

    resize() {
        this.width = this.image.width / this.options.columns;
        this.height = this.image.height / this.options.rows;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    play(key) {
        console.log(`Playing animation: ${key}`);
        if (key) {
            const animation = this.animations.find(anim => anim.name === key);
            if (animation) {
                this.currentAnimation = animation;
            }
        }
        if (this.currentAnimation) {
            this.currentAnimation.repeated = 0;
            this.currentFrame = this.currentAnimation.start - 1;
            this.isPlaying = true;
            this.startTime = Date.now();
            this.tick();
        }
    }

    stop() {
        this.isPlaying = false;
    }

    reset() {
        this.currentFrame = 0;
        this.startTime = Date.now();
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const x = (this.currentFrame % this.options.columns) * this.width;
        const y = Math.floor(this.currentFrame / this.options.columns) * this.height;
        this.context.drawImage(this.image, x, y, this.width, this.height, 0, 0, this.width, this.height);
    }

    tick() {
        if (!this.isPlaying) return;
        requestAnimationFrame(this.tick.bind(this));

        const elapsed = Date.now() - this.startTime;
        this.currentFrame = Math.floor((elapsed / (1000 / this.currentAnimation.fps)) % this.currentAnimation.totalFrames) + this.currentAnimation.start - 1;

        if (this.currentFrame >= this.currentAnimation.end - 1) {
            if (this.currentAnimation.repeat === -1 || this.currentAnimation.repeated < this.currentAnimation.repeat) {
                this.currentAnimation.repeated++;
                this.startTime = Date.now();
                this.currentFrame = this.currentAnimation.start - 1;

            } else {
                this.isPlaying = false;
            }
        }
        this.draw();
    }
}

export default SpriteSheet;