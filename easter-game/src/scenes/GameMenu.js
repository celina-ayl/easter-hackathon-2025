import Phaser from 'phaser'

export default class GameMenu extends Phaser.Scene {
    constructor() {
        super('game-menu')
    }

    preload() {
        this.load.image('GameMenu', 'assets/images/GameMenu.jpg')
    }

    create() {
        this.add.image(400, 300, 'GameMenu')
    }
}
