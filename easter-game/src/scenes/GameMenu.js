import Phaser from 'phaser'

export default class GameMenu extends Phaser.Scene {
    constructor() {
        super('game-menu')
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() {
        this.load.image('GameMenu', 'assets/images/GameMenu.jpg')
    }

    create() {
        this.add.image(400, 300, 'GameMenu')
        this.load.image('button-panel', 'assets\images/buttonPanel.png') // panel that holds the buttons 
        this.load.image('cursor-hand', 'assets\images/cursor_hand.png') // user's cursor
        
        const {width, height} = this.scale

        // Play button
        const playButton = this.add.image(width * 0.5, height * 0.6, 'button-panel').setDisplaySize(150,50)

        this.add.text(playButton.x, playButton.y, 'Play').setOrigin(0.5)

        // Exit button
        const exitButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'button-panel').setDisplaySize(150, 50)

        this.add.text(exitButton.x, exitButton.y, 'Exit').setOrigin(0.5)

    }


}
