'use strict';

// ══════════════════════════════════════
// CANVAS RESIZE HELPER
// Fixes: canvas renders at 0 width if hidden, blurry on retina
// ══════════════════════════════════════
function resizeCanvas(canvas) {
  // Resize canvas backing store to match CSS size × devicePixelRatio.
  // Does NOT apply ctx.scale — each draw function handles that itself
  // by reading canvas.offsetWidth/Height vs canvas.width/height.
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  if (w === 0 || h === 0) return false;
  const dpr = window.devicePixelRatio || 1;
  const needW = Math.round(w * dpr);
  const needH = Math.round(h * dpr);
  if (canvas.width !== needW || canvas.height !== needH) {
    canvas.width  = needW;
    canvas.height = needH;
  }
  return true;
}

// Helper: get ctx pre-scaled for DPR. Call at start of every draw function.
function getScaledCtx(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

// ══════════════════════════════════════
// NEBULA BACKGROUND
// ══════════════════════════════════════
(function() {
  const c = document.getElementById('nebula-canvas');
  const ctx = c.getContext('2d');
  function draw() {
    c.width = innerWidth; c.height = innerHeight;
    [{x:.15,y:.3,r:.38,col:[30,80,160]},{x:.85,y:.65,r:.32,col:[100,40,140]},
     {x:.5,y:.88,r:.28,col:[20,100,80]},{x:.72,y:.1,r:.22,col:[160,60,20]},
     {x:.3,y:.7,r:.2,col:[50,120,100]}].forEach(b => {
      const g = ctx.createRadialGradient(b.x*c.width,b.y*c.height,0,b.x*c.width,b.y*c.height,b.r*Math.max(c.width,c.height));
      g.addColorStop(0,`rgba(${b.col},0.14)`); g.addColorStop(.5,`rgba(${b.col},0.04)`); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0,0,c.width,c.height);
    });
  }
  window.addEventListener('resize', draw); draw();
})();

