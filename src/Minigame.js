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

function mgFuelGame(overlay, missionNumber, done){
    const zone = MGF_FUEL_ZONES[missionNumber] || MGF_FUEL_ZONES[1];

    overlay.innerHTML = `
    <p class = "mg-title">Load the Fuel</p>
    <p class ="mg-sub">${zone.name} mission: hold the button and let go in the green zome.</p>
    <div id="mg-tank">
        <div id="mg-zone"></div>
        <div id ="mg-fuel"></div>
    </div>
    <button class="mg-btn" id="mg-fill-btn">Hold to fill </button>
        <p class="mg-msg" id="mg-fuel-msg">Tries left: ${MG_FUEL_TRIES}</p>`;
    
    //green zone on the tank 
    const zoneE1 = document.getElementById('mg-zone');
    zoneE1.style.bottom = zone.min +'%';
    zoneE1.style.height = (zone.max - zone.min) +'%'

    const fuelE1 = document.getElementById('mg-fuel');
    const btn = document.getElementById('mg-fill-btn');
    const msg = document.getElementById('mg-fuel-msg');

    let level = 0;
    let filling = null;
    let tries = MG_FUEL_TRIES;
    let locked = false;

    function startFill(e){
        e.preventDefault();
        if (filling || locked) return;
        level =0;
        fuelE1.style.height ='0%'
        filling = setInterval(() => {
            level += 0.8
            if (level >= 100) level = 100;
            fuelE1.style.height = level + '%';

        }, 20);

    }

    function stopFilling(){
        if (!filling) return;
        clearInterval(filling);
        filling = null;
        locked = true;
        tries--;

        const pct = Math.round(level);
        if (level >= zone.min && level <= zone.max){
            msg.textContent = `Fuel loaded: ${pct}% ✔`;
            setTimeout(() => done(true), 1200);
            return;
        }

    }
        const tooLow = level <zone.min;
        const reason = tooLow
        ? `Not enough fuel (${pct}%) — the spacecraft can't reach its destination.`
            : `Too much fuel (${pct}%) — the rocket is too heavy to lift off.`;
        
        if (tries <= 0) {
            msg.textContent = reason;
            setTimeout(() => done(false, reason), 1500);
        } else {
            msg.textContent = `${tooLow ? 'Too low!' : 'Too high!'} ${pct}% — tries left: ${tries}`;
            setTimeout(() => { locked = false; }, 800);
        }

    btn.addEventListener('mousedown', startFill);
    btn.addEventListener('touchstart', startFill);
    btn.addEventListener('mouseup', stopFill);
    btn.addEventListener('mouseleave', stopFill);
    btn.addEventListener('touchend', stopFill);
    }

    function mgFinish(overlay, success, reason, onDone) {
    overlay.innerHTML = `
        <p class="mg-title">${success ? '✅ All systems go' : '❌ Mission failed'}</p>
        <p class="mg-sub">${reason}</p>
        <button class="mg-btn" id="mg-continue-btn">Continue</button>`;
    document.getElementById('mg-continue-btn').addEventListener('click', () => {
        overlay.remove();
        if (onDone) onDone(success, reason);
    });
}
        


    








