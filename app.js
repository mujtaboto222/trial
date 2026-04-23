const LM = [
  {id:'S',   abbr:'S',   name:'Sella',               group:'Cranial Base',
   hint:'Geometric center of the pituitary fossa (sella turcica) on the cranial base.'},
  {id:'N',   abbr:'N',   name:'Nasion',              group:'Cranial Base',
   hint:'Most anterior point of the frontonasal suture — top of the nose bridge on the midline.'},
  {id:'Or',  abbr:'Or',  name:'Orbitale',            group:'Cranial Base',
   hint:'Lowest point on the inferior orbital rim (floor of the eye socket).'},
  {id:'Po',  abbr:'Po',  name:'Porion',              group:'Cranial Base',
   hint:'Uppermost point of the external auditory meatus (top of the ear canal opening).'},
  {id:'Ar',  abbr:'Ar',  name:'Articulare',          group:'Cranial Base',
   hint:'Intersection of the posterior ramus border with the inferior cranial base surface.'},
  {id:'ANS', abbr:'ANS', name:'Ant. Nasal Spine',    group:'Maxilla',
   hint:'Tip of the anterior nasal spine — the sharp bony point at the base of the nasal aperture, projecting forward.'},
  {id:'PNS', abbr:'PNS', name:'Post. Nasal Spine',   group:'Maxilla',
   hint:'Most posterior tip of the hard palate — the back end of the palatine bone.'},
  {id:'A',   abbr:'A',   name:'Point A (Subspinale)',group:'Maxilla',
   hint:'Deepest point of the concavity on the anterior maxilla surface, between ANS and the alveolar crest.'},
  {id:'U1tip',abbr:'U1t',name:'Upper Incisor Tip',   group:'Maxilla',
   hint:'Incisal edge of the upper central incisor — the cutting tip of the upper front tooth. ⚠️ Most INFERIOR point of the crown.'},
  {id:'U1ap', abbr:'U1a',name:'Upper Incisor Apex',  group:'Maxilla',
   hint:'Root apex of the upper central incisor. ⚠️ Located ABOVE the crown — trace the root superiorly to its tip.'},
  {id:'L1tip',abbr:'L1t',name:'Lower Incisor Tip',   group:'Mandible',
   hint:'Incisal edge of the lower central incisor — the cutting tip of the lower front tooth. ⚠️ Most SUPERIOR point of the crown.'},
  {id:'L1ap', abbr:'L1a',name:'Lower Incisor Apex',  group:'Mandible',
   hint:'Root apex of the lower central incisor. ⚠️ Located BELOW the crown — trace the root inferiorly to its tip.'},
  {id:'B',   abbr:'B',   name:'Point B (Supramentale)',group:'Mandible',
   hint:'Deepest point of the concavity on the anterior mandible surface, between the lower incisor crest and Pogonion.'},
  {id:'Pog', abbr:'Pog', name:'Pogonion',            group:'Mandible',
   hint:'Most anterior point of the bony chin (mandibular symphysis).'},
  {id:'Gn',  abbr:'Gn',  name:'Gnathion',            group:'Mandible',
   hint:'Most anterior-inferior point of the bony chin — midpoint between Pogonion and Menton.'},
  {id:'Me',  abbr:'Me',  name:'Menton',              group:'Mandible',
   hint:'Lowest point of the mandibular symphysis — the very bottom of the bony chin.'},
  {id:'Go',  abbr:'Go',  name:'Gonion',              group:'Mandible',
   hint:'Most posterior-inferior point at the mandibular angle — constructed by bisecting the ramus-body angle.'},
  {id:'Co',  abbr:'Co',  name:'Condylion',           group:'Mandible',
   hint:'Most superior-posterior point on the mandibular condyle — top of the condylar head.'},
  // Occlusal landmarks — used to auto-fit the functional occlusal plane
  {id:'U6',  abbr:'U6',  name:'Upper Molar (cusp tip)',  group:'Occlusal',
   hint:'Mesiobuccal cusp tip of the upper first molar. Used with L6, U4, L4 to define the functional occlusal plane.'},
  {id:'L6',  abbr:'L6',  name:'Lower Molar (cusp tip)',  group:'Occlusal',
   hint:'Mesiobuccal cusp tip of the lower first molar. Used with U6, U4, L4 to define the functional occlusal plane.'},
  {id:'U4',  abbr:'U4',  name:'Upper Premolar (cusp tip)',group:'Occlusal',
   hint:'Cusp tip of the upper first premolar. Used with U6, L6, L4 to define the functional occlusal plane.'},
  {id:'L4',  abbr:'L4',  name:'Lower Premolar (cusp tip)',group:'Occlusal',
   hint:'Cusp tip of the lower first premolar. Used with U6, L6, U4 to define the functional occlusal plane.'},
  {id:'Sn',  abbr:'Sn',  name:'Subnasale',           group:'Soft Tissue',
   hint:'Junction of the columella base and the upper lip — base of the nose, not the nose tip.'},
  {id:'Prn', abbr:'Prn', name:'Pronasale',           group:'Soft Tissue',
   hint:'Most anterior point of the nose tip on the soft tissue profile.'},
  {id:'Ls',  abbr:'Ls',  name:'Labrale Superius',    group:'Soft Tissue',
   hint:'Most anterior point of the upper lip vermillion border.'},
  {id:'Li',  abbr:'Li',  name:'Labrale Inferius',    group:'Soft Tissue',
   hint:'Most anterior point of the lower lip vermillion border.'},
  {id:'Pogp',abbr:"Pog'",name:'ST Pogonion',         group:'Soft Tissue',
   hint:"Most anterior point of the soft tissue chin overlying bony Pogonion."},
];

const COLORS={'Cranial Base':'#58a6ff','Maxilla':'#3fb950','Mandible':'#f0883e','Occlusal':'#e8c06c','Soft Tissue':'#bc8cff'};
const getCol=id=>COLORS[LM.find(l=>l.id===id)?.group]||'#fff';


// ── GEOMETRY — verified against known-answer coords ──
// pts stored as 0-1 normalised; convert via pxMap() before analysis.

// Convert normalised pt → true image pixels
function px(pt){ return {x: pt.x * imgEl.naturalWidth, y: pt.y * imgEl.naturalHeight}; }
function pxMap(p){ const o={}; for(const k in p) o[k]=px(p[k]); return o; }

// Euclidean distance
function dst(a,b){ return Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2); }

// Angle at vertex V between rays V→A and V→B  (0–180°)
function ang(A, V, B){
  const v1={x:A.x-V.x, y:A.y-V.y}, v2={x:B.x-V.x, y:B.y-V.y};
  const cos=(v1.x*v2.x+v1.y*v2.y)/(Math.sqrt(v1.x**2+v1.y**2)*Math.sqrt(v2.x**2+v2.y**2));
  return Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI;
}
// SNA = angle at N, rays N→S and N→A  ✓ verified
// SNB = angle at N, rays N→S and N→B  ✓ verified
// ANB = SNA − SNB                       ✓ verified

// Acute angle between two line segments (0–90°)
// Used for plane-to-plane angles (MMPA, FMPA, SN-MaxPlane, Y-Axis)
function lineAng(l1, l2){
  const a={x:l1[1].x-l1[0].x, y:l1[1].y-l1[0].y};
  const b={x:l2[1].x-l2[0].x, y:l2[1].y-l2[0].y};
  const cos=Math.abs((a.x*b.x+a.y*b.y)/(Math.sqrt(a.x**2+a.y**2)*Math.sqrt(b.x**2+b.y**2)));
  return Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI;
}

// Raw angle between two vectors (0–180°)
function vecAngle(ax, pl){
  const lenAx=Math.sqrt(ax.x**2+ax.y**2), lenPl=Math.sqrt(pl.x**2+pl.y**2);
  const cosA=(ax.x*pl.x+ax.y*pl.y)/(lenAx*lenPl);
  return Math.acos(Math.max(-1,Math.min(1,cosA)))*180/Math.PI;
}

// U1 inclination to a plane.
// Clinically: angle between upper incisor axis and palatal plane, measured
// on the superior/posterior side. For a normally inclined U1 this is ~109°.
// U1 apex is ABOVE tip (smaller y). The axis vector (apex→tip) points downward.
// The palatal plane (PNS→ANS) points forward.
// We check: if tip is BELOW the plane (as expected), return 180 - raw; else raw.
function inclinU(apexPt, tipPt, planePost, planeAnt){
  const ax={x:tipPt.x-apexPt.x, y:tipPt.y-apexPt.y};
  const pl={x:planeAnt.x-planePost.x, y:planeAnt.y-planePost.y};
  const raw = vecAngle(ax, pl);
  // cross product: plane × vector from planePost to tipPt
  // positive (y-down coords) = tipPt is BELOW the plane
  const cross = pl.x*(tipPt.y-planePost.y) - pl.y*(tipPt.x-planePost.x);
  return cross > 0 ? 180 - raw : raw;
}

// L1 inclination to a plane.
// Clinically: angle between lower incisor axis and mandibular plane (Go-Me),
// measured on the ANTERIOR side where the tooth leans into the plane. ~93° normal.
// L1 apex is BELOW tip (larger y). The axis vector (apex→tip) points upward.
// We check: if tip is ABOVE the plane (as expected for a lower incisor), return 180 - raw; else raw.
function inclinL(apexPt, tipPt, planePost, planeAnt){
  const ax={x:tipPt.x-apexPt.x, y:tipPt.y-apexPt.y};
  const pl={x:planeAnt.x-planePost.x, y:planeAnt.y-planePost.y};
  const raw = vecAngle(ax, pl);
  // cross product sign tells us which side of the plane the tip is on
  // In y-down image coords: negative cross = tip is ABOVE the plane
  const cross = pl.x*(tipPt.y-planePost.y) - pl.y*(tipPt.x-planePost.x);
  return cross < 0 ? 180 - raw : raw;
}

// Legacy alias
function inclin(apexPt, tipPt, planePost, planeAnt){
  return inclinL(apexPt, tipPt, planePost, planeAnt);
}

// Interincisal angle = angle between the two long-axis vectors (apex→tip each).
// U1 points down-forward; L1 points up-forward → they diverge → direct acos gives ~130-145°  ✓ verified
function interinc(p){
  const u={x:p.U1tip.x-p.U1ap.x, y:p.U1tip.y-p.U1ap.y};
  const l={x:p.L1tip.x-p.L1ap.x, y:p.L1tip.y-p.L1ap.y};
  const cos=(u.x*l.x+u.y*l.y)/(Math.sqrt(u.x**2+u.y**2)*Math.sqrt(l.x**2+l.y**2));
  return Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI;
}

// Perpendicular distance from pt to infinite line through A and B.
// Sign: positive = point on left side of A→B direction.
function p2line(pt, A, B){
  const dx=B.x-A.x, dy=B.y-A.y, len=Math.sqrt(dx**2+dy**2);
  return (dy*pt.x - dx*pt.y + B.x*A.y - B.y*A.x) / len;
}

// Project point onto line A→B
function proj(pt, A, B){
  const dx=B.x-A.x, dy=B.y-A.y, t=((pt.x-A.x)*dx+(pt.y-A.y)*dy)/(dx**2+dy**2);
  return {x:A.x+t*dx, y:A.y+t*dy};
}

// Occlusal plane direction from the draggable occlusal plane tool.
// Returns unit vector {ux,uy} along the plane (posterior→anterior).
// occPlane is stored in normalised coords: {p1,p2,ctrl}
function occPlaneDir(){
  if(!occPlane) return null;
  const p = pxMap({p1:occPlane.p1, p2:occPlane.p2});
  const dx = p.p2.x - p.p1.x, dy = p.p2.y - p.p1.y;
  const len = Math.sqrt(dx*dx + dy*dy);
  if(len < 1) return null;
  return {ux: dx/len, uy: dy/len, p1: p.p1};
}

// Wits appraisal: AO-BO projected onto functional occlusal plane.
// Positive = AO anterior to BO (Class II tendency).
function wits(p){
  const op = occPlaneDir();
  if(!op) return null;
  const {ux, uy, p1} = op;
  // Project A and B onto occlusal plane line
  const tA = (p.A.x - p1.x)*ux + (p.A.y - p1.y)*uy;
  const tB = (p.B.x - p1.x)*ux + (p.B.y - p1.y)*uy;
  return tA - tB;
}

const MEAS=[
  // ── Skeletal ─────────────────────────────────
  {s:'Skeletal', n:'SNA', d:'Maxillary position to cranial base',
   norm:[81,3], u:'°', c:p=> ang(p.S, p.N, p.A)},

  {s:'Skeletal', n:'SNB', d:'Mandibular position to cranial base',
   norm:[78,3], u:'°', c:p=> ang(p.S, p.N, p.B)},

  {s:'Skeletal', n:'ANB', d:'Sagittal jaw relationship (SNA − SNB)',
   norm:[3,2], u:'°', c:p=> ang(p.S,p.N,p.A) - ang(p.S,p.N,p.B)},

  {s:'Skeletal', n:'Wits Appraisal', d:'AO–BO on functional occlusal plane',
   norm:[0,2], u:'mm', c:p=> wits(p)},

  {s:'Skeletal', n:'MMPA', d:'Maxillary plane to mandibular plane',
   norm:[27,5], u:'°', c:p=> lineAng([p.PNS,p.ANS],[p.Go,p.Me])},

  {s:'Skeletal', n:'SN–Maxillary Plane', d:'SN line to palatal plane',
   norm:[8,3], u:'°', c:p=> lineAng([p.S,p.N],[p.PNS,p.ANS])},

  {s:'Skeletal', n:'FMPA', d:'Frankfort horizontal to mandibular plane',
   norm:[27,5], u:'°', c:p=> lineAng([p.Po,p.Or],[p.Go,p.Me])},

  {s:'Skeletal', n:'LAFH', d:'Lower anterior face height (ANS–Me)',
   norm:[65,4], u:'mm', c:p=> dst(p.ANS,p.Me)},

  {s:'Skeletal', n:'LAFH:TAFH %', d:'Lower / total anterior face height ratio',
   norm:[55,2], u:'%', c:p=> (dst(p.ANS,p.Me)/dst(p.N,p.Me))*100},

  // ── Dental ───────────────────────────────────
  {s:'Dental', n:'U1 to Maxillary Plane', d:'Upper incisor long axis to palatal plane',
   norm:[109,6], u:'°', c:p=> inclinU(p.U1ap, p.U1tip, p.PNS, p.ANS)},

  {s:'Dental', n:'L1 to Mandibular Plane', d:'Lower incisor long axis to mandibular plane',
   norm:[93,6], u:'°', c:p=> inclin(p.L1ap, p.L1tip, p.Go, p.Me)},

  {s:'Dental', n:'Overjet', d:'U1tip to L1tip parallel to occlusal plane',
   norm:[3,1], u:'mm', c:p=> overjet(p)},

  {s:'Dental', n:'Interincisal Angle', d:'Angle between upper and lower incisor long axes',
   norm:[133,10], u:'°', c:p=> interinc(p)},

  {s:'Dental', n:'L1 to A-Pog', d:'Lower incisor tip perpendicular to A-Pog line',
   norm:[1,2], u:'mm', c:p=> p2line(p.L1tip, p.A, p.Pog)},

  // ── Soft Tissue ──────────────────────────────
  {s:'Soft Tissue', n:'Upper Lip to E-line', d:"Upper lip to Ricketts' esthetic line",
   norm:[-2,2], u:'mm', c:p=> p2line(p.Ls, p.Prn, p.Pogp)},

  {s:'Soft Tissue', n:'Lower Lip to E-line', d:"Lower lip to Ricketts' esthetic line",
   norm:[0,2], u:'mm', c:p=> p2line(p.Li, p.Prn, p.Pogp)},

  {s:'Soft Tissue', n:'Nasolabial Angle', d:'Angle at subnasale between Prn–Sn–Ls',
   norm:[102,8], u:'°', c:p=> ang(p.Prn, p.Sn, p.Ls)},
];


