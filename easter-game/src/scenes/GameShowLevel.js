import Phaser from 'phaser'

export default class GameShowLevel extends Phaser.Scene {

    constructor(){
        super('game-show-level');
    }

    preload(){
        this.load.image('Background', 'assets/images/GameShowBackground.jpg')
        this.load.image('Screen', 'assets/images/GameScreen.png')
    }

    create(){
        this.add.image(400, 300, 'Background')
        this.add.image(400, 300,'Screen').setDisplaySize(600, 300);
    }
}