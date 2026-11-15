// engineer-connect.js — connects the Submit buttons to the Engineer minigames.
const MIN_READINESS = 55;   // design must be at least "Acceptable" to attempt launch

function connectMinigames(submitId, containerId, missionNumber) {
    document.getElementById(submitId).addEventListener('click', () => {

        // 1. Read the Mission Readiness % from the score panel
        const scoreText = document.querySelector(`#${containerId} .score-number`).textContent;
        const readiness = parseInt(scoreText);

        // 2. Bad design → mission fails before the minigames
        if (readiness < MIN_READINESS) {
            document.getElementById('launch-result-title').textContent = '❌ Launch scrubbed';
            document.getElementById('launch-result-text').textContent =
                `Mission readiness was only ${readiness}%. Adjust the sliders closer to what this mission needs and try again.`;
            showscreen('launch-result');
            return;
        }

        // 3. Good design → play the minigames
        setTimeout(() => {
            startEngineerMinigames(missionNumber, (success, reason) => {
                document.getElementById('launch-result-title').textContent =
                    success ? 'Launch successful!' : '❌ Mission failed';
                document.getElementById('launch-result-text').textContent = reason;
                showscreen('launch-result');
            });
        }, 800);   // short pause so the player sees "Design Submitted!"
    });
}

connectMinigames('submit-sliders',   'mission1-container', 1);
connectMinigames('submit-sliders-2', 'mission2-container', 2);
connectMinigames('submit-sliders-3', 'mission3-container', 3);

// "Back to menu" button on the result screen.
// Reloading resets all sliders and the Submit buttons for a clean new round.
document.getElementById('launch-result-btn').addEventListener('click', () => {
    location.reload();
});