// ══════════════════════════════════════
// AURORA WAVES
// ══════════════════════════════════════
(function() {
  const c = document.getElementById('aurora-canvas'), ctx = c.getContext('2d');
  let t = 0;
  function resize() { c.width = innerWidth; c.height = innerHeight; }
  function draw() {
    ctx.clearRect(0,0,c.width,c.height); t += 0.005;
    [{col:'99,179,237',amp:55,freq:.6,phase:0,yb:.1},
     {col:'246,173,85',amp:35,freq:.9,phase:1.5,yb:.08},
     {col:'104,211,145',amp:45,freq:.7,phase:3,yb:.13}].forEach(w => {
      ctx.beginPath();
      for (let x=0; x<=c.width; x+=3) {
        const y = (w.yb*c.height) + Math.sin(x*w.freq*.003+t+w.phase)*w.amp + Math.sin(x*w.freq*.008+t*1.4+w.phase)*(w.amp*.35);
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.lineTo(c.width,0); ctx.lineTo(0,0); ctx.closePath();
      const g = ctx.createLinearGradient(0,0,0,c.height*.28);
      g.addColorStop(0,`rgba(${w.col},0.08)`); g.addColorStop(.6,`rgba(${w.col},0.02)`); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize); resize(); draw();
})();

// ══════════════════════════════════════
// STAR FIELD — Parallax + Twinkle + Shooting Stars
// ══════════════════════════════════════
(function() {
  const c = document.getElementById('starfield'), ctx = c.getContext('2d');
  let stars = [], shooters = [], frame = 0, mx = 0, my = 0;
  function resize() { c.width = innerWidth; c.height = innerHeight; init(); }
  function init() {
    stars = [];
    [[8000,.5,.7],[5000,.9,1.1],[3000,1.4,1.8]].forEach(([density,rMin,rMax], li) => {
      const n = Math.floor(c.width*c.height/density);
      for (let i=0; i<n; i++) {
        const hues = [null,null,'200,220,255','255,230,200','180,255,220'];
        stars.push({ x:Math.random()*c.width, y:Math.random()*c.height,
          r:Math.random()*(rMax-rMin)+rMin, alpha:Math.random()*.7+.1,
          speed:Math.random()*.005+.001, phase:Math.random()*Math.PI*2,
          layer:[.2,.55,1][li], hue:hues[Math.floor(Math.random()*5)] });
      }
    });
  }
  function shoot() {
    const a = (Math.random()*40+10)*Math.PI/180;
    shooters.push({ x:Math.random()*c.width*.7, y:Math.random()*c.height*.45,
      vx:Math.cos(a)*(9+Math.random()*7), vy:Math.sin(a)*(9+Math.random()*7),
      len:90+Math.random()*130, life:1 });
  }
  document.addEventListener('mousemove', e => {
    mx = (e.clientX/innerWidth-.5)*2; my = (e.clientY/innerHeight-.5)*2;
  });
  // Touch parallax
  document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    mx = (t.clientX/innerWidth-.5)*2; my = (t.clientY/innerHeight-.5)*2;
  }, {passive:true});
  function draw() {
    ctx.clearRect(0,0,c.width,c.height); frame++;
    if (Math.random() < .005) shoot();
    stars.forEach(s => {
      const a = s.alpha*(.35+.65*Math.sin(frame*s.speed+s.phase));
      const px = s.x+mx*s.layer*10, py = s.y+my*s.layer*10;
      if (s.r > 1.1) {
        const g = ctx.createRadialGradient(px,py,0,px,py,s.r*3.5);
        const col = s.hue||'226,232,244';
        g.addColorStop(0,`rgba(${col},${a*.7})`); g.addColorStop(1,`rgba(${col},0)`);
        ctx.beginPath(); ctx.arc(px,py,s.r*3.5,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(px,py,s.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(${s.hue||'226,232,244'},${a})`; ctx.fill();
    });
    shooters = shooters.filter(s => s.life > 0);
    shooters.forEach(s => {
      s.x+=s.vx; s.y+=s.vy; s.life-=.02;
      const spd = Math.hypot(s.vx,s.vy);
      const tx=s.x-s.vx*(s.len/spd), ty=s.y-s.vy*(s.len/spd);
      const g = ctx.createLinearGradient(tx,ty,s.x,s.y);
      g.addColorStop(0,'rgba(255,255,255,0)');
      g.addColorStop(.6,`rgba(200,230,255,${s.life*.4})`);
      g.addColorStop(1,`rgba(255,255,255,${s.life})`);
      ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(s.x,s.y);
      ctx.strokeStyle=g; ctx.lineWidth=1.8; ctx.stroke();
      ctx.beginPath(); ctx.arc(s.x,s.y,2.5,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${s.life})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize); resize(); draw();
})();

// ══════════════════════════════════════
// PARTICLE BURST
// ══════════════════════════════════════
const pC = document.getElementById('particle-canvas'), pCtx = pC.getContext('2d');
let particles = [];
function resizeP() { pC.width = innerWidth; pC.height = innerHeight; }
window.addEventListener('resize', resizeP); resizeP();
function burst(x, y) {
  const cols = ['#63b3ed','#f6ad55','#68d391','#b794f4','#fc8181','#ffffff','#ffd700'];
  for (let i=0; i<70; i++) {
    const a=Math.random()*Math.PI*2, sp=Math.random()*7+2;
    particles.push({ x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-Math.random()*3,
      r:Math.random()*3+.5, alpha:1, col:cols[Math.floor(Math.random()*cols.length)], decay:Math.random()*.02+.012 });
  }
}
(function animP() {
  pCtx.clearRect(0,0,pC.width,pC.height);
  particles = particles.filter(p => p.alpha > 0);
  particles.forEach(p => {
    p.x+=p.vx; p.y+=p.vy; p.vy+=.13; p.vx*=.98; p.alpha-=p.decay;
    pCtx.globalAlpha = Math.max(0, p.alpha);
    pCtx.beginPath(); pCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
    pCtx.fillStyle = p.col; pCtx.fill();
  });
  pCtx.globalAlpha = 1;
  requestAnimationFrame(animP);
})();

// ══════════════════════════════════════
// R² BARS
// ══════════════════════════════════════
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const b = e.target;
      setTimeout(() => { b.style.width = b.dataset.width + '%'; }, 300);
      barObs.unobserve(b);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.r2-bar').forEach(b => barObs.observe(b));

// ══════════════════════════════════════
// CARD 3D TILT — disabled on touch devices
// ══════════════════════════════════════
const isTouchDevice = () => window.matchMedia('(hover:none)').matches;
document.querySelectorAll('.card,.info-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (isTouchDevice()) return;
    const r = card.getBoundingClientRect();
    const dx = (e.clientX-r.left-r.width/2)/(r.width/2);
    const dy = (e.clientY-r.top-r.height/2)/(r.height/2);
    card.style.transform = `perspective(700px) rotateX(${-dy*4}deg) rotateY(${dx*4}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ══════════════════════════════════════
// ANIMATED COUNTER
// ══════════════════════════════════════
function animCount(el, target, dur=900) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now-start)/dur, 1);
    const e = 1 - Math.pow(1-p, 4);
    el.textContent = (target*e).toFixed(6);
    p < 1 ? requestAnimationFrame(step) : (el.textContent = target.toFixed(6));
  }
  requestAnimationFrame(step);
}

// ══════════════════════════════════════
// ══════════════════════════════════════
// MODEL COEFFICIENTS — loaded from JSON files
// ══════════════════════════════════════
const MODEL_PATHS = {
  GALAXY: 'Model/json/Galaxy/MLR_GALAXY_5band.json',
  QSO:    'Model/json/QSO/MLR_QSO_5band.json',
  STAR:   'Model/json/Star/MLR_STAR_5band.json',
};

// MODELS is populated on page load via loadModels()
const MODELS = {
  GALAXY: null,
  QSO:    null,
  STAR:   { name:'MLR_STAR_5band', r2:.0125, rmse:.000457, mae:.000284,
            b0:0, b1:0, b2:0, b3:0, b4:0, b5:0 }  // STAR always z≈0
};

function parseModel(json) {
  // Parse Colab Cell 39 JSON → internal model object
  const c = json.coefficients;
  return {
    name : json.model_name,
    r2   : json.metrics.r2,
    rmse : json.metrics.rmse,
    mae  : json.metrics.mae,
    b0   : c.b0_intercept,
    b1   : c.b1_u,
    b2   : c.b2_g,
    b3   : c.b3_r,
    b4   : c.b4_i,
    b5   : c.b5_z,
  };
}

async function loadModels() {
  const statusEl = document.getElementById('model-load-status');
  const setStatus = (msg, ok) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? 'var(--star)' : '#fc8181';
    statusEl.style.display = 'block';
    if (ok) setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
  };

  setStatus('⏳ Loading models...', true);

  const results = await Promise.allSettled(
    ['GALAXY', 'QSO'].map(async cls => {
      const res  = await fetch(MODEL_PATHS[cls]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      MODELS[cls] = parseModel(json);
      return cls;
    })
  );

  const failed = results
    .filter(r => r.status === 'rejected')
    .map((r, i) => ['GALAXY','QSO'][i]);

  if (failed.length === 0) {
    setStatus('✅ Models loaded', true);
  } else {
    setStatus(`⚠️ Could not load: ${failed.join(', ')} — check Model/json/ folder`, false);
  }
}

// Load models when page is ready
document.addEventListener('DOMContentLoaded', loadModels);

let selectedClass = 'GALAXY';

function selectClass(cls, el) {
  selectedClass = cls;
  document.querySelectorAll('.class-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('result-panel').style.display = 'none';
  document.getElementById('sim-panel').style.display = 'none';
  document.getElementById('error-msg').style.display = 'none';
}

function predict() {
  const errEl = document.getElementById('error-msg');
  errEl.style.display = 'none';
  const u=+document.getElementById('band_u').value;
  const g=+document.getElementById('band_g').value;
  const r=+document.getElementById('band_r').value;
  const i=+document.getElementById('band_i').value;
  const z=+document.getElementById('band_z').value;
  const inv = Object.entries({u,g,r,i,z}).filter(([,v])=>isNaN(v)||v<10||v>30).map(([k])=>k);
  if (inv.length > 0) {
    errEl.textContent = `⚠ Invalid band(s): ${inv.join(', ')}. Each must be 10 – 30.`;
    errEl.style.display = 'block'; return;
  }
  // Guard: model not loaded yet
  if (!MODELS[selectedClass]) {
    errEl.textContent = '⏳ Model still loading — please wait a moment and try again.';
    errEl.style.display = 'block'; return;
  }
  const btn = document.getElementById('predict-btn');
  btn.innerHTML = '<span>Computing...</span>'; btn.classList.add('loading');
  const rect = btn.getBoundingClientRect();
  burst(rect.left+rect.width/2, rect.top+rect.height/2);

  setTimeout(() => {
    btn.innerHTML = '<span>✦ &nbsp; Predict Redshift</span>'; btn.classList.remove('loading');
    const m = MODELS[selectedClass];
    let pred = 0, eqStr = '';
    if (selectedClass === 'STAR') {
      pred  = 0;
      eqStr = `<span class="eq-highlight">redshift</span> = 0.000000<br>
               <span style="color:var(--text-dim)">(Stars have no cosmological redshift)</span>`;
    } else {
      pred = m.b0+m.b1*u+m.b2*g+m.b3*r+m.b4*i+m.b5*z;
      const fmt = v => v>=0 ? `+ ${v.toFixed(8)}` : `- ${Math.abs(v).toFixed(8)}`;
      eqStr = `<span class="eq-highlight">redshift</span> = ${m.b0.toFixed(8)}<br>
        &nbsp;&nbsp;&nbsp; ${fmt(m.b1)} × u (${u})<br>
        &nbsp;&nbsp;&nbsp; ${fmt(m.b2)} × g (${g})<br>
        &nbsp;&nbsp;&nbsp; ${fmt(m.b3)} × r (${r})<br>
        &nbsp;&nbsp;&nbsp; ${fmt(m.b4)} × i (${i})<br>
        &nbsp;&nbsp;&nbsp; ${fmt(m.b5)} × z (${z})<br>
        &nbsp;&nbsp;&nbsp; = <span class="eq-highlight">${pred.toFixed(6)}</span>`;
    }
    const colors = {GALAXY:'var(--galaxy)',QSO:'var(--qso)',STAR:'var(--star)'};
    const resEl  = document.getElementById('result-value');
    resEl.style.color = colors[selectedClass];
    animCount(resEl, pred);
    document.getElementById('res-class').textContent  = selectedClass;
    document.getElementById('res-r2').textContent     = m.r2.toFixed(4);
    document.getElementById('res-rmse').textContent   = m.rmse.toFixed(4);
    document.getElementById('res-equation').innerHTML = eqStr;
    // Range check warnings
    let warnHTML = '';
    if (selectedClass === 'GALAXY') {
      if (pred < 0 || pred > 2) {
        warnHTML += `<div class="warning-banner" style="margin-bottom:10px;">
          ⚠️ &nbsp;<strong>Out-of-range prediction: z = ${pred.toFixed(4)}</strong><br>
          The GALAXY model is only reliable for z = 0 – 2. Values outside this range indicate
          unusual band magnitudes or that this object may not be a typical galaxy.
          Check your band inputs — valid range is 10 – 30 per band.
        </div>`;
      } else {
        warnHTML += `<div class="warning-banner good">✅ &nbsp;GALAXY model is strong (R²=0.74). Prediction reliable for z = 0–2.</div>`;
      }
    } else if (selectedClass === 'QSO') {
      if (pred < 0 || pred > 7) {
        warnHTML += `<div class="warning-banner" style="margin-bottom:10px;">
          ⚠️ &nbsp;<strong>Out-of-range prediction: z = ${pred.toFixed(4)}</strong><br>
          QSO redshift is expected between 0 and ~7. Check your band inputs.
        </div>`;
      } else {
        warnHTML += `<div class="warning-banner">⚠️ &nbsp;QSO model is weak (R²=0.14). Average error ≈ ±0.85. Use with caution.</div>`;
      }
    } else {
      warnHTML += `<div class="warning-banner good">✅ &nbsp;Stars have no cosmological redshift. z ≈ 0 by definition.</div>`;
    }
    document.getElementById('res-warning').innerHTML = warnHTML;
    document.getElementById('result-panel').style.display = 'block';
    runSimulation(pred, [u,g,r,i,z]);
  }, 650);
}

// ══════════════════════════════════════
// SIMULATION ENGINE
// ══════════════════════════════════════
const EMISSION_LINES = [
  ['Ly-α',   1216,'#b794f4'],['C IV',   1549,'#9f7aea'],
  ['C III]', 1909,'#7c3aed'],['Mg II',  2798,'#63b3ed'],
  ['Hβ',     4861,'#68d391'],['[O III]',5007,'#48bb78'],
  ['Hα',     6563,'#fc8181'],['[N II]', 6583,'#f6ad55'],
];
const SDSS_BANDS = [
  ['u',3551,'#b794f4'],['g',4686,'#68d391'],['r',6165,'#fc8181'],
  ['i',7481,'#f6ad55'],['z',8931,'#63b3ed'],
];

function wl2rgb(wl) {
  // wl in Angstroms — convert to nm for colour mapping
  const nm = wl / 10;
  let r=0,g=0,b=0;
  if      (nm>=380&&nm<440){r=(440-nm)/60;b=1;}
  else if (nm>=440&&nm<490){g=(nm-440)/50;b=1;}
  else if (nm>=490&&nm<510){g=1;b=(510-nm)/20;}
  else if (nm>=510&&nm<580){r=(nm-510)/70;g=1;}
  else if (nm>=580&&nm<645){r=1;g=(645-nm)/65;}
  else if (nm>=645&&nm<=780){r=1;}
  else if (nm>780){
    // infrared — gradually fade to dark red / invisible
    const fade = Math.max(0, 1-(nm-780)/2000);
    r=0.6*fade; g=0.02*fade;
  }
  else if (nm<380){r=0.25;b=0.4;} // UV
  const ga=0.85, mx=255;
  return [Math.round(mx*Math.pow(Math.max(0,r),ga)),
          Math.round(mx*Math.pow(Math.max(0,g),ga)),
          Math.round(mx*Math.pow(Math.max(0,b),ga))];
}

// ResizeObserver to redraw canvases when layout changes
let simData = null;
const simResizeObs = new ResizeObserver(() => { if (simData) redrawAll(); });
['doppler-canvas','sed-canvas','spectral-canvas','cosmic-canvas'].forEach(id => {
  const el = document.getElementById(id);
  if (el) simResizeObs.observe(el);
});


function redrawAll() {
  if (!simData) return;
  const slider   = document.getElementById('doppler-slider');
  const dopplerZ = slider ? parseFloat(slider.value) : simData.z;
  drawDoppler(isNaN(dopplerZ) ? simData.z : dopplerZ);
  drawSED(simData.mags);
  drawSpectral(simData.z);
  drawCosmic(simData.z);
}

// ── Doppler State ──
let dopplerAnimHandle = null;
let dopplerAnimZ      = 0;
let dopplerPredictedZ = 0;
let dopplerSliderMin  = 0;
let dopplerSliderMax  = 5;

function calcDelta(z) {
  // Adaptive range: wider at higher z so slider stays useful
  if (z <= 0.5)  return 0.3;
  if (z <= 2)    return 0.8;
  if (z <= 5)    return 1.5;
  if (z <= 10)   return 2.5;
  return Math.max(3, z * 0.15);   // ±15% for very high z
}

function wlRegion(wl) {
  // wl is in Angstroms (Å). 1 nm = 10 Å
  if (wl < 100)   return 'X-ray / EUV';
  if (wl < 3800)  return 'Ultraviolet';
  if (wl < 4500)  return 'Violet';
  if (wl < 4950)  return 'Blue';
  if (wl < 5700)  return 'Green';
  if (wl < 6250)  return 'Yellow / Orange';
  if (wl < 7500)  return 'Red (visible)';
  if (wl < 14000) return 'Near Infrared';
  if (wl < 50000) return 'Mid Infrared';
  return 'Far Infrared';
}

// ── False-colour helper: maps 0→1 position to visible rainbow ──
// Used by the strip and marker so there is ALWAYS visible colour contrast.
function falseColour(t) {
  // t in [0,1]: position across the strip (0=min z, 1=max z)
  // Uses HSL with fixed S=100%, L=55% — guarantees maximum perceptual
  // contrast at every position. Hue rotates red(0°) → violet(270°).
  // Direction: low z = red (hot), high z = violet (cooler, more distant)
  // — matches intuitive direction of cosmological redshift.
  const hue = t * 270;   // 0° red  →  270° blue-violet
  const s   = 1.0;
  const l   = 0.55;
  // HSL→RGB conversion
  const c = (1 - Math.abs(2*l - 1)) * s;
  const x = c * (1 - Math.abs((hue/60) % 2 - 1));
  const m = l - c/2;
  let r,g,b;
  if      (hue <  60) { r=c; g=x; b=0; }
  else if (hue < 120) { r=x; g=c; b=0; }
  else if (hue < 180) { r=0; g=c; b=x; }
  else if (hue < 240) { r=0; g=x; b=c; }
  else if (hue < 300) { r=x; g=0; b=c; }
  else                { r=c; g=0; b=x; }
  return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)];
}

// ── Physical wavelength colour (full brightness) ──
function wlPhysColour(wl) {
  // All IR is invisible — represent as pure red shades (no orange/yellow).
  // Brightness decreases with wavelength so position in range is always clear.
  if (wl <= 7500) {
    return wl2rgb(wl);         // exact spectral colour for visible light
  } else if (wl <= 7800) {
    // Transition: last visible red → NIR start (no jump)
    const t = (wl - 7500) / 300;
    const rv = Math.round(255 - t * 35);   // 255 → 220
    return [rv, 0, 0];
  } else if (wl <= 14000) {
    // NIR: bright red → dark red (220 → 80)
    const t = (wl - 7800) / (14000 - 7800);
    return [Math.round(220 - t * 140), 0, 0];
  } else if (wl <= 50000) {
    // MIR: dark red → very dark red (80 → 20)
    const t = (wl - 14000) / (50000 - 14000);
    return [Math.round(80 - t * 60), 0, 0];
  } else if (wl <= 300000) {
    // FIR: near black (20 → 5)
    const t = (wl - 50000) / (300000 - 50000);
    return [Math.round(20 - t * 15), 0, 0];
  } else {
    return [5, 0, 0];
  }
}

// ── Strip colour with contrast stretch ──
// Physical colour with brightness stretched across the current wavelength range
// so there is ALWAYS visible lightness difference from left to right.
function stripPhysColour(wl, wlMin, wlMax) {
  const raw    = wlPhysColour(wl);
  const rawLum = Math.max(...raw);
  const lumMin = Math.max(...wlPhysColour(wlMin));
  const lumMax = Math.max(...wlPhysColour(wlMax));
  const lumLo  = Math.min(lumMin, lumMax);
  const lumHi  = Math.max(lumMin, lumMax);
  const lumSpan = lumHi - lumLo;

  let stretchedLum;
  if (lumSpan < 15) {
    // Nearly no physical brightness difference — force a gradient bright→dark
    const pos = (wl - wlMin) / (wlMax - wlMin || 1);
    stretchedLum = Math.round(220 - pos * 180);
  } else {
    // Stretch physical luminance to 30–230 range
    stretchedLum = Math.round(30 + ((rawLum - lumLo) / lumSpan) * 200);
  }
  stretchedLum = Math.max(0, Math.min(255, stretchedLum));

  if (rawLum === 0) return [stretchedLum, 0, 0];

  // Scale channels proportionally to preserve hue
  const scale = stretchedLum / rawLum;
  return [
    Math.min(255, Math.round(raw[0] * scale)),
    Math.min(255, Math.round(raw[1] * scale)),
    Math.min(255, Math.round(raw[2] * scale)),
  ];
}

// ── Shared colour function: Hα colour at a given z ──
// Used by: strip, swatch, marker glow, slider thumb
// All four now use IDENTICAL logic so colours always match perfectly.
function zHaColour(z) {
  const obsWl = 6563 * (1 + z);
  if (obsWl <= 7500) {
    // Visible light: exact spectral colour from wl2rgb
    return wl2rgb(obsWl);
  } else if (obsWl <= 14000) {
    // Near Infrared: bright red → dark red (220→60)
    const t  = (obsWl - 7500) / (14000 - 7500);
    const rv = Math.round(220 - t * 160);
    return [rv, 0, 0];
  } else if (obsWl <= 50000) {
    // Mid Infrared: very dark red (60→15)
    const t  = (obsWl - 14000) / (50000 - 14000);
    const rv = Math.round(60 - t * 45);
    return [rv, 0, 0];
  } else {
    // Far Infrared: near black
    return [10, 0, 0];
  }
}

function updateDopplerUI(z) {
  const REST_WL = 6563;
  const obsWl   = REST_WL * (1 + z);
  const shift   = obsWl - REST_WL;

  // ── Swatch: uses zHaColour(z) — same formula as the strip ──
  const swatch         = document.getElementById('doppler-swatch');
  const [sr,sg,sb]     = zHaColour(z);
  const swBg           = `rgb(${sr},${sg},${sb})`;
  const swGlow         = `0 0 28px rgba(${sr},${sg},${sb},0.7), 0 0 6px rgba(0,0,0,0.5)`;

  // Region label — only show for IR (invisible to human eye)
  const regLabel = wlRegion(obsWl);
  let swInner = '';
  // No label inside the circle — pure colour only

  swatch.style.background = swBg;
  swatch.style.boxShadow  = swGlow;
  swatch.innerHTML        = swInner;

  // Info panel
  document.getElementById('di-z').textContent      = z.toFixed(4);
  document.getElementById('di-obs').textContent     = Math.round(obsWl) + ' Å';
  const regionEl = document.getElementById('di-region');
  regionEl.textContent = wlRegion(obsWl);
  // Colour-code the region text
  const regionColors = {
    'X-ray / EUV':'#e879f9','Ultraviolet':'#c4b5fd','Violet':'#a78bfa',
    'Blue':'#63b3ed','Green':'#68d391','Yellow / Orange':'#fcd34d',
    'Red (visible)':'#fc8181','Near Infrared':'#f97316',
    'Mid Infrared':'#ef4444','Far Infrared':'#dc2626'
  };
  regionEl.style.color = regionColors[wlRegion(obsWl)] || 'var(--qso)';
  document.getElementById('di-shift').textContent   = '+' + Math.round(shift) + ' Å (' + ((shift/REST_WL)*100).toFixed(1) + '%)';
  // doppler-label is updated directly in drawDoppler
  const swLabel = document.getElementById('doppler-swatch-label');
  if (swLabel) swLabel.textContent = Math.round(obsWl) + ' Å';

  // Show context note about the slider range
  const noteEl = document.getElementById('doppler-range-note');
  if (noteEl) {
    const delta = dopplerSliderMax - dopplerPredictedZ;
    noteEl.style.display = 'block';
    noteEl.textContent = 'Slider range: z = '
      + dopplerSliderMin.toFixed(3) + ' → ' + dopplerSliderMax.toFixed(3)
      + '  |  Predicted z = ' + dopplerPredictedZ.toFixed(4)
      + '  |  Hα at z=' + dopplerPredictedZ.toFixed(2)
      + ': ' + Math.round(6563*(1+dopplerPredictedZ)) + ' Å (' + wlRegion(6563*(1+dopplerPredictedZ)) + ')';
  }

  // Sync slider only when NOT animating (animation syncs it itself)
  if (!dopplerAnimHandle) {
    const slider = document.getElementById('doppler-slider');
    if (slider && Math.abs(parseFloat(slider.value) - z) > (dopplerSliderMax - dopplerSliderMin) * 0.003) {
      slider.value = z.toFixed(6);
    }
  }

  // ── Dynamic thumb: uses zHaColour(z) — matches strip and swatch ──
  const sliderEl = document.getElementById('doppler-slider');
  if (sliderEl) {
    const thumbGlow = `rgba(${sr},${sg},${sb},0.85)`;
    let dynStyle = document.getElementById('doppler-thumb-style');
    if (!dynStyle) {
      dynStyle = document.createElement('style');
      dynStyle.id = 'doppler-thumb-style';
      document.head.appendChild(dynStyle);
    }
    dynStyle.textContent = `
      #doppler-slider::-webkit-slider-thumb {
        background: rgb(${sr},${sg},${sb}) !important;
        border: 2.5px solid rgba(255,255,255,0.95) !important;
        box-shadow: 0 0 18px ${thumbGlow}, 0 0 5px rgba(0,0,0,0.7) !important;
        width: 22px !important; height: 22px !important;
      }
      #doppler-slider::-moz-range-thumb {
        background: rgb(${sr},${sg},${sb}) !important;
        border: 2.5px solid rgba(255,255,255,0.95) !important;
        box-shadow: 0 0 18px ${thumbGlow} !important;
        width: 22px !important; height: 22px !important;
      }
    `;
  }
}

function updateSliderTrack() {
  // Apply gradient DIRECTLY as inline style — always wins over CSS/stylesheets.
  const slider = document.getElementById('doppler-slider');
  if (!slider) return;
  const steps     = 20;
  const gradStops = [];
  for (let i = 0; i <= steps; i++) {
    const t    = i / steps;
    const z_t  = dopplerSliderMin + t * (dopplerSliderMax - dopplerSliderMin);
    const [r,g,b] = zHaColour(z_t);
    gradStops.push(`rgb(${r},${g},${b}) ${(t*100).toFixed(1)}%`);
  }
  slider.style.background = `linear-gradient(90deg, ${gradStops.join(', ')})`;
}

function drawDoppler(z) {
  const canvas = document.getElementById('doppler-canvas');
  if (!resizeCanvas(canvas)) return;
  const ctx = getScaledCtx(canvas);
  const W=canvas.offsetWidth, H=canvas.offsetHeight;
  const zMin = dopplerSliderMin;
  const zMax = dopplerSliderMax;
  const zSpan = zMax - zMin || 1;
  ctx.clearRect(0,0,W,H);

  // ── Layer 1: Physical wavelength strip with contrast stretching ──
  // x-axis = actual Hα wavelength from obsWl(zMin) to obsWl(zMax).
  // Colours are physical (spectral/IR) with brightness contrast-stretched
  // so the full range ALWAYS shows clear lightness differences.
  // Clamp: never below z=0 (Hα rest wavelength 6563Å = visible red)
  const wlStrip0 = 6563 * (1 + Math.max(0, zMin));
  const wlStrip1 = 6563 * (1 + Math.max(0, zMax));
  const wlStripSpan = wlStrip1 - wlStrip0 || 1;
  for (let x=0; x<W; x++) {
    const wl = wlStrip0 + (x / W) * wlStripSpan;
    const [sr,sg,sb] = stripPhysColour(wl, wlStrip0, wlStrip1);
    ctx.fillStyle = `rgb(${sr},${sg},${sb})`;
    ctx.fillRect(x, 0, 1, H);
  }

  // ── Layer 2: z value tick marks with readable labels ──
  const nTicks  = 5;
  const decimals = zSpan < 0.5 ? 4 : zSpan < 2 ? 3 : zSpan < 10 ? 2 : 1;
  for (let i=0; i<=nTicks; i++) {
    const t     = i / nTicks;
    const zTick = zMin + t * zSpan;
    const tx    = Math.max(1, Math.min(W-1, t*W));
    const labelX = Math.max(18, Math.min(W-18, tx));
    const label  = 'z=' + zTick.toFixed(decimals);

    // Measure text width for pill background
    ctx.font = 'bold 8px "Space Mono"';
    const tw = ctx.measureText(label).width;

    // Background pill for readability
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.beginPath();
    const ph=12, pw=tw+8;
    if (ctx.roundRect) ctx.roundRect(labelX-pw/2, H-ph-1, pw, ph, 3);
    else ctx.rect(labelX-pw/2, H-ph-1, pw, ph);
    ctx.fill();

    // Tick mark
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(tx,0); ctx.lineTo(tx,H-ph-3); ctx.stroke();

    // Label text
    ctx.fillStyle='rgba(255,255,255,0.95)';
    ctx.textAlign='center';
    ctx.fillText(label, labelX, H-3);
  }

  // ── Region boundary markers (physical transitions) ──
  const boundaries = [
    {z:(7500/6563-1),  label:'VIS→NIR'},
    {z:(14000/6563-1), label:'NIR→MIR'},
    {z:(50000/6563-1), label:'MIR→FIR'},
  ];
  boundaries.forEach(b => {
    if (b.z < zMin || b.z > zMax) return;
    const bx = ((b.z - zMin) / zSpan) * W;
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1; ctx.setLineDash([2,3]);
    ctx.beginPath(); ctx.moveTo(bx,0); ctx.lineTo(bx,H); ctx.stroke();
    ctx.setLineDash([]);
  });

  // ── Layer 3: Dark overlay so markers pop ──
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0,0,W,H);

  // ── Helper: z → x pixel using current slider range ──
  const zToX = zv => Math.max(1, Math.min(W-1, ((zv - zMin) / zSpan) * W));

  // ── Layer 4: Predicted z marker (dashed white) ──
  if (dopplerPredictedZ > 0) {
    const px = zToX(dopplerPredictedZ);  // clamped to strip width
    ctx.setLineDash([4,5]);
    ctx.strokeStyle='rgba(255,255,255,0.5)';
    ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(px,0); ctx.lineTo(px,H); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.font='7px "Space Mono"'; ctx.textAlign='center';
    // Show label at bottom, clamp so it stays inside canvas
    const predLabelX = Math.min(Math.max(px, 28), W-28);
    ctx.fillText('▲ z='+dopplerPredictedZ.toFixed(2), predLabelX, H-3);
  }

  // ── Layer 5: Current slider z marker (bright, glowing) ──
  const REST_WL = 6563;
  const obsWl   = REST_WL*(1+z);
  const mx      = zToX(z);

  // Marker glow uses full-brightness physical colour
  const [cr,cg,cb] = wlPhysColour(obsWl);

  // Glow halo
  const grd = ctx.createRadialGradient(mx,H/2,0,mx,H/2,H);
  grd.addColorStop(0, `rgba(${cr},${cg},${cb},0.9)`);
  grd.addColorStop(0.4,`rgba(${cr},${cg},${cb},0.3)`);
  grd.addColorStop(1,  'rgba(0,0,0,0)');
  ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(mx,H/2,H,0,Math.PI*2); ctx.fill();

  // Solid white line
  ctx.fillStyle='rgba(255,255,255,0.95)'; ctx.fillRect(mx-1,0,2,H);

  // Triangle pointer at top
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.moveTo(mx,0); ctx.lineTo(mx-7,10); ctx.lineTo(mx+7,10); ctx.closePath(); ctx.fill();

  // Keep slider track in sync with strip colours
  updateSliderTrack();

  // Update axis labels and center label
  const axisDecimals = zSpan < 1 ? 4 : zSpan < 5 ? 3 : 2;
  document.getElementById('doppler-label').textContent    = 'z = ' + z.toFixed(axisDecimals);
  document.getElementById('doppler-axis-min').textContent = 'z = ' + zMin.toFixed(axisDecimals) + ' ◀';
  document.getElementById('doppler-axis-max').textContent = '▶ z = ' + zMax.toFixed(axisDecimals);
  // Show wavelength range under the centre label
  const wlRangeEl = document.getElementById('doppler-wl-range');
  if (wlRangeEl) {
    const wl0 = Math.round(6563*(1+zMin)), wl1 = Math.round(6563*(1+zMax));
    const fmtWl = v => v >= 10000 ? (v/10000).toFixed(1)+'μm' : v+'Å';
    wlRangeEl.textContent = fmtWl(wl0) + ' → ' + fmtWl(wl1);
  }

  updateDopplerUI(z);
}

function onDopplerSlide(val) {
  stopDopplerAnim();
  const z = parseFloat(val);
  // Only update simData.z for other charts if within normal range
  // The doppler display always shows its own slider z
  drawDoppler(z);
}

// ── Animation ──
function toggleDopplerAnim() {
  if (dopplerAnimHandle) { stopDopplerAnim(); return; }
  dopplerAnimZ = dopplerSliderMin;  // start from min of current range
  document.getElementById('doppler-anim-btn').classList.add('playing');
  document.getElementById('doppler-anim-icon').textContent = '■';
  document.getElementById('doppler-anim-label').textContent = 'Stop (' + dopplerSliderMin.toFixed(2) + '→' + dopplerSliderMax.toFixed(2) + ')';
  animateDoppler();
}

function stopDopplerAnim() {
  if (dopplerAnimHandle) { cancelAnimationFrame(dopplerAnimHandle); dopplerAnimHandle = null; }
  document.getElementById('doppler-anim-btn').classList.remove('playing');
  document.getElementById('doppler-anim-icon').textContent = '▶';
  document.getElementById('doppler-anim-label').textContent = 'Animate z: ' + dopplerSliderMin.toFixed(2) + ' → ' + dopplerSliderMax.toFixed(2);
}

function animateDoppler() {
  const animStep = (dopplerSliderMax - dopplerSliderMin) / 500;  // ~500 frames
  dopplerAnimZ += Math.max(0.001, animStep);
  if (dopplerAnimZ > dopplerSliderMax) {
    stopDopplerAnim();
    // Snap back to predicted z when done
    const s = document.getElementById('doppler-slider');
    if (s) { s.value = dopplerPredictedZ.toFixed(6); }
    drawDoppler(dopplerPredictedZ);
    return;
  }
  // Keep slider thumb in sync with animation
  const s = document.getElementById('doppler-slider');
  if (s) s.value = dopplerAnimZ;
  drawDoppler(dopplerAnimZ);
  dopplerAnimHandle = requestAnimationFrame(animateDoppler);
}

function drawSED(mags) {
  const canvas = document.getElementById('sed-canvas');
  if (!resizeCanvas(canvas)) return;
  const ctx = getScaledCtx(canvas);
  const W=canvas.offsetWidth, H=canvas.offsetHeight;
  const pad={l:50,r:20,t:24,b:44};
  const cW=W-pad.l-pad.r, cH=H-pad.t-pad.b;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(12,21,40,0.85)'; ctx.fillRect(0,0,W,H);

  const minW=3000,maxW=10000;
  const minM=Math.min(...mags)-0.8, maxM=Math.max(...mags)+0.8;
  const xP=wl=>(pad.l+(wl-minW)/(maxW-minW)*cW);
  const yP=m =>(pad.t+(m-minM)/(maxM-minM)*cH);

  // Grid
  ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=1;
  for (let m=Math.ceil(minM); m<=maxM; m++) {
    ctx.beginPath(); ctx.moveTo(pad.l,yP(m)); ctx.lineTo(pad.l+cW,yP(m)); ctx.stroke();
    ctx.fillStyle='rgba(122,139,168,0.7)'; ctx.font='10px "Space Mono"'; ctx.textAlign='right';
    ctx.fillText(m.toFixed(0),pad.l-6,yP(m)+4);
  }
  // Band zones
  SDSS_BANDS.forEach((b,idx) => {
    const x=xP(b[1]), bw=cW*.07;
    ctx.globalAlpha=0.1; ctx.fillStyle=b[2];
    ctx.fillRect(x-bw/2,pad.t,bw,cH);
    ctx.globalAlpha=1;  // always reset before text
    ctx.fillStyle=b[2]; ctx.font='bold 11px "Space Mono"'; ctx.textAlign='center';
    ctx.fillText(b[0],x,pad.t+cH+30);
  });
  // Wavelength labels
  ctx.fillStyle='rgba(122,139,168,0.6)'; ctx.font='9px "Space Mono"';
  [4000,6000,8000].forEach(wl=>{ ctx.textAlign='center'; ctx.fillText(wl+'Å',xP(wl),pad.t+cH+14); });

  // SED line + glow
  ctx.shadowColor='rgba(99,179,237,0.5)'; ctx.shadowBlur=8;
  ctx.strokeStyle='rgba(99,179,237,0.8)'; ctx.lineWidth=2.5; ctx.beginPath();
  SDSS_BANDS.forEach((b,i)=>{ i===0?ctx.moveTo(xP(b[1]),yP(mags[i])):ctx.lineTo(xP(b[1]),yP(mags[i])); });
  ctx.stroke(); ctx.shadowBlur=0;

  // Points
  SDSS_BANDS.forEach((b,i) => {
    const x=xP(b[1]),y=yP(mags[i]);
    const grd=ctx.createRadialGradient(x,y,0,x,y,12);
    grd.addColorStop(0,b[2]); grd.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(x,y,12,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=b[2]; ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#e2e8f4'; ctx.font='bold 11px "Space Mono"'; ctx.textAlign='center';
    ctx.fillText(mags[i].toFixed(2),x,y-12);
  });
  // Y label
  ctx.save(); ctx.translate(14,H/2); ctx.rotate(-Math.PI/2);
  ctx.fillStyle='rgba(122,139,168,0.7)'; ctx.font='10px "Space Mono"'; ctx.textAlign='center';
  ctx.fillText('Magnitude',0,0); ctx.restore();
}

function drawSpectral(z) {
  const canvas = document.getElementById('spectral-canvas');
  if (!resizeCanvas(canvas)) return;
  const ctx = getScaledCtx(canvas);
  const W=canvas.offsetWidth, H=canvas.offsetHeight;
  // Adaptive padding based on canvas width
  const isMobile = W < 500;
  const pad = {l:isMobile?44:60, r:16, t:34, b:isMobile?40:50};
  const cW=W-pad.l-pad.r, cH=H-pad.t-pad.b;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(7,13,26,0.92)'; ctx.fillRect(0,0,W,H);

  const wlMin=500, wlMax=12000;
  const xP=wl=>pad.l+(wl-wlMin)/(wlMax-wlMin)*cW;

  // Spectrum gradient background
  for (let x=0; x<cW; x++) {
    const wl=wlMin+(x/cW)*(wlMax-wlMin);
    const [r,g,b]=wl2rgb(wl);
    ctx.globalAlpha=0.12; ctx.fillStyle=`rgb(${r},${g},${b})`;
    ctx.fillRect(pad.l+x,pad.t,1,cH);
  }
  ctx.globalAlpha=1;

  // SDSS bands
  SDSS_BANDS.forEach(b => {
    const x=xP(b[1]);
    ctx.globalAlpha=0.12; ctx.fillStyle=b[2];
    ctx.fillRect(x-20,pad.t,40,cH);
    ctx.globalAlpha=1;  // reset to full opacity for text
    ctx.fillStyle=b[2]; ctx.font=`bold ${isMobile?8:10}px "Space Mono"`; ctx.textAlign='center';
    ctx.fillText(b[0],x,pad.t+cH+(isMobile?12:16));
  });

  // Axis
  ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(pad.l,pad.t+cH); ctx.lineTo(pad.l+cW,pad.t+cH); ctx.stroke();
  const wlTicks = isMobile ? [2000,4000,6000,10000] : [1000,3000,5000,7000,10000];
  wlTicks.forEach(wl => {
    if(wl<wlMin||wl>wlMax)return;
    ctx.fillStyle='rgba(122,139,168,0.6)'; ctx.font=`${isMobile?8:9}px "Space Mono"`; ctx.textAlign='center';
    ctx.fillText(wl+'Å',xP(wl),pad.t+cH+(isMobile?26:30));
  });
  ctx.fillStyle='rgba(122,139,168,0.7)'; ctx.font=`${isMobile?8:10}px "Space Mono"`; ctx.textAlign='center';
  ctx.fillText('Observed Wavelength (Å)',pad.l+cW/2,H-4);

  // Emission lines — each row gets equal height
  const rowH = cH / EMISSION_LINES.length;
  EMISSION_LINES.forEach((line,i) => {
    const restWl=line[1], obsWl=restWl*(1+z), y=pad.t+(i+0.5)*rowH, col=line[2];
    // Rest (dashed)
    if (restWl>=wlMin&&restWl<=wlMax) {
      ctx.setLineDash([3,4]); ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(xP(restWl),pad.t); ctx.lineTo(xP(restWl),pad.t+cH); ctx.stroke();
    }
    // Observed (solid)
    ctx.setLineDash([]);
    if (obsWl>=wlMin&&obsWl<=wlMax) {
      ctx.strokeStyle=col; ctx.lineWidth=1.8; ctx.shadowColor=col; ctx.shadowBlur=5;
      ctx.beginPath(); ctx.moveTo(xP(obsWl),pad.t); ctx.lineTo(xP(obsWl),y); ctx.stroke();
      ctx.shadowBlur=0;
      // Dot marker
      ctx.fillStyle=col; ctx.beginPath(); ctx.arc(xP(obsWl),y,3,0,Math.PI*2); ctx.fill();
      // Label — clamp to canvas bounds
      const lx=Math.min(Math.max(xP(obsWl),pad.l+22),pad.l+cW-22);
      const fs=isMobile?7:9;
      ctx.fillStyle=col; ctx.font=`bold ${fs}px "Space Mono"`; ctx.textAlign='center';
      ctx.fillText(line[0],lx,y-(rowH*.25));
      ctx.fillStyle='rgba(226,232,244,0.45)'; ctx.font=`${fs-1}px "Space Mono"`;
      ctx.fillText(Math.round(obsWl)+'Å',lx,y+(rowH*.2));
    }
  });
  ctx.setLineDash([]);

  // Legend
  const legFs=isMobile?8:9;
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.font=`${legFs}px "Space Mono"`; ctx.textAlign='left';
  ctx.setLineDash([3,4]); ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(pad.l,pad.t-14); ctx.lineTo(pad.l+22,pad.t-14); ctx.stroke();
  ctx.fillText('rest',pad.l+26,pad.t-10); ctx.setLineDash([]);
  ctx.strokeStyle='#63b3ed'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(pad.l+(isMobile?60:80),pad.t-14); ctx.lineTo(pad.l+(isMobile?82:102),pad.t-14); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.35)';
  ctx.fillText(`observed z=${z.toFixed(3)}`,pad.l+(isMobile?86:106),pad.t-10);
}

function drawCosmic(z) {
  const C=299792, H0=70, MPC_TO_LY=3.26156e6;
  const recessV = z<1 ? C*z : C*((Math.pow(1+z,2)-1)/(Math.pow(1+z,2)+1));
  const distMpc  = (C/H0)*z;
  const distGly  = distMpc*MPC_TO_LY/1e9;
  const safeZ    = Math.max(z, 0.0001);  // avoid division by zero / overlap at z=0
  const ltt      = 13.8*(1-1/Math.pow(1+safeZ,0.6));

  document.getElementById('cosmic-stats').innerHTML = [
    {label:'Recession Velocity', value:recessV>C?`≈${(recessV/C).toFixed(2)}c`:`${(recessV/1000).toFixed(1)} Mm/s`, sub:`${(recessV/C*100).toFixed(1)}% of c`},
    {label:'Comoving Distance',  value:`${distMpc.toFixed(0)} Mpc`, sub:`${distGly.toFixed(2)} Gly`},
    {label:'Light Travel Time',  value:`${ltt.toFixed(2)} Gyr`, sub:`Emitted ${ltt.toFixed(2)}B yrs ago`},
    {label:'Scale Factor a',     value:`${(1/(1+z)).toFixed(4)}`, sub:`Universe ${((1/(1+z))*100).toFixed(1)}% of today`},
  ].map(s=>`<div class="result-stat"><div class="stat-label">${s.label}</div><div class="stat-value" style="font-size:clamp(11px,2vw,13px)">${s.value}</div><div style="font-size:10px;color:var(--text-dim);font-family:'Space Mono',monospace;margin-top:4px">${s.sub}</div></div>`).join('');

  const canvas=document.getElementById('cosmic-canvas');
  if (!resizeCanvas(canvas)) return;
  const ctx=getScaledCtx(canvas);
  const W=canvas.offsetWidth, H=canvas.offsetHeight;
  const isMobile=W<400;
  const padX=isMobile?30:50;

  const bg=ctx.createLinearGradient(0,0,W,0);
  bg.addColorStop(0,'#1a0a2e'); bg.addColorStop(.3,'#0a1628'); bg.addColorStop(1,'#03060f');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

  const barY=H/2, barH=8;
  const barGrd=ctx.createLinearGradient(padX,0,W-padX,0);
  barGrd.addColorStop(0,'#b794f4'); barGrd.addColorStop(.3,'#63b3ed');
  barGrd.addColorStop(.7,'#f6ad55'); barGrd.addColorStop(1,'#fc8181');
  ctx.fillStyle=barGrd; ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(padX,barY-barH/2,W-2*padX,barH,4);
  else ctx.rect(padX,barY-barH/2,W-2*padX,barH);
  ctx.fill();

  const fs=isMobile?8:10;
  // Big Bang
  ctx.fillStyle='#b794f4'; ctx.beginPath(); ctx.arc(padX,barY,7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(226,232,244,0.7)'; ctx.font=`${fs}px "Space Mono"`; ctx.textAlign='center';
  ctx.fillText('Big Bang',padX,barY-16); ctx.fillText('0 Gyr',padX,barY+22);
  // Now
  ctx.fillStyle='#68d391'; ctx.beginPath(); ctx.arc(W-padX,barY,7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(226,232,244,0.7)'; ctx.textAlign='center';
  ctx.fillText('Now',W-padX,barY-16); ctx.fillText('13.8 Gyr',W-padX,barY+22);
  // Object
  const objX=padX+(ltt/13.8)*(W-2*padX);
  ctx.shadowColor='#f6ad55'; ctx.shadowBlur=12;
  ctx.fillStyle='#f6ad55'; ctx.beginPath(); ctx.arc(objX,barY,9,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;
  ctx.fillStyle='#f6ad55'; ctx.font=`bold ${fs}px "Space Mono"`; ctx.textAlign='center';
  ctx.fillText('Object',objX,barY-18);
  ctx.fillStyle='rgba(226,232,244,0.8)'; ctx.font=`${fs}px "Space Mono"`;
  ctx.fillText(`z=${z.toFixed(3)}`,objX,barY+22);
  // Arrow
  if (objX+12 < W-padX-12) {
    ctx.setLineDash([4,4]); ctx.strokeStyle='rgba(246,173,85,0.4)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(objX+12,barY); ctx.lineTo(W-padX-12,barY); ctx.stroke();
    ctx.setLineDash([]);
  }
}

function runSimulation(z, mags) {
  simData           = {z, mags};
  dopplerPredictedZ = z;          // raw predicted z — used for dashed marker and range note
  stopDopplerAnim();

  // Set slider range centered on predicted z
  const delta       = calcDelta(z);
  dopplerSliderMin  = Math.max(0, z - delta);
  dopplerSliderMax  = z + delta;
  const slider      = document.getElementById('doppler-slider');
  if (slider) {
    slider.min   = dopplerSliderMin.toFixed(6);
    slider.max   = dopplerSliderMax.toFixed(6);
    slider.step  = (delta / 250).toFixed(6);  // ~500 steps across range
    slider.value = z.toFixed(6);
  }

  // Update animate button label to show new range
  const animLabel = document.getElementById('doppler-anim-label');
  if (animLabel) animLabel.textContent = 'Animate z: ' + dopplerSliderMin.toFixed(2) + ' → ' + dopplerSliderMax.toFixed(2);

  // Update slider track gradient to match strip
  updateSliderTrack();

  const panel = document.getElementById('sim-panel');
  panel.style.display = 'block';

  // Small delay so panel is visible and canvases have layout size
  setTimeout(() => {
    drawDoppler(z);         // start at predicted z
    drawSED(mags);
    drawSpectral(z);        // spectral/cosmic use the real predicted z
    drawCosmic(z);
  }, 250);

  setTimeout(() => panel.scrollIntoView({behavior:'smooth', block:'start'}), 100);
}

// ══════════════════════════════════════════════
// MASCOT — requestAnimationFrame sine animator
// Runs at the display's native refresh rate
// ══════════════════════════════════════════════
(function() {
  const img = document.querySelector('.mascot-img');
  if (!img) return;

  // Physics parameters
  const FLOAT_AMP   = 13;    // px up/down travel
  const FLOAT_FREQ  = 0.55;  // Hz  (cycles per second)
  const SCALE_AMP   = 0.018; // scale pulse ±1.8%
  const GLOW_LO_A   = 0.08;  // min glow alpha
  const GLOW_HI_A   = 0.55;  // max glow alpha
  const GLOW_LO_B   = 0.06;
  const GLOW_HI_B   = 0.30;

  let startTime = null;

  function tick(ts) {
    if (!startTime) startTime = ts;
    const elapsed = (ts - startTime) / 1000;  // seconds

    // Sine wave: smooth, continuous, native-rate
    const s    = Math.sin(elapsed * FLOAT_FREQ * Math.PI * 2);  // -1 → +1
    const s01  = (s + 1) / 2;                                    //  0 → 1

    // Float: centre at -FLOAT_AMP/2 so it bobs symmetrically
    const ty   = -s01 * FLOAT_AMP;

    // Scale: subtle breathe in sync with float
    const sc   = 1 + s01 * SCALE_AMP;

    // Glow: interpolate alpha
    const ga   = GLOW_LO_A + s01 * (GLOW_HI_A - GLOW_LO_A);
    const gb   = GLOW_LO_B + s01 * (GLOW_HI_B - GLOW_LO_B);

    img.style.transform = `translateY(${ty.toFixed(3)}px) scale(${sc.toFixed(4)})`;
    img.style.filter    =
      `drop-shadow(0 ${(4+s01*8).toFixed(1)}px ${(8+s01*20).toFixed(1)}px rgba(99,179,237,${ga.toFixed(3)}))` +
      ` drop-shadow(0 0 ${(4+s01*16).toFixed(1)}px rgba(99,179,237,${gb.toFixed(3)}))`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
