/**
 * Script principal para la página web navideña
 * - Efecto de nieve y destellos dorados (#bab37d y #ffffff)
 * - Control del reproductor central de "video_navideno_mp.mp4"
 * - Pestañas interactivas de información navideña
 * - Cuenta regresiva para Navidad
 */

document.addEventListener('DOMContentLoaded', () => {
    initSnowfall();
    initCountdown();
    initVideoPlayer();
    initTabs();
    initMobileMenu();
    initScrollReveal();
});

/* ==========================================================================
   1. Efecto de Nieve y Destellos Dorados en Canvas
   ========================================================================== */
function initSnowfall() {
    const canvas = document.getElementById('snow-canvas');
    const toggleBtn = document.getElementById('toggle-snow-btn');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let snowActive = true;
    let animationFrameId = null;

    const particleCount = 75;
    const particles = [];

    function createParticle() {
        const isGold = Math.random() < 0.35; // 35% destellos dorados (#bab37d), 65% copos blancos (#ffffff)
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.8 + 1,
            speedY: Math.random() * 0.9 + 0.35,
            speedX: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.65 + 0.25,
            color: isGold ? '186, 179, 125' : '255, 255, 255',
            swayAngle: Math.random() * Math.PI * 2,
            swaySpeed: Math.random() * 0.02 + 0.005
        };
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        for (const p of particles) {
            p.swayAngle += p.swaySpeed;
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.swayAngle) * 0.3;

            if (p.y > height + 10) {
                p.y = -10;
                p.x = Math.random() * width;
            }
            if (p.x > width + 10) p.x = -10;
            if (p.x < -10) p.x = width + 10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            ctx.fill();
        }

        if (snowActive) {
            animationFrameId = requestAnimationFrame(drawParticles);
        }
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            snowActive = !snowActive;
            toggleBtn.setAttribute('aria-pressed', String(snowActive));
            if (snowActive) {
                toggleBtn.textContent = '❄ Nieve Activa';
                drawParticles();
            } else {
                toggleBtn.textContent = '❄ Nieve Pausada';
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                ctx.clearRect(0, 0, width, height);
            }
        });
    }

    drawParticles();
}

/* ==========================================================================
   2. Cuenta Regresiva para Navidad (24 de Diciembre a las 24:00 / 25 Dic)
   ========================================================================== */
function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let targetDate = new Date(currentYear, 11, 24, 23, 59, 59); // 24 de diciembre

        if (now > targetDate) {
            targetDate = new Date(currentYear + 1, 11, 24, 23, 59, 59);
        }

        const diff = targetDate - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        daysEl.textContent = String(d).padStart(2, '0');
        hoursEl.textContent = String(h).padStart(2, '0');
        minutesEl.textContent = String(m).padStart(2, '0');
        secondsEl.textContent = String(s).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   3. Reproductor Central de Video ("video_navideno_mp.mp4")
   ========================================================================== */
function initVideoPlayer() {
    const video = document.getElementById('main-christmas-video');
    const showcase = document.getElementById('video-showcase');
    const statusDot = document.getElementById('video-status-dot');
    const statusText = document.getElementById('video-status-text');
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnMute = document.getElementById('btn-mute');
    const btnCinema = document.getElementById('btn-cinema');
    const btnFullscreen = document.getElementById('btn-fullscreen');

    if (!video) return;

    function syncPlayState() {
        if (video.paused) {
            if (btnPlayPause) btnPlayPause.textContent = '▶ Reproducir';
            if (statusText) statusText.textContent = 'En pausa';
            if (statusDot) statusDot.classList.remove('active');
            if (showcase) showcase.classList.remove('playing');
        } else {
            if (btnPlayPause) btnPlayPause.textContent = '⏸ Pausar';
            if (statusText) statusText.textContent = 'Reproduciendo mensaje navideño...';
            if (statusDot) statusDot.classList.add('active');
            if (showcase) showcase.classList.add('playing');
        }
    }

    function syncMuteState() {
        if (!btnMute) return;
        if (video.muted || video.volume === 0) {
            btnMute.textContent = '🔇 Silenciado';
            btnMute.classList.add('active');
        } else {
            btnMute.textContent = '🔊 Sonido';
            btnMute.classList.remove('active');
        }
    }

    video.addEventListener('play', syncPlayState);
    video.addEventListener('pause', syncPlayState);
    video.addEventListener('ended', () => {
        if (btnPlayPause) btnPlayPause.textContent = '↺ Volver a ver';
        if (statusText) statusText.textContent = 'Reproducción finalizada';
        if (statusDot) statusDot.classList.remove('active');
        if (showcase) showcase.classList.remove('playing');
    });
    video.addEventListener('volumechange', syncMuteState);

    if (btnPlayPause) {
        btnPlayPause.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    }

    if (btnMute) {
        btnMute.addEventListener('click', () => {
            video.muted = !video.muted;
        });
    }

    if (btnCinema) {
        btnCinema.addEventListener('click', () => {
            document.body.classList.toggle('cinema-mode');
            btnCinema.classList.toggle('active');
        });
    }

    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
        });
    }
}

/* ==========================================================================
   4. Pestañas Interactivas de Tradiciones y Valores Navideños
   ========================================================================== */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');

            tabBtns.forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });

            tabPanels.forEach((panel) => {
                panel.classList.remove('active');
            });

            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   5. Menú Móvil y Navegación Activa
   ========================================================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

/* ==========================================================================
   6. Animación Suave de Aparición al Desplazar (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));
}

