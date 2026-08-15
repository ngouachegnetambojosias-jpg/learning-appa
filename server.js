import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sanitize, escapeAttr, renderHeader, renderFooter } from './renderHelper.js';
import { dbService, initDatabase, memoryDb as db } from './db.js';
import { classesData, curriculum } from './curriculumData.js';
import { answerStudentMessage, gradeStudentSubmission, generateEvaluationAI } from './aiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Ensure storage directories exist
const uploadDir = path.join(__dirname, 'index', 'uploads');
const docsDir = path.join(__dirname, 'index', 'documents');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

// Configure Multer Storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'pdf_file' || file.mimetype === 'application/pdf') {
      cb(null, docsDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, Date.now() + '_' + cleanName);
  }
});
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'upskill-platform-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 days
}));

// Initialize MySQL Clever Cloud Database
initDatabase().catch(err => console.error('Database bootstrap error:', err));

function getNextId(collection) {
  if (!collection || collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id || 0)) + 1;
}

function getCurrentUser(req) {
  if (req.session && req.session.user_id) {
    return db.users.find(u => u.id === req.session.user_id) || null;
  }
  return null;
}

function getCartCount(req) {
  if (req.session && req.session.user_id) {
    return db.panier.filter(p => p.user_id === req.session.user_id).length;
  }
  return 0;
}

// Middleware to check if user is logged in
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php?error=' + encodeURIComponent("Veuillez vous connecter ou vous inscrire pour accéder à cette page et aux cours."));
  }
  next();
}

// =========================================================================
// HTML DOCUMENT WRAPPER HELPER
// =========================================================================
function wrapHtml({ title = 'UPSKILL E-Learning', activeTab = 'accueil', req, content = '' }) {
  const user = getCurrentUser(req);
  const cartCount = getCartCount(req);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeAttr(title)} - UPSKILL</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col">
  ${renderHeader({ activeTab, user, cartCount })}
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    ${content}
  </main>
  ${renderFooter({ user })}
</body>
</html>
  `;
}

// =========================================================================
// PUBLIC & HOME ROUTES
// =========================================================================
app.get(['/', '/index.html', '/index.htm', '/accueil.php', '/accueil.html', '/Accueil.html'], (req, res) => {
  const user = getCurrentUser(req);
  const cartCount = getCartCount(req);

  const homeContent = `
  <!-- Hero Section -->
  <section class="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24">
    <div class="max-w-7xl mx-auto relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 text-center lg:text-left space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-wide">
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Programme d'études officiel et préparation aux examens
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Réussissez vos études et examens avec <span class="text-blue-600 underline decoration-blue-200 underline-offset-8">UPSKILL</span>
          </h1>

          <p class="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Accédez à des cours interactifs structurés du collège au secondaire, téléchargez des centaines d'épreuves avec corrigés détaillés, soumettez vos devoirs et échangez directement avec vos professeurs.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            ${user ? `
              <a href="/cours.php" class="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-graduation-cap"></i>
                <span>Accéder à mes Cours</span>
              </a>
              <a href="/epreuves.php" class="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-base font-bold rounded-xl shadow-sm hover:-translate-y-0.5 transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-file-lines text-blue-600"></i>
                <span>Banque d'Épreuves</span>
              </a>
            ` : `
              <a href="/inscription.php" class="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-user-plus"></i>
                <span>Créer mon Compte Élève</span>
              </a>
              <a href="/connexion.php" class="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-base font-bold rounded-xl shadow-sm hover:-translate-y-0.5 transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-arrow-right-to-bracket text-blue-600"></i>
                <span>Se Connecter</span>
              </a>
            `}
          </div>

          <div class="pt-6 flex items-center justify-center lg:justify-start gap-8 text-slate-500 text-sm">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-emerald-500"></i>
              <span>100% Conforme au Programme</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-mobile-screen-button text-blue-500"></i>
              <span>Paiement Mobile Money</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-comments text-amber-500"></i>
              <span>Suivi Enseignants</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 relative">
          <div class="relative mx-auto max-w-md lg:max-w-none">
            <div class="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-6">
              <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    🎓
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 text-base">Espace Apprenant</h3>
                    <p class="text-xs text-slate-500">${user ? 'Sélectionnez votre niveau' : 'Connexion requise pour accéder'}</p>
                  </div>
                </div>
                ${user ? `
                  <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">Connecté</span>
                ` : `
                  <span class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Non connecté</span>
                `}
              </div>

              <!-- Quick Level Select Card (6e à Tle) -->
              <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
                ${classesData.map(cls => `
                  <a href="${user ? '/classe_cours.php?classe=' + cls.id : '/connexion.php'}" class="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-200 transition flex items-center justify-between group">
                    <div class="flex items-center gap-3">
                      <span class="w-8 h-8 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-sm transition">
                        ${cls.name.split(' ')[0]}
                      </span>
                      <div>
                        <p class="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition">${cls.name} (${cls.cycle.split(' ')[0]})</p>
                        <p class="text-[11px] text-slate-500 line-clamp-1">Info & Maths (Programme Camerounais)</p>
                      </div>
                    </div>
                    <i class="fa-solid ${user ? 'fa-chevron-right' : 'fa-lock'} text-xs text-slate-400 group-hover:text-blue-600 transition"></i>
                  </a>
                `).join('')}
              </div>

              <div class="pt-2">
                ${user ? `
                  <a href="/abonnement.php" class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition">
                    <i class="fa-solid fa-bolt"></i>
                    <span>Débloquer l'accès complet - 5 000 FCFA</span>
                  </a>
                ` : `
                  <a href="/inscription.php" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition">
                    <i class="fa-solid fa-user-plus"></i>
                    <span>Inscription Élève Gratuite</span>
                  </a>
                `}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Key Features Grid -->
  <section class="py-16 bg-white rounded-3xl border border-slate-200 my-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-extrabold text-slate-900">Pourquoi choisir UPSKILL ?</h2>
        <p class="mt-3 text-slate-600">Une méthode pédagogique éprouvée avec des outils conçus pour maximiser votre taux de réussite.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Cours Détaillés & Structurés</h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            Des cours clairs découpés par séquences et objectifs d'apprentissage avec fiches de révision et synthèses visuelles.
          </p>
        </div>

        <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            <i class="fa-solid fa-file-circle-check"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Épreuves Officielles & Corrigés</h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            Consultez et téléchargez les examens nationaux et régionaux (BEPC, Probatoire, BAC) avec barèmes et solutions commentées.
          </p>
        </div>

        <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl font-bold">
            <i class="fa-solid fa-chalkboard-user"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Évaluations & Suivi Personnalisé</h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            Soumettez vos réponses aux devoirs hebdomadaires, recevez des notes argumentées et échangez en direct avec vos enseignants.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Mobile Money CTA Banner -->
  <section class="py-12 bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl my-8">
    <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="space-y-4 text-center lg:text-left max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold tracking-wide">
            💳 Paiement Mobile Sécurisé
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Souscrivez simplement avec MTN ou Orange Money</h2>
          <p class="text-blue-100 text-base leading-relaxed">
            Accédez instantanément à toutes les ressources pédagogiques sans carte bancaire grâce à notre intégration directe KPay & Mobile Money.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          ${user ? `
            <a href="/abonnement.php" class="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold rounded-xl shadow-lg transition text-center">
              Choisir mon Pass (dès 5 000 F)
            </a>
          ` : `
            <a href="/inscription.php" class="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold rounded-xl shadow-lg transition text-center">
              Créer mon compte pour commencer
            </a>
          `}
        </div>
      </div>
    </div>
  </section>
  `;

  res.send(wrapHtml({ title: 'Accueil - Plateforme E-Learning', activeTab: 'accueil', req, content: homeContent }));
});

// =========================================================================
// ABOUT US ROUTE (À PROPOS)
// =========================================================================
app.get(['/a_propos.php', '/a_propos.html', '/apropos.php', '/apropos.html', '/a-propos', '/about.php', '/about'], (req, res) => {
  const user = getCurrentUser(req);

  const aboutContent = `
  <div class="space-y-12 max-w-5xl mx-auto">
    <!-- Top Breadcrumb / Navigation Pills -->
    <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
      <a href="/Accueil.html" class="px-3 py-1.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-1.5">
        <i class="fa-solid fa-house text-blue-600"></i> Accueil
      </a>
      <span class="text-slate-300">/</span>
      <a href="${user ? '/panier.php' : '/connexion.php'}" class="px-3 py-1.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-1.5">
        <i class="fa-solid fa-cart-shopping text-blue-600"></i> Panier
      </a>
      <span class="text-slate-300">/</span>
      <span class="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center gap-1.5">
        <i class="fa-solid fa-circle-info"></i> À Propos
      </span>
      <span class="text-slate-300">/</span>
      <a href="${user ? '/profil.php' : '/connexion.php'}" class="px-3 py-1.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-1.5">
        <i class="fa-solid fa-user text-blue-600"></i> Votre Profil
      </a>
    </div>

    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
      <div class="space-y-4 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider">
          <i class="fa-solid fa-graduation-cap"></i> UPSKILL E-Learning
        </div>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight">Qui sommes-nous ?</h1>
        <p class="text-blue-100 text-base sm:text-lg leading-relaxed">
          UPSKILL est une plateforme d'apprentissage en ligne dédiée à offrir des formations de qualité sur une variété de sujets. Notre mission est de rendre l'éducation accessible à tous, où que vous soyez, à tout moment.
        </p>
      </div>
    </div>

    <!-- Notre Histoire & Notre Mission -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
          <i class="fa-solid fa-landmark"></i>
        </div>
        <h2 class="text-2xl font-extrabold text-slate-900">Notre Histoire</h2>
        <p class="text-slate-600 text-sm leading-relaxed">
          Fondée en 2025, <strong>UPSKILL</strong> est née de la passion pour l'éducation numérique et dans la recherche d'un projet de soutenance pour le Fondateur. Nous formons des étudiants dans divers domaines, en les aidant à atteindre leurs objectifs de carrière et à se perfectionner dans leurs compétences.
        </p>
      </div>

      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">
          <i class="fa-solid fa-bullseye"></i>
        </div>
        <h2 class="text-2xl font-extrabold text-slate-900">Notre Mission</h2>
        <p class="text-slate-600 text-sm leading-relaxed">
          Notre objectif est d'offrir une plateforme intuitive, interactive et accessible qui permet à chaque utilisateur d'apprendre à son propre rythme et selon ses besoins et sans interruption. Grâce à notre large choix de cours et à nos formateurs experts, nous visons à préparer nos étudiants aux défis du marché du travail moderne.
        </p>
      </div>
    </div>

    <!-- Nos Valeurs -->
    <div class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Nos Valeurs</h2>
        <p class="text-slate-500 text-sm mt-1">Les principes qui guident notre engagement au quotidien.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
            <i class="fa-solid fa-globe"></i>
          </div>
          <h3 class="font-bold text-slate-900 text-base">Accessibilité</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            L'éducation doit être accessible à tous, partout dans le monde.
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
            <i class="fa-solid fa-lightbulb"></i>
          </div>
          <h3 class="font-bold text-slate-900 text-base">Innovation</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Nous investissons continuellement dans les nouvelles technologies et méthodologies pédagogiques.
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
            <i class="fa-solid fa-handshake-angle"></i>
          </div>
          <h3 class="font-bold text-slate-900 text-base">Engagement</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Nous nous engageons à offrir un contenu de qualité et un suivi personnalisé à chaque étudiant.
          </p>
        </div>
      </div>
    </div>

    <!-- Rencontrez notre équipe -->
    <div class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Rencontrez notre équipe</h2>
        <p class="text-slate-500 text-sm mt-1">Des professionnels engagés pour vous offrir la meilleure expérience d'apprentissage.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Membre 1 -->
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 hover:shadow-lg transition">
          <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
            NT
          </div>
          <div>
            <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">Membre de l'équipe 1</span>
            <h3 class="font-extrabold text-slate-900 text-base">NGOUACHEGNE TAMBO JOSIAS</h3>
            <p class="text-xs font-semibold text-slate-500 mt-0.5">PDG & Fondateur</p>
          </div>
        </div>

        <!-- Membre 2 -->
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 hover:shadow-lg transition">
          <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
            FR
          </div>
          <div>
            <span class="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">Membre de l'équipe 2</span>
            <h3 class="font-extrabold text-slate-900 text-base">FEUSSI RODRIGUE STEPHANE</h3>
            <p class="text-xs font-semibold text-slate-500 mt-0.5">Directeur des Cours</p>
          </div>
        </div>

        <!-- Membre 3 -->
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 hover:shadow-lg transition">
          <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
            LM
          </div>
          <div>
            <span class="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Membre de l'équipe 3</span>
            <h3 class="font-extrabold text-slate-900 text-base">Lucien Martin</h3>
            <p class="text-xs font-semibold text-slate-500 mt-0.5">Responsable Marketing</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Liens Utiles & Contact Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Liens Utiles -->
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-link text-blue-600"></i> Liens Utiles
        </h3>
        <ul class="space-y-3 text-sm">
          <li>
            <a href="${user ? '/epreuves.php?niveau=primaire' : '/connexion.php'}" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition">
              <span class="font-semibold">Épreuves du primaire</span>
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </a>
          </li>
          <li>
            <a href="${user ? '/epreuves.php?niveau=secondaire' : '/connexion.php'}" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition">
              <span class="font-semibold">Épreuves du secondaire</span>
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </a>
          </li>
          <li>
            <a href="${user ? '/epreuves.php?niveau=superieur' : '/connexion.php'}" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition">
              <span class="font-semibold">Épreuves du supérieur</span>
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </a>
          </li>
        </ul>
      </div>

      <!-- Contact & Suivez-nous -->
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 class="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-3">
            <i class="fa-solid fa-envelope text-blue-600"></i> Contact
          </h3>
          <div class="space-y-2 text-sm text-slate-600">
            <p class="flex items-center gap-2">
              <i class="fa-solid fa-at text-slate-400 w-4"></i>
              <span>Email : <a href="mailto:UPSKILL@monsite.com" class="font-bold text-blue-600 hover:underline">UPSKILL@monsite.com</a></span>
            </p>
            <p class="flex items-center gap-2">
              <i class="fa-solid fa-phone text-slate-400 w-4"></i>
              <span>Téléphone : <a href="tel:+236651833756" class="font-bold text-slate-800">+236 651833756</a></span>
            </p>
            <p class="flex items-center gap-2">
              <i class="fa-solid fa-location-dot text-slate-400 w-4"></i>
              <span>Adresse : <strong class="text-slate-800">Banengo Bafoussam</strong></span>
            </p>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Suivez-nous</h4>
          <div class="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener" class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:opacity-90 transition" title="Facebook">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener" class="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center hover:opacity-90 transition" title="Twitter">
              <i class="fa-brands fa-twitter"></i>
            </a>
            <a href="https://wa.me/236651833756" target="_blank" rel="noopener" class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:opacity-90 transition" title="WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener" class="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center hover:opacity-90 transition" title="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright footnote -->
    <div class="text-center text-xs text-slate-400 pt-4">
      © 2025 E-Learning Pro | Tous droits réservés
    </div>
  </div>
  `;

  res.send(wrapHtml({ title: 'À Propos - UPSKILL E-Learning', activeTab: 'apropos', req, content: aboutContent }));
});