// ── McNAMARA ANALYSIS — geometry helpers + norms ──
// N-Perpendicular: vertical line through Nasion ⊥ FH

// Project a point onto a line defined by two points; return signed distance
// from the foot of the perpendicular to a reference origin along the line.
// Also returns the perpendicular (off-line) signed distance.
function fhComponents(pt, Po, Or){
  // FH direction unit vector
  const dx=Or.x-Po.x, dy=Or.y-Po.y, len=Math.sqrt(dx**2+dy**2);
  const ux=dx/len, uy=dy/len;
  // vector from Po to pt
  const vx=pt.x-Po.x, vy=pt.y-Po.y;
  // along FH (positive = anterior)
  const along=vx*ux+vy*uy;
  // perpendicular to FH (positive = superior in y-down = negative y component)
  const perp=-(vx*(-uy)+vy*ux); // negate so superior = positive
  return {along, perp};
}

// Distance from pt to the N-perpendicular (vertical through N, perpendicular to FH).
// Positive = point is ANTERIOR to N-perp (ahead of nasion).
// N-perp is the line through N perpendicular to FH.
// We project pt onto FH direction and compare with N's projection.
function distToNPerp(pt, N, Po, Or){
  const dx=Or.x-Po.x, dy=Or.y-Po.y, len=Math.sqrt(dx**2+dy**2);
  const ux=dx/len, uy=dy/len;
  const ptAlong =(pt.x-Po.x)*ux+(pt.y-Po.y)*uy;
  const nAlong  =(N.x -Po.x)*ux+(N.y -Po.y)*uy;
  return ptAlong - nAlong; // positive = ahead of N = anterior
}

// Effective maxillary length: Co to Point A (McNamara)
// Norm: adult female ~91mm, male ~95mm; use 91 ±3
function maxEffLen(p){ return dst(p.Co, p.A); }

// Effective mandibular length: Co to Gnathion
// Norm: adult female ~120mm, male ~128mm; use 120 ±6
function mandEffLen(p){ return dst(p.Co, p.Gn); }

// Maxillomandibular differential: mandEffLen - maxEffLen
// Norm: ~29mm adults; use 29 ±3
function mmDiff(p){ return mandEffLen(p) - maxEffLen(p); }

// Mandibular plane angle (McNamara): FH to mandibular plane (Go-Me)
function mpAngMcN(p){ return lineAng([p.Po,p.Or],[p.Go,p.Me]); }

// Overjet: horizontal distance from U1tip to L1tip,
// measured parallel to the functional occlusal plane.
// Positive = upper incisor anterior to lower (normal).
function overjet(p){
  const op = occPlaneDir();
  if(!op) return null;
  const {ux, uy} = op;
  const projU1 = p.U1tip.x * ux + p.U1tip.y * uy;
  const projL1 = p.L1tip.x * ux + p.L1tip.y * uy;
  return projU1 - projL1;
}

// Upper incisor to Point A vertical (McNamara):
// Horizontal distance from U1tip to vertical line through A, perpendicular to FH
// Positive = U1tip is anterior to A-vertical
function u1ToAVert(p){
  return distToNPerp(p.U1tip, p.A, p.Po, p.Or);
}

// L1 to A-Pog (same as Eastman but reported in McNamara norms)
// Norm: 1 ±2 mm
function l1APogMcN(p){ return p2line(p.L1tip, p.A, p.Pog); }

// Lower anterior facial height (ANS to Me), same geometry, McNamara norms
// Norm: adult ~65 ±4
function laFHMcN(p){ return dst(p.ANS, p.Me); }

const MEAS_MCNAMARA = [
  {s:'Skeletal',  n:'A to N-Perp (FH)',           d:'Horizontal distance of Point A to N-perpendicular; +ve = anterior',
   norm:[0,2],    u:'mm', c:p=> distToNPerp(p.A, p.N, p.Po, p.Or)},

  {s:'Skeletal',  n:'SNA (McNamara)',              d:'Maxillary position to cranial base (angle at N)',
   norm:[81,3],   u:'°',  c:p=> ang(p.S, p.N, p.A)},

  {s:'Skeletal',  n:'Effective Maxillary Length',  d:'Co to Point A distance',
   norm:[91,3],   u:'mm', c:p=> maxEffLen(p)},

  {s:'Skeletal',  n:'Effective Mandibular Length', d:'Co to Gnathion distance',
   norm:[120,6],  u:'mm', c:p=> mandEffLen(p)},

  {s:'Skeletal',  n:'Maxillomandibular Differential', d:'Mandibular length minus maxillary length',
   norm:[29,3],   u:'mm', c:p=> mmDiff(p)},

  {s:'Skeletal',  n:'Lower Anterior Facial Height', d:'ANS to Menton distance',
   norm:[65,4],   u:'mm', c:p=> laFHMcN(p)},

  {s:'Skeletal',  n:'Mandibular Plane Angle (McNamara)', d:'Frankfort horizontal to mandibular plane (Go-Me)',
   norm:[22,4],   u:'°',  c:p=> mpAngMcN(p)},

  {s:'Skeletal',  n:'Pog to N-Perp (FH)',          d:'Horizontal distance of Pogonion to N-perpendicular; +ve = anterior',
   norm:[0,4],    u:'mm', c:p=> distToNPerp(p.Pog, p.N, p.Po, p.Or)},

  {s:'Dental',    n:'Upper Incisor to A-Vertical', d:'Horizontal distance of U1 tip to vertical through Point A; +ve = anterior',
   norm:[4,2],    u:'mm', c:p=> u1ToAVert(p)},

  {s:'Dental',    n:'L1 to A-Pog (McNamara)',      d:'Perpendicular distance from lower incisor tip to A-Pog line',
   norm:[1,2],    u:'mm', c:p=> l1APogMcN(p)},
];

// ── DOWNS ANALYSIS — geometry helpers + norms ──
// use Frankfort Horizontal (Po→Or) as base plane.

// Facial angle: angle between FH and the facial plane N-Pog,
// measured at their intersection inferiorly (inside the face).
// Norm: 87.8° ±3.6
function facialAngleDowns(p){
  // FH direction vector
  const fhDx = p.Or.x - p.Po.x, fhDy = p.Or.y - p.Po.y;
  // Facial plane N→Pog direction
  const fpDx = p.Pog.x - p.N.x,  fpDy = p.Pog.y - p.N.y;
  const cos = Math.abs((fhDx*fpDx + fhDy*fpDy) /
    (Math.sqrt(fhDx**2+fhDy**2) * Math.sqrt(fpDx**2+fpDy**2)));
  return Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI;
}

// Angle of convexity: angle at Point A between N-A and A-Pog vectors.
// Positive = convex (Class II), negative = concave (Class III).
// Norm: 0° ±5
function angleOfConvexity(p){
  // Vector A→N and A→Pog
  const v1={x:p.N.x-p.A.x,   y:p.N.y-p.A.y};
  const v2={x:p.Pog.x-p.A.x, y:p.Pog.y-p.A.y};
  // Cross product sign determines convexity direction
  const cross = v1.x*v2.y - v1.y*v2.x;
  const dot   = v1.x*v2.x + v1.y*v2.y;
  const len1  = Math.sqrt(v1.x**2+v1.y**2);
  const len2  = Math.sqrt(v2.x**2+v2.y**2);
  const angle = Math.acos(Math.max(-1,Math.min(1,dot/(len1*len2))))*180/Math.PI;
  // In image coords (y down): positive cross = A is anterior to N-Pog line = convex
  return cross > 0 ? angle : -angle;
}

// Y-axis (growth axis): angle between FH and S-Gn line.
// Norm: 59.4° ±3.8
function yAxis(p){
  return lineAng([p.Po,p.Or],[p.S,p.Gn]);
}

// Cant of occlusal plane: angle between FH and the draggable occlusal plane.
// Norm: 9.3° ±3.8
function cantOccPlane(p){
  const op = occPlaneDir();
  if(!op) return null;
  const fhDx = p.Or.x - p.Po.x, fhDy = p.Or.y - p.Po.y;
  const cos = Math.abs((fhDx*op.ux + fhDy*op.uy) /
    Math.sqrt(fhDx**2+fhDy**2));
  return Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI;
}

// Incisor-occlusal plane angle: angle between U1 long axis (apex→tip) and occlusal plane.
// Norm: 14.5° ±3.5
function incisorOccPlane(p){
  const op = occPlaneDir();
  if(!op) return null;
  const ax={x:p.U1tip.x-p.U1ap.x, y:p.U1tip.y-p.U1ap.y};
  const lenAx=Math.sqrt(ax.x**2+ax.y**2);
  const cosA=Math.abs((ax.x*op.ux + ax.y*op.uy)/lenAx);
  return Math.acos(Math.max(-1,Math.min(1,cosA)))*180/Math.PI;
}

// IMPA (Incisor-mandibular plane angle): L1 long axis to mandibular plane Go-Me.
// Norm: 91.4° ±3.8
function impa(p){
  return inclin(p.L1ap, p.L1tip, p.Go, p.Me);
}

// U1 to A-Pog line: perpendicular distance from U1tip to A-Pog line (mm).
// Positive = U1tip anterior to line. Norm: 2.7mm ±1.8
function u1ToAPog(p){
  return p2line(p.U1tip, p.A, p.Pog);
}

const MEAS_DOWNS = [
  // ── Skeletal ─────────────────────────────────
  {s:'Skeletal', n:'Facial Angle',
   d:'Angle between Frankfort horizontal and the facial plane (N-Pog)',
   norm:[87.8,3.6], u:'°', c:p=> facialAngleDowns(p)},

  {s:'Skeletal', n:'Angle of Convexity',
   d:'Angle at Point A between N-A and A-Pog; +ve = convex profile',
   norm:[0,5], u:'°', c:p=> angleOfConvexity(p)},

  {s:'Skeletal', n:'Mandibular Plane Angle',
   d:'Angle between Frankfort horizontal and mandibular plane (Go-Me)',
   norm:[21.9,3.2], u:'°', c:p=> lineAng([p.Po,p.Or],[p.Go,p.Me])},

  {s:'Skeletal', n:'Y-Axis',
   d:'Angle between Frankfort horizontal and the growth axis (S-Gn)',
   norm:[59.4,3.8], u:'°', c:p=> yAxis(p)},

  {s:'Skeletal', n:'Cant of Occlusal Plane',
   d:'Angle between Frankfort horizontal and functional occlusal plane',
   norm:[9.3,3.8], u:'°', c:p=> cantOccPlane(p)},

  // ── Dental ───────────────────────────────────
  {s:'Dental', n:'Interincisal Angle',
   d:'Angle between upper and lower incisor long axes',
   norm:[135.4,5.8], u:'°', c:p=> interinc(p)},

  {s:'Dental', n:'Incisor–Occlusal Plane Angle',
   d:'Angle between U1 long axis and functional occlusal plane',
   norm:[14.5,3.5], u:'°', c:p=> incisorOccPlane(p)},

  {s:'Dental', n:'Incisor–Mandibular Plane Angle',
   d:'Angle between L1 long axis and mandibular plane (Go-Me)',
   norm:[91.4,3.8], u:'°', c:p=> impa(p)},

  {s:'Dental', n:'Upper Incisor to A-Pog',
   d:'Perpendicular distance from U1 tip to A-Pog line; +ve = anterior',
   norm:[2.7,1.8], u:'mm', c:p=> u1ToAPog(p)},
];

// ── STEINER ANALYSIS — geometry helpers + norms ──

// Occlusal plane to SN: angle between draggable occ plane and S-N line.
// Norm: 14° ±3
function occToSN(p){
  const op = occPlaneDir();
  if(!op) return null;
  const snDx = p.N.x - p.S.x, snDy = p.N.y - p.S.y;
  const snLen = Math.sqrt(snDx**2 + snDy**2);
  const cos = Math.abs((snDx*op.ux + snDy*op.uy) / snLen);
  return Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI;
}

// Mandibular plane angle Go-Gn to SN.
// Go-Gn is the mandibular plane from Gonion to Gnathion.
// Norm: 32° ±5
function goGnToSN(p){
  return lineAng([p.S,p.N],[p.Go,p.Gn]);
}

// U1 to NA (mm): perpendicular distance from U1 tip to the N-A line.
// Positive = U1 tip anterior to N-A. Norm: 4mm ±2
function u1ToNA_mm(p){
  return p2line(p.U1tip, p.N, p.A);
}

// U1 to NA (deg): angle between U1 long axis (apex→tip) and N-A line.
// Norm: 22° ±4
function u1ToNA_deg(p){
  const ax = {x: p.U1tip.x - p.U1ap.x, y: p.U1tip.y - p.U1ap.y};
  const na = {x: p.A.x - p.N.x,        y: p.A.y - p.N.y};
  const lenAx = Math.sqrt(ax.x**2 + ax.y**2);
  const lenNA = Math.sqrt(na.x**2 + na.y**2);
  const cos = Math.abs((ax.x*na.x + ax.y*na.y) / (lenAx * lenNA));
  return Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI;
}

// L1 to NB (mm): perpendicular distance from L1 tip to the N-B line.
// Positive = L1 tip anterior to N-B. Norm: 4mm ±2
function l1ToNB_mm(p){
  return p2line(p.L1tip, p.N, p.B);
}

// L1 to NB (deg): angle between L1 long axis (apex→tip) and N-B line.
// Norm: 25° ±5
function l1ToNB_deg(p){
  const ax = {x: p.L1tip.x - p.L1ap.x, y: p.L1tip.y - p.L1ap.y};
  const nb = {x: p.B.x - p.N.x,        y: p.B.y - p.N.y};
  const lenAx = Math.sqrt(ax.x**2 + ax.y**2);
  const lenNB = Math.sqrt(nb.x**2 + nb.y**2);
  const cos = Math.abs((ax.x*nb.x + ax.y*nb.y) / (lenAx * lenNB));
  return Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI;
}

