// (Removed unused microphone / cake vars)

// Создание сердечек на фоне
function createHearts() {
    const area = document.getElementById("hearts");

    for (let i = 0; i < 100; i++) {
        const heart = document.createElement("div");

        heart.className = "heart";
        heart.innerHTML = Math.random() > 0.5 ? "❤️" : "💖";

        heart.style.left = Math.random() * 100 + "%";
        heart.style.fontSize = (15 + Math.random() * 45) + "px";
        heart.style.animationDuration = (6 + Math.random() * 8) + "s";
        heart.style.animationDelay = Math.random() * 8 + "s";

        if (area) area.appendChild(heart);
    }
}

window.onload = createHearts;

// Подарок 1

// Entry gate logic — validate answer before showing page
function gateValid(input) {
    if (!input) return false;
    const v = input.toString().toLowerCase().trim();
    // If user used date picker, value will be yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        return v === '2026-04-01';
    }
    // Accept textual forms containing day, month and year
    // e.g. '1 april 2026', 'april 1 2026', '1 april'
    if (v.includes('2026') && v.includes('april') && (v.includes('1') || v.includes('01') )) return true;
    if (v.includes('april') && v.includes('1')) return true;
    return false;
}

function unlockEntry() {
    const gate = document.getElementById('entryGate');
    if (gate) gate.style.display = 'none';
    document.body.style.overflow = '';
    // show a short birthday greeting overlay, then reveal gifts
    const existing = document.getElementById('birthdayCover');
    if (existing) existing.remove();
    const cover = document.createElement('div');
    cover.id = 'birthdayCover';
    cover.className = 'birthday-cover';
    cover.innerHTML = `
        <div class="birthday-card">
            <h2>Happy Birthday, my heart💗</h2>
            <p class="birthday-text">Exactly nineteen years ago, the most beautiful, incredible, intelligent, kind, sweet, adorable, and amazing girl in the world was born. Nineteen years ago, Allah blessed this world with someone whose heart would one day completely change my life. The very same girl I fell in love with, the same girl I still love with all my heart today, and the same girl I will continue to love forever, Insha'Allah💗</p>
            <div style="margin-top:18px; display:flex; gap:10px; justify-content:center;">
                <button class="cover-play" id="birthdayOkay">Let's celebrate</button>
            </div>
        </div>
    `;
    document.body.appendChild(cover);

    const reveal = () => {
        const b = document.getElementById('birthdayCover');
        if (b) b.remove();
        const gifts = document.getElementById('gifts');
        if (gifts) {
            gifts.style.display = 'block';
            gifts.classList.add('show');
        }
    };

    // allow manual proceed
    setTimeout(() => {
        const btn = document.getElementById('birthdayOkay');
        if (btn) btn.addEventListener('click', reveal);
    }, 50);

    // auto-reveal removed; proceed when user clicks the button
}

function showGateError(msg) {
    const err = document.getElementById('gateError');
    if (err) err.textContent = msg;
}

document.addEventListener('DOMContentLoaded', function () {
    const submit = document.getElementById('entrySubmit');
    const input = document.getElementById('entryInput');

    // Prevent scrolling while gate is visible
    document.body.style.overflow = 'hidden';

    if (submit && input) {
        submit.addEventListener('click', function () {
            const val = input.value || '';
            if (gateValid(val)) {
                unlockEntry();
            } else {
                showGateError('Incorrect answer. Try again.');
            }
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submit.click();
            }
        });

        // focus input
        input.focus();
    }
});

// Birthday-first behavior removed — using entry gate (April 1)

function musicGift() {
    const iframe = document.getElementById('giftVideo');
    if (iframe && iframe.dataset && iframe.dataset.src) {
        iframe.src = iframe.dataset.src + '?autoplay=1&rel=0';
    }
    document.getElementById("gifts").style.display = "none";
    document.getElementById("coverPage").style.display = "flex";
}

function closeCover() {
    const iframe = document.getElementById('giftVideo');
    if (iframe) iframe.src = '';
    document.getElementById("coverPage").style.display = "none";
    document.getElementById("gifts").style.display = "block";
}

