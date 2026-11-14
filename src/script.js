function showscreen(id) {
    //Hide every screen
    document.querySelectorAll('.screen'). forEach(screen => { screen.classList.add ('hidden');
    });
    //show only what we want 
    document.getElementById(id).classList.remove('hidden');
}
document.getElementById('start-btn').addEventListener('click', () => {showscreen ('game-screen');});



const screen1 = document.getElementById('game-container');
const screen2 = document.getElementById('game-over-container');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

startBtn.addEventListener('click', () => {
    screen1.classList.add('hidden');
    screen2.classList.remove('hidden');
});

restartBtn.addEventListener('click', () => {
    screen1.classList.remove('hidden');
    screen2.classList.add('hidden');
});