const MEAS_STEINER = [
  // ── Skeletal ─────────────────────────────────
  {s:'Skeletal', n:'SNA',
   d:'Maxillary position relative to cranial base',
   norm:[82,2], u:'°', c:p=> ang(p.S, p.N, p.A)},

  {s:'Skeletal', n:'SNB',
   d:'Mandibular position relative to cranial base',
   norm:[80,2], u:'°', c:p=> ang(p.S, p.N, p.B)},

  {s:'Skeletal', n:'ANB',
   d:'Sagittal jaw relationship (SNA − SNB)',
   norm:[2,2], u:'°', c:p=> ang(p.S,p.N,p.A) - ang(p.S,p.N,p.B)},

  {s:'Skeletal', n:'Occlusal Plane to SN',
   d:'Angle between functional occlusal plane and S-N line',
   norm:[14,3], u:'°', c:p=> occToSN(p)},

  {s:'Skeletal', n:'Mandibular Plane to SN (Go-Gn)',
   d:'Angle between mandibular plane Go-Gn and S-N line',
   norm:[32,5], u:'°', c:p=> goGnToSN(p)},

  // ── Dental ───────────────────────────────────
  {s:'Dental', n:'U1 to NA (mm)',
   d:'Perpendicular distance from U1 tip to N-A line; +ve = anterior',
   norm:[4,2], u:'mm', c:p=> u1ToNA_mm(p)},

  {s:'Dental', n:'U1 to NA (°)',
   d:'Angle between U1 long axis and N-A line',
   norm:[22,4], u:'°', c:p=> u1ToNA_deg(p)},

  {s:'Dental', n:'L1 to NB (mm)',
   d:'Perpendicular distance from L1 tip to N-B line; +ve = anterior',
   norm:[4,2], u:'mm', c:p=> l1ToNB_mm(p)},

  {s:'Dental', n:'L1 to NB (°)',
   d:'Angle between L1 long axis and N-B line',
   norm:[25,5], u:'°', c:p=> l1ToNB_deg(p)},

  {s:'Dental', n:'Interincisal Angle',
   d:'Angle between upper and lower incisor long axes',
   norm:[130,6], u:'°', c:p=> interinc(p)},
];

// ── STATE ──
const MAG_ICON = '<svg class="tb-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>';
let pts={},activeLm=null,dragging=null;
// Occlusal plane: straight line with 2 normalised-coord handles
let occPlane = null;   // {p1:{x,y}, p2:{x,y}}
let draggingOcc = null; // 'p1'|'p2' when dragging an occ handle

// ── Undo history ──────────────────────────────
const MAX_UNDO = 50;
let undoStack = []; // each entry: {pts, occPlane}

function snapState(){
  // Deep-clone current pts and occPlane onto the undo stack
  undoStack.push({
    pts: JSON.parse(JSON.stringify(pts)),
    occ: occPlane ? JSON.parse(JSON.stringify(occPlane)) : null
  });
  if(undoStack.length > MAX_UNDO) undoStack.shift();
}

function undo(){
  if(undoStack.length === 0) return;
  const prev = undoStack.pop();
  // Find which landmark was just placed/moved by comparing pts
  const prevKeys = Object.keys(prev.pts);
  const currKeys = Object.keys(pts);
  // The landmark that was added or moved
  let restoredLm = null;
  // Check for a newly placed point (exists in current but not in prev)
  const added = currKeys.find(k => !prev.pts[k]);
  if(added) restoredLm = added;
  else {
    // Check for a moved point (exists in both but different position)
    restoredLm = currKeys.find(k => prev.pts[k] &&
      (prev.pts[k].x !== pts[k].x || prev.pts[k].y !== pts[k].y));
  }

  pts = prev.pts;
  occPlane = prev.occ;

  // Refresh placed markers in sidebar
  document.querySelectorAll('.lm-item').forEach(el => el.classList.remove('placed'));
  Object.keys(pts).forEach(id => markPlaced(id));
  updateProg(); updateHdrHint();

  // Return focus to the landmark that was undone
  if(restoredLm) setActive(restoredLm);

  drawImg(); renderOvl();
}

document.addEventListener('keydown', e => {
  if((e.ctrlKey || e.metaKey) && e.key === 'z'){
    e.preventDefault();
    undo();
  }
});
let imgEl=null;
let scale=1,panX=0,panY=0,isPanning=false,panStart={x:0,y:0},panOrigin={x:0,y:0};
let _panMoved=false;
let showLines=true,showMag=true,showGrid=false;
let cW=0,cH=0,iW=0,iH=0,iX=0,iY=0;
let mouseCanvasX=0,mouseCanvasY=0;


// ── BUILD LIST ──
function buildList(){
  const list=document.getElementById('lm-list');
  list.innerHTML=''; // clear on reload
  let cur='';
  LM.forEach(lm=>{
    if(lm.group!==cur){cur=lm.group;const s=document.createElement('div');s.className='lm-sep';s.textContent=cur;list.appendChild(s);}
    const item=document.createElement('div');item.className='lm-item';item.id='lmi-'+lm.id;
    item.innerHTML=`<div class="lm-dot"></div><div class="lm-text"><span class="lm-abbr">${lm.abbr}</span><span class="lm-name">${lm.name}</span></div>`;
    item.addEventListener('click',()=>setActive(lm.id));
    list.appendChild(item);
  });
  // Set dynamic total
  const tot=document.getElementById('prog-total');
  if(tot) tot.textContent=LM.length;
}

function setActive(id){
  activeLm=id;
  document.querySelectorAll('.lm-item').forEach(e=>e.classList.remove('active'));
  const el=document.getElementById('lmi-'+id);
  if(el){el.classList.add('active');el.scrollIntoView({block:'nearest'});}
  // show hint
  const lm=LM.find(l=>l.id===id);
  if(lm){
    document.getElementById('hint-title').textContent=lm.abbr+' — '+lm.name;
    document.getElementById('hint-text').textContent=lm.hint;
    document.getElementById('hint-box').classList.add('visible');
  }
  updateHdrHint();
}

function updateHdrHint(){
  const n=Object.keys(pts).length;
  const rem=24-n;
  // hdr-hint is reserved for occlusal plane tip — do not overwrite
}

function markPlaced(id){
  document.getElementById('lmi-'+id)?.classList.add('placed');
  updateProg();updateHdrHint();
  // Auto-fit occlusal plane when occlusal landmarks change
  if(['U6','L6','U4','L4','L1tip'].includes(id)) fitOccPlane();
}

// Fit occPlane through occlusal landmarks.
// Posterior point = average of molar tips (U6, L6)
// Anterior point  = L1tip (lower incisor tip), fallback to premolar average
// Only fires when at least one posterior point is placed.
// Skips if the user has manually dragged the plane (occPlaneManual flag).
let occPlaneManual = false;

function fitOccPlane(){
  if(occPlaneManual) return;
  const p = pts;

  // Posterior: average available molar tips
  const postPts = [p.U6, p.L6].filter(Boolean);
  if(postPts.length === 0) return;

  const post = {
    x: postPts.reduce((s,pt)=>s+pt.x,0)/postPts.length,
    y: postPts.reduce((s,pt)=>s+pt.y,0)/postPts.length
  };

  // Anterior: prefer L1tip, fallback to premolar average
  let ant = null;
  if(p.L1tip){
    ant = {x: p.L1tip.x, y: p.L1tip.y};
  } else {
    const antPts = [p.U4, p.L4].filter(Boolean);
    if(antPts.length === 0) return;
    ant = {
      x: antPts.reduce((s,pt)=>s+pt.x,0)/antPts.length,
      y: antPts.reduce((s,pt)=>s+pt.y,0)/antPts.length
    };
  }

  occPlane = {p1: post, p2: ant};
  drawImg(); renderOvl();
}

function updateProg(){
  const n=Object.keys(pts).length;
  const total=LM.length;
  document.getElementById('prog-count').textContent=n;
  document.getElementById('prog-fill').style.width=(n/total*100)+'%';
  document.getElementById('analyse-btn').disabled=!imgEl;
}


// ── UPLOAD ──
const dropZ=document.getElementById('drop-zone'),upIn=document.getElementById('upload-input');
dropZ.addEventListener('click',()=>upIn.click());
upIn.addEventListener('change',e=>{
  if(e.target.files[0]){
    pts={}; activeLm=null; occPlane=null; occPlaneManual=false;
    snapHistory=[]; snapIdx=-1;
    buildList(); updateProg(); renderOvl();
    loadImg(e.target.files[0]);
  }
});
dropZ.addEventListener('dragover',e=>{e.preventDefault();dropZ.classList.add('over');});
dropZ.addEventListener('dragleave',()=>dropZ.classList.remove('over'));
dropZ.addEventListener('drop',e=>{
  e.preventDefault(); dropZ.classList.remove('over');
  if(e.dataTransfer.files[0]){
    pts={}; activeLm=null; occPlane=null; occPlaneManual=false;
    snapHistory=[]; snapIdx=-1;
    buildList(); updateProg(); renderOvl();
    loadImg(e.dataTransfer.files[0]);
  }
});

const API_URL = 'https://mujtaba1212-landmark.hf.space/detect';

let imgBase64 = null;

