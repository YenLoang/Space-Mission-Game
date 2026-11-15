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

// Start 
document.getElementById('start-btn').addEventListener('click', () => {
    showscreen('game-over-container');
});

// Restart 
document.getElementById('restart-btn').addEventListener('click', () => {
    showscreen('game-container');
});

// Engineer 
document.getElementById('Engineer').addEventListener('click', () => {
    showscreen('engineer-page2');
});

// Mission 
document.getElementById('mission1').addEventListener('click', () => {
    showscreen('engineer-miss1');
});

document.getElementById('mission2').addEventListener('click', () => {
    showscreen('engineer-miss2');
});

document.getElementById('mission3').addEventListener('click', () => {
    showscreen('engineer-miss3');
});



//SLIDER SHENANIGANS

function clamp(value) {
    return Math.max(0, Math.min(100, value));
}
//goals for each missions
const missionTargets = {
    mission1: {
        power: 75,
        mass: 35,
        flight: 80,
        fuel: 65,
        propulsion: 75,
        cost: 65
    },

    mission2: {
        power: 55,
        mass: 60,
        flight: 65,
        fuel: 80,
        propulsion: 60,
        cost: 75
    },

    mission3: {
        power: 85,
        mass: 25,
        flight: 90,
        fuel: 55,
        propulsion: 85,
        cost: 55
    }
};


// Set up each mission
function setupMissionSliders(sliderIds, missionName) {

    const sliders = sliderIds.map(id =>
        document.getElementById(id)
    );

    const [power, mass, flight, fuel, cost, propulsion] = sliders;

    const targets = missionTargets[missionName];

    // Cost is automatically calculated
    cost.disabled = true;

    // Create live numerical displays
    sliders.forEach((slider, index) => {

        const label = document.querySelector(
            `label[for="${slider.id}"]`
        );

        const valueDisplay = document.createElement("span");

        valueDisplay.className = "slider-value";
        valueDisplay.textContent = slider.value;

        label.appendChild(valueDisplay);

        slider.addEventListener("input", () => {
            valueDisplay.textContent = slider.value;
        });
    });


    // Create mission score display
    const missionContainer = document.getElementById(
        missionName.replace("mission", "mission") + "-container"
    );

    const scorePanel = document.createElement("div");
    scorePanel.className = "score-panel";

    scorePanel.innerHTML = `
        <h3>MISSION READINESS</h3>
        <div class="score-number">0%</div>
        <div class="score-bar">
            <div class="score-fill"></div>
        </div>
        <p class="score-status">Calculating spacecraft...</p>
    `;

    missionContainer.appendChild(scorePanel);

    const scoreNumber = scorePanel.querySelector(".score-number");
    const scoreFill = scorePanel.querySelector(".score-fill");
    const scoreStatus = scorePanel.querySelector(".score-status");


    // Calculate spacecraft cost
    function updateCost() {

        const calculatedCost =
            Number(power.value) * 0.15 +
            Number(mass.value) * 0.25 +
            Number(flight.value) * 0.15 +
            Number(fuel.value) * 0.10 +
            Number(propulsion.value) * 0.35;

        cost.value = Math.round(clamp(calculatedCost));
    }


    // Calculate mission success score
    function updateScore() {

        const values = {
            power: Number(power.value),
            mass: Number(mass.value),
            flight: Number(flight.value),
            fuel: Number(fuel.value),
            propulsion: Number(propulsion.value),
            cost: Number(cost.value)
        };

        // How close each system is to its ideal target
        const weights = {
            power: 0.15,
            mass: 0.15,
            flight: 0.25,
            fuel: 0.15,
            propulsion: 0.20,
            cost: 0.10
        };

        let totalScore = 0;

        for (const system in weights) {

            const difference = Math.abs(
                values[system] - targets[system]
            );

            const systemScore = Math.max(
                0,
                100 - difference * 1.5
            );

            totalScore += systemScore * weights[system];
        }

        const finalScore = Math.round(clamp(totalScore));

        scoreNumber.textContent = finalScore + "%";

        scoreFill.style.width = finalScore + "%";

        // Mission status
        if (finalScore >= 90) {
            scoreStatus.textContent = "Excellent! Mission ready!";
        }
        else if (finalScore >= 75) {
            scoreStatus.textContent = "Good! Systems looking strong.";
        }
        else if (finalScore >= 55) {
            scoreStatus.textContent = "Acceptable. Some improvements needed.";
        }
        else {
            scoreStatus.textContent = "Warning! Spacecraft needs adjustments.";
        }

        // Score animation
        scoreNumber.classList.remove("score-update");

        void scoreNumber.offsetWidth;

        scoreNumber.classList.add("score-update");
    }


    // Update everything together
    function updateAll() {

        sliders.forEach(slider => {
            const label = document.querySelector(
                `label[for="${slider.id}"]`
            );

            label.querySelector(".slider-value").textContent =
                slider.value;
        });

        updateCost();

        const costLabel = document.querySelector(
            `label[for="${cost.id}"]`
        );

        costLabel.querySelector(".slider-value").textContent =
            cost.value;

        updateScore();
    }


    // Track previous slider values
    let previousValues = sliders.map(slider =>
        Number(slider.value)
    );


    // Listen for player decisions
    sliders.forEach((slider, index) => {

        if (index === 4) return;

        slider.addEventListener("input", () => {

            const difference =
                Number(slider.value) - previousValues[index];

            function adjust(otherSlider, amount) {

                otherSlider.value = clamp(
                    Number(otherSlider.value) + amount
                );
            }

            // Engineering trade-offs
            switch (index) {

                case 0: // Electrical Power
                    adjust(mass, difference * 0.15);
                    break;

                case 1: // Mass
                    adjust(flight, difference * -0.35);
                    adjust(fuel, difference * 0.20);
                    break;

                case 2: // Flight
                    adjust(fuel, difference * -0.30);
                    break;

                case 3: // Fuel
                    adjust(mass, difference * 0.20);
                    break;

                case 5: // Propulsion
                    adjust(power, difference * 0.25);
                    adjust(flight, difference * 0.40);
                    adjust(fuel, difference * -0.35);
                    adjust(mass, difference * 0.15);
                    break;
            }

            // Save all updated values
            previousValues = sliders.map(slider =>
                Number(slider.value)
            );

            updateAll();
        });
    });


    // Submit engineering design
    const submitButtonId = {
        mission1: "submit-sliders",
        mission2: "submit-sliders-2",
        mission3: "submit-sliders-3"
};

    const submitButton = document.getElementById(
        submitButtonId[missionName]
);

    submitButton.addEventListener("click", () => {

        updateAll();

        scoreStatus.textContent += " Design submitted!";
        
        submitButton.textContent = "Design Submitted!";
        submitButton.disabled = true;
    });

    // Initial calculation
    updateAll();
}


// =====================================
// INITIALIZE ALL THREE MISSIONS
// =====================================

setupMissionSliders(
    ["slider1", "slider2", "slider3",
     "slider4", "slider5", "slider6"],
    "mission1"
);

setupMissionSliders(
    ["slider7", "slider8", "slider9",
     "slider10", "slider11", "slider12"],
    "mission2"
);

setupMissionSliders(
    ["slider13", "slider14", "slider15",
     "slider16", "slider17", "slider18"],
    "mission3"
);
