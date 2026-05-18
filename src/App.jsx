import { useState, useEffect, useRef } from "react";

// ─── GOOGLE FONTS ─────────────────────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

// ─── MOBILE HOOK + RESPONSIVE STYLES ──────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

// Viewport meta + global mobile CSS injected once
const MobileStyles = () => {
  useEffect(() => {
    // Ensure viewport is set correctly
    let meta = document.querySelector("meta[name=viewport]");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1";

    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      body { margin: 0; overflow-x: hidden; }
      input, select, textarea, button { font-size: 16px !important; } /* prevent iOS zoom */
      .rg-1 { grid-template-columns: 1fr !important; }
      .rg-2 { grid-template-columns: 1fr 1fr !important; }
      @media (max-width: 767px) {
        .rg-1, .rg-2, .rg-3, .rg-4 { grid-template-columns: 1fr !important; }
        .hide-mobile { display: none !important; }
        .show-mobile { display: flex !important; }
        .mobile-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .mobile-p { padding: 14px !important; }
        .mobile-gap { gap: 12px !important; }
        table { font-size: 12px !important; }
        td, th { padding: 8px 10px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

// ─── RESPONSIVE GRID ──────────────────────────────────────────────────────────
// Usage: <Grid cols={4}> → 4 on desktop, 2 on tablet, 1 on mobile
const Grid = ({ cols = 2, children, gap = 16 }) => {
  const isMobile = useIsMobile();
  const isTablet = !isMobile && window.innerWidth < 1024;
  const actual = isMobile ? 1 : isTablet && cols > 2 ? 2 : cols;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${actual}, 1fr)`, gap, marginBottom: 0 }}>
      {children}
    </div>
  );
};


const StageLogo = ({ size = 48 }) => (
  <img
    src="/logo.png"
    alt="S.T.A.G.E."
    style={{
      height: size,
      width: "auto",
      objectFit: "contain"
    }}
  />
);

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
// DOCS: cv et evaluations retirés → seulement protocole, journal, appreciation, rapport
// objectif: 120h

const DEMO_ENSEIGNANTS_INIT = [
  { id: "E1", nom: "Marie-Anne Bouchard", email: "m.bouchard@csrsaguenay.qc.ca", tel: "418-697-7442 poste 6201", programme: "DEP Vente-conseil", actif: true },
  { id: "E2", nom: "Jean-Pierre Lafleur", email: "jp.lafleur@csrsaguenay.qc.ca", tel: "418-697-7442 poste 6202", programme: "DEP Comptabilité", actif: true },
  { id: "E3", nom: "Lucie Hamel", email: "l.hamel@csrsaguenay.qc.ca", tel: "418-697-7442 poste 6203", programme: "DEP Secrétariat", actif: true },
  { id: "E4", nom: "Patrick Tremblay", email: "p.tremblay@csrsaguenay.qc.ca", tel: "418-697-7442 poste 6204", programme: "ASP Représentation", actif: false },
];

const DEMO_STUDENTS_INIT = [
  {
    id: 170987, nom: "Alex Tremblay", prenom: "Alex", groupe: "VC00001",
    programme: "DEP Vente-conseil 5321",
    milieu: "Sports Experts", adresseMilieu: "1234 Boul. Talbot, Chicoutimi (QC) G7H 5R8",
    superviseur: "Marc Bouchard", superviseurTel: "418-555-2345 poste 12", superviseurEmail: "marc.b@sportsexperts.ca",
    enseignantId: "E1", enseignant: "Marie-Anne Bouchard",
    protocole: "Signé", heures: 90, objectif: 120, joursCompletes: 12, joursTotal: 16,
    email: "alex.tremblay@eleve.csrsaguenay.qc.ca",
    docs: { protocole: true, journal: true, appreciation: true, rapport: false },
    presences: [
      { id: 1, date: "8 mai 2025", arrivee: "08:00", depart: "16:30", heures: 7.5, signe: true },
      { id: 2, date: "7 mai 2025", arrivee: "08:00", depart: "16:30", heures: 7.5, signe: true },
      { id: 3, date: "6 mai 2025", arrivee: "08:15", depart: "16:45", heures: 7.5, signe: true },
      { id: 4, date: "5 mai 2025", arrivee: "08:00", depart: "16:30", heures: 7.5, signe: true },
      { id: 5, date: "2 mai 2025", arrivee: "08:00", depart: "16:00", heures: 7.0, signe: true },
    ],
    journal: [
      { id: 1, date: "8 mai 2025", titre: "Journée en vente active", contenu: "Aujourd'hui j'ai géré le département seul pendant 2h. J'ai conclu 3 ventes importantes dont une raquette de tennis à 280$." },
      { id: 2, date: "7 mai 2025", titre: "Formation produits", contenu: "Formation sur les nouvelles arrivées de chaussures de course. Très enrichissant, je connais maintenant toute la gamme Nike et Adidas." },
      { id: 3, date: "6 mai 2025", titre: "Service à la clientèle difficile", contenu: "Gestion d'une plainte client. Marc m'a aidé à trouver une solution. J'ai appris l'importance de l'écoute active." },
    ],
  },
  { id: 170988, nom: "Jacob Laroche", prenom: "Jacob", groupe: "VC00001", programme: "DEP Vente-conseil 5321", milieu: "Best Buy", adresseMilieu: "2345 Boul. du Royaume, Jonquière (QC) G7S 4R9", superviseur: "Sophie Martin", superviseurTel: "418-555-8821", superviseurEmail: "sophie.m@bestbuy.ca", enseignantId: "E1", enseignant: "Marie-Anne Bouchard", protocole: "En attente", heures: 52, objectif: 120, joursCompletes: 7, joursTotal: 16, email: "jacob.laroche@eleve.csrsaguenay.qc.ca", docs: { protocole: false, journal: false, appreciation: false, rapport: false }, presences: [], journal: [] },
  { id: 170989, nom: "Élizabeth Roy", prenom: "Élizabeth", groupe: "VC00001", programme: "DEP Vente-conseil 5321", milieu: "Walmart", adresseMilieu: "3456 Boul. Talbot, Chicoutimi (QC) G7H 2T7", superviseur: "Martin Dufour", superviseurTel: "418-555-3456", superviseurEmail: "m.dufour@walmart.ca", enseignantId: "E1", enseignant: "Marie-Anne Bouchard", protocole: "Signé", heures: 68, objectif: 120, joursCompletes: 9, joursTotal: 16, email: "elizabeth.roy@eleve.csrsaguenay.qc.ca", docs: { protocole: true, journal: false, appreciation: false, rapport: false }, presences: [], journal: [] },
  { id: 170990, nom: "Émile Gagnon", prenom: "Émile", groupe: "VC00002", programme: "DEP Vente-conseil 5321", milieu: "Canadian Tire", adresseMilieu: "567 Rue Victoria, La Baie (QC) G7B 3M3", superviseur: "Julie Fortin", superviseurTel: "418-555-7890", superviseurEmail: "julie.f@canadiantire.ca", enseignantId: "E1", enseignant: "Marie-Anne Bouchard", protocole: "En attente", heures: 30, objectif: 120, joursCompletes: 4, joursTotal: 16, email: "emile.gagnon@eleve.csrsaguenay.qc.ca", docs: { protocole: false, journal: false, appreciation: false, rapport: false }, presences: [], journal: [] },
  { id: 170991, nom: "Sarah Bergeron", prenom: "Sarah", groupe: "VC00002", programme: "DEP Vente-conseil 5321", milieu: "L'Équipeur", adresseMilieu: "678 Rue Collard, Alma (QC) G8B 1N1", superviseur: "David Simoneau", superviseurTel: "418-555-6543", superviseurEmail: "d.simoneau@equipeur.ca", enseignantId: "E1", enseignant: "Marie-Anne Bouchard", protocole: "Signé", heures: 105, objectif: 120, joursCompletes: 14, joursTotal: 16, email: "sarah.bergeron@eleve.csrsaguenay.qc.ca", docs: { protocole: true, journal: true, appreciation: false, rapport: false }, presences: [], journal: [] },
  { id: 170992, nom: "Laurie Simard", prenom: "Laurie", groupe: "CPT00001", programme: "DEP Comptabilité 5231", milieu: "Raymond Chabot Grant Thornton", adresseMilieu: "100 Rue Racine E, Chicoutimi (QC) G7H 1R3", superviseur: "Isabelle Côté", superviseurTel: "418-555-4321", superviseurEmail: "i.cote@rcgt.com", enseignantId: "E2", enseignant: "Jean-Pierre Lafleur", protocole: "Signé", heures: 115, objectif: 120, joursCompletes: 15, joursTotal: 16, email: "laurie.simard@eleve.csrsaguenay.qc.ca", docs: { protocole: true, journal: true, appreciation: true, rapport: false }, presences: [], journal: [] },
  { id: 170993, nom: "Mathieu Boulet", prenom: "Mathieu", groupe: "SEC00001", programme: "DEP Secrétariat 5357", milieu: "Ville de Saguenay", adresseMilieu: "201 Rue Racine E, Chicoutimi (QC) G7H 1S4", superviseur: "Caroline Lavoie", superviseurTel: "418-697-7474", superviseurEmail: "c.lavoie@ville.qc.ca", enseignantId: "E3", enseignant: "Lucie Hamel", protocole: "Signé", heures: 48, objectif: 120, joursCompletes: 6, joursTotal: 16, email: "mathieu.boulet@eleve.csrsaguenay.qc.ca", docs: { protocole: true, journal: false, appreciation: false, rapport: false }, presences: [], journal: [] },
];

const DEMO_GROUPS_INIT = [
  { id: "VC00001", nom: "Vente-Conseil 5321", programme: "DEP Vente-conseil", enseignantId: "E1", enseignant: "Marie-Anne Bouchard", description: "Groupe printemps 2025 — lundi au vendredi" },
  { id: "VC00002", nom: "Vente-Conseil 5321 B", programme: "DEP Vente-conseil", enseignantId: "E1", enseignant: "Marie-Anne Bouchard", description: "Groupe soir — printemps 2025" },
  { id: "CPT00001", nom: "Comptabilité 5231", programme: "DEP Comptabilité", enseignantId: "E2", enseignant: "Jean-Pierre Lafleur", description: "Groupe comptabilité — printemps 2025" },
  { id: "SEC00001", nom: "Secrétariat 5357", programme: "DEP Secrétariat", enseignantId: "E3", enseignant: "Lucie Hamel", description: "Groupe secrétariat — printemps 2025" },
];

const DEMO_MESSAGES_INIT = [
  { id: 1, de: "Marc Bouchard", sujet: "Appréciation complétée — Alex Tremblay", date: "8 mai 2025", lu: false, corps: "Bonjour, j'ai complété la fiche d'appréciation pour Alex Tremblay. Il fait un excellent travail et je serais prêt à l'embaucher à temps partiel cet été!" },
  { id: 2, de: "Système S.T.A.G.E.", sujet: "Rappel : Journal de bord manquant", date: "7 mai 2025", lu: true, corps: "Le journal de bord de Jacob Laroche n'a pas été soumis depuis 5 jours. Veuillez en aviser l'élève." },
  { id: 3, de: "Sophie Martin", sujet: "Question sur le protocole", date: "5 mai 2025", lu: true, corps: "Bonjour, j'ai une question concernant la section 3 du protocole. Est-ce que l'horaire peut être modifié si l'élève a un rendez-vous médical? Pouvez-vous me rappeler au 418-555-8821?" },
  { id: 4, de: "Direction CFP", sujet: "Réunion d'équipe — 15 mai 2025", date: "3 mai 2025", lu: true, corps: "Rappel : réunion d'équipe le 15 mai à 14h00 en salle A-204. L'ordre du jour inclut le bilan mi-session et la planification des visites de stage." },
];

const APPRECI_CRITERES = [
  { id: 1, cat: "Attitude professionnelle", label: "La stagiaire respecte les horaires établis" },
  { id: 2, cat: "Attitude professionnelle", label: "La stagiaire adopte une tenue vestimentaire appropriée" },
  { id: 3, cat: "Motivation", label: "La stagiaire démontre un réel intérêt pour son travail" },
  { id: 4, cat: "Motivation", label: "La stagiaire effectue ses tâches avec enthousiasme" },
  { id: 5, cat: "Sens de l'initiative", label: "La stagiaire prend des initiatives dans le cadre de son travail" },
  { id: 6, cat: "Qualité du travail", label: "Le travail fourni est soigné et précis" },
  { id: 7, cat: "Qualité du travail", label: "La stagiaire respecte les délais fixés" },
  { id: 8, cat: "Relation avec la clientèle", label: "La stagiaire accueille la clientèle avec professionnalisme" },
  { id: 9, cat: "Travail d'équipe", label: "La stagiaire s'intègre bien dans l'équipe de travail" },
  { id: 10, cat: "Autonomie", label: "La stagiaire peut accomplir les tâches sans supervision constante" },
];

const FREQ_OPTIONS = ["Rarement", "Occasionnellement", "Souvent", "En tout temps"];
const DOC_LABELS = { protocole: "Protocole signé", journal: "Journal de bord", appreciation: "Appréciation superviseur", rapport: "Rapport final" };
const DOC_ICONS  = { protocole: "📋", journal: "📔", appreciation: "⭐", rapport: "📑" };

// ─── UTILS ────────────────────────────────────────────────────────────────────
const pct = (v, t) => Math.round((v / t) * 100);
const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
const fmtDate = () => new Date().toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" });
const initials = (nom) => nom.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
const allDocsDone = (docs) => Object.values(docs).every(Boolean);

const C = {
  navy: "#0f172a", navyMid: "#1e293b",
  blue: "#1e40af", blueMid: "#2563eb", blueLight: "#dbeafe",
  green: "#16a34a", greenLight: "#dcfce7",
  amber: "#d97706", amberLight: "#fef3c7",
  red: "#dc2626", redLight: "#fee2e2",
  purple: "#7c3aed", purpleLight: "#ede9fe",
  teal: "#0d9488", tealLight: "#ccfbf1",
  g50: "#f9fafb", g100: "#f3f4f6", g200: "#e5e7eb",
  g400: "#9ca3af", g600: "#6b7280", g800: "#374151", g900: "#111827",
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
let _toastCb = null;
const toast = (msg, type = "success") => _toastCb?.(msg, type);

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { _toastCb = (msg, type) => { const id = Date.now(); setToasts(t => [...t, { id, msg, type }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500); }; }, []);
  const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
  const colors = { success: C.green, error: C.red, warning: C.amber, info: C.blue };
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, fontFamily: "DM Sans, sans-serif" }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background: "#fff", border: `1.5px solid ${colors[t.type]}30`, borderLeft: `4px solid ${colors[t.type]}`, borderRadius: 12, padding: "12px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", gap: 10, alignItems: "center", minWidth: 280, animation: "slideIn 0.3s ease" }}>
          <span style={{ fontSize: 18 }}>{icons[t.type]}</span>
          <span style={{ fontSize: 14, color: C.g800, fontWeight: 500 }}>{t.msg}</span>
        </div>
      ))}
      <style>{`@keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = { "Signé": [C.greenLight, C.green], "Complété": [C.greenLight, C.green], "Actif": [C.greenLight, C.green], "En attente": [C.amberLight, C.amber], "Inactif": [C.redLight, C.red] };
  const [bg, fg] = map[status] || [C.g100, C.g600];
  return <span style={{ background: bg, color: fg, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{status}</span>;
};

const ProgressRing = ({ value, max, size = 80, stroke = 10, color = C.blue }) => {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, p = clamp(value / max, 0, 1);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.g200} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${p*circ} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease" }} />
    </svg>
  );
};

const ProgressBar = ({ value, max, color = C.blue, height = 7 }) => (
  <div style={{ background: C.g200, borderRadius: 99, height, overflow: "hidden" }}>
    <div style={{ width: `${clamp(pct(value, max), 0, 100)}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.7s ease" }} />
  </div>
);

const Avatar = ({ name, size = 36, color = C.blue }) => (
  <div style={{ width: size, height: size, borderRadius: size/4, background: color+"20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size*0.35, color, flexShrink: 0, fontFamily: "DM Mono, monospace" }}>{initials(name)}</div>
);

const SidebarItem = ({ icon, label, active, onClick, badge }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 10, background: active ? C.blue : "transparent", color: active ? "#fff" : "#94a3b8", cursor: "pointer", fontSize: 13.5, fontWeight: active ? 600 : 400, margin: "1px 8px", transition: "all 0.15s" }}
    onMouseEnter={e => !active && (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
    onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}>
    <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {badge > 0 && <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10, minWidth: 18, textAlign: "center" }}>{badge}</span>}
  </div>
);

const Card = ({ children, padding = "20px", style = {} }) => (
  <div style={{ background: "#fff", border: `1px solid ${C.g200}`, borderRadius: 14, padding, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", ...style }}>{children}</div>
);

const StatCard = ({ label, value, sub, icon, color = C.blue, onClick }) => (
  <div onClick={onClick} style={{ background: "#fff", border: `1px solid ${C.g200}`, borderRadius: 14, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start", cursor: onClick ? "pointer" : "default", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: color+"18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: C.g900, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12, color: C.g600, marginTop: 3, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color, marginTop: 3, fontWeight: 600 }}>{sub}</div>}
    </div>
  </div>
);

const Modal = ({ open, onClose, title, children, wide }) => {
  const isMobile = useIsMobile();
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 1000, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 20, fontFamily: "DM Sans, sans-serif" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: isMobile ? "18px 18px 0 0" : 18, padding: isMobile ? "20px 16px 32px" : 28, width: "100%", maxWidth: isMobile ? "100%" : wide ? 780 : 540, maxHeight: isMobile ? "92vh" : "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}>
        {isMobile && <div style={{ width: 40, height: 4, borderRadius: 2, background: C.g200, margin: "0 auto 18px" }} />}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 800, fontSize: isMobile ? 16 : 18, color: C.g900 }}>{title}</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: C.g100, border: "none", cursor: "pointer", fontSize: 16, color: C.g600 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled, fullWidth, icon }) => {
  const styles = { primary: { bg: C.blue, color: "#fff" }, secondary: { bg: C.g100, color: C.g800 }, danger: { bg: C.redLight, color: C.red }, success: { bg: C.greenLight, color: C.green }, outline: { bg: "transparent", color: C.blue, border: `1.5px solid ${C.blue}` }, ghost: { bg: "transparent", color: C.g600 }, teal: { bg: C.tealLight, color: C.teal } };
  const sizes = { sm: "8px 14px", md: "11px 18px", lg: "14px 28px" };
  const fontSizes = { sm: 13, md: 14, lg: 15 };
  const s = styles[variant] || styles.primary;
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{ padding: sizes[size], background: disabled ? C.g100 : s.bg, color: disabled ? C.g400 : s.color, border: s.border || "none", borderRadius: 9, fontWeight: 600, fontSize: fontSizes[size], cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s", width: fullWidth ? "100%" : undefined, display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center", fontFamily: "DM Sans, sans-serif", minHeight: 40, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
      {icon && <span style={{ fontSize: fontSizes[size] + 2 }}>{icon}</span>}{children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, required, disabled }) => (
  <div>
    {label && <div style={{ fontSize: 12, fontWeight: 600, color: C.g600, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}{required && <span style={{ color: C.red }}> *</span>}</div>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${C.g200}`, borderRadius: 9, fontSize: 16, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box", color: C.g900, background: disabled ? C.g50 : "#fff", WebkitAppearance: "none" }} />
  </div>
);

const Select = ({ label, value, onChange, options, placeholder, disabled }) => (
  <div>
    {label && <div style={{ fontSize: 12, fontWeight: 600, color: C.g600, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>}
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${C.g200}`, borderRadius: 9, fontSize: 16, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box", color: C.g900, background: disabled ? C.g50 : "#fff", WebkitAppearance: "none", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

const Textarea = ({ label, value, onChange, rows = 4, placeholder }) => (
  <div>
    {label && <div style={{ fontSize: 12, fontWeight: 600, color: C.g600, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>}
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
      style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${C.g200}`, borderRadius: 9, fontSize: 16, fontFamily: "DM Sans, sans-serif", resize: "vertical", boxSizing: "border-box", color: C.g900 }} />
  </div>
);

const Table = ({ cols, rows, emptyMsg = "Aucune donnée" }) => (
  <div style={{ background: "#fff", border: `1px solid ${C.g200}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 420 }}>
        <thead>
          <tr style={{ background: C.g50 }}>
            {cols.map((c, i) => <th key={i} style={{ padding: "11px 16px", textAlign: "left", color: C.g400, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.g200}`, whiteSpace: "nowrap" }}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={cols.length} style={{ padding: "32px 16px", textAlign: "center", color: C.g400, fontSize: 14 }}>{emptyMsg}</td></tr>
            : rows.map((row, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.g50}` }}
                onMouseEnter={e => e.currentTarget.style.background = C.g50}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {cols.map((c, j) => <td key={j} style={{ padding: "11px 16px", color: C.g800 }}>{c.render ? c.render(row) : row[c.key]}</td>)}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SectionHeader = ({ title, action }) => {
  const isMobile = useIsMobile();
  return (
    <div style={{ display: "flex", flexDirection: isMobile && action ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 18, gap: isMobile ? 10 : 0 }}>
      <h2 style={{ margin: 0, fontSize: isMobile ? 17 : 20, fontWeight: 800, color: C.g900 }}>{title}</h2>
      {action && <div>{action}</div>}
    </div>
  );
};

const MiniBarChart = ({ data, labelKey, valueKey, color = C.blue, height = 140 }) => {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <div style={{ fontSize: 11, color: C.g600, fontWeight: 600 }}>{d[valueKey]}</div>
          <div style={{ width: "100%", background: color, borderRadius: "6px 6px 0 0", height: `${(d[valueKey] / max) * (height - 40)}px`, transition: "height 0.8s ease", minHeight: 4 }} />
          <div style={{ fontSize: 10, color: C.g400, whiteSpace: "nowrap", textAlign: "center" }}>{d[labelKey]}</div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ segments, size = 120, stroke = 18 }) => {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0);
  let offset = 0;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.g100} strokeWidth={stroke} />
      {segments.map((s, i) => { const dash = (s.value / total) * circ; const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth={stroke} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} />; offset += dash; return el; })}
    </svg>
  );
};

// Signature Canvas
const SignatureCanvas = ({ onSigned }) => {
  const ref = useRef(null);
  const [drawing, setDrawing] = useState(false), [signed, setSigned] = useState(false), [last, setLast] = useState(null);
  const pos = (e) => { const r = ref.current.getBoundingClientRect(), t = e.touches?.[0] ?? e; return { x: t.clientX - r.left, y: t.clientY - r.top }; };
  const start = (e) => { e.preventDefault(); setDrawing(true); setLast(pos(e)); };
  const stop = () => { setDrawing(false); setLast(null); };
  const draw = (e) => {
    if (!drawing) return; e.preventDefault();
    const ctx = ref.current.getContext("2d"), p = pos(e);
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = C.navy; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();
    setLast(p); setSigned(true);
  };
  const clear = () => { ref.current.getContext("2d").clearRect(0, 0, 300, 100); setSigned(false); };
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.g600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Signature numérique</div>
      <div style={{ border: `2px dashed ${C.g200}`, borderRadius: 10, position: "relative", background: C.g50 }}>
        <canvas ref={ref} width={300} height={100} style={{ display: "block", cursor: "crosshair", touchAction: "none" }}
          onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop} />
        {!signed && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: C.g400, fontSize: 13, pointerEvents: "none" }}>Signez ici ✍️</div>}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Btn variant="ghost" size="sm" onClick={clear}>Effacer</Btn>
        {signed && <Btn variant="success" size="sm" onClick={() => { onSigned?.(); toast("Signature enregistrée !"); }}>✅ Confirmer</Btn>}
      </div>
    </div>
  );
};

// Notification Dropdown
const NotifDropdown = ({ notifs, open }) => {
  if (!open) return null;
  return (
    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320, background: "#fff", border: `1px solid ${C.g200}`, borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", zIndex: 999 }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.g100}`, fontWeight: 700, fontSize: 14 }}>Notifications</div>
      {notifs.map((n, i) => (
        <div key={i} style={{ padding: "12px 18px", borderBottom: `1px solid ${C.g50}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: n.read ? C.g200 : C.blue, marginTop: 5, flexShrink: 0 }} />
          <div><div style={{ fontSize: 13, color: C.g900, fontWeight: n.read ? 400 : 600 }}>{n.texte}</div><div style={{ fontSize: 11, color: C.g400, marginTop: 2 }}>{n.time}</div></div>
        </div>
      ))}
    </div>
  );
};

// ─── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
const BottomNav = ({ pages, activePage, setActivePage }) => {
  // Show max 5 most important pages in bottom nav
  const mainPages = pages.slice(0, 5);
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${C.g200}`, display: "flex", zIndex: 900, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {mainPages.map(p => (
        <div key={p.id} onClick={() => setActivePage(p.id)}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 4px", cursor: "pointer", position: "relative", background: activePage === p.id ? C.blueLight : "transparent" }}>
          <div style={{ fontSize: 22, lineHeight: 1 }}>{p.icon}</div>
          <div style={{ fontSize: 9, fontWeight: activePage === p.id ? 700 : 400, color: activePage === p.id ? C.blue : C.g400, marginTop: 3, textAlign: "center", maxWidth: 56, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.label}</div>
          {p.badge > 0 && <span style={{ position: "absolute", top: 4, right: "50%", transform: "translateX(14px)", background: C.red, color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 10, minWidth: 16, textAlign: "center" }}>{p.badge}</span>}
        </div>
      ))}
    </div>
  );
};

// ─── MOBILE DRAWER (slide-in sidebar) ─────────────────────────────────────────
const MobileDrawer = ({ open, onClose, pages, activePage, setActivePage, role, onLogout }) => {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1100 }} />
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 280, background: C.navy, zIndex: 1101, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <StageLogo size={28} showText={true} dark={true} />
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#94a3b8", fontSize: 20, width: 34, height: 34, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ fontSize: 11, color: "#475569", padding: "8px 18px 4px" }}>Vue {role}</div>
        <div style={{ flex: 1, paddingTop: 6 }}>
          {pages.map(p => (
            <div key={p.id} onClick={() => { setActivePage(p.id); onClose(); }}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", background: activePage === p.id ? C.blue : "transparent", color: activePage === p.id ? "#fff" : "#94a3b8", cursor: "pointer", fontSize: 15, fontWeight: activePage === p.id ? 600 : 400 }}>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <span style={{ flex: 1 }}>{p.label}</span>
              {p.badge > 0 && <span style={{ background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{p.badge}</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div onClick={() => { onLogout(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b", fontSize: 14, cursor: "pointer", padding: "10px 16px", borderRadius: 8 }}>
            <span>🚪</span><span>Déconnexion</span>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── SHELL (desktop sidebar + mobile hamburger + bottom nav) ──────────────────
const Shell = ({ role, pages, activePage, setActivePage, onLogout, children, title, subtitle, notifs = [], headerActions }) => {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "DM Sans, sans-serif", background: C.g50 }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <div style={{ width: 230, background: C.navy, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "16px 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <StageLogo size={32} showText={true} dark={true} />
            <div style={{ color: "#475569", fontSize: 11, marginTop: 6, paddingLeft: 2 }}>Vue {role}</div>
          </div>
          <div style={{ flex: 1, paddingTop: 10, overflowY: "auto" }}>
            {pages.map(p => <SidebarItem key={p.id} icon={p.icon} label={p.label} active={activePage === p.id} onClick={() => setActivePage(p.id)} badge={p.badge} />)}
          </div>
          <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569", fontSize: 13, cursor: "pointer", padding: "8px 14px", borderRadius: 8 }}>← Déconnexion</div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {isMobile && <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pages={pages} activePage={activePage} setActivePage={setActivePage} role={role} onLogout={onLogout} />}

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${C.g200}`, padding: isMobile ? "0 14px" : "0 28px", height: isMobile ? 56 : 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 0 }}>
            {isMobile && (
              <button onClick={() => setDrawerOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.navy, padding: "4px 4px", display: "flex", alignItems: "center" }}>☰</button>
            )}
            <div>
              <div style={{ fontWeight: 800, fontSize: isMobile ? 15 : 17, color: C.g900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: isMobile ? 180 : 400 }}>{title}</div>
              {!isMobile && subtitle && <div style={{ fontSize: 12, color: C.g400, marginTop: 1 }}>{subtitle}</div>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!isMobile && headerActions}
            <div style={{ position: "relative" }}>
              <div onClick={() => setNotifOpen(!notifOpen)} style={{ width: 36, height: 36, borderRadius: 9, background: C.g100, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 17, position: "relative" }}>
                🔔{unread > 0 && <span style={{ position: "absolute", top: 3, right: 3, width: 9, height: 9, background: C.red, borderRadius: 5, border: "2px solid #fff" }} />}
              </div>
              <NotifDropdown notifs={notifs} open={notifOpen} />
            </div>
          </div>
        </div>

        {/* Mobile header actions (below title bar) */}
        {isMobile && headerActions && (
          <div style={{ background: "#fff", borderBottom: `1px solid ${C.g100}`, padding: "8px 14px", display: "flex", gap: 8, overflowX: "auto" }}>
            {headerActions}
          </div>
        )}

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? 14 : 28, paddingBottom: isMobile ? 80 : 28 }}>
          {children}
        </div>

        {/* Mobile bottom nav */}
        {isMobile && <BottomNav pages={pages} activePage={activePage} setActivePage={setActivePage} />}
      </div>
    </div>
  );
};


// Messages view (shared)
function MessagesView({ messages, setMessages }) {
  const isMobile = useIsMobile();
  const [sel, setSel] = useState(null);
  const [comp, setComp] = useState(false);
  const [draft, setDraft] = useState({ to: "", sujet: "", corps: "" });
  const markRead = (id) => setMessages(prev => prev.map(m => m.id === id ? { ...m, lu: true } : m));
  const send = () => { if (!draft.corps) return; toast("Message envoyé !"); setComp(false); setDraft({ to: "", sujet: "", corps: "" }); };
  // On mobile: show list OR detail, not both
  const showList = !sel || !isMobile;
  const showDetail = !!sel;
  return (
    <div style={{ display: sel && !isMobile ? "grid" : "block", gridTemplateColumns: "300px 1fr", gap: 20 }}>
      {showList && (
        <div>
          <SectionHeader title="Messages" action={<Btn icon="✏️" onClick={() => setComp(true)}>Nouveau</Btn>} />
          {messages.map(m => (
            <div key={m.id} onClick={() => { setSel(m); markRead(m.id); }}
              style={{ background: "#fff", border: `1px solid ${!m.lu ? C.blue+"40" : C.g200}`, borderLeft: `3px solid ${!m.lu ? C.blue : C.g200}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <Avatar name={m.de} size={32} color={C.blue} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: !m.lu ? 700 : 500, fontSize: 13 }}>{m.de}</div>
                  <div style={{ fontSize: 11, color: C.g400 }}>{m.date}</div>
                </div>
                {!m.lu && <div style={{ width: 8, height: 8, borderRadius: 4, background: C.blue, flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 13, fontWeight: !m.lu ? 600 : 400, marginBottom: 3 }}>{m.sujet}</div>
              <div style={{ fontSize: 12, color: C.g400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.corps.slice(0, 60)}…</div>
            </div>
          ))}
        </div>
      )}
      {showDetail && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <div><div style={{ fontWeight: 800, fontSize: 18 }}>{sel.sujet}</div><div style={{ fontSize: 13, color: C.g600, marginTop: 4 }}>De : <strong>{sel.de}</strong> · {sel.date}</div></div>
            <Btn variant="ghost" size="sm" onClick={() => setSel(null)}>{isMobile ? "← Liste" : "✕"}</Btn>
          </div>
          <div style={{ padding: "18px 0", borderTop: `1px solid ${C.g100}`, borderBottom: `1px solid ${C.g100}`, fontSize: 14, color: C.g800, lineHeight: 1.75, marginBottom: 18 }}>{sel.corps}</div>
          <div style={{ display: "flex", gap: 10 }}><Btn icon="↩️" onClick={() => setComp(true)}>Répondre</Btn><Btn variant="secondary" icon="↪️">Transférer</Btn></div>
        </Card>
      )}
      <Modal open={comp} onClose={() => setComp(false)} title="Nouveau message">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="À" value={draft.to} onChange={v => setDraft({ ...draft, to: v })} placeholder="Destinataire" />
          <Input label="Sujet" value={draft.sujet} onChange={v => setDraft({ ...draft, sujet: v })} placeholder="Objet du message" />
          <Textarea label="Message" value={draft.corps} onChange={v => setDraft({ ...draft, corps: v })} rows={5} placeholder="Rédigez votre message..." />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setComp(false)}>Annuler</Btn>
            <Btn icon="📤" onClick={send} disabled={!draft.corps}>Envoyer</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── STUDENT VIEW ─────────────────────────────────────────────────────────────
function StudentView({ onLogout }) {
  const [student] = useState(DEMO_STUDENTS_INIT[0]);
  const [activePage, setActivePage] = useState("tableau");
  const [messages, setMessages] = useState(DEMO_MESSAGES_INIT);
  const [journal, setJournal] = useState(student.journal);
  const [newEntry, setNewEntry] = useState({ titre: "", contenu: "" });
  const [showForm, setShowForm] = useState(false);

  const docsOk = Object.values(student.docs).filter(Boolean).length;
  const docsTotal = Object.keys(student.docs).length;
  const heuresRestantes = student.objectif - student.heures;
  const progress = pct(student.heures, student.objectif);

  const addJournal = () => {
    if (!newEntry.titre || !newEntry.contenu) return;
    setJournal([{ id: Date.now(), date: fmtDate(), ...newEntry }, ...journal]);
    setNewEntry({ titre: "", contenu: "" }); setShowForm(false);
    toast("Entrée ajoutée au journal !");
  };

  const pages = [
    { id: "tableau", label: "Tableau de bord", icon: "🏠" },
    { id: "calendrier", label: "Mon calendrier", icon: "📅" },
    { id: "heures", label: "Mes heures", icon: "⏱️" },
    { id: "journal", label: "Journal de bord", icon: "📔" },
    { id: "documents", label: "Mes documents", icon: "📁" },
    { id: "messages", label: "Messages", icon: "💬", badge: messages.filter(m => !m.lu).length },
    { id: "profil", label: "Mon profil", icon: "👤" },
  ];

  const notifs = [
    { texte: "Appréciation complétée par Marc Bouchard", time: "Il y a 2h", read: false },
    { texte: "Rappel : Rapport final en attente", time: "Hier", read: false },
    { texte: "Journal de bord déposé avec succès", time: "8 mai", read: true },
  ];

  const calEvents = [5,6,7,8,9,12,13,14,15,16,19,20,21,22,23,26,27].map(d => ({ day: d, type: d === 22 ? "tripartite" : d === 27 ? "today" : "stage" }));
  const typeStyle = { stage: { bg: C.blueLight, color: C.blue }, tripartite: { bg: C.amberLight, color: C.amber }, today: { bg: C.blue, color: "#fff" } };

  return (
    <Shell role="Élève" pages={pages} activePage={activePage} setActivePage={setActivePage} onLogout={onLogout}
      title={`Bonjour, ${student.prenom} 👋`} subtitle="Aperçu de votre stage" notifs={notifs}>

      {activePage === "tableau" && (
        <div>
          {/* Alerte entrée manquante — rouge encadré */}
          <div style={{ background: C.redLight, border: `2px solid ${C.red}`, borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>🔴</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.red, fontSize: 13 }}>Entrée de présence manquante — 27 mai 2025</div>
              <div style={{ fontSize: 12, color: C.g800, marginTop: 2 }}>Votre superviseur n'a pas encore enregistré votre présence pour aujourd'hui. Contactez-le si vous avez travaillé : <strong>{student.superviseurTel}</strong></div>
            </div>
            <Btn size="sm" variant="danger" onClick={() => setActivePage("heures")}>Voir mes heures</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard label="Progression" value={`${progress} %`} sub={`Objectif : ${student.objectif} h`} icon="📈" color={C.green} />
            <StatCard label="Jours complétés" value={`${student.joursCompletes}/${student.joursTotal}`} sub="journées de stage" icon="📅" color={C.purple} />
            <StatCard label="Documents" value={`${docsOk}/${docsTotal}`} sub={docsOk === docsTotal ? "Tous complétés ✅" : `${docsTotal - docsOk} en attente`} icon="📁" color={C.amber} onClick={() => setActivePage("documents")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Progression du stage</div>
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 16 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <ProgressRing value={student.heures} max={student.objectif} size={88} color={progress >= 75 ? C.green : C.blue} />
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.g900 }}>{progress}%</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 30, fontWeight: 900, color: C.blue }}>{student.heures} h</div>
                  <div style={{ color: C.g400, fontSize: 13, marginBottom: 8 }}>sur {student.objectif} h au total</div>
                  <ProgressBar value={student.heures} max={student.objectif} color={progress >= 75 ? C.green : C.blue} height={8} />
                  <div style={{ fontSize: 12, color: C.green, marginTop: 6, fontWeight: 600 }}>Il reste {heuresRestantes} heures à compléter</div>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Activités récentes</div>
              {[
                { icon: "📝", texte: "Entrée de stage ajoutée", date: "8 mai 2025", color: C.blueLight },
                { icon: "📔", texte: "Journal de bord mis à jour", date: "6 mai 2025", color: C.greenLight },
                { icon: "⭐", texte: "Appréciation reçue du superviseur", date: "4 mai 2025", color: "#fef9c3" },
                { icon: "✅", texte: "Protocole signé", date: "2 mai 2025", color: C.purpleLight },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.g50}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                  <div><div style={{ fontSize: 13, fontWeight: 500 }}>{a.texte}</div><div style={{ fontSize: 11, color: C.g400 }}>{a.date}</div></div>
                </div>
              ))}
            </Card>
          </div>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Documents requis</div>
              <Btn variant="outline" size="sm" onClick={() => setActivePage("documents")}>Gérer →</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {Object.keys(student.docs).map(key => (
                <div key={key} style={{ textAlign: "center", padding: "14px 8px", background: student.docs[key] ? C.greenLight : C.g50, border: `1px solid ${student.docs[key] ? "#86efac" : C.g200}`, borderRadius: 12 }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{DOC_ICONS[key]}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: student.docs[key] ? C.green : C.g600, marginBottom: 4 }}>{DOC_LABELS[key]}</div>
                  <Badge status={student.docs[key] ? "Complété" : "En attente"} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activePage === "heures" && (
        <div>
          <SectionHeader title="Mes heures de stage" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard label="Total cumulé" value={`${student.heures} h`} sub={`/${student.objectif} h`} icon="⏱️" color={C.blue} />
            <StatCard label="Cette semaine" value="16 h" icon="📅" color={C.green} />
            <StatCard label="Restantes" value={`${heuresRestantes} h`} icon="🎯" color={C.amber} />
            <StatCard label="Progression" value={`${progress}%`} icon="📊" color={C.purple} />
          </div>
          {/* Alerte entrée manquante */}
          <div style={{ background: C.redLight, border: `2px solid ${C.red}`, borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>🔴</span>
            <div>
              <div style={{ fontWeight: 700, color: C.red, fontSize: 14 }}>Entrée de présence manquante</div>
              <div style={{ fontSize: 13, color: C.g800, marginTop: 3 }}>
                Il manque une entrée pour <strong>aujourd'hui (27 mai 2025)</strong>. Votre superviseur doit ajouter votre présence dans la plateforme pour que votre journée soit comptabilisée.
              </div>
              <div style={{ fontSize: 12, color: C.g600, marginTop: 6 }}>Si vous avez travaillé aujourd'hui et que votre entrée est absente, contactez votre superviseur : <strong>{student.superviseurTel}</strong></div>
            </div>
          </div>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Historique des présences</div>
            <Table cols={[
              { label: "Date", key: "date" },
              { label: "Arrivée", key: "arrivee" },
              { label: "Départ", key: "depart" },
              { label: "Heures", render: r => <strong style={{ color: C.blue }}>{r.heures} h</strong> },
              { label: "Statut", render: r => <Badge status={r.signe ? "Signé" : "En attente"} /> },
            ]} rows={student.presences} emptyMsg="Aucune présence enregistrée" />
          </Card>
        </div>
      )}

      {activePage === "journal" && (
        <div>
          <SectionHeader title="Journal de bord" action={<Btn icon="✏️" onClick={() => setShowForm(true)}>Nouvelle entrée</Btn>} />
          <Modal open={showForm} onClose={() => setShowForm(false)} title="Ajouter une entrée">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Titre" value={newEntry.titre} onChange={v => setNewEntry({ ...newEntry, titre: v })} placeholder="Titre de votre journée" required />
              <Textarea label="Contenu" value={newEntry.contenu} onChange={v => setNewEntry({ ...newEntry, contenu: v })} rows={6} placeholder="Décrivez votre journée, apprentissages, défis..." />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={() => setShowForm(false)}>Annuler</Btn>
                <Btn icon="💾" onClick={addJournal} disabled={!newEntry.titre || !newEntry.contenu}>Enregistrer</Btn>
              </div>
            </div>
          </Modal>
          {journal.length === 0
            ? <Card><div style={{ textAlign: "center", padding: "40px 20px", color: C.g400 }}><div style={{ fontSize: 48, marginBottom: 12 }}>📔</div>Aucune entrée. Commencez par en créer une !</div></Card>
            : journal.map(e => (
              <Card key={e.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div><div style={{ fontWeight: 700, fontSize: 16 }}>{e.titre}</div><div style={{ fontSize: 12, color: C.g400, marginTop: 2 }}>📅 {e.date}</div></div>
                  <Btn variant="ghost" size="sm" icon="✏️">Modifier</Btn>
                </div>
                <div style={{ fontSize: 14, color: C.g800, lineHeight: 1.7, padding: "12px 0", borderTop: `1px solid ${C.g100}` }}>{e.contenu}</div>
              </Card>
            ))}
        </div>
      )}

      {activePage === "documents" && (
        <div>
          <SectionHeader title="Mes documents" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {Object.keys(student.docs).map(key => (
              <Card key={key} style={{ border: `1px solid ${student.docs[key] ? "#86efac" : C.g200}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: student.docs[key] ? C.greenLight : C.g100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{DOC_ICONS[key]}</div>
                  <Badge status={student.docs[key] ? "Complété" : "En attente"} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{DOC_LABELS[key]}</div>
                <div style={{ marginTop: 14 }}>
                  <Btn fullWidth variant={student.docs[key] ? "success" : "primary"} size="sm" icon={student.docs[key] ? "👁️" : "📤"}
                    onClick={() => toast(student.docs[key] ? "Ouverture du document..." : "Téléversement — Backend requis", student.docs[key] ? "info" : "warning")}>
                    {student.docs[key] ? "Voir le document" : "Téléverser"}
                  </Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activePage === "calendrier" && (
        <div>
          <SectionHeader title="Mon calendrier de stage" />
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>◀ Mai 2025 ▶</div>
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.g600 }}>
                {[["stage", C.blueLight, C.blue, "Journée"], ["tripartite", C.amberLight, C.amber, "Rencontre"], ["today", C.blue, "#fff", "Aujourd'hui"]].map(([t, bg, fg, l]) => (
                  <div key={t} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: bg }} />{l}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, color: C.g400, fontWeight: 700, padding: "6px 0", textTransform: "uppercase" }}>{d}</div>)}
              {[null,null,null,null].map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const ev = calEvents.find(e => e.day === day);
                const s = ev ? typeStyle[ev.type] : {};
                return (
                  <div key={day} style={{ textAlign: "center", padding: "10px 4px", borderRadius: 9, background: ev ? s.bg : C.g50, color: ev ? s.color : C.g600, fontWeight: ev ? 700 : 400, fontSize: 14, border: `1px solid ${ev && ev.type === "today" ? C.blue : C.g100}` }}>
                    {day}
                    {ev?.type === "stage" && <div style={{ fontSize: 9, marginTop: 2 }}>7.5h</div>}
                    {ev?.type === "tripartite" && <div style={{ fontSize: 8, marginTop: 2 }}>⭐</div>}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activePage === "messages" && <MessagesView messages={messages} setMessages={setMessages} />}

      {activePage === "profil" && (
        <div>
          <SectionHeader title="Mon profil" />
          <Card style={{ maxWidth: 560 }}>
            <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.g100}` }}>
              <Avatar name={student.nom} size={60} color={C.blue} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{student.nom}</div>
                <div style={{ color: C.g600, fontSize: 13 }}>Élève en stage · {student.programme}</div>
                <div style={{ color: C.g400, fontSize: 12, marginTop: 2, fontFamily: "DM Mono, monospace" }}>Fiche {student.id}</div>
              </div>
            </div>
            {[["Programme", student.programme],["Groupe", student.groupe],["Milieu de stage", student.milieu],["Adresse", student.adresseMilieu],["Superviseur", student.superviseur],["Tél. superviseur", student.superviseurTel],["Courriel superviseur", student.superviseurEmail],["Enseignant responsable", student.enseignant],["Courriel", student.email]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", padding: "10px 0", borderBottom: `1px solid ${C.g50}` }}>
                <div style={{ width: 200, color: C.g400, fontSize: 13, fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 13, color: C.g800, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </Shell>
  );
}

// ─── PROTOCOLE COMPLET (conforme au document Word) ───────────────────────────
function ProtocoleComplet({ student }) {
  const [form, setForm] = useState({
    taches: "- Accueillir et conseiller les clients\n- Effectuer les transactions à la caisse\n- Gérer la présentation visuelle des rayons\n- Participer aux activités de réception de marchandise\n- Assurer le service après-vente",
    dateDebut: "2026-04-21", dateFin: "2026-05-14",
    heuresSemaine: "30",
    pauseRepas: "Dîner : 12h00 à 13h00",
    rencontreSignatureDate: "2026-04-21", rencontreSignatureHeure: "09:00",
    rencontreFinaleDate: "2026-05-14", rencontreFinaleHeure: "15:00",
    horaire: [
      { sem: "Semaine 1", lun_am: "8h-12h", lun_pm: "13h-16h30", mar_am: "8h-12h", mar_pm: "13h-16h30", mer_am: "8h-12h", mer_pm: "13h-16h30", jeu_am: "", jeu_pm: "", ven_am: "8h-12h", ven_pm: "13h-16h30" },
      { sem: "Semaine 2", lun_am: "8h-12h", lun_pm: "13h-16h30", mar_am: "8h-12h", mar_pm: "13h-16h30", mer_am: "8h-12h", mer_pm: "13h-16h30", jeu_am: "", jeu_pm: "", ven_am: "8h-12h", ven_pm: "13h-16h30" },
      { sem: "Semaine 3", lun_am: "8h-12h", lun_pm: "13h-16h30", mar_am: "8h-12h", mar_pm: "13h-16h30", mer_am: "8h-12h", mer_pm: "13h-16h30", jeu_am: "", jeu_pm: "", ven_am: "8h-12h", ven_pm: "13h-16h30" },
      { sem: "Semaine 4", lun_am: "8h-12h", lun_pm: "13h-16h30", mar_am: "8h-12h", mar_pm: "13h-16h30", mer_am: "8h-12h", mer_pm: "13h-16h30", jeu_am: "", jeu_pm: "", ven_am: "8h-12h", ven_pm: "13h-16h30" },
    ],
    remunere: "non",
    parentNom: "",
    signaturesConfirmed: { enseignant: false, superviseur: false, stagiaire: false, parent: false },
  });
  const [activeSign, setActiveSign] = useState(null);

  const Section = ({ title, color = C.blue, children }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ background: color, color: "#fff", fontWeight: 700, fontSize: 13, padding: "8px 14px", borderRadius: "8px 8px 0 0", textTransform: "uppercase", letterSpacing: 0.8 }}>{title}</div>
      <div style={{ border: `1px solid ${C.g200}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: "16px" }}>{children}</div>
    </div>
  );

  const Field = ({ label, value, onChange, type = "text", multiline, readOnly }) => (
    <div style={{ display: "flex", gap: 10, alignItems: multiline ? "flex-start" : "center", padding: "8px 0", borderBottom: `1px solid ${C.g50}` }}>
      <div style={{ width: 200, fontSize: 13, color: C.g600, fontWeight: 600, flexShrink: 0, paddingTop: multiline ? 6 : 0 }}>{label}</div>
      {readOnly
        ? <div style={{ fontSize: 13, color: C.g900, fontWeight: 500 }}>{value}</div>
        : multiline
          ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={4} style={{ flex: 1, padding: "8px 10px", border: `1.5px solid ${C.g200}`, borderRadius: 8, fontSize: 13, fontFamily: "DM Sans, sans-serif", resize: "vertical" }} />
          : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{ flex: 1, padding: "7px 10px", border: `1.5px solid ${C.g200}`, borderRadius: 8, fontSize: 13, fontFamily: "DM Sans, sans-serif" }} />}
    </div>
  );

  const SigBlock = ({ party, label, confirmed }) => (
    <div style={{ border: `2px solid ${confirmed ? C.green : C.g200}`, borderRadius: 12, padding: 16, background: confirmed ? C.greenLight + "50" : "#fff" }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: C.g900, marginBottom: 4 }}>{label}</div>
      {confirmed
        ? <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 22 }}>✅</span>
            <div><div style={{ fontSize: 13, color: C.green, fontWeight: 700 }}>Signé électroniquement</div><div style={{ fontSize: 11, color: C.g400 }}>Le {fmtDate()}</div></div>
          </div>
        : <div>
            <div style={{ fontSize: 12, color: C.g400, marginBottom: 10 }}>Signature requise</div>
            <Btn size="sm" variant="outline" icon="✍️" onClick={() => setActiveSign(party)}>Signer maintenant</Btn>
          </div>}
    </div>
  );

  const allSigned = Object.values(form.signaturesConfirmed).filter((_, i, arr) => i < 3).every(Boolean);

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.g900 }}>Protocole d'entente</h2>
          <div style={{ fontSize: 13, color: C.g400, marginTop: 2 }}>CFP du Grand-Fjord — Session Printemps 2026</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="secondary" icon="🖨️" onClick={() => toast("Impression en cours...")}>Imprimer</Btn>
          <Btn icon="📥" onClick={() => toast("PDF téléchargé !")}>Télécharger PDF</Btn>
        </div>
      </div>

      {/* En-tête officiel */}
      <Card style={{ marginBottom: 24, textAlign: "center", padding: "20px 28px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <StageLogo size={40} showText={false} />
        </div>
        <div style={{ fontSize: 11, color: C.g400, textTransform: "uppercase", letterSpacing: 2 }}>Centre de formation professionnelle du Grand-Fjord · Pavillon CFOR@distance</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: C.blue, marginTop: 8 }}>PROTOCOLE D'ENTENTE</div>
        <div style={{ fontSize: 13, color: C.g600, marginTop: 6, lineHeight: 1.6 }}>
          Le présent protocole a pour objet de préciser les conditions et modalités du stage proposé à l'élève.
          Ce stage constitue une étape essentielle de la formation professionnelle.
        </div>
        <div style={{ marginTop: 12, padding: "10px 16px", background: C.amberLight, borderRadius: 8, fontSize: 12, color: C.amber, fontWeight: 600 }}>
          ⚠️ Ce document doit être complété dans son entièreté et remis avant le premier jour du stage à l'enseignant responsable.
        </div>
      </Card>

      {/* Objet de l'entente */}
      <Section title="Objet de l'entente" color={C.navy}>
        <div style={{ fontSize: 13, color: C.g800, lineHeight: 1.8, marginBottom: 14 }}>
          <div style={{ marginBottom: 8 }}>Le stage est :</div>
          <div style={{ display: "flex", gap: 14 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}><input type="radio" checked={form.remunere === "non"} onChange={() => setForm({ ...form, remunere: "non" })} style={{ accentColor: C.blue }} /> Non rémunéré</label>
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}><input type="radio" checked={form.remunere === "oui"} onChange={() => setForm({ ...form, remunere: "oui" })} style={{ accentColor: C.blue }} /> Rémunéré</label>
          </div>
        </div>
        <div style={{ fontSize: 12, color: C.g600, lineHeight: 1.7, background: C.g50, padding: 12, borderRadius: 8 }}>
          Durant le stage, le stagiaire est considéré travailleur du CFP du Grand-Fjord aux fins de la <em>Loi sur les accidents du travail et les maladies professionnelles</em>.
          L'établissement d'enseignement fournira à l'entreprise une preuve de couverture d'assurance responsabilité civile avant le début du stage.
        </div>
      </Section>

      {/* Coordonnées du stagiaire */}
      <Section title="Coordonnées du stagiaire (élève)" color={C.blue}>
        <Field label="Nom, Prénom" value={student.nom} readOnly />
        <Field label="Numéro de fiche" value={student.id} readOnly />
        <Field label="Courriel" value={student.email} readOnly />
        <Field label="Programme d'études" value={student.programme} readOnly />
      </Section>

      {/* Établissement d'enseignement */}
      <Section title="Établissement d'enseignement" color="#1e3a5f">
        <Field label="Nom" value="CFP du Grand-Fjord, Pavillon CFOR@distance" readOnly />
        <Field label="Adresse" value="731, boulevard de la Grande-Baie Nord, La Baie (Québec), G7B 3K5" readOnly />
        <Field label="Téléphone" value="418-697-7842" readOnly />
      </Section>

      {/* Enseignant responsable */}
      <Section title="Enseignant(e) responsable" color={C.purple}>
        <Field label="Nom, Prénom" value={student.enseignant} readOnly />
        <Field label="Courriel" value="m.bouchard@csrsaguenay.qc.ca" readOnly />
        <Field label="Téléphone" value="418-697-7442 poste 6201" readOnly />
      </Section>

      {/* Entreprise et superviseur */}
      <Section title="Entreprise (milieu de travail) et superviseur de stage" color={C.teal}>
        <Field label="Nom de l'entreprise" value={student.milieu} readOnly />
        <Field label="Personne-ressource" value={student.superviseur} readOnly />
        <Field label="Titre / Fonction" value="Chef de département" readOnly />
        <Field label="Adresse" value={student.adresseMilieu} readOnly />
        <Field label="Téléphone" value={student.superviseurTel} readOnly />
        <Field label="Courriel" value={student.superviseurEmail} readOnly />
      </Section>

      {/* Tâches */}
      <Section title="Tâches et responsabilités du stagiaire en milieu de stage" color={C.green}>
        <div style={{ fontSize: 13, color: C.g600, marginBottom: 10 }}>Veuillez indiquer les principales tâches et responsabilités que vous allez confier au stagiaire dans votre milieu de travail.</div>
        <Field label="" value={form.taches} onChange={v => setForm({ ...form, taches: v })} multiline />
      </Section>

      {/* Horaire et durée */}
      <Section title="Horaire et durée du stage" color={C.amber}>
        <div style={{ fontSize: 12, color: C.g600, marginBottom: 14, padding: "8px 12px", background: C.amberLight, borderRadius: 8 }}>
          Le stage doit se dérouler selon l'horaire en vigueur dans le milieu de travail et comporter un minimum de 30 heures par semaine. Toutes les modifications à la plage horaire doivent être autorisées par l'enseignant responsable.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 14 }}>
          <Field label="Date de début" type="date" value={form.dateDebut} onChange={v => setForm({ ...form, dateDebut: v })} />
          <Field label="Date de fin" type="date" value={form.dateFin} onChange={v => setForm({ ...form, dateFin: v })} />
          <Field label="Heures prévues par semaine" value={form.heuresSemaine} onChange={v => setForm({ ...form, heuresSemaine: v })} />
          <Field label="Durée totale" value={`${student.objectif} heures`} readOnly />
          <Field label="Période de pause et repas" value={form.pauseRepas} onChange={v => setForm({ ...form, pauseRepas: v })} />
        </div>

        {/* Grille horaire par semaine */}
        <div style={{ fontSize: 13, fontWeight: 700, color: C.g900, marginBottom: 10 }}>Grille horaire</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.g50 }}>
                {["", "Lundi AM", "Lundi PM", "Mardi AM", "Mardi PM", "Mer AM", "Mer PM", "Jeu AM", "Jeu PM", "Ven AM", "Ven PM"].map(h => (
                  <th key={h} style={{ padding: "8px 6px", textAlign: "center", color: C.g400, fontWeight: 700, fontSize: 10, textTransform: "uppercase", border: `1px solid ${C.g200}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.horaire.map((row, ri) => (
                <tr key={ri}>
                  <td style={{ padding: "6px 10px", fontWeight: 700, fontSize: 11, color: C.g900, background: C.g50, border: `1px solid ${C.g200}`, whiteSpace: "nowrap" }}>{row.sem}</td>
                  {["lun_am","lun_pm","mar_am","mar_pm","mer_am","mer_pm","jeu_am","jeu_pm","ven_am","ven_pm"].map(k => (
                    <td key={k} style={{ border: `1px solid ${C.g200}`, padding: 2 }}>
                      <input value={row[k]} onChange={e => {
                        const newH = [...form.horaire];
                        newH[ri] = { ...newH[ri], [k]: e.target.value };
                        setForm({ ...form, horaire: newH });
                      }} style={{ width: "100%", border: "none", padding: "4px 6px", fontSize: 11, textAlign: "center", fontFamily: "DM Sans, sans-serif", background: row[k] ? C.blueLight+"50" : "transparent" }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Dates des rencontres */}
      <Section title="Dates des rencontres de supervision" color={C.purple}>
        <div style={{ fontSize: 12, color: C.g600, marginBottom: 14 }}>Ces rencontres se réalisent en vidéo-conférence avec l'application Teams. Un lien sera envoyé dès confirmation par l'enseignant(e) responsable.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
          <Field label="Rencontre de signature — Date" type="date" value={form.rencontreSignatureDate} onChange={v => setForm({ ...form, rencontreSignatureDate: v })} />
          <Field label="Heure" type="time" value={form.rencontreSignatureHeure} onChange={v => setForm({ ...form, rencontreSignatureHeure: v })} />
          <Field label="Rencontre finale — Date" type="date" value={form.rencontreFinaleDate} onChange={v => setForm({ ...form, rencontreFinaleDate: v })} />
          <Field label="Heure" type="time" value={form.rencontreFinaleHeure} onChange={v => setForm({ ...form, rencontreFinaleHeure: v })} />
        </div>
      </Section>

      {/* Engagements */}
      <Section title="Engagements et responsabilités de l'enseignant responsable" color={C.purple}>
        <div style={{ fontSize: 13, color: C.g800, lineHeight: 1.8 }}>
          {["Remettre au stagiaire et au milieu de stage tous les documents nécessaires à la réalisation du stage.","Planifier et animer deux rencontres incluant le stagiaire et le superviseur de stage (au début et à la fin du stage).","Offrir un soutien et un accompagnement régulier au stagiaire, incluant deux rencontres tripartites et une rencontre hebdomadaire.","Aider le stagiaire à faire le lien entre les notions théoriques et leur application en milieu de travail.","Évaluer le travail du stagiaire en respectant les critères et objectifs d'évaluation établis.","S'assurer que le milieu de stage offre des conditions propices à l'apprentissage et qu'il respecte les lois en vigueur.","Intervenir et encadrer l'élève en cas de difficultés rencontrées durant le stage."].map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}><span style={{ color: C.purple, fontWeight: 700, flexShrink: 0 }}>•</span>{e}</div>
          ))}
        </div>
      </Section>

      <Section title="Engagements et responsabilités du superviseur de stage" color={C.teal}>
        <div style={{ fontSize: 13, color: C.g800, lineHeight: 1.8, marginBottom: 12 }}>Je confirme avoir rencontré le ou la candidate dans le cadre de sa démarche de recherche d'un milieu de stage. En tant que superviseur, je m'engage à :</div>
        {["Offrir au stagiaire un environnement de travail sain, sécuritaire et exempt de violence ou de harcèlement, conformément à la Loi sur les normes du travail.","Faciliter son intégration au sein de l'entreprise (accueil, présentation de l'équipe, etc.).","Fournir au stagiaire les informations pertinentes sur l'entreprise et sur ses futures fonctions.","Initier le stagiaire à ses rôles et à ses tâches.","Proposer des tâches adéquates, diversifiées et en lien avec les compétences du programme.","Encadrer et soutenir le stagiaire tout au long du stage (information, réponses aux questions, motivation).","Aviser rapidement l'enseignant responsable en cas de difficulté rencontrée par le stagiaire.","Participer aux deux rencontres tripartites (début et fin de stage)."].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: C.g800 }}><span style={{ color: C.teal, fontWeight: 700, flexShrink: 0 }}>•</span>{e}</div>
        ))}
      </Section>

      <Section title="Engagements et responsabilités du stagiaire" color={C.blue}>
        {["Se présenter dans l'entreprise à la date et à l'heure prévues pour le début du stage.","Respecter les règlements, politiques et consignes de l'entreprise.","Ne pas réclamer de rémunération pour le travail effectué durant le stage.","Respecter l'horaire établi en accord avec l'entreprise et l'enseignant responsable.","Aviser l'enseignant responsable et le superviseur de stage, avant le début de la journée, en cas d'absence.","Conduire un véhicule uniquement si le stagiaire détient un permis de conduire valide et a obtenu l'autorisation.","Porter la tenue vestimentaire exigée par le centre de formation et/ou par le milieu de stage.","Ne pas changer de lieu de stage ni quitter le stage sans l'autorisation de l'enseignant responsable.","Respecter la confidentialité concernant la clientèle et le fonctionnement du milieu de stage.","Réaliser l'ensemble des travaux demandés dans le cadre du stage.","Participer activement aux rencontres d'échanges entre l'enseignant et le milieu de stage."].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: C.g800 }}><span style={{ color: C.blue, fontWeight: 700, flexShrink: 0 }}>•</span>{e}</div>
        ))}
      </Section>

      {/* Autorisation parentale si mineur */}
      <Section title="Autorisation d'un parent ou tuteur (stagiaire mineur de moins de 18 ans)" color={C.g600}>
        <div style={{ fontSize: 13, color: C.g600, marginBottom: 10 }}>Remplir uniquement si le stagiaire est âgé de moins de 18 ans.</div>
        <Field label="Nom du parent ou tuteur" value={form.parentNom} onChange={v => setForm({ ...form, parentNom: v })} placeholder="Laisser vide si majeur(e)" />
      </Section>

      {/* Signatures électroniques */}
      <div style={{ marginBottom: 8, fontWeight: 700, fontSize: 16, color: C.g900 }}>Signatures électroniques</div>
      <div style={{ fontSize: 13, color: C.g600, marginBottom: 18 }}>Toutes les parties doivent signer électroniquement pour valider le protocole.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <SigBlock party="enseignant" label={`Enseignant(e) responsable — ${student.enseignant}`} confirmed={form.signaturesConfirmed.enseignant} />
        <SigBlock party="superviseur" label={`Superviseur de stage — ${student.superviseur}`} confirmed={form.signaturesConfirmed.superviseur} />
        <SigBlock party="stagiaire" label={`Stagiaire — ${student.nom}`} confirmed={form.signaturesConfirmed.stagiaire} />
      </div>
      {form.parentNom && (
        <div style={{ marginBottom: 24 }}>
          <SigBlock party="parent" label={`Parent / Tuteur — ${form.parentNom}`} confirmed={form.signaturesConfirmed.parent} />
        </div>
      )}

      {allSigned && (
        <div style={{ padding: 20, background: C.greenLight, border: "2px solid #86efac", borderRadius: 14, display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 36 }}>🎉</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: C.green }}>Protocole signé par toutes les parties</div>
            <div style={{ fontSize: 13, color: C.g600, marginTop: 2 }}>Le {fmtDate()} — Valide pour la session Printemps 2026</div>
          </div>
          <div style={{ marginLeft: "auto" }}><Btn icon="📥" onClick={() => toast("PDF signé téléchargé !")}>Télécharger le PDF signé</Btn></div>
        </div>
      )}

      {/* Modal signature */}
      <Modal open={!!activeSign} onClose={() => setActiveSign(null)} title={`Signature électronique — ${activeSign === "enseignant" ? student.enseignant : activeSign === "superviseur" ? student.superviseur : student.nom}`}>
        <div style={{ fontSize: 13, color: C.g600, marginBottom: 18, lineHeight: 1.6 }}>
          En signant électroniquement, vous confirmez avoir lu, compris et accepté l'ensemble des conditions du présent protocole d'entente de stage, incluant vos engagements et responsabilités tels que décrits ci-dessus.
        </div>
        <SignatureCanvas onSigned={() => {
          setForm(f => ({ ...f, signaturesConfirmed: { ...f.signaturesConfirmed, [activeSign]: true } }));
          setActiveSign(null);
          toast("Signature électronique enregistrée !");
        }} />
        <div style={{ marginTop: 16, padding: "10px 14px", background: C.g50, borderRadius: 8, fontSize: 12, color: C.g600 }}>
          📅 Date de signature : {fmtDate()} · La signature électronique a la même valeur légale qu'une signature manuscrite dans ce contexte.
        </div>
      </Modal>
    </div>
  );
}

// ─── SUPERVISOR VIEW ──────────────────────────────────────────────────────────
function SupervisorView({ onLogout }) {
  const student = DEMO_STUDENTS_INIT[0];
  const [activePage, setActivePage] = useState("tableau");
  const [messages, setMessages] = useState(DEMO_MESSAGES_INIT);
  const [presences, setPresences] = useState(student.presences);
  const [appreciation, setAppreciation] = useState({});
  const [embauche, setEmbauche] = useState(null);
  const [autreStag, setAutreStag] = useState(null);
  const [commentaires, setCommentaires] = useState("");
  const [newRow, setNewRow] = useState({ date: "", arrivee: "", depart: "" });
  const [signModal, setSignModal] = useState(null);

  const totalH = presences.reduce((a, p) => a + p.heures, 0).toFixed(1);

  const addRow = () => {
    if (!newRow.date || !newRow.arrivee || !newRow.depart) { toast("Veuillez remplir tous les champs", "error"); return; }
    const [ah, am] = newRow.arrivee.split(":").map(Number);
    const [dh, dm] = newRow.depart.split(":").map(Number);
    const h = Math.round(((dh * 60 + dm) - (ah * 60 + am)) / 60 * 10) / 10;
    if (h <= 0) { toast("L'heure de départ doit être après l'arrivée", "error"); return; }
    setPresences([{ id: Date.now(), ...newRow, heures: h, signe: false }, ...presences]);
    setNewRow({ date: "", arrivee: "", depart: "" });
    toast("Entrée ajoutée !");
  };

  const notifs = [
    { texte: "Nouvelle entrée de présence enregistrée", time: "Il y a 1h", read: false },
    { texte: "Rappel : Fiche d'appréciation à soumettre", time: "Hier", read: true },
  ];

  const pages = [
    { id: "tableau", label: "Tableau de bord", icon: "🏠" },
    { id: "protocole", label: "Protocole", icon: "📋" },
    { id: "appreciation", label: "Appréciation", icon: "⭐" },
    { id: "presences", label: "Présences", icon: "⏱️" },
    { id: "documents", label: "Documents", icon: "📁" },
    { id: "messages", label: "Messages", icon: "💬", badge: messages.filter(m => !m.lu).length },
    { id: "profil", label: "Mon profil", icon: "👤" },
  ];

  const cats = [...new Set(APPRECI_CRITERES.map(c => c.cat))];

  return (
    <Shell role="Superviseur" pages={pages} activePage={activePage} setActivePage={setActivePage} onLogout={onLogout}
      title="Vue Superviseur" subtitle={`Stagiaire : ${student.nom} · ${student.milieu}`} notifs={notifs}
      headerActions={<Btn icon="+" onClick={() => setActivePage("presences")}>Ajouter une entrée</Btn>}>

      {activePage === "tableau" && (
        <div>
          <SectionHeader title="Gestion des présences" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
            <StatCard label="Total des heures" value={`${totalH} h`} sub={`Objectif : ${student.objectif} h`} icon="⏱️" color={C.blue} />
            <StatCard label="Heures cette semaine" value="16 h" icon="📅" color={C.green} />
            <StatCard label="Entrées non signées" value={presences.filter(p => !p.signe).length.toString()} icon="📋" color={C.amber} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Historique récent</div>
              <Table cols={[
                { label: "Date", key: "date" }, { label: "Arrivée", key: "arrivee" }, { label: "Départ", key: "depart" },
                { label: "Heures", render: r => <strong style={{ color: C.blue }}>{r.heures} h</strong> },
                { label: "Signature", render: r => r.signe ? <span style={{ color: C.green }}>✍️ Signé</span> : <Btn size="sm" variant="outline" onClick={() => setSignModal(r.id)}>Signer</Btn> },
                { label: "", render: r => <Btn size="sm" variant="danger" onClick={() => { setPresences(p => p.filter(x => x.id !== r.id)); toast("Supprimé", "warning"); }}>🗑️</Btn> },
              ]} rows={presences.slice(0, 5)} />
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Progression du stagiaire</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: C.blue }}>{pct(student.heures, student.objectif)}%</div>
                <div style={{ fontSize: 12, color: C.g400, marginBottom: 8 }}>{student.heures} / {student.objectif} h</div>
                <ProgressBar value={student.heures} max={student.objectif} />
              </Card>
              <Card>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Appréciation</div>
                <div style={{ fontSize: 13, color: C.g600, marginBottom: 12 }}>Statut : <span style={{ color: C.green, fontWeight: 700 }}>Complétée</span></div>
                <Btn fullWidth variant="success" size="sm" icon="⭐" onClick={() => setActivePage("appreciation")}>Voir / Modifier</Btn>
              </Card>
              <Card>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Protocole</div>
                <div style={{ fontSize: 13, color: C.g600, marginBottom: 12 }}>Statut : <span style={{ color: C.green, fontWeight: 700 }}>Signé</span></div>
                <Btn fullWidth variant="outline" size="sm" icon="📋" onClick={() => setActivePage("protocole")}>Voir</Btn>
              </Card>
            </div>
          </div>
          <Modal open={!!signModal} onClose={() => setSignModal(null)} title="Signature de présence">
            <p style={{ color: C.g600, fontSize: 14, marginBottom: 18 }}>Signez pour confirmer la présence du stagiaire.</p>
            <SignatureCanvas onSigned={() => { setPresences(p => p.map(r => r.id === signModal ? { ...r, signe: true } : r)); setSignModal(null); }} />
          </Modal>
        </div>
      )}

      {activePage === "presences" && (
        <div>
          <SectionHeader title="Gestion des présences" />
          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Ajouter une entrée</div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
              <Input label="Date" type="date" value={newRow.date} onChange={v => setNewRow({ ...newRow, date: v })} />
              <Input label="Arrivée" type="time" value={newRow.arrivee} onChange={v => setNewRow({ ...newRow, arrivee: v })} />
              <Input label="Départ" type="time" value={newRow.depart} onChange={v => setNewRow({ ...newRow, depart: v })} />
              <Btn icon="+" onClick={addRow}>Ajouter</Btn>
            </div>
          </Card>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Toutes les entrées · <span style={{ color: C.blue }}>{totalH} h</span></div>
              <Btn variant="secondary" size="sm" icon="📥" onClick={() => toast("Export PDF généré !")}>Exporter PDF</Btn>
            </div>
            <Table cols={[
              { label: "Date", key: "date" }, { label: "Arrivée", key: "arrivee" }, { label: "Départ", key: "depart" },
              { label: "Heures", render: r => <strong style={{ color: C.blue }}>{r.heures} h</strong> },
              { label: "Signature", render: r => r.signe ? <span style={{ color: C.green, fontWeight: 600 }}>✍️ Signé</span> : <Btn size="sm" variant="outline" onClick={() => setSignModal(r.id)}>Signer</Btn> },
              { label: "", render: r => <Btn size="sm" variant="danger" onClick={() => { setPresences(p => p.filter(x => x.id !== r.id)); toast("Supprimé", "warning"); }}>🗑️</Btn> },
            ]} rows={presences} />
          </Card>
          <Modal open={!!signModal} onClose={() => setSignModal(null)} title="Signature de présence">
            <SignatureCanvas onSigned={() => { setPresences(p => p.map(r => r.id === signModal ? { ...r, signe: true } : r)); setSignModal(null); }} />
          </Modal>
        </div>
      )}

      {activePage === "appreciation" && (
        <div>
          <SectionHeader title="Fiche d'appréciation" action={<Btn variant="secondary" icon="📥" onClick={() => toast("PDF généré !")}>Exporter PDF</Btn>} />
          <div style={{ fontSize: 13, color: C.g600, marginBottom: 20 }}>Stagiaire : <strong>{student.nom}</strong> · {student.milieu} · {fmtDate()}</div>
          {cats.map(cat => (
            <Card key={cat} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: C.blue, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>{cat}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: C.g400, textTransform: "uppercase", fontWeight: 600 }}>Critère</div>
                <div style={{ display: "flex" }}>{FREQ_OPTIONS.map(f => <div key={f} style={{ width: 120, textAlign: "center", fontSize: 11, color: C.g400, fontWeight: 600 }}>{f}</div>)}</div>
              </div>
              {APPRECI_CRITERES.filter(c => c.cat === cat).map(c => (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${C.g50}` }}>
                  <div style={{ fontSize: 13.5, color: C.g800 }}>{c.label}</div>
                  <div style={{ display: "flex" }}>
                    {FREQ_OPTIONS.map(f => (
                      <div key={f} style={{ width: 120, display: "flex", justifyContent: "center" }}>
                        <input type="radio" name={`c${c.id}`} checked={appreciation[c.id] === f} onChange={() => setAppreciation({ ...appreciation, [c.id]: f })} style={{ width: 16, height: 16, accentColor: C.blue, cursor: "pointer" }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          ))}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Commentaires</div>
            <Textarea value={commentaires} onChange={setCommentaires} rows={5} placeholder="Vos observations sur les forces, défis et apprentissages du stagiaire..." />
          </Card>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Décision d'embauche</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: C.g600, marginBottom: 10 }}>Envisagez-vous d'embaucher ce stagiaire?</div>
              <div style={{ display: "flex", gap: 10 }}>
                {["Oui", "Non", "Peut-être"].map(o => <button key={o} onClick={() => setEmbauche(o)} style={{ padding: "10px 24px", background: embauche === o ? C.blue : C.g100, color: embauche === o ? "#fff" : C.g800, border: "none", borderRadius: 9, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>{o}</button>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.g600, marginBottom: 10 }}>Accueillerez-vous un autre stagiaire à la prochaine session?</div>
              <div style={{ display: "flex", gap: 10 }}>
                {["Oui", "Non", "Peut-être"].map(o => <button key={o} onClick={() => setAutreStag(o)} style={{ padding: "10px 24px", background: autreStag === o ? C.green : C.g100, color: autreStag === o ? "#fff" : C.g800, border: "none", borderRadius: 9, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>{o}</button>)}
              </div>
            </div>
          </Card>
          <Card style={{ marginBottom: 20 }}><SignatureCanvas onSigned={() => toast("Signature enregistrée !")} /></Card>
          <Btn size="lg" icon="✅" onClick={() => toast("Fiche d'appréciation soumise avec succès !")}>Soumettre la fiche d'appréciation</Btn>
        </div>
      )}

      {activePage === "protocole" && (
        <ProtocoleComplet student={student} />
      )}

      {activePage === "documents" && (
        <div>
          <SectionHeader title="Documents du stagiaire" />
          <Card>
            <Table cols={[
              { label: "Document", render: r => <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ fontSize: 20 }}>{DOC_ICONS[r.key]}</span><span style={{ fontWeight: 600 }}>{DOC_LABELS[r.key]}</span></div> },
              { label: "Statut", render: r => <Badge status={student.docs[r.key] ? "Complété" : "En attente"} /> },
              { label: "Action", render: r => student.docs[r.key] ? <Btn size="sm" variant="success" icon="👁️" onClick={() => toast("Ouverture...")}>Voir</Btn> : <Btn size="sm" variant="ghost">En attente</Btn> },
            ]} rows={Object.keys(student.docs).map(k => ({ key: k }))} />
          </Card>
        </div>
      )}

      {activePage === "messages" && <MessagesView messages={messages} setMessages={setMessages} />}

      {activePage === "profil" && (
        <div>
          <SectionHeader title="Mon profil superviseur" />
          <Card style={{ maxWidth: 560 }}>
            <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.g100}` }}>
              <Avatar name="Marc Bouchard" size={60} color={C.green} />
              <div><div style={{ fontWeight: 800, fontSize: 20 }}>Marc Bouchard</div><div style={{ color: C.g600, fontSize: 13 }}>Superviseur · {student.milieu}</div></div>
            </div>
            {[["Entreprise", student.milieu],["Adresse", student.adresseMilieu],["Fonction","Chef de département"],["Courriel","marc.b@sportsexperts.ca"],["Téléphone","418-555-2345 poste 12"],["Stagiaire assigné",`${student.nom} (${student.id})`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", padding: "10px 0", borderBottom: `1px solid ${C.g50}` }}>
                <div style={{ width: 180, color: C.g400, fontSize: 13, fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 13, color: C.g800 }}>{v}</div>
              </div>
            ))}
            <div style={{ marginTop: 18, padding: "14px 16px", background: C.purpleLight, borderRadius: 12, border: `1px solid ${C.purple}30` }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.purple, marginBottom: 10 }}>📚 Contact — Enseignant responsable</div>
              {[["Nom", student.enseignant],["Courriel","m.bouchard@csrsaguenay.qc.ca"],["Téléphone","418-697-7442 poste 6201"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: `1px solid ${C.purple}20` }}>
                  <div style={{ width: 80, color: C.purple, fontSize: 12, fontWeight: 600 }}>{k}</div>
                  <div style={{ fontSize: 13, color: C.g800 }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </Shell>
  );
}

// ─── TEACHER VIEW ─────────────────────────────────────────────────────────────
function TeacherView({ onLogout }) {
  const [students, setStudents] = useState(DEMO_STUDENTS_INIT);
  const [groups, setGroups] = useState(DEMO_GROUPS_INIT);
  const [activePage, setActivePage] = useState("tableau");
  const [messages, setMessages] = useState(DEMO_MESSAGES_INIT);
  const [selGroup, setSelGroup] = useState("VC00001");
  const [selStudent, setSelStudent] = useState(DEMO_STUDENTS_INIT[0]);
  const [activeTab, setActiveTab] = useState("heures");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");
  // Visites / Appels
  const [visites, setVisites] = useState([
    { id: 1, type: "Visite", date: "8 mai 2025", eleve: "Alex Tremblay", lieu: "Sports Experts", notes: "Bon intégration. Superviseur satisfait. Aucune problématique.", statut: "Complété" },
    { id: 2, type: "Appel", date: "2 mai 2025", eleve: "Jacob Laroche", lieu: "Téléphonique", notes: "Rappel protocole manquant. Élève informé, délai accordé jusqu'au 9 mai.", statut: "Complété" },
    { id: 3, type: "Visite", date: "29 avr. 2025", eleve: "Élizabeth Roy", lieu: "Walmart Chicoutimi", notes: "Première visite. Bonne intégration dans l'équipe.", statut: "Complété" },
  ]);
  const [showVisiteModal, setShowVisiteModal] = useState(false);
  const [newVisite, setNewVisite] = useState({ type: "Visite", date: "", eleve: "", lieu: "", notes: "" });

  const groupStudents = students.filter(s => s.groupe === selGroup);
  const filteredStudents = students.filter(s => {
    const ms = s.nom.toLowerCase().includes(search.toLowerCase()) || String(s.id).includes(search);
    const fs = filterStatus === "tous" || (filterStatus === "signe" && s.protocole === "Signé") || (filterStatus === "attente" && s.protocole !== "Signé");
    return ms && fs;
  });

  const notifs = [
    { texte: "Jacob Laroche — journal manquant 5 jours", time: "Il y a 2h", read: false },
    { texte: "Émile Gagnon — protocole non signé 7 jours", time: "Hier", read: false },
    { texte: "Évaluation d'Élizabeth Roy disponible", time: "8 mai", read: true },
  ];

  const alertes = [
    { icon: "🔴", texte: "Journal de bord manquant", who: "Jacob Laroche — VC00001", age: "5 jours", type: "danger" },
    { icon: "🟡", texte: "Rapport final en attente", who: "Élizabeth Roy — VC00001", age: "3 jours", type: "warning" },
    { icon: "🔴", texte: "Protocole non signé", who: "Émile Gagnon — VC00002", age: "7 jours", type: "danger" },
    { icon: "🟡", texte: "Aucun document déposé", who: "Émile Gagnon — VC00002", age: "7 jours", type: "warning" },
  ];

  const addVisite = () => {
    if (!newVisite.date || !newVisite.eleve) { toast("Date et élève requis", "error"); return; }
    setVisites([{ id: Date.now(), ...newVisite, statut: "Complété" }, ...visites]);
    setShowVisiteModal(false);
    setNewVisite({ type: "Visite", date: "", eleve: "", lieu: "", notes: "" });
    toast(`${newVisite.type} enregistrée !`);
  };

  const pages = [
    { id: "tableau", label: "Tableau de bord", icon: "🏠" },
    { id: "eleves", label: "Élèves", icon: "🎓" },
    { id: "groupes", label: "Groupes", icon: "👥" },
    { id: "visites", label: "Visites & Appels", icon: "🚗", badge: 1 },
    { id: "heures", label: "Suivi des heures", icon: "⏱️" },
    { id: "documents", label: "Documents", icon: "📁" },
    { id: "alertes", label: "Alertes", icon: "⚠️", badge: alertes.filter(a => a.type === "danger").length },
    { id: "calendrier", label: "Calendrier", icon: "📅" },
    { id: "telechargements", label: "Téléchargements", icon: "📥" },
    { id: "messages", label: "Messages", icon: "💬", badge: messages.filter(m => !m.lu).length },
  ];

  const barData = [
    { mois: "1 avr", h: 8 }, { mois: "8 avr", h: 22 }, { mois: "15 avr", h: 42 },
    { mois: "22 avr", h: 60 }, { mois: "29 avr", h: 75 }, { mois: "6 mai", h: 82 }, { mois: "13 mai", h: selStudent.heures },
  ];

  return (
    <Shell role="Enseignant" pages={pages} activePage={activePage} setActivePage={setActivePage} onLogout={onLogout}
      title="Vue Enseignant" subtitle="Marie-Anne Bouchard — CFP du Grand-Fjord" notifs={notifs}>

      {/* ── TABLEAU DE BORD ── */}
      {activePage === "tableau" && (
        <div>
          <SectionHeader title="Suivi des élèves" />
          <div style={{ display: "flex", gap: 14, marginBottom: 22 }}>
            <Select label="Groupe" value={selGroup} onChange={v => { setSelGroup(v); setSelStudent(students.find(s => s.groupe === v) || students[0]); }} options={groups.map(g => ({ value: g.id, label: g.nom }))} />
            <Select label="Élève" value={selStudent.id} onChange={v => setSelStudent(students.find(s => s.id === parseInt(v)))} options={groupStudents.map(s => ({ value: s.id, label: s.nom }))} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            {/* Fiche élève + progression */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: C.g900 }}>{selStudent.nom}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                  <span style={{ background: C.blueLight, color: C.blue, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8, fontFamily: "DM Mono, monospace" }}>Fiche #{selStudent.id}</span>
                  <span style={{ background: C.purpleLight, color: C.purple, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8 }}>{selStudent.groupe}</span>
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 16 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <ProgressRing value={selStudent.heures} max={selStudent.objectif} size={88} color={pct(selStudent.heures, selStudent.objectif) >= 70 ? C.green : C.amber} />
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{pct(selStudent.heures, selStudent.objectif)}%</div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 30, fontWeight: 900, color: C.blue }}>{selStudent.heures} h</div>
                    <div style={{ fontSize: 12, color: C.g400, marginBottom: 8 }}>sur {selStudent.objectif} h</div>
                    <ProgressBar value={selStudent.heures} max={selStudent.objectif} color={pct(selStudent.heures, selStudent.objectif) >= 70 ? C.green : C.amber} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <div style={{ padding: 12, background: C.g50, borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{selStudent.joursCompletes}/{selStudent.joursTotal}</div>
                    <div style={{ fontSize: 11, color: C.g400, marginTop: 2 }}>Journées</div>
                  </div>
                  <div style={{ padding: 12, background: C.g50, borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{Object.values(selStudent.docs).filter(Boolean).length}/{Object.keys(selStudent.docs).length}</div>
                    <div style={{ fontSize: 11, color: C.g400, marginTop: 2 }}>Documents</div>
                    {!allDocsDone(selStudent.docs) && <div style={{ color: C.red, fontSize: 10, marginTop: 3, fontWeight: 700 }}>⚠️ Manquants</div>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="outline" size="sm" icon="📧" onClick={() => toast("Message envoyé au superviseur !")}>Contacter superviseur</Btn>
                  <Btn variant="secondary" size="sm" icon="📥" onClick={() => toast("Dossier exporté !")}>Exporter dossier</Btn>
                </div>
              </Card>

              {/* Infos milieu de stage */}
              <Card style={{ border: `1px solid ${C.tealLight}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.tealLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏢</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.teal }}>Milieu de stage</div>
                </div>
                {[
                  ["Commerce", selStudent.milieu],
                  ["Adresse", selStudent.adresseMilieu],
                  ["Superviseur", selStudent.superviseur],
                  ["Téléphone", selStudent.superviseurTel],
                  ["Courriel", selStudent.superviseurEmail],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: `1px solid ${C.g50}`, alignItems: "flex-start" }}>
                    <div style={{ width: 90, fontSize: 12, color: C.g400, fontWeight: 600, flexShrink: 0, paddingTop: 1 }}>{k}</div>
                    <div style={{ fontSize: 13, color: C.g800, fontWeight: 500, wordBreak: "break-all" }}>{v}</div>
                  </div>
                ))}
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <Btn variant="teal" size="sm" icon="📞" onClick={() => toast(`Appel : ${selStudent.superviseurTel}`, "info")}>Appeler</Btn>
                  <Btn variant="teal" size="sm" icon="✉️" onClick={() => toast(`Courriel : ${selStudent.superviseurEmail}`, "info")}>Courriel</Btn>
                </div>
              </Card>
            </div>

            {/* Onglets droite */}
            <Card>
              <div style={{ display: "flex", gap: 0, marginBottom: 16, background: C.g100, borderRadius: 10, padding: 3 }}>
                {["heures", "documents", "alertes"].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "7px 0", background: activeTab === t ? "#fff" : "transparent", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", color: activeTab === t ? C.g900 : C.g400, textTransform: "capitalize", fontFamily: "DM Sans, sans-serif" }}>{t === "heures" ? "Évolution" : t}</button>
                ))}
              </div>
              {activeTab === "heures" && (
                <div>
                  <div style={{ fontSize: 12, color: C.g400, marginBottom: 12, fontWeight: 600 }}>HEURES CUMULÉES</div>
                  <MiniBarChart data={barData} labelKey="mois" valueKey="h" color={C.blue} height={150} />
                </div>
              )}
              {activeTab === "documents" && (
                <div>
                  <div style={{ fontSize: 12, color: C.g400, marginBottom: 12, fontWeight: 600 }}>DOCUMENTS</div>
                  {Object.entries(selStudent.docs).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.g50}` }}>
                      <span style={{ fontSize: 16, marginRight: 10 }}>{v ? "✅" : "❌"}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{DOC_LABELS[k]}</span>
                      <Badge status={v ? "Complété" : "En attente"} />
                    </div>
                  ))}
                  <div style={{ marginTop: 14 }}>
                    <Btn fullWidth variant={allDocsDone(selStudent.docs) ? "success" : "ghost"} size="sm" icon="📦" disabled={!allDocsDone(selStudent.docs)}
                      onClick={() => toast(`Dossier complet de ${selStudent.nom} téléchargé !`)}>
                      {allDocsDone(selStudent.docs) ? "Télécharger tous les documents" : "Documents incomplets — téléchargement indisponible"}
                    </Btn>
                    {!allDocsDone(selStudent.docs) && <div style={{ fontSize: 11, color: C.amber, textAlign: "center", marginTop: 6 }}>⚠️ Tous les documents doivent être complétés</div>}
                  </div>
                </div>
              )}
              {activeTab === "alertes" && (
                <div>
                  <div style={{ fontSize: 12, color: C.g400, marginBottom: 12, fontWeight: 600 }}>ALERTES</div>
                  {alertes.filter(a => a.who.startsWith(selStudent.nom.split(" ")[0])).length === 0
                    ? <div style={{ textAlign: "center", padding: "20px 0", color: C.g400 }}>✅ Aucune alerte</div>
                    : alertes.filter(a => a.who.startsWith(selStudent.nom.split(" ")[0])).map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.g50}` }}>
                        <span style={{ fontSize: 18 }}>{a.icon}</span>
                        <div><div style={{ fontSize: 13, fontWeight: 600 }}>{a.texte}</div><div style={{ fontSize: 11, color: C.g400 }}>Depuis {a.age}</div></div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── VISITES & APPELS ── */}
      {activePage === "visites" && (
        <div>
          <SectionHeader title="Visites de stage & Appels de suivi" action={<Btn icon="+" onClick={() => setShowVisiteModal(true)}>Nouvelle entrée</Btn>} />

          {/* Statistiques */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard label="Visites effectuées" value={visites.filter(v => v.type === "Visite").length} icon="🚗" color={C.blue} />
            <StatCard label="Appels de suivi" value={visites.filter(v => v.type === "Appel").length} icon="📞" color={C.teal} />
            <StatCard label="Cette session" value={visites.length} icon="📋" color={C.purple} />
            <StatCard label="Prochaine visite" value="22 mai" icon="📅" color={C.amber} />
          </div>

          {/* Tableau des entrées */}
          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Historique des visites et appels</div>
            <Table cols={[
              { label: "Type", render: r => (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: r.type === "Visite" ? C.blueLight : C.tealLight, color: r.type === "Visite" ? C.blue : C.teal, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {r.type === "Visite" ? "🚗" : "📞"} {r.type}
                </span>
              )},
              { label: "Date", key: "date" },
              { label: "Élève", render: r => <strong>{r.eleve}</strong> },
              { label: "Lieu / Mode", key: "lieu" },
              { label: "Statut", render: r => <Badge status={r.statut} /> },
              { label: "Notes", render: r => <div style={{ maxWidth: 220, fontSize: 12, color: C.g600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.notes}</div> },
              { label: "", render: r => <Btn size="sm" variant="ghost" onClick={() => toast("Détails de l'entrée")}>Voir</Btn> },
            ]} rows={visites} emptyMsg="Aucune visite ou appel enregistré" />
          </Card>

          {/* Formulaire rapide par élève */}
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Planifier une prochaine visite</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {students.slice(0, 3).map(s => (
                <div key={s.id} style={{ padding: 14, background: C.g50, borderRadius: 12, border: `1px solid ${C.g200}` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <Avatar name={s.nom} size={30} color={C.blue} />
                    <div><div style={{ fontWeight: 600, fontSize: 13 }}>{s.nom}</div><div style={{ fontSize: 11, color: C.g400 }}>{s.milieu}</div></div>
                  </div>
                  <div style={{ fontSize: 12, color: C.g600, marginBottom: 10 }}>Dernière visite : {visites.find(v => v.eleve === s.nom)?.date || "Aucune"}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn size="sm" variant="outline" fullWidth icon="🚗" onClick={() => { setNewVisite({ type: "Visite", date: "", eleve: s.nom, lieu: s.milieu, notes: "" }); setShowVisiteModal(true); }}>Visite</Btn>
                    <Btn size="sm" variant="teal" fullWidth icon="📞" onClick={() => { setNewVisite({ type: "Appel", date: "", eleve: s.nom, lieu: "Téléphonique", notes: "" }); setShowVisiteModal(true); }}>Appel</Btn>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Modal open={showVisiteModal} onClose={() => setShowVisiteModal(false)} title="Nouvelle visite / Appel de suivi" wide>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              <Select label="Type d'entrée" value={newVisite.type} onChange={v => setNewVisite({ ...newVisite, type: v })} options={["Visite", "Appel"]} />
              <Input label="Date" type="date" value={newVisite.date} onChange={v => setNewVisite({ ...newVisite, date: v })} required />
              <Select label="Élève" value={newVisite.eleve} onChange={v => { const s = students.find(x => x.nom === v); setNewVisite({ ...newVisite, eleve: v, lieu: newVisite.type === "Appel" ? "Téléphonique" : (s?.milieu || "") }); }} options={students.map(s => ({ value: s.nom, label: s.nom }))} placeholder="Choisir un élève" />
              <Input label={newVisite.type === "Visite" ? "Lieu de la visite" : "Mode de communication"} value={newVisite.lieu} onChange={v => setNewVisite({ ...newVisite, lieu: v })} placeholder={newVisite.type === "Visite" ? "Adresse / Nom du milieu" : "Téléphone, Teams, etc."} />
            </div>
            <div style={{ marginTop: 14 }}>
              <Textarea label="Notes / Observations" value={newVisite.notes} onChange={v => setNewVisite({ ...newVisite, notes: v })} rows={5} placeholder="Résumé de la visite ou de l'appel, points discutés, actions à suivre..." />
            </div>
            {newVisite.type === "Visite" && (
              <div style={{ marginTop: 14 }}>
                <SignatureCanvas onSigned={() => toast("Présence de visite signée !")} />
              </div>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <Btn variant="secondary" onClick={() => setShowVisiteModal(false)}>Annuler</Btn>
              <Btn icon="✅" onClick={addVisite} disabled={!newVisite.date || !newVisite.eleve}>Enregistrer</Btn>
            </div>
          </Modal>
        </div>
      )}

      {/* ── ÉLÈVES ── */}
      {activePage === "eleves" && (
        <div>
          <SectionHeader title="Tous les élèves" />
          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom ou fiche..."
                style={{ width: "100%", padding: "9px 14px 9px 36px", border: `1.5px solid ${C.g200}`, borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "DM Sans, sans-serif" }} />
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.g400 }}>🔍</span>
            </div>
            <Select value={filterStatus} onChange={setFilterStatus} options={[{ value: "tous", label: "Tous" }, { value: "signe", label: "Protocole signé" }, { value: "attente", label: "En attente" }]} />
          </div>
          <Table cols={[
            { label: "Élève", render: r => <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar name={r.nom} size={32} color={C.blue} /><div><div style={{ fontWeight: 600 }}>{r.nom}</div><div style={{ fontSize: 11, color: C.g400, fontFamily: "DM Mono, monospace" }}>{r.id}</div></div></div> },
            { label: "Groupe", key: "groupe" },
            { label: "Milieu", key: "milieu" },
            { label: "Superviseur", key: "superviseur" },
            { label: "Protocole", render: r => <Badge status={r.protocole} /> },
            { label: "Heures", render: r => <div style={{ minWidth: 120 }}><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{r.heures}/{r.objectif} h</div><ProgressBar value={r.heures} max={r.objectif} color={pct(r.heures, r.objectif) >= 70 ? C.green : C.amber} /></div> },
            { label: "", render: r => <Btn size="sm" variant="outline" onClick={() => { setSelStudent(r); setActivePage("tableau"); }}>Voir →</Btn> },
          ]} rows={filteredStudents} emptyMsg="Aucun élève trouvé" />
        </div>
      )}

      {/* ── GROUPES ── */}
      {activePage === "groupes" && (
        <div>
          <SectionHeader title="Mes groupes" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {groups.filter(g => students.some(s => s.groupe === g.id && s.enseignantId === "E1")).map(g => {
              const gs = students.filter(s => s.groupe === g.id);
              const avg = gs.length ? Math.round(gs.reduce((a, s) => a + s.heures, 0) / gs.length) : 0;
              return (
                <Card key={g.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{g.nom}</div>
                      <div style={{ fontSize: 12, color: C.g400, marginTop: 2 }}>{g.programme}</div>
                    </div>
                    <Badge status="Actif" />
                  </div>
                  <div style={{ fontSize: 13, color: C.g600, marginBottom: 14 }}>📝 {g.description}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[["Élèves", gs.length, C.blue], ["Moy. h", `${avg}h`, C.green], ["Alertes", alertes.filter(a => gs.some(s => a.who.startsWith(s.nom.split(" ")[0]))).length, C.red]].map(([l, v, col]) => (
                      <div key={l} style={{ textAlign: "center", padding: 10, background: col + "12", borderRadius: 9 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, color: col }}>{v}</div>
                        <div style={{ fontSize: 11, color: C.g400, marginTop: 2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14 }}><Btn fullWidth variant="outline" size="sm" onClick={() => { setSelGroup(g.id); setActivePage("tableau"); }}>Voir les élèves →</Btn></div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── HEURES ── */}
      {activePage === "heures" && (
        <div>
          <SectionHeader title="Suivi des heures" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard label="Total heures" value={`${students.reduce((a, s) => a + s.heures, 0)} h`} icon="⏱️" color={C.blue} />
            <StatCard label="Moyenne" value={`${Math.round(students.reduce((a, s) => a + s.heures, 0) / students.length)} h`} icon="📊" color={C.green} />
            <StatCard label="En bonne voie" value={students.filter(s => pct(s.heures, s.objectif) >= 60).length} icon="✅" color={C.purple} />
            <StatCard label="À surveiller" value={students.filter(s => pct(s.heures, s.objectif) < 60).length} icon="⚠️" color={C.amber} />
          </div>
          <Table cols={[
            { label: "Élève", render: r => <strong>{r.nom}</strong> },
            { label: "Groupe", key: "groupe" },
            { label: "Heures", render: r => <strong>{r.heures} h</strong> },
            { label: "Objectif", render: r => <span style={{ color: C.g400 }}>{r.objectif} h</span> },
            { label: "Progression", render: r => <div style={{ minWidth: 160, display: "flex", gap: 10, alignItems: "center" }}><div style={{ flex: 1 }}><ProgressBar value={r.heures} max={r.objectif} color={pct(r.heures, r.objectif) >= 70 ? C.green : C.amber} /></div><span style={{ fontSize: 12, color: C.g400, minWidth: 32, textAlign: "right" }}>{pct(r.heures, r.objectif)}%</span></div> },
            { label: "État", render: r => <Badge status={pct(r.heures, r.objectif) >= 80 ? "Actif" : "En attente"} /> },
          ]} rows={filteredStudents} />
        </div>
      )}

      {/* ── DOCUMENTS ── */}
      {activePage === "documents" && (
        <div>
          <SectionHeader title="Documents — Vue d'ensemble" />
          <Table cols={[
            { label: "Élève", render: r => <strong>{r.nom}</strong> },
            ...Object.keys(DEMO_STUDENTS_INIT[0].docs).map(k => ({ label: DOC_LABELS[k].split(" ")[0], render: r => r.docs[k] ? <span style={{ color: C.green }}>✅</span> : <span style={{ color: C.red }}>❌</span> })),
            { label: "Complétion", render: r => { const d = Object.values(r.docs).filter(Boolean).length, t = Object.keys(r.docs).length; return <div style={{ minWidth: 100 }}><ProgressBar value={d} max={t} color={d === t ? C.green : C.blue} /><div style={{ fontSize: 11, color: C.g400, marginTop: 3 }}>{d}/{t}</div></div>; } },
            { label: "Dossier complet", render: r => allDocsDone(r.docs)
              ? <Btn size="sm" variant="success" icon="📦" onClick={() => toast(`Dossier de ${r.nom} téléchargé !`)}>Télécharger</Btn>
              : <span style={{ fontSize: 12, color: C.amber }}>⚠️ Incomplet</span> },
          ]} rows={students} />
        </div>
      )}

      {/* ── ALERTES ── */}
      {activePage === "alertes" && (
        <div>
          <SectionHeader title={`Alertes actives (${alertes.length})`} />
          {alertes.map((a, i) => (
            <Card key={i} style={{ marginBottom: 12, border: `1px solid ${a.type === "danger" ? C.redLight : C.amberLight}`, borderLeft: `4px solid ${a.type === "danger" ? C.red : C.amber}` }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: a.type === "danger" ? C.redLight : C.amberLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{a.texte}</div>
                  <div style={{ fontSize: 13, color: C.g600 }}>{a.who}</div>
                  <div style={{ fontSize: 11, color: C.g400 }}>Depuis {a.age}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" variant={a.type === "danger" ? "danger" : "secondary"} icon="📧" onClick={() => toast("Message envoyé !")}>Contacter</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => toast("Alerte résolue", "success")}>Résolu ✓</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── CALENDRIER ── */}
      {activePage === "calendrier" && (
        <div>
          <SectionHeader title="Calendrier des stages" />
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Mai 2025 — Activités planifiées</div>
            {[
              { date: "2 mai 2025", type: "Tripartite", who: "Alex Tremblay — Signature protocole", icon: "📋", color: C.blueLight },
              { date: "8 mai 2025", type: "Visite", who: "Jacob Laroche — Best Buy Jonquière", icon: "🚗", color: C.greenLight },
              { date: "15 mai 2025", type: "Réunion", who: "Équipe enseignante — CFP Grand-Fjord", icon: "👥", color: C.amberLight },
              { date: "22 mai 2025", type: "Tripartite", who: "Élizabeth Roy — Bilan final", icon: "⭐", color: C.purpleLight },
              { date: "27 mai 2025", type: "Appel", who: "Groupe VC00001 — Suivi hebdomadaire", icon: "📞", color: C.tealLight },
              { date: "30 mai 2025", type: "Fin de stage", who: "Tous les groupes", icon: "🎓", color: C.greenLight },
            ].map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.g50}` }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: e.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{e.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{e.type} — {e.who}</div>
                  <div style={{ fontSize: 12, color: C.g400 }}>{e.date}</div>
                </div>
                <Btn size="sm" variant="ghost" onClick={() => toast("Ajouté au calendrier !")}>+ Cal.</Btn>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── TÉLÉCHARGEMENTS ── */}
      {activePage === "telechargements" && (
        <div>
          <SectionHeader title="Téléchargements" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { icon: "📋", titre: "Protocoles de stage", desc: "Protocoles signés — Session P2025", count: 5 },
              { icon: "📊", titre: "Dossiers étudiants", desc: "Export complet par élève (PDF)", count: 7 },
              { icon: "⭐", titre: "Fiches d'appréciation", desc: "Appréciations des superviseurs", count: 4 },
              { icon: "📅", titre: "Grilles de présence", desc: "Présences par élève", count: 7 },
              { icon: "🚗", titre: "Rapports de visites", desc: "Visites et appels de suivi", count: visites.length },
              { icon: "🗜️", titre: "Archive complète", desc: "Tous les documents (.zip)", count: 1 },
            ].map((d, i) => (
              <Card key={i}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{d.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{d.titre}</div>
                <div style={{ fontSize: 12, color: C.g400, marginBottom: 16 }}>{d.desc} · {d.count} fichier{d.count > 1 ? "s" : ""}</div>
                <Btn fullWidth icon="📥" onClick={() => toast(`Téléchargement : ${d.titre}...`)}>Télécharger</Btn>
              </Card>
            ))}
          </div>

          {/* Import CSV milieux de stage */}
          <Card style={{ border: `1.5px solid ${C.tealLight}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: C.tealLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏢</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.teal }}>Importation CSV — Milieux de stage</div>
                <div style={{ fontSize: 12, color: C.g400 }}>Importez en lot les informations de vos milieux de stage partenaires</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.g800, marginBottom: 10 }}>Colonnes requises dans le CSV :</div>
                <div style={{ background: C.g50, borderRadius: 8, padding: "10px 14px", fontFamily: "DM Mono, monospace", fontSize: 11, color: C.g600, marginBottom: 12, lineHeight: 2 }}>
                  nom_commerce, adresse, ville, code_postal<br />
                  superviseur_nom, superviseur_titre<br />
                  superviseur_tel, superviseur_email<br />
                  programme_associe, places_disponibles
                </div>
                <Btn variant="teal" icon="📥" onClick={() => toast("Modèle CSV téléchargé !")}>Télécharger le modèle</Btn>
              </div>
              <div style={{ border: `2px dashed ${C.tealLight}`, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.g900, marginBottom: 6 }}>Importer un fichier CSV</div>
                <div style={{ fontSize: 12, color: C.g400, marginBottom: 18 }}>Les milieux seront ajoutés à la base de données et disponibles pour l'assignation.</div>
                <Btn variant="teal" icon="📤" onClick={() => toast("Import milieux — Backend requis", "info")}>Choisir un fichier</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activePage === "messages" && <MessagesView messages={messages} setMessages={setMessages} />}
    </Shell>
  );
}

// ─── TOS VIEW ─────────────────────────────────────────────────────────────────
function TosView({ onLogout }) {
  const [students, setStudents] = useState(DEMO_STUDENTS_INIT);
  const [groups, setGroups] = useState(DEMO_GROUPS_INIT);
  const [enseignants] = useState(DEMO_ENSEIGNANTS_INIT);
  const [activePage, setActivePage] = useState("tableau");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(null); // groupe à assigner
  const [newStudent, setNewStudent] = useState({ nom: "", email: "", groupe: "", programme: "", milieu: "", adresseMilieu: "", superviseur: "", superviseurTel: "", superviseurEmail: "" });
  const [newGroup, setNewGroup] = useState({ nom: "", programme: "", enseignantId: "" });

  const notifs = [
    { texte: "2 protocoles en attente de signature", time: "Aujourd'hui", read: false },
    { texte: "Import CSV réussi — 3 nouveaux élèves", time: "Hier", read: true },
  ];

  const filtered = students.filter(s => s.nom.toLowerCase().includes(search.toLowerCase()) || String(s.id).includes(search));

  const addStudent = () => {
    if (!newStudent.nom) return;
    const s = { id: 171000 + students.length, ...newStudent, prenom: newStudent.nom.split(" ")[0], enseignantId: groups.find(g => g.id === newStudent.groupe)?.enseignantId || "E1", enseignant: groups.find(g => g.id === newStudent.groupe)?.enseignant || "", protocole: "En attente", heures: 0, objectif: 120, joursCompletes: 0, joursTotal: 16, docs: { protocole: false, journal: false, appreciation: false, rapport: false }, presences: [], journal: [] };
    setStudents([...students, s]);
    setShowAddModal(false);
    setNewStudent({ nom: "", email: "", groupe: "", programme: "", milieu: "", adresseMilieu: "", superviseur: "", superviseurTel: "", superviseurEmail: "" });
    toast(`${s.nom} ajouté(e) !`);
  };

  const addGroup = () => {
    if (!newGroup.nom) return;
    const ens = enseignants.find(e => e.id === newGroup.enseignantId);
    setGroups([...groups, { id: `GRP${Date.now()}`, ...newGroup, enseignant: ens?.nom || "", description: "" }]);
    setShowGroupModal(false);
    setNewGroup({ nom: "", programme: "", enseignantId: "" });
    toast("Groupe créé !");
  };

  const assignEnseignant = (groupeId, enseignantId) => {
    const ens = enseignants.find(e => e.id === enseignantId);
    setGroups(g => g.map(gr => gr.id === groupeId ? { ...gr, enseignantId, enseignant: ens?.nom || "" } : gr));
    setStudents(s => s.map(st => st.groupe === groupeId ? { ...st, enseignantId, enseignant: ens?.nom || "" } : st));
    setShowAssignModal(null);
    toast(`Enseignant assigné au groupe : ${ens?.nom}`);
  };

  const deleteStudent = (id) => { setStudents(s => s.filter(x => x.id !== id)); toast("Élève supprimé", "warning"); };

  const pages = [
    { id: "tableau", label: "Tableau de bord", icon: "🏠" },
    { id: "groupes", label: "Groupes", icon: "👥" },
    { id: "eleves", label: "Élèves", icon: "🎓" },
    { id: "protocoles", label: "Protocoles", icon: "📋" },
    { id: "csv", label: "Importation CSV", icon: "📤" },
    { id: "rapports", label: "Rapports", icon: "📊" },
    { id: "utilisateurs", label: "Utilisateurs", icon: "👤" },
    { id: "parametres", label: "Paramètres", icon: "⚙️" },
  ];

  return (
    <Shell role="TOS" pages={pages} activePage={activePage} setActivePage={setActivePage} onLogout={onLogout}
      title="Administration" subtitle="Gestion des élèves, groupes et protocoles" notifs={notifs}>

      {activePage === "tableau" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard label="Élèves actifs" value={students.length} icon="🎓" color={C.blue} />
            <StatCard label="Protocoles signés" value={students.filter(s => s.protocole === "Signé").length} icon="✅" color={C.green} />
            <StatCard label="En attente" value={students.filter(s => s.protocole !== "Signé").length} icon="⚠️" color={C.amber} />
            <StatCard label="Groupes actifs" value={groups.length} icon="👥" color={C.purple} />
          </div>
          <SectionHeader title="Gestion des élèves" action={<div style={{ display: "flex", gap: 10 }}><Btn variant="secondary" icon="📤" onClick={() => setActivePage("csv")}>Import CSV</Btn><Btn icon="+" onClick={() => setShowAddModal(true)}>Ajouter un élève</Btn></div>} />
          <div style={{ position: "relative", marginBottom: 16 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un élève..."
              style={{ width: "100%", padding: "9px 14px 9px 36px", border: `1.5px solid ${C.g200}`, borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "DM Sans, sans-serif" }} />
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
          </div>
          <Table cols={[
            { label: "Élève", render: r => <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar name={r.nom} size={30} color={C.blue} /><div><div style={{ fontWeight: 600 }}>{r.nom}</div><div style={{ fontSize: 11, color: C.g400, fontFamily: "DM Mono, monospace" }}>{r.id}</div></div></div> },
            { label: "Groupe", key: "groupe" },
            { label: "Milieu", key: "milieu" },
            { label: "Superviseur", key: "superviseur" },
            { label: "Protocole", render: r => <Badge status={r.protocole} /> },
            { label: "Actions", render: r => <div style={{ display: "flex", gap: 6 }}><Btn size="sm" variant="outline" onClick={() => toast("Modification de " + r.nom)}>✏️</Btn><Btn size="sm" variant="danger" onClick={() => deleteStudent(r.id)}>🗑️</Btn></div> },
          ]} rows={filtered} emptyMsg="Aucun élève trouvé" />
        </div>
      )}

      {/* ── GROUPES avec assignation enseignant ── */}
      {activePage === "groupes" && (
        <div>
          <SectionHeader title="Gestion des groupes" action={<Btn icon="+" onClick={() => setShowGroupModal(true)}>Créer un groupe</Btn>} />
          <Table cols={[
            { label: "Groupe", render: r => <strong>{r.nom}</strong> },
            { label: "Programme", key: "programme" },
            { label: "Enseignant assigné", render: r => (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {r.enseignant ? <span style={{ fontWeight: 600, color: C.g900 }}>{r.enseignant}</span> : <Badge status="En attente" />}
                <Btn size="sm" variant="teal" icon="👤" onClick={() => setShowAssignModal(r)}>Changer</Btn>
              </div>
            )},
            { label: "Nb élèves", render: r => <span style={{ background: C.blueLight, color: C.blue, padding: "3px 10px", borderRadius: 20, fontWeight: 700, fontSize: 13 }}>{students.filter(s => s.groupe === r.id).length}</span> },
            { label: "Actions", render: r => <div style={{ display: "flex", gap: 6 }}><Btn size="sm" variant="secondary" onClick={() => toast("Modification du groupe")}>Modifier</Btn></div> },
          ]} rows={groups} />

          {/* Modals */}
          <Modal open={showGroupModal} onClose={() => setShowGroupModal(false)} title="Créer un groupe">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Nom du groupe" value={newGroup.nom} onChange={v => setNewGroup({ ...newGroup, nom: v })} required placeholder="Ex: Vente-Conseil 5321 C" />
              <Select label="Programme" value={newGroup.programme} onChange={v => setNewGroup({ ...newGroup, programme: v })} options={["DEP Vente-conseil", "DEP Comptabilité", "DEP Secrétariat", "ASP Représentation", "ASP Secrétariat juridique"]} placeholder="Choisir" />
              <Select label="Enseignant responsable" value={newGroup.enseignantId} onChange={v => setNewGroup({ ...newGroup, enseignantId: v })} options={enseignants.filter(e => e.actif).map(e => ({ value: e.id, label: e.nom }))} placeholder="Choisir un enseignant" />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={() => setShowGroupModal(false)}>Annuler</Btn>
                <Btn onClick={addGroup} disabled={!newGroup.nom}>Créer</Btn>
              </div>
            </div>
          </Modal>

          <Modal open={!!showAssignModal} onClose={() => setShowAssignModal(null)} title={`Assigner un enseignant — ${showAssignModal?.nom}`}>
            <div style={{ marginBottom: 16, padding: 14, background: C.g50, borderRadius: 10 }}>
              <div style={{ fontSize: 13, color: C.g600 }}>Enseignant actuel : <strong>{showAssignModal?.enseignant || "Aucun"}</strong></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {enseignants.filter(e => e.actif).map(e => (
                <div key={e.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 16px", border: `1.5px solid ${showAssignModal?.enseignantId === e.id ? C.blue : C.g200}`, borderRadius: 12, cursor: "pointer", background: showAssignModal?.enseignantId === e.id ? C.blueLight + "50" : "#fff" }}
                  onClick={() => assignEnseignant(showAssignModal.id, e.id)}>
                  <Avatar name={e.nom} size={40} color={C.blue} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{e.nom}</div>
                    <div style={{ fontSize: 12, color: C.g600 }}>{e.programme} · {e.email}</div>
                    <div style={{ fontSize: 12, color: C.g400 }}>{e.tel}</div>
                  </div>
                  {showAssignModal?.enseignantId === e.id && <span style={{ fontSize: 20 }}>✅</span>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
              <Btn variant="secondary" onClick={() => setShowAssignModal(null)}>Fermer</Btn>
            </div>
          </Modal>
        </div>
      )}

      {activePage === "eleves" && (
        <div>
          <SectionHeader title="Liste des élèves" action={<Btn icon="+" onClick={() => setShowAddModal(true)}>Ajouter</Btn>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {students.map(s => (
              <Card key={s.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Avatar name={s.nom} size={36} color={C.blue} />
                    <div><div style={{ fontWeight: 700, fontSize: 14 }}>{s.nom}</div><div style={{ fontSize: 11, color: C.g400, fontFamily: "DM Mono, monospace" }}>{s.id}</div></div>
                  </div>
                  <Badge status={s.protocole} />
                </div>
                <div style={{ fontSize: 12, color: C.g600, lineHeight: 1.8 }}>
                  <div>📚 {s.programme.split(" ")[0]} {s.programme.split(" ")[1]}</div>
                  <div>👥 {s.groupe}</div>
                  <div>🏢 {s.milieu}</div>
                  <div>📍 {s.adresseMilieu}</div>
                </div>
                <div style={{ marginTop: 10 }}><ProgressBar value={s.heures} max={s.objectif} /></div>
                <div style={{ fontSize: 11, color: C.g400, marginTop: 4 }}>{s.heures}/{s.objectif} h · {pct(s.heures, s.objectif)}%</div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <Btn size="sm" variant="outline" fullWidth onClick={() => toast("Modification de " + s.nom)}>✏️ Modifier</Btn>
                  <Btn size="sm" variant="danger" onClick={() => deleteStudent(s.id)}>🗑️</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activePage === "protocoles" && (
        <div>
          <SectionHeader title="Gestion des protocoles" action={<Btn variant="secondary" icon="📥" onClick={() => toast("Export généré !")}>Exporter tout</Btn>} />
          <Table cols={[
            { label: "Élève", render: r => <strong>{r.nom}</strong> },
            { label: "Groupe", key: "groupe" },
            { label: "Superviseur", key: "superviseur" },
            { label: "Statut", render: r => <Badge status={r.protocole} /> },
            { label: "Date", render: r => r.protocole === "Signé" ? "2 mai 2025" : "—" },
            { label: "Action", render: r => r.protocole === "Signé"
              ? <Btn size="sm" variant="success" icon="📥" onClick={() => toast("PDF téléchargé !")}>Télécharger</Btn>
              : <Btn size="sm" variant="secondary" icon="📧" onClick={() => toast("Rappel envoyé !", "warning")}>Rappel</Btn> },
          ]} rows={students} />
        </div>
      )}

      {activePage === "csv" && (
        <div>
          <SectionHeader title="Importation CSV" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Structure du fichier</div>
              <div style={{ fontSize: 12, color: C.g400, marginBottom: 12, fontFamily: "DM Mono, monospace", background: C.g50, padding: "12px 14px", borderRadius: 8, lineHeight: 2 }}>nom, email, programme, groupe, milieu, adresse, superviseur, tel_sup, email_sup</div>
              {["Nom complet", "Courriel institutionnel", "Code du programme", "Code du groupe", "Nom du milieu", "Adresse du milieu", "Nom du superviseur", "Téléphone superviseur", "Courriel superviseur"].map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.g50}` }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: C.blueLight, color: C.blue, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 13 }}>{c}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}><Btn fullWidth variant="secondary" icon="📥" onClick={() => toast("Modèle CSV téléchargé !")}>Télécharger le modèle</Btn></div>
            </Card>
            <Card style={{ border: `2px dashed ${C.g200}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 36 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>📂</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Importer un fichier CSV</div>
              <div style={{ fontSize: 13, color: C.g400, marginBottom: 24 }}>Glissez-déposez votre fichier ou cliquez pour parcourir</div>
              <Btn icon="📤" onClick={() => toast("Import — Backend requis", "info")}>Choisir un fichier</Btn>
            </Card>
          </div>
        </div>
      )}

      {activePage === "rapports" && (
        <div>
          <SectionHeader title="Rapports" action={<Btn icon="📥" onClick={() => toast("Rapport complet généré !")}>Exporter tout</Btn>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { icon: "🎓", titre: "Élèves actifs", val: `${students.length} élèves en stage` },
              { icon: "⏱️", titre: "Heures cumulées", val: `${students.reduce((a, s) => a + s.heures, 0)} h au total` },
              { icon: "✅", titre: "Protocoles signés", val: `${students.filter(s => s.protocole === "Signé").length}/${students.length}` },
              { icon: "👥", titre: "Groupes", val: `${groups.length} groupes actifs` },
            ].map((r, i) => (
              <Card key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{r.icon}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{r.titre}</div><div style={{ fontWeight: 900, fontSize: 20, color: C.blue }}>{r.val}</div></div>
                <Btn size="sm" variant="secondary" icon="📥" onClick={() => toast("Export généré !")}>Export</Btn>
              </Card>
            ))}
          </div>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Par groupe</div>
            {groups.map(g => {
              const gs = students.filter(s => s.groupe === g.id);
              const avg = gs.length ? Math.round(gs.reduce((a, s) => a + s.heures, 0) / gs.length) : 0;
              const sp = gs.length ? Math.round(gs.filter(s => s.protocole === "Signé").length / gs.length * 100) : 0;
              return (
                <div key={g.id} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.g50}`, gap: 16 }}>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{g.nom}</div><div style={{ fontSize: 12, color: C.g400 }}>{g.enseignant || "Aucun enseignant"}</div></div>
                  <div style={{ textAlign: "center", minWidth: 60 }}><div style={{ fontWeight: 800, fontSize: 20, color: C.blue }}>{gs.length}</div><div style={{ fontSize: 10, color: C.g400 }}>élèves</div></div>
                  <div style={{ textAlign: "center", minWidth: 70 }}><div style={{ fontWeight: 800, fontSize: 20, color: C.green }}>{avg} h</div><div style={{ fontSize: 10, color: C.g400 }}>moy.</div></div>
                  <div style={{ textAlign: "center", minWidth: 70 }}><div style={{ fontWeight: 800, fontSize: 20, color: sp >= 80 ? C.green : C.amber }}>{sp}%</div><div style={{ fontSize: 10, color: C.g400 }}>protocoles</div></div>
                  <Btn size="sm" variant="secondary" icon="📥" onClick={() => toast(`Rapport ${g.nom} exporté`)}>Export</Btn>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {activePage === "utilisateurs" && (
        <div>
          <SectionHeader title="Utilisateurs" />
          <Table cols={[
            { label: "Utilisateur", render: r => <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar name={r.nom} size={32} color={r.color} /><div><div style={{ fontWeight: 600 }}>{r.nom}</div><div style={{ fontSize: 11, color: C.g400 }}>{r.email}</div></div></div> },
            { label: "Rôle", render: r => <span style={{ background: r.bg, color: r.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{r.role}</span> },
            { label: "Statut", render: () => <Badge status="Actif" /> },
            { label: "Dernière connexion", key: "last" },
            { label: "", render: r => <Btn size="sm" variant="secondary" onClick={() => toast("Gestion de " + r.nom)}>Gérer</Btn> },
          ]} rows={[
            { nom: "Marie-Anne Bouchard", email: "m.bouchard@csrsaguenay.qc.ca", role: "Enseignante", color: C.purple, bg: C.purpleLight, last: "Aujourd'hui" },
            { nom: "Jean-Pierre Lafleur", email: "jp.lafleur@csrsaguenay.qc.ca", role: "Enseignant", color: C.purple, bg: C.purpleLight, last: "Hier" },
            { nom: "Alex Tremblay", email: "alex.tremblay@eleve.csrsaguenay.qc.ca", role: "Élève", color: C.blue, bg: C.blueLight, last: "Aujourd'hui" },
            { nom: "Marc Bouchard", email: "marc.b@sportsexperts.ca", role: "Superviseur", color: C.green, bg: C.greenLight, last: "8 mai" },
          ]} />
        </div>
      )}

      {activePage === "parametres" && (
        <div>
          <SectionHeader title="Paramètres" />
          <Card style={{ maxWidth: 600 }}>
            {[["CFP", "CFP du Grand-Fjord — Pavillon CFOR@distance"],["Adresse", "731 boul. de la Grande-Baie Nord, La Baie (QC) G7B 3K5"],["Année scolaire", "2025-2026"],["Session active", "Printemps 2025"],["Objectif heures", "120 heures"],["Courriel admin", "stage@cfpgrandfjord.qc.ca"],["Téléphone", "418-697-7442 poste 6922"],["Directrice adjointe", "Isabelle Larouche"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${C.g50}` }}>
                <div style={{ fontSize: 14, color: C.g600, fontWeight: 600 }}>{k}</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 14, color: C.g900 }}>{v}</div>
                  <Btn size="sm" variant="ghost" onClick={() => toast("Modification — Backend requis", "info")}>✏️</Btn>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Modal ajout élève */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Ajouter un élève" wide>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          <Input label="Nom complet" value={newStudent.nom} onChange={v => setNewStudent({ ...newStudent, nom: v })} required placeholder="Prénom Nom" />
          <Input label="Courriel" type="email" value={newStudent.email} onChange={v => setNewStudent({ ...newStudent, email: v })} placeholder="prenom.nom@eleve..." />
          <Select label="Programme" value={newStudent.programme} onChange={v => setNewStudent({ ...newStudent, programme: v })} options={["DEP Vente-conseil 5321", "DEP Comptabilité 5231", "DEP Secrétariat 5357", "ASP Représentation 5323", "ASP Secrétariat juridique 5373", "ASP Secrétariat médical 5374"]} placeholder="Choisir" />
          <Select label="Groupe" value={newStudent.groupe} onChange={v => setNewStudent({ ...newStudent, groupe: v })} options={groups.map(g => ({ value: g.id, label: g.nom }))} placeholder="Choisir" />
          <Input label="Milieu de stage" value={newStudent.milieu} onChange={v => setNewStudent({ ...newStudent, milieu: v })} placeholder="Nom du commerce" />
          <Input label="Adresse du milieu" value={newStudent.adresseMilieu} onChange={v => setNewStudent({ ...newStudent, adresseMilieu: v })} placeholder="Adresse complète" />
          <Input label="Superviseur" value={newStudent.superviseur} onChange={v => setNewStudent({ ...newStudent, superviseur: v })} placeholder="Nom du superviseur" />
          <Input label="Tél. superviseur" value={newStudent.superviseurTel} onChange={v => setNewStudent({ ...newStudent, superviseurTel: v })} placeholder="418-555-0000" />
          <Input label="Courriel superviseur" value={newStudent.superviseurEmail} onChange={v => setNewStudent({ ...newStudent, superviseurEmail: v })} placeholder="superviseur@entreprise.ca" />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
          <Btn variant="secondary" onClick={() => setShowAddModal(false)}>Annuler</Btn>
          <Btn icon="✅" onClick={addStudent} disabled={!newStudent.nom}>Ajouter l'élève</Btn>
        </div>
      </Modal>
    </Shell>
  );
}

// ─── DIRECTION VIEW ────────────────────────────────────────────────────────────
function DirectionView({ onLogout }) {
  const [students] = useState(DEMO_STUDENTS_INIT);
  const [enseignants, setEnseignants] = useState(DEMO_ENSEIGNANTS_INIT);
  const [groups, setGroups] = useState(DEMO_GROUPS_INIT);
  const [activePage, setActivePage] = useState("tableau");
  const [showAddEnsModal, setShowAddEnsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(null); // enseignant à assigner ou réassigner
  const [editEns, setEditEns] = useState(null);
  const [newEns, setNewEns] = useState({ nom: "", email: "", tel: "", programme: "" });

  const notifs = [
    { texte: "12 protocoles non signés — Action requise", time: "Aujourd'hui", read: false },
    { texte: "Rapport mensuel disponible", time: "Hier", read: false },
    { texte: "Réunion tripartite — 22 mai planifiée", time: "Il y a 2 jours", read: true },
  ];

  const totalH = students.reduce((a, s) => a + s.heures, 0);
  const signed = students.filter(s => s.protocole === "Signé").length;

  const addEnseignant = () => {
    if (!newEns.nom || !newEns.email) { toast("Nom et courriel requis", "error"); return; }
    setEnseignants([...enseignants, { id: `E${Date.now()}`, ...newEns, actif: true }]);
    setShowAddEnsModal(false);
    setNewEns({ nom: "", email: "", tel: "", programme: "" });
    toast(`${newEns.nom} ajouté(e) comme enseignant(e) !`);
  };

  const toggleActif = (id) => {
    setEnseignants(e => e.map(x => x.id === id ? { ...x, actif: !x.actif } : x));
    const ens = enseignants.find(e => e.id === id);
    toast(`${ens?.nom} ${ens?.actif ? "désactivé" : "réactivé"}`, ens?.actif ? "warning" : "success");
  };

  const deleteEnseignant = (id) => {
    const ens = enseignants.find(e => e.id === id);
    setEnseignants(e => e.filter(x => x.id !== id));
    toast(`${ens?.nom} retiré(e)`, "warning");
  };

  const assignGroup = (enseignantId, groupeId) => {
    const ens = enseignants.find(e => e.id === enseignantId);
    setGroups(g => g.map(gr => gr.id === groupeId ? { ...gr, enseignantId, enseignant: ens?.nom || "" } : gr));
    setShowAssignModal(null);
    toast(`Groupe assigné à ${ens?.nom}`);
  };

  const barData = [{ mois: "Janv.", h: 2800 }, { mois: "Fév.", h: 6400 }, { mois: "Mars", h: 9800 }, { mois: "Avr.", h: 12200 }, { mois: "Mai", h: totalH }];
  const donutSegs = [{ value: 45, color: C.blue, label: "Vente-conseil", pct: "45%" }, { value: 25, color: C.purple, label: "Comptabilité", pct: "25%" }, { value: 15, color: C.amber, label: "Secrétariat", pct: "15%" }, { value: 15, color: C.g200, label: "Autres", pct: "15%" }];

  const pages = [
    { id: "tableau", label: "Tableau de bord", icon: "🏠" },
    { id: "enseignants", label: "Enseignants", icon: "📚" },
    { id: "rapports", label: "Rapports", icon: "📊" },
    { id: "utilisateurs", label: "Utilisateurs", icon: "👤" },
    { id: "statistiques", label: "Statistiques", icon: "📈" },
    { id: "parametres", label: "Paramètres", icon: "⚙️" },
  ];

  return (
    <Shell role="Direction" pages={pages} activePage={activePage} setActivePage={setActivePage} onLogout={onLogout}
      title="Tableau de bord Direction" subtitle="CFP du Grand-Fjord — Pavillon CFOR@distance" notifs={notifs}
      headerActions={<Btn icon="📥" onClick={() => toast("Rapport complet exporté !")}>Exporter le rapport</Btn>}>

      {activePage === "tableau" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard label="Élèves actifs" value="128" sub="+12% session précédente" icon="🎓" color={C.blue} onClick={() => setActivePage("statistiques")} />
            <StatCard label="Heures cumulées" value={`${totalH} h`} sub="+8% session précédente" icon="⏱️" color={C.green} />
            <StatCard label="Milieux de stage" value="45" sub="5 nouveaux cette session" icon="🏢" color={C.purple} />
            <StatCard label="Enseignants actifs" value={enseignants.filter(e => e.actif).length} sub="Voir la gestion →" icon="📚" color={C.amber} onClick={() => setActivePage("enseignants")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Évolution des heures cumulées</div>
              <MiniBarChart data={barData} labelKey="mois" valueKey="h" color={C.blue} height={160} />
            </Card>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Répartition par programme</div>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ flexShrink: 0 }}><DonutChart segments={donutSegs} size={120} stroke={18} /></div>
                <div style={{ flex: 1 }}>
                  {donutSegs.map(s => (
                    <div key={s.label} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                      <div style={{ fontSize: 12, flex: 1 }}>{s.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{s.pct}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Alertes globales</div>
              {[{ icon: "🟡", texte: "Protocoles non signés", count: 2, bg: C.amberLight, color: C.amber }, { icon: "🔴", texte: "Rapports finaux manquants", count: 7, bg: C.redLight, color: C.red }, { icon: "🔴", texte: "Journaux de bord manquants", count: 2, bg: C.redLight, color: C.red }].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 16px", background: a.bg, borderRadius: 11, marginBottom: 10, gap: 14 }}>
                  <div style={{ fontSize: 22 }}>{a.icon}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{a.texte}</div>
                  <div style={{ fontWeight: 900, fontSize: 22, color: a.color }}>{a.count}</div>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Activités récentes</div>
              {[{ icon: "📚", texte: "Nouvel enseignant ajouté — P. Tremblay", date: "Aujourd'hui", color: C.purpleLight }, { icon: "🏢", texte: "Nouveau milieu — Café Arvida", date: "Hier", color: C.blueLight }, { icon: "📊", texte: "Rapport mensuel généré", date: "8 mai", color: C.amberLight }, { icon: "✅", texte: "Protocole signé — Sarah Bergeron", date: "7 mai", color: C.greenLight }].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.g50}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                  <div><div style={{ fontSize: 13, fontWeight: 500 }}>{a.texte}</div><div style={{ fontSize: 11, color: C.g400 }}>{a.date}</div></div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── GESTION ENSEIGNANTS ── */}
      {activePage === "enseignants" && (
        <div>
          <SectionHeader title="Gestion des enseignants" action={<Btn icon="+" onClick={() => setShowAddEnsModal(true)}>Ajouter un enseignant</Btn>} />

          {/* Stats rapides */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
            <StatCard label="Enseignants actifs" value={enseignants.filter(e => e.actif).length} icon="📚" color={C.green} />
            <StatCard label="Enseignants inactifs" value={enseignants.filter(e => !e.actif).length} icon="🔴" color={C.red} />
            <StatCard label="Groupes non assignés" value={groups.filter(g => !g.enseignantId).length} icon="⚠️" color={C.amber} />
          </div>

          {/* Tableau enseignants */}
          <Card style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Liste des enseignants</div>
            <Table cols={[
              { label: "Enseignant", render: r => <div style={{ display: "flex", gap: 12, alignItems: "center" }}><Avatar name={r.nom} size={36} color={r.actif ? C.purple : C.g400} /><div><div style={{ fontWeight: 700 }}>{r.nom}</div><div style={{ fontSize: 12, color: C.g400 }}>{r.email}</div><div style={{ fontSize: 12, color: C.g400 }}>{r.tel}</div></div></div> },
              { label: "Programme", key: "programme" },
              { label: "Groupes assignés", render: r => {
                const gs = groups.filter(g => g.enseignantId === r.id);
                return gs.length > 0
                  ? <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{gs.map(g => <span key={g.id} style={{ background: C.blueLight, color: C.blue, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{g.nom}</span>)}</div>
                  : <span style={{ color: C.amber, fontSize: 12 }}>Aucun groupe</span>;
              }},
              { label: "Statut", render: r => <Badge status={r.actif ? "Actif" : "Inactif"} /> },
              { label: "Actions", render: r => (
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn size="sm" variant="outline" icon="👥" onClick={() => setShowAssignModal(r)}>Assigner groupe</Btn>
                  <Btn size="sm" variant={r.actif ? "secondary" : "success"} onClick={() => toggleActif(r.id)}>{r.actif ? "Désactiver" : "Réactiver"}</Btn>
                  <Btn size="sm" variant="danger" onClick={() => deleteEnseignant(r.id)}>🗑️</Btn>
                </div>
              )},
            ]} rows={enseignants} />
          </Card>

          {/* Groupes et assignations */}
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Assignations par groupe</div>
            <Table cols={[
              { label: "Groupe", render: r => <strong>{r.nom}</strong> },
              { label: "Programme", key: "programme" },
              { label: "Enseignant assigné", render: r => r.enseignant
                ? <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar name={r.enseignant} size={28} color={C.purple} /><span style={{ fontWeight: 600 }}>{r.enseignant}</span></div>
                : <Badge status="En attente" /> },
              { label: "Élèves", render: r => students.filter(s => s.groupe === r.id).length },
              { label: "Changer", render: r => {
                const [selEns, setSelEns] = useState(r.enseignantId || "");
                return (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <select value={selEns} onChange={e => setSelEns(e.target.value)} style={{ padding: "5px 10px", border: `1.5px solid ${C.g200}`, borderRadius: 8, fontSize: 12, fontFamily: "DM Sans, sans-serif" }}>
                      <option value="">— Choisir —</option>
                      {enseignants.filter(e => e.actif).map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
                    </select>
                    <Btn size="sm" variant="teal" onClick={() => selEns && assignGroup(selEns, r.id)}>✅</Btn>
                  </div>
                );
              }},
            ]} rows={groups} />
          </Card>

          {/* Modal ajouter enseignant */}
          <Modal open={showAddEnsModal} onClose={() => setShowAddEnsModal(false)} title="Ajouter un enseignant">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Nom complet" value={newEns.nom} onChange={v => setNewEns({ ...newEns, nom: v })} required placeholder="Prénom Nom" />
              <Input label="Courriel" type="email" value={newEns.email} onChange={v => setNewEns({ ...newEns, email: v })} required placeholder="prenom.nom@csrsaguenay.qc.ca" />
              <Input label="Téléphone" value={newEns.tel} onChange={v => setNewEns({ ...newEns, tel: v })} placeholder="418-697-7442 poste XXXX" />
              <Select label="Programme principal" value={newEns.programme} onChange={v => setNewEns({ ...newEns, programme: v })} options={["DEP Vente-conseil", "DEP Comptabilité", "DEP Secrétariat", "ASP Représentation", "ASP Secrétariat juridique", "ASP Secrétariat médical"]} placeholder="Choisir un programme" />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={() => setShowAddEnsModal(false)}>Annuler</Btn>
                <Btn icon="✅" onClick={addEnseignant} disabled={!newEns.nom || !newEns.email}>Ajouter</Btn>
              </div>
            </div>
          </Modal>

          {/* Modal assigner groupes à un enseignant */}
          <Modal open={!!showAssignModal} onClose={() => setShowAssignModal(null)} title={`Assigner des groupes — ${showAssignModal?.nom}`} wide>
            <div style={{ fontSize: 13, color: C.g600, marginBottom: 16 }}>Cochez les groupes à assigner à cet enseignant :</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {groups.map(g => {
                const assigned = g.enseignantId === showAssignModal?.id;
                return (
                  <div key={g.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 16px", border: `1.5px solid ${assigned ? C.purple : C.g200}`, borderRadius: 12, cursor: "pointer", background: assigned ? C.purpleLight + "40" : "#fff" }}
                    onClick={() => assignGroup(showAssignModal.id, g.id)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{g.nom}</div>
                      <div style={{ fontSize: 12, color: C.g400 }}>{g.programme} · {students.filter(s => s.groupe === g.id).length} élèves</div>
                      {g.enseignant && g.enseignantId !== showAssignModal?.id && <div style={{ fontSize: 11, color: C.amber, marginTop: 2 }}>⚠️ Actuellement : {g.enseignant}</div>}
                    </div>
                    {assigned && <span style={{ fontSize: 20 }}>✅</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
              <Btn variant="secondary" onClick={() => setShowAssignModal(null)}>Fermer</Btn>
            </div>
          </Modal>
        </div>
      )}

      {activePage === "rapports" && (
        <div>
          <SectionHeader title="Rapports" action={<Btn icon="📥" onClick={() => toast("Rapport complet exporté !")}>Tout exporter</Btn>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {[
              { icon: "👥", titre: "Élèves actifs", val: `${students.length} élèves`, sub: "Session Printemps 2025" },
              { icon: "⏱️", titre: "Heures cumulées", val: `${totalH} h`, sub: "Session en cours" },
              { icon: "🚗", titre: "Visites effectuées", val: "32 visites", sub: "Sur 45 planifiées" },
              { icon: "📋", titre: "Protocoles", val: `${signed}/${students.length} signés`, sub: `${students.length - signed} en attente` },
              { icon: "📊", titre: "Complétion documents", val: "67%", sub: "Moyenne par élève" },
              { icon: "🎓", titre: "Taux de réussite", val: "89%", sub: "Élèves en bonne voie" },
            ].map((r, i) => (
              <Card key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.g600 }}>{r.titre}</div>
                  <div style={{ fontWeight: 900, fontSize: 20, color: C.blue }}>{r.val}</div>
                  <div style={{ fontSize: 11, color: C.g400 }}>{r.sub}</div>
                </div>
                <Btn size="sm" variant="secondary" icon="📥" onClick={() => toast("Export généré !")}>Export</Btn>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activePage === "utilisateurs" && (
        <div>
          <SectionHeader title="Utilisateurs" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard label="Enseignants" value={enseignants.filter(e => e.actif).length} icon="📚" color={C.purple} />
            <StatCard label="Superviseurs" value="45" icon="🏢" color={C.green} />
            <StatCard label="Élèves" value="128" icon="🎓" color={C.blue} />
            <StatCard label="Admins" value="3" icon="⚙️" color={C.amber} />
          </div>
          <Table cols={[
            { label: "Utilisateur", render: r => <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar name={r.nom} size={34} color={r.color} /><div><div style={{ fontWeight: 600 }}>{r.nom}</div><div style={{ fontSize: 11, color: C.g400 }}>{r.email}</div></div></div> },
            { label: "Rôle", render: r => <span style={{ background: r.bg, color: r.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{r.role}</span> },
            { label: "Statut", render: () => <Badge status="Actif" /> },
            { label: "Dernière connexion", key: "last" },
            { label: "", render: r => <Btn size="sm" variant="secondary" onClick={() => toast("Gestion de " + r.nom)}>Gérer</Btn> },
          ]} rows={[
            { nom: "Isabelle Larouche", email: "isabelle.larouche2@csrsaguenay.qc.ca", role: "Direction", color: C.amber, bg: C.amberLight, last: "Aujourd'hui" },
            { nom: "Marie-Anne Bouchard", email: "m.bouchard@csrsaguenay.qc.ca", role: "Enseignante", color: C.purple, bg: C.purpleLight, last: "Aujourd'hui" },
            { nom: "Jean-Pierre Lafleur", email: "jp.lafleur@csrsaguenay.qc.ca", role: "Enseignant", color: C.purple, bg: C.purpleLight, last: "Hier" },
            { nom: "Alex Tremblay", email: "alex.tremblay@eleve.csrsaguenay.qc.ca", role: "Élève", color: C.blue, bg: C.blueLight, last: "Aujourd'hui" },
          ]} />
        </div>
      )}

      {activePage === "statistiques" && (
        <div>
          <SectionHeader title="Statistiques" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
            <StatCard label="Complétion moy." value="67%" icon="📊" color={C.blue} />
            <StatCard label="Protocoles signés" value={`${signed}/${students.length}`} icon="✅" color={C.green} />
            <StatCard label="Milieux partenaires" value="45" icon="🏢" color={C.purple} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Distribution des heures</div>
              {[{ range: "0 – 30 h", n: 2, color: C.red }, { range: "31 – 60 h", n: 1, color: C.amber }, { range: "61 – 90 h", n: 2, color: C.blue }, { range: "91 – 120 h", n: 2, color: C.green }].map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 90, fontSize: 12, color: C.g600 }}>{d.range}</div>
                  <div style={{ flex: 1, background: C.g100, borderRadius: 8, height: 28, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${d.n * 14}%`, background: d.color, borderRadius: 8, display: "flex", alignItems: "center", paddingLeft: 10, minWidth: d.n > 0 ? 40 : 0 }}>
                      {d.n > 0 && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{d.n} élève{d.n > 1 ? "s" : ""}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Protocoles par groupe</div>
              {groups.map(g => {
                const gs = students.filter(s => s.groupe === g.id);
                const ok = gs.filter(s => s.protocole === "Signé").length;
                return (
                  <div key={g.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{g.nom}</div>
                      <div style={{ fontSize: 12, color: C.g400 }}>{ok}/{gs.length}</div>
                    </div>
                    <ProgressBar value={ok} max={gs.length || 1} color={ok === gs.length ? C.green : C.amber} height={8} />
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      )}

      {activePage === "parametres" && (
        <div>
          <SectionHeader title="Paramètres de la plateforme" />
          <Card style={{ maxWidth: 620 }}>
            {[["Établissement", "CFP du Grand-Fjord"],["Pavillon", "CFOR@distance"],["Adresse", "731 boul. de la Grande-Baie Nord, La Baie (QC) G7B 3K5"],["Directrice adjointe", "Isabelle Larouche"],["Téléphone", "418-697-7442"],["Année scolaire", "2025-2026"],["Session active", "Printemps 2025"],["Objectif heures", "120 h"],["Langue", "Français (Canada)"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.g50}` }}>
                <div style={{ fontSize: 14, color: C.g600, fontWeight: 600 }}>{k}</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 14 }}>{v}</div>
                  <Btn size="sm" variant="ghost" onClick={() => toast("Modification — Backend requis", "info")}>✏️</Btn>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </Shell>
  );
}

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [selected, setSelected] = useState(null);
  const profiles = [
    { role: "Élève", icon: "🎓", desc: "Suivre mon stage" },
    { role: "Superviseur", icon: "🏢", desc: "Encadrer un stagiaire" },
    { role: "Enseignant", icon: "📚", desc: "Gérer mes groupes" },
    { role: "Direction", icon: "🏛️", desc: "Vue d'ensemble" },
    { role: "TOS", icon: "⚙️", desc: "Administration" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.navy} 0%, #1e3a5f 60%, ${C.navy} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif", position: "relative", overflow: "hidden" }}>
      {[300, 500, 700].map(s => <div key={s} style={{ position: "absolute", width: s, height: s, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />)}
      <div style={{ textAlign: "center", marginBottom: 40, zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M 100 10 A 90 90 0 1 1 99.9 10" fill="none" stroke="#5FAD9B" strokeWidth="14" strokeLinecap="round" strokeDasharray="480 570" strokeDashoffset="-50" />
            <polygon points="55,145 100,70 145,145" fill="#5FAD9B" />
            <polygon points="90,145 135,75 180,145" fill="#1A3D7C" />
            <ellipse cx="100" cy="152" rx="72" ry="18" fill="#E8A020" />
            <path d="M 28 148 Q 64 138 100 148 Q 136 158 172 148 L 172 168 Q 136 178 100 168 Q 64 158 28 168 Z" fill="#1A3D7C" opacity="0.25" />
          </svg>
        </div>
        <div style={{ fontSize: 46, fontWeight: 900, color: "#fff", letterSpacing: 6, fontFamily: "DM Mono, monospace" }}>S.T.A.G.E.</div>
        <div style={{ fontSize: 13, color: "#5FAD9B", marginTop: 6, fontWeight: 600 }}>Système de Transmission et d'Accompagnement en Gestion des Élèves en stage</div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 6, letterSpacing: 2, textTransform: "uppercase" }}>Suivi · Travail · Apprentissage · Gestion · Encadrement</div>
        <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 10 }}>La plateforme complète pour gérer, suivre et accompagner les élèves en stage.</div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: "24px 20px", maxWidth: 580, width: "95%", zIndex: 1 }}>
        <div style={{ color: "#cbd5e1", fontSize: 13, textAlign: "center", marginBottom: 22, fontWeight: 500 }}>Sélectionnez votre profil pour vous connecter</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 10, marginBottom: 26 }}>
          {profiles.map(p => (
            <div key={p.role} onClick={() => setSelected(p)}
              style={{ background: selected?.role === p.role ? C.blue : "rgba(255,255,255,0.05)", border: `1.5px solid ${selected?.role === p.role ? C.blue : "rgba(255,255,255,0.1)"}`, borderRadius: 14, padding: "16px 8px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{p.role}</div>
              <div style={{ color: "#64748b", fontSize: 10, marginTop: 3 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <button onClick={() => selected && onLogin(selected.role)} disabled={!selected}
          style={{ width: "100%", padding: "14px 0", background: selected ? C.blue : "rgba(255,255,255,0.07)", color: selected ? "#fff" : "#475569", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: selected ? "pointer" : "default", fontFamily: "DM Sans, sans-serif" }}>
          {selected ? `Se connecter en tant que ${selected.role}` : "Choisissez un profil"}
        </button>
        <div style={{ textAlign: "center", marginTop: 14, color: "#334155", fontSize: 12 }}>🔒 Connexion sécurisée · S.T.A.G.E. © 2025 · CFP du Grand-Fjord</div>
      </div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null);
  return (
    <>
      <FontLoader />
      <MobileStyles />
      <ToastContainer />
      {!role && <LoginPage onLogin={setRole} />}
      {role === "Élève" && <StudentView onLogout={() => setRole(null)} />}
      {role === "Superviseur" && <SupervisorView onLogout={() => setRole(null)} />}
      {role === "Enseignant" && <TeacherView onLogout={() => setRole(null)} />}
      {role === "TOS" && <TosView onLogout={() => setRole(null)} />}
      {role === "Direction" && <DirectionView onLogout={() => setRole(null)} />}
    </>
  );
}