function loadImg(file){
  if(!file||!file.type.startsWith('image/'))return;
  const reader = new FileReader();
  reader.onload = ev => {
    imgEl = new Image();
    imgEl.onload = () => {
      dropZ.style.display='none';
      document.getElementById('canvas-container').style.display='block';
      document.getElementById('toolbar').style.display='flex';
      document.getElementById('magnifier').style.display='block';
      // On tablet, auto-enable magnifier for precise stylus placement
      if(window.innerWidth <= 1194 && window.matchMedia('(pointer:coarse)').matches){
        showMag=true;
        document.getElementById('mag-btn').innerHTML = MAG_ICON + 'Magnifier ON';
      }
      // Auto-enable grid on image load
      showGrid=true;
      gridCanvas.style.display='block';
      document.getElementById('grid-btn').textContent='⊞ Grid ON';
      initCanvas();
      // Initialise occlusal plane to sensible default (middle of image, slight curve)
      undoStack = [];
      occPlane = {
        p1:   { x: 0.25, y: 0.62 },
        p2:   { x: 0.75, y: 0.62 },
      };
      document.getElementById('analyse-btn').disabled = false;
      setActive(LM[0].id);
    };
    imgEl.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}


// ── CANVAS ──
const ic=document.getElementById('img-canvas'),ctx=ic.getContext('2d');
const svg=document.getElementById('overlay-svg');
const wrap=document.getElementById('panel-img');
const mag=document.getElementById('magnifier');
const magCtx=document.getElementById('mag-canvas').getContext('2d');

let _canvasInited = false;
function initCanvas(){
  resize();drawImg();renderOvl();
  if(!_canvasInited){
    window.addEventListener('resize',()=>{resize();drawImg();renderOvl();});
    _canvasInited = true;
  }
}
function resize(){
  cW=wrap.clientWidth;cH=wrap.clientHeight;
  ic.width=cW;ic.height=cH;
  gridCanvas.width=cW;gridCanvas.height=cH;
  svg.setAttribute('width',cW);svg.setAttribute('height',cH);
  svg.setAttribute('viewBox',`0 0 ${cW} ${cH}`);
  fitImg();
}
function fitImg(){
  scale=Math.min(cW/imgEl.naturalWidth,cH/imgEl.naturalHeight)*0.95;
  iW=imgEl.naturalWidth*scale;iH=imgEl.naturalHeight*scale;
  iX=(cW-iW)/2;iY=(cH-iH)/2;panX=0;panY=0;updZoom();
}
let imgBrightness=0, imgContrast=0, imgInvert=false;

function drawImg(){
  ctx.clearRect(0,0,cW,cH);
  ctx.save();ctx.translate(panX,panY);
  // Build CSS filter string for brightness/contrast
  const bPct = 100 + imgBrightness; // 0-200%, 100 = normal
  const cPct = 100 + imgContrast;
  let filterStr = `brightness(${bPct}%) contrast(${cPct}%)`;
  if(imgInvert) filterStr += ' invert(1) grayscale(1)';
  ctx.filter = filterStr;
  ctx.drawImage(imgEl,iX,iY,iW,iH);
  ctx.filter = 'none';
  ctx.restore();
  if(showGrid) drawGrid();
}

// ── Grid overlay ────────────────────────────────
const gridCanvas = document.getElementById('grid-canvas');
const gridCtx = gridCanvas.getContext('2d');

function drawGrid(){
  gridCanvas.width = cW;
  gridCanvas.height = cH;
  gridCtx.clearRect(0,0,cW,cH);

  // Grid spans the image area — strictly square cells
  // Use the same pixel step for both axes (based on the shorter dimension)
  const DIVISIONS = 20;
  const stepBase = Math.min(iW, iH) / DIVISIONS;
  const stepX = stepBase;
  const stepY = stepBase;

  // Image bounds on canvas (with pan)
  const x0 = iX + panX, y0 = iY + panY;
  const x1 = x0 + iW,   y1 = y0 + iH;

  gridCtx.save();
  gridCtx.globalAlpha = 0.5;

  // Thin grid lines
  gridCtx.strokeStyle = 'rgba(59,184,240,0.35)';
  gridCtx.lineWidth = 0.5;
  gridCtx.setLineDash([]);

  // Draw vertical lines across full image width
  const colCount = Math.ceil(iW / stepX);
  for(let i = 0; i <= colCount; i++){
    const x = x0 + i * stepX;
    if(x > x1 + 1) break;
    gridCtx.beginPath(); gridCtx.moveTo(Math.min(x,x1), y0); gridCtx.lineTo(Math.min(x,x1), y1); gridCtx.stroke();
  }
  // Draw horizontal lines across full image height
  const rowCount = Math.ceil(iH / stepY);
  for(let i = 0; i <= rowCount; i++){
    const y = y0 + i * stepY;
    if(y > y1 + 1) break;
    gridCtx.beginPath(); gridCtx.moveTo(x0, Math.min(y,y1)); gridCtx.lineTo(x1, Math.min(y,y1)); gridCtx.stroke();
  }

  // Thicker midlines (centre cross)
  gridCtx.strokeStyle = 'rgba(59,184,240,0.6)';
  gridCtx.lineWidth = 1;
  const mx = x0 + iW / 2, my = y0 + iH / 2;
  gridCtx.beginPath(); gridCtx.moveTo(mx, y0); gridCtx.lineTo(mx, y1); gridCtx.stroke();
  gridCtx.beginPath(); gridCtx.moveTo(x0, my); gridCtx.lineTo(x1, my); gridCtx.stroke();

  // Rule-of-thirds lines (subtle dashes)
  gridCtx.strokeStyle = 'rgba(240,183,59,0.3)';
  gridCtx.lineWidth = 0.7;
  gridCtx.setLineDash([4,4]);
  [1/3, 2/3].forEach(f => {
    const rx = x0 + iW * f, ry = y0 + iH * f;
    gridCtx.beginPath(); gridCtx.moveTo(rx, y0); gridCtx.lineTo(rx, y1); gridCtx.stroke();
    gridCtx.beginPath(); gridCtx.moveTo(x0, ry); gridCtx.lineTo(x1, ry); gridCtx.stroke();
  });

  gridCtx.restore();
}
const toC=(nx,ny)=>({x:nx*iW+iX+panX,y:ny*iH+iY+panY});
const toN=(cx,cy)=>({x:(cx-panX-iX)/iW,y:(cy-panY-iY)/iH});


// ── MAGNIFIER ──
const MAG_ZOOM_DESKTOP=4, MAG_ZOOM_TOUCH=6;
function drawMag(cx,cy){
  var MAG_ZOOM = (_lastPointerType==='mouse') ? MAG_ZOOM_DESKTOP : MAG_ZOOM_TOUCH;
  var MAG_R = window._magR || 80;
  var MAG_D = MAG_R * 2;
  const srcX=(cx-panX-iX)/scale - MAG_R/MAG_ZOOM;
  const srcY=(cy-panY-iY)/scale - MAG_R/MAG_ZOOM;
  const srcW=MAG_R*2/MAG_ZOOM,srcH=MAG_R*2/MAG_ZOOM;
  magCtx.clearRect(0,0,MAG_D,MAG_D);
  magCtx.save();
  magCtx.beginPath();magCtx.arc(MAG_R,MAG_R,MAG_R,0,Math.PI*2);magCtx.clip();
  magCtx.drawImage(imgEl,srcX,srcY,srcW,srcH,0,0,MAG_D,MAG_D);
  // draw existing points on mag
  LM.forEach(lm=>{
    if(!pts[lm.id])return;
    const imgPx=pts[lm.id].x*imgEl.naturalWidth;
    const imgPy=pts[lm.id].y*imgEl.naturalHeight;
    const relX=(imgPx-srcX)/srcW*MAG_D;
    const relY=(imgPy-srcY)/srcH*MAG_D;
    if(relX>0&&relX<MAG_D&&relY>0&&relY<MAG_D){
      const col=getCol(lm.id);
      magCtx.beginPath();magCtx.arc(relX,relY,3,0,Math.PI*2);
      magCtx.fillStyle=col;magCtx.fill();
      magCtx.strokeStyle='#000';magCtx.lineWidth=0.8;magCtx.stroke();
    }
  });
  magCtx.restore();
  // border color = active lm color
  if(activeLm) mag.style.borderColor=getCol(activeLm);
}


// ── SVG OVERLAY ──
function mkEl(tag,attr){
  const el=document.createElementNS('http://www.w3.org/2000/svg',tag);
  Object.entries(attr).forEach(([k,v])=>el.setAttribute(k,v));return el;
}
function renderOvl(){
  while(svg.firstChild)svg.removeChild(svg.firstChild);
  if(!imgEl)return;
  if(showLines)drawLines();

  // ── Occlusal plane straight line ─────────────
  if(occPlane){
    const c1 = toC(occPlane.p1.x, occPlane.p1.y);
    const c2 = toC(occPlane.p2.x, occPlane.p2.y);

    // Extend line beyond both handles by 60px
    const dx = c2.x - c1.x, dy = c2.y - c1.y;
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    const ux = dx/len, uy = dy/len;
    const ext = 60;
    const e1 = {x: c1.x - ux*ext, y: c1.y - uy*ext}; // extend past molar side
    const e2 = {x: c2.x + ux*ext, y: c2.y + uy*ext}; // extend past incisor side

    // The extended line
    svg.appendChild(mkEl('line',{
      x1:e1.x,y1:e1.y,x2:e2.x,y2:e2.y,
      stroke:'#e8c06c','stroke-width':1.8,
      opacity:0.75,'stroke-dasharray':'6,3','pointer-events':'none'
    }));

    // Endpoint handle p1 (at extended end — molar side)
    const h1=mkEl('circle',{cx:e1.x,cy:e1.y,r:6,
      fill:'rgba(232,192,108,.25)',stroke:'#e8c06c','stroke-width':1.5,cursor:'grab',opacity:.9});
    h1.addEventListener('mousedown',e=>{e.stopPropagation();draggingOcc='p1';svg.style.cursor='grabbing';});
    svg.appendChild(h1);

    // Endpoint handle p2 (at extended end — incisor side)
    const h2=mkEl('circle',{cx:e2.x,cy:e2.y,r:6,
      fill:'rgba(232,192,108,.25)',stroke:'#e8c06c','stroke-width':1.5,cursor:'grab',opacity:.9});
    h2.addEventListener('mousedown',e=>{e.stopPropagation();draggingOcc='p2';svg.style.cursor='grabbing';});
    svg.appendChild(h2);

    // Label at midpoint
    const mx=(c1.x+c2.x)/2, my=(c1.y+c2.y)/2;
    const lbl=mkEl('text',{x:mx,y:my-9,fill:'#e8c06c','font-size':8,
      'font-family':'DM Mono,monospace','pointer-events':'none','paint-order':'stroke',
      stroke:'#000','stroke-width':2,opacity:.8,'text-anchor':'middle'});
    lbl.textContent='Occ. Plane'; svg.appendChild(lbl);
  }

  // ── Landmarks ─────────────────────────────────
  LM.forEach(lm=>{
    if(!pts[lm.id])return;
    const c=toC(pts[lm.id].x,pts[lm.id].y),col=getCol(lm.id);
    const isActive=(lm.id===activeLm);
    svg.appendChild(mkEl('circle',{cx:c.x,cy:c.y,r:isActive?8:6,fill:'none',stroke:col,'stroke-width':isActive?2:1.2,opacity:isActive?0.9:0.55}));
    const dot=mkEl('circle',{cx:c.x,cy:c.y,r:isActive?4:3.5,fill:col,stroke:'#000','stroke-width':1,cursor:'grab'});
    dot.dataset.id=lm.id;
    dot.addEventListener('mousedown',e=>{e.stopPropagation();dragging=lm.id;setActive(lm.id);svg.style.cursor='grabbing';});
    svg.appendChild(dot);
    const lbl=mkEl('text',{x:c.x+8,y:c.y-5,fill:col,'font-size':isActive?10:8.5,'font-family':'DM Mono,monospace',
      'pointer-events':'none','paint-order':'stroke',stroke:'#000','stroke-width':2.5});
    lbl.textContent=lm.abbr;svg.appendChild(lbl);
  });
}
function drawLines(){
  const p={};LM.forEach(l=>{if(pts[l.id])p[l.id]=pts[l.id];});

  // Helper: draw a line between two landmark ids
  function ln(a,b,col,w,dash){
    if(!p[a]||!p[b])return;
    const ca=toC(p[a].x,p[a].y),cb=toC(p[b].x,p[b].y);
    svg.appendChild(mkEl('line',{x1:ca.x,y1:ca.y,x2:cb.x,y2:cb.y,
      stroke:col,'stroke-width':w,opacity:.55,
      'stroke-dasharray':dash?dash.join(' '):'','pointer-events':'none'}));
  }

  // ── Cranial base & reference planes ──────────
  ln('S','N',  '#58a6ff',1.5,[]);        // SN line
  ln('Po','Or','#8fafc8',1,[4,3]);       // Frankfort horizontal

  // ── Maxillary structures ──────────────────────
  ln('ANS','PNS','#3fb950',1.2,[]);      // palatal plane
  ln('N','A',    '#3fb950',1,[5,3]);     // N-A line
  ln('A','Pog',  '#e8c06c',1,[5,3]);     // A-Pog line

  // ── Mandibular structures ─────────────────────
  ln('Go','Me',  '#f0883e',1.2,[]);      // mandibular plane
  ln('Go','Gn',  '#f0883e',1,[4,3]);     // Go-Gn (Steiner mandibular plane)
  ln('N','B',    '#f0883e',1,[5,3]);     // N-B line
  ln('N','Pog',  '#e8a0ff',1,[4,3]);     // facial plane N-Pog
  ln('S','Gn',   '#d0a0ff',1,[3,4]);     // Y-axis (growth axis)

  // ── Incisor long axes ─────────────────────────
  ln('U1tip','U1ap','#3fb950',1.5,[]);   // upper incisor axis
  ln('L1tip','L1ap','#f0883e',1.5,[]);   // lower incisor axis

  // ── Soft tissue ───────────────────────────────
  ln('Prn','Pogp','#bc8cff',1,[4,3]);    // E-line (esthetic line)

  // ── McNamara specific ─────────────────────────
  ln('Co','A',  '#a0d0ff',1,[3,4]);      // effective maxillary length
  ln('Co','Gn', '#ffd0a0',1,[3,4]);      // effective mandibular length
  ln('PNS','Gn','#d0ffd0',1,[3,4]);      // facial axis (PNS-Gn)

  // ── Occlusal contacts (dotted, gold) ──────────
  ln('U6','L6', '#e8c06c',1,[3,3]);      // molar contact
  ln('U4','L4', '#e8c06c',1,[3,3]);      // premolar contact
}


// ── EVENTS ──

// Cursor smoothing — exponential moving average damps tremor.
// SMOOTH = 0 → instant (no smoothing), 1 → never moves.
// 0.40 keeps the cursor responsive but steady.
const CURSOR_SMOOTH = 0.40;
let smoothX = 0, smoothY = 0, smoothInit = false;

// Custom cursor
const cursorSvg=document.getElementById('cursor-svg');
svg.addEventListener('mousemove',e=>{
  if(_lastPointerType !== 'mouse') return;
  const r=svg.getBoundingClientRect();
  const rawX = e.clientX-r.left;
  const rawY = e.clientY-r.top;

  // Exponential smoothing — blend toward raw position each frame
  if(!smoothInit){ smoothX=rawX; smoothY=rawY; smoothInit=true; }
  smoothX = smoothX * CURSOR_SMOOTH + rawX * (1-CURSOR_SMOOTH);
  smoothY = smoothY * CURSOR_SMOOTH + rawY * (1-CURSOR_SMOOTH);

  // Use smoothed coords for everything visual
  mouseCanvasX = smoothX;
  mouseCanvasY = smoothY;

  // custom cursor follows smoothed position
  if(activeLm&&!dragging){
    cursorSvg.style.display='block';
    cursorSvg.style.left=(smoothX-12)+'px';
    cursorSvg.style.top=(smoothY-12)+'px';
    const col=getCol(activeLm);
    cursorSvg.querySelectorAll('line,circle').forEach(el=>{el.setAttribute('stroke',col);});
  } else {
    cursorSvg.style.display='none';
  }
  // magnifier follows smoothed position
  if(showMag)drawMag(smoothX,smoothY);
  // tooltip
  const tip=document.getElementById('pt-tip');
  const hit=LM.find(lm=>{
    if(!pts[lm.id])return false;
    const c=toC(pts[lm.id].x,pts[lm.id].y);
    return Math.sqrt((c.x-smoothX)**2+(c.y-smoothY)**2)<10;
  });
  if(hit){tip.style.display='block';tip.style.left=(smoothX+14)+'px';tip.style.top=(smoothY-10)+'px';tip.textContent=hit.abbr+' – '+hit.name;}
  else tip.style.display='none';
});
svg.addEventListener('mouseleave',()=>{cursorSvg.style.display='none'; smoothInit=false;});

svg.addEventListener('mousedown',e=>{
  if(_lastPointerType !== 'mouse') return; // ignore if last interaction was touch/pen
  if(e.button===1||(e.button===0&&e.altKey)){
    // Middle click or Alt+left: pan
    isPanning=true;panStart={x:e.clientX,y:e.clientY};panOrigin={x:panX,y:panY};svg.style.cursor='grabbing';
    return;
  }
  if(e.button===0 && !e.altKey && e.target.tagName!=='circle'){
    // Left click on background: start potential pan — we'll decide on mouseup
    // whether it was a click or a drag based on movement distance
    isPanning=true;
    panStart={x:e.clientX,y:e.clientY};
    panOrigin={x:panX,y:panY};
    _panMoved=false;
  }
});
// Block synthesized mouse events that fire after touch/pen
// This prevents double-placement on tablets
var _lastPointerType = 'mouse';
svg.addEventListener('pointerdown', function(e){ _lastPointerType = e.pointerType; }, true);

window.addEventListener('mousemove',e=>{
  if(e.movementX !== 0 || e.movementY !== 0) _lastPointerType = 'mouse'; // real mouse moved
  if(_lastPointerType !== 'mouse') return; // ignore synthesized
  if(dragging){
    const r=svg.getBoundingClientRect();
    const n=toN(e.clientX-r.left,e.clientY-r.top);
    pts[dragging]={x:Math.max(0,Math.min(1,n.x)),y:Math.max(0,Math.min(1,n.y))};
    drawImg();renderOvl();
    if(showMag)drawMag(e.clientX-r.left,e.clientY-r.top);
  } else if(draggingOcc && occPlane){
    const r=svg.getBoundingClientRect();
    const n=toN(e.clientX-r.left,e.clientY-r.top);
    const nx=Math.max(0,Math.min(1,n.x)), ny=Math.max(0,Math.min(1,n.y));
    occPlane[draggingOcc]={x:nx,y:ny};
    drawImg();renderOvl();
  } else if(isPanning){
    const dx=e.clientX-panStart.x, dy=e.clientY-panStart.y;
    // Mark as a real pan once the mouse moves more than 4px
    if(Math.sqrt(dx*dx+dy*dy)>4) _panMoved=true;
    if(_panMoved){
      panX=panOrigin.x+dx; panY=panOrigin.y+dy;
      svg.style.cursor='grabbing';
      drawImg();renderOvl();
    }
  }
});
window.addEventListener('mouseup',e=>{
  if(_lastPointerType !== 'mouse') return;
  if(dragging){ snapState(); dragging=null; svg.style.cursor='crosshair'; }
  if(draggingOcc){ snapState(); draggingOcc=null; svg.style.cursor='crosshair'; occPlaneManual=true; }
  if(isPanning){
    svg.style.cursor='crosshair';
    if(!_panMoved && e.button===0 && !e.altKey){
      if(activeLm && !calibrating){
        const r=svg.getBoundingClientRect();
        if(e.target.tagName!=='circle'||!e.target.dataset.id){
          const clickX = e.clientX - r.left;
          const clickY = e.clientY - r.top;
          const n=toN(clickX, clickY);
          if(n.x>=0&&n.x<=1&&n.y>=0&&n.y<=1){
            snapState();
            pts[activeLm]={x:n.x,y:n.y};
            markPlaced(activeLm);
            const idx=LM.findIndex(l=>l.id===activeLm);
            const next=LM.slice(idx+1).find(l=>!pts[l.id]);
            if(next) setActive(next.id);
            else if(LM.every(l=>pts[l.id])){activeLm=null;document.getElementById('hint-box').classList.remove('visible');}
            drawImg();renderOvl();
          }
        }
      }
    }
    isPanning=false; _panMoved=false;
  }
});

// Smooth zoom with momentum accumulation
let _zoomTarget = 1; // target scale
let _zoomMx = 0, _zoomMy = 0; // zoom anchor
let _zoomRaf = null;

function _doZoomFrame(){
  if(!imgEl){ _zoomRaf=null; return; }
  const diff = _zoomTarget - scale;
  if(Math.abs(diff) < 0.0005){ // close enough — snap
    const f = _zoomTarget / scale;
    _applyZoom(f, _zoomMx, _zoomMy);
    _zoomRaf = null;
    return;
  }
  // Ease toward target
  const step = diff * 0.6;
  const f = (scale + step) / scale;
  _applyZoom(f, _zoomMx, _zoomMy);
  _zoomRaf = requestAnimationFrame(_doZoomFrame);
}

function _applyZoom(f, mx, my){
  // Anchor point in normalised image coords
  const rx = (mx - iX - panX) / iW;
  const ry = (my - iY - panY) / iH;
  const oldIW = iW, oldIH = iH;
  scale *= f;
  // Clamp scale
  const minS = Math.min(0.05, scale);
  scale = Math.max(minS, Math.min(scale, 50));
  iW = imgEl.naturalWidth  * scale;
  iH = imgEl.naturalHeight * scale;
  // Keep anchor stationary
  panX -= (iW - oldIW) * rx;
  panY -= (iH - oldIH) * ry;
  updZoom(); drawImg(); renderOvl();
}

svg.addEventListener('wheel', e=>{
  e.preventDefault();
  if(!imgEl) return;
  const r  = svg.getBoundingClientRect();
  _zoomMx  = e.clientX - r.left;
  _zoomMy  = e.clientY - r.top;
  // Accumulate zoom target (smaller step = finer control)
  const factor = e.deltaY < 0 ? 1.18 : 0.85;
  _zoomTarget  = scale * factor;
  // Clamp target
  const minS = Math.min(0.05, scale);
  _zoomTarget  = Math.max(minS, Math.min(_zoomTarget, 50));
  if(!_zoomRaf) _zoomRaf = requestAnimationFrame(_doZoomFrame);
},{passive:false});

document.getElementById('zoom-in').addEventListener('click',()=>{
  if(!imgEl) return;
  const r=svg.getBoundingClientRect();
  _zoomMx=r.width/2; _zoomMy=r.height/2;
  _zoomTarget=scale*1.2;
  if(!_zoomRaf) _zoomRaf=requestAnimationFrame(_doZoomFrame);
});
document.getElementById('zoom-out').addEventListener('click',()=>{
  if(!imgEl) return;
  const r=svg.getBoundingClientRect();
  _zoomMx=r.width/2; _zoomMy=r.height/2;
  _zoomTarget=scale*0.83;
  if(!_zoomRaf) _zoomRaf=requestAnimationFrame(_doZoomFrame);
});
document.getElementById('fit-btn').addEventListener('click',()=>{fitImg();drawImg();renderOvl();});
document.getElementById('lines-btn').addEventListener('click',function(){showLines=!showLines;this.textContent=showLines?'Lines ON':'Lines OFF';renderOvl();});
document.getElementById('grid-btn').addEventListener('click',function(){
  showGrid=!showGrid;
  this.textContent=showGrid?'⊞ Grid ON':'⊞ Grid OFF';
  gridCanvas.style.display=showGrid?'block':'none';
  drawImg();
});
document.getElementById('mag-btn').addEventListener('click',function(){
  showMag=!showMag;
  this.innerHTML = MAG_ICON + (showMag ? 'Magnifier ON' : 'Magnifier OFF');
  mag.style.display=showMag?'block':'none';
});

// ── Image adjustment popup ──────────────────────
(function(){
  const adjBtn = document.getElementById('adj-btn');
  const popup  = document.getElementById('img-adj-popup');
  const bSlider = document.getElementById('adj-brightness');
  const cSlider = document.getElementById('adj-contrast');
  const bVal    = document.getElementById('adj-brightness-val');
  const cVal    = document.getElementById('adj-contrast-val');
  const invChk  = document.getElementById('adj-invert');
  const resetBtn= document.getElementById('adj-reset');

  adjBtn.addEventListener('click', function(e){
    e.stopPropagation();
    popup.classList.toggle('open');
    adjBtn.classList.toggle('active', popup.classList.contains('open'));
  });
  document.addEventListener('click', function(e){
    if(!popup.contains(e.target) && e.target !== adjBtn){
      popup.classList.remove('open');
      adjBtn.classList.remove('active');
    }
  });

  function applyAdj(){
    imgBrightness = parseInt(bSlider.value);
    imgContrast   = parseInt(cSlider.value);
    imgInvert     = invChk.checked;
    bVal.textContent = (imgBrightness >= 0 ? '+' : '') + imgBrightness;
    cVal.textContent = (imgContrast  >= 0 ? '+' : '') + imgContrast;
    if(imgEl) drawImg();
  }
  bSlider.addEventListener('input', applyAdj);
  cSlider.addEventListener('input', applyAdj);
  invChk.addEventListener('change', applyAdj);

  resetBtn.addEventListener('click', function(){
    bSlider.value = 0; cSlider.value = 0; invChk.checked = false;
    bVal.textContent = '0'; cVal.textContent = '0';
    imgBrightness = 0; imgContrast = 0; imgInvert = false;
    if(imgEl) drawImg();
  });
})();
document.getElementById('clear-btn').addEventListener('click',()=>{
  if(!confirm('Clear all landmarks?'))return;
  pts={};
  occPlane=null; occPlaneManual=false;
  document.querySelectorAll('.lm-item').forEach(e=>e.classList.remove('placed'));
  updateProg();updateHdrHint();
  document.getElementById('results-body').innerHTML='<div class="res-placeholder">Place all landmarks, then click <strong>▶ Analyse</strong>.</div>';
  drawImg();renderOvl();
});

function updZoom(){
  const base=Math.min(cW/imgEl.naturalWidth,cH/imgEl.naturalHeight)*0.95;
  document.getElementById('zoom-lbl').textContent=Math.round(scale/base*100)+'%';
}


// ── MM CALIBRATION ──
// User can override with manual two-point calibration.
const SN_MM = 71; // clinical average S-N length in mm
let manualMmPerPx = null; // set only if user manually calibrates
let calibrating = false, calibPt1 = null;

// Returns mm-per-px: manual if set, otherwise derived from S-N landmarks
function getMmPerPx(p){
  if(manualMmPerPx) return manualMmPerPx;
  if(p.S && p.N){
    const snPx = dst(p.S, p.N);
    if(snPx > 0) return SN_MM / snPx;
  }
  return null;
}

document.getElementById('calib-btn').addEventListener('click',()=>{
  if(!imgEl){ alert('Upload an image first.'); return; }
  calibrating = true; calibPt1 = null;
  // Remove any previous calib markers
  document.querySelectorAll('.calib-marker').forEach(e=>e.remove());
  // Show banner
  const banner = document.getElementById('calib-banner');
  const step   = document.getElementById('calib-step');
  step.textContent = 'Click point 1';
  banner.classList.add('active');
  // hdr-hint reserved
});

// Helper: draw a calibration marker dot on the SVG overlay
function drawCalibMarker(cx, cy, label){
  const g = document.createElementNS('http://www.w3.org/2000/svg','g');
  g.classList.add('calib-marker');
  // outer pulsing ring
  const ring = document.createElementNS('http://www.w3.org/2000/svg','circle');
  ring.setAttribute('cx',cx); ring.setAttribute('cy',cy); ring.setAttribute('r',9);
  ring.setAttribute('fill','none'); ring.setAttribute('stroke','#f0883e');
  ring.setAttribute('stroke-width','1.5'); ring.setAttribute('opacity','0.7');
  // inner dot
  const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
  dot.setAttribute('cx',cx); dot.setAttribute('cy',cy); dot.setAttribute('r','4');
  dot.setAttribute('fill','#f0883e'); dot.setAttribute('stroke','#000'); dot.setAttribute('stroke-width','1');
  // label
  const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
  txt.setAttribute('x',cx+12); txt.setAttribute('y',cy-8);
  txt.setAttribute('fill','#f0883e'); txt.setAttribute('font-size','10');
  txt.setAttribute('font-family','DM Mono,monospace');
  txt.setAttribute('paint-order','stroke'); txt.setAttribute('stroke','#000'); txt.setAttribute('stroke-width','2.5');
  txt.setAttribute('pointer-events','none');
  txt.textContent = label;
  g.appendChild(ring); g.appendChild(dot); g.appendChild(txt);
  svg.appendChild(g);
}

// Helper: draw a dashed line between two canvas points
function drawCalibLine(cx1,cy1,cx2,cy2){
  const line = document.createElementNS('http://www.w3.org/2000/svg','line');
  line.classList.add('calib-marker');
  line.setAttribute('x1',cx1); line.setAttribute('y1',cy1);
  line.setAttribute('x2',cx2); line.setAttribute('y2',cy2);
  line.setAttribute('stroke','#f0883e'); line.setAttribute('stroke-width','1.2');
  line.setAttribute('stroke-dasharray','4,3'); line.setAttribute('opacity','0.7');
  line.setAttribute('pointer-events','none');
  svg.appendChild(line);
}

// Capture-phase click for manual calibration (mouse/desktop)
svg.addEventListener('click', e=>{
  if(!calibrating) return;
  e.stopImmediatePropagation();
  const r = svg.getBoundingClientRect();
  const cx = e.clientX - r.left, cy = e.clientY - r.top;
  const n = toN(cx, cy);
  if(n.x<0||n.x>1||n.y<0||n.y>1) return;

  const banner = document.getElementById('calib-banner');
  const step   = document.getElementById('calib-step');

  if(!calibPt1){
    // Point 1 placed — wait for Point 2, show no dialog yet
    calibPt1 = { px: px(n), cx, cy };
    drawCalibMarker(cx, cy, 'P1');
    step.textContent = ('ontouchstart' in window) ? 'Tap point 2' : 'Click point 2';
    banner.innerHTML = '';
    banner.appendChild(step);
    banner.insertAdjacentHTML('beforeend','&nbsp; of a known distance on the image');
  } else {
    // Point 2 placed — NOW show the distance input
    const p = px(n);
    drawCalibMarker(cx, cy, 'P2');
    drawCalibLine(calibPt1.cx, calibPt1.cy, cx, cy);
    banner.classList.remove('active');
    const pixDist = Math.sqrt((p.x-calibPt1.px.x)**2 + (p.y-calibPt1.px.y)**2);
    _showCalibDialog(pixDist);
  }
}, true);

// Shared calibration dialog used by both mouse and touch
function _showCalibDialog(pixDist){
  var ov=document.createElement('div');
  ov.className='calib-ov';
  var box=document.createElement('div');
  box.className='calib-box';
  box.innerHTML=
    '<div class="calib-title">Calibration</div>'+
    '<div class="calib-sub">Enter the real distance between Point 1 and Point 2</div>'+
    '<div class="calib-row">'+
    '<input id="_ci2" class="calib-input" type="number" min="1" step="0.1" placeholder="e.g. 71">'+
    '<span class="calib-unit">mm</span></div>'+
    '<div class="calib-btns">'+
    '<button id="_cok2" class="calib-ok">Set Calibration</button>'+
    '<button id="_ccx2" class="calib-cancel">Cancel</button>'+
    '</div>';
  ov.appendChild(box); document.body.appendChild(ov);
  var inp=document.getElementById('_ci2');
  setTimeout(function(){inp.focus();},80);
  function done(val){
    document.querySelectorAll('.calib-marker').forEach(function(e){e.remove();});
    calibrating=false; calibPt1=null;
    var mm=parseFloat(val);
    if(val&&!isNaN(mm)&&mm>0){
      manualMmPerPx=mm/pixDist;
      document.getElementById('calib-btn').textContent='Cal:'+mm+'mm ✓';
      document.getElementById('calib-btn').style.color='var(--accent)';
      document.getElementById('calib-btn').style.borderColor='var(--accent)';
      document.getElementById('hdr-hint').textContent='Calibration set: '+mm+'mm';
    } else {
      manualMmPerPx=null;
      document.getElementById('calib-btn').textContent='Calibrate';
      document.getElementById('calib-btn').style.color='';
      document.getElementById('calib-btn').style.borderColor='';
      // hdr-hint reserved
    }
    ov.remove();
  }
  document.getElementById('_cok2').addEventListener('click',function(){done(inp.value);});
  document.getElementById('_ccx2').addEventListener('click',function(){done(null);});
  inp.addEventListener('keydown',function(e){if(e.key==='Enter')done(inp.value);});
}


// ── MODE SWITCHER ──
let currentMode = 'full'; // 'full' | 'key'

const KEY_MEASUREMENTS = new Set([
  'SN–Maxillary Plane',
  'SNA', 'SNB', 'ANB',
  'MMPA',
  'LAFH:TAFH %',
  'U1 to Maxillary Plane',
  'L1 to Mandibular Plane',
  'Interincisal Angle',
  'Overjet',
  'L1 to A-Pog',
]);

const modeChip = document.getElementById('mode-chip');
const modeMenu = document.getElementById('mode-menu');

modeChip.addEventListener('click', e => {
  e.stopPropagation();
  modeMenu.classList.toggle('open');
});
document.addEventListener('click', () => modeMenu.classList.remove('open'));

modeMenu.querySelectorAll('.mode-item').forEach(item => {
  item.addEventListener('click', e => {
    e.stopPropagation();
    currentMode = item.dataset.mode;
    modeMenu.querySelectorAll('.mode-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    modeChip.childNodes[0].textContent =
      currentMode === 'key'      ? 'Key Measurements' :
      currentMode === 'mcnamara' ? 'McNamara Analysis' :
      currentMode === 'downs'    ? 'Downs Analysis' :
      currentMode === 'steiner'  ? 'Steiner Analysis' :
      'Eastman Analysis';
    modeMenu.classList.remove('open');
    // Auto re-analyse if any landmarks are placed
    if(Object.keys(pts).length > 0){
      setTimeout(function(){ document.getElementById('analyse-btn').click(); }, 50);
    }
  });
});


// ── ANALYSIS ──
document.getElementById('analyse-btn').addEventListener('click',()=>{
  const p = pxMap(pts);
  const mmPerPx = getMmPerPx(p);
  const toMmNow = v => mmPerPx ? v * mmPerPx : null;
  const calibSource = manualMmPerPx
    ? 'manual calibration'
    : (p.S && p.N ? `S-N = ${SN_MM} mm (auto)` : null);

  const body = document.getElementById('results-body');

  // ── Transition: fade out old results, then populate ──
  body.style.transition = 'opacity 0.25s ease';
  body.style.opacity = '0';

  setTimeout(() => {
    body.innerHTML = '';

  // Mode badge
  const modeBadge = document.createElement('div');
  modeBadge.style.cssText = 'margin:10px 15px 4px;display:flex;align-items:center;gap:6px;';
  modeBadge.innerHTML =
    currentMode === 'key'
      ? `<span class="mode-chip-key">Key Measurements</span>`
      : currentMode === 'mcnamara'
      ? `<span class="mode-chip-mcnamara">McNamara Analysis</span>`
      : currentMode === 'downs'
      ? `<span class="mode-chip-downs">Downs Analysis</span>`
      : currentMode === 'steiner'
      ? `<span class="mode-chip-steiner">Steiner Analysis</span>`
      : `<span class="mode-chip-eastman">Eastman Analysis</span>`;
  body.appendChild(modeBadge);

  // Scale banner
  const banner = document.createElement('div');
  if(calibSource){
    banner.className = 'scale-banner scale-ok';
    banner.innerHTML = `<strong>Scale:</strong> ${calibSource} → ${(1/mmPerPx).toFixed(1)} px/mm`;
  } else {
    banner.className = 'scale-banner scale-warn';
    banner.innerHTML = '<strong>No scale.</strong> Place S and N for auto mm calibration, or use <em>Calibrate</em>.';
  }
  body.appendChild(banner);

  // Select measurement set by mode
  const activeMeas =
    currentMode === 'key'      ? MEAS.filter(m => KEY_MEASUREMENTS.has(m.n)) :
    currentMode === 'mcnamara' ? MEAS_MCNAMARA :
    currentMode === 'downs'    ? MEAS_DOWNS :
    currentMode === 'steiner'  ? MEAS_STEINER :
    MEAS;

  let cur = '';
  let rowIndex = 0;
  activeMeas.forEach(m=>{
    let val;
    try{ val = m.c(p); }catch(e){ val = null; }
    if(val !== null && m.u === 'mm'){ val = toMmNow(val); }

    // Section labels shown in full and mcnamara modes
    if(currentMode !== 'key' && m.s !== cur){
      cur = m.s;
      const sl = document.createElement('div');
      sl.className = 'sec-lbl'; sl.textContent = cur;
      body.appendChild(sl);
    }

    const hasValue = val !== null;
    const classify = (v,mean,sd) =>
      v >= mean-sd && v <= mean+sd ? {c:'sn',l:'Normal'} :
      v > mean+sd ? {c:'sh', l:v>mean+2*sd?'↑↑ High':'↑ High'} :
      {c:'sl', l:v<mean-2*sd?'↓↓ Low':'↓ Low'};

    const st = hasValue ? classify(val, m.norm[0], m.norm[1]) : null;

    const row = document.createElement('div');
    row.className = 'm-row m-row-anim';
    row.style.animationDelay = (rowIndex * 40) + 'ms';
    rowIndex++;
    row.innerHTML = `
      <div class="m-name">${m.n}<small>${m.d}</small></div><div><div class="m-val">${hasValue ? val.toFixed(1)+m.u : '–'}</div><div class="m-norm">${m.norm[0]}${m.u} ±${m.norm[1]}</div></div>
      ${!hasValue
        ? `<span class="m-status m-na">N/A</span>`
        : `<span class="m-status ${st.c}">${st.l}</span>`}`;
    body.appendChild(row);
  });

  // Show export button now that results exist
  document.getElementById('export-btn').style.display = 'block';

  // On mobile: show toast to switch to results tab
  if(window.innerWidth <= 1024){
    var old = document.getElementById('_toast');
    if(old) old.remove();
    var toast = document.createElement('div');
    toast.id = '_toast';
    toast.className = 'tab-toast';
    toast.textContent = 'Analysis done — tap to view Results';
    toast.onclick = function(){ switchTab('res'); toast.remove(); };
    document.body.appendChild(toast);
    setTimeout(function(){ if(toast.parentNode) toast.remove(); }, 5000);
  }

  // Fade results back in
  body.style.opacity = '0';
  requestAnimationFrame(() => {
    body.style.transition = 'opacity 0.35s ease';
    body.style.opacity = '1';
  });

  }, 260); // end setTimeout — matches fade-out duration
});


// ── PDF EXPORT ──
document.getElementById('export-btn').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const W = 210, H = 297;
  const margin = 14;
  const col = margin;
  let y = margin;

  // ── Palette ──────────────────────────────────
  const CLR = {
    bg:      [13,17,23],
    surface: [22,27,34],
    border:  [48,54,61],
    accent:  [88,166,255],
    green:   [63,185,80],
    warn:    [240,136,62],
    low:     [63,185,80],
    text:    [230,237,243],
    muted:   [125,133,144],
    purple:  [188,140,255],
  };

  function setFill(c){ doc.setFillColor(...c); }
  function setDraw(c){ doc.setDrawColor(...c); }
  function setTxt(c){  doc.setTextColor(...c); }

  // ── Background ──────────────────────────────
  setFill(CLR.bg);
  doc.rect(0, 0, W, H, 'F');

  // ── Header bar ──────────────────────────────
  setFill(CLR.surface);
  doc.rect(0, 0, W, 22, 'F');
  setDraw(CLR.border);
  doc.setLineWidth(0.3);
  doc.line(0, 22, W, 22);

  // Logo text
  doc.setFont('helvetica','bold');
  doc.setFontSize(13);
  setTxt(CLR.accent);
  doc.text('OrthoTimes', margin, 13);
  const otW = doc.getTextWidth('OrthoTimes');
  doc.setFont('helvetica','normal');
  setTxt(CLR.muted);
  doc.text(' Pixel Ceph', margin + otW, 13);

  // Mode badge
  const modeName =
    currentMode === 'key'      ? 'Key Measurements' :
    currentMode === 'mcnamara' ? 'McNamara Analysis' :
    currentMode === 'downs'    ? 'Downs Analysis' :
    currentMode === 'steiner'  ? 'Steiner Analysis' :
    'Eastman Analysis';
  const badgeColor =
    currentMode === 'key'      ? CLR.accent :
    currentMode === 'mcnamara' ? CLR.purple :
    currentMode === 'downs'    ? CLR.warn :
    currentMode === 'steiner'  ? [80,200,120] :
    CLR.green;
  doc.setFontSize(7.5);
  doc.setFont('helvetica','bold');
  setTxt(badgeColor);
  const badgeX = W - margin - doc.getTextWidth(modeName) - 4;
  setFill([...badgeColor.map(v => Math.min(255, v * 0.15 + CLR.surface[0] * 0.85))]);
  doc.roundedRect(badgeX - 3, 7, doc.getTextWidth(modeName) + 6, 7, 1.5, 1.5, 'F');
  doc.text(modeName, badgeX, 12.5);

  // Date
  doc.setFont('helvetica','normal');
  doc.setFontSize(7);
  setTxt(CLR.muted);
  const dateStr = new Date().toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'});
  doc.text(dateStr, W - margin, 17, { align: 'right' });
  const _patName = (document.getElementById('patient-name').value || '').trim();
  if(_patName){
    doc.setFont('helvetica','bold'); doc.setFontSize(8); setTxt(CLR.text);
    doc.text('Patient: ', margin, 19);
    const _lw = doc.getTextWidth('Patient: ');
    doc.setFont('helvetica','normal'); setTxt(CLR.accent);
    doc.text(_patName, margin + _lw, 19);
  }

  y = 28;

  // ── Ceph image + landmark overlay ───────────
  if(imgEl && Object.keys(pts).length > 0){
    // Draw image with landmarks onto high-res offscreen canvas
    const SCALE = 3; // 3× pixel density for print quality
    const REPORT_W = 600;
    const REPORT_H = Math.round(imgEl.naturalHeight * (REPORT_W / imgEl.naturalWidth));
    const offCanvas = document.createElement('canvas');
    offCanvas.width  = REPORT_W * SCALE;
    offCanvas.height = REPORT_H * SCALE;
    const oc = offCanvas.getContext('2d');
    oc.scale(SCALE, SCALE);

    // dark background
    oc.fillStyle = '#0d1117';
    oc.fillRect(0, 0, REPORT_W, REPORT_H);

    // image — draw at full report size
    oc.drawImage(imgEl, 0, 0, REPORT_W, REPORT_H);

    // Draw lines (same as drawLines() function but on offscreen canvas)
    if(showLines){
      const pReport = {};
      LM.forEach(l => {
        if(pts[l.id]) pReport[l.id] = {x: pts[l.id].x * REPORT_W, y: pts[l.id].y * REPORT_H};
      });

      function drawLine(a, b, col, w, dash){
        if(!pReport[a] || !pReport[b]) return;
        oc.beginPath();
        oc.moveTo(pReport[a].x, pReport[a].y);
        oc.lineTo(pReport[b].x, pReport[b].y);
        oc.strokeStyle = col;
        oc.lineWidth = w;
        oc.globalAlpha = 0.55;
        if(dash && dash.length > 0) oc.setLineDash(dash);
        else oc.setLineDash([]);
        oc.stroke();
        oc.globalAlpha = 1;
      }

      // Cranial base & reference planes
      drawLine('S','N',  '#58a6ff',1.5,[]);
      drawLine('Po','Or','#8fafc8',1,[4,3]);

      // Maxillary structures
      drawLine('ANS','PNS','#3fb950',1.2,[]);
      drawLine('N','A',    '#3fb950',1,[5,3]);
      drawLine('A','Pog',  '#e8c06c',1,[5,3]);

      // Mandibular structures
      drawLine('Go','Me',  '#f0883e',1.2,[]);
      drawLine('Go','Gn',  '#f0883e',1,[4,3]);
      drawLine('N','B',    '#f0883e',1,[5,3]);
      drawLine('N','Pog',  '#e8a0ff',1,[4,3]);
      drawLine('S','Gn',   '#d0a0ff',1,[3,4]);

      // Incisor long axes
      drawLine('U1tip','U1ap','#3fb950',1.5,[]);
      drawLine('L1tip','L1ap','#f0883e',1.5,[]);

      // Soft tissue
      drawLine('Prn','Pogp','#bc8cff',1,[4,3]);

      // McNamara specific
      drawLine('Co','A',  '#a0d0ff',1,[3,4]);
      drawLine('Co','Gn', '#ffd0a0',1,[3,4]);
      drawLine('PNS','Gn','#d0ffd0',1,[3,4]);

      // Occlusal contacts
      drawLine('U6','L6', '#e8c06c',1,[3,3]);
      drawLine('U4','L4', '#e8c06c',1,[3,3]);

      oc.setLineDash([]); // reset
    }

    // Draw occlusal plane if present
    if(occPlane){
      const occ1 = {x: occPlane.p1.x * REPORT_W, y: occPlane.p1.y * REPORT_H};
      const occ2 = {x: occPlane.p2.x * REPORT_W, y: occPlane.p2.y * REPORT_H};
      const odx = occ2.x-occ1.x, ody = occ2.y-occ1.y;
      const olen = Math.sqrt(odx*odx+ody*ody)||1;
      const oext = 40; // extend 40px each side in report space
      const ouxo = odx/olen, ouyo = ody/olen;
      oc.beginPath();
      oc.moveTo(occ1.x - ouxo*oext, occ1.y - ouyo*oext);
      oc.lineTo(occ2.x + ouxo*oext, occ2.y + ouyo*oext);
      oc.strokeStyle = '#e8c06c';
      oc.lineWidth = 1.8;
      oc.globalAlpha = 0.75;
      oc.setLineDash([6,3]);
      oc.stroke();
      oc.setLineDash([]);
      oc.globalAlpha = 1;
    }

    // landmark dots + labels — tiny precise dots for PDF
    const COLORS_MAP = {'Cranial Base':'#58a6ff','Maxilla':'#3fb950','Mandible':'#f0883e','Soft Tissue':'#bc8cff'};
    LM.forEach(lm => {
      if(!pts[lm.id]) return;
      const cx = pts[lm.id].x * REPORT_W;
      const cy = pts[lm.id].y * REPORT_H;
      const col = COLORS_MAP[lm.group] || '#fff';
      // tiny outer ring
      oc.beginPath();
      oc.arc(cx, cy, 3, 0, Math.PI * 2);
      oc.strokeStyle = col;
      oc.lineWidth = 0.8;
      oc.globalAlpha = 0.5;
      oc.stroke();
      // tiny filled dot
      oc.beginPath();
      oc.arc(cx, cy, 1.5, 0, Math.PI * 2);
      oc.fillStyle = col;
      oc.globalAlpha = 1.0;
      oc.fill();
      // crosshair lines for precision
      oc.strokeStyle = col;
      oc.lineWidth = 0.5;
      oc.globalAlpha = 0.4;
      oc.beginPath(); oc.moveTo(cx-5,cy); oc.lineTo(cx+5,cy); oc.stroke();
      oc.beginPath(); oc.moveTo(cx,cy-5); oc.lineTo(cx,cy+5); oc.stroke();
      // small label
      oc.globalAlpha = 0.9;
      oc.fillStyle = col;
      oc.font = '7px "DM Mono", monospace';
      oc.shadowColor = '#000';
      oc.shadowBlur = 2;
      oc.fillText(lm.abbr, cx + 4, cy - 3);
      oc.shadowBlur = 0;
      oc.globalAlpha = 1;
    });

    const imgData = offCanvas.toDataURL('image/png');
    const imgH_mm = Math.round((REPORT_H / REPORT_W) * (W - margin * 2));
    const imgW_mm = W - margin * 2;
    doc.addImage(imgData, 'PNG', margin, y, imgW_mm, imgH_mm);
    y += imgH_mm + 6;
  }

  function COLORS_MAP_JS(group){
    return group === 'Cranial Base' ? [88,166,255] :
           group === 'Maxilla'      ? [63,185,80]  :
           group === 'Mandible'     ? [240,136,62] :
           [188,140,255];
  }

  // ── Measurements table ───────────────────────
  if(y + 20 > H - margin){ doc.addPage(); setFill(CLR.bg); doc.rect(0,0,W,H,'F'); y = margin; }

  setFill(CLR.surface);
  doc.rect(margin, y, W - margin * 2, 7, 'F');
  doc.setFont('helvetica','bold');
  doc.setFontSize(7);
  setTxt(CLR.muted);
  doc.text('MEASUREMENTS', margin + 2, y + 4.8);
  y += 8;

  // Column headers
  const mCols = [margin+2, margin+62, margin+100, margin+124, margin+148];
  const mHdrs = ['Measurement', 'Description', 'Value', 'Norm', 'Status'];
  doc.setFont('helvetica','bold');
  doc.setFontSize(7);
  setTxt(CLR.muted);
  mHdrs.forEach((h,i) => doc.text(h, mCols[i], y + 3.5));
  y += 5;
  setDraw(CLR.border);
  doc.setLineWidth(0.2);
  doc.line(margin, y, W - margin, y);
  y += 2;

  // Build the same activeMeas as the screen
  const p = pxMap(pts);
  const mmPerPxR = getMmPerPx(p);
  const toMmR = v => mmPerPxR ? v * mmPerPxR : null;

  const activeMeasR =
    currentMode === 'key'      ? MEAS.filter(m => KEY_MEASUREMENTS.has(m.n)) :
    currentMode === 'mcnamara' ? MEAS_MCNAMARA :
    currentMode === 'downs'    ? MEAS_DOWNS :
    currentMode === 'steiner'  ? MEAS_STEINER :
    MEAS;

  let curS = '';
  doc.setFont('helvetica','normal');
  doc.setFontSize(6.8);

  activeMeasR.forEach((m, idx) => {
    if(y + 6 > H - margin){ doc.addPage(); setFill(CLR.bg); doc.rect(0,0,W,H,'F'); y = margin + 4; }

    // Section separator
    if(currentMode !== 'key' && m.s !== curS){
      curS = m.s;
      y += 2;
      doc.setFont('helvetica','bold');
      doc.setFontSize(6);
      setTxt(CLR.muted);
      doc.text(m.s.toUpperCase(), mCols[0], y + 3);
      y += 5;
      doc.setFont('helvetica','normal');
      doc.setFontSize(6.8);
    }

    let val;
    try{ val = m.c(p); }catch(e){ val = null; }
    if(val !== null && m.u === 'mm'){ val = toMmR(val); }

    const hasVal = val !== null;
    const classify = (v,mn,sd) =>
      v>=mn-sd&&v<=mn+sd ? {l:'Normal', c:CLR.accent} :
      v>mn+sd            ? {l:'High',   c:CLR.warn}   :
                           {l:'Low',    c:CLR.low};

    const st = hasVal ? classify(val, m.norm[0], m.norm[1]) : null;

    // zebra
    if(idx % 2 === 0){ setFill([22,27,34]); doc.rect(margin, y - 1, W - margin*2, 6, 'F'); }

    const rowY = y + 3.2;
    setTxt(CLR.text);
    doc.setFont('helvetica','normal');
    doc.text(m.n.length > 28 ? m.n.slice(0,27)+'…' : m.n, mCols[0], rowY);
    setTxt(CLR.muted);
    doc.text(m.d.length > 24 ? m.d.slice(0,23)+'…' : m.d, mCols[1], rowY);

    if(hasVal){
      setTxt(st ? st.c : CLR.muted);
      doc.setFont('courier','bold');
      doc.text(val.toFixed(1) + m.u, mCols[2], rowY);
      doc.setFont('helvetica','normal');
      setTxt(CLR.muted);
      doc.text(`${m.norm[0]}${m.u} ±${m.norm[1]}`, mCols[3], rowY);
      if(st){
        setTxt(st.c);
        doc.setFont('helvetica','bold');
        doc.text(st.l, mCols[4], rowY);
        doc.setFont('helvetica','normal');
      }
    } else {
      setTxt(CLR.muted);
      doc.setFont('courier','normal');
      doc.text('–', mCols[2], rowY);
      doc.setFont('helvetica','normal');
      doc.text(`${m.norm[0]}${m.u} ±${m.norm[1]}`, mCols[3], rowY);
      doc.text('N/A', mCols[4], rowY);
    }
    y += 6;
  });

  // ── Footer ───────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for(let pg = 1; pg <= pageCount; pg++){
    doc.setPage(pg);
    setDraw(CLR.border);
    doc.setLineWidth(0.2);
    doc.line(margin, H - 10, W - margin, H - 10);
    doc.setFont('helvetica','normal');
    doc.setFontSize(6);
    setTxt(CLR.muted);
    doc.text('OrthoTimes Pixel Ceph — For clinical use only', margin, H - 6);
    doc.text(`Page ${pg} of ${pageCount}`, W - margin, H - 6, { align: 'right' });
  }

  const _pn=(document.getElementById('patient-name').value||'').trim();doc.save(_pn?`${_pn.replace(/[^a-zA-Z0-9_\-]/g,'_')}_ceph_${new Date().toISOString().slice(0,10)}.pdf`:`PixelCeph_${modeName.replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.pdf`);
});


