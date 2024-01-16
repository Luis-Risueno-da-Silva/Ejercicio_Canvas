export default class Player {

  /*
    Detectar si se ha pulsado uno de los 
    botones de dirección, o el botón de disparo.

    Si la acción se ejecuta, el valor de la variable es "true".
    Si la acción no se ejecuta, el valor de la variable es "false".
  */
  rightPressed = false;
  leftPressed = false;
  shootPressed = false;

  /*
    Los controles del jugador son:
      - Moverse a la derecha --> Flecha derecha
      - Moverse a la izquierda --> Flecha izquierda
      - Disparar balas --> Tecla de espacio
  */

  constructor(canvas, velocity, bulletController) {
    this.canvas = canvas;
    this.velocity = velocity;
    this.bulletController = bulletController;

    // Para que el jugador aparezca en la parte de abajo del juego y centrado
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;

    // Las dimensiones del jugador son de 50x48 pixels
    this.width = 50;
    this.height = 48;

    // Imagen del jugador
    this.image = new Image();
    this.image.src = "../assets/images/player.png";

    // Detectar cuando se pulsa una tecla
    document.addEventListener("keydown", this.keydown);

    // Detectar cuando se levanta el dedo de una tecla
    document.addEventListener("keyup", this.keyup);
  }

  // Dibujar al jugador
  draw(ctx) {
    if (this.shootPressed) {
      this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 10);
    }
    this.move();
    this.collideWithWalls();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  // Detectar cuando el jugador ha chocado con las paredes
  collideWithWalls() {
    // Pared de la izquierda
    if (this.x < 0) {
      this.x = 0;
    }

    // Pared de la derecha
    if (this.x > this.canvas.width - this.width) {
      this.x = this.canvas.width - this.width;
    }
  }

  // Mover al jugador al lado correspondiente con la velocidad indicada
  move() {
    // Mover el jugador a la derecha
    if (this.rightPressed) {
      this.x += this.velocity;

      // Mover el jugador a la izquierda
    } else if (this.leftPressed) {
      this.x += -this.velocity;
    }
  }

  // Detectar cuando el jugador pulsa una tecla
  keydown = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPressed = true;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = true;
    }
    if (event.code == "Space") {
      this.shootPressed = true;
    }
  };

  // Detectar cuando el jugador deja de pulsar una tecla
  keyup = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPressed = false;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = false;
    }
    if (event.code == "Space") {
      this.shootPressed = false;
    }
  };
}
