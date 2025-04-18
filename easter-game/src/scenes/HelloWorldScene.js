// filepath: c:\Users\renaa\.vscode\easter-hackathon-2025\easter-game\src\scenes\HelloWorldScene.js
import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
    constructor() {
        super('hello-world')
    }

    preload() {
        this.load.setBaseURL('https://labs.phaser.io')

        this.load.image('sky', 'assets/skies/space3.png')
        this.load.image('logo', 'assets/sprites/phaser3-logo.png')
        this.load.image('red', 'assets/particles/red.png')
        this.load.image('button', 'assets/sprites/button.png') // Add a button image
    }

    create() {
        this.add.image(400, 300, 'sky')

        const particles = this.add.particles('red')

        const emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
        })

        const logo = this.physics.add.image(400, 100, 'logo')

        logo.setVelocity(100, 200)
        logo.setBounce(1, 1)
        logo.setCollideWorldBounds(true)

        emitter.startFollow(logo)

        // Add a button to transition to CloudLevel
        const button = this.add.image(400, 500, 'button').setInteractive()

        button.on('pointerdown', () => {
            this.scene.start('cloud-level') // Transition to CloudLevel
        })
    }
}