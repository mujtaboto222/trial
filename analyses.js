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


// ── RICKETTS ANALYSIS ──
// 13 measurements from Ricketts' cephalometric analysis.
// Uses standard helpers + Ricketts-only landmarks: Ba, Ptm, PM, Xi, DC.
//   - Ba and Ptm are auto-derived from AI landmarks (calibrated offsets).
//   - PM is auto-derived from Pog (calibrated offset).
//   - Xi and DC are initialised geometrically when Ricketts mode is selected;
//     user adjusts them by dragging the dots on the image.
const MEAS_RICKETTS = [
  // ── Skeletal ─────────────────────────────────
  {s:'Skeletal', n:'Facial Axis',
   d:'Angle between Ba-N line and Ptm-Gn (facial axis) line',
   norm:[90,3], u:'°', c:p=> lineAng([p.Ba,p.N],[p.Ptm,p.Gn])},

  {s:'Skeletal', n:'Facial Depth',
   d:'Angle between FH plane (Po-Or) and facial plane (N-Pog)',
   norm:[87,3], u:'°', c:p=> lineAng([p.Po,p.Or],[p.N,p.Pog])},

  {s:'Skeletal', n:'Mandibular Plane Angle',
   d:'Angle between FH plane (Po-Or) and mandibular plane (Go-Me)',
   norm:[26,4], u:'°', c:p=> lineAng([p.Po,p.Or],[p.Go,p.Me])},

  {s:'Skeletal', n:'Facial Taper',
   d:'Angle between facial plane (N-Pog) and mandibular plane (Go-Me)',
   norm:[68,4], u:'°', c:p=> lineAng([p.N,p.Pog],[p.Go,p.Me])},

  {s:'Skeletal', n:'Mandibular Arc',
   d:'Angle at Xi between Xi-DC and Xi-PM (curvature of corpus to ramus)',
   norm:[26,4], u:'°', c:p=> 180 - ang(p.DC, p.Xi, p.PM)},

  {s:'Skeletal', n:'Convexity of Point A',
   d:'Perpendicular distance from A to N-Pog line (+ve = anterior)',
   norm:[2,2], u:'mm', c:p=> p2line(p.A, p.N, p.Pog)},

  {s:'Skeletal', n:'Lower Facial Height',
   d:'Angle at Xi between Xi-ANS and Xi-PM',
   norm:[47,4], u:'°', c:p=> ang(p.ANS, p.Xi, p.PM)},

  // ── Dental ───────────────────────────────────
  {s:'Dental', n:'L1 to A-Pog (deg)',
   d:'Angle between lower incisor axis and A-Pog line',
   norm:[22,4], u:'°', c:p=> lineAng([p.L1tip,p.L1ap],[p.A,p.Pog])},

  {s:'Dental', n:'L1 to A-Pog (mm)',
   d:'Perpendicular distance from L1 tip to A-Pog line',
   norm:[1,2], u:'mm', c:p=> p2line(p.L1tip, p.A, p.Pog)},

  {s:'Dental', n:'Upper Molar to PTV',
   d:'Horizontal distance from U6 to vertical line through Ptv',
   norm:[21,3], u:'mm', c:p=> Math.abs(p.U6.x - p.Ptm.x)},

  {s:'Dental', n:'Interincisal Angle',
   d:'Angle between upper and lower incisor long axes',
   norm:[130,6], u:'°', c:p=> interinc(p)},

  // ── Soft Tissue ──────────────────────────────
  {s:'Soft Tissue', n:'Lower Lip to E-plane',
   d:"Lower lip to Ricketts' esthetic line (Prn-Pog')",
   norm:[0,2], u:'mm', c:p=> p2line(p.Li, p.Prn, p.Pogp)},
];
