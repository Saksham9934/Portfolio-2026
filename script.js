/* =====================================================
   Saksham Jha — Portfolio
   ===================================================== */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const isMobileSize = window.innerWidth < 760;
if (isTouch) document.body.classList.add('touch-device');
if (reducedMotion) document.body.classList.add('reduced-motion');

/* ---------------- Loading screen ---------------- */
(function loaderInit(){
  const loader = document.getElementById('loader');
  const fill = document.querySelector('.loader-fill');
  const pct = document.getElementById('loaderPct');

  if (reducedMotion) {
    loader.style.transition = 'none';
    loader.classList.add('done');
    return;
  }

  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) { progress = 100; clearInterval(timer); }
    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(timer);
    fill.style.width = '100%';
    pct.textContent = '100%';
    setTimeout(() => loader.classList.add('done'), 400);
  });
})();

/* ---------------- Custom cursor ---------------- */
if (!isTouch && !reducedMotion) {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let rx = 0, ry = 0, mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    mx = e.clientX; my = e.clientY;
  });
  (function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .tilt-target, .skill-icon')) ring.classList.add('grow');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .tilt-target, .skill-icon')) ring.classList.remove('grow');
  });
}

/* ---------------- Menu overlay ---------------- */
const hamburger = document.getElementById('hamburger');
const menuOverlay = document.getElementById('menuOverlay');
function toggleMenu(force) {
  const open = force !== undefined ? force : !menuOverlay.classList.contains('open');
  hamburger.classList.toggle('open', open);
  menuOverlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
hamburger.addEventListener('click', () => toggleMenu());
menuOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });

/* Active section highlight in menu */
const sections = document.querySelectorAll('section[id]');
const menuLinks = document.querySelectorAll('.menu-grid a');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      menuLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));

/* ---------------- Scroll progress rail ---------------- */
const progressFill = document.getElementById('progressFill');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  if (progressFill) progressFill.style.height = scrolled + '%';
});

/* ---------------- Back to top ---------------- */
document.getElementById('toTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
});

/* ---------------- Typing animation ---------------- */
(function typeRoles() {
  const roles = ['Computer Engineering Student', 'Full Stack Developer', 'AI / ML Enthusiast'];
  const el = document.getElementById('typedRole');
  if (!el) return;
  if (reducedMotion) { el.textContent = roles[0]; return; }

  let roleIdx = 0, charIdx = 0, deleting = false;
  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(tick, 1400); return; }
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  tick();
})();

/* ---------------- GSAP scroll reveals ---------------- */
(function scrollReveals() {
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.reveal').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: reducedMotion ? 0 : 36 }, {
        opacity: 1, y: 0, duration: reducedMotion ? 0.01 : 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    document.querySelectorAll('.reveal-stagger').forEach(group => {
      gsap.fromTo(group.children, { opacity: 0, y: reducedMotion ? 0 : 24 }, {
        opacity: 1, y: 0, duration: reducedMotion ? 0.01 : 0.6, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: group, start: 'top 88%' }
      });
    });
  } else {
    // Fallback without GSAP
    const els = document.querySelectorAll('.reveal, .reveal-stagger');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
  }
})();

/* ---------------- Skill bar fill ---------------- */
const bars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.w + '%';
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
bars.forEach(b => barObserver.observe(b));

/* ---------------- Counters ---------------- */
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    if (reducedMotion) { el.textContent = target; counterObserver.unobserve(el); return; }
    let current = 0;
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      current = Math.floor(p * target);
      el.textContent = current;
      if (p < 1) requestAnimationFrame(step); else el.textContent = target;
    }
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ---------------- 3D tilt for project cards ---------------- */
document.querySelectorAll('.tilt-target').forEach(card => {
  function tilt(clientX, clientY) {
    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left, y = clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -10;
    const ry = ((x / rect.width) - 0.5) * 10;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  }
  function reset() { card.style.transform = ''; }
  card.addEventListener('mousemove', (e) => tilt(e.clientX, e.clientY));
  card.addEventListener('mouseleave', reset);
  card.addEventListener('touchmove', (e) => { if (e.touches[0]) tilt(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  card.addEventListener('touchend', reset);
});

/* ---------------- Magnetic buttons ---------------- */
if (!isTouch) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
  });
}

/* ---------------- Contact form (FormSubmit AJAX) ---------------- */
(function contactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';
    try {
      const data = new FormData(form);
      const res = await fetch('https://formsubmit.co/ajax/sakshamjha3027@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      });
      if (res.ok) {
        status.textContent = 'Message sent — thank you! I\'ll reply soon.';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please email me directly.';
      }
    } catch (err) {
      status.textContent = 'Network error — please email me directly.';
    }
  });
})();

