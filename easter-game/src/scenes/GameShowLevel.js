import Phaser from 'phaser'

export default class GameShowLevel extends Phaser.Scene {

    constructor() {
        super('game-show-level');
        this.questionCounter = 0;
        this.askedQuestions = new Set();
    }

    preload() {
        this.load.image('Background', 'assets/images/GameShowBackground.jpg');
        this.load.image('Screen', 'assets/images/GameScreen.png');
        this.load.json('questions', 'assets/GameShow/QuestionsAnswers.json');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'Background').setDisplaySize(width, height);
        this.screen = this.add.image(width / 2, height / 2, 'Screen').setDisplaySize(600, 300);

        this.questionsData = this.cache.json.get('questions');

        this.questionNumberText = this.add.text(width / 2, 80, '', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.loadNextQuestion();
    }

    loadNextQuestion() {
        if (this.askedQuestions.size === this.questionsData.length) {
            console.warn('All questions used.');
            this.scene.start('game-menu');
            return;
        }

        let randomIndex;
        do {
            randomIndex = Phaser.Math.Between(0, this.questionsData.length - 1);
        } while (this.askedQuestions.has(randomIndex));

        this.askedQuestions.add(randomIndex);
        this.currentQuestion = this.questionsData[randomIndex];

        const { screen } = this;

        if (this.screenQuestion) this.screenQuestion.destroy();
        if (this.optionTexts) this.optionTexts.forEach(opt => opt.destroy());
        if (this.popupText) this.popupText.destroy();

        this.questionNumberText.setText(`Question ${this.questionCounter + 1}`);

        this.screenQuestion = this.add.text(screen.x, screen.y - 80, this.currentQuestion.question, {
            fontSize: '20px',
            color: '#ffffff',
            wordWrap: { width: 500 },
            align: 'center'
        }).setOrigin(0.5);

        const positions = [
            { x: screen.x - 150, y: screen.y + 30 },
            { x: screen.x - 150, y: screen.y + 80 },
            { x: screen.x + 150, y: screen.y + 30 },
            { x: screen.x + 150, y: screen.y + 80 }
        ];

        this.optionTexts = this.currentQuestion.options.map((opt, index) => {
            const textObj = this.add.text(positions[index].x, positions[index].y, opt, {
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            textObj.on('pointerover', () => textObj.setTint(0x44ff44));
            textObj.on('pointerout', () => textObj.clearTint());
            textObj.on('pointerup', () => this.validateAnswer(index));

            return textObj;
        });
    }

    validateAnswer(selectedIndex) {
        const isCorrect = (selectedIndex + 1) === this.currentQuestion.correct;
        this.showPopup(isCorrect ? 'Correct!' : 'Wrong!');

        this.time.delayedCall(1500, () => {
            if (isCorrect) this.updateQuestion();
            else this.failQuestion();
        });
    }

    showPopup(message) {
        const { width } = this.scale;
        if (this.popupText) this.popupText.destroy();
        this.popupText = this.add.text(width / 2, 550, message, {
            fontSize: '24px',
            backgroundColor: '#000000cc',
            padding: { x: 20, y: 10 },
            color: message === 'Correct!' ? '#00ff00' : '#ff0000'
        }).setOrigin(0.5);
    }

    updateQuestion() {
        this.questionCounter++;
        this.checkIfLastQuestion();
        this.loadNextQuestion();
    }

    failQuestion() {
        this.loadNextQuestion();
    }

    checkIfLastQuestion() {
        if (this.questionCounter === 5) {
            this.scene.start('game-menu');
        }
    }
}