// ── INIT ──


// ── TOUCH & PEN — single unified handler ──
(function(){
  if (!window.PointerEvent && !('ontouchstart' in window)) return;

  // State — one set, never duplicated
  var _drag    = null;          // landmark id being dragged
  var _dragOcc = null;          // 'p1'|'p2' occ plane handle
  var _pan     = false;
  var _ps      = {x:0,y:0};    // pan start (client)
  var _po      = {x:0,y:0};    // pan origin panX/Y
  var _moved   = false;
  var _placed  = false;         // true once we placed in this gesture
  var _pinch   = 0;

  // SVG-relative from client
  function rel(cx,cy){
    var r=svg.getBoundingClientRect();
    return {x:cx-r.left, y:cy-r.top};
  }

  // Find nearest PLACED landmark within hitR canvas pixels
  function nearest(cx,cy,hitR){
    var HIT=hitR||40, best=null, bestD=HIT*HIT;
    var r=rel(cx,cy);
    LM.forEach(function(lm){
      if(!pts[lm.id]) return;
      var c=toC(pts[lm.id].x, pts[lm.id].y);
      var d2=Math.pow(r.x-c.x,2)+Math.pow(r.y-c.y,2);
      if(d2<bestD){bestD=d2; best=lm.id;}
    });
    return best;
  }

  // Find nearest occ handle within hitR
  function nearestOcc(cx,cy,hitR){
    if(!occPlane) return null;
    var HIT=hitR||40, r=rel(cx,cy);
    var c1=toC(occPlane.p1.x,occPlane.p1.y);
    var c2=toC(occPlane.p2.x,occPlane.p2.y);
    var d1=Math.sqrt(Math.pow(r.x-c1.x,2)+Math.pow(r.y-c1.y,2));
    var d2=Math.sqrt(Math.pow(r.x-c2.x,2)+Math.pow(r.y-c2.y,2));
    if(d1<HIT && d1<=d2) return 'p1';
    if(d2<HIT) return 'p2';
    return null;
  }

  // ── POINTER DOWN ────────────────────────────
  svg.addEventListener('pointerdown', function(e){
    if(e.pointerType==='mouse') return;
    e.preventDefault();
    svg.setPointerCapture(e.pointerId);
    _moved=false; _placed=false;

    if(calibrating) return; // calibration handled on pointerup

    // Apple Pencil gets tighter hit radius; finger gets wider
    var hitR = e.pointerType==='pen' ? 18 : 40;
    var dot=nearest(e.clientX,e.clientY,hitR);
    if(dot){ _drag=dot; setActive(dot); return; }

    var occ=nearestOcc(e.clientX,e.clientY,hitR);
    if(occ){ _dragOcc=occ; return; }

    _pan=true;
    _ps={x:e.clientX,y:e.clientY};
    _po={x:panX,y:panY};
  },{passive:false});

  var _ptrType = 'touch'; // track current pointer type for move threshold

  // ── POINTER MOVE ────────────────────────────
  svg.addEventListener('pointermove', function(e){
    if(e.pointerType==='mouse') return;
    e.preventDefault();

    var p=rel(e.clientX,e.clientY);
    // Feed magnifier — use higher zoom for touch, standard for pen
    smoothX=p.x; smoothY=p.y;
    mouseCanvasX=p.x; mouseCanvasY=p.y;
    if(showMag && imgEl) drawMag(p.x,p.y);

    // Pen (Apple Pencil): 14px threshold — pencil tip tremor during a tap
    // easily exceeds 2px, so we need a larger dead-zone than you'd expect.
    // Finger: 10px threshold.
    var moveThresh = (e.pointerType==='pen') ? 14 : 10;
    var dx=e.clientX-_ps.x, dy=e.clientY-_ps.y;
    if(Math.sqrt(dx*dx+dy*dy)>moveThresh) _moved=true;

    if(_drag){
      let n=toN(p.x,p.y);
      pts[_drag]={x:Math.max(0,Math.min(1,n.x)),y:Math.max(0,Math.min(1,n.y))};
      drawImg(); renderOvl(); return;
    }
    if(_dragOcc && occPlane){
      let n=toN(p.x,p.y);
      occPlane[_dragOcc]={x:Math.max(0,Math.min(1,n.x)),y:Math.max(0,Math.min(1,n.y))};
      drawImg(); renderOvl(); return;
    }
    if(_pan && _moved){
      panX=_po.x+(e.clientX-_ps.x);
      panY=_po.y+(e.clientY-_ps.y);
      drawImg(); renderOvl();
    }
  },{passive:false});

  // ── POINTER UP ──────────────────────────────
  svg.addEventListener('pointerup', function(e){
    if(e.pointerType==='mouse') return;
    e.preventDefault();

    // Calibration — each point needs its OWN separate tap gesture
    if(calibrating){
      // Only register if this pointer actually moved very little (real tap, not pan)
      if(_moved) { _pan=false; _moved=false; return; }
      var r=svg.getBoundingClientRect();
      var cx=e.clientX-r.left, cy=e.clientY-r.top;
      var n=toN(cx,cy);
      if(n.x>=0&&n.x<=1&&n.y>=0&&n.y<=1){
        var banner=document.getElementById('calib-banner');
        var step=document.getElementById('calib-step');
        if(!calibPt1){
          // First tap — store P1, show banner, done. Wait for next separate tap.
          calibPt1={px:px(n),cx:cx,cy:cy};
          drawCalibMarker(cx,cy,'P1');
          step.textContent='Tap point 2';
          banner.innerHTML=''; banner.appendChild(step);
          banner.insertAdjacentHTML('beforeend','&nbsp;of a known distance');
        } else {
          // Second tap — store P2 and show dialog
          var p2=px(n);
          drawCalibMarker(cx,cy,'P2');
          drawCalibLine(calibPt1.cx,calibPt1.cy,cx,cy);
          banner.classList.remove('active');
          var dist=Math.sqrt(Math.pow(p2.x-calibPt1.px.x,2)+Math.pow(p2.y-calibPt1.px.y,2));
          _showCalibDialog(dist);
        }
      }
      _pan=false; _moved=false;
      return;
    }

    if(_drag){ snapState(); _drag=null; return; }
    if(_dragOcc){ snapState(); _dragOcc=null; occPlaneManual=true; return; }

    // Tap = place ONE landmark exactly at this position
    if(_pan && !_moved && !_placed && activeLm && !calibrating){
      _placed=true; // block any re-fire in this gesture
      var p=rel(e.clientX,e.clientY);
      var n=toN(p.x,p.y);
      if(n.x>=0&&n.x<=1&&n.y>=0&&n.y<=1){
        snapState();
        pts[activeLm]={x:n.x,y:n.y};
        markPlaced(activeLm);
        // Visual confirmation ring at tap position
        (function showTapRing(nx,ny){
          var rc=toC(nx,ny);
          var ring=document.createElementNS('http://www.w3.org/2000/svg','circle');
          ring.setAttribute('cx',rc.x);ring.setAttribute('cy',rc.y);
          ring.setAttribute('r',8);ring.setAttribute('fill','none');
          ring.setAttribute('stroke',getCol(activeLm));ring.setAttribute('stroke-width','2');
          ring.setAttribute('opacity','0.9');ring.setAttribute('pointer-events','none');
          svg.appendChild(ring);
          var start=null;
          function animate(ts){
            if(!start) start=ts;
            var p=(ts-start)/400;
            if(p>=1){svg.removeChild(ring);return;}
            ring.setAttribute('r',8+p*18);
            ring.setAttribute('opacity',(1-p)*0.9);
            requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);
        })(n.x,n.y);
        var idx=LM.findIndex(function(l){return l.id===activeLm;});
        var next=LM.slice(idx+1).find(function(l){return !pts[l.id];});
        if(next) setActive(next.id);
        else if(LM.every(function(l){return pts[l.id];})){
          activeLm=null;
          document.getElementById('hint-box').classList.remove('visible');
        }
        drawImg(); renderOvl();
      }
    }
    _pan=false; _moved=false;
  },{passive:false});

  svg.addEventListener('pointercancel',function(e){
    if(e.pointerType==='mouse') return;
    _drag=null;_dragOcc=null;_pan=false;_moved=false;_placed=false;
  });

  // ── PINCH ZOOM (2-finger touch only) ────────
  svg.addEventListener('touchstart',function(e){
    if(e.touches.length!==2) return;
    e.preventDefault();
    var dx=e.touches[0].clientX-e.touches[1].clientX;
    var dy=e.touches[0].clientY-e.touches[1].clientY;
    _pinch=Math.sqrt(dx*dx+dy*dy);
  },{passive:false});

  svg.addEventListener('touchmove',function(e){
    if(e.touches.length!==2) return;
    e.preventDefault();
    var dx=e.touches[0].clientX-e.touches[1].clientX;
    var dy=e.touches[0].clientY-e.touches[1].clientY;
    var d=Math.sqrt(dx*dx+dy*dy);
    if(_pinch>0){
      var f=d/_pinch;
      var mx=(e.touches[0].clientX+e.touches[1].clientX)/2;
      var my=(e.touches[0].clientY+e.touches[1].clientY)/2;
      var r=svg.getBoundingClientRect();
      _applyZoom(f, mx-r.left, my-r.top);
      _pinch=d;
    }
  },{passive:false});

  svg.addEventListener('touchend',function(e){_pinch=0;},{passive:false});

})(); // end unified touch/pen handler

