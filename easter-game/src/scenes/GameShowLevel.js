import Phaser from 'phaser'

export default class GameShowLevel extends Phaser.Scene {

    constructor(){
        super('game-show-level');
    }

    preload(){
        this.load.image('Background', 'assets/images/GameShowBackground.jpg')
        this.load.image('Screen', 'assets/images/GameScreen.png')
        this.load.json('questions', 'assets/GameShow/QuestionsAnswers.json')

    }

    create(){
        this.add.image(400, 300, 'Background')
        const screen = this.add.image(400, 300,'Screen').setDisplaySize(600, 300);

        const questionsData = this.cache.json.get('questions')
        const randomIndex = Phaser.Math.Between(0, questionsData.length - 1)
        const q = questionsData[randomIndex]

        console.log(q.question)        
        console.log(q.options)         
        console.log(q.correct)        
        
        // @ts-ignore
        const screenQuestion = this.add.text(screen.x-250, screen.y-50, q.question, {
            fontSize: '16px',
            color: '#ffffff'
        })

        const screenOption1 = this.add.text(screen.x-100, screen.y + 50, q.options[0],{
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })

        const screenOption2 = this.add.text(screen.x-100, screen.y + 100, q.options[1],{
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })

        const screenOption3 = this.add.text(screen.x + 100, screen.y + 50, q.options[2],{
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })

        const screenOption4 = this.add.text(screen.x + 100, screen.y + 100, q.options[3],{
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })

        screenOption1.on('pointerover', () => {
            screenOption1.setTint(0x44ff44)
        })

        screenOption1.on('pointerout', () => {
            screenOption1.clearTint()
        })

        screenOption1.on('pointerup', () => {
            console.log('Play button clicked')
            // this.scene.start('your-next-scene')
        })


        screenOption2.on('pointerover', () => {
            screenOption2.setTint(0x44ff44)
        })

        screenOption2.on('pointerout', () => {
            screenOption2.clearTint()
        })

        screenOption2.on('pointerup', () => {
            console.log('Play button clicked')
            // this.scene.start('your-next-scene')
        })


        screenOption3.on('pointerover', () => {
            screenOption3.setTint(0x44ff44)
        })

        screenOption3.on('pointerout', () => {
            screenOption3.clearTint()
        })

        screenOption3.on('pointerup', () => {
            console.log('Play button clicked')
            // this.scene.start('your-next-scene')
        })


        screenOption4.on('pointerover', () => {
            screenOption4.setTint(0x44ff44)
        })

        screenOption4.on('pointerout', () => {
            screenOption4.clearTint()
        })

        screenOption4.on('pointerup', () => {
            console.log('Play button clicked')
            // this.scene.start('your-next-scene')
        })
    }
    
}