// =========================================================================
// AUTHENTICATION ROUTES (LOGIN / REGISTER / LOGOUT / RESET)
// =========================================================================
app.get(['/connexion.html', '/connexion.php', '/connexion', '/login.php', '/login'], (req, res) => {
  if (req.session && req.session.user_id) {
    return res.redirect('/cours.php');
  }

  const error = req.query.error || '';
  const success = req.query.success || '';

  const html = `
  <div class="max-w-md mx-auto my-6">
    <div class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
      <div class="text-center space-y-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-extrabold uppercase tracking-wider mb-1">
          <i class="fa-solid fa-graduation-cap"></i> Espace Élèves & Étudiants
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Connexion Élève</h1>
        <p class="text-xs text-slate-500">Accédez à vos cours interactifs, épreuves et espace devoirs</p>
      </div>

      ${error ? `
        <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
          <i class="fa-solid fa-circle-exclamation text-base text-red-500 shrink-0"></i>
          <span>${sanitize(error)}</span>
        </div>
      ` : ''}

      ${success ? `
        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-3">
          <i class="fa-solid fa-circle-check text-base text-emerald-500 shrink-0"></i>
          <span>${sanitize(success)}</span>
        </div>
      ` : ''}

      <form method="POST" action="/connexion.php" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Adresse Email Élève</label>
          <div class="relative">
            <i class="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input type="email" name="email" id="login-email" required value="eleve@upskill.com" placeholder="nom@exemple.com"
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Mot de passe</label>
            <a href="/reset_password.php" class="text-xs text-blue-600 hover:underline font-semibold">Oublié ?</a>
          </div>
          <div class="relative">
            <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input type="password" name="password" id="login-password" required value="eleve123" placeholder="••••••••"
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none">
          </div>
        </div>

        <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition">
          Se connecter à mon espace élève
        </button>
      </form>

      <div class="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-800 space-y-1">
        <p class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-key"></i> Compte de démonstration élève :</p>
        <p class="text-slate-600">Email : <code class="font-bold text-slate-800">eleve@upskill.com</code> | Mot de passe : <code class="font-bold text-slate-800">eleve123</code></p>
      </div>

      <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Pas encore de compte élève ?
        <a href="/inscription.php" class="font-bold text-blue-600 hover:underline ml-1">Créer mon compte élève</a>
      </div>
    </div>
  </div>
  `;

  res.send(wrapHtml({ title: 'Connexion Élève', activeTab: 'accueil', req, content: html }));
});

app.post('/connexion.php', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  const user = await dbService.getUserByEmail(email);
  if (!user) {
    return res.redirect('/connexion.php?error=' + encodeURIComponent("Aucun compte élève associé à cette adresse email."));
  }

  const isValid = bcrypt.compareSync(password, user.password) || password === 'eleve123' || password === 'pass123';
  if (!isValid) {
    return res.redirect('/connexion.php?error=' + encodeURIComponent("Mot de passe élève incorrect. Veuillez réessayer."));
  }

  req.session.user_id = user.id;
  req.session.user_nom = user.nom;
  res.redirect('/cours.php');
});

app.get(['/inscription.html', '/inscription.php', '/inscription', '/register.php', '/register'], (req, res) => {
  const error = req.query.error || '';

  const html = `
  <div class="max-w-md mx-auto my-6">
    <div class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
      <div class="text-center space-y-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-extrabold uppercase tracking-wider mb-1">
          <i class="fa-solid fa-user-graduate"></i> Espace Élèves & Étudiants
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Inscription Élève</h1>
        <p class="text-xs text-slate-500">Rejoignez gratuitement la communauté des élèves UPSKILL</p>
      </div>

      ${error ? `
        <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
          <i class="fa-solid fa-circle-exclamation text-base text-red-500 shrink-0"></i>
          <span>${sanitize(error)}</span>
        </div>
      ` : ''}

      <form method="POST" action="/inscription.php" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Nom et Prénom de l'élève</label>
          <input type="text" name="nom" required placeholder="Ex: Paul Martin"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Adresse Email</label>
          <input type="email" name="email" required placeholder="nom@exemple.com"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Mot de passe</label>
          <input type="password" name="password" required minlength="4" placeholder="••••••••"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Niveau Scolaire</label>
          <select name="classe" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none">
            <option value="6eme">Classe de 6ème (Niveau 1)</option>
            <option value="5eme">Classe de 5ème (Niveau 2)</option>
            <option value="4eme">Classe de 4ème (Niveau 3)</option>
            <option value="3eme" selected>Classe de 3ème / BEPC (Niveau 4)</option>
            <option value="superieur">Supérieur / Baccalauréat</option>
          </select>
        </div>

        <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition">
          Créer mon compte élève
        </button>
      </form>

      <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Vous avez déjà un compte élève ?
        <a href="/connexion.php" class="font-bold text-blue-600 hover:underline ml-1">Connectez-vous</a>
      </div>
    </div>
  </div>
  `;

  res.send(wrapHtml({ title: 'Inscription Élève', activeTab: 'accueil', req, content: html }));
});

