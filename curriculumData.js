export const classesData = [
  { id: '6eme', name: '6ème', cycle: '1er Cycle (Observation)', color: 'blue', desc: 'Fondamentaux de l\'informatique et base du raisonnement mathématique.' },
  { id: '5eme', name: '5ème', cycle: '1er Cycle (Orientation)', color: 'indigo', desc: 'Développement logique, tableurs, réseaux et géométrie plane.' },
  { id: '4eme', name: '4ème', cycle: '1er Cycle (Consolidation)', color: 'amber', desc: 'Algorithmique, bases de données, calcul littéral et trigonométrie.' },
  { id: '3eme', name: '3ème (BEPC)', cycle: '1er Cycle (Examen)', color: 'emerald', desc: 'Préparation intensive au BEPC : algorithmes, structures de données, arithmétique et statistiques.' },
  { id: '2nde', name: 'Seconde (2nde A / C / SES)', cycle: '2nd Cycle (Détermination)', color: 'teal', desc: 'Systèmes numériques, codage de l\'information, fonctions d\'une variable réelle et vecteurs.' },
  { id: '1ere', name: 'Première (1ère A / C / D / TI)', cycle: '2nd Cycle (Probatoire)', color: 'purple', desc: 'Préparation au Probatoire : bases de données avancées, programmation C/Python, dérivabilité et barycentres.' },
  { id: 'tle', name: 'Terminale (Tle A / C / D / TI)', cycle: '2nd Cycle (Baccalauréat)', color: 'rose', desc: 'Préparation au Baccalauréat : réseaux et sécurité, POO/SQL, nombres complexes, intégrales, équations différentielles et probabilités.' }
];

