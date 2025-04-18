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

    constructor()
    {
        super({ key: 'cloud-level' });
    }

    init()
    {
    }

    preload() {
        this.load.image('background', 'assets/images/bg_layer1.png')
        this.load.image('cloud', 'assets/images/cloud.png')
        this.load.image('bunny-stand', 'assets/images/bunny1.png')
        this.load.image('bunny-jump', 'assets/images/bunny2.png')
        this.load.image('platform', 'assets/images/ground.png')
    }

    create()
    {
        this.add.image(240, 320, 'background').setScrollFactor(1, 0)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.clouds = this.add.group();
        for (let index = 0; index < 3; index++)
        {
            const x = Phaser.Math.Between(0, 480)
            const y = 250 * index;
            this.clouds.add(this.add.image(x, y, 'cloud'))
        }
        this.platforms = this.physics.add.staticGroup()

        for (let i = 0; i < 5; i++)
        {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i;

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'platform')
            platform.setScale(0.5)

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            // @ts-ignore
            const body = platform.body
            body.updateFromGameObject()
        }

        this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false

        this.physics.add.collider(this.platforms, this.player)

        this.cameras.main.startFollow(this.player)
        this.cameras.main.setDeadzone(this.scale.width * 1.5)
    }

    update()
    {
        this.platforms.children.iterate(child =>
        {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            // @ts-ignore
            const platform = child

            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 640)
            {
                platform.y = scrollY - Phaser.Math.Between(80, 120)
                platform.x = Phaser.Math.Between(40, 440)
                platform.body.updateFromGameObject()
            }
        })

        this.clouds.children.iterate(child =>
        {
            /** @type {Phaser.GameObjects.Image} */
            // @ts-ignore
            const cloud = child

            const scrollY = this.cameras.main.scrollY
            if (cloud.y >= scrollY + 800)
            {
                cloud.y = scrollY - Phaser.Math.Between(20, 60)
            }
        })

        const touchingDown = this.player.body.touching.down;

        if (touchingDown)
        {
            this.player.setVelocityY(-300)
            this.player.setTexture('bunny-jump')
        }

        const vy = this.player.body.velocity.y
        if (vy > 0 && this.player.texture.key !== 'bunny-stand')
        {
            this.player.setTexture('bunny-stand')
        }

        if (this.cursors.left.isDown && !touchingDown)
        {
            this.player.setVelocityX(-200)
        }
        else if (this.cursors.right.isDown && !touchingDown)
        {
            this.player.setVelocityX(200)
        }
        else
        {
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)

        const bottomPlatform = this.findBottomMostPlatform()
        if (this.player.y > bottomPlatform.y + 200)
        {
            this.scene.start('game-over')
        }
    }

    /**
     * @param {Phaser.GameObjects.Sprite} sprit 
     */
    horizontalWrap(sprit)
    {
        const halfWidth = sprit.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprit.x < -halfWidth)
        {
            sprit.x = gameWidth + halfWidth
        }
        else if (sprit.x > gameWidth + halfWidth)
        {
            sprit.x = -halfWidth
        }
    }

    findBottomMostPlatform()
    {
        const platforms = this.platforms.getChildren()
        let bottomPlatform = platforms[0]

        for (let i = 1; i < platforms.length; i++)
        {
            const platform = platforms[i]

            if (platform.y < bottomPlatform.y)
            {
                continue;
            }

            bottomPlatform = platform;
        }

        return bottomPlatform;
    }
}