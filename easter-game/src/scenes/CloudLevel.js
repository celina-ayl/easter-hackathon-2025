import Phaser from '../lib/phaser.js';

export default class CloudLevel extends Phaser.Scene
{
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    /** @type {Phaser.GameObjects.Group} */
    clouds

    /** @type {Phaser.Physics.Arcade.Sprite | null} */
    
    easterEgg = null // Reference to the egg sprite
    platformCount = 0
    eggTargetPlatform = 15 // Which platform should have the egg
    eggSpawned = false

    constructor()
    {
        super({ key: 'cloud-level' });
    }

    preload() {
        this.load.image('background', 'assets/images/bg_layer1.png')
        this.load.image('cloud', 'assets/images/cloud.png')
        this.load.image('bunny', 'assets/images/BunnyPrototype.png')
        this.load.image('platform', 'assets/images/ground.png')
        this.load.image('easter-egg', 'assets/images/easter_egg.png')
    }

    create() {
        this.add.image(240, 320, 'background').setScrollFactor(1, 0)
    
        this.cursors = this.input.keyboard.createCursorKeys()
    
        this.clouds = this.add.group()
    
        // Create initial clouds
        for (let i = 0; i < 3; i++) {
            const x = Phaser.Math.Between(0, 480)
            const y = 250 * i
            const cloud = this.add.image(x, y, 'cloud')
            this.clouds.add(cloud)
        }
    
        this.platforms = this.physics.add.staticGroup()
    
        // --- Initial Platform Creation ---
        const initialPlatforms = 5
        for (let i = 0; i < initialPlatforms; i++) {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i
    
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'platform')
            platform.setScale(0.5)
    
            /** @type {Phaser.Physics.Arcade.StaticBody} */
            // @ts-ignore
            const body = platform.body
            body.updateFromGameObject()
    
            this.platformCount++
        }
        // --- End Initial Platform Creation ---
    
        this.player = this.physics.add.sprite(240, 320, 'bunny').setScale(0.05)
        this.player.setDepth(1)

        // Adjust the physics body size and offset
        this.player.body.setSize(this.player.width, this.player.height * 0.8)
        this.player.body.setOffset(0, this.player.height * 0.02)

        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
    
        this.physics.add.collider(this.platforms, this.player)
    
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setDeadzone(this.scale.width * 1.5)
    
