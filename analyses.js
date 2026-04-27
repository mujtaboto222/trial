// ── EXTRA ANALYSES ──
// All future analyses go in this file.
// Each analysis is just an array of {s, n, d, norm, u, c} objects,
// using the global helpers (ang, dst, etc.) defined in app.js.
//
// To wire a new analysis into the app, also do:
//   1. Add a mode item in index.html (mode-menu)
//   2. Add the same 4 small switch cases in app.js (badge, screen badge, activeMeas x2, PDF badge color)
//   3. Add a CSS class .mode-chip-<name> in style.css


// ── JARABAK ANALYSIS ──
// Norms from Jarabak & Fizzell. All angles use existing landmarks.
// Total Sum = Saddle + Articular + Gonial.
// Jarabak ratio = (Posterior face height / Anterior face height) * 100.
const MEAS_JARABAK = [
  // ── Skeletal ─────────────────────────────────
  {s:'Skeletal', n:'Saddle Angle',
   d:'Angle at Sella between N-S and S-Ar',
   norm:[123,6], u:'°', c:p=> ang(p.N, p.S, p.Ar)},

  {s:'Skeletal', n:'Articular Angle',
   d:'Angle at Articulare between S-Ar and Ar-Go',
   norm:[143,5], u:'°', c:p=> ang(p.S, p.Ar, p.Go)},

  {s:'Skeletal', n:'Gonial Angle',
   d:'Angle at Gonion between Ar-Go and Go-Me',
   norm:[130,6], u:'°', c:p=> ang(p.Ar, p.Go, p.Me)},

  {s:'Skeletal', n:'Sum of Angles',
   d:'Saddle + Articular + Gonial',
   norm:[396,5], u:'°',
   c:p=> ang(p.N,p.S,p.Ar) + ang(p.S,p.Ar,p.Go) + ang(p.Ar,p.Go,p.Me)},

  {s:'Skeletal', n:'Posterior Cranial Base',
   d:'Distance S-Ar',
   norm:[32,3], u:'mm', c:p=> dst(p.S, p.Ar)},

  {s:'Skeletal', n:'Anterior Cranial Base',
   d:'Distance S-N',
   norm:[71,3], u:'mm', c:p=> dst(p.S, p.N)},

  {s:'Skeletal', n:'Ramus Height',
   d:'Distance Ar-Go',
   norm:[44,5], u:'mm', c:p=> dst(p.Ar, p.Go)},

  {s:'Skeletal', n:'Mandibular Body Length',
   d:'Distance Go-Me',
   norm:[71,5], u:'mm', c:p=> dst(p.Go, p.Me)},

  {s:'Skeletal', n:'Posterior Facial Height',
   d:'Distance S-Go',
   norm:[77.5,7.5], u:'mm', c:p=> dst(p.S, p.Go)},

  {s:'Skeletal', n:'Anterior Facial Height',
   d:'Distance N-Me',
   norm:[112.5,7.5], u:'mm', c:p=> dst(p.N, p.Me)},

  {s:'Skeletal', n:'Jarabak Ratio',
   d:'Posterior / Anterior facial height × 100',
   norm:[63.5,1.5], u:'%',
   c:p=> (dst(p.S, p.Go) / dst(p.N, p.Me)) * 100},
];
