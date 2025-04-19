import Phaser from 'phaser'
//import HelloWorldScene from './scenes/HelloWorldScene'

import GameShowLevel from './scenes/GameShowLevel'

import GameMenu from './scenes/GameMenu'

import CloudLevel from './scenes/CloudLevel'

import MenuToLevel1  from './scenes/MenuToLevel1'

import Level1ToLevel2 from './scenes/Level1ToLevel2'

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
	scene: [Level1ToLevel2, GameMenu, MenuToLevel1, CloudLevel, GameShowLevel],
}

export default new Phaser.Game(config)
