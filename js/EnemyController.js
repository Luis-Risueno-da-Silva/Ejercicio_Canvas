// Importar clase/s
import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

export default class EnemyController {

  /*
    Mapa de los enemigos:
    1 --> Enemigo naranja
    2 --> Enemigo verde
    3 --> Enemigo azul
  */
  enemyMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 2, 3, 3, 3, 3, 2, 1, 2],
    [2, 1, 2, 3, 3, 3, 3, 2, 1, 2],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 1, 3, 1, 3, 1, 3, 1, 3, 2],
  ];
  enemyRows = [];

  // Dirección a la que se mueven los enemigos cuando empieza el juego
  currentDirection = MovingDirection.right;

  // Velocidad en el eje x e y de los enemigos
  xVelocity = 0;
  yVelocity = 0;

  /*
    Velocidad por defecto en el eje x e y del enemigo.
    Si se incrementa, los enemigos se moverán más rápido.
  */
  defaultXVelocity = 1;
  defaultYVelocity = 1;

  /*
    Los enemigos se moveran hacia abajo cuando choquen en 
    una pared hasta que este temporizador llegue a 0. 
  */
  moveDownTimerDefault = 30;
  moveDownTimer = this.moveDownTimerDefault;

  // Tiempo que transcurre hasta que los enemigos pueden volver a disparar una bala
  fireBulletTimerDefault = 100;
  fireBulletTimer = this.fireBulletTimerDefault;

  // Constructor
  constructor(canvas, enemyBulletController, playerBulletController) {
    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;
    this.playerBulletController = playerBulletController;

    // Sonido de muerte del enemigo
    this.enemyDeathSound = new Audio("../assets/sounds/enemyDeath.wav");
    this.enemyDeathSound.volume = 0.1;

    this.createEnemies();
  }

  // Dibujar a los enemigos
  draw(ctx) {
    this.decrementMoveDownTimer();
    this.updateVelocityAndDirection();
    this.collisionDetection();
    this.drawEnemies(ctx);
    this.resetMoveDownTimer();
    this.fireBullet();
  }

  // Detectar la colsisión de las balas del jugador con los enemigos
  collisionDetection() {
    this.enemyRows.forEach((enemyRow) => {
      enemyRow.forEach((enemy, enemyIndex) => {
        if (this.playerBulletController.collideWith(enemy)) {

          // Se reproducirá el sonido de muerte del enemigo cada vez que se elimine a un enemigo
          this.enemyDeathSound.currentTime = 0;
          this.enemyDeathSound.play();

          enemyRow.splice(enemyIndex, 1);
        }
      });
    });

    this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
  }

  /*
    Para que los enemigos disparen balas.
    Las balas serán disparadas por enemigos aleatorios
  */
  fireBullet() {
    this.fireBulletTimer--;
    if (this.fireBulletTimer <= 0) {
      this.fireBulletTimer = this.fireBulletTimerDefault;

      // flat() se utiliza para que un array de 2 dimensiones se convierta en un array de una dimensión.
      const allEnemies = this.enemyRows.flat();
      const enemyIndex = Math.floor(Math.random() * allEnemies.length);
      const enemy = allEnemies[enemyIndex];

      // La fórmula que se ve aquí se utiliza para que la bala del enemigo salga del centro de este
      this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
    }
  }

  // Resetear el temporizador utilizado para que los enemigos se muevan hacia abajo
  resetMoveDownTimer() {
    if (this.moveDownTimer <= 0) {
      this.moveDownTimer = this.moveDownTimerDefault;
    }
  }

  // Decrementar el temporizador utilizado para que los enemigos se muevan hacia abajo
  decrementMoveDownTimer() {
    if (
      this.currentDirection === MovingDirection.downLeft ||
      this.currentDirection === MovingDirection.downRight
    ) {
      this.moveDownTimer--;
    }
  }

  // Actualizar la velocidad y la dirección de movimiento de los enemigos
  updateVelocityAndDirection() {
    for (const enemyRow of this.enemyRows) {

      // Cuando los enemigos se mueven a la derecha
      if (this.currentDirection == MovingDirection.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;
        const rightMostEnemy = enemyRow[enemyRow.length - 1];

        // Si un enemigo toca el borde derecho del juego, los enemigos empiezan a moverse hacia abajo
        if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
          this.currentDirection = MovingDirection.downLeft;
          break;
        }

        // Los enemigos se mueven a la izquierda cuando dejan de moverse hacia abajo
      } else if (this.currentDirection === MovingDirection.downLeft) {
        if (this.moveDown(MovingDirection.left)) {
          break;
        }

        // Cuando los enemigos se mueven hacia la izquierda
      } else if (this.currentDirection === MovingDirection.left) {
        this.xVelocity = -this.defaultXVelocity;
        this.yVelocity = 0;
        const leftMostEnemy = enemyRow[0];
        if (leftMostEnemy.x <= 0) {
          this.currentDirection = MovingDirection.downRight;
          break;
        }

        // Los enemigos se mueven a la derecha cuando dejan de moverse hacia abajo
      } else if (this.currentDirection === MovingDirection.downRight) {
        if (this.moveDown(MovingDirection.right)) {
          break;
        }
      }
    }
  }

  // Cuando los enemigos se mueven hacia abajo
  moveDown(newDirection) {
    this.xVelocity = 0;
    this.yVelocity = this.defaultYVelocity;
    if (this.moveDownTimer <= 0) {
      this.currentDirection = newDirection;
      return true;
    }
    return false;
  }

  // Dibujar a los enemigos
  drawEnemies(ctx) {
    this.enemyRows.flat().forEach((enemy) => {
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
    });
  }

  happy = () => {};

  // Crear a los enemigos
  createEnemies() {
    this.enemyMap.forEach((row, rowIndex) => {
      this.enemyRows[rowIndex] = [];
      row.forEach((enemyNubmer, enemyIndex) => {
        if (enemyNubmer > 0) {
          this.enemyRows[rowIndex].push(
            new Enemy(enemyIndex * 50, rowIndex * 35, enemyNubmer)
          );
        }
      });
    });
  }

  // Detectar cuando un eneimigo ha chocado con el jugador
  collideWith(sprite) {
    return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
  }
}