buildList();

// Keep HuggingFace Space warm — ping every 4 minutes
setInterval(function(){ fetch('https://mujtaba1212-ceph-landmark-detector.hf.space/').catch(function(){}); }, 240000);


// ── AI LANDMARK DETECTION ──
(function(){
  var API_URL = 'https://mujtaba1212-ceph-landmark-detector.hf.space/predict';

  var SYM_MAP = {
    'A':'A','ANS':'ANS','B':'B','Me':'Me','N':'N',
    'Or':'Or','Pog':'Pog','PNS':'PNS','S':'S','Ar':'Ar',
    'Go':'Go','Gn':'Gn','Co':'Co','Po':'Po','Pn':'Prn',
    'UIT':'U1tip','UIA':'U1ap','LIT':'L1tip','LIA':'L1ap',
    'Sn':'Sn','Ls':'Ls','Li':'Li',
    'UPM':'U4','UMT':'U6','LPM':'L4','LMT':'L6'
  };

  document.getElementById('ai-detect-btn').addEventListener('click', function(){
    if(!imgEl){ alert('Please upload an X-ray image first!'); return; }

    var overlay = document.getElementById('ai-overlay');
    var status  = document.getElementById('ai-status');
    var prog    = document.getElementById('ai-prog');
    var pct     = document.getElementById('ai-pct');
    var chipsEl = document.getElementById('ai-chips');
    var lmNames = ['S','N','Or','Po','Ar','Co','A','ANS','PNS','B','Me','Pog','Gn','Go','Prn','Sn','Ls','Li',"Pog'",'U1tip','U1ap','L1tip','L1ap','U4','U6','L4','L6'];
    var msgs    = ['Initialising model…','Preprocessing image…','Detecting cranial base…','Mapping skeletal points…','Locating dental landmarks…','Tracing soft tissue…','Placing landmarks…'];
    overlay.style.display = 'flex';
    chipsEl.innerHTML = '';
    lmNames.forEach(function(lm){
      var d=document.createElement('div');
      d.className='ai-gc';d.textContent=lm;d.id='aic-'+lm;
      chipsEl.appendChild(d);
    });

    // Canvas ring animation
    var ringCv = document.getElementById('ai-ring-canvas');
    var ringCtx = ringCv ? ringCv.getContext('2d') : null;
    var ringT=0, ringSpeed1=0.04, ringSpeed2=-0.025;
    var ringTarget1=0.04, ringTarget2=-0.025, ringTimer=0;
    var ringAnim;
    function randRingSpeed(){ return (Math.random()>.5?1:-1)*(0.02+Math.random()*0.12); }
    function drawRingFrame(){
      if(!ringCtx) return;
      ringCtx.clearRect(0,0,90,90);
      ringTimer--;
      if(ringTimer<=0){ ringTarget1=randRingSpeed(); ringTarget2=randRingSpeed()*-1; ringTimer=30+Math.floor(Math.random()*60); }
      ringSpeed1+=(ringTarget1-ringSpeed1)*0.04;
      ringSpeed2+=(ringTarget2-ringSpeed2)*0.04;
      ringT+=1;
      var a1=ringT*ringSpeed1, a2=ringT*ringSpeed2;
      ringCtx.beginPath(); ringCtx.arc(45,45,38,0,Math.PI*2); ringCtx.strokeStyle='rgba(0,180,255,0.06)'; ringCtx.lineWidth=1; ringCtx.stroke();
      ringCtx.save(); ringCtx.translate(45,45); ringCtx.rotate(a1); ringCtx.translate(-45,-45);
      ringCtx.beginPath(); ringCtx.arc(45,45,38,0,Math.PI*1.2); ringCtx.strokeStyle='rgba(0,180,255,0.65)'; ringCtx.lineWidth=1.5; ringCtx.lineCap='round'; ringCtx.stroke(); ringCtx.restore();
      ringCtx.beginPath(); ringCtx.arc(45,45,28,0,Math.PI*2); ringCtx.strokeStyle='rgba(100,60,255,0.07)'; ringCtx.lineWidth=1; ringCtx.stroke();
      ringCtx.save(); ringCtx.translate(45,45); ringCtx.rotate(a2); ringCtx.translate(-45,-45);
      ringCtx.beginPath(); ringCtx.arc(45,45,28,0,Math.PI*0.8); ringCtx.strokeStyle='rgba(100,60,255,0.55)'; ringCtx.lineWidth=1; ringCtx.lineCap='round'; ringCtx.stroke(); ringCtx.restore();
      ringAnim = requestAnimationFrame(drawRingFrame);
    }
    drawRingFrame();

    // Progress — fast 0→70% with chips, slow crawl 70→99, jump to 100 on API done
    var displayPct=0, targetPct=0, apiDone=false;
    var progIv = setInterval(function(){
      if(apiDone && displayPct>=70){ targetPct=100; }
      else if(!apiDone && displayPct>=70){ if(displayPct<99) targetPct=Math.min(99, displayPct+0.12); }
      if(displayPct<targetPct){ displayPct=Math.min(displayPct+(displayPct<70?1.5:0.12),targetPct); }
      var shown=Math.min(Math.round(displayPct),100);
      prog.style.width=shown+'%'; pct.textContent=shown+'%';
      if(shown>=100){ clearInterval(progIv); status.textContent='Landmarks placed.'; }
    },30);

    var ci=0;
    var chipInterval = setInterval(function(){
      if(ci>0){ var prev=document.getElementById('aic-'+lmNames[ci-1]); if(prev)prev.className='ai-gc done'; }
      if(ci>=lmNames.length){ clearInterval(chipInterval); return; }
      var c=document.getElementById('aic-'+lmNames[ci]);
      if(c)c.className='ai-gc scanning';
      targetPct=Math.round((ci+1)/lmNames.length*70);
      var mi=Math.min(Math.floor((ci/lmNames.length)*msgs.length),msgs.length-1);
      status.textContent=msgs[mi];
      ci++;
    },80+Math.random()*80);

    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width  = imgEl.naturalWidth  || imgEl.width;
    tmpCanvas.height = imgEl.naturalHeight || imgEl.height;
    var ctx2 = tmpCanvas.getContext('2d');
    ctx2.drawImage(imgEl, 0, 0);

    tmpCanvas.toBlob(function(blob){

      var fd = new FormData();
      fd.append('file', blob, 'ceph.jpg');

      // Retry fetch with wake-up handling (HF Space may be sleeping)
      function fetchWithRetry(url, options, retries, delay){
        return fetch(url, options).then(function(r){
          // If response is not JSON (space waking up), retry
          var ct = r.headers.get('content-type') || '';
          if(!ct.includes('application/json')){
            if(retries > 0){
              status.textContent = 'Waking up AI server… please wait';
              return new Promise(function(res){ setTimeout(res, delay); })
                .then(function(){ return fetchWithRetry(url, options, retries-1, delay); });
            }
            throw new Error('AI server is not responding. Please try again in 30 seconds.');
          }
          return r.json();
        });
      }

      fetchWithRetry(API_URL, { method:'POST', body: fd }, 4, 8000)
        .then(function(data){
          prog.style.width = '80%';
          status.textContent = 'Placing landmarks…';

          var lm = data.landmarks;
          var imgW = imgEl.naturalWidth  || imgEl.width;
          var imgH = imgEl.naturalHeight || imgEl.height;

          var placed = 0;
          Object.keys(SYM_MAP).forEach(function(sym){
            var lmId = SYM_MAP[sym];
            if(!lm[sym]) return;
            var lmObj = LM.find(function(l){ return l.id === lmId; });
            if(!lmObj) return;
            pts[lmId] = { x: lm[sym].x / imgW, y: lm[sym].y / imgH };
            markPlaced(lmId);
            placed++;
          });

          // Place Pog' at brightest point to the right of Pog
          if(pts['Pog'] && imgEl){
            try {
              var scanCanvas = document.createElement('canvas');
              scanCanvas.width  = imgW;
              scanCanvas.height = imgH;
              var sCtx = scanCanvas.getContext('2d');
              sCtx.drawImage(imgEl, 0, 0, imgW, imgH);

              var pogX = Math.round(pts['Pog'].x * imgW);
              var pogY = Math.round(pts['Pog'].y * imgH);

              // Scan horizontally to the right, within ±20px vertically
              var scanStart = pogX + 5;
              var scanEnd   = Math.min(pogX + 120, imgW - 1);
              var halfH     = 20;
              var yMin      = Math.max(0, pogY - halfH);
              var yMax      = Math.min(imgH - 1, pogY + halfH);

              // Get brightness of each column
              var cols = [];
              for(var sx = scanStart; sx <= scanEnd; sx++){
                var colBrightness = 0;
                for(var sy = yMin; sy <= yMax; sy++){
                  var px = sCtx.getImageData(sx, sy, 1, 1).data;
                  colBrightness += (px[0] + px[1] + px[2]) / 3;
                }
                cols.push({ x: sx, b: colBrightness / (yMax - yMin + 1) });
              }

              // Find steepest brightness drop = soft tissue edge
              var bestX = pogX + 25;
              var maxDrop = 0;

              for(var i = 1; i < cols.length; i++){
                var drop = cols[i-1].b - cols[i].b;
                if(drop > maxDrop){
                  maxDrop = drop;
                  bestX = cols[i-1].x;
                }
              }

              pts['Pogp'] = { x: bestX / imgW, y: pts['Pog'].y };
              placed++;
            } catch(e){
              // fallback to fixed offset
              pts['Pogp'] = { x: pts['Pog'].x + (25 / imgW), y: pts['Pog'].y };
              placed++;
            }
          }

          apiDone = true;
          occPlaneManual = false; // reset so fit applies
          fitOccPlane();

          setTimeout(function(){
            cancelAnimationFrame(ringAnim);
            overlay.style.display = 'none';
            prog.style.width = '0%';
            renderOvl();
            updateProg();
            setTimeout(function(){
              document.getElementById('analyse-btn').click();
            }, 400);
          }, 900);
        })
        .catch(function(err){
          cancelAnimationFrame(ringAnim);
          overlay.style.display = 'none';
          prog.style.width = '0%';
          alert('AI detection failed.\n' + err.message);
        });
    }, 'image/jpeg', 0.92);
  });
})();