export const curriculum = {
  '6eme': {
    classeTitle: 'Classe de 6ème',
    niveauBadge: 'Niveau 1 - 1er Cycle',
    cycle: 'Cycle d\'Observation',
    infoColor: 'blue',
    mathColor: 'sky',
    matiereInformatique: {
      description: 'Conforme au programme MINESEC : Environnement informatique, matériel, production de documents numériques et initiation à l\'algorithmique.',
      modules: [
        {
          id: 'info-6-m1',
          titre: 'Environnement Matériel & Logiciel du Micro-ordinateur',
          duree: '8h',
          objectifs: 'Identifier l\'unité centrale, périphériques d\'entrée/sortie/stockage, allumer et éteindre correctement un PC.',
          resume: 'L\'ordinateur est un système de traitement automatique de l\'information. Il est constitué de la partie matérielle (Hardware : processeur, mémoire vive RAM, disque dur, clavier, souris, écran) et de la partie logicielle (Software : système d\'exploitation Windows/Linux et logiciels d\'application).',
          exercices: [
            'Distinguer un périphérique d\'entrée (clavier, scanner) d\'un périphérique de sortie (écran, imprimante).',
            'Citer les rôles de la carte mère, du processeur (CPU) et de la mémoire RAM.'
          ]
        },
        {
          id: 'info-6-m2',
          titre: 'Production de Documents Textes (Traitement de Texte)',
          duree: '10h',
          objectifs: 'Saisir, mettre en forme, corriger et enregistrer un document texte simple (Microsoft Word / LibreOffice Writer).',
          resume: 'Un logiciel de traitement de texte permet la rédaction de lettres, devoirs et exposés. Notions fondamentales : police de caractères, taille, alignement (gauche, centré, justifié), insertion d\'images et enregistrement dans un dossier structuré.',
          exercices: [
            'Mettre en gras et souligner les titres d\'un paragraphe.',
            'Enregistrer un document au format standard .docx ou .pdf.'
          ]
        },
        {
          id: 'info-6-m3',
          titre: 'Découverte des Réseaux & d\'Internet Responsable',
          duree: '6h',
          objectifs: 'Comprendre Internet, utiliser un navigateur web, un moteur de recherche et respecter la sécurité des données.',
          resume: 'Internet est le réseau mondial interconnectant des millions d\'ordinateurs. Le Web permet de consulter des pages web grâce à des adresses URL. Règle d\'or : ne jamais divulguer de mot de passe ni de données personnelles en ligne.',
          exercices: [
            'Identifier les navigateurs courants (Chrome, Firefox, Edge) et les moteurs de recherche (Google, Qwant).',
            'Formuler une requête de recherche efficace pour un exposé scolaire.'
          ]
        },
        {
          id: 'info-6-m4',
          titre: 'Initiation à l\'Algorithmique Visuelle (Scratch)',
          duree: '8h',
          objectifs: 'Notion d\'instructions pas à pas, séquences ordonnées et prise en main de l\'environnement Scratch.',
          resume: 'Un algorithme est une suite ordonnée d\'instructions permettant de parvenir à un résultat précis. Avec le logiciel Scratch, nous assemblons des blocs d\'instructions pour déplacer des personnages (lutins) et créer des animations interactives.',
          exercices: [
            'Créer un script qui fait avancer le lutin de 50 pas et lui fait dire « Bonjour le Cameroun ! ».',
            'Utiliser la boucle "Répéter 4 fois" pour tracer un carré.'
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Conforme au programme MINESEC : Arithmétique des entiers et décimaux, fractions simples, géométrie de base (droites, segments, angles, cercles) et mesures.',
      modules: [
        {
          id: 'math-6-m1',
          titre: 'Nombres Entiers Naturels & Nombres Décimaux',
          duree: '12h',
          objectifs: 'Écriture, comparaison, encadrement et 4 opérations fondamentales sur les entiers et décimaux.',
          resume: 'Système décimal de numération de position : rang des unités, dizaines, centaines, dixièmes, centièmes. Techniques opératoires de l\'addition, soustraction, multiplication et division euclidienne (dividende = diviseur × quotient + reste avec reste < diviseur).',
          exercices: [
            'Poser et effectuer : 458,75 + 89,4 et 125,4 × 3,5.',
            'Effectuer la division euclidienne de 425 par 13 et donner le quotient et le reste.'
          ]
        },
        {
          id: 'math-6-m2',
          titre: 'Fractions & Notions de Partage',
          duree: '10h',
          objectifs: 'Représenter une fraction, simplifier des fractions simples et calculer la fraction d\'une quantité.',
          resume: 'Une fraction a/b (avec b ≠ 0) représente le quotient exact de a par b. Écritures fractionnaires égales en multipliant ou divisant le numérateur et le dénominateur par un même nombre non nul. Prendre les 3/4 de 200 FCFA = (200 × 3) / 4 = 150 FCFA.',
          exercices: [
            'Simplifier la fraction 24/36.',
            'Un élève a 12 000 FCFA. Il dépense les 2/3 pour ses fournitures. Combien lui reste-t-il ?'
          ]
        },
        {
          id: 'math-6-m3',
          titre: 'Droites, Segments, Demi-droites & Positions Relatives',
          duree: '10h',
          objectifs: 'Utiliser la règle et l\'équerre pour tracer des droites parallèles et perpendiculaires.',
          resume: 'Droites sécantes, parallèles (qui ne se coupent jamais) et perpendiculaires (qui forment un angle droit de 90°). Propriété fondamentale : Si deux droites sont perpendiculaires à une même troisième, alors elles sont parallèles entre elles.',
          exercices: [
            'Tracer une droite (D) et un point A n\'appartenant pas à (D). Construire la perpendiculaire et la parallèle à (D) passant par A.',
            'Démontrer que deux droites tracées sont parallèles en citant la propriété du cours.'
          ]
        },
        {
          id: 'math-6-m4',
          titre: 'Angles, Triangles & Figures Usuelles (Rectangle, Carré)',
          duree: '10h',
          objectifs: 'Mesurer et tracer des angles au rapporteur ; calculer périmètres et aires usuelles.',
          resume: 'Classification des angles : aigu (< 90°), droit (= 90°), obtus (> 90°), plat (= 180°). Périmètre du rectangle P = 2 × (L + l), aire A = L × l. Aire du triangle A = (Base × Hauteur) / 2.',
          exercices: [
            'Construire un angle de 65° avec le rapporteur.',
            'Calculer l\'aire et le périmètre d\'un terrain rectangulaire de longueur 25 m et largeur 14 m.'
          ]
        }
      ]
    }
  },

  '5eme': {
    classeTitle: 'Classe de 5ème',
    niveauBadge: 'Niveau 2 - 1er Cycle',
    cycle: 'Cycle d\'Orientation',
    infoColor: 'indigo',
    mathColor: 'blue',
    matiereInformatique: {
      description: 'Conforme au programme MINESEC : Systèmes d\'exploitation avancés, feuilles de calcul (tableur), réseaux locaux et logique des variables.',
      modules: [
        {
          id: 'info-5-m1',
          titre: 'Systèmes d\'Exploitation & Gestion des Fichiers',
          duree: '8h',
          objectifs: 'Organiser l\'arborescence de dossiers, comprendre les extensions (.pdf, .docx, .xlsx, .mp4) et les droits d\'accès.',
          resume: 'Le système d\'exploitation (Windows, Linux Ubuntu, macOS) gère le matériel, les processus et l\'arborescence de stockage hiérarchique. Gestion du chemin absolu et relatif des fichiers, compression zip et règles de sauvegarde (règle 3-2-1).',
          exercices: [
            'Identifier le type de fichier d\'après son extension (.jpg, .py, .html, .xlsx).',
            'Créer une arborescence de dossiers pour classer les cours par trimestre et par matière.'
          ]
        },
        {
          id: 'info-5-m2',
          titre: 'Tableur & Calculs Automatisés (Excel / Calc)',
          duree: '10h',
          objectifs: 'Créer un tableau de données, saisir des formules (=SOMME, =MOYENNE, =MAX, =MIN) et formater les cellules.',
          resume: 'Une feuille de calcul est composée de lignes (numéros) et de colonnes (lettres) formant des cellules (ex: B4). Les formules commencent toujours par le signe "=" et permettent le calcul dynamique des moyennes scolaires, bilans et budgets.',
          exercices: [
            'Écrire la formule de la moyenne trimestrielle pondérée sur Excel.',
            'Utiliser la fonction SOMME pour calculer le total des dépenses mensuelles.'
          ]
        },
        {
          id: 'info-5-m3',
          titre: 'Réseaux Informatiques Locaux (LAN) & Partage',
          duree: '8h',
          objectifs: 'Topologies réseau (étoile, bus, anneau), composants réseau (switch, routeur, câble RJ45, Wi-Fi).',
          resume: 'Un réseau informatique permet à plusieurs ordinateurs de communiquer et de partager des ressources (imprimantes, fichiers, connexion internet). La topologie en étoile reliée à un commutateur (Switch) est la plus répandue.',
          exercices: [
            'Schématiser un réseau local en étoile avec 4 PC reliés à un Switch et une imprimante réseau.',
            'Expliquer le rôle d\'une adresse IP dans l\'identification d\'une machine.'
          ]
        },
        {
          id: 'info-5-m4',
          titre: 'Algorithmes & Notion de Variables',
          duree: '8h',
          objectifs: 'Définir une variable (nom, type, valeur), affectation et instruction conditionnelle simple Si...Alors.',
          resume: 'Une variable est un emplacement mémoire nommé permettant de stocker une valeur modifiable. Les types usuels sont : Entier, Réel, Chaîne de caractères, Booléen. L\'instruction conditionnelle permet d\'exécuter des actions selon qu\'une condition est vraie ou fausse.',
          exercices: [
            'Écrire un algorithme qui demande l\'âge de l\'utilisateur et affiche "Majeur" si âge >= 21 ans (ou 18 ans) et "Mineur" sinon.',
            'Tracer l\'état des variables lors de l\'échange des valeurs de deux variables A et B avec une variable temporaire.'
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Conforme au programme MINESEC : Nombres relatifs, nombres rationnels, proportionnalité, statistiques élémentaires, symétrie centrale, triangles et parallélogrammes.',
      modules: [
        {
          id: 'math-5-m1',
          titre: 'Nombres Relatifs (Positifs et Négatifs)',
          duree: '12h',
          objectifs: 'Repérer sur une droite graduée, comparer et additionner/soustraire des nombres relatifs.',
          resume: 'L\'ensemble des entiers relatifs regroupe les nombres positifs (+5) et négatifs (-8). Règle d\'addition : deux nombres de même signe gardent leur signe commun et on additionne leurs distances à zéro ; de signes contraires, on prend le signe de celui qui a la plus grande distance à zéro.',
          exercices: [
            'Calculer : (+7) + (-12) ; (-9) - (-15) ; (-4) + (-8).',
            'Placer sur un axe gradué les points A(-3,5), B(+2) et C(-1).'
          ]
        },
        {
          id: 'math-5-m2',
          titre: 'Calcul Fractionnaire & Proportionnalité',
          duree: '12h',
          objectifs: 'Additionner, soustraire, multiplier des fractions et calculer des pourcentages.',
          resume: 'Pour additionner deux fractions, on les réduit au même dénominateur : a/b + c/b = (a+c)/b. Pour multiplier : (a/b) × (c/d) = (a×c)/(b×d). Tableau de proportionnalité, coefficient de proportionnalité et règle du produit en croix.',
          exercices: [
            'Calculer : 3/4 + 5/6 et simplifier le résultat.',
            'Dans une classe de 40 élèves, 65% sont des filles. Calculer le nombre de filles et de garçons.'
          ]
        },
        {
          id: 'math-5-m3',
          titre: 'Symétrie Centrale & Parallélogrammes',
          duree: '10h',
          objectifs: 'Construire le symétrique d\'un point/figure par rapport à un point O ; propriétés du parallélogramme.',
          resume: 'La symétrie centrale est un demi-tour (180°) autour d\'un point centre O. Elle conserve les longueurs, les angles, le parallélisme et les aires. Un parallélogramme est un quadrilatère dont les diagonales se coupent en leur milieu.',
          exercices: [
            'Construire le symétrique d\'un triangle ABC par rapport à un point O extérieur.',
            'Démontrer qu\'un quadrilatère dont les côtés opposés sont parallèles deux à deux est un parallélogramme.'
          ]
        },
        {
          id: 'math-5-m4',
          titre: 'Triangles : Somme des Angles & Inégalité Triangulaire',
          duree: '10h',
          objectifs: 'Appliquer la propriété : la somme des angles d\'un triangle vaut 180° ; hauteurs et médiatrices.',
          resume: 'Dans tout triangle ABC, on a : Â + B̂ + Ĉ = 180°. Dans un triangle rectangle, les deux angles aigus sont complémentaires (leur somme vaut 90°). Dans un triangle équilatéral, chaque angle mesure 60°.',
          exercices: [
            'Dans un triangle ABC rectangle en A avec B̂ = 38°, calculer la mesure de Ĉ.',
            'Peut-on construire un triangle de côtés 4 cm, 7 cm et 12 cm ? Justifier par l\'inégalité triangulaire.'
          ]
        }
      ]
    }
  },

  '4eme': {
    classeTitle: 'Classe de 4ème',
    niveauBadge: 'Niveau 3 - 1er Cycle',
    cycle: 'Cycle de Consolidation',
    infoColor: 'amber',
    mathColor: 'orange',
    matiereInformatique: {
      description: 'Conforme au programme MINESEC : Conception de bases de données relationnelles (SGBD), pages web HTML/CSS, algorithmique avec structures itératives et maintenance.',
      modules: [
        {
          id: 'info-4-m1',
          titre: 'Bases de Données Relationnelles & SGBD',
          duree: '10h',
          objectifs: 'Définir table, enregistrement, champ, clé primaire et rédiger des requêtes SQL basiques.',
          resume: 'Un SGBD (Système de Gestion de Base de Données comme MySQL, Access) permet de stocker des informations de manière structurée sans redondance. La clé primaire identifie de façon unique chaque ligne (ex: matricule élève). Requêtes : SELECT, INSERT, UPDATE, DELETE.',
          exercices: [
            'Créer une table ELEVE(Matricule, Nom, DateNaissance, Classe).',
            'Écrire la requête SQL pour afficher tous les élèves de la classe de 4ème.'
          ]
        },
        {
          id: 'info-4-m2',
          titre: 'Création de Pages Web avec HTML & CSS',
          duree: '10h',
          objectifs: 'Structurer un document HTML5 (balises head, body, h1..h6, p, a, img, table) et le styliser avec CSS.',
          resume: 'HTML (HyperText Markup Language) définit la structure et le contenu d\'une page web, tandis que CSS (Cascading Style Sheets) gère la présentation visuelle (couleurs, polices, marges, disposition).',
          exercices: [
            'Rédiger le code HTML d\'une page contenant un titre principal, un paragraphe, une liste à puces et une image.',
            'Appliquer une règle CSS pour mettre le fond de page en gris clair et les titres en bleu foncé.'
          ]
        },
        {
          id: 'info-4-m3',
          titre: 'Algorithmique : Structures Répétitives (Boucles)',
          duree: '10h',
          objectifs: 'Maîtriser les boucles Pour (itérations définies) et TantQue (condition d\'arrêt).',
          resume: 'Une boucle permet de répéter un bloc d\'instructions un certain nombre de fois sans réécrire le code. La boucle "Pour i allant de 1 à N" est utilisée quand le nombre d\'itérations est connu à l\'avance ; la boucle "TantQue" dépend d\'une condition logique.',
          exercices: [
            'Écrire un algorithme qui calcule la factorielle d\'un nombre entier N (N! = 1 × 2 × ... × N).',
            'Écrire un algorithme demandant un mot de passe à l\'utilisateur tant que celui-ci est incorrect.'
          ]
        },
        {
          id: 'info-4-m4',
          titre: 'Maintenance Matérielle & Sécurité du Système',
          duree: '6h',
          objectifs: 'Diagnostic des pannes courantes, virus informatiques, antivirus et nettoyage système.',
          resume: 'La maintenance préventive (dépoussiérage, défragmentation, mises à jour) prolonge la durée de vie des équipements. Les logiciels malveillants (virus, chevaux de Troie, ransomwares) nécessitent l\'installation d\'un antivirus actif et le scan régulier des clés USB.',
          exercices: [
            'Citer trois bonnes pratiques pour protéger un poste informatique contre les infections virales.',
            'Que faire lorsqu\'un ordinateur refuse de s\'allumer ou émet des bips sonores au démarrage ?'
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Conforme au programme MINESEC : Nombres rationnels et puissances, calcul littéral et équations du 1er degré, théorème de Pythagore, cosinus d\'un angle aigu et statistiques.',
      modules: [
        {
          id: 'math-4-m1',
          titre: 'Puissances de 10 & Calcul avec Nombres Rationnels',
          duree: '12h',
          objectifs: 'Calculer avec les puissances d\'exposant entier relatif, notation scientifique et 4 opérations sur les rationnels.',
          resume: 'Propriétés des puissances : a^m × a^n = a^(m+n) ; (a^m)^n = a^(m×n) ; a^m / a^n = a^(m-n). L\'écriture scientifique d\'un nombre est de la forme a × 10^p avec 1 ≤ |a| < 10 et p un entier relatif.',
          exercices: [
            'Écrire en notation scientifique la distance Terre-Soleil : 149 600 000 km.',
            'Calculer et simplifier : A = (2/3 - 1/4) ÷ (5/6 + 1/2).'
          ]
        },
        {
          id: 'math-4-m2',
          titre: 'Calcul Littéral, Développement & Équations du 1er Degré',
          duree: '12h',
          objectifs: 'Développer avec la distributivité, factoriser par un facteur commun et résoudre des équations de la forme ax + b = c.',
          resume: 'Distributivité simple : k(a + b) = ka + kb ; double distributivité : (a + b)(c + d) = ac + ad + bc + bd. Résolution d\'une équation : regrouper les termes en x d\'un côté et les nombres constants de l\'autre.',
          exercices: [
            'Développer et réduire : E = (3x - 2)(2x + 5) - (4x - 1).',
            'Résoudre l\'équation : 5x - 7 = 2x + 11.'
          ]
        },
        {
          id: 'math-4-m3',
          titre: 'Théorème de Pythagore & Sa Réciproque',
          duree: '12h',
          objectifs: 'Calculer la longueur d\'un côté dans un triangle rectangle et démontrer qu\'un triangle est rectangle.',
          resume: 'Théorème direct : Si un triangle ABC est rectangle en A, alors BC² = AB² + AC² (le carré de l\'hypoténuse est égal à la somme des carrés des deux autres côtés). Réciproque : si BC² = AB² + AC², alors le triangle est rectangle en A.',
          exercices: [
            'Dans un triangle ABC rectangle en A, avec AB = 6 cm et AC = 8 cm, calculer la longueur BC.',
            'Un triangle dont les côtés mesurent 5 cm, 12 cm et 13 cm est-il rectangle ? Justifier.'
          ]
        },
        {
          id: 'math-4-m4',
          titre: 'Trigonométrie dans le Triangle Rectangle (Cosinus)',
          duree: '8h',
          objectifs: 'Définition du cosinus d\'un angle aigu : cos(Â) = Côté Adjacent / Hypoténuse ; calcul d\'angles et de longueurs.',
          resume: 'Dans un triangle rectangle, pour un angle aigu α, cos(α) est toujours compris entre 0 et 1 (0 < cos(α) < 1). On utilise la calculatrice pour trouver la mesure d\'un angle connaissant son cosinus (touche cos⁻¹ ou arccos).',
          exercices: [
            'Dans un triangle DEF rectangle en D avec DE = 5 cm et EF = 10 cm, calculer cos(Ê) puis en déduire la mesure de l\'angle Ê.',
            'Calculer la hauteur d\'un arbre projetant une ombre de 15 m lorsque l\'angle avec le soleil est de 40°.'
          ]
        }
      ]
    }
  },

  '3eme': {
    classeTitle: 'Classe de 3ème / Examen BEPC',
    niveauBadge: 'Niveau 4 - Examen Officiel',
    cycle: 'Fin du 1er Cycle Secondaire',
    infoColor: 'emerald',
    mathColor: 'teal',
    matiereInformatique: {
      description: 'Conforme au programme MINESEC / BEPC : Structures de données avancées (tableaux 1D/2D), algorithmique complète, JavaScript et modélisation des systèmes d\'information.',
      modules: [
        {
          id: 'info-3-m1',
          titre: 'Structures de Données : Tableaux à 1 & 2 Dimensions',
          duree: '10h',
          objectifs: 'Déclarer un tableau, accéder aux indices T[i], calculer la somme, moyenne, recherche du max/min et tri.',
          resume: 'Un tableau est une suite ordonnée d\'éléments de même type repérés par un indice numérique (de 1 à N ou 0 à N-1). Parcours séquentiel avec une boucle Pour : calcul d\'indicateurs statistiques et recherche linéaire.',
          exercices: [
            'Écrire l\'algorithme complet de saisie des notes de 30 élèves dans un tableau et d\'affichage de la moyenne générale.',
            'Écrire l\'algorithme de recherche de la note maximale et du nombre d\'élèves ayant la moyenne (≥ 10/20).'
          ]
        },
        {
          id: 'info-3-m2',
          titre: 'Programmation Web Interactive avec JavaScript',
          duree: '10h',
          objectifs: 'Manipuler les événements (onclick, onsubmit), variables, fonctions et validation de formulaires.',
          resume: 'JavaScript est le langage de programmation côté client qui apporte l\'interactivité aux pages web. Les fonctions permettent d\'encapsuler du code réutilisable et d\'interagir dynamiquement avec le DOM (Document Object Model).',
          exercices: [
            'Créer une fonction JavaScript qui vérifie qu\'un champ mot de passe comporte au moins 8 caractères avant la soumission.',
            'Écrire un script modifiant le texte d\'un élément HTML lors du clic sur un bouton.'
          ]
        },
        {
          id: 'info-3-m3',
          titre: 'Modélisation des Systèmes d\'Information (Méthode MERISE)',
          duree: '8h',
          objectifs: 'Construire un Modèle Conceptuel de Données (MCD) avec entités, attributs, identifiants et cardinalités.',
          resume: 'La méthode MERISE permet de concevoir une base de données cohérente. Concepts clés : Entité (ex: LIVRE, EMPRUNTEUR), Relation/Association (ex: EMPRUNTER), Cardinalités (0,1 ; 1,1 ; 0,n ; 1,n) et passage au Modèle Logique de Données (MLD).',
          exercices: [
            'Concevoir le MCD d\'une pharmacie pour la gestion des médicaments et des ventes aux clients.',
            'Déterminer les clés primaires et étrangères résultant de la transformation en MLD.'
          ]
        },
        {
          id: 'info-3-m4',
          titre: 'Révisions Générales & Méthodologie Examen BEPC',
          duree: '12h',
          objectifs: 'Résolution méthodique des sujets types BEPC session MINESEC (théorie, pratique, algorithmique, réseaux).',
          resume: 'Synthèse des 4 années du premier cycle : matériel, réseaux LAN/WAN, internet, tableurs, bases de données, sécurité informatique, algorithmique sur tableaux et rédaction rigoureuse des réponses d\'examen.',
          exercices: [
            'Résoudre l\'épreuve nationale BEPC 2024 (partie théorique et pratique).',
            'Corriger les erreurs fréquentes de syntaxe dans les algorithmes proposés aux examens.'
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Conforme au programme MINESEC / BEPC : Racines carrées, identités remarquables, factorisations avancées, systèmes d\'équations linéaires, théorème de Thalès, trigonométrie et statistiques complètes.',
      modules: [
        {
          id: 'math-3-m1',
          titre: 'Racines Carrées & Calcul Numérique Avancé',
          duree: '12h',
          objectifs: 'Propriétés de √a : √(a×b) = √a × √b, simplification sous la forme a√b et rendre rationnel le dénominateur.',
          resume: 'Pour tout réel positif a, √a est le nombre positif dont le carré vaut a. Règle fondamentale : √(a+b) ≠ √a + √b. Rendre rationnel le dénominateur d\'une fraction en multipliant par l\'expression conjuguée.',
          exercices: [
            'Écrire sous la forme a√b : A = √75 - 2√27 + √12.',
            'Rendre rationnel le dénominateur de la fraction : 4 / (√5 - 1).'
          ]
        },
        {
          id: 'math-3-m2',
          titre: 'Identités Remarquables & Systèmes d\'Équations (2x2)',
          duree: '14h',
          objectifs: 'Maîtriser les 3 identités remarquables et résoudre des systèmes de deux équations à deux inconnues (substitution, combinaison).',
          resume: '1) (a+b)² = a² + 2ab + b² ; 2) (a-b)² = a² - 2ab + b² ; 3) (a-b)(a+b) = a² - b². Résolution de systèmes linéaires ax + by = c et a\'x + b\'y = c\' par la méthode de substitution ou des combinaisons linéaires.',
          exercices: [
            'Factoriser l\'expression : F = (2x - 3)² - (x + 5)².',
            'Résoudre le système d\'équations : { 2x + 3y = 28 ; 5x - y = 19 }.'
          ]
        },
        {
          id: 'math-3-m3',
          titre: 'Théorème de Thalès & Sa Réciproque',
          duree: '12h',
          objectifs: 'Calculer des longueurs proportionnelles dans le triangle ou la configuration papillon et prouver le parallélisme.',
          resume: 'Si (d) et (d\') sont deux droites sécantes en A, B et M sur (d), C et N sur (d\') tels que (BC) // (MN), alors : AM/AB = AN/AC = MN/BC. La réciproque permet de démontrer que deux droites sont strictement parallèles.',
          exercices: [
            'Dans un triangle ABC, avec M sur [AB] et N sur [AC], AB = 8 cm, AM = 3 cm, AC = 12 cm. Calculer AN pour que (MN) soit parallèle à (BC).',
            'Appliquer le théorème de Thalès pour mesurer la largeur inaccessible d\'une rivière.'
          ]
        },
        {
          id: 'math-3-m4',
          titre: 'Trigonométrie Complète & Angles Inscrits',
          duree: '10h',
          objectifs: 'Sinus, Cosinus, Tangente dans le triangle rectangle ; relation fondamentale cos²(x) + sin²(x) = 1 et angles inscrits.',
          resume: 'Formules mnémotechniques SOH-CAH-TOA : sin(α) = Opposé/Hypoténuse ; cos(α) = Adjacent/Hypoténuse ; tan(α) = Opposé/Adjacent. Théorème de l\'angle au centre : la mesure de l\'angle au centre est le double de celle de l\'angle inscrit interceptant le même arc.',
          exercices: [
            'Sachant que cos(x) = 3/5 pour un angle aigu x, calculer la valeur exacte de sin(x) et tan(x).',
            'Démontrer que deux angles inscrits interceptant le même arc de cercle sont égaux.'
          ]
        }
      ]
    }
  },

  '2nde': {
    classeTitle: 'Classe de Seconde (2nde A / C / SES / TI)',
    niveauBadge: 'Niveau 5 - 2nd Cycle',
    cycle: 'Cycle de Détermination',
    infoColor: 'teal',
    mathColor: 'emerald',
    matiereInformatique: {
      description: 'Conforme au programme MINESEC : Représentation et codage de l\'information (binaire, hexadécimal, ASCII/Unicode), architecture interne de l\'ordinateur, logique booléenne et introduction à Python.',
      modules: [
        {
          id: 'info-2nde-m1',
          titre: 'Codage & Numération : Binaire, Décimal & Hexadécimal',
          duree: '12h',
          objectifs: 'Convertir entre bases 2, 10 et 16 ; comprendre le codage des caractères et des nombres entiers signés.',
          resume: 'L\'ordinateur ne manipule que des états binaires 0 et 1 (bits). Un octet = 8 bits (256 valeurs de 0 à 255). Conversions : division successive par la base et puissances de 2 (1, 2, 4, 8, 16, 32, 64, 128). La base 16 (hexadécimale : 0-9, A-F) simplifie la notation des adresses mémoire et codes couleurs RGB.',
          exercices: [
            'Convertir le nombre décimal 197 en base binaire et en base hexadécimale.',
            'Effectuer l\'addition binaire de (101101)₂ et (11011)₂.'
          ]
        },
        {
          id: 'info-2nde-m2',
          titre: 'Architecture Interne : Processeur (CPU), Bus & Mémoires',
          duree: '10h',
          objectifs: 'Structure de Von Neumann : unité de commande, unité arithmétique et logique (UAL), registres, bus de données/adresses.',
          resume: 'L\'architecture de Von Neumann est le modèle de base de l\'informatique moderne. Le cycle d\'instruction comprend : Fetch (recherche en mémoire), Decode (décodage de l\'instruction), Execute (exécution par l\'UAL) et Store (écriture du résultat).',
          exercices: [
            'Détailler le rôle du compteur ordinal (PC) et du registre d\'instruction (IR) dans l\'exécution d\'un programme.',
            'Distinguer la mémoire cache L1/L2/L3, la RAM et la mémoire morte ROM.'
          ]
        },
        {
          id: 'info-2nde-m3',
          titre: 'Algèbre de Boole & Circuits Logiques',
          duree: '10h',
          objectifs: 'Portes logiques de base (ET, OU, NON, NAND, NOR, XOR), tables de vérité et simplification d\'équations booléennes.',
          resume: 'L\'algèbre de Boole traite des variables binaires (0 ou 1). Théorèmes fondamentaux de De Morgan : NON(A ET B) = NON(A) OU NON(B) et NON(A OU B) = NON(A) ET NON(B). Réalisation de circuits combinatoires comme l\'additionneur binaire.',
          exercices: [
            'Dresser la table de vérité de la fonction F = (A OU B) ET (NON(A) OU C).',
            'Simplifier l\'expression booléenne S = A.B + A.B̄.'
          ]
        },
        {
          id: 'info-2nde-m4',
          titre: 'Initiation à la Programmation Python',
          duree: '12h',
          objectifs: 'Variables, types fondamentaux (int, float, str, list), conditions if/elif/else et boucles for/while en syntaxe Python.',
          resume: 'Python est un langage interprété, lisible et puissant. Indentation obligatoire, gestion des listes (append, len, range), définition de fonctions avec le mot-clé `def` et traitement de données.',
          exercices: [
            'Écrire un script Python qui prend une liste de nombres et retourne la moyenne arithmétique et le nombre de valeurs paires.',
            'Créer un jeu en Python où l\'ordinateur choisit un nombre aléatoire entre 1 et 100 et l\'utilisateur doit le deviner.'
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Conforme au programme MINESEC : Ensembles de nombres, calcul algébrique, fonctions d\'une variable réelle (généralités, variations, parité), équations et inéquations du 2nd degré, vecteurs du plan et trigonométrie circulaire.',
      modules: [
        {
          id: 'math-2nde-m1',
          titre: 'Ensembles de Nombres, Intervalles & Valeur Absolue',
          duree: '12h',
          objectifs: 'Inclusions ℕ ⊂ ℤ ⊂ ⅅ ⊂ ℚ ⊂ ℝ ; opérations sur les intervalles (union ∪, intersection ∩) et propriétés de |x|.',
          resume: 'Tout réel x admet une valeur absolue |x| représentant sa distance à 0 sur la droite numérique. Propriétés : |x| ≥ 0, |x × y| = |x| × |y| et l\'inégalité triangulaire |x + y| ≤ |x| + |y|. Résolution d\'inéquations du type |x - a| ≤ r sous forme d\'intervalle [a-r ; a+r].',
          exercices: [
            'Résoudre dans ℝ l\'équation |2x - 3| = 7 et l\'inéquation |x + 4| < 3.',
            'Déterminer l\'intersection et l\'union des intervalles I = [-5 ; 3[ et J = ]1 ; 8].'
          ]
        },
        {
          id: 'math-2nde-m2',
          titre: 'Généralités sur les Fonctions & Étude Graphique',
          duree: '14h',
          objectifs: 'Ensemble de définition, parité (paire / impaire), sens de variation, extremums locaux et lecture graphique.',
          resume: 'Une fonction f associe à tout réel x de son domaine Df un unique réel f(x). Une fonction est paire si f(-x) = f(x) (symétrie par rapport à l\'axe des ordonnées) ; impaire si f(-x) = -f(x) (symétrie par rapport à l\'origine). Fonctions de référence : x ↦ x², x ↦ 1/x, x ↦ √x.',
          exercices: [
            'Déterminer l\'ensemble de définition de la fonction f(x) = √(3x - 6) / (x² - 9).',
            'Étudier la parité de la fonction g(x) = 3x³ - 5x sur ℝ.'
          ]
        },
        {
          id: 'math-2nde-m3',
          titre: 'Polynômes du Second Degré : Forme Canonique & Discriminant',
          duree: '14h',
          objectifs: 'Mise sous forme canonique de ax² + bx + c, calcul du discriminant Δ = b² - 4ac, factorisation et tableau de signes.',
          resume: 'Si Δ > 0, deux racines réelles distinctes x₁ = (-b - √Δ)/2a et x₂ = (-b + √Δ)/2a ; si Δ = 0, racine double x₀ = -b/2a ; si Δ < 0, aucune racine réelle. Signe du trinôme : du signe de a à l\'extérieur des racines et du signe de -a entre les racines.',
          exercices: [
            'Résoudre dans ℝ l\'équation : 2x² - 5x - 3 = 0.',
            'Dresser le tableau de signes et résoudre l\'inéquation : -3x² + 7x - 2 ≥ 0.'
          ]
        },
        {
          id: 'math-2nde-m4',
          titre: 'Vecteurs du Plan, Repérage & Produit Scalaire Introductif',
          duree: '12h',
          objectifs: 'Colinéarité de deux vecteurs (déterminant xy\' - x\'y = 0), coordonnées du milieu, distance entre deux points et barycentre.',
          resume: 'Deux vecteurs non nuls u(x,y) et v(x\',y\') sont colinéaires si et seulement si xy\' - x\'y = 0. Dans un repère orthonormé (O, i, j), la distance AB = √[(xB - xA)² + (yB - yA)²]. Barycentre de deux points pondérés (A, α) et (B, β) avec α + β ≠ 0.',
          exercices: [
            'Les points A(-2 ; 1), B(2 ; 3) et C(6 ; 5) sont-ils alignés ? Justifier à l\'aide des vecteurs.',
            'Construire le barycentre G des points pondérés (A, 2) et (B, 3).'
          ]
        }
      ]
    }
  },

  '1ere': {
    classeTitle: 'Classe de Première (1ère C / D / A / TI) - Probatoire',
    niveauBadge: 'Niveau 6 - Examen Probatoire',
    cycle: 'Préparation au Probatoire',
    infoColor: 'purple',
    mathColor: 'indigo',
    matiereInformatique: {
      description: 'Conforme au programme MINESEC / Probatoire : Systèmes de gestion de bases de données relationnelles avancées (SQL DDL/DML), programmation procédurale en C/Python, réseaux IP et sécurité des SI.',
      modules: [
        {
          id: 'info-1ere-m1',
          titre: 'Bases de Données Relationnelles & Requêtes SQL Avancées',
          duree: '14h',
          objectifs: 'Création de tables (CREATE TABLE, contraintes PRIMARY KEY, FOREIGN KEY, NOT NULL), jointures JOIN et fonctions d\'agrégation.',
          resume: 'SQL (Structured Query Language) comprend le LDD (Langage de Définition de Données) et le LMD (Langage de Manipulation de Données). Les jointures (INNER JOIN, LEFT JOIN) permettent d\'extraire des données réparties sur plusieurs tables reliées par des clés étrangères.',
          exercices: [
            'Écrire le script SQL de création d\'une base de gestion des notes scolaires avec intégrité référentielle.',
            'Rédiger une requête avec jointure affichant le nom de l\'élève, la matière et la moyenne obtenue, ordonnée par ordre décroissant.'
          ]
        },
        {
          id: 'info-1ere-m2',
          titre: 'Programmation Procédurale & Fonctions en C / Python',
          duree: '14h',
          objectifs: 'Passage de paramètres par valeur et par adresse (pointeurs en C), modularité, fonctions récursives et structures de données.',
          resume: 'La programmation modulaire découpe un problème complexe en sous-programmes (fonctions et procédures). Une fonction récursive est une fonction qui s\'appelle elle-même avec une condition de terminaison (cas de base) pour éviter une boucle infinie.',
          exercices: [
            'Écrire une fonction récursive en C ou Python qui calcule le n-ième terme de la suite de Fibonacci.',
            'Créer un programme qui recherche un élément dans un tableau trié par dichotomie (recherche binaire O(log N)).'
          ]
        },
        {
          id: 'info-1ere-m3',
          titre: 'Réseaux Informatiques : Modèle OSI & Adressage IP (IPv4)',
          duree: '12h',
          objectifs: 'Les 7 couches du modèle OSI, classes d\'adresses IPv4 (A, B, C), masques de sous-réseau et calcul de plages d\'hôtes.',
          resume: 'Le modèle OSI (Physique, Liaison, Réseau, Transport, Session, Présentation, Application) standardise les communications. L\'adresse IPv4 sur 32 bits est découpée en NetID et HostID via le masque de sous-réseau (ex: 255.255.255.0 = /24).',
          exercices: [
            'Pour l\'adresse IP 192.168.10.75/26, calculer l\'adresse réseau, l\'adresse de diffusion (broadcast) et le nombre d\'hôtes utilisables.',
            'Expliquer la différence fondamentale entre les protocoles de transport TCP (orienté connexion) et UDP (non connecté).'
          ]
        },
        {
          id: 'info-1ere-m4',
          titre: 'Sécurité Informatique, Cryptographie & Éthique Numérique',
          duree: '10h',
          objectifs: 'Principes de sécurité (DICP : Disponibilité, Intégrité, Confidentialité, Preuve), chiffrement symétrique/asymétrique et législation.',
          resume: 'La cybersécurité protège les systèmes d\'information contre les cyberattaques. Le chiffrement symétrique (ex: AES) utilise une seule clé secrète partagée, tandis que le chiffrement asymétrique (ex: RSA) utilise une paire de clés publique/privée.',
          exercices: [
            'Expliquer le fonctionnement d\'une signature numérique garantissant l\'authenticité et l\'intégrité d\'un message.',
            'Analyser une étude de cas d\'attaque par hameçonnage (phishing) et proposer les mesures de remédiation.'
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Conforme au programme MINESEC / Probatoire : Dérivabilité et études de fonctions, suites numériques arithmétiques et géométriques, trigonométrie circulaire, barycentres dans le plan et l\'espace, dénombrement et probabilités simples.',
      modules: [
        {
          id: 'math-1ere-m1',
          titre: 'Limites de Fonctions & Continuité',
          duree: '14h',
          objectifs: 'Calculs de limites en l\'infini et en un point, formes indéterminées (0/0, ∞/∞, +∞ - ∞, 0×∞) et asymptotes (verticale, horizontale, oblique).',
          resume: 'Une fonction f admet pour asymptote verticale la droite d\'équation x = a si lim(x→a) f(x) = ±∞ ; une asymptote horizontale d\'équation y = L si lim(x→±∞) f(x) = L. Levée d\'indéterminée par factorisation du terme prépondérant ou multiplication par l\'expression conjuguée.',
          exercices: [
            'Calculer : lim(x→+∞) (2x² - 3x + 1) / (5x² + 7) et lim(x→2) (x² - 4) / (x - 2).',
            'Démontrer que la droite y = 2x - 1 est asymptote oblique à la courbe de f(x) = (2x² - x + 3)/(x + 1).'
          ]
        },
        {
          id: 'math-1ere-m2',
          titre: 'Dérivation & Étude Complète de Fonctions',
          duree: '16h',
          objectifs: 'Formules de dérivées usuelles, dérivée d\'un quotient u/v, sens de variation, extremums, équation de la tangente et tracé de courbe.',
          resume: 'Le nombre dérivé f\'(a) est la pente de la tangente au point d\'abscisse a : T : y = f\'(a)(x - a) + f(a). Si f\'(x) > 0 sur un intervalle I, alors f est strictement croissante sur I ; si f\'(x) < 0, f est strictement décroissante.',
          exercices: [
            'Déterminer la fonction dérivée de f(x) = (3x - 1) / (x² + 2) et dresser son tableau de variations.',
            'Écrire l\'équation de la tangente à la courbe au point d\'abscisse x₀ = 1.'
          ]
        },
        {
          id: 'math-1ere-m3',
          titre: 'Suites Numériques : Arithmétiques & Géométriques',
          duree: '12h',
          objectifs: 'Formules du terme général Un, somme des n premiers termes, sens de variation et convergence.',
          resume: 'Suite arithmétique de raison r : Un = U₀ + n.r ; somme S = n × (premier + dernier) / 2. Suite géométrique de raison q : Un = U₀ × qⁿ ; somme S = premier × (1 - qⁿ) / (1 - q) pour q ≠ 1.',
          exercices: [
            'Soit (Un) une suite arithmétique telle que U₃ = 11 et U₇ = 23. Calculer la raison r, le premier terme U₀ et U₂₀.',
            'Calculer la somme : S = 1 + 2 + 4 + 8 + ... + 1024.'
          ]
        },
        {
          id: 'math-1ere-m4',
          titre: 'Barycentres & Lignes de Niveau dans le Plan',
          duree: '12h',
          objectifs: 'Barycentre de 3 ou 4 points pondérés, théorème du barycentre partiel (associativité) et ensembles de points.',
          resume: 'Le point G est le barycentre de {(A, α), (B, β), (C, γ)} avec α+β+γ ≠ 0 si et seulement si α.GA + β.GB + γ.GC = 0 (vecteurs). Pour tout point M du plan : α.MA + β.MB + γ.MC = (α+β+γ).MG. Détermination de lignes de niveau de l\'application M ↦ ||α.MA + β.MB||.',
          exercices: [
            'Soit ABC un triangle. Construire le barycentre G de {(A, 1), (B, 2), (C, -1)}.',
            'Déterminer l\'ensemble des points M du plan tels que ||MA + 2MB - MC|| = 6.'
          ]
        }
      ]
    }
  },

  'tle': {
    classeTitle: 'Classe de Terminale (Tle C / D / A / TI) - Baccalauréat',
    niveauBadge: 'Niveau 7 - Examen du Baccalauréat',
    cycle: 'Cycle Terminal d\'Excellence',
    infoColor: 'rose',
    mathColor: 'red',
    matiereInformatique: {
      description: 'Conforme au programme MINESEC / Baccalauréat : Programmation Orientée Objet (POO en Python/Java/C++), structures de données dynamiques (piles, files, arbres binaires, graphes), systèmes d\'exploitation & réseaux d\'entreprise, et sécurité avancée.',
      modules: [
        {
          id: 'info-tle-m1',
          titre: 'Programmation Orientée Objet (POO) : Classes, Objets & Héritage',
          duree: '16h',
          objectifs: 'Concepts d\'encapsulation, instanciation, constructeurs, attributs, méthodes, héritage et polymorphisme.',
          resume: 'La POO modélise des entités du monde réel sous forme d\'objets combinant état (attributs) et comportement (méthodes). Une classe est le patron (blueprint) permettant de créer des instances. L\'héritage permet à une sous-classe d\'étendre et spécialiser une classe mère.',
          exercices: [
            'Créer une classe CompteBancaire avec méthodes deposer(), retirer(), afficherSolde() et gestion du découvert.',
            'Créer une classe dérivée CompteEpargne appliquant un taux d\'intérêt annuel.'
          ]
        },
        {
          id: 'info-tle-m2',
          titre: 'Structures de Données Avancées : Piles, Files, Arbres & Graphes',
          duree: '14h',
          objectifs: 'Principe LIFO (Pile) et FIFO (File), arbres binaires de recherche (parcours préfixe, infixe, postfixe) et algorithmes sur graphes.',
          resume: 'Les structures de données avancées optimisent le stockage et la rapidité d\'accès aux informations en mémoire. Un arbre binaire de recherche (ABR) permet des recherches en temps logarithmique O(log N) lorsque l\'arbre est équilibré.',
          exercices: [
            'Implémenter une Pile (Stack) avec les opérations empiler (push) et dépiler (pop).',
            'Effectuer le parcours infixe d\'un arbre binaire de recherche et montrer que les valeurs obtenues sont triées.'
          ]
        },
        {
          id: 'info-tle-m3',
          titre: 'Services Réseau d\'Entreprise : DHCP, DNS, Routage & Pare-feu',
          duree: '12h',
          objectifs: 'Fonctionnement des protocoles d\'infrastructure réseau, tables de routage, NAT/PAT et politiques de sécurité pare-feu.',
          resume: 'DHCP attribue automatiquement des configurations IP aux postes clients ; le DNS traduit les noms de domaine en adresses IP ; les routeurs utilisent des protocoles de routage (statique, RIP, OSPF) pour déterminer le chemin optimal d\'acheminement des paquets.',
          exercices: [
            'Expliquer en détail les 4 phases du processus DHCP (DORA : Discover, Offer, Request, Acknowledge).',
            'Configurer une règle de pare-feu iptables autorisant le trafic web HTTP/HTTPS et bloquant le reste.'
          ]
        },
        {
          id: 'info-tle-m4',
          titre: 'Analyse, Conception Logicielle & Préparation Baccalauréat',
          duree: '16h',
          objectifs: 'Diagrammes UML (Cas d\'utilisation, Classes, Séquence), rédaction de code sans faute et résolution intégrale des épreuves du Baccalauréat.',
          resume: 'UML (Unified Modeling Language) est le standard mondial de modélisation orientée objet. Révision complète des annales du Baccalauréat camerounais : modélisation, requêtes SQL complexes, POO et réseaux informatiques.',
          exercices: [
            'Modéliser le diagramme de classes UML d\'une plateforme d\'e-learning avec gestion des cours, devoirs et étudiants.',
            'Résoudre l\'épreuve nationale du Baccalauréat 2024 (séries scientifiques et techniques).'
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Conforme au programme MINESEC / Baccalauréat : Nombres complexes, fonctions logarithme népérien et exponentielle, calcul intégral et équations différentielles, géométrie dans l\'espace, probabilités et lois de distribution.',
      modules: [
        {
          id: 'math-tle-m1',
          titre: 'Nombres Complexes & Applications Géométriques',
          duree: '18h',
          objectifs: 'Forme algébrique a + ib, module |z|, argument arg(z), forme trigonométrique et exponentielle e^(iθ), formule de Moivre et d\'Euler, racines n-ièmes et transformations géométriques.',
          resume: 'L\'ensemble ℂ contient un nombre imaginaire i tel que i² = -1. Tout complexe z s\'écrit z = a + ib = r.e^(iθ). Applications géométriques remarquables : distance AB = |zB - zA| et angle orienté (AB, CD) = arg((zD - zC)/(zB - zA)).',
          exercices: [
            'Résoudre dans ℂ l\'équation : z² - 2z + 4 = 0 et exprimer les solutions sous forme exponentielle.',
            'Déterminer la nature et les éléments caractéristiques de la transformation géométrique d\'écriture complexe z\' = 2i.z + 1 - i.'
          ]
        },
        {
          id: 'math-tle-m2',
          titre: 'Fonctions Logarithme Népérien (ln) & Exponentielle (exp)',
          duree: '18h',
          objectifs: 'Propriétés algébriques : ln(a×b) = ln(a)+ln(b), e^(a+b) = e^a × e^b ; limites usuelles (croissances comparées), dérivées et études de fonctions.',
          resume: 'La fonction ln est la primitive de 1/x sur ]0 ; +∞[ qui s\'annule en 1. La fonction exponentielle exp(x) = e^x est la bijection réciproque de ln. Croissances comparées : lim(x→+∞) e^x / x^n = +∞ et lim(x→+∞) ln(x) / x^n = 0.',
          exercices: [
            'Résoudre dans ℝ l\'équation : ln(x + 3) + ln(x - 1) = ln(5).',
            'Étudier la fonction f(x) = (x - 2).e^x + 1 : variations, limites aux bornes, branches infinies et tracé de la courbe.'
          ]
        },
        {
          id: 'math-tle-m3',
          titre: 'Calcul Intégral, Primitives & Équations Différentielles',
          duree: '16h',
          objectifs: 'Calcul de primitives, intégration par parties (IPP), calcul d\'aires et volumes, résolution des équations différentielles y\' = ay + b et y\'\' + ω²y = 0.',
          resume: 'L\'intégrale définie de a à b de f(x)dx est égale à F(b) - F(a) où F est une primitive de f. Intégration par parties : ∫ u(x)v\'(x)dx = [u(x)v(x)] - ∫ u\'(x)v(x)dx. Les solutions générales de y\' = ay sont de la forme y(x) = C.e^(ax).',
          exercices: [
            'Calculer l\'intégrale à l\'aide d\'une IPP : I = ∫₁ᵉ x.ln(x) dx.',
            'Résoudre l\'équation différentielle 2y\' + 3y = 0 avec la condition initiale y(0) = 4.'
          ]
        },
        {
          id: 'math-tle-m4',
          titre: 'Probabilités Conditionnelles & Variables Aléatoires',
          duree: '14h',
          objectifs: 'Arbres pondérés, formule des probabilités totales, loi binomiale B(n, p), espérance E(X), variance V(X) et écart-type.',
          resume: 'Probabilité conditionnelle : P_B(A) = P(A ∩ B) / P(B). Formule des probabilités totales : P(A) = ∑ P(A ∩ Bi). Une épreuve de Bernoulli répétée n fois de manière indépendante donne une loi binomiale : P(X = k) = C_n^k × p^k × (1-p)^(n-k).',
          exercices: [
            'Une usine fabrique des composants électroniques avec un taux de défectuosité de 3%. On prélève un échantillon de 10 composants. Calculer la probabilité d\'avoir exactement 1 composant défectueux.',
            'Calculer l\'espérance et l\'écart-type du gain dans un jeu de hasard équitable.'
          ]
        }
      ]
    }
  }
};
