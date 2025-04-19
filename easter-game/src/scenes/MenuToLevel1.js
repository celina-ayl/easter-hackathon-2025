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
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        const { width, height } = this.scale

        this.add.image(width / 2, height / 2, 'Background').setDisplaySize(width, height)

        this.MC = this.add.image(width - 700, height - 120, 'MC').setDisplaySize(400, 400);
        this.Chicken = this.add.image(width - 150, height - 150, 'Chicken').setDisplaySize(350, 330);

        WebFont.load({
            google: {
                families: ['Pixelify Sans']
            },
            active: () => {
                this.startDialogue()
            }
        })
    }

    startDialogue() {
        this.dialogues = [
            { speaker: 'Chicken', text: "JUDITH:    Hello! I am Judith, would you please help me." },
            { speaker: 'MC', text: "YOU:    What seems to be the matter?" },
            { speaker: 'Chicken', text: "JUDITH:    I've seemed to have lost my precious sweet lil eggs." },
            { speaker: 'Chicken', text: "Would you be a dear and help me find and rescue them?" }
        ]

        this.dialogueIndex = 0
        this.showDialogue(this.dialogues[this.dialogueIndex])

        this.input.once('pointerdown', () => this.nextDialogue())
    }

    showDialogue({ speaker, text }) {
        if (this.speechBubble) this.speechBubble.destroy()
        if (this.speechText) this.speechText.destroy()

        const bubbleWidth = 500
        const bubbleHeight = 100
        const bubbleX = 150
        var bubbleY = 450

        if (speaker === 'Chicken'){
            bubbleY = 200
        }
        const bubble = this.add.graphics({ x: bubbleX, y: bubbleY })
        bubble.fillStyle(0xffffff, 1)
        bubble.lineStyle(4, 0x565656, 1)
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16)
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16)

        const textObj = this.add.text(bubbleX + 20, bubbleY + 20, text, {
            fontFamily: 'Pixelify Sans',
            fontSize: '18px',
            align: 'center',
            color: '#000000',
            wordWrap: { width: bubbleWidth - 40 }
        })

        this.speechBubble = bubble
        this.speechText = textObj
    }

    nextDialogue() {
        this.dialogueIndex++
        if (this.dialogueIndex >= this.dialogues.length) {
            this.scene.start('cloud-level')
        } else {
            this.showDialogue(this.dialogues[this.dialogueIndex])
            this.input.once('pointerdown', () => this.nextDialogue())
        }
    }
}
