import Phaser from 'phaser'
import WebFont from 'webfontloader';

export default class EggCracking extends Phaser.Scene {
    constructor() {
        super('egg-cracking')
    }

    preload() {
        this.load.image('EggBackground', 'assets/images/bg_layer1.png');
        
        this.load.image('Egg1', `assets/images/EggCracking/Egg1.png`);
        this.load.image('Egg2', `assets/images/EggCracking/Egg2.png`);
        this.load.image('Egg3', `assets/images/EggCracking/Egg3.png`);
        this.load.image('Egg4', `assets/images/EggCracking/Egg4.png`);
        this.load.image('Egg5', `assets/images/EggCracking/Egg5.png`);
        this.load.image('Egg6', `assets/images/EggCracking/Egg6.png`);
        this.load.image('Egg7', `assets/images/EggCracking/Egg7.png`);
        this.load.image('Egg8', `assets/images/EggCracking/Egg8.png`);
        this.load.image('monsterChicken1', `assets/images/EggCracking/monsterChicken1.png`)
        this.load.image('monsterChicken2', `assets/images/EggCracking/monsterChicken2.png`)
        this.load.image('monsterChicken3', `assets/images/EggCracking/monsterChicken3.png`)
        this.load.image('monsterChicken4', `assets/images/EggCracking/monsterChicken4.png`)
        this.load.image('monsterChicken5', `assets/images/EggCracking/monsterChicken5.png`)
        this.load.image('monsterChicken6', `assets/images/EggCracking/monsterChicken6.png`)

        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        const { width, height } = this.scale

        this.add.image(width / 2, height / 2, 'EggBackground').setDisplaySize(width, height)

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
            { text: "JUDITH:    OMG! The egg is hatching!" }
        ]

        this.dialogueIndex = 0
        this.typingTween = null
        this.showDialogue(this.dialogues[this.dialogueIndex])
    }

    showDialogue({ text }) {
        if (this.speechBubble) this.speechBubble.destroy()
        if (this.speechText) this.speechText.destroy()

        const bubbleWidth = 500
        const bubbleHeight = 100
        const bubbleX = 250
        const bubbleY = 150

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
            this.input.once('pointerdown', () => this.removeDialogue())
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

    removeDialogue() {
        this.speechBubble.destroy()
        this.speechText.destroy()
        this.startCracking()
    }

    startCracking() {
        this.eggStage = 1
        this.maxEggStage = 8

        this.currentEgg = this.add.image(400, 300, 'Egg1').setDisplaySize(300, 300).setInteractive({ useHandCursor: true })

        this.currentEgg.on('pointerup', () => {
            this.eggStage++
        
            if (this.eggStage > this.maxEggStage) {
                // optionally trigger next scene or event here
                this.currentEgg.setVisible(false)
                this.showMonsterChicken()
                return
            }
        
            const scaleFactor = 1 + (this.eggStage - 1) * 0.1
            const newSize = 300 * scaleFactor
        
            this.currentEgg.setTexture('Egg' + this.eggStage)
            this.currentEgg.setDisplaySize(newSize, newSize)
        })
    }

    showMonsterChicken() {
        this.monsterChicken = this.add.image(400, 300, 'monsterChicken1').setDisplaySize(300, 300)
        this.monsterChicken.setVisible(true)
    }
}