/* ---------------- Ambient floating particles (page-wide) ---------------- */
(function ambientParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const count = reducedMotion ? 0 : (isMobileSize ? 30 : 70);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.6 + 0.4,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    hue: Math.random() > 0.5 ? '255,106,61' : '73,224,255'
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},0.5)`;
      ctx.fill();
    });
    if (count > 0) requestAnimationFrame(draw);
  }
  draw();
})();

/* ---------------- Live GitHub stats (no third-party image service) ---------------- */
(function githubStats() {
  const USERNAME = 'Saksham9934';
  const statusEl = document.getElementById('ghStatus');
  const langListEl = document.getElementById('ghLangList');
  if (!statusEl || !langListEl) return;

  function setStat(key, value) {
    const el = document.querySelector(`[data-gh="${key}"]`);
    if (el) el.textContent = value;
  }

  async function load() {
    try {
      const userRes = await fetch(`https://api.github.com/users/${USERNAME}`);
      if (!userRes.ok) throw new Error('user fetch failed');
      const user = await userRes.json();
      setStat('public_repos', user.public_repos ?? '—');
      setStat('followers', user.followers ?? '—');
      setStat('following', user.following ?? '—');

      const reposRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);
      if (!reposRes.ok) throw new Error('repos fetch failed');
      const repos = await reposRes.json();

      const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      setStat('stars', totalStars);

      const langCount = {};
      repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
      const sorted = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const max = sorted.length ? sorted[0][1] : 1;

      if (sorted.length) {
        langListEl.innerHTML = sorted.map(([lang, count]) => `
          <div class="gh-lang-item">
            <div class="gh-lang-item-head"><span>${lang}</span><span>${count} repo${count > 1 ? 's' : ''}</span></div>
            <div class="gh-lang-bar"><span style="width:${(count / max) * 100}%"></span></div>
          </div>`).join('');
      } else {
        langListEl.innerHTML = '<span class="gh-label">No public repos with a detected language yet.</span>';
      }

      statusEl.textContent = `Live from github.com/${USERNAME}`;
    } catch (err) {
      statusEl.textContent = 'GitHub stats are temporarily unavailable (API rate limit or network). Visit the profile directly.';
      langListEl.innerHTML = '<span class="gh-label">Unavailable right now.</span>';
    }
  }
  load();
})();

/* ---------------- 3D Hero (Three.js) — lazy-mounted ---------------- */
function initHeroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobileSize });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 7;

  function setSize() {
    const parentEl = canvas.parentElement;
    const wPx = parentEl.clientWidth, hPx = parentEl.clientHeight;
    renderer.setSize(wPx, hPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileSize ? 1.5 : 2));
    camera.aspect = wPx / hPx;
    camera.updateProjectionMatrix();
  }
  setSize();

  // Wireframe icosahedron
  const geo = new THREE.IcosahedronGeometry(2.6, isMobileSize ? 0 : 1);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xff6a3d, wireframe: true, transparent: true, opacity: 0.35 });
  const wireMesh = new THREE.Mesh(geo, wireMat);
  scene.add(wireMesh);

  // Particle cloud
  const positions = [];
  const basePos = geo.attributes.position.array;
  for (let i = 0; i < basePos.length; i += 3) positions.push(basePos[i], basePos[i + 1], basePos[i + 2]);
  const extraCount = isMobileSize ? 90 : 280;
  for (let i = 0; i < extraCount; i++) {
    const r = 4.5 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x49e0ff, size: 0.045, transparent: true, opacity: 0.85 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Lit inner core — responds to the mouse-driven point light
  const coreGeo = new THREE.IcosahedronGeometry(1.15, 0);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x1a1c22, wireframe: true, roughness: 0.4, metalness: 0.2 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // Lighting
  scene.add(new THREE.AmbientLight(0x404040, 0.6));
  const pointLight = new THREE.PointLight(0x49e0ff, 2.2, 12);
  pointLight.position.set(0, 0, 3);
  scene.add(pointLight);
  const pointLight2 = new THREE.PointLight(0xff6a3d, 1.4, 14);
  pointLight2.position.set(-3, 2, 2);
  scene.add(pointLight2);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });
  if (isTouch && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma === null || e.beta === null) return;
      mouseX = Math.max(-0.5, Math.min(0.5, e.gamma / 45));
      mouseY = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 45));
    });
  }

  let heroVisible = true;
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { heroVisible = entry.isIntersecting; });
  }, { threshold: 0.05 });
  heroObserver.observe(document.getElementById('home'));

  function animate() {
    requestAnimationFrame(animate);
    if (!heroVisible) return;

    if (!reducedMotion) {
      wireMesh.rotation.y += 0.0022;
      wireMesh.rotation.x += 0.0009;
      particles.rotation.y += 0.0009;
      particles.rotation.x -= 0.0004;
      core.rotation.y -= 0.0035;
      core.rotation.x += 0.0018;
      camera.position.x += (mouseX * 1.4 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 1.4 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
    }

    // Mouse-reactive light
    pointLight.position.x = mouseX * 6;
    pointLight.position.y = -mouseY * 6;

    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', setSize);
}

// Lazy-mount after load, deferred to idle time so first paint isn't blocked
window.addEventListener('load', () => {
  const mount = () => initHeroScene();
  if ('requestIdleCallback' in window) {
    requestIdleCallback(mount, { timeout: 1200 });
  } else {
    setTimeout(mount, 300);
  }
});