// ── MAGNIFIER — DRAG & RESIZE ──
(function(){
  var magEl    = document.getElementById('magnifier');
  var magCvs   = document.getElementById('mag-canvas');
  var resizeEl = document.getElementById('mag-resize');
  var MIN_SIZE = 80, MAX_SIZE = 380;

  // ── Create a transparent drag-handle ring that sits on TOP of the magnifier
  // but has pointer-events:auto — the magnifier itself keeps pointer-events:none
  // so mouse events still reach the SVG overlay underneath for normal operation.
  var dragHandle = document.createElement('div');
  dragHandle.id = 'mag-drag-handle';
  magEl.appendChild(dragHandle);

  function syncMagSize(){
    var s = parseInt(magEl.style.width) || magEl.offsetWidth || 160;
    magCvs.width  = s; magCvs.height = s;
    magCvs.style.width = s+'px'; magCvs.style.height = s+'px';
    magEl.style.borderRadius = '50%';
    window._magR = s / 2;
  }

  // ── DRAG via handle ──────────────────────────
  var _dragging=false, _dx=0, _dy=0;

  dragHandle.addEventListener('mousedown', function(e){
    e.preventDefault(); e.stopPropagation();
    _dragging=true;
    var r = magEl.getBoundingClientRect();
    _dx = e.clientX - r.left;
    _dy = e.clientY - r.top;
    dragHandle.style.cursor='grabbing';
  });

  document.addEventListener('mousemove', function(e){
    if(!_dragging) return;
    var wrap = document.getElementById('panel-img');
    var wr   = wrap.getBoundingClientRect();
    var s    = parseInt(magEl.style.width) || 160;
    var nx   = Math.max(0, Math.min(e.clientX - wr.left - _dx, wr.width  - s));
    var ny   = Math.max(0, Math.min(e.clientY - wr.top  - _dy, wr.height - s));
    magEl.style.left   = nx+'px';
    magEl.style.top    = ny+'px';
    magEl.style.right  = 'auto';
    magEl.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', function(){
    if(_dragging){ _dragging=false; dragHandle.style.cursor='move'; }
  });

  // ── RESIZE via corner handle ─────────────────
  var _resizing=false, _rsx=0, _rsy=0, _rsw=0;

  resizeEl.addEventListener('mousedown', function(e){
    e.preventDefault(); e.stopPropagation();
    _resizing=true; _rsx=e.clientX; _rsy=e.clientY;
    _rsw = parseInt(magEl.style.width) || magEl.offsetWidth || 160;
  });
  document.addEventListener('mousemove', function(e){
    if(!_resizing) return;
    var delta = Math.max(e.clientX-_rsx, e.clientY-_rsy);
    var ns    = Math.max(MIN_SIZE, Math.min(MAX_SIZE, _rsw+delta));
    magEl.style.width  = ns+'px';
    magEl.style.height = ns+'px';
    syncMagSize();
  });
  document.addEventListener('mouseup', function(){
    if(_resizing){ _resizing=false; syncMagSize(); }
  });

  // ── Touch drag (tablet / iPad) ───────────────
  var _tDragging=false, _tdx=0, _tdy=0;
  dragHandle.addEventListener('touchstart', function(e){
    e.stopPropagation();
    _tDragging=true;
    var r=magEl.getBoundingClientRect();
    _tdx=e.touches[0].clientX-r.left;
    _tdy=e.touches[0].clientY-r.top;
  },{passive:true});
  document.addEventListener('touchmove', function(e){
    if(!_tDragging) return;
    var t=e.touches[0], wrap=document.getElementById('panel-img');
    var wr=wrap.getBoundingClientRect(), s=parseInt(magEl.style.width)||160;
    var nx=Math.max(0,Math.min(t.clientX-wr.left-_tdx, wr.width-s));
    var ny=Math.max(0,Math.min(t.clientY-wr.top-_tdy,  wr.height-s));
    magEl.style.left=nx+'px'; magEl.style.top=ny+'px';
    magEl.style.right='auto'; magEl.style.bottom='auto';
  },{passive:true});
  document.addEventListener('touchend', function(){ _tDragging=false; });

  // Init
  magEl.style.width  = '160px';
  magEl.style.height = '160px';
  window._magR = 80;
  syncMagSize();
})();

