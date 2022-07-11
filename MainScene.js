import * as  Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MainScene',
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: {x: 0, y: 300, z: 0}
        }
      }
    })
    //some config properties
    this.dinoSpeed = 10;
    this.cloudSpeed = 5;
    this.smallCloudSpeed = 3;
    this.dinoGravity = 800;
    this.dinoVelocityY = 600;
  }

  preload() {
    this.load.spritesheet('dino', '/assets/dino-run.png', {
      frameWidth: 5440 / 8,
      frameHeight: 450,
    });
    this.load.spritesheet('dino-jump', '/assets/jump.png', {
      frameWidth: 8160 / 12,
      frameHeight: 450,
    });
    this.load.spritesheet('rocks', '/assets/rocks.png', {
      frameWidth: 1260 / 7,
      frameHeight: 180
    })
    this.load.image('platform', '/assets/platform.png');
    this.load.image('sky', '/assets/game-background.png');
    this.load.image('cloud-white', '/assets/clouds-white.png');
    this.load.image('cloud-white-small', '/assets/clouds-white-small.png');
  }

  create() {
    //background
    this.add.image(400, 300, 'sky').setScale(2);
    //phaser images are centered positioned by default
    this.cloudsWhite = this.add.tileSprite(640, 200, 1280, 400, "cloud-white");
    this.cloudsWhiteSmall = this.add.tileSprite(640, 200, 1280, 400, "cloud-white-small");
    //build platform
    this.platform = this.add.tileSprite(600, 560, 1300, 80, 'platform').setDepth(1);
    //enable physics so the dinosaur can stand on the platform
    this.physics.add.existing(this.platform, true);
    //build rocks (obstacles)
    this.rock = this.buildRandomRocks(2000);
    //build player
    this.dino = this.physics.add.sprite(200, 0, 'dino');
    this.dino.setScale(0.2)
    this.dino.body.setGravityY(this.dinoGravity)

    //collision detections
    this.physics.add.collider(this.dino, this.platform);
    this.dino.setCollideWorldBounds(true);

    this.physics.add.collider(this.dino, this.rock, (dino, rock) => {
      //hande game over
      console.log('game over');
      this.physics.pause();
      this.dino.anims.stop()
      this.cloudSpeed = 0;
      this.dinoSpeed = 0;
      this.smallCloudSpeed = 0;
      alert('Game Over');
    }, null);
    //create animations
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('dino', {start: 0, end: 7}),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('dino-jump', {start: 0, end: 11}),
      frameRate: 12,
      repeat: -1
    })
    this.dino.play('run');
    //setup controls
    this.cursors = this.input.keyboard.createCursorKeys();
    //touch controls for mobile
    this.input.on('pointerdown', (pointer) => {
      if (this.dino.body.touching.down) {
        this.dino.setVelocityY(-this.dinoVelocityY);
        this.dino.play('jump');
      }
    })
    console.log(this.dino.y)
  }

  update(time, delta) {
    this.cloudsWhite.tilePositionX += this.cloudSpeed
    this.cloudsWhiteSmall.tilePositionX += this.smallCloudSpeed;
    this.platform.tilePositionX += this.dinoSpeed;
    this.rock.x -= this.dinoSpeed;
    //player pass the rock => generate new rock
    if (!this.cameras.main.worldView.contains(this.rock.x, this.rock.y) && this.dino.x > this.rock.x) {
      this.rock.destroy(true);
      this.rock = this.buildRandomRocks(this.rock.x + this.randomIntFromInterval(1000, 2000));
      this.physics.add.collider(this.dino, this.rock, () => {
        //hande game over
        console.log('game over');
        this.physics.pause();
        this.dino.anims.stop()
        this.cloudSpeed = 0;
        this.dinoSpeed = 0;
        this.smallCloudSpeed = 0;
        alert('Game Over');
      })
    }
    //SPACE TO JUMP
    if (this.cursors.space.isDown && this.dino.body.touching.down) {
      this.dino.setVelocityY(-this.dinoVelocityY);
      this.dino.play('jump');
    }
    if (this.dino.anims.currentAnim.key === 'jump' && this.dino.body.touching.down) {
      this.dino.play('run');
    }

  }

  buildRandomRocks(x) {
    const frameId = this.randomIntFromInterval(0, 6);
    const rock = this.physics.add.image(x, 500, 'rocks', frameId).setDepth(0);
    rock.body.setAllowGravity(false);
    return rock

  }

  //utils
  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}