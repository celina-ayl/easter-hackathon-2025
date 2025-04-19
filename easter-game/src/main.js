import Phaser from 'phaser'
//import HelloWorldScene from './scenes/HelloWorldScene'

import GameShowLevel from './scenes/GameShowLevel'

import GameMenu from './scenes/GameMenu'

import CloudLevel from './scenes/CloudLevel'

import MenuToLevel1  from './scenes/MenuToLevel1'

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
	scene: [MenuToLevel1],
	// scene: [GameShowLevel, GameMenu, MenuToLevel1, CloudLevel],
}

export default new Phaser.Game(config)
