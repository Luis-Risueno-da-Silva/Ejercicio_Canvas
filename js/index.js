import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

// Contenedor del juego
const game__div = document.getElementById("game__div");

// Contenedor del mensaje de victoria
const win__message = document.getElementById("win__message");

// Contenedor del mensaje de derrota
const lose__message = document.getElementById("lose__message");

// Obtener el contexto del canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

// Definir la imagen de fondo del juego
const background = new Image();
background.src = "../assets/images/space.png";

const playerBulletController = new BulletController(canvas, 10, "red", true);
const enemyBulletController = new BulletController(canvas, 4, "white", false);

// Nueva instancia de la clase EnemyController
const enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController
);

// Nueva instancia de la clase Player
const player = new Player(canvas, 3, playerBulletController);

let isGameOver = false;
let didWin = false;

// Función del juego
function game() {
  // Comprobar si el juego ha terminado
  checkGameOver();

  // Dibujar el fondo del juego
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  displayGameOver();

  // Si el juego no ha terminado...
  if (!isGameOver) {
    // Dibujar a los enemigos
    enemyController.draw(ctx);

    // Dibujar al jugador
    player.draw(ctx);

    // Dibujar las balas del jugador
    playerBulletController.draw(ctx);

    // Dibujar las balas del enemigo
    enemyBulletController.draw(ctx);
  }
}

// Función para mostrar la pantalla correspondiente cuando el juego haya terminado
function displayGameOver() {
  if (isGameOver == true) {

    // Si el juagdor gana la partida
    if(didWin == true){
      // Ocultar el juego
      game__div.classList.remove("game__div");
      game__div.classList.add("hide")

      // Mostrar el mensaje de victoria y un botón para reiniciar el juego
      win__message.classList.remove("hide")
      win__message.classList.add("show")
    }

    // Si el jugador pierde la partida
    if(didWin == false){
      // Ocultar el juego
      game__div.classList.remove("game__div")
      game__div.classList.add("hide")

      // Mostrar el mensaje de derrota y un botón para reiniciar el juego
      lose__message.classList.remove("hide")
      lose__message.classList.add("show")
    }

  }
}

// Función para comprobar si el juego ha terminado
function checkGameOver() {
  if (isGameOver) {
    return;
  }

  // La partida termina cuando el jugador recibe un disparo
  if (enemyBulletController.collideWith(player)) {
    isGameOver = true;
  }

  // La partida termina cuando un enemigo choca con el jugador
  if (enemyController.collideWith(player)) {
    isGameOver = true;
  }

  // La partida termina cuando ya no hay enemigos en pantalla.
  if (enemyController.enemyRows.length === 0) {
    didWin = true;
    isGameOver = true;
  }
}

// Se ejecutará la función "game" 60 veces cada segundo
setInterval(game, 1000 / 60);
