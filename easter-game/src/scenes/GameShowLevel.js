import WebFont from 'webfontloader';
import Phaser from 'phaser';

export default class GameShowLevel extends Phaser.Scene {

    constructor() {
        super('game-show-level');
        this.questionCounter = 0;
        this.askedQuestions = new Set();
        this.score = 0;
    }

    preload() {
        this.load.image('Background', 'assets/images/GameShowBackground.jpg');
        this.load.image('Screen', 'assets/images/GameScreen.png');
        this.load.json('questions', 'assets/GameShow/QuestionsAnswers.json');
        
        // MC for the main character
        this.load.image('MC', 'assets/images/BunnyPrototype.png');

        this.load.image('SteveBunny', 'assets/images/SteveBunny.png');

        // Load Google Font via WebFont Loader
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'Background').setDisplaySize(width, height);
        this.screen = this.add.image(width / 2, height / 2, 'Screen').setDisplaySize(600, 300);

        this.MC = this.add.image(width-700, height-150, 'MC').setDisplaySize(400,400);
        this.SteveBunny = this.add.image(width-100, height-150, 'SteveBunny').setDisplaySize(200,300);
        WebFont.load({
            google: {
                families: ['Pixelify Sans']
            },
            active: () => {
                this.startGame();
            }
        });
    }

    startGame() {
        const { width } = this.scale;
        this.questionsData = this.cache.json.get('questions');

        this.questionNumberText = this.add.text(width - 20, 20, '', {
            fontFamily: 'Pixelify Sans',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000cc',
            padding: { x: 10, y: 5 }
        }).setOrigin(1, 0);

        this.scoreText = this.add.text(width - 20, 60, 'Score: 0', {
            fontFamily: 'Pixelify Sans',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000cc',
            padding: { x: 10, y: 5 }
        }).setOrigin(1, 0);

        this.loadNextQuestion();
    }

    loadNextQuestion() {
        if (this.askedQuestions.size === this.questionsData.length) {
            this.endGame();
            return;
        }

        let randomIndex;
        do {
            randomIndex = Phaser.Math.Between(0, this.questionsData.length - 1);
        } while (this.askedQuestions.has(randomIndex));

        this.askedQuestions.add(randomIndex);
        this.currentQuestion = this.questionsData[randomIndex];

        if (this.screenQuestion) this.screenQuestion.destroy();
        if (this.optionTexts) this.optionTexts.forEach(opt => opt.destroy());
        if (this.popupText) this.popupText.destroy();

        this.questionCounter++;
        this.questionNumberText.setText(`Question ${this.questionCounter }`);

        this.screenQuestion = this.add.text(this.screen.x, this.screen.y - 80, this.currentQuestion.question, {
            fontSize: '25px',
            fontFamily: 'Pixelify Sans',
            color: '#ffffff',
            wordWrap: { width: 500 },
            align: 'center'
        }).setOrigin(0.5);

        const positions = [
            { x: this.screen.x - 150, y: this.screen.y + 30 },
            { x: this.screen.x - 150, y: this.screen.y + 80 },
            { x: this.screen.x + 150, y: this.screen.y + 30 },
            { x: this.screen.x + 150, y: this.screen.y + 80 }
        ];

        this.optionTexts = this.currentQuestion.options.map((opt, index) => {
            const textObj = this.add.text(positions[index].x, positions[index].y, opt, {
                fontSize: '20px',
                fontFamily: 'Pixelify Sans',
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

        if (isCorrect) this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);

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
        this.checkIfLastQuestion();
        this.loadNextQuestion();
    }

    failQuestion() {
        this.loadNextQuestion();
    }

    checkIfLastQuestion() {
        if (this.questionCounter >= 8) {
            this.endGame();
        }
    }

    endGame() {
        if (this.score < 50) {
            this.add.text(this.scale.width / 2, this.scale.height / 2, 'Not enough points to win.', {
                fontFamily: 'Pixelify Sans',
                fontSize: '24px',
                color: '#ff0000',
                backgroundColor: '#000000cc',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5);
            this.time.delayedCall(3000, () => {
                this.scene.start('game-show-level');
            });
        } else {
            this.add.text(this.scale.width / 2, this.scale.height / 2, 'You have earned enough points.', {
                fontFamily: 'Pixelify Sans',
                fontSize: '24px',
                color: '#00ff00',
                backgroundColor: '#000000cc',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5);
            this.time.delayedCall(3000, () => {
                this.scene.start('interlude3');
            });
        }
    }
} 
