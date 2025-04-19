import Phaser from 'phaser'
import WebFont from 'webfontloader';


export default class MenuToLevel1 extends Phaser.Scene {
    constructor() {
        super('interlude1')
    }

    preload() {
        this.load.image('Background', 'assets/images/InterludeBackground.png');
        this.load.image('MC', 'assets/images/BunnyPrototype.png');
        this.load.image('Chicken', 'assets/images/Chicken.png');
        // Load Google Font via WebFont Loader
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

    }

    create() {
        const { width, height } = this.scale

        this.add.image(width / 2, height / 2, 'Background').setDisplaySize(width, height)

        this.MC = this.add.image(width-700, height-120, 'MC').setDisplaySize(400,400);
        this.Chicken = this.add.image(width-150, height-150, 'Chicken').setDisplaySize(350,330);

        WebFont.load({
                    google: {
                        families: ['Pixelify Sans']
                    }
                });

        
    }
}