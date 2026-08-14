export function sanitize(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}

export function renderHeader({ activeTab = 'accueil', user = null, cartCount = 0 } = {}) {
  const tabs = [
    { id: 'accueil', label: 'Accueil', url: '/Accueil.html', icon: 'fa-home' },
    { id: 'cours', label: 'Cours & Niveaux', url: '/cours.php', icon: 'fa-graduation-cap' },
    { id: 'epreuves', label: 'Épreuves & Examens', url: '/epreuves.php', icon: 'fa-file-lines' },
    { id: 'abonnement', label: 'Abonnement', url: '/abonnement.php', icon: 'fa-credit-card' },
    { id: 'evaluations', label: 'Évaluations', url: '/repondre_evaluation.php', icon: 'fa-clipboard-check' },
    { id: 'messages', label: 'Messagerie', url: '/messagerie_utilisateurs.php', icon: 'fa-comments' },
    { id: 'apropos', label: 'À Propos', url: '/a_propos.php', icon: 'fa-circle-info' },
  ];

  return `
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <a href="/Accueil.html" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
            U
          </div>
          <div>
            <span class="text-2xl font-black tracking-tight text-slate-900">UPSKILL</span>
            <span class="hidden sm:inline-block ml-2 text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 uppercase">E-Learning</span>
          </div>
        </a>

        <nav class="hidden lg:flex items-center gap-1">
          ${user ? `
            ${tabs.map(t => {
              const isActive = activeTab === t.id;
              return `
                <a href="${t.url}" class="px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                  isActive ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }">
                  <i class="fa-solid ${t.icon} text-xs ${isActive ? 'text-blue-600' : 'text-slate-400'}"></i>
                  <span>${t.label}</span>
                </a>
              `;
            }).join('')}
          ` : `
            <a href="/Accueil.html" class="px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'accueil' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }">
              <i class="fa-solid fa-home text-xs ${activeTab === 'accueil' ? 'text-blue-600' : 'text-slate-400'}"></i>
              <span>Accueil</span>
            </a>
            <a href="/a_propos.php" class="px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'apropos' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }">
              <i class="fa-solid fa-circle-info text-xs ${activeTab === 'apropos' ? 'text-blue-600' : 'text-slate-400'}"></i>
              <span>À Propos</span>
            </a>
          `}
        </nav>
      </div>

      <div class="flex items-center gap-3">
        ${user ? `
          <a href="/panier.php" class="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition" title="Mon Panier">
            <i class="fa-solid fa-cart-shopping text-lg"></i>
            ${cartCount > 0 ? `
              <span class="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white font-bold text-xs rounded-full flex items-center justify-center shadow-md animate-pulse">
                ${cartCount}
              </span>
            ` : ''}
          </a>
          <a href="/profil.php" class="flex items-center gap-2.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-semibold transition">
            <div class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
              ${user.photo ? `<img src="${escapeAttr(user.photo)}" class="w-full h-full object-cover">` : sanitize(user.nom.charAt(0).toUpperCase())}
            </div>
            <span class="max-w-[100px] sm:max-w-[140px] truncate">${sanitize(user.nom)}</span>
          </a>
          <a href="/deconnexion.php" class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Déconnexion">
            <i class="fa-solid fa-arrow-right-from-bracket text-base"></i>
          </a>
        ` : `
          <a href="/connexion.php" class="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition flex items-center gap-2">
            <i class="fa-solid fa-arrow-right-to-bracket text-xs"></i>
            <span>Connexion Élève</span>
          </a>
          <a href="/inscription.php" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2">
            <i class="fa-solid fa-user-plus text-xs"></i>
            <span>Inscription Gratuite</span>
          </a>
        `}
      </div>
    </div>
  </header>
  `;
}

export function renderFooter({ user = null } = {}) {
  return `
  <footer class="bg-slate-950 text-slate-400 pt-16 pb-12 mt-auto border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">U</div>
            <span class="text-xl font-extrabold text-white">UPSKILL</span>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">
            Plateforme d'excellence pour l'apprentissage en ligne, la préparation aux examens et le perfectionnement scolaire.
          </p>
        </div>

        <div>
          <h4 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Navigation</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="/Accueil.html" class="hover:text-blue-400 transition">Accueil</a></li>
            <li><a href="/a_propos.php" class="hover:text-blue-400 transition">À Propos</a></li>
            ${user ? `
              <li><a href="/cours.php" class="hover:text-blue-400 transition">Niveaux & Cours</a></li>
              <li><a href="/epreuves.php" class="hover:text-blue-400 transition">Épreuves & Examens</a></li>
              <li><a href="/abonnement.php" class="hover:text-blue-400 transition">Tarifs & Abonnements</a></li>
            ` : `
              <li><a href="/connexion.php" class="hover:text-blue-400 transition">Se connecter</a></li>
              <li><a href="/inscription.php" class="hover:text-blue-400 transition">Créer un compte</a></li>
            `}
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Espace Élèves</h4>
          <ul class="space-y-2.5 text-sm">
            ${user ? `
              <li><a href="/cours.php" class="hover:text-blue-400 transition">Mes Cours</a></li>
              <li><a href="/repondre_evaluation.php" class="hover:text-blue-400 transition">Devoirs & Évaluations</a></li>
              <li><a href="/messagerie_utilisateurs.php" class="hover:text-blue-400 transition">Messagerie Enseignants</a></li>
              <li><a href="/profil.php" class="hover:text-blue-400 transition">Mon Profil Élève</a></li>
            ` : `
              <li><a href="/connexion.php" class="hover:text-blue-400 transition">Connexion Élève</a></li>
              <li><a href="/inscription.php" class="hover:text-blue-400 transition">Inscription Élève</a></li>
            `}
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contact</h4>
          <p class="text-xs text-slate-400 mb-3">Une équipe pédagogique dédiée à votre réussite scolaire 7j/7.</p>
          <ul class="space-y-2 text-xs text-slate-300">
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-envelope text-blue-400"></i>
              <span>Email : <a href="mailto:UPSKILL@monsite.com" class="hover:text-blue-400 transition">UPSKILL@monsite.com</a></span>
            </li>
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-phone text-blue-400"></i>
              <span>Téléphone : <a href="tel:+236651833756" class="hover:text-blue-400 transition">+236 651833756</a></span>
            </li>
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-location-dot text-blue-400"></i>
              <span>Adresse : Banengo Bafoussam</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; 2026 UPSKILL E-Learning. Tous droits réservés.</p>
        <div class="flex gap-6">
          <a href="/Accueil.html" class="hover:text-slate-300">Mentions Légales</a>
          <a href="/Accueil.html" class="hover:text-slate-300">Conditions Générales</a>
          <a href="/Accueil.html" class="hover:text-slate-300">Support Élèves</a>
        </div>
      </div>
    </div>
  </footer>
  `;
}