// Typewriter helper that progressively appends HTML to a container.
// It inserts HTML tags instantly (so formatting like <strong> is preserved)
// and types visible characters one by one. Keeps the container scrolled to bottom.
function typeHTML(targetEl, fullHtml, speed = 20, callback) {
    if (!targetEl || !fullHtml) return;
    // cancel any previous typing on this element
    if (targetEl._typeController && targetEl._typeController.cancel) {
        try { targetEl._typeController.cancel(); } catch (e) {}
    }

    const baseSpeed = Math.max(6, speed);
    const controller = { active: true, timer: null, cancel: null };
    targetEl._typeController = controller;

    // Parse HTML once
    const doc = new DOMParser().parseFromString('<div>' + fullHtml + '</div>', 'text/html');
    const sourceNodes = Array.from(doc.body.firstChild.childNodes);

    // Collect text nodes and build DOM skeleton with empty text nodes
    const textNodes = [];

    function cloneAndCollect(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const tn = document.createTextNode('');
            textNodes.push({ node: tn, full: node.nodeValue, pos: 0 });
            return tn;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = document.createElement(node.nodeName.toLowerCase());
            // copy attributes
            for (let i = 0; i < node.attributes.length; i++) {
                const a = node.attributes[i];
                try { el.setAttribute(a.name, a.value); } catch (e) {}
            }
            // recurse children
            for (let c = 0; c < node.childNodes.length; c++) {
                el.appendChild(cloneAndCollect(node.childNodes[c]));
            }
            return el;
        }
        return document.createTextNode('');
    }

    // Clear target and append skeleton
    targetEl.innerHTML = '';
    for (const n of sourceNodes) {
        targetEl.appendChild(cloneAndCollect(n));
    }

    // caret
    const caret = document.createElement('span');
    caret.className = 'typing-caret';
    targetEl.appendChild(caret);

    function cleanup() {
        if (caret && caret.parentElement) caret.remove();
        const controls = targetEl.parentElement ? targetEl.parentElement.querySelector('.typing-controls') : null;
        if (controls) controls.remove();
        if (targetEl._typeController) delete targetEl._typeController;
    }

    controller.cancel = function () {
        controller.active = false;
        if (controller.timer) clearTimeout(controller.timer);
        targetEl.innerHTML = fullHtml;
        cleanup();
        if (callback) callback();
    };

    // incremental write into textNodes
    let idx = 0;

    function step() {
        if (!controller.active) return;
        if (idx >= textNodes.length) {
            cleanup();
            if (callback) callback();
            return;
        }

        const current = textNodes[idx];
        if (current.pos >= current.full.length) {
            idx++;
            controller.timer = setTimeout(step, 0);
            return;
        }

        // batch a few chars to reduce DOM updates
        const batch = (Math.random() > 0.9) ? 3 : 1;
        let added = '';
        for (let j = 0; j < batch && current.pos < current.full.length; j++) {
            added += current.full.charAt(current.pos);
            current.pos++;
        }
        current.node.nodeValue += added;

        let delay = baseSpeed + Math.round(Math.random() * baseSpeed * 0.6);
        const lastChar = added.slice(-1);
        if (/[\.!?\u2014,;:]/.test(lastChar)) delay += baseSpeed * 6;

        controller.timer = setTimeout(step, delay);
    }

    // start
    controller.timer = setTimeout(step, baseSpeed);
}

// Закрытие модалки клавишей Esc — закрывает любую открытую модалку
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        const cover = document.getElementById('coverPage');
        const cover2 = document.getElementById('coverPage2');
        const cakeCover = document.getElementById('cakeCover');
        if (cover && cover.style.display === 'flex') {
            closeCover();
        } else if (cover2 && cover2.style.display === 'flex') {
            closeCover2();
        } else if (cakeCover && cakeCover.style.display === 'flex') {
            backFromCake();
        }
    }
});

// Подарок 2 — открывает вторую обложку (без перехода на другую страницу)
function letterGift() {
    document.getElementById("gifts").style.display = "none";
    const cover2 = document.getElementById('coverPage2');
    if (!cover2) return;

    // prepare love-letter for typewriter effect
    const letter = cover2.querySelector('.love-letter');
    if (letter) {
        // save original HTML so we can restore on close
        if (!letter.dataset.fullHtml) {
            letter.dataset.fullHtml = letter.innerHTML;
        }
        // clear current content and start typing
        letter.innerHTML = '';
        // add a small typing controls container with a skip button
        const existingControls = cover2.querySelector('.typing-controls');
        if (existingControls) existingControls.remove();
        const controls = document.createElement('div');
        controls.className = 'typing-controls';
        const skip = document.createElement('button');
        skip.className = 'type-skip';
        skip.textContent = 'Show all';
        controls.appendChild(skip);
        // place controls after the letter
        letter.parentElement.appendChild(controls);

        // small delay to allow modal show animation, then start typing
        setTimeout(() => {
            typeHTML(letter, letter.dataset.fullHtml, 16);
            // wire skip to cancel typing
            skip.addEventListener('click', function () {
                if (letter._typeController && letter._typeController.cancel) letter._typeController.cancel();
            });
        }, 120);
    }

    cover2.style.display = 'flex';
}

