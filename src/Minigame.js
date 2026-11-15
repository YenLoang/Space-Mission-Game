const MGF_FUEL_ZONES = {
    1: {min: 30, max: 50, name: "Rescue"}, //Short trip 
    2: {min: 75, max: 85, name: "Distance" }, //Distance trip, travel
    3: {min: 55, max: 70, name: "Long-term orbit"},
};

const MG_WIRE_COLORS = ['red', 'green','blue', 'yellow'];
const MG_WIRE_TIME = 20;
const MG_FUEL_TRIES = 3;

function startEngineerMinigames(missionNumber, onDone) {
    const overlay = mgBuildOverlay();

    // Step 1: warning → Step 2: wires → Step 3: fuel → done
    mgShowWarning(overlay, () => {
        mgWireGame(overlay, (wiresOk) => {
            if (!wiresOk) return mgFinish(overlay, false, "Wiring wasn't repaired in time — the spacecraft lost power.", onDone);

            mgFuelGame(overlay, missionNumber, (fuelOk, reason) => {
                if (!fuelOk) return mgFinish(overlay, false, reason, onDone);
                mgFinish(overlay, true, "Wiring fixed and fuel loaded. Ready for launch!", onDone);
            });
        });
    });
}
// warning 
function mgBuildOverlay(){
    let overlay = document.getElementById('mg-overlay');
    if (overlay) overlay.remove();               // start fresh if played before
    overlay = document.createElement('div');
    overlay.id = 'mg-overlay';
    document.body.appendChild(overlay);
    return overlay;

}
function mgShowWarning(overlay, next) {
    overlay.innerHTML = `
        <div id="mg-warning">
            <p class="mg-title">⚠️ POWER FAULT!</p>
            <p class="mg-sub">Wiring was damaged during pre-launch checks.</p>
            <button class="mg-btn" id="mg-repair-btn">Repair</button>
        </div>`;
    document.getElementById('mg-repair-btn').addEventListener('click', next);
}
function mgWireGame(overlay, done) {
    overlay.innerHTML = `
        <p class="mg-title">Repair the wiring</p>
        <p class="mg-sub">Click a wire on the left, then its matching color on the right.</p>
        <div id="mg-wire-board">
            <svg id="mg-wire-lines"></svg>
            <div id="mg-left-wires"></div>
            <div id="mg-right-wires"></div>
        </div>
        <p class="mg-timer" id="mg-timer">⏱ ${MG_WIRE_TIME}s</p>
        <p class="mg-msg" id="mg-wire-msg"></p>`;
        let selected = null;
    let connected = 0;
    let timeLeft = MG_WIRE_TIME;
    let finished = false;

    // countdown timer
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('mg-timer').textContent = `⏱ ${timeLeft}s`;
        if (timeLeft <= 0 && !finished) {
            finished = true;
            clearInterval(timer);
            done(false);
        }
    }, 1000);
}
function makeWire(color, sideId) {
        const dot = document.createElement('div');
        dot.className = 'mg-wire';
        dot.style.background = color;
        dot.dataset.color = color;
        document.getElementById(sideId).appendChild(dot);
        return dot;
    }
     MG_WIRE_COLORS.forEach(color => {
        const dot = makeWire(color, 'mg-left-wires');
        dot.addEventListener('click', () => {
            if (dot.dataset.done || finished) return;
            document.querySelectorAll('#mg-left-wires .mg-wire').forEach(w => w.style.border = '');
            selected = dot;
            dot.style.border = '4px solid white';
        });
    });
    const shuffled = [...MG_WIRE_COLORS].sort(() => Math.random() - 0.5);
    shuffled.forEach(color => {
        const dot = makeWire(color, 'mg-right-wires');
        dot.addEventListener('click', () => {
            if (!selected || dot.dataset.done || finished) return;
            const msg = document.getElementById('mg-wire-msg');

            if (selected.dataset.color === dot.dataset.color) {
                mgDrawLine(selected, dot, color);
                selected.dataset.done = 'yes';
                dot.dataset.done = 'yes';
                connected++;
                msg.textContent = 'Connected ✔';

                if (connected === MG_WIRE_COLORS.length) {
                    finished = true;
                    clearInterval(timer);
                    msg.textContent = 'Wiring fixed! ⚡';
                    setTimeout(() => done(true), 1200);
                }
            } else {
                msg.textContent = 'Wrong wire! ⚠️';
            }
            selected.style.border = '';
            selected = null;
        });
    });
function mgDrawLine(a, b, color) {
    const box = document.getElementById('mg-wire-board').getBoundingClientRect();
    const r1 = a.getBoundingClientRect();
    const r2 = b.getBoundingClientRect();
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', r1.left + r1.width / 2 - box.left);
    line.setAttribute('y1', r1.top + r1.height / 2 - box.top);
    line.setAttribute('x2', r2.left + r2.width / 2 - box.left);
    line.setAttribute('y2', r2.top + r2.height / 2 - box.top);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', 8);
    line.setAttribute('stroke-linecap', 'round');
    document.getElementById('mg-wire-lines').appendChild(line);
}






