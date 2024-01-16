export default class Enemy {
  constructor(x, y, imageNumber) {
    this.x = x;
    this.y = y;

    // Los enemigos tienen un tamaño de 44x32 pixels
    this.width = 44;
    this.height = 32;

    // Imagen utilizada para dibujar al enemigo
    this.image = new Image();
    this.image.src = '../assets/images/enemy'+imageNumber+'.png';
  }

  // Dibujar al enemigo
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  // Mover a los enemigos
  move(xVelocity, yVelocity) {
    this.x += xVelocity;
    this.y += yVelocity;
  }

  // Cuando los enemigos colisionan con las balas del jugador
  collideWith(sprite) {
    if (
      this.x + this.width > sprite.x &&
      this.x < sprite.x + sprite.width &&
      this.y + this.height > sprite.y &&
      this.y < sprite.y + sprite.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}
