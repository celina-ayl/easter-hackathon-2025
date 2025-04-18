import Phaser from 'phaser'

export default class GameShowLevel extends Phaser.Scene {

    constructor(){
        super('game-show-level');
        this.questionCounter = 0;
    }

    preload(){
        this.load.image('Background', 'assets/images/GameShowBackground.jpg')
        this.load.image('Screen', 'assets/images/GameScreen.png')
        this.load.json('questions', 'assets/GameShow/QuestionsAnswers.json')
    }

    create(){
        this.add.image(400, 300, 'Background')
        this.screen = this.add.image(400, 300,'Screen').setDisplaySize(600, 300);

        this.questionsData = this.cache.json.get('questions')

        this.loadNextQuestion()
    }

    loadNextQuestion() {
        const randomIndex = Phaser.Math.Between(0, this.questionsData.length - 1)
        this.currentQuestion = this.questionsData[randomIndex]

        console.log(this.currentQuestion.question)
        console.log(this.currentQuestion.options)
        console.log(this.currentQuestion.correct)

        const { screen } = this

        if (this.screenQuestion) this.screenQuestion.destroy()
        if (this.optionTexts) this.optionTexts.forEach(opt => opt.destroy())

        this.screenQuestion = this.add.text(screen.x - 250, screen.y - 50, this.currentQuestion.question, {
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: 500 }
        })

        const positions = [
            { x: screen.x - 100, y: screen.y + 50 },
            { x: screen.x - 100, y: screen.y + 100 },
            { x: screen.x + 100, y: screen.y + 50 },
            { x: screen.x + 100, y: screen.y + 100 }
        ]

        this.optionTexts = this.currentQuestion.options.map((opt, index) => {
            const textObj = this.add.text(positions[index].x, positions[index].y, opt, {
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true })

            textObj.on('pointerover', () => textObj.setTint(0x44ff44))
            textObj.on('pointerout', () => textObj.clearTint())
            textObj.on('pointerup', () => this.validateAnswer(index))

            return textObj
        })
    }

    validateAnswer(selectedIndex){
        if((selectedIndex+1) === this.currentQuestion.correct){
            console.log("Correct answer")
            this.updateQuestion()
        } else {
            console.log("Wrong answer")
            this.failQuestion()
        }
    }

    updateQuestion(){
        this.questionCounter++
        this.checkIfLastQuestion()
        this.loadNextQuestion()
    }

    failQuestion(){
        // You can add visual feedback or deduct score
        this.loadNextQuestion()
    }

    checkIfLastQuestion(){
        if (this.questionCounter === 5){
            this.scene.start('game-menu')
        }
    }
}
