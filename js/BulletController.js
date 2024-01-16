import Bullet from "./Bullet.js";

export default class BulletController {

  // Array de balas en pantalla
  bullets = [];

  // Tiempo hasta que la siguiente bala puede ser disparada
  timeTillNextBulletAllowed = 0;

  constructor(canvas, maxBulletsAtATime, bulletColor, soundEnabled) {
    this.canvas = canvas;

    // El máximo de balas permitidas en pantalla a la vez
    this.maxBulletsAtATime = maxBulletsAtATime;

    // Color de la bala
    this.bulletColor = bulletColor;

    // El sonido puede estar acticado o no para los enemigos y el jugador
    this.soundEnabled = soundEnabled;

    // Sonido de disparo de bala 
    this.shootSound = new Audio("../assets/sounds/shoot.wav");
    this.shootSound.volume = 0.1;
  }

  // Dibujar las balas
  draw(ctx) {
    this.bullets = this.bullets.filter(
      (bullet) => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height
    );

    this.bullets.forEach((bullet) => bullet.draw(ctx));
    if (this.timeTillNextBulletAllowed > 0) {
      this.timeTillNextBulletAllowed--;
    }
  }

  // Detectar cuando las balas chocas con los enemigos y el jugador
  collideWith(sprite) {
    const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
      bullet.collideWith(sprite)
    );

    if (bulletThatHitSpriteIndex >= 0) {
      this.bullets.splice(bulletThatHitSpriteIndex, 1);
      return true;
    }

    return false;
  }

  // Disparar las balas
  shoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
    if (
      this.timeTillNextBulletAllowed <= 0 &&
      this.bullets.length < this.maxBulletsAtATime
    ) {
      const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
      this.bullets.push(bullet);
      if (this.soundEnabled) {

        // El sonido de disparo se reinicia cada vez que se dispara
        this.shootSound.currentTime = 0;
        this.shootSound.play();
      }
      this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
    }
  }
}
