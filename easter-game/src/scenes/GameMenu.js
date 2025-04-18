import Phaser from 'phaser'

export default class GameMenu extends Phaser.Scene {
    constructor() {
        super('game-menu')
    }

    preload() {
        this.load.image('GameMenu', 'assets/images/menu_background.png')
        this.load.image('button-panel', 'assets/images/buttonPanel.png')
    }

    create() {
        const { width, height } = this.scale

        this.add.image(width / 2, height / 2, 'GameMenu').setDisplaySize(width, height)

        // Create Play Button
        const playButton = this.add.image(width * 0.5, height * 0.6, 'button-panel')
            .setDisplaySize(150, 50)
            .setInteractive({ useHandCursor: true })

            playButton.on('pointerdown', () => {
                this.scene.start('cloud-level')
            })


        // @ts-ignore
        const playText = this.add.text(playButton.x, playButton.y, 'Play', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5)

        playButton.on('pointerover', () => {
            playButton.setTint(0x44ff44)
        })

        playButton.on('pointerout', () => {
            playButton.clearTint()
        })

        playButton.on('pointerup', () => {
            console.log('Play button clicked')
            // this.scene.start('your-next-scene')
        })

        // Create Exit Button
        const exitButton = this.add.image(width * 0.5, height * 0.6 + 70, 'button-panel')
            .setDisplaySize(150, 50)
            .setInteractive({ useHandCursor: true })

        // @ts-ignore 
        const exitText = this.add.text(exitButton.x, exitButton.y, 'Exit', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5)

        exitButton.on('pointerover', () => {
            exitButton.setTint(0xff4444)
        })

        exitButton.on('pointerout', () => {
            exitButton.clearTint()
        })

        exitButton.on('pointerup', () => {
            console.log('Exit button clicked')
            // this.game.destroy(true)
        })
    }
}