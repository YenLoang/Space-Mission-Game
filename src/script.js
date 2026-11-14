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
const startBtnContainer = document.getElementById('button-container');
const options = document.getElementById('options');
const title = document.getElementById('title-container');

startBtn.addEventListener('click', () => {
    screen1.classList.add('hidden');
    screen2.classList.remove('hidden');
});

restartBtn.addEventListener('click', () => {
    screen1.classList.remove('hidden');
    screen2.classList.add('hidden');
});



const engineerPage2 = document.getElementById('engineer-page2');
const engineerMiss1 = document.getElementById('engineer-miss1');
const engineerMiss2 = document.getElementById('engineer-miss2');
const engineerMiss3 = document.getElementById('engineer-miss3');



//hide start button in second screen



document.getElementById('Engineer').addEventListener('click', () => {
    showscreen('engineer-page2');
    startBtnContainer.classList.add('hidden');
    options.classList.add('hidden');
    title.classList.add('hidden');
});

document.getElementById('mission1').addEventListener('click', () => {
    showscreen('engineer-miss1');
    startBtnContainer.classList.add('hidden');
    options.classList.add('hidden');
    title.classList.add('hidden');
    engineerPage2.classList.add('hidden');

});

document.getElementById('mission2').addEventListener('click', () => {
    showscreen('engineer-miss2');
    startBtnContainer.classList.add('hidden');
    options.classList.add('hidden');
    title.classList.add('hidden');
    engineerPage2.classList.add('hidden');
});

document.getElementById('mission3').addEventListener('click', () => {
    showscreen('engineer-miss3');
    startBtnContainer.classList.add('hidden');
    options.classList.add('hidden');
    title.classList.add('hidden');
    engineerPage2.classList.add('hidden');
});

//Engineering pg 3 mission1