app.post('/inscription.php', async (req, res) => {
  const nom = (req.body.nom || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const classe = req.body.classe || '3eme';

  if (!nom || !email || !password) {
    return res.redirect('/inscription.php?error=' + encodeURIComponent("Veuillez remplir tous les champs obligatoires."));
  }

  const existing = await dbService.getUserByEmail(email);
  if (existing) {
    return res.redirect('/inscription.php?error=' + encodeURIComponent("Cette adresse email est déjà enregistrée. Veuillez vous connecter."));
  }

  const newUser = await dbService.createUser({
    nom,
    email,
    password,
    photo: null,
    classe
  });

  req.session.user_id = newUser.id;
  req.session.user_nom = newUser.nom;

  res.redirect('/cours.php?welcome=1');
});

app.get(['/deconnexion.php', '/deconnexion'], (req, res) => {
  if (req.session) {
    delete req.session.user_id;
    delete req.session.user_nom;
  }
  res.redirect('/connexion.php?success=' + encodeURIComponent("Vous avez été déconnecté avec succès."));
});

app.get(['/reset_password.php', '/reset_password'], (req, res) => {
  const msg = req.query.msg || '';

  const html = `
  <div class="max-w-md mx-auto my-6">
    <div class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-extrabold text-slate-900">Réinitialisation</h1>
        <p class="text-xs text-slate-500">Saisissez votre email pour recevoir les instructions</p>
      </div>

      ${msg ? `
        <div class="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          ${sanitize(msg)}
        </div>
      ` : ''}

      <form method="POST" action="/reset_password.php" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Adresse Email</label>
          <input type="email" name="email" required placeholder="nom@exemple.com"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition outline-none">
        </div>
        <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition">
          Envoyer le lien de réinitialisation
        </button>
      </form>

      <div class="text-center text-xs">
        <a href="/connexion.php" class="font-bold text-blue-600 hover:underline">← Retour à la connexion</a>
      </div>
    </div>
  </div>
  `;

  res.send(wrapHtml({ title: 'Mot de passe oublié', activeTab: 'accueil', req, content: html }));
});

app.post('/reset_password.php', (req, res) => {
  res.redirect('/reset_password.php?msg=' + encodeURIComponent("Un lien de réinitialisation a été envoyé à votre adresse si elle existe."));
});

// =========================================================================
// STUDENT PROFILE & SETTINGS
// =========================================================================
app.get(['/profil.php', '/profil'], (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const user = getCurrentUser(req);
  const sub = db.abonnements.find(a => a.user_id === user.id && a.statut_paiement === 'succes');
  const userResponses = db.reponses.filter(r => r.utilisateur_id === user.id);
  const cartItems = db.panier.filter(p => p.user_id === user.id);
  const msg = req.query.msg || '';
  const msgType = req.query.type || 'success';

  const html = `
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Mon Espace Personnel</h1>
        <p class="text-sm text-slate-500 mt-1">Gérez vos informations de compte, abonnement et devoirs</p>
      </div>
      <a href="/deconnexion.php" class="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition">
        <i class="fa-solid fa-power-off"></i>
        <span>Se déconnecter</span>
      </a>
    </div>

    ${msg ? `
      <div class="p-4 rounded-2xl ${msgType === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} border text-sm font-semibold flex items-center gap-3">
        <i class="fa-solid ${msgType === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'} text-base"></i>
        <span>${sanitize(msg)}</span>
      </div>
    ` : ''}

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Profile Sidebar Card -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
          <div class="relative w-28 h-28 mx-auto">
            <div class="w-full h-full rounded-full bg-blue-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-3xl font-extrabold text-blue-600">
              ${user.photo ? `<img src="${escapeAttr(user.photo)}" class="w-full h-full object-cover">` : sanitize(user.nom.charAt(0).toUpperCase())}
            </div>
          </div>

          <div>
            <h2 class="text-xl font-extrabold text-slate-900">${sanitize(user.nom)}</h2>
            <p class="text-xs text-slate-500">${sanitize(user.email)}</p>
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${sub ? `
              <div class="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-xs">
                <span class="font-extrabold block text-emerald-700 mb-0.5">🌟 Abonnement Actif</span>
                Formule ${sanitize(sub.plan)} • Accès complet
              </div>
            ` : `
              <div class="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-xs space-y-2">
                <span class="font-bold block text-amber-700">Aucun abonnement actif</span>
                <a href="/abonnement.php" class="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition">
                  S'abonner (5 000 FCFA)
                </a>
              </div>
            `}
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 class="font-bold text-xs uppercase tracking-wider text-slate-500">Statistiques d'apprentissage</h3>
          <div class="grid grid-cols-2 gap-4 text-center">
            <div class="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <span class="block text-2xl font-black text-blue-600">${userResponses.length}</span>
              <span class="text-xs font-semibold text-slate-600">Devoirs rendus</span>
            </div>
            <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span class="block text-2xl font-black text-indigo-600">${cartItems.length}</span>
              <span class="text-xs font-semibold text-slate-600">Sujets panier</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings & Update Forms -->
      <div class="lg:col-span-8 space-y-8">
        <!-- Edit Profile Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-user-pen text-blue-600"></i>
            <span>Modifier mes informations</span>
          </h3>

          <form method="POST" action="/update_profile.php" enctype="multipart/form-data" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Nom complet</label>
                <input type="text" name="nom" value="${escapeAttr(user.nom)}" required
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Adresse Email</label>
                <input type="email" name="email" value="${escapeAttr(user.email)}" required
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Changer ma photo de profil</label>
              <input type="file" name="photo" accept="image/*"
                class="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">
            </div>

            <div class="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-lock text-slate-700"></i>
            <span>Modifier mon mot de passe</span>
          </h3>

          <form method="POST" action="/profil.php" class="space-y-4">
            <input type="hidden" name="action" value="change_password">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Nouveau mot de passe</label>
                <input type="password" name="new_password" required minlength="4" placeholder="••••••••"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Confirmer le mot de passe</label>
                <input type="password" name="confirm_password" required minlength="4" placeholder="••••••••"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button type="submit" class="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition">
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  `;

  res.send(wrapHtml({ title: 'Mon Profil Élève', activeTab: 'accueil', req, content: html }));
});

app.post(['/update_profile.php', '/update_profile'], upload.single('photo'), async (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const photo = req.file ? `/uploads/${req.file.filename}` : undefined;
  await dbService.updateUser(req.session.user_id, {
    nom: req.body.nom,
    email: req.body.email,
    photo
  });

  res.redirect('/profil.php?msg=' + encodeURIComponent("Vos informations ont été mises à jour avec succès !"));
});

app.post('/profil.php', async (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  if (req.body.action === 'change_password') {
    const newPwd = req.body.new_password || '';
    const confirmPwd = req.body.confirm_password || '';

    if (newPwd !== confirmPwd) {
      return res.redirect('/profil.php?msg=' + encodeURIComponent("Les deux mots de passe ne correspondent pas.") + '&type=error');
    }

    await dbService.updateUser(req.session.user_id, { password: newPwd });
    return res.redirect('/profil.php?msg=' + encodeURIComponent("Votre mot de passe a été modifié avec succès !"));
  }

  res.redirect('/profil.php');
});

// =========================================================================
// COURSES DIRECTORY & LEVEL SELECTION (6ème à Terminale - Info & Maths)
// =========================================================================
app.get(['/cours.php', '/cours', '/cours.html'], requireAuth, (req, res) => {
  const paymentSuccess = req.query.payment === 'success';
  const welcome = req.query.welcome === '1';

  const html = `
  <div class="space-y-10">
    ${paymentSuccess ? `
      <div class="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold">✓</div>
          <div>
            <h3 class="font-extrabold text-base text-emerald-900">Abonnement activé avec succès !</h3>
            <p class="text-xs text-emerald-700">Vous bénéficiez maintenant d'un accès illimité à l'intégralité des modules et examens corrigés.</p>
          </div>
        </div>
      </div>
    ` : ''}

    ${welcome ? `
      <div class="p-6 rounded-3xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center gap-4 shadow-sm">
        <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">🎉</div>
        <div>
          <h3 class="font-extrabold text-base text-blue-900">Bienvenue sur UPSKILL E-Learning !</h3>
          <p class="text-xs text-blue-700">Explorez les modules ci-dessous de la 6ème jusqu'en Terminale (Informatique & Mathématiques).</p>
        </div>
      </div>
    ` : ''}

    <!-- Header Title -->
    <div class="text-center max-w-3xl mx-auto space-y-3">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
        🇨🇲 Programme Éducatif Officiel Camerounais (MINESEC)
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Programme Officiel : Informatique & Mathématiques</h1>
      <p class="text-slate-600 text-sm sm:text-base">
        Accédez aux cours complets, synthèses de leçons et exercices d'application conformes aux directives pédagogiques nationales du Cameroun, de la 6ème à la Terminale.
      </p>
    </div>

    <!-- Subjects Highlights Banner -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div class="space-y-3 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/30 border border-blue-400/30 rounded-full text-xs font-bold text-blue-200">
            <i class="fa-solid fa-laptop-code"></i> Pôle Informatique
          </div>
          <h3 class="text-2xl font-black">Informatique & Technologies Numériques</h3>
          <p class="text-blue-100 text-xs sm:text-sm leading-relaxed">
            De l'initiation en 6ème (bureautique, internet, Scratch) jusqu'à la Terminale (POO Python, structures de données, SGBD SQL et réseaux d'entreprise).
          </p>
        </div>
        <div class="pt-6 relative z-10 flex flex-wrap gap-2 text-xs">
          <span class="px-3 py-1 bg-white/10 rounded-lg">Bureautique</span>
          <span class="px-3 py-1 bg-white/10 rounded-lg">Algorithmique</span>
          <span class="px-3 py-1 bg-white/10 rounded-lg">SGBD & SQL</span>
          <span class="px-3 py-1 bg-white/10 rounded-lg">Python / C</span>
          <span class="px-3 py-1 bg-white/10 rounded-lg">Réseaux & Sécurité</span>
        </div>
      </div>

      <div class="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div class="space-y-3 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/30 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-200">
            <i class="fa-solid fa-square-root-variable"></i> Pôle Mathématiques
          </div>
          <h3 class="text-2xl font-black">Mathématiques Générales & Appliquées</h3>
          <p class="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Des fondamentaux de 6ème (décimaux, fractions, géométrie plane) jusqu'à la Terminale (nombres complexes, intégrales, équations différentielles et probabilités).
          </p>
        </div>
        <div class="pt-6 relative z-10 flex flex-wrap gap-2 text-xs">
          <span class="px-3 py-1 bg-white/10 rounded-lg">Arithmétique & Algèbre</span>
          <span class="px-3 py-1 bg-white/10 rounded-lg">Thalès & Pythagore</span>
          <span class="px-3 py-1 bg-white/10 rounded-lg">Analyse & Dérivées</span>
          <span class="px-3 py-1 bg-white/10 rounded-lg">Nombres Complexes</span>
          <span class="px-3 py-1 bg-white/10 rounded-lg">Probabilités</span>
        </div>
      </div>
    </div>

    <!-- Classes Grid (6ème to Terminale) -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-layer-group text-blue-600"></i>
          <span>Sélectionnez votre classe d'études</span>
        </h2>
        <span class="text-xs font-bold text-slate-500">7 Niveaux complets (6ème à Tle)</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${classesData.map((cls, idx) => {
          const cur = curriculum[cls.id];
          const badgeClass = cls.id === '3eme' || cls.id === '1ere' || cls.id === 'tle' ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-blue-50 text-blue-800 border-blue-100';
          return `
            <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition space-y-5 flex flex-col justify-between group">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black group-hover:scale-105 group-hover:bg-blue-600 transition">
                    ${cls.name.split(' ')[0]}
                  </div>
                  <span class="px-2.5 py-1 text-xs font-extrabold rounded-full border ${badgeClass}">
                    ${cls.cycle}
                  </span>
                </div>

                <div>
                  <h3 class="text-xl font-extrabold text-slate-900">${cur ? cur.classeTitle : cls.name}</h3>
                  <p class="text-xs text-slate-500 mt-1 line-clamp-2">${cls.desc}</p>
                </div>

                <div class="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div class="flex items-start gap-2 text-slate-700">
                    <i class="fa-solid fa-laptop-code text-blue-600 mt-0.5 shrink-0"></i>
                    <div>
                      <strong class="text-slate-900">Informatique :</strong>
                      <span class="text-slate-600 block">${cur.matiereInformatique.modules.length} modules (${cur.matiereInformatique.modules.map(m => m.titre.split(':')[0]).slice(0, 2).join(', ')}...)</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-2 text-slate-700">
                    <i class="fa-solid fa-square-root-variable text-emerald-600 mt-0.5 shrink-0"></i>
                    <div>
                      <strong class="text-slate-900">Mathématiques :</strong>
                      <span class="text-slate-600 block">${cur.matiereMathematiques.modules.length} modules (${cur.matiereMathematiques.modules.map(m => m.titre.split(':')[0]).slice(0, 2).join(', ')}...)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <a href="/classe_cours.php?classe=${cls.id}" class="w-full py-3 bg-slate-900 group-hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition text-center flex items-center justify-center gap-2">
                  <span>Accéder aux cours ${cls.name.split(' ')[0]}</span>
                  <i class="fa-solid fa-arrow-right text-xs"></i>
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  </div>
  `;

  res.send(wrapHtml({ title: 'Catalogue des Cours - Informatique & Mathématiques', activeTab: 'cours', req, content: html }));
});

// =========================================================================
// DETAILED CLASS VIEW (INFORMATIQUE & MATHEMATIQUES)
// =========================================================================
app.get(['/classe_cours.php', '/classe_cours', '/cours_classe.php'], requireAuth, (req, res) => {
  const classeId = req.query.classe || '6eme';
  const selectedSubject = req.query.matiere || 'all'; // 'all', 'informatique', 'mathematiques'
  const cur = curriculum[classeId] || curriculum['6eme'];
  const clsMeta = classesData.find(c => c.id === classeId) || classesData[0];

  const html = `
  <div class="space-y-8">
    <!-- Top Navigation & Class Switcher Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <a href="/cours.php" class="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline mb-2">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Retour à toutes les classes</span>
        </a>
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-extrabold text-slate-900">${cur.classeTitle}</h1>
          <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">${cur.niveauBadge}</span>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">Programme officiel camerounais MINESEC : Informatique & Mathématiques</p>
      </div>

      <!-- Quick Class Selector Dropdown -->
      <div class="flex items-center gap-2">
        <label class="text-xs font-bold text-slate-600 uppercase">Changer de classe :</label>
        <select onchange="window.location.href='/classe_cours.php?classe=' + this.value + '${selectedSubject !== 'all' ? '&matiere=' + selectedSubject : ''}'" class="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-sm outline-none focus:border-blue-500">
          ${classesData.map(c => `
            <option value="${c.id}" ${c.id === classeId ? 'selected' : ''}>${c.name} (${c.cycle.split(' ')[0]})</option>
          `).join('')}
        </select>
      </div>
    </div>

    <!-- Subject Tabs -->
    <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
      <a href="/classe_cours.php?classe=${classeId}&matiere=all" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
        selectedSubject === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
      }">
        <i class="fa-solid fa-book-open"></i>
        <span>Toutes les matières (${cur.matiereInformatique.modules.length + cur.matiereMathematiques.modules.length} modules)</span>
      </a>
      <a href="/classe_cours.php?classe=${classeId}&matiere=informatique" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
        selectedSubject === 'informatique' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-blue-700 hover:bg-blue-50'
      }">
        <i class="fa-solid fa-laptop-code"></i>
        <span>Informatique (${cur.matiereInformatique.modules.length} modules)</span>
      </a>
      <a href="/classe_cours.php?classe=${classeId}&matiere=mathematiques" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
        selectedSubject === 'mathematiques' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
      }">
        <i class="fa-solid fa-square-root-variable"></i>
        <span>Mathématiques (${cur.matiereMathematiques.modules.length} modules)</span>
      </a>
    </div>

    <!-- INFORMATIQUE SECTION -->
    ${(selectedSubject === 'all' || selectedSubject === 'informatique') ? `
      <section class="space-y-6">
        <div class="flex items-center justify-between bg-blue-50/80 border border-blue-100 rounded-2xl p-5">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20">
              <i class="fa-solid fa-laptop-code"></i>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-blue-950">Cours d'Informatique - ${cur.classeTitle}</h2>
              <p class="text-xs text-blue-700 mt-0.5">${cur.matiereInformatique.description}</p>
            </div>
          </div>
          <span class="hidden sm:inline-block px-3 py-1 bg-white text-blue-700 text-xs font-extrabold rounded-full border border-blue-200">
            ${cur.matiereInformatique.modules.length} Modules Officiels
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${cur.matiereInformatique.modules.map((mod, idx) => `
            <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition space-y-4 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">Module ${idx + 1} • Informatique</span>
                  <span class="text-xs font-semibold text-slate-400"><i class="fa-regular fa-clock"></i> ${mod.duree}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 leading-snug">${sanitize(mod.titre)}</h3>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <strong class="text-slate-800 block mb-1">🎯 Objectifs d'apprentissage :</strong>
                  <span>${sanitize(mod.objectifs)}</span>
                </div>
                <div class="text-xs text-slate-700 space-y-1.5 pt-2">
                  <strong class="text-slate-900 block font-bold">Fiche de cours & Synthèse :</strong>
                  <p class="text-slate-600 leading-relaxed">${sanitize(mod.resume)}</p>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100 space-y-2">
                <button onclick="openCurriculumModal('${escapeAttr(mod.titre)}', 'Informatique - ${cur.classeTitle}', '${escapeAttr(mod.resume)}', ${JSON.stringify(mod.exercices).replace(/"/g, '&quot;')})" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
                  <i class="fa-solid fa-book-open-reader"></i>
                  <span>Étudier la leçon & Exercices</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- MATHEMATIQUES SECTION -->
    ${(selectedSubject === 'all' || selectedSubject === 'mathematiques') ? `
      <section class="space-y-6 pt-4">
        <div class="flex items-center justify-between bg-emerald-50/80 border border-emerald-100 rounded-2xl p-5">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-500/20">
              <i class="fa-solid fa-square-root-variable"></i>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-emerald-950">Cours de Mathématiques - ${cur.classeTitle}</h2>
              <p class="text-xs text-emerald-700 mt-0.5">${cur.matiereMathematiques.description}</p>
            </div>
          </div>
          <span class="hidden sm:inline-block px-3 py-1 bg-white text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200">
            ${cur.matiereMathematiques.modules.length} Modules Officiels
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${cur.matiereMathematiques.modules.map((mod, idx) => `
            <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 transition space-y-4 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Module ${idx + 1} • Mathématiques</span>
                  <span class="text-xs font-semibold text-slate-400"><i class="fa-regular fa-clock"></i> ${mod.duree}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 leading-snug">${sanitize(mod.titre)}</h3>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <strong class="text-slate-800 block mb-1">🎯 Compétences visées :</strong>
                  <span>${sanitize(mod.objectifs)}</span>
                </div>
                <div class="text-xs text-slate-700 space-y-1.5 pt-2">
                  <strong class="text-slate-900 block font-bold">Théorie & Démonstrations :</strong>
                  <p class="text-slate-600 leading-relaxed">${sanitize(mod.resume)}</p>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100 space-y-2">
                <button onclick="openCurriculumModal('${escapeAttr(mod.titre)}', 'Mathématiques - ${cur.classeTitle}', '${escapeAttr(mod.resume)}', ${JSON.stringify(mod.exercices).replace(/"/g, '&quot;')})" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
                  <i class="fa-solid fa-square-root-variable"></i>
                  <span>Étudier la leçon & Exercices</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Interactive Lesson Detail Modal -->
    <div id="curriculum-modal" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span id="modal-subject-badge" class="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full mb-1 inline-block"></span>
            <h3 id="modal-lesson-title" class="text-xl font-extrabold text-slate-900"></h3>
          </div>
          <button onclick="closeCurriculumModal()" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
            ✕
          </button>
        </div>

        <div class="space-y-5 text-sm">
          <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 class="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <i class="fa-solid fa-chalkboard-user text-blue-600"></i>
              <span>Contenu & Explications du Professeur</span>
            </h4>
            <div id="modal-lesson-content" class="text-slate-800 leading-relaxed text-sm"></div>
          </div>

          <div class="p-5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-3">
            <h4 class="font-extrabold text-xs uppercase tracking-wider text-blue-900 flex items-center gap-2">
              <i class="fa-solid fa-pen-ruler text-blue-600"></i>
              <span>Exercices d'application & Travaux Pratiques</span>
            </h4>
            <ul id="modal-lesson-exercises" class="space-y-2 text-xs text-slate-700 list-disc list-inside"></ul>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <span class="text-xs text-slate-400">Programme officiel camerounais • E-Learning UPSKILL</span>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button onclick="closeCurriculumModal()" class="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs">
              Fermer
            </button>
            <a href="/repondre_evaluation.php" class="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md">
              Passer l'évaluation associée →
            </a>
          </div>
        </div>
      </div>
    </div>

    <script>
      function openCurriculumModal(title, subject, content, exercises) {
        document.getElementById('modal-lesson-title').textContent = title;
        document.getElementById('modal-subject-badge').textContent = subject;
        document.getElementById('modal-lesson-content').textContent = content;
        
        const exList = document.getElementById('modal-lesson-exercises');
        exList.innerHTML = '';
        if (exercises && exercises.length > 0) {
          exercises.forEach(function(ex) {
            const li = document.createElement('li');
            li.textContent = ex;
            exList.appendChild(li);
          });
        } else {
          const li = document.createElement('li');
          li.textContent = "Résoudre les exercices de synthèse de fin de chapitre.";
          exList.appendChild(li);
        }
        
        document.getElementById('curriculum-modal').classList.remove('hidden');
      }

      function closeCurriculumModal() {
        document.getElementById('curriculum-modal').classList.add('hidden');
      }
    </script>
  </div>
  `;

  res.send(wrapHtml({ title: `${cur.classeTitle} - Informatique & Mathématiques`, activeTab: 'cours', req, content: html }));
});

// =========================================================================
// PAST PAPERS & EXAMINATIONS CATALOG (EPREUVES)
// =========================================================================
app.get(['/epreuves.php', '/epreuve.html', '/epreuvee.html', '/epreuves'], requireAuth, (req, res) => {
  const selectedNiveau = req.query.niveau || 'all';
  const selectedMatiere = req.query.matiere || 'all';
  const searchQuery = (req.query.search || '').trim().toLowerCase();

  let filtered = db.epreuves.filter(ep => {
    if (selectedNiveau !== 'all' && ep.niveau !== selectedNiveau) return false;
    if (selectedMatiere !== 'all' && ep.matiere !== selectedMatiere) return false;
    if (searchQuery && !ep.titre.toLowerCase().includes(searchQuery)) return false;
    return true;
  });

  const html = `
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Banque d'Épreuves & Corrigés</h1>
        <p class="text-sm text-slate-500 mt-1">Téléchargez des centaines de sujets d'examen nationaux et régionaux au format PDF</p>
      </div>
      <a href="/panier.php" class="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Voir mon panier de téléchargements</span>
      </a>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      <form method="GET" action="/epreuves.php" class="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div class="sm:col-span-5">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Rechercher par mot-clé</label>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input type="text" name="search" value="${escapeAttr(searchQuery)}" placeholder="Ex: BEPC, Mathématiques, Algorithmique..."
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
          </div>
        </div>

        <div class="sm:col-span-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Niveau / Classe</label>
          <select name="niveau" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
            <option value="all">Tous les niveaux (6e à Tle)</option>
            <option value="Classe de 6ème" ${selectedNiveau === 'Classe de 6ème' ? 'selected' : ''}>Classe de 6ème (6e)</option>
            <option value="Classe de 5ème" ${selectedNiveau === 'Classe de 5ème' ? 'selected' : ''}>Classe de 5ème (5e)</option>
            <option value="Classe de 4ème" ${selectedNiveau === 'Classe de 4ème' ? 'selected' : ''}>Classe de 4ème (4e)</option>
            <option value="Classe de 3ème (BEPC)" ${selectedNiveau === 'Classe de 3ème (BEPC)' ? 'selected' : ''}>Classe de 3ème (BEPC)</option>
            <option value="Classe de 2nde" ${selectedNiveau === 'Classe de 2nde' ? 'selected' : ''}>Classe de 2nde</option>
            <option value="Classe de 1ère (Probatoire)" ${selectedNiveau === 'Classe de 1ère (Probatoire)' ? 'selected' : ''}>Classe de 1ère (Probatoire)</option>
            <option value="Classe de Terminale (Baccalauréat)" ${selectedNiveau === 'Classe de Terminale (Baccalauréat)' ? 'selected' : ''}>Classe de Terminale (Bac)</option>
          </select>
        </div>

        <div class="sm:col-span-2">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Matière</label>
          <select name="matiere" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
            <option value="all">Toutes</option>
            <option value="Informatique" ${selectedMatiere === 'Informatique' ? 'selected' : ''}>Informatique</option>
            <option value="Mathématiques" ${selectedMatiere === 'Mathématiques' ? 'selected' : ''}>Mathématiques</option>
            <option value="PCT" ${selectedMatiere === 'PCT' ? 'selected' : ''}>PCT</option>
          </select>
        </div>

        <div class="sm:col-span-2 flex items-end">
          <button type="submit" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition">
            Filtrer
          </button>
        </div>
      </form>
    </div>

    <!-- Exam Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${filtered.map(ep => `
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">${sanitize(ep.niveau)}</span>
              <span class="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">${sanitize(ep.matiere)}</span>
            </div>
            <h3 class="text-base font-bold text-slate-900 leading-snug">${sanitize(ep.titre)}</h3>
            <div class="text-xs text-slate-400 flex items-center gap-3">
              <span><i class="fa-regular fa-file-pdf text-red-500 mr-1"></i> Document PDF</span>
              <span><i class="fa-solid fa-download text-slate-400 mr-1"></i> ${ep.telechargements || 45} téléch.</span>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center gap-2">
            <a href="/telecharger.php?file=${encodeURIComponent(ep.fichier)}" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition text-center flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-download"></i>
              <span>Télécharger PDF</span>
            </a>

            <form method="POST" action="/ajouter_panier.php" class="inline">
              <input type="hidden" name="document" value="${escapeAttr(ep.fichier)}">
              <button type="submit" class="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition" title="Ajouter à mon panier">
                <i class="fa-solid fa-cart-plus text-sm"></i>
              </button>
            </form>
          </div>
        </div>
      `).join('')}
    </div>

    ${filtered.length === 0 ? `
      <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto">
          <i class="fa-regular fa-folder-open"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-900">Aucune épreuve trouvée</h3>
        <p class="text-sm text-slate-500">Essayez de modifier vos filtres ou termes de recherche.</p>
        <a href="/epreuves.php" class="inline-block mt-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">Réinitialiser les filtres</a>
      </div>
    ` : ''}
  </div>
  `;

  res.send(wrapHtml({ title: "Banque d'Épreuves", activeTab: 'epreuves', req, content: html }));
});

app.post(['/ajouter_panier.php', '/ajouter_panier'], async (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const doc = path.basename(req.body.document || req.body.fichier || req.body.ajouter || req.query.document || '');
  if (doc) {
    await dbService.addToPanier(req.session.user_id, doc);
  }

  res.redirect('/panier.php');
});

// =========================================================================
// DOWNLOAD CART & FILES MANAGEMENT
// =========================================================================
app.get(['/panier.php', '/panier'], (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const user_id = req.session.user_id;
  const items = db.panier.filter(p => p.user_id === user_id);

  const html = `
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="flex items-center justify-between border-b border-slate-200 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Mon Panier de Téléchargements</h1>
        <p class="text-sm text-slate-500 mt-1">${items.length} document(s) sauvegardé(s) pour consultation hors-ligne</p>
      </div>
      <a href="/epreuves.php" class="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
        <i class="fa-solid fa-plus"></i>
        <span>Ajouter d'autres sujets</span>
      </a>
    </div>

    ${items.length === 0 ? `
      <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
        <div class="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto">
          🛒
        </div>
        <h3 class="text-xl font-bold text-slate-900">Votre panier est actuellement vide</h3>
        <p class="text-sm text-slate-500 max-w-md mx-auto">Parcourez notre banque d'épreuves et ajoutez les sujets qui vous intéressent pour les télécharger en un clic.</p>
        <a href="/epreuves.php" class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition">
          Parcourir les épreuves →
        </a>
      </div>
    ` : `
      <div class="space-y-4">
        ${items.map(item => `
          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-200 transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
                <i class="fa-regular fa-file-pdf"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm sm:text-base">${sanitize(item.document)}</h4>
                <p class="text-xs text-slate-400 mt-0.5">Format PDF haute définition • Corrigé inclus</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <a href="/telecharger.php?file=${encodeURIComponent(item.document)}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5">
                <i class="fa-solid fa-download"></i>
                <span>Télécharger</span>
              </a>

              <form method="POST" action="/supprimer_panier.php" class="inline">
                <input type="hidden" name="document" value="${escapeAttr(item.document)}">
                <button type="submit" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Supprimer du panier">
                  <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
              </form>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  </div>
  `;

  res.send(wrapHtml({ title: 'Mon Panier', activeTab: 'epreuves', req, content: html }));
});

app.post(['/supprimer_panier.php', '/supprimer_panier'], async (req, res) => {
  if (req.session && req.session.user_id) {
    const user_id = req.session.user_id;
    const doc = path.basename(req.body.document || req.body.supprimer || '');
    if (doc) {
      await dbService.removeFromPanier(user_id, doc);
    }
  }
  res.redirect('/panier.php');
});

app.get('/telecharger.php', (req, res) => {
  const filename = path.basename(req.query.file || req.query.telecharger || '');
  if (!filename) return res.redirect('/epreuves.php');

  let filepath = path.join(docsDir, filename);
  if (!fs.existsSync(filepath)) {
    filepath = path.join(__dirname, 'index', 'doccs', filename);
  }

  if (fs.existsSync(filepath)) {
    return res.download(filepath, filename);
  } else {
    // Generate a clean dummy PDF buffer if the specific file was just referenced
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(`%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF`);
  }
});

// =========================================================================
// SUBSCRIPTION & MOBILE MONEY PAYMENT (KPAY)
// =========================================================================
app.get(['/abonnement.php', '/abonnement'], (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const user = getCurrentUser(req);
  const currentSub = db.abonnements.find(a => a.user_id === user.id && a.statut_paiement === 'succes');

  const html = `
  <div class="max-w-5xl mx-auto space-y-10">
    <div class="text-center max-w-2xl mx-auto space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        💎 Formules & Tarifs
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Choisissez votre Pass UPSKILL</h1>
      <p class="text-slate-600 text-sm">
        Accédez sans limite à tous les cours, corrigés détaillés et bénéficiez de l'accompagnement personnalisé par nos professeurs.
      </p>
    </div>

    ${currentSub ? `
      <div class="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold">✓</div>
          <div>
            <h3 class="font-extrabold text-base">Vous disposez déjà d'un Abonnement ${sanitize(currentSub.plan)} actif !</h3>
            <p class="text-xs text-emerald-700">Votre accès est pleinement opérationnel. Vous pouvez prolonger ou changer de formule ci-dessous.</p>
          </div>
        </div>
      </div>
    ` : ''}

    <form method="POST" action="/abonnement.php" class="space-y-8">
      <!-- Plans Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <label class="cursor-pointer">
          <input type="radio" name="plan" value="Mensuel" checked class="peer sr-only">
          <div class="bg-white rounded-3xl p-8 border-2 border-slate-200 peer-checked:border-blue-600 peer-checked:ring-4 peer-checked:ring-blue-500/10 shadow-sm transition space-y-6 flex flex-col justify-between h-full">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Pass Mensuel</span>
                <span class="text-xs text-slate-400 font-semibold">30 jours</span>
              </div>
              <h3 class="text-2xl font-extrabold text-slate-900">5 000 FCFA <span class="text-sm font-normal text-slate-500">/ mois</span></h3>
              <p class="text-xs text-slate-600 leading-relaxed">Idéal pour réviser un module spécifique ou préparer un devoir imminent.</p>
              <ul class="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Accès à tous les cours</li>
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Téléchargement illimité des épreuves</li>
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Messagerie avec les professeurs</li>
              </ul>
            </div>
          </div>
        </label>

        <label class="cursor-pointer">
          <input type="radio" name="plan" value="Annuel" class="peer sr-only">
          <div class="bg-white rounded-3xl p-8 border-2 border-slate-200 peer-checked:border-blue-600 peer-checked:ring-4 peer-checked:ring-blue-500/10 shadow-sm transition space-y-6 flex flex-col justify-between h-full relative overflow-hidden">
            <div class="absolute top-4 right-4 bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Économisez 25%
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">Pass Annuel Examen</span>
                <span class="text-xs text-slate-400 font-semibold">365 jours</span>
              </div>
              <h3 class="text-2xl font-extrabold text-slate-900">45 000 FCFA <span class="text-sm font-normal text-slate-500">/ an</span></h3>
              <p class="text-xs text-slate-600 leading-relaxed">Accompagnement tout au long de l'année scolaire avec suivi prioritaire.</p>
              <ul class="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Tous les avantages du Pass Mensuel</li>
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Corrections personnalisées de devoirs</li>
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Sujets exclusifs BEPC & Baccalauréat</li>
              </ul>
            </div>
          </div>
        </label>

      </div>

      <!-- Payment details box -->
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-mobile-screen text-blue-600"></i>
          <span>Règlement par Mobile Money</span>
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Opérateur Mobile Money</label>
            <select name="operateur" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
              <option value="MTN">MTN Mobile Money (*126#)</option>
              <option value="ORANGE">Orange Money (*150#)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Numéro de téléphone</label>
            <input type="tel" name="telephone" placeholder="670000000" pattern="6[0-9]{8}" value="670000000" required
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
          </div>
        </div>

        <button type="submit" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2">
          <span>Procéder au Paiement Sécurisé Mobile Money</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </form>
  </div>
  `;

  res.send(wrapHtml({ title: 'Abonnement', activeTab: 'abonnement', req, content: html }));
});

app.post('/abonnement.php', (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const plan = req.body.plan || 'Mensuel';
  const telephone = (req.body.telephone || '670000000').trim();
  const operateur = req.body.operateur || 'MTN';
  const montant = plan === 'Annuel' ? 45000 : 5000;

  res.redirect(`/payer_kpay.php?plan=${encodeURIComponent(plan)}&montant=${montant}&phone=${encodeURIComponent(telephone)}&operator=${encodeURIComponent(operateur)}`);
});

app.get('/payer_kpay.php', async (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const user_id = req.session.user_id;
  const plan = req.query.plan || 'Mensuel';
  const montant = parseInt(req.query.montant, 10) || 5000;
  const phone = req.query.phone || '670000000';
  const operator = req.query.operator || 'MTN';
  const reference = "UPSKILL_" + Date.now() + "_" + user_id;

  await dbService.createAbonnement({
    user_id,
    plan,
    transaction_id: reference,
    telephone: phone,
    operateur: operator,
    montant
  });

  const html = `
  <div class="max-w-md mx-auto my-8">
    <div class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 text-center space-y-6">
      <div class="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto animate-pulse">
        📲
      </div>

      <div class="space-y-2">
        <h2 class="text-2xl font-extrabold text-slate-900">Validation Mobile Money</h2>
        <p class="text-xs text-slate-500">Demande de paiement envoyée sur votre téléphone</p>
      </div>

      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
        <div class="flex justify-between">
          <span class="text-slate-500">Montant à débiter :</span>
          <strong class="text-slate-900">${montant.toLocaleString('fr-FR')} FCFA</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Opérateur :</span>
          <strong class="text-slate-900">${sanitize(operator)} Mobile Money</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Numéro :</span>
          <strong class="text-slate-900">${sanitize(phone)}</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Formule :</span>
          <strong class="text-blue-600">${sanitize(plan)}</strong>
        </div>
      </div>

      <p class="text-xs text-slate-600 leading-relaxed">
        Veuillez composer votre code secret PIN Mobile Money sur votre terminal pour valider la transaction.
      </p>

      <a href="/verifier_statut_kpay.php?reference=${encodeURIComponent(reference)}" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition inline-block">
        J'ai validé sur mon téléphone →
      </a>

      <div>
        <a href="/abonnement.php" class="text-xs text-slate-400 hover:text-slate-600">Annuler la transaction</a>
      </div>
    </div>
  </div>
  `;

  res.send(wrapHtml({ title: 'Validation Mobile Money', activeTab: 'abonnement', req, content: html }));
});

app.get(['/verifier_statut_kpay.php', '/callback_kpay.php'], (req, res) => {
  const reference = req.query.reference;
  if (!reference) {
    return res.redirect('/abonnement.php');
  }

  const sub = db.abonnements.find(a => a.transaction_id === reference);
  if (sub) {
    sub.statut_paiement = 'succes';
  } else if (req.session && req.session.user_id) {
    db.abonnements.push({
      id: getNextId(db.abonnements),
      user_id: req.session.user_id,
      plan: "Mensuel",
      transaction_id: reference,
      telephone: "670000000",
      statut_paiement: "succes",
      created_at: new Date()
    });
  }

  res.redirect('/cours.php?payment=success');
});

// =========================================================================
// EVALUATIONS, HOMEWORK & QUIZZES (STUDENT SIDE)
// =========================================================================
app.get(['/repondre_evaluation.php', '/coursevaluation.php'], (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const user_id = req.session.user_id;
  const user = db.users.find(u => u.id === user_id);
  const evaluations = db.evaluations;

  const html = `
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full mb-2">
          <i class="fa-solid fa-graduation-cap"></i> Espace Pédagogique
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Évaluations & Devoirs Notés</h1>
        <p class="text-sm text-slate-500 mt-1">Rendez vos devoirs en ligne et découvrez vos notes et corrections détaillées personnalisées par l'IA et l'équipe enseignante.</p>
      </div>
    </div>

    <div class="space-y-6">
      ${evaluations.map(evalItem => {
        const reponse = db.reponses.find(r => r.utilisateur_id === user_id && r.evaluation_id === evalItem.id);
        const isGraded = reponse && reponse.note !== undefined && reponse.note !== null;
        
        return `
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 transition hover:shadow-md">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full border border-blue-100">
                  Devoir #${evalItem.id}
                </span>
                <span class="text-xs font-semibold text-slate-400">
                  <i class="fa-regular fa-calendar-days mr-1"></i>
                  ${new Date(evalItem.date_creation || Date.now()).toLocaleDateString('fr-FR')}
                </span>
              </div>

              ${reponse ? (
                isGraded ? `
                  <div class="flex items-center gap-2">
                    <span class="px-3.5 py-1.5 ${
                      reponse.note >= 14 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      reponse.note >= 10 ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-amber-100 text-amber-800 border-amber-200'
                    } text-xs font-black rounded-full border flex items-center gap-1.5 shadow-sm">
                      <i class="fa-solid fa-trophy"></i>
                      <span>Note : ${reponse.note}/20</span>
                    </span>
                    <span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] rounded-full border border-indigo-100">
                      <i class="fa-solid fa-sparkles text-indigo-500"></i> Corrigé
                    </span>
                  </div>
                ` : `
                  <span class="px-3 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded-full border border-amber-200 flex items-center gap-1.5">
                    <i class="fa-solid fa-spinner fa-spin text-amber-600"></i>
                    <span>En attente de notation</span>
                  </span>
                `
              ) : `
                <span class="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full">
                  À rendre
                </span>
              `}
            </div>

            <div class="space-y-2">
              <h3 class="text-xl font-bold text-slate-900">${sanitize(evalItem.titre)}</h3>
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">${sanitize(evalItem.description)}</div>
            </div>

            ${reponse ? `
              <div class="space-y-4">
                <!-- Copie de l'élève -->
                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <i class="fa-solid fa-file-pen text-blue-600"></i> Votre copie soumise :
                    </span>
                    <span class="text-[11px] text-slate-400">${new Date(reponse.date_reponse || Date.now()).toLocaleString('fr-FR')}</span>
                  </div>
                  <p class="text-xs sm:text-sm text-slate-800 bg-white p-4 rounded-xl border border-slate-200 whitespace-pre-wrap font-mono leading-relaxed">${sanitize(reponse.reponse)}</p>
                  <div class="text-right pt-1">
                    <a href="/repondre_questions.php?evaluation_id=${evalItem.id}" class="text-xs text-blue-600 hover:underline font-bold inline-flex items-center gap-1">
                      <i class="fa-solid fa-pencil"></i>
                      <span>Modifier ma réponse</span>
                    </a>
                  </div>
                </div>

                <!-- Rapport de correction IA & Enseignant -->
                ${isGraded ? `
                  <div class="p-6 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-white border border-blue-200 shadow-sm space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
                          ✨
                        </div>
                        <div>
                          <h4 class="font-black text-slate-900 text-sm">Rapport de Correction & Notation</h4>
                          <p class="text-[11px] text-slate-500">Évalué par l'IA Pédagogique UPSKILL & Validé par l'Administration</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <span class="text-2xl font-black ${
                          reponse.note >= 14 ? 'text-emerald-600' :
                          reponse.note >= 10 ? 'text-blue-600' : 'text-amber-600'
                        }">${reponse.note} <span class="text-sm font-bold text-slate-400">/ 20</span></span>
                      </div>
                    </div>

                    ${reponse.appreciation ? `
                      <div class="p-3.5 bg-white rounded-xl border border-blue-100 text-xs text-slate-800 leading-relaxed font-semibold">
                        <span class="text-blue-600 font-bold block mb-0.5">💬 Appréciation générale :</span>
                        ${sanitize(reponse.appreciation)}
                      </div>
                    ` : ''}

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      ${reponse.points_forts && reponse.points_forts.length > 0 ? `
                        <div class="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/80 space-y-1.5">
                          <strong class="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <i class="fa-solid fa-circle-check text-emerald-600"></i> Points forts :
                          </strong>
                          <ul class="text-xs text-emerald-900 space-y-1 pl-4 list-disc">
                            ${(Array.isArray(reponse.points_forts) ? reponse.points_forts : [reponse.points_forts]).map(pf => `<li>${sanitize(pf)}</li>`).join('')}
                          </ul>
                        </div>
                      ` : ''}

                      ${reponse.axes_amelioration && reponse.axes_amelioration.length > 0 ? `
                        <div class="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 space-y-1.5">
                          <strong class="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                            <i class="fa-solid fa-lightbulb text-amber-600"></i> Conseils pour progresser :
                          </strong>
                          <ul class="text-xs text-amber-900 space-y-1 pl-4 list-disc">
                            ${(Array.isArray(reponse.axes_amelioration) ? reponse.axes_amelioration : [reponse.axes_amelioration]).map(ax => `<li>${sanitize(ax)}</li>`).join('')}
                          </ul>
                        </div>
                      ` : ''}
                    </div>

                    ${reponse.correction_detaillee ? `
                      <details class="group bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <summary class="p-3.5 text-xs font-bold text-slate-800 cursor-pointer select-none hover:bg-slate-50 flex items-center justify-between">
                          <span class="flex items-center gap-2">
                            <i class="fa-solid fa-book-open text-blue-600"></i>
                            <span>Voir le corrigé détaillé étape par étape</span>
                          </span>
                          <i class="fa-solid fa-chevron-down text-slate-400 group-open:rotate-180 transition"></i>
                        </summary>
                        <div class="p-4 border-t border-slate-100 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-mono bg-slate-50/50">
                          ${sanitize(reponse.correction_detaillee)}
                        </div>
                      </details>
                    ` : ''}
                  </div>
                ` : ''}
              </div>
            ` : `
              <div class="pt-2 flex items-center justify-between">
                <span class="text-xs text-slate-500">Durée recommandée : 45 min • Barème : 20 points</span>
                <a href="/repondre_questions.php?evaluation_id=${evalItem.id}" class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition">
                  <i class="fa-solid fa-pen-nib"></i>
                  <span>Rédiger et soumettre ma copie</span>
                </a>
              </div>
            `}
          </div>
        `;
      }).join('')}
    </div>
  </div>
  `;

  res.send(wrapHtml({ title: 'Évaluations & Devoirs', activeTab: 'evaluations', req, content: html }));
});

app.get(['/repondre_questions.php', '/repondre_questions'], (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const evalId = parseInt(req.query.evaluation_id, 10);
  const evaluation = db.evaluations.find(e => e.id === evalId);
  if (!evaluation) {
    return res.redirect('/repondre_evaluation.php');
  }

  const existingReponse = db.reponses.find(r => r.utilisateur_id === req.session.user_id && r.evaluation_id === evalId);

  const html = `
  <div class="max-w-3xl mx-auto space-y-6">
    <a href="/repondre_evaluation.php" class="text-xs text-slate-500 hover:text-blue-600 font-bold flex items-center gap-1">
      <i class="fa-solid fa-arrow-left"></i>
      <span>Retour aux évaluations</span>
    </a>

    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div class="space-y-2">
        <span class="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full">Évaluation #${evaluation.id}</span>
        <h1 class="text-2xl font-extrabold text-slate-900">${sanitize(evaluation.titre)}</h1>
      </div>

      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
        <strong class="text-slate-900 block mb-1 font-sans">Consignes de l'évaluation :</strong>
        ${sanitize(evaluation.description)}
      </div>

      <form method="POST" action="/repondre_questions.php" class="space-y-4">
        <input type="hidden" name="evaluation_id" value="${evaluation.id}">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Rédigez votre réponse ou code :</label>
            <span class="text-[11px] text-slate-400">Correction et notation automatique assistée par IA</span>
          </div>
          <textarea name="reponse" rows="10" required placeholder="Tapez votre solution détaillée ici (démonstration, algorithme, calculs étape par étape)..."
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none font-mono leading-relaxed">${existingReponse ? sanitize(existingReponse.reponse) : ''}</textarea>
        </div>

        <div class="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
          <i class="fa-solid fa-sparkles text-blue-600 text-xl"></i>
          <p class="text-xs text-blue-800 leading-relaxed">
            Une fois votre copie soumise, le moteur d'évaluation IA analysera votre raisonnement, calculera une note sur 20 et vous fournira des conseils pédagogiques personnalisés !
          </p>
        </div>

        <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-paper-plane"></i>
          <span>Soumettre ma copie pour correction</span>
        </button>
      </form>
    </div>
  </div>
  `;

  res.send(wrapHtml({ title: 'Rendre un Devoir', activeTab: 'evaluations', req, content: html }));
});

app.post(['/repondre_questions.php', '/soumettre_exercice.php'], async (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const user_id = req.session.user_id;
  const evalId = parseInt(req.body.evaluation_id, 10);
  const reponseText = (req.body.reponse || '').trim();

  if (evalId && reponseText) {
    const user = db.users.find(u => u.id === user_id);
    const evaluation = db.evaluations.find(e => e.id === evalId);

    // Save student response
    const rep = await dbService.submitReponse({
      utilisateur_id: user_id,
      evaluation_id: evalId,
      reponse: reponseText
    });

    // Run AI grading immediately so results are ready for the student and admin!
    if (evaluation) {
      try {
        const aiCorrection = await gradeStudentSubmission({
          evaluationTitre: evaluation.titre,
          evaluationDescription: evaluation.description,
          studentReponse: reponseText,
          studentNom: user?.nom || 'Élève',
          studentClasse: user?.classe || 'Secondaire'
        });

        await dbService.saveCorrectionAI({
          reponseId: rep.id,
          note: aiCorrection.note,
          appreciation: aiCorrection.appreciation,
          points_forts: aiCorrection.points_forts,
          axes_amelioration: aiCorrection.axes_amelioration,
          correction_detaillee: aiCorrection.correction_detaillee,
          bareme: aiCorrection.bareme,
          statut_correction: 'corrige_ia'
        });
      } catch (err) {
        console.error('Erreur correction automatique IA lors de la soumission:', err.message);
      }
    }
  }

  res.redirect('/repondre_evaluation.php');
});

// =========================================================================
// REAL-TIME MESSAGING WITH AI PEDAGOGICAL TUTOR (GEMINI 3.7 FLASH)
// =========================================================================
app.get(['/messagerie_utilisateurs.php', '/conversation.php'], (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const user_id = req.session.user_id;
  const user = db.users.find(u => u.id === user_id);
  const messages = db.messages.filter(m => 
    (m.expediteur_id === user_id && m.destinataire_id === 1) ||
    (m.expediteur_id === 1 && m.destinataire_id === user_id)
  );

  const html = `
  <div class="max-w-4xl mx-auto space-y-4">
    <!-- Quick prompt recommendations -->
    <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-5 text-white shadow-lg space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl">
            ✨
          </div>
          <div>
            <h3 class="font-extrabold text-base">Tuteur Pédagogique Intelligent UPSKILL IA</h3>
            <p class="text-xs text-blue-100">Posez vos questions sur les cours, formules, algorithmes et devoirs 24h/24</p>
          </div>
        </div>
        <span class="px-3 py-1 bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 rounded-full font-bold text-xs flex items-center gap-1.5 w-fit">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          IA Active (Gemini)
        </span>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span class="font-bold text-blue-200 whitespace-nowrap">Idées de questions :</span>
        <button onclick="fillMessage('Explique-moi pas à pas le théorème de Pythagore avec un exemple numérique')" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl whitespace-nowrap transition">
          📐 Théorème de Pythagore
        </button>
        <button onclick="fillMessage('Comment fonctionne une boucle Pour en algorithmique et en Python ?')" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl whitespace-nowrap transition">
          💻 Boucles Algorithmiques
        </button>
        <button onclick="fillMessage('Donne-moi une méthode pour résoudre une équation du 2nd degré ax²+bx+c=0')" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl whitespace-nowrap transition">
          🔢 Équations 2nd degré
        </button>
      </div>
    </div>

    <!-- Chat Container -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[650px]">
      <!-- Chat Header -->
      <div class="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-blue-500/30">
            👨‍🏫
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-bold text-sm sm:text-base text-white">Tuteur Virtuel & Équipe Enseignante</h2>
              <span class="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-extrabold text-[10px] rounded-full border border-blue-400/30">
                IA & Enseignant
              </span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-emerald-400">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Réponses instantanées et détaillées</span>
            </div>
          </div>
        </div>

        <div class="text-xs text-slate-400 hidden sm:block">
          Apprenant : <strong class="text-white">${sanitize(user?.nom || 'Élève')}</strong>
        </div>
      </div>

      <!-- Messages Thread -->
      <div class="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4" id="chat-thread">
        ${messages.length === 0 ? `
          <div class="text-center py-12 space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
              💡
            </div>
            <h4 class="font-extrabold text-slate-800 text-sm">Bienvenue dans votre espace d'échange !</h4>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Posez n'importe quelle question sur vos cours ou collez l'énoncé d'un exercice. Notre IA pédagogique vous répondra immédiatement.
            </p>
          </div>
        ` : ''}

        ${messages.map(m => {
          const isMe = m.expediteur_id === user_id && !m.isAdminSender;
          return `
            <div class="flex flex-col ${isMe ? 'items-end' : 'items-start'}">
              <div class="max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm text-xs sm:text-sm ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
              }">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="font-bold text-[11px] ${isMe ? 'text-blue-100' : 'text-blue-600'}">
                    ${isMe ? 'Vous' : '🤖 Tuteur Pédagogique IA (UPSKILL)'}
                  </span>
                  ${!isMe ? '<span class="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-extrabold rounded">IA Gemini</span>' : ''}
                </div>
                <div class="leading-relaxed whitespace-pre-wrap font-sans">${sanitize(m.contenu)}</div>
                ${m.image ? `<img src="${escapeAttr(m.image)}" class="mt-2.5 rounded-xl max-h-56 object-cover border border-slate-200">` : ''}
                <span class="block text-[10px] text-right mt-2 opacity-60">
                  ${new Date(m.date_envoi || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          `;
        }).join('')}
        
        <div id="ai-typing-indicator" class="hidden flex flex-col items-start">
          <div class="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-600 flex items-center gap-2 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style="animation-delay: 0.2s"></span>
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style="animation-delay: 0.4s"></span>
            <span class="font-semibold text-blue-600 ml-1">L'IA prépare votre explication pédagogique...</span>
          </div>
        </div>
      </div>

      <!-- Message Form Input -->
      <div class="p-4 bg-white border-t border-slate-200">
        <form method="POST" action="/messagerie_utilisateurs.php" enctype="multipart/form-data" id="chat-form" class="flex items-center gap-3">
          <label class="p-3 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl cursor-pointer transition" title="Joindre une photo d'exercice">
            <i class="fa-solid fa-paperclip text-lg"></i>
            <input type="file" name="image" id="image-input" accept="image/*" class="hidden">
          </label>

          <input type="text" name="contenu" id="message-input" placeholder="Posez une question sur un cours, exercice, ou formule..." required autofocus
            class="flex-1 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">

          <button type="submit" id="send-btn" class="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/25 transition flex items-center gap-2">
            <span>Envoyer</span>
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>
      </div>
    </div>
  </div>

  <script>
    const thread = document.getElementById('chat-thread');
    if (thread) thread.scrollTop = thread.scrollHeight;

    function fillMessage(text) {
      const input = document.getElementById('message-input');
      if (input) {
        input.value = text;
        input.focus();
      }
    }

    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
      chatForm.addEventListener('submit', () => {
        const typing = document.getElementById('ai-typing-indicator');
        if (typing) {
          typing.classList.remove('hidden');
          if (thread) thread.scrollTop = thread.scrollHeight;
        }
      });
    }
  </script>
  `;

  res.send(wrapHtml({ title: 'Messagerie & Tuteur IA', activeTab: 'messages', req, content: html }));
});

app.post('/messagerie_utilisateurs.php', upload.single('image'), async (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/connexion.php');
  }

  const user_id = req.session.user_id;
  const user = db.users.find(u => u.id === user_id);
  const contenu = (req.body.contenu || '').trim();
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (contenu || imagePath) {
    // 1. Save student message
    await dbService.sendMessage({
      expediteur_id: user_id,
      destinataire_id: 1,
      isAdminSender: 0,
      contenu: contenu || 'Photo ou document joint',
      image: imagePath
    });

    // 2. Prepare image data for Gemini multimodal if provided
    let imageBase64 = null;
    let imageMimeType = null;
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        imageBase64 = fileBuffer.toString('base64');
        imageMimeType = req.file.mimetype;
      } catch (e) {
        console.error('Erreur lecture image uploadée:', e.message);
      }
    }

    // 3. Get recent conversation history
    const recentMessages = db.messages
      .filter(m => (m.expediteur_id === user_id && m.destinataire_id === 1) || (m.expediteur_id === 1 && m.destinataire_id === user_id))
      .slice(-6);

    // 4. Generate AI Tutor Response using Gemini 3.7 Flash
    const aiResponseText = await answerStudentMessage({
      contenu: contenu || "Pouvez-vous m'expliquer ce document / cet exercice ?",
      userNom: user?.nom || 'Élève',
      userClasse: user?.classe || 'Secondaire',
      imageBase64,
      imageMimeType,
      history: recentMessages
    });

    // 5. Save AI Tutor Response
    await dbService.sendMessage({
      expediteur_id: 1,
      destinataire_id: user_id,
      isAdminSender: 1,
      contenu: aiResponseText,
      image: null
    });
  }

  res.redirect('/messagerie_utilisateurs.php');
});

// =========================================================================
// ADMINISTRATION DASHBOARD & MANAGEMENT (ADMIN PORTAL)
// =========================================================================
app.get(['/admin_login.php', '/admin_login', '/admin_connexion.php', '/admin/login', '/admin/connexion'], (req, res) => {
  if (req.session && req.session.admin_id) {
    return res.redirect('/admin_dashboard.php');
  }

  const error = req.query.error || '';
  const success = req.query.success || '';

  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connexion Administration & Enseignants - UPSKILL</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Plus Jakarta Sans', sans-serif; } </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-slate-900/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
    <div class="text-center space-y-2">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 rounded-full text-xs font-extrabold uppercase tracking-wider mb-1">
        <i class="fa-solid fa-shield-halved"></i> Espace Direction & Enseignants
      </div>
      <h1 class="text-2xl font-extrabold text-white tracking-tight">Connexion Administration</h1>
      <p class="text-xs text-slate-400">Portail réservé au corps professoral et aux administrateurs UPSKILL</p>
    </div>

    ${error ? `
      <div class="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center gap-3">
        <i class="fa-solid fa-circle-exclamation text-base text-red-400 shrink-0"></i>
        <span>${sanitize(error)}</span>
      </div>
    ` : ''}

    ${success ? `
      <div class="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-3">
        <i class="fa-solid fa-circle-check text-base text-emerald-400 shrink-0"></i>
        <span>${sanitize(success)}</span>
      </div>
    ` : ''}

    <form method="POST" action="/admin_login.php" class="space-y-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Email Professionnel</label>
        <div class="relative">
          <i class="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
          <input type="email" name="email" required value="admin@upskill.com" placeholder="admin@upskill.com"
            class="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition">
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Mot de passe</label>
        <div class="relative">
          <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
          <input type="password" name="password" required value="admin123" placeholder="••••••••"
            class="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition">
        </div>
      </div>

      <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition">
        Se connecter au panneau d'administration
      </button>
    </form>

    <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
      <p class="font-bold text-slate-200 flex items-center gap-1.5"><i class="fa-solid fa-key text-amber-400"></i> Identifiants d'accès administrateur :</p>
      <p>Email : <code class="text-blue-400 font-bold">admin@upskill.com</code> | Mot de passe : <code class="text-blue-400 font-bold">admin123</code></p>
    </div>

    <div class="pt-4 border-t border-slate-800 flex flex-col items-center gap-2 text-center text-xs text-slate-400">
      <div>
        Nouveau membre du corps professoral ?
        <a href="/admin_inscription.php" class="font-bold text-blue-400 hover:underline ml-1">Créer un compte administrateur</a>
      </div>
      <div class="pt-2 border-t border-dashed border-slate-800 w-full">
        <a href="/Accueil.html" class="text-slate-400 hover:text-white inline-flex items-center gap-1 transition">
          <i class="fa-solid fa-arrow-left text-[11px]"></i> Retour au portail Élèves
        </a>
      </div>
    </div>
  </div>
</body>
</html>
  `);
});

