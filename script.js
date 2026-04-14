const text = "💖 Папа, тебе уже 44 — но ты всё такой же сильный, мудрый и лучший! 💖 Спасибо тебе за заботу, поддержку и любовь ❤️";
let i = 0;

function startEverything() {
    document.getElementById("start-overlay").style.display = "none";
    document.getElementById("intro").classList.remove("hidden");

    const drums = document.getElementById("drumSound");
    if(drums) {
        drums.volume = 1.0;
        drums.play().catch(e => console.log("Sound error:", e));
    }
    startIntroCounter();
}

function startIntroCounter() {
    let introSeconds = 3;
    const counterEl = document.getElementById("intro-counter");
    
    let introInterval = setInterval(() => {
        introSeconds--;
        if (introSeconds > 0) {
            counterEl.innerText = introSeconds;
        } else {
            clearInterval(introInterval);
            
            const drums = document.getElementById("drumSound");
            const music = document.getElementById("music");
            
            if(drums) { drums.pause(); drums.currentTime = 0; }
            if(music) { music.volume = 0.5; music.play(); }

            const introDiv = document.getElementById("intro");
            introDiv.style.transition = "opacity 0.8s";
            introDiv.style.opacity = "0";
            
            setTimeout(() => {
                introDiv.style.display = "none";
                document.getElementById("start-btn").classList.remove("hidden");
                typeWriter();
                initFireworks();
            }, 800);
        }
    }, 1000);
}

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typing-text").innerHTML += text[i++];
        setTimeout(typeWriter, 50);
    }
}

function createDecoration() {
    const container = document.getElementById("hearts-container");
    const item = document.createElement("div");
    if (Math.random() > 0.4) {
        item.className = "heart";
        item.innerText = "💖";
    } else {
        item.className = "confetti";
        const colors = ['#ffed4a', '#44ff66', '#4488ff', '#ff44cc', '#ffffff'];
        item.style.width = '10px';
        item.style.height = '10px';
        item.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    }
    item.style.left = Math.random() * 100 + "vw";
    item.style.fontSize = (12 + Math.random() * 20) + "px";
    container.appendChild(item);
    setTimeout(() => item.remove(), 6000);
}
setInterval(createDecoration, 200);

function openGreeting() {
    document.getElementById("main-action").classList.add("hidden");
    const g = document.getElementById("greeting");
    g.classList.remove("hidden");
    g.innerHTML = `
        <div class="envelope-wrapper">
            <div class="envelope" onclick="this.classList.toggle('open')">
                <div class="letter">
                    <p><b>Папа, ты для меня пример силы.</b></p>
                    <p>Я очень тебя люблю ❤️</p>
                    <button onclick="event.stopPropagation(); showMagic()">Увидеть магию ✨</button>
                </div>
            </div>
        </div>
        <p>(Нажми на конверт)</p>
    `;
}

function showMagic() {
    document.getElementById("greeting").classList.add("hidden");
    const s = document.getElementById("surprise");
    s.classList.remove("hidden");
    let count = 5;
    s.innerHTML = `
        <div class="wizard">🧙‍♂️</div>
        <h2>Волшебник исполняет желания...</h2>
        <p id="count" style="font-size: 60px; font-weight: bold;">${count}</p>
    `;
    let t = setInterval(() => {
        count--;
        document.getElementById("count").innerText = count;
        if (count === 0) { clearInterval(t); showGift(); }
    }, 1000);
}

function showGift() {
    const s = document.getElementById("surprise");
    s.innerHTML = `
        <div class="wizard">🧙‍♂️✨</div>
        <h2 style="margin-bottom: 5px;">Абра-кадабра!</h2>
        <div class="gift" onclick="openGift(this)">
            <div class="gift-inner">
                <div class="lid"><div class="ribbon-v"></div><div class="ribbon-h"></div></div>
                <div class="box"><div class="ribbon-v"></div><div class="ribbon-h"></div></div>
                <div class="money">💵💵💵💵</div>
            </div>
        </div>
        <p>Нажми на подарок!</p>
    `;
}

function openGift(el) {
    if (el.classList.contains("open")) return;
    el.classList.add("open");
    const sound = document.getElementById("openSound");
    if (sound) { sound.currentTime = 0; sound.play(); }
    launchFireworks();
}

let canvas, ctx, particles = [];
function initFireworks() {
    canvas = document.getElementById("fireworks");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();
}
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
function launchFireworks() { for (let i = 0; i < 25; i++) setTimeout(createExplosion, i * 160); }
function createExplosion() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const colors = ["#ff0", "#f0f", "#0ff", "#0f0", "#ff4b2b", "#fff"];
    for (let i = 0; i < 70; i++) {
        particles.push({x, y, dx: (Math.random() - 0.5) * 8, dy: (Math.random() - 0.5) * 8, life: 100, color: colors[Math.floor(Math.random() * colors.length)]});
    }
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.dx; p.y += p.dy; p.dy += 0.05; p.life--;
        ctx.fillStyle = p.color; ctx.globalAlpha = p.life / 100;
        ctx.fillRect(p.x, p.y, 3, 3);
        if (p.life <= 0) { particles.splice(i, 1); i--; }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
}