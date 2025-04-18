import Phaser from 'phaser'
import WebFont from 'webfontloader';

export default class Level2ToLevel3 extends Phaser.Scene {
    constructor() {
        super('interlude3')
    }

    preload() {
        this.load.image('Background', 'assets/images/InterludeBackground.png');
        this.load.image('MC', 'assets/images/BunnyPrototype.png');
        this.load.image('Chicken', 'assets/images/Chicken.png');
        this.load.image('button-panel', 'assets/images/buttonPanel.png');
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
            { speaker: 'Chicken', text: "JUDITH:    Wow you really know your Easter facts! " },
            { speaker: 'MC', text: "YOU:    I guess I do." },
            { speaker: 'Chicken', text: "JUDITH:    So this last egg is in a LOT of trouble." },
            { speaker: 'Chicken', text: "Please try and rescue this one as fast as possible!" }
        ]

        this.dialogueIndex = 0
        this.typingTween = null
        this.showDialogue(this.dialogues[this.dialogueIndex])
    }

    showDialogue({ speaker, text }) {
        if (this.speechBubble) this.speechBubble.destroy()
        if (this.speechText) this.speechText.destroy()

        const bubbleWidth = 500
        const bubbleHeight = 100
        const bubbleX = speaker === 'Chicken' ? 250 : 100
        const bubbleY = speaker === 'Chicken' ? 150 : 350

        const bubble = this.add.graphics({ x: bubbleX, y: bubbleY })
        bubble.fillStyle(0xffffff, 1)
        bubble.lineStyle(4, 0x565656, 1)
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16)
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16)

        const textObj = this.add.text(bubbleX + 20, bubbleY + 20, '', {
            fontFamily: 'Pixelify Sans',
            fontSize: '18px',
            color: '#000000',
            wordWrap: { width: bubbleWidth - 40 }
        })

        this.speechBubble = bubble
        this.speechText = textObj

        this.typeText(textObj, text, () => {
            this.input.once('pointerdown', () => this.nextDialogue())
        })
    }

    typeText(textObj, fullText, onComplete) {
        const length = fullText.length
        let i = 0

        this.typingTween = this.time.addEvent({
            delay: 30,
            repeat: length - 1,
            callback: () => {
                textObj.text += fullText[i]
                i++
                if (i === length && onComplete) onComplete()
            }
        })
    }

    nextDialogue() {
        this.dialogueIndex++

        if (this.dialogueIndex >= this.dialogues.length) {
            this.scene.stop('interlude3')
            this.scene.start('forest-level')
        } else {
            this.showDialogue(this.dialogues[this.dialogueIndex])
        }
    }

    
}