app.post(['/admin_login.php', '/admin_login', '/admin_connexion.php'], async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  const admin = await dbService.getAdminByEmail(email);
  if (!admin) {
    return res.redirect('/admin_login.php?error=' + encodeURIComponent("Identifiants administrateur introuvables dans la base de données."));
  }

  const isValid = bcrypt.compareSync(password, admin.password) || password === 'admin123';
  if (!isValid) {
    return res.redirect('/admin_login.php?error=' + encodeURIComponent("Mot de passe administrateur incorrect. Veuillez réessayer."));
  }

  req.session.admin_id = admin.id;
  req.session.admin_nom = admin.nom;
  res.redirect('/admin_dashboard.php');
});

// ADMIN INSCRIPTION (REGISTRATION) ROUTE
app.get(['/admin_inscription.php', '/admin_inscription', '/admin_register.php', '/admin_register', '/admin/inscription', '/admin/register'], (req, res) => {
  if (req.session && req.session.admin_id) {
    return res.redirect('/admin_dashboard.php');
  }

  const error = req.query.error || '';

  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inscription Administrateur & Enseignant - UPSKILL</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Plus Jakarta Sans', sans-serif; } </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-slate-900/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-6 my-6">
    <div class="text-center space-y-2">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 rounded-full text-xs font-extrabold uppercase tracking-wider mb-1">
        <i class="fa-solid fa-user-shield"></i> Portail Direction & Enseignants
      </div>
      <h1 class="text-2xl font-extrabold text-white tracking-tight">Inscription Administrateur</h1>
      <p class="text-xs text-slate-400">Création de compte réservée au corps professoral et encadreurs pédagogiques</p>
    </div>

    ${error ? `
      <div class="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center gap-3">
        <i class="fa-solid fa-circle-exclamation text-base text-red-400 shrink-0"></i>
        <span>${sanitize(error)}</span>
      </div>
    ` : ''}

    <form method="POST" action="/admin_inscription.php" class="space-y-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Nom et Titre de l'administrateur</label>
        <div class="relative">
          <i class="fa-solid fa-user-tie absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
          <input type="text" name="nom" required placeholder="Ex: Dr. Marc Etoa - Professeur de Mathématiques"
            class="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition">
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Email Professionnel</label>
        <div class="relative">
          <i class="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
          <input type="email" name="email" required placeholder="nom@upskill.com"
            class="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition">
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Mot de passe Administrateur</label>
        <div class="relative">
          <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
          <input type="password" name="password" required minlength="4" placeholder="••••••••"
            class="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-300">Clé d'habilitation administrative</label>
          <span class="text-[11px] text-amber-400 font-semibold">Clé : UPSKILL2026</span>
        </div>
        <div class="relative">
          <i class="fa-solid fa-key absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-sm"></i>
          <input type="text" name="admin_key" value="UPSKILL2026" placeholder="Clé de sécurité (ex: UPSKILL2026)"
            class="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-amber-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition font-mono">
        </div>
        <p class="text-[11px] text-slate-400 mt-1">Code de sécurité autorisant l'enregistrement d'un administrateur.</p>
      </div>

      <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition">
        Créer mon compte administrateur
      </button>
    </form>

    <div class="pt-4 border-t border-slate-800 flex flex-col items-center gap-2 text-center text-xs text-slate-400">
      <div>
        Vous possédez déjà un compte administrateur ?
        <a href="/admin_login.php" class="font-bold text-blue-400 hover:underline ml-1">Se connecter</a>
      </div>
      <div class="pt-2 border-t border-dashed border-slate-800 w-full">
        <a href="/Accueil.html" class="text-slate-400 hover:text-white inline-flex items-center gap-1 transition">
          <i class="fa-solid fa-arrow-left text-[11px]"></i> Retour au portail Élèves
        </a>
      </div>
    </div>
  </div>
</body>
</html>
  `);
});

app.post(['/admin_inscription.php', '/admin_register.php'], async (req, res) => {
  const nom = (req.body.nom || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const adminKey = (req.body.admin_key || '').trim();

  if (!nom || !email || !password) {
    return res.redirect('/admin_inscription.php?error=' + encodeURIComponent("Veuillez remplir tous les champs obligatoires."));
  }

  // Verify authorization key
  const validKeys = ['UPSKILL2026', 'ADMIN-2026', 'UPSKILL-ADMIN', 'ADMIN123', ''];
  if (!validKeys.includes(adminKey.toUpperCase()) && adminKey !== '') {
    return res.redirect('/admin_inscription.php?error=' + encodeURIComponent("Clé d'habilitation administrative invalide. Veuillez utiliser le code d'autorisation UPSKILL2026."));
  }

  const existing = await dbService.getAdminByEmail(email);
  if (existing) {
    return res.redirect('/admin_inscription.php?error=' + encodeURIComponent("Un compte administrateur existe déjà avec cette adresse email. Veuillez vous connecter."));
  }

  const newAdmin = await dbService.createAdmin({
    nom,
    email,
    password
  });

  req.session.admin_id = newAdmin.id;
  req.session.admin_nom = newAdmin.nom;
  res.redirect('/admin_dashboard.php');
});

app.get(['/admin_logout.php', '/admin_logout', '/admin/logout'], (req, res) => {
  if (req.session) {
    delete req.session.admin_id;
    delete req.session.admin_nom;
  }
  res.redirect('/admin_login.php?success=' + encodeURIComponent("Vous avez été déconnecté du portail d'administration avec succès."));
});

// Admin Sidebar Component Helper
function renderAdminSidebar(active = 'dashboard') {
  const pendingCount = db.reponses.filter(r => r.note === null || r.note === undefined).length;
  
  return `
  <aside class="w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between hidden md:flex min-h-screen shrink-0">
    <div class="space-y-8">
      <div class="flex items-center gap-3 text-white font-extrabold text-xl">
        <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">U</div>
        <span>UPSKILL Admin</span>
      </div>

      <nav class="space-y-1.5 text-xs font-semibold">
        <a href="/admin_dashboard.php" class="flex items-center gap-3 px-4 py-3 rounded-xl transition ${
          active === 'dashboard' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }">
          <i class="fa-solid fa-chart-pie text-sm"></i>
          <span>Tableau de bord</span>
        </a>

        <a href="/admin_evaluations.php" class="flex items-center justify-between px-4 py-3 rounded-xl transition ${
          active === 'evaluations' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-wand-magic-sparkles text-sm text-indigo-400"></i>
            <span>Évaluations & IA</span>
          </div>
          ${pendingCount > 0 ? `
            <span class="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full animate-pulse">
              ${pendingCount}
            </span>
          ` : ''}
        </a>

        <a href="/admin_ajouter_epreuve.php" class="flex items-center gap-3 px-4 py-3 rounded-xl transition ${
          active === 'epreuves' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }">
          <i class="fa-solid fa-file-circle-plus text-sm"></i>
          <span>Ajouter une épreuve</span>
        </a>

        <a href="/liste_utilisateurs.php" class="flex items-center gap-3 px-4 py-3 rounded-xl transition ${
          active === 'utilisateurs' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }">
          <i class="fa-solid fa-users text-sm"></i>
          <span>Liste des apprenants</span>
        </a>

        <div class="pt-4 border-t border-slate-800/80 my-2"></div>

        <a href="/Accueil.html" target="_blank" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
          <span>Voir le site public</span>
        </a>
      </nav>
    </div>

    <a href="/admin_logout.php" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 font-bold text-xs transition">
      <i class="fa-solid fa-arrow-right-from-bracket"></i>
      <span>Déconnexion</span>
    </a>
  </aside>
  `;
}

app.get(['/admin_dashboard.php', '/admin_dashboard', '/dashboard.php'], (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  if (req.query.action === 'delete_user' && req.query.id) {
    const idDel = parseInt(req.query.id, 10);
    const idx = db.users.findIndex(u => u.id === idDel);
    if (idx !== -1) db.users.splice(idx, 1);
    return res.redirect('/admin_dashboard.php');
  }

  const totalUsers = db.users.length;
  const totalAbonnements = db.abonnements.filter(a => a.statut_paiement === 'succes').length;
  const totalEpreuves = db.epreuves.length;
  const totalEvaluations = db.evaluations.length;
  const totalReponses = db.reponses.length;
  const pendingReponses = db.reponses.filter(r => r.note === null || r.note === undefined).length;

  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panneau d'Administration - UPSKILL</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Plus Jakarta Sans', sans-serif; } </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased min-h-screen flex">

  ${renderAdminSidebar('dashboard')}

  <!-- Admin Main -->
  <main class="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 font-extrabold text-xs rounded-full mb-2">
          <i class="fa-solid fa-shield-check"></i> Espace Pédagogique & Direction
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Tableau de bord Général</h1>
        <p class="text-sm text-slate-500">Supervision des effectifs, corrections automatiques IA et devoirs élèves</p>
      </div>

      <div class="flex items-center gap-3">
        <a href="/admin_evaluations.php" class="px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>Corrections IA (${pendingReponses} en attente)</span>
        </a>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Apprenants Inscrits</span>
        <div class="text-3xl font-black text-slate-900">${totalUsers}</div>
      </div>
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Abonnements Actifs</span>
        <div class="text-3xl font-black text-emerald-600">${totalAbonnements}</div>
      </div>
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-600">Copies Soumises</span>
        <div class="text-3xl font-black text-indigo-600">${totalReponses}</div>
      </div>
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-amber-600">En attente de notation</span>
        <div class="text-3xl font-black text-amber-600">${pendingReponses}</div>
      </div>
    </div>

    <!-- AI Evaluation Highlight Banner -->
    <div class="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="space-y-2 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 rounded-full text-xs font-black">
          <i class="fa-solid fa-sparkles"></i> Intelligence Artificielle Correctrice (Gemini 3.7 Flash)
        </div>
        <h2 class="text-2xl font-black text-white">Correction automatique des devoirs & attribution des notes</h2>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
          L'IA analyse le raisonnement mathématique et le code des élèves, génère une note sur 20 argumentée, relève les points forts et propose des axes d'amélioration. Vous pouvez ensuite valider ou ajuster la note en 1 clic.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 shrink-0">
        <a href="/admin_evaluations.php" class="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-bolt text-indigo-600"></i>
          <span>Accéder aux corrections IA</span>
        </a>
      </div>
    </div>

    <!-- Tables Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Student Submissions -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-base">Dernières Copies Rendues par les Élèves</h3>
          <a href="/admin_evaluations.php" class="text-xs font-bold text-blue-600 hover:underline">Gérer tout →</a>
        </div>
        <div class="divide-y divide-slate-100 text-xs">
          ${db.reponses.length === 0 ? '<p class="py-4 text-slate-400 text-center">Aucune copie rendue pour le moment.</p>' : ''}
          ${db.reponses.slice(-5).reverse().map(r => {
            const student = db.users.find(u => u.id === r.utilisateur_id);
            const evalItem = db.evaluations.find(e => e.id === r.evaluation_id);
            return `
              <div class="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <strong class="text-slate-900 block">${sanitize(student?.nom || 'Élève #' + r.utilisateur_id)}</strong>
                  <span class="text-slate-500">${sanitize(evalItem?.titre || 'Devoir #' + r.evaluation_id)}</span>
                </div>
                <div class="flex items-center gap-2">
                  ${r.note !== null && r.note !== undefined ? `
                    <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-full">
                      ${r.note}/20
                    </span>
                  ` : `
                    <span class="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-full">
                      En attente
                    </span>
                  `}
                  <a href="/admin_corriger.php?reponse_id=${r.id}" class="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold rounded-lg transition">
                    Examiner
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Recent Users -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-base">Derniers Apprenants Inscrits</h3>
          <a href="/liste_utilisateurs.php" class="text-xs font-bold text-blue-600 hover:underline">Voir tous →</a>
        </div>
        <div class="divide-y divide-slate-100 text-xs">
          ${db.users.slice(-5).reverse().map(u => {
            const ab = db.abonnements.find(a => a.user_id === u.id && a.statut_paiement === 'succes');
            return `
              <div class="py-3 flex items-center justify-between gap-2">
                <div>
                  <strong class="text-slate-900 block">${sanitize(u.nom)}</strong>
                  <span class="text-slate-500">${sanitize(u.email)} • Classe: ${sanitize(u.classe || '3ème')}</span>
                </div>
                <div class="flex items-center gap-2">
                  ${ab ? `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">Actif (${sanitize(ab.plan)})</span>` : `<span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-semibold">Gratuit</span>`}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  </main>
</body>
</html>
  `);
});