        this.platformCount = initialPlatforms
        this.easterEgg = null
    }

    update() {
        // --- Platform Recycling and Egg Spawning ---
        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            // @ts-ignore
            const platform = child
    
            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + this.scale.height + platform.displayHeight) {
                // If the egg has spawned, prevent platforms from spawning near it
                if (this.eggSpawned) {
                    if (platform.y < this.easterEgg.y + 100) {
                        platform.y = this.easterEgg.y + 200 
                    }
                        if (platform.y > this.easterEgg.y - 200) {
                        platform.y = scrollY - Phaser.Math.Between(3000, 9000)
                    }
                } else {
                    // Normal recycling if the egg hasn't spawned
                    platform.y = scrollY - Phaser.Math.Between(50, 100)
                }
    
                platform.x = Phaser.Math.Between(platform.displayWidth * 0.5 + 20, this.scale.width - platform.displayWidth * 0.5 - 20)
                platform.body.updateFromGameObject()
    
                this.platformCount++
                console.log(`Platform count: ${this.platformCount}`)
    
                // Spawn the Easter Egg on the target platform
                if (this.platformCount === this.eggTargetPlatform && !this.eggSpawned) {
                    this.spawnEasterEgg(platform)
                    this.eggSpawned = true
                }
            }
        })
        // --- End Platform Recycling ---
    
        // --- Cloud Recycling ---
        this.clouds.children.iterate(child => {
            /** @type {Phaser.GameObjects.Image} */
            // @ts-ignore
            const cloud = child
    
            const scrollY = this.cameras.main.scrollY
            if (cloud.y >= scrollY + this.scale.height + cloud.displayHeight) {
                cloud.y = scrollY - Phaser.Math.Between(cloud.displayHeight, cloud.displayHeight + 100)
                cloud.x = Phaser.Math.Between(0, this.scale.width)
            }
        })
        // --- End Cloud Recycling ---
    
        // --- Player Movement & Logic ---
        const touchingDown = this.player.body.touching.down
    
        if (touchingDown) {
            this.player.setVelocityY(-350)
            this.player.setTexture('bunny')
        }
    
        const vy = this.player.body.velocity.y
        if (vy > 0 && this.player.texture.key !== 'bunny') {
            this.player.setTexture('bunny')
        }
    
        if (this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200)
        } else if (this.cursors.right.isDown && !touchingDown) {
            this.player.setVelocityX(200)
        } else {
            this.player.setVelocityX(0)
        }
    
        this.horizontalWrap(this.player)
    
        // Check if the player has fallen below the bottom-most platform
        const bottomPlatform = this.findBottomMostPlatform()
        if (bottomPlatform && this.player.y > bottomPlatform.y + this.scale.height * 0.75) {
            if (this.physics.world.isPaused) return
            this.showRestartPopup()
        }
    }

    /**
     * Creates the Easter Egg sprite above a given platform.
     * @param {Phaser.Physics.Arcade.Sprite} platform The platform to place the egg on.
     */
    spawnEasterEgg(platform) {
        const eggX = platform.x;
        // Position egg centered horizontally on platform, just above its top surface
        const eggY = platform.getBounds().top - 15; // Adjust '15' based on egg sprite height/origin

        // Create the egg as a static sprite (it won't fall)
        this.easterEgg = this.physics.add.staticSprite(eggX, eggY, 'easter-egg');
        this.easterEgg.setScale(0.01); // Adjust scale as needed
        this.easterEgg.setDepth(0); // Render egg behind player but above clouds
        this.easterEgg.refreshBody(); // Update physics body after scaling/positioning

        // Now that the egg exists, add the overlap check
        this.physics.add.overlap(
            this.player,
            this.easterEgg,
            this.handleEggCollision, 
            null, // Optional overlap processing check
            this // Context for the callback
        );
    }

    /**
     * Handles collision between the player and the Easter egg.
     * @param {Phaser.Physics.Arcade.Sprite} player The player sprite.
     * @param {Phaser.Physics.Arcade.Sprite} egg The egg sprite.
     */
    handleEggCollision(player, egg) {
        // Pause the game physics and scene updates
        this.physics.pause();

        // Make the egg disappear
        egg.destroy();
        this.easterEgg = null; // Clear the reference
        this.scene.start('interlude2');
    }


    /**
     * @param {Phaser.GameObjects.Sprite} sprite
     */
    horizontalWrap(sprite)
    {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth)
        {
            sprite.x = gameWidth + halfWidth
        }
        else if (sprite.x > gameWidth + halfWidth)
        {
            sprite.x = -halfWidth
        }
    }

    findBottomMostPlatform() {
        const platforms = this.platforms.getChildren()
        if (platforms.length === 0) return null
    
        let bottomPlatform = platforms[0]
    
        for (let i = 1; i < platforms.length; i++) {
            const platform = platforms[i]
    
            if (platform.y > bottomPlatform.y) {
                bottomPlatform = platform
            }
        }
    
        return bottomPlatform
    }

    showRestartPopup() {
        // Pause the game
        this.physics.pause()
    
        // Create a semi-transparent background for the popup
        const popupBackground = this.add.rectangle(240, 260, 400, 200, 0x000000, 0.8)
    
        // Add text to the popup
        const popupText = this.add.text(240, 220, 'Restart Level?', {
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5)
    
        // Add a "Yes" button
        const yesButton = this.add.text(200, 280, 'Yes', {
            fontSize: '20px',
            color: '#00ff00',
        }).setOrigin(0.5).setInteractive()
    
        yesButton.on('pointerdown', () => {
            // Restart the level
            this.resetScene()
        })
    
        // Add a "No" button
        const noButton = this.add.text(280, 280, 'No', {
            fontSize: '20px',
            color: '#ff0000',
        }).setOrigin(0.5).setInteractive()
    
        noButton.on('pointerdown', () => {
            // Resume the game and hide the popup
            popupBackground.destroy()
            popupText.destroy()
            yesButton.destroy()
            noButton.destroy()
            this.physics.resume()
        })
    }
    resetScene() {
        // Destroy all physics objects
        this.player.destroy()
        this.platforms.clear(true, true)
        if (this.easterEgg) {
            this.easterEgg.destroy()
            this.easterEgg = null
        }
    
        // Reset state variables
        this.platformCount = 0
        this.eggSpawned = false
    
        // Restart the scene
        this.scene.restart()
    }
}