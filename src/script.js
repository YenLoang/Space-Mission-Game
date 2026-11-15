function showscreen(id) {
    //Hide every screen
    document.querySelectorAll('.screen'). forEach(screen => { screen.classList.add ('hidden');
    });
    //show only what we want 
    document.getElementById(id).classList.remove('hidden');
}



const screen1 = document.getElementById('game-container');
const screen2 = document.getElementById('game-over-container');


const startBtnContainer = document.getElementById('button-container');
const options = document.getElementById('options');
const title = document.getElementById('title-container');

const engineeringPage = document.getElementById('engineer-page2');

// Start button
document.getElementById('start-btn').addEventListener('click', () => {
    showscreen('game-over-container');
});

// Restart button
document.getElementById('restart-btn').addEventListener('click', () => {
    showscreen('game-container');
});

// Engineer selection
document.getElementById('Engineer').addEventListener('click', () => {
    showscreen('engineer-page2');
});

// Mission selection
document.getElementById('mission1').addEventListener('click', () => {
    showscreen('engineer-miss1');
});

document.getElementById('mission2').addEventListener('click', () => {
    showscreen('engineer-miss2');
});

document.getElementById('mission3').addEventListener('click', () => {
    showscreen('engineer-miss3');
});