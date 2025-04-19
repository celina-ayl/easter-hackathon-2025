import Phaser from 'phaser'

export default class ForestLevel extends Phaser.Scene {
    
    /*                          NOTE!!!
    * The watergun isn't actually facing the direction that the png says it is... whoops lol
    * Rename the pngs and change it in the code so they're actually facing the right direction
    * 
    * Also the rope png is way too short, it doesn't even reach the top of the screen so make
    * a longer rope and replace it with the rope png that you have right now.
    */


    constructor() {
        super('forest-level')

        // Bunny initial state
        this.playerState = {
            direction: 'right',
            hasWater: false,
            shotsFired: 0
        }

        // Egg should still be hanging
        this.eggDropping = false
    }

    preload() {

        // Preload assets
        this.load.image('forestLevel', 'assets/images/forest_assets/forest_background.png')
        this.load.image('lake', 'assets/images/forest_assets/lake.png')
        this.load.image('egg', 'assets/images/forest_assets/easter_egg.png')
        this.load.image('fire', 'assets/images/forest_assets/fire.png')
        this.load.image('rope', 'assets/images/forest_assets/rope.png')
        this.load.image('rabbitLeft', 'assets/images/forest_assets/rabbitLeft.png')
        this.load.image('rabbitRight', 'assets/images/forest_assets/rabbitRight.png')
        this.load.image('watergunLeft', 'assets/images/forest_assets/watergunLeft.png')
        this.load.image('watergunRight', 'assets/images/forest_assets/watergunRight.png')
        this.load.image('waterdrop', 'assets/images/forest_assets/waterdrop.png')
    }

    create() {

        // background
        this.add.image(400, 300, 'forestLevel').setDisplaySize(800, 600)

        // lake
        this.lake = this.add.image(120,480, 'lake').setScale(0.3)

        // fire
        this.fire = this.add.image(700, 450, 'fire').setScale(0.3)

        // egg hanging over
        this.rope = this.add.image(700, 94, 'rope').setScale(0.2)
        this.egg = this.add.image(700, 200, 'egg').setScale(0.07)

        // rabbit + watergun
        this.player = this.physics.add.sprite(400, 450, 'rabbitRight')
        this.player.setDisplaySize(100, 130)
        this.player.body.setAllowGravity(false)
        this.watergun = this.add.image(this.player.x + 25, this.player.y + 40, 'watergunRight') // 420, 500
        this.watergun.setDisplaySize(60, 60)
        this.droplets = this.physics.add.group()
        this.physics.add.overlap(this.droplets, this.fire, this.hitFire, null, this)

        
        // Movement with cursor keys
        this.cursors = this.input.keyboard.createCursorKeys()

        this.input.keyboard.on('keydown-SPACE', () => {
            this.shootWater()
        })

        this.statusText = this.add.text(10, 10, '', {
            font: '16px Arial',
            color: '#ffffff'
        })
    }

    update() {

        const speed = 160

        // Movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed)
            this.player.setTexture('rabbitLeft')
            this.watergun.setTexture('watergunLeft')
            this.playerState.direction = 'left'

        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed)
            this.player.setTexture('rabbitRight')
            this.watergun.setTexture('watergunRight')
            this.playerState.direction = 'right'

        } else {
            this.player.setVelocityX(0)
        }

        // Watergun 'flips' left or right depending on the rabbit's direction
        const offsetX = this.playerState.direction === 'right' ? 25 : -25 // 20 : -20
        this.watergun.x = this.player.x + offsetX
        this.watergun.y = this.player.y + 40 // was w/o + 10 before

        // Refilling watergun
        const distToLake = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.lake.x,
            this.lake.y
        )

        if (distToLake < 150 && !this.playerState.hasWater) {
            this.playerState.hasWater = true
            this.statusText.setText('Watergun filled!')
        }

        if (this.eggDropping && this.egg.y < 470) {
            this.egg.y += 1
        }
    }

    isFacingFire() {
        return (this.playerState.direction === 'right' && this.fire.x > this.player.x) ||
        (this.playerState.direction === 'left' && this.fire.x < this.player.x)
    }

    hitFire(droplet, fire) {
        droplet.destroy()
    }

    extinguishFire() {
        this.fire.setVisible(false)
        this.statusText.setText('Fire extinguished!')
        this.eggDropping = true
    }

    shootWater() {

        if (!this.playerState.hasWater) {
            this.statusText.setText('No water! Refill at the lake.')
            return
        }

        this.statusText.setText('Shooting water...') // Instead of shooting water text, replace with waterdrop png coming out of gun with each shotsFired

        const offsetX = this.playerState.direction === 'right' ? 30 : - 30
        const droplet = this.droplets.create(this.watergun.x + 45, this.watergun.y, 'waterdrop')
        droplet.setScale(0.5)
        droplet.body.allowGravity = false
        droplet.setVelocity(this.playerState.direction === 'right' ? 300 : -300)
        droplet.setVelocityY(-10) 


        if (this.isFacingFire() && this.playerState.shotsFired < 5) {
            this.playerState.shotsFired++

            // Replace with waterdrop png that shoots continuosuly out of watergun with each shotsFired later
            this.statusText.setText(`Shooting water... (${this.playerState.shotsFired}/5)`) 

            if(this.playerState.shotsFired >=5) {
                this.extinguishFire()

            }

        }
    }
}