function closeCover2() {
    const cover2 = document.getElementById('coverPage2');
    const letter = cover2 ? cover2.querySelector('.love-letter') : null;
    // if typewriter is running, cancel it to avoid lingering timers
    if (letter && letter._typeController && letter._typeController.cancel) {
        try { letter._typeController.cancel(); } catch (e) {}
    }
    // remove controls if present
    if (cover2) {
        const controls = cover2.querySelector('.typing-controls');
        if (controls) controls.remove();
        cover2.style.display = 'none';
    }
    // restore original love-letter HTML so next open will retype
    if (letter && letter.dataset && letter.dataset.fullHtml) {
        letter.innerHTML = letter.dataset.fullHtml;
    }
    document.getElementById("gifts").style.display = "block";
}

// Подарок 3

function surpriseGift() {
    const cakeCard = document.getElementById('cakeCard');
    if (!cakeCard) return;
    cakeCard.innerHTML = `
        <div class="surprise-message">
            <h2>Gift 3</h2>
            <div class="surprise-text">
                <p><strong>My love, very soon your birthday gift will finally arrive. I truly hope it reaches you safely, without any damage, without any problems, and without any delays. I've been waiting for this moment for so long, and honestly, I can't wait until it's finally in your hands.</strong></p>

                <p><strong>I keep imagining the moment when you receive the package, open it, and realize that it's your birthday gift, my love. Just thinking about your beatiful smile makes me happy. I really hope you'll like it, because I chose it with all my love and with you in my heart, my love</strong></p>

                <p><strong>I know that no gift could ever show how much you truly mean to me, but I hope this little surprise reminds you of how deeply I love you and how grateful I am that you're in my life, my sunshine</strong></p>

                <p><strong>So, my heart, keep an eye out for it. I hope it arrives as quickly as possible, and I can't wait to hear your reaction when you finally open it. Please wait for it with excitement, my love. I hope your birthday gift brings a beautiful smile to your face and makes your special day even more memorable. I love you so much, my sweet baby💗</strong></p>

            </div>

            <div class="gift-3-gif-wrap">
                <img src="https://media1.tenor.com/m/VcR7PqtHqkkAAAAC/besos.gif" alt="Gift animation" class="gift-3-gif" />
            </div>
        </div>
    `;

    document.getElementById('gifts').style.display = 'none';
    document.getElementById('cakeCover').style.display = 'flex';
}

// (Removed unused cake/microphone handlers)

function backFromCake() {
    const cakeCard = document.getElementById('cakeCard');
    if (cakeCard) cakeCard.innerHTML = '';
    // clear countdown interval if running
    if (window._giftCountdownInterval) {
        clearInterval(window._giftCountdownInterval);
        window._giftCountdownInterval = null;
    }
    document.getElementById('cakeCover').style.display = 'none';
    document.getElementById("gifts").style.display = "block";
}

// Start a simple countdown inside a container element.
// container: element that contains .cd-days, .cd-hours, .cd-mins, .cd-secs
// targetIso: an ISO date string (e.g. '2026-09-01T00:00:00')
function startGiftCountdown(container, targetIso) {
    if (!container) return;
    // clear previous timer
    if (window._giftCountdownInterval) {
        clearInterval(window._giftCountdownInterval);
        window._giftCountdownInterval = null;
    }

    let target = null;
    if (targetIso) target = new Date(targetIso);
    if (!target || isNaN(target.getTime())) {
        // fallback: 7 days from now
        target = new Date();
        target.setDate(target.getDate() + 7);
    }

    const daysEl = container.querySelector('.cd-days');
    const hoursEl = container.querySelector('.cd-hours');
    const minsEl = container.querySelector('.cd-mins');
    const secsEl = container.querySelector('.cd-secs');
    const targetEl = container.querySelector('.cd-target');
    if (targetEl) targetEl.textContent = 'Скоро придёт!';

    function update() {
        const now = new Date();
        let diff = Math.floor((target.getTime() - now.getTime()) / 1000);
        if (diff <= 0) {
            if (daysEl) daysEl.textContent = '0';
            if (hoursEl) hoursEl.textContent = '00';
            if (minsEl) minsEl.textContent = '00';
            if (secsEl) secsEl.textContent = '00';
            if (window._giftCountdownInterval) { clearInterval(window._giftCountdownInterval); window._giftCountdownInterval = null; }
            return;
        }
        const days = Math.floor(diff / 86400);
        diff -= days * 86400;
        const hours = Math.floor(diff / 3600);
        diff -= hours * 3600;
        const mins = Math.floor(diff / 60);
        const secs = diff - mins * 60;

        if (daysEl) daysEl.textContent = String(days);
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    window._giftCountdownInterval = setInterval(update, 1000);
}