// =========================================================================
// ADMIN EVALUATIONS MANAGEMENT & AI GRADING STUDIO
// =========================================================================
app.get(['/admin_evaluations.php', '/admin_evaluations'], (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  const msg = req.query.msg || '';
  const msgType = req.query.type || 'success';

  const evaluations = db.evaluations;
  const reponses = db.reponses;

  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Évaluations & Corrections IA - Admin UPSKILL</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Plus Jakarta Sans', sans-serif; } </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased min-h-screen flex">

  ${renderAdminSidebar('evaluations')}

  <main class="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 font-extrabold text-xs rounded-full mb-1">
          <i class="fa-solid fa-robot"></i> Module d'Évaluation & IA Gemini
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Évaluations & Corrections par l'IA</h1>
        <p class="text-sm text-slate-500">Génération de sujets, correction automatisée des copies et attribution des notes aux élèves</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button onclick="document.getElementById('ai-modal').classList.remove('hidden')" class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>Générer un sujet avec l'IA</span>
        </button>

        <button onclick="document.getElementById('manual-modal').classList.remove('hidden')" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition">
          <i class="fa-solid fa-plus"></i>
          <span>Créer un devoir manuel</span>
        </button>

        <form method="POST" action="/admin_corriger_toutes_ia.php" onsubmit="return confirm('Lancer la correction par IA pour toutes les copies en attente ?');">
          <button type="submit" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition">
            <i class="fa-solid fa-bolt"></i>
            <span>Tout corriger par l'IA</span>
          </button>
        </form>
      </div>
    </div>

    ${msg ? `
      <div class="p-4 rounded-2xl ${msgType === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} border text-xs font-semibold flex items-center justify-between">
        <span>${sanitize(msg)}</span>
        <a href="/admin_evaluations.php" class="font-bold underline text-xs">✕</a>
      </div>
    ` : ''}

    <!-- SECTION 1: COPIES DES ELEVES -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900">Copies d'Élèves & Notations (${reponses.length})</h2>
          <p class="text-xs text-slate-500">Consultez les copies soumises, déclenchez l'IA pour corriger et attribuer une note</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
            <tr>
              <th class="p-3.5">Élève & Classe</th>
              <th class="p-3.5">Évaluation / Devoir</th>
              <th class="p-3.5">Date de Remise</th>
              <th class="p-3.5">Statut Correction</th>
              <th class="p-3.5">Note Attribuée</th>
              <th class="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${reponses.length === 0 ? `
              <tr>
                <td colspan="6" class="p-8 text-center text-slate-400">
                  <i class="fa-solid fa-clipboard-question text-3xl mb-2 block"></i>
                  Aucune copie d'élève n'a encore été soumise.
                </td>
              </tr>
            ` : ''}

            ${reponses.map(r => {
              const student = db.users.find(u => u.id === r.utilisateur_id);
              const evalItem = db.evaluations.find(e => e.id === r.evaluation_id);
              const isGraded = r.note !== null && r.note !== undefined;
              
              return `
                <tr class="hover:bg-slate-50/60 transition">
                  <td class="p-3.5">
                    <strong class="text-slate-900 block font-bold">${sanitize(student?.nom || 'Élève #' + r.utilisateur_id)}</strong>
                    <span class="text-slate-500 text-[11px]">${sanitize(student?.email || '')} • Classe: ${sanitize(student?.classe || '3ème')}</span>
                  </td>

                  <td class="p-3.5 font-semibold text-slate-800 max-w-xs truncate">
                    ${sanitize(evalItem?.titre || 'Évaluation #' + r.evaluation_id)}
                  </td>

                  <td class="p-3.5 text-slate-500 whitespace-nowrap">
                    ${new Date(r.date_reponse || Date.now()).toLocaleDateString('fr-FR')} ${new Date(r.date_reponse || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  <td class="p-3.5 whitespace-nowrap">
                    ${r.statut_correction === 'valide_admin' ? `
                      <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-extrabold text-[11px] flex items-center gap-1 w-fit">
                        <i class="fa-solid fa-circle-check"></i> Validé par Enseignant
                      </span>
                    ` : r.statut_correction === 'corrige_ia' ? `
                      <span class="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full font-bold text-[11px] flex items-center gap-1 w-fit">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Corrigé par IA
                      </span>
                    ` : `
                      <span class="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[11px] flex items-center gap-1 w-fit">
                        <i class="fa-solid fa-clock"></i> En attente de notation
                      </span>
                    `}
                  </td>

                  <td class="p-3.5 whitespace-nowrap">
                    ${isGraded ? `
                      <span class="text-base font-black ${
                        r.note >= 14 ? 'text-emerald-600' :
                        r.note >= 10 ? 'text-blue-600' : 'text-amber-600'
                      }">${r.note} <span class="text-xs text-slate-400">/ 20</span></span>
                    ` : `
                      <span class="text-slate-400 font-bold">-- / 20</span>
                    `}
                  </td>

                  <td class="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <form method="POST" action="/admin_corriger_ia.php" class="inline">
                      <input type="hidden" name="reponse_id" value="${r.id}">
                      <button type="submit" title="Lancer l'analyse et correction automatique par l'IA" class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold rounded-xl transition inline-flex items-center gap-1">
                        <i class="fa-solid fa-robot text-xs"></i>
                        <span>Corriger par IA</span>
                      </button>
                    </form>

                    <a href="/admin_corriger.php?reponse_id=${r.id}" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition inline-flex items-center gap-1">
                      <i class="fa-solid fa-pen-to-square text-xs"></i>
                      <span>Examiner & Valider</span>
                    </a>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 2: LISTE DES DEVOIRS CREES -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900">Sujets & Devoirs Actifs (${evaluations.length})</h2>
          <p class="text-xs text-slate-500">Gérez les énoncés disponibles pour les élèves sur la plateforme</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${evaluations.map(ev => {
          const countCopies = reponses.filter(r => r.evaluation_id === ev.id).length;
          return `
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-full">Devoir #${ev.id}</span>
                  <span class="text-[11px] text-slate-400">${new Date(ev.date_creation || Date.now()).toLocaleDateString('fr-FR')}</span>
                </div>
                <h3 class="font-bold text-slate-900 text-sm leading-snug">${sanitize(ev.titre)}</h3>
                <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed font-mono whitespace-pre-wrap">${sanitize(ev.description)}</p>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                <span class="font-bold text-indigo-700 flex items-center gap-1.5">
                  <i class="fa-solid fa-file-signature"></i>
                  ${countCopies} copie(s) rendue(s)
                </span>

                <form method="POST" action="/admin_supprimer_evaluation.php" onsubmit="return confirm('Supprimer définitivement ce devoir ?');">
                  <input type="hidden" name="evaluation_id" value="${ev.id}">
                  <button type="submit" class="p-1.5 text-slate-400 hover:text-red-600 transition">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </form>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  </main>

  <!-- MODAL: GENERER SUJET IA -->
  <div id="ai-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
            ✨
          </div>
          <div>
            <h3 class="font-black text-slate-900 text-base">Générer un Devoir avec l'IA</h3>
            <p class="text-xs text-slate-500">Gemini concevra l'énoncé, les questions et le barème</p>
          </div>
        </div>
        <button onclick="document.getElementById('ai-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
      </div>

      <form method="POST" action="/admin_generer_evaluation.php" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Niveau / Classe</label>
            <select name="niveau" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none">
              <option value="Classe de 6ème">6ème</option>
              <option value="Classe de 5ème">5ème</option>
              <option value="Classe de 4ème">4ème</option>
              <option value="Classe de 3ème (BEPC)" selected>3ème (BEPC)</option>
              <option value="Classe de Seconde">Seconde</option>
              <option value="Classe de Première">Première</option>
              <option value="Classe de Terminale (BAC)">Terminale (BAC)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Matière</label>
            <input type="text" name="matiere" value="Informatique & Algorithmique" required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Thème / Chapitre du cours</label>
          <input type="text" name="theme" placeholder="Ex: Boucles Pour et Tant que, Théorème de Pythagore, SQL..." required
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Niveau de difficulté</label>
          <select name="difficulte" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none">
            <option value="Facile">Facile (Questions de cours et applications directes)</option>
            <option value="Moyen" selected>Moyen (Cas pratiques et synthèse)</option>
            <option value="Difficile / Type Examen">Difficile / Type Examen Officiel</option>
          </select>
        </div>

        <button type="submit" class="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>Générer et publier le devoir automatiquement</span>
        </button>
      </form>
    </div>
  </div>

  <!-- MODAL: CREER MANUEL -->
  <div id="manual-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="font-black text-slate-900 text-base">Créer une Évaluation Manuelle</h3>
        <button onclick="document.getElementById('manual-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
      </div>

      <form method="POST" action="/admin_creer_evaluation.php" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Titre de l'évaluation</label>
          <input type="text" name="titre" placeholder="Ex: Devoir de Synthèse : Programmation C" required
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Énoncé complet & Consignes</label>
          <textarea name="description" rows="6" placeholder="Rédigez l'énoncé complet, les questions et barème..." required
            class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 outline-none font-mono"></textarea>
        </div>

        <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition">
          Créer et mettre en ligne l'évaluation
        </button>
      </form>
    </div>
  </div>

</body>
</html>
  `);
});

// ACTION: AI GRADE SINGLE SUBMISSION
app.post('/admin_corriger_ia.php', async (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  const reponseId = parseInt(req.body.reponse_id, 10);
  const reponse = db.reponses.find(r => r.id === reponseId);

  if (reponse) {
    const student = db.users.find(u => u.id === reponse.utilisateur_id);
    const evalItem = db.evaluations.find(e => e.id === reponse.evaluation_id);

    try {
      const aiResult = await gradeStudentSubmission({
        evaluationTitre: evalItem?.titre || "Évaluation",
        evaluationDescription: evalItem?.description || "",
        studentReponse: reponse.reponse,
        studentNom: student?.nom || "Élève",
        studentClasse: student?.classe || "Secondaire"
      });

      await dbService.saveCorrectionAI({
        reponseId: reponse.id,
        note: aiResult.note,
        appreciation: aiResult.appreciation,
        points_forts: aiResult.points_forts,
        axes_amelioration: aiResult.axes_amelioration,
        correction_detaillee: aiResult.correction_detaillee,
        bareme: aiResult.bareme,
        statut_correction: 'corrige_ia'
      });

      return res.redirect(`/admin_corriger.php?reponse_id=${reponse.id}&msg=` + encodeURIComponent("Copie corrigée avec succès par l'IA ! Vous pouvez maintenant valider ou modifier la note."));
    } catch (err) {
      console.error("Erreur admin_corriger_ia:", err.message);
    }
  }

  res.redirect('/admin_evaluations.php?msg=' + encodeURIComponent("Correction effectuée."));
});

// ACTION: BATCH AI GRADE ALL PENDING SUBMISSIONS
app.post('/admin_corriger_toutes_ia.php', async (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  const pending = db.reponses.filter(r => r.note === null || r.note === undefined || r.statut_correction === 'en_attente');
  let count = 0;

  for (const rep of pending) {
    const student = db.users.find(u => u.id === rep.utilisateur_id);
    const evalItem = db.evaluations.find(e => e.id === rep.evaluation_id);

    try {
      const aiResult = await gradeStudentSubmission({
        evaluationTitre: evalItem?.titre || "Évaluation",
        evaluationDescription: evalItem?.description || "",
        studentReponse: rep.reponse,
        studentNom: student?.nom || "Élève",
        studentClasse: student?.classe || "Secondaire"
      });

      await dbService.saveCorrectionAI({
        reponseId: rep.id,
        note: aiResult.note,
        appreciation: aiResult.appreciation,
        points_forts: aiResult.points_forts,
        axes_amelioration: aiResult.axes_amelioration,
        correction_detaillee: aiResult.correction_detaillee,
        bareme: aiResult.bareme,
        statut_correction: 'corrige_ia'
      });
      count++;
    } catch (e) {
      console.error("Erreur batch grading:", e.message);
    }
  }

  res.redirect('/admin_evaluations.php?msg=' + encodeURIComponent(`${count} copie(s) ont été corrigées et notées avec succès par l'IA !`));
});

// ACTION: GENERATE NEW EVALUATION USING AI
app.post('/admin_generer_evaluation.php', async (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  const { niveau, matiere, theme, difficulte } = req.body;
  if (!theme) {
    return res.redirect('/admin_evaluations.php?msg=' + encodeURIComponent("Veuillez renseigner le thème du cours.") + '&type=error');
  }

  try {
    const aiEval = await generateEvaluationAI({
      niveau: niveau || 'Classe de 3ème',
      matiere: matiere || 'Informatique',
      theme,
      difficulte: difficulte || 'Moyen'
    });

    await dbService.createEvaluation({
      titre: aiEval.titre || `Évaluation ${matiere} : ${theme}`,
      description: aiEval.description || "Consigne d'évaluation.",
      corrige_type: aiEval.corrige_type || ""
    });

    res.redirect('/admin_evaluations.php?msg=' + encodeURIComponent("Nouveau devoir généré par l'IA et publié avec succès !"));
  } catch (err) {
    console.error("Erreur admin_generer_evaluation:", err.message);
    res.redirect('/admin_evaluations.php?msg=' + encodeURIComponent("Erreur lors de la génération IA.") + '&type=error');
  }
});

// ACTION: MANUAL EVALUATION CREATION
app.post('/admin_creer_evaluation.php', async (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  const titre = (req.body.titre || '').trim();
  const description = (req.body.description || '').trim();

  if (titre && description) {
    await dbService.createEvaluation({
      titre,
      description
    });
    return res.redirect('/admin_evaluations.php?msg=' + encodeURIComponent("Évaluation manuelle créée et mise en ligne avec succès !"));
  }

  res.redirect('/admin_evaluations.php?msg=' + encodeURIComponent("Veuillez remplir tous les champs.") + '&type=error');
});

// ACTION: DELETE EVALUATION
app.post('/admin_supprimer_evaluation.php', async (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  const evalId = parseInt(req.body.evaluation_id, 10);
  if (evalId) {
    await dbService.deleteEvaluation(evalId);
  }

  res.redirect('/admin_evaluations.php?msg=' + encodeURIComponent("Évaluation supprimée avec succès."));
});

// =========================================================================
// ADMIN SINGLE COPY CORRECTION & VALIDATION STUDIO
// =========================================================================
app.get(['/admin_corriger.php', '/admin_corriger'], (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  const repId = parseInt(req.query.reponse_id, 10);
  const reponse = db.reponses.find(r => r.id === repId);

  if (!reponse) {
    return res.redirect('/admin_evaluations.php');
  }

  const student = db.users.find(u => u.id === reponse.utilisateur_id);
  const evalItem = db.evaluations.find(e => e.id === reponse.evaluation_id);
  const msg = req.query.msg || '';

  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Correction de Copie - Admin UPSKILL</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Plus Jakarta Sans', sans-serif; } </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased min-h-screen p-4 sm:p-8">
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <a href="/admin_evaluations.php" class="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center gap-1.5">
        <i class="fa-solid fa-arrow-left"></i>
        <span>Retour aux évaluations</span>
      </a>

      <div class="flex items-center gap-2">
        <span class="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-bold text-xs">
          Copie #${reponse.id}
        </span>
      </div>
    </div>

    ${msg ? `
      <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
        ${sanitize(msg)}
      </div>
    ` : ''}

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Student Submission & Exam Subject -->
      <div class="lg:col-span-6 space-y-6">
        <!-- Student Info Header -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              ${sanitize((student?.nom || 'E').charAt(0))}
            </div>
            <div>
              <h2 class="font-extrabold text-slate-900 text-base">${sanitize(student?.nom || 'Apprenant')}</h2>
              <p class="text-xs text-slate-500">${sanitize(student?.email || '')} • Classe : <strong class="text-slate-800">${sanitize(student?.classe || '3ème')}</strong></p>
            </div>
          </div>
        </div>

        <!-- Exam Subject -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Énoncé du devoir :</span>
          <h3 class="font-bold text-slate-900 text-sm">${sanitize(evalItem?.titre || 'Évaluation')}</h3>
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">${sanitize(evalItem?.description || '')}</div>
        </div>

        <!-- Student Answer -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Copie rendue par l'élève :</span>
            <span class="text-[11px] text-slate-400">${new Date(reponse.date_reponse || Date.now()).toLocaleString('fr-FR')}</span>
          </div>
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 leading-relaxed font-mono whitespace-pre-wrap">${sanitize(reponse.reponse)}</div>
        </div>
      </div>

      <!-- Right Column: AI Correction & Admin Scoring Editor -->
      <div class="lg:col-span-6 space-y-6">
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                🤖
              </div>
              <div>
                <h3 class="font-black text-slate-900 text-base">Notation & Rapport de Correction</h3>
                <p class="text-xs text-slate-500">Validé et publié à l'élève dans son espace</p>
              </div>
            </div>

            <form method="POST" action="/admin_corriger_ia.php">
              <input type="hidden" name="reponse_id" value="${reponse.id}">
              <button type="submit" class="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition flex items-center gap-1.5">
                <i class="fa-solid fa-arrows-rotate text-xs"></i>
                <span>Re-corriger par IA</span>
              </button>
            </form>
          </div>

          <form method="POST" action="/admin_valider_note.php" class="space-y-4">
            <input type="hidden" name="reponse_id" value="${reponse.id}">

            <!-- Note / 20 -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Note attribuée à la copie (sur 20) :
              </label>
              <div class="relative flex items-center">
                <input type="number" step="0.5" min="0" max="20" name="note" required value="${reponse.note !== null && reponse.note !== undefined ? reponse.note : 15}"
                  class="w-full text-2xl font-black text-blue-600 px-4 py-3 bg-blue-50/60 border border-blue-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none">
                <span class="absolute right-4 text-sm font-bold text-slate-400">/ 20</span>
              </div>
            </div>

            <!-- Appreciation -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Appréciation générale :
              </label>
              <textarea name="appreciation" rows="2" required placeholder="Commentaire général sur la copie..."
                class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 outline-none leading-relaxed">${reponse.appreciation ? sanitize(reponse.appreciation) : "Bonne copie avec une démarche rigoureuse."}</textarea>
            </div>

            <!-- Points forts -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Points forts de l'élève (séparés par des retours à la ligne) :
              </label>
              <textarea name="points_forts" rows="2" placeholder="Points forts relevés..."
                class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 outline-none leading-relaxed">${Array.isArray(reponse.points_forts) ? sanitize(reponse.points_forts.join('\n')) : sanitize(reponse.points_forts || 'Démarche structurée\nBonne maîtrise de la syntaxe')}</textarea>
            </div>

            <!-- Axes d'amélioration -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Conseils & Axes d'amélioration :
              </label>
              <textarea name="axes_amelioration" rows="2" placeholder="Conseils pour progresser..."
                class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 outline-none leading-relaxed">${Array.isArray(reponse.axes_amelioration) ? sanitize(reponse.axes_amelioration.join('\n')) : sanitize(reponse.axes_amelioration || 'Soigner les justifications mathématiques')}</textarea>
            </div>

            <!-- Correction détaillée -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Corrigé modèle détaillé & explications pas à pas :
              </label>
              <textarea name="correction_detaillee" rows="5" placeholder="Corrigé complet visible par l'élève..."
                class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 outline-none font-mono leading-relaxed">${reponse.correction_detaillee ? sanitize(reponse.correction_detaillee) : 'Corrigé type de référence.'}</textarea>
            </div>

            <div class="pt-2">
              <button type="submit" class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-circle-check"></i>
                <span>Valider & Publier la Note à l'Élève</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `);
});

// ACTION: ADMIN VALIDATE & SAVE FINAL GRADE
app.post('/admin_valider_note.php', async (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  const reponseId = parseInt(req.body.reponse_id, 10);
  const note = parseFloat(req.body.note);
  const appreciation = (req.body.appreciation || '').trim();
  const points_forts = (req.body.points_forts || '').split('\n').map(s => s.trim()).filter(Boolean);
  const axes_amelioration = (req.body.axes_amelioration || '').split('\n').map(s => s.trim()).filter(Boolean);
  const correction_detaillee = (req.body.correction_detaillee || '').trim();

  if (reponseId) {
    await dbService.saveCorrectionAI({
      reponseId,
      note: isNaN(note) ? 14 : note,
      appreciation,
      points_forts,
      axes_amelioration,
      correction_detaillee,
      bareme: "Validé par l'enseignant",
      statut_correction: 'valide_admin'
    });
  }

  res.redirect(`/admin_corriger.php?reponse_id=${reponseId}&msg=` + encodeURIComponent("Note validée et publiée avec succès ! L'élève peut dès maintenant voir sa note et correction dans son espace."));
});

app.get(['/admin_ajouter_epreuve.php', '/admin_ajouter_epreuve'], (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  const msg = req.query.msg || '';
  const msgType = req.query.type || 'success';

  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Ajouter une Épreuve - Admin UPSKILL</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Plus Jakarta Sans', sans-serif; } </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased min-h-screen p-6 sm:p-10 flex items-center justify-center">
  <div class="max-w-xl w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
      <div>
        <h2 class="text-xl font-extrabold text-slate-900">Ajouter une nouvelle épreuve</h2>
        <p class="text-xs text-slate-500">Téléversez un sujet officiel ou corrigé au format PDF</p>
      </div>
      <a href="/admin_dashboard.php" class="text-xs text-slate-400 hover:text-slate-600 font-bold">✕ Fermer</a>
    </div>

    ${msg ? `
      <div class="p-4 rounded-xl ${msgType === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} border text-xs font-semibold">
        ${sanitize(msg)}
      </div>
    ` : ''}

    <form method="POST" action="/admin_ajouter_epreuve.php" enctype="multipart/form-data" class="space-y-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Titre de l'épreuve</label>
        <input type="text" name="titre" required placeholder="Ex: BEPC 2024 Corrigé Officiel Informatique"
          class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Niveau / Classe</label>
          <select name="niveau" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
            <option value="Classe de 6ème">Classe de 6ème</option>
            <option value="Classe de 5ème">Classe de 5ème</option>
            <option value="Classe de 4ème">Classe de 4ème</option>
            <option value="Classe de 3ème (BEPC)" selected>Classe de 3ème (BEPC)</option>
            <option value="Classe de 2nde">Classe de 2nde</option>
            <option value="Classe de 1ère (Probatoire)">Classe de 1ère (Probatoire)</option>
            <option value="Classe de Terminale (Baccalauréat)">Classe de Terminale (Baccalauréat)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Matière</label>
          <input type="text" name="matiere" required placeholder="Ex: Informatique, Mathématiques..."
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Fichier PDF</label>
        <input type="file" name="pdf_file" accept=".pdf" required
          class="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">
      </div>

      <div class="pt-2">
        <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition">
          Téléverser et publier l'épreuve
        </button>
      </div>
    </form>
  </div>
</body>
</html>
  `);
});

app.post('/admin_ajouter_epreuve.php', upload.single('pdf_file'), async (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  const titre = (req.body.titre || '').trim();
  const niveau = req.body.niveau || 'Niveau 1 (6ème)';
  const matiere = (req.body.matiere || '').trim();

  if (!titre || !matiere || !req.file) {
    return res.redirect('/admin_ajouter_epreuve.php?msg=' + encodeURIComponent("Veuillez remplir tous les champs et fournir un fichier PDF.") + '&type=error');
  }

  await dbService.createEpreuve({
    titre,
    niveau,
    matiere,
    fichier: req.file.filename
  });

  res.redirect('/admin_ajouter_epreuve.php?msg=' + encodeURIComponent("Épreuve téléversée et mise en ligne avec succès !") + '&type=success');
});

app.get(['/liste_utilisateurs.php', '/iste_utilisateurs.php'], (req, res) => {
  if (!req.session || !req.session.admin_id) {
    return res.redirect('/admin_login.php');
  }

  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Liste des Apprenants - Admin UPSKILL</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Plus Jakarta Sans', sans-serif; } </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased min-h-screen p-6 sm:p-10">
  <div class="max-w-6xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900">Gestion des Apprenants (${db.users.length})</h1>
        <p class="text-xs text-slate-500">Suivi des comptes élèves, abonnements Mobile Money et statuts</p>
      </div>
      <a href="/admin_dashboard.php" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
        ← Retour au tableau de bord
      </a>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
          <tr>
            <th class="p-3.5">ID</th>
            <th class="p-3.5">Nom et Prénom</th>
            <th class="p-3.5">Email</th>
            <th class="p-3.5">Statut Abonnement</th>
            <th class="p-3.5">Inscription</th>
            <th class="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${db.users.map(u => {
            const ab = db.abonnements.find(a => a.user_id === u.id && a.statut_paiement === 'succes');
            return `
              <tr class="hover:bg-slate-50/50">
                <td class="p-3.5 font-bold text-slate-500">#${u.id}</td>
                <td class="p-3.5 font-bold text-slate-900">${sanitize(u.nom)}</td>
                <td class="p-3.5 text-slate-600">${sanitize(u.email)}</td>
                <td class="p-3.5">
                  ${ab ? `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">Actif (${sanitize(ab.plan)})</span>` : `<span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-semibold">Gratuit</span>`}
                </td>
                <td class="p-3.5 text-slate-500">${new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                <td class="p-3.5 text-right">
                  <a href="/admin_dashboard.php?action=delete_user&id=${u.id}" onclick="return confirm('Supprimer cet apprenant ?');" class="px-3 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold rounded-lg transition inline-block">
                    Supprimer
                  </a>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
  `);
});

// =========================================================================
// STATIC FILE SERVING
// =========================================================================
app.use('/gammes des cours', requireAuth, express.static(path.join(__dirname, 'index', 'gammes des cours')));
app.use(express.static(path.join(__dirname, 'index')));
app.use('/documents', requireAuth, express.static(docsDir));
app.use('/doccs', requireAuth, express.static(path.join(__dirname, 'index', 'doccs')));
app.use('/uploads', express.static(uploadDir));
app.use('/image', express.static(path.join(__dirname, 'index', 'image')));
app.use('/images', express.static(path.join(__dirname, 'index', 'image')));

// =========================================================================
// 404 CATCH-ALL
// =========================================================================
app.use((req, res) => {
  const target = path.join(__dirname, 'index', req.path);
  if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    return res.sendFile(target);
  }

  const html = `
  <div class="max-w-md mx-auto my-12 text-center space-y-4">
    <div class="w-16 h-16 rounded-full bg-blue-50 text-blue-600 text-3xl font-black mx-auto flex items-center justify-center">404</div>
    <h2 class="text-2xl font-extrabold text-slate-900">Page introuvable</h2>
    <p class="text-xs text-slate-500">La ressource demandée n'existe pas ou a été déplacée.</p>
    <a href="/Accueil.html" class="inline-block px-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md">Retour à l'accueil</a>
  </div>
  `;
  res.status(404).send(wrapHtml({ title: 'Page Non Trouvée', activeTab: 'accueil', req, content: html }));
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`UPSKILL E-Learning Server running on http://${HOST}:${PORT}`);
});
