import Phaser from 'phaser'

import GameShowLevel from './scenes/GameShowLevel'

import GameMenu from './scenes/GameMenu'

import CloudLevel from './scenes/CloudLevel'

import ForestLevel from './scenes/ForestLevel'

import MenuToLevel1  from './scenes/MenuToLevel1'

import Level1ToLevel2 from './scenes/Level1ToLevel2'

import Level2ToLevel3 from './scenes/Level2ToLevel3'

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
	scene: [ GameMenu, Level1ToLevel2, Level2ToLevel3, MenuToLevel1, CloudLevel, GameShowLevel, ForestLevel],
}

export default new Phaser.Game(config)
