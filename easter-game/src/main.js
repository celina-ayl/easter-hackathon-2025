import Phaser from 'phaser'

import GameMenu from './scenes/GameMenu'

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
	scene: [GameMenu],
}

export default new Phaser.Game(config)
