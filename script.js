const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');

let gameOver = false;

class Raquete {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 100;
        this.speed = 6;
        this.dy = 0;
    }

    move() {
        this.y += this.dy;
        this.y = Math.max(Math.min(this.y, canvas.height - this.height), 0);
    }

    draw(ctx) {
        ctx.fillStyle = "white"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Bola {
    constructor() {
        this.size = 10;
        this.speedMultiplier = 1; // Inicializa o multiplicador de velocidade
        this.reset();
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
        this.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
        this.speedMultiplier = 1; // Reseta a velocidade ao reiniciar
        gameOver = false;
    }

    update(leftPaddle, rightPaddle) {
        if (gameOver) return;

        this.x += this.dx * this.speedMultiplier;
        this.y += this.dy * this.speedMultiplier;

        // Rebote nas bordas superiores e inferiores
        if (this.y <= 0 || this.y >= canvas.height - this.size) {
            this.dy *= -1;
        }

        // Colisão com as raquetes + aumento de velocidade
        if (
            (this.x <= leftPaddle.x + leftPaddle.width && this.y > leftPaddle.y && this.y < leftPaddle.y + leftPaddle.height) ||
            (this.x >= rightPaddle.x - this.size && this.y > rightPaddle.y && this.y < rightPaddle.y + rightPaddle.height)
        ) {
            this.dx *= -1;
            this.speedMultiplier += 0.1; // Aumenta a velocidade a cada colisão
            this.speedMultiplier = Math.min(this.speedMultiplier, 2); // Limita a velocidade para evitar que fique impossível
        }

        // Game Over se a bola sair da tela
        if (this.x <= 0 || this.x >= canvas.width) {
            gameOver = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Jogo {
    constructor() {
        this.canvas = document.getElementById("JogoCanvas")
        this.ctx = this.canvas.getContext("2d")

        this.leftPaddle = new Raquete(0, this.canvas.height / 2 - 50)
        this.rightPaddle = new Raquete(this.canvas.width - 10, this.canvas.height / 2 - 50)
        this.ball = new Bola()

        this.initControls()
        this.gameLoop()
    }

    initControls() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp") this.rightPaddle.dy = -this.rightPaddle.speed
            if (event.key === "ArrowDown") this.rightPaddle.dy = this.rightPaddle.speed
            if (event.key === "w") this.leftPaddle.dy = -this.leftPaddle.speed
            if (event.key === "s") this.leftPaddle.dy = this.leftPaddle.speed
            if (event.key === " " && gameOver) this.restartGame() // Reinicia com Space
        })

        document.addEventListener("keyup", (event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") this.rightPaddle.dy = 0
            if (event.key === "w" || event.key === "s") this.leftPaddle.dy = 0
        })
    }

    restartGame() {
        this.ball.reset()
        this.leftPaddle.y = this.canvas.height / 2 - 50
        this.rightPaddle.y = this.canvas.height / 2 - 50
        gameOver = false

        // Reinicia o loop do jogo
        this.gameLoop()
    }

    gameLoop() {
        this.update()
        this.draw()

        if (!gameOver) {
            requestAnimationFrame(() => this.gameLoop())
        } else {
            this.displayGameOver()
        }
    }

    update() {
        this.leftPaddle.move()
        this.rightPaddle.move()
        this.ball.update(this.leftPaddle, this.rightPaddle)
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.leftPaddle.draw(this.ctx)
        this.rightPaddle.draw(this.ctx)
        this.ball.draw(this.ctx)
    }

    displayGameOver() {
        this.ctx.fillStyle = "white"
        this.ctx.font = "40px Arial"
        this.ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2)
        this.ctx.font = "20px Arial"
        this.ctx.fillText("Pressione Space para reiniciar", canvas.width / 2 - 120, canvas.height / 2 + 40)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Jogo()
})