// ── Theme toggle ─────────────────────────────
(function(){
  var btn = document.getElementById('theme-toggle');
  var html = document.documentElement;
  var SUN  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var MOON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var light = false;
  btn.innerHTML = SUN;
  btn.addEventListener('click', function(){
    light = !light;
    html.classList.toggle('light', light);
    btn.innerHTML = light ? MOON : SUN;
    btn.title = light ? 'Switch to dark mode' : 'Switch to light mode';
  });
})();

// ── TAB SWITCHER (tablet/phone ≤1024px) ──
var _activeTab = 'lm';

function switchTab(t){
  _activeTab = t;
  var panels = {
    lm:  document.getElementById('panel-lm'),
    img: document.getElementById('panel-img'),
    res: document.getElementById('panel-res')
  };
  var btns = {
    lm:  document.getElementById('tab-lm'),
    img: document.getElementById('tab-img'),
    res: document.getElementById('tab-res')
  };
  Object.keys(panels).forEach(function(k){
    panels[k].classList.toggle('tab-active', k === t);
    btns[k].classList.toggle('active', k === t);
  });
  // Re-init canvas when switching to image tab
  if(t === 'img') setTimeout(function(){ initCanvas(); drawImg(); renderOvl(); }, 40);
}

window.addEventListener('load', function(){
  if(window.innerWidth <= 1024) switchTab('lm');
});

window.addEventListener('resize', function(){
  if(window.innerWidth <= 1024){
    switchTab(_activeTab);
    if(imgEl){ resize(); fitImg(); drawImg(); renderOvl(); }
  }
});
