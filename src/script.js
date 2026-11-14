function showscreen(id) {
    //Hide every screen
    document.querySelectorAll('.screen'). forEach(screen => { screen.classList.add ('hidden');
    });
    //show only what we want 
    document.getElementById(id).classList.remove('hidden');
}
document.getElementById('start-btn').addEventListener('click', () => {showscreen ('game-screen');});