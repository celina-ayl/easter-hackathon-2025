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
        this.load.image('button-panel', 'assets/images/buttonPanel.png');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.audio('interlude-music', 'assets/sound/interlude.mp3');
    }

    create() {
        const { width, height } = this.scale

        this.add.image(width / 2, height / 2, 'Background').setDisplaySize(width, height)

        this.MC = this.add.image(width - 700, height - 120, 'MC').setDisplaySize(400, 400);
        this.Chicken = this.add.image(width - 150, height - 150, 'Chicken').setDisplaySize(350, 330);

        // Play the background music
        this.interludeMusic = this.sound.add('interlude-music', { loop: true, volume: 0.5 });
        this.interludeMusic.play();

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
        this.typingTween = null
        this.showDialogue(this.dialogues[this.dialogueIndex])
    }

    showDialogue({ speaker, text }) {
        if (this.speechBubble) this.speechBubble.destroy()
        if (this.speechText) this.speechText.destroy()
        if (this.acceptButton) {
            this.acceptButton.destroy()
            this.acceptButtonText.destroy()
        }

        if (this.denyButton) {
            this.denyButton.destroy()
            this.denyButtonText.destroy()
        }

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
            this.interludeMusic.stop();
            this.showAcceptButton()
            this.showDenyButton()
        } else {
            this.showDialogue(this.dialogues[this.dialogueIndex])
        }
    }

    showAcceptButton() {
        const centerX = this.scale.width / 2
        const centerY = this.scale.height - 200

        this.acceptButton = this.add.image(centerX, centerY, 'button-panel')
            .setDisplaySize(200, 60)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.acceptButton.setTint(0x44ff44))
            .on('pointerout', () => this.acceptButton.clearTint())
            .on('pointerup', () => this.scene.start('cloud-level'))

        this.acceptButtonText = this.add.text(centerX, centerY, 'Accept Quest', {
            fontFamily: 'Pixelify Sans',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5)
    }

    showDenyButton() {
        const centerX = this.scale.width / 2
        const centerY = this.scale.height - 100

        this.denyButton = this.add.image(centerX, centerY, 'button-panel')
            .setDisplaySize(200, 60)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.denyButton.setTint(0xff0000))
            .on('pointerout', () => this.denyButton.clearTint())
            .on('pointerup', () => this.scene.start('game-menu'))

        this.denyButtonText = this.add.text(centerX, centerY, 'Deny Judith', {
            fontFamily: 'Pixelify Sans',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5)
    }
}
