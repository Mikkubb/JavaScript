//Rendering -> Frame Rendering Stats //Max 240 kulek, Odległość 50
const canvas = document.getElementById('Canvas'); //Pobieranie element canvas z dokumentu HTML
const ctx = canvas.getContext('2d'); //Pobieranie kontekstu 2D rysowania na canvas
//Pobieranie przycisków oraz pola input z dokumentu HTML
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const numberBallsInput = document.getElementById('numberBallsInput');
const minDistanceInput = document.getElementById('minDistanceInput');

//Inicjowanie pustej tablicy dla kulek
let balls = [];
//Początkowa liczba kulek i odległość między nimi
let numberBalls = parseInt(numberBallsInput.value);
let minDistance = parseInt(minDistanceInput.value);
//Promień kuli
const ballRadius = 7;
//Zmienna śledząca, czy animacja jest uruchomiona
let animationRunning = false;

//Funkcja inicjująca kulki
function initialize() {
  balls = [];
  for (let i = 0; i < numberBalls; i++) {
    balls.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
    });
  }
}

//Funkcja rysująca kulke
function drawBall(ball) {
  ctx.beginPath(); //Rozpoczęcie nowej ścieżki rysowania.
  ctx.arc(ball.x, ball.y, ballRadius, 0, 5 * Math.PI);
  ctx.fillStyle = '#404040';
  ctx.fill();
  ctx.closePath(); //Zakończenie bieżącej ścieżki rysowania (połączenie ostatniego punktu z pierwszym punktem w ścieżce)
}

//Funkcja rysująca linię między kulami
function drawLine(ball1, ball2) {
  ctx.beginPath();
  ctx.moveTo(ball1.x, ball1.y); //Przeniesienie punktu początkowego linii do pozycji pierwszej kuli
  ctx.lineTo(ball2.x, ball2.y); //Rysowanie linii do pozycji drugiej kuli
  ctx.strokeStyle = 'red'; //Ustawianie koloru linii
  ctx.stroke();  //Rysowanie linii
  ctx.closePath();
}

//Funkcja rysująca animację
function draw() {
  //Czyszczenie obszaru canvas przed każdym rysowaniem nowej klatki
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Iterowanie przez kule i rysowanie ich
  for (let i = 0; i < numberBalls; i++) {
    const ball = balls[i];

    //Sprawdzanie, czy kula istnieje
    if (ball) {
      //Aktualizowanie pozycji kuli na podstawie prędkości
      ball.x += ball.dx;
      ball.y += ball.dy;

      //Sprawdzanie kolizji z krawędziami canvas
      if (ball.x - ballRadius < 0 || ball.x + ballRadius > canvas.width) {
        ball.dx = -ball.dx;
      }
      if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
        ball.dy = -ball.dy;
      }

      //Rysowanie kuli
      drawBall(ball);

      //Sprawdzanie odległości między kulami i rysowanie linii, jeśli jest mniejsza niż zdefiniowana
      for (let j = i + 1; j < numberBalls; j++) {
        const otherBall = balls[j];
        const distance = Math.sqrt((ball.x - otherBall.x) ** 2 + (ball.y - otherBall.y) ** 2);

        if (distance < minDistance) {
          drawLine(ball, otherBall);
        }
      }
    }
  }

  //Jeśli animacja jest uruchomiona, kontynuuj rysowanie
  if (animationRunning) {
    requestAnimationFrame(draw);
  }
}

//Funkcja rozpoczynająca animację po naciśnięciu przycisku "Start"
function startAnimation() {
  //Pobieranie nowej liczby kulek i odległości między nimi
  numberBalls = parseInt(numberBallsInput.value);
  minDistance = parseInt(minDistanceInput.value);
  //Zainicjuj kule i uruchom animację
  initialize();
  animationRunning = true;
  draw();
}

//Funkcja resetująca animację po naciśnięciu przycisku "Reset"
function resetAnimation() {
  animationRunning = false; //Zatrzymywanie animacji
  numberBallsInput.value = 100; //Ustaw domyślną liczbę kulek
  minDistanceInput.value = 50;
  //Zainicjuj kule i wyczyść tablicę
  initialize();
  balls = [];
}

//Rejestrowanie przycisków "Start" i "Reset"
startButton.addEventListener('click', startAnimation);
resetButton.addEventListener('click', resetAnimation);

//Ustawianie szerokości i wysokości canvas na cały rozmiar okna
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Rejestrowanie zdarzenia zmiany rozmiaru okna, aby dostosować canvas
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //Zresetuj animację po zmianie rozmiaru
  resetAnimation();
});

// Zainicjuj animację po załadowaniu strony
resetAnimation();
