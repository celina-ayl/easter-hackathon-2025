import Phaser from 'phaser'

//import HelloWorldScene from './scenes/HelloWorldScene'
import GameShowLevel from './scenes/GameShowLevel'

//import GameMenu from './scenes/GameMenu'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},
	scene: [GameShowLevel],
}

export default new Phaser.Game(config)
