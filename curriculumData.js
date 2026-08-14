export const classesData = [
  { id: '6eme', name: '6ème', cycle: '1er Cycle (Observation)', color: 'blue', desc: 'Fondamentaux de l\'informatique, bureautique, Scratch et base du raisonnement arithmétique/géométrique.' },
  { id: '5eme', name: '5ème', cycle: '1er Cycle (Orientation)', color: 'indigo', desc: 'Tableurs Excel, réseaux locaux, nombres relatifs, fractions et symétries.' },
  { id: '4eme', name: '4ème', cycle: '1er Cycle (Consolidation)', color: 'amber', desc: 'Algorithmique, bases de données relationnelles, calcul littéral, théorèmes de Pythagore et Thalès.' },
  { id: '3eme', name: '3ème (BEPC)', cycle: '1er Cycle (Examen BEPC)', color: 'emerald', desc: 'Préparation intensive au BEPC : algorithmique avancée, JavaScript/Web, trigonométrie, arithmétique et statistiques.' },
  { id: '2nde', name: 'Seconde (2nde A/C/TI)', cycle: '2nd Cycle (Détermination)', color: 'teal', desc: 'Systèmes numériques, codage binaire, langage Python/C, fonctions numériques et vecteurs.' },
  { id: '1ere', name: 'Première (1ère A/C/D/TI)', cycle: '2nd Cycle (Probatoire)', color: 'purple', desc: 'Préparation au Probatoire : bases de données SQL, POO, dérivation, études de fonctions et barycentres.' },
  { id: 'tle', name: 'Terminale (Tle A/C/D/TI)', cycle: '2nd Cycle (Baccalauréat)', color: 'rose', desc: 'Préparation au Baccalauréat : réseaux d\'entreprise, ABR/Graphes, nombres complexes, intégrales et probabilités.' }
];

export const curriculum = {
  '6eme': {
    classeTitle: 'Classe de 6ème',
    niveauBadge: 'Niveau 1 - 1er Cycle',
    cycle: 'Cycle d\'Observation',
    matiereInformatique: {
      description: 'Programme officiel MINESEC : Découverte du micro-ordinateur, bureautique, Internet citoyen et initiation aux algorithmes avec Scratch.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'info-6-m1',
              sequence: 'Séquence 1',
              titre: 'Environnement Matériel & Logiciel du Micro-ordinateur',
              duree: '8h de cours + 4h TP',
              objectifs: 'Identifier l\'unité centrale, les périphériques d\'entrée/sortie/stockage, allumer et éteindre un PC selon les normes de sécurité.',
              coursComplet: `
### 1. Qu'est-ce qu'un ordinateur ?
Un micro-ordinateur est une machine électronique programmable conçue pour traiter automatiquement des informations sous différentes formes (textes, images, sons, vidéos).

### 2. Les deux composantes fondamentales
- **Le Matériel (Hardware) :** Ce sont les composants physiques visibles et palpables.
  - *L'Unité Centrale :* Le boîtier contenant la carte mère, le microprocesseur (CPU - cerveau de l'ordinateur), la mémoire vive (RAM) et le disque dur.
  - *Les Périphériques d'entrée :* Permettent d'envoyer des informations à l'ordinateur (Clavier, Souris, Scanner, Microphone, Webcam).
  - *Les Périphériques de sortie :* Restituent les résultats à l'utilisateur (Écran/Moniteur, Imprimante, Haut-parleurs, Vidéoprojecteur).
  - *Les Périphériques de stockage :* Conservent les données durablement (Clé USB, Disque Dur externe, Carte mémoire SD).
- **Le Logiciel (Software) :** Ensemble de programmes et données indiquant à la machine ce qu'elle doit faire.
  - *Système d'exploitation (OS) :* Windows, Linux, Android, macOS.
  - *Logiciels d'application :* Word, Paint, Scratch, VLC, Google Chrome.

### 3. Procédure de mise sous tension et d'arrêt sécurisé
1. Vérifier les branchements et allumer le régulateur de tension (onduleur).
2. Appuyer sur le bouton Power de l'unité centrale puis sur celui de l'écran.
3. Pour éteindre : Cliquer sur le menu *Démarrer* > *Arrêter* (Ne jamais débrancher directement la prise secteur pour éviter d'endommager le disque dur).
              `,
              tpPratique: {
                titre: 'TP Pratique 1 : Identification du matériel et arborescence de fichiers',
                enonce: 'Créer un dossier nommé "INFORMATIQUE_6EME" sur le Bureau, et à l\'intérieur créer deux sous-dossiers "COURS" et "DEVOIRS".',
                guide: '1. Clic droit sur un espace vide du Bureau -> Nouveau -> Dossier.\n2. Taper le nom en majuscules.\n3. Double-cliquer pour entrer, puis répéter pour les sous-dossiers.'
              },
              exercices: [
                {
                  question: 'Classer les éléments suivants en Périphérique d\'Entrée, de Sortie ou de Stockage : Clavier, Écran, Clé USB, Souris, Imprimante, Scanner, Carte SD.',
                  correction: '• Entrée : Clavier, Souris, Scanner.\n• Sortie : Écran, Imprimante.\n• Stockage : Clé USB, Carte SD.'
                },
                {
                  question: 'Expliquer le rôle de la mémoire vive (RAM) par rapport au disque dur.',
                  correction: 'La mémoire RAM est une mémoire temporaire ultra-rapide qui contient les programmes en cours d\'exécution. Elle s\'efface à l\'extinction. Le disque dur conserve les données de façon permanente.'
                }
              ]
            },
            {
              id: 'info-6-m2',
              sequence: 'Séquence 2',
              titre: 'Production de Documents Textes avec Microsoft Word / Writer',
              duree: '10h de cours + 6h TP',
              objectifs: 'Maîtriser la saisie au clavier, la mise en forme du texte (police, gras, couleur), l\'insertion d\'images et l\'enregistrement au format PDF/DOCX.',
              coursComplet: `
### 1. Interface d'un Traitement de Texte
Un logiciel de traitement de texte (comme Word ou LibreOffice Writer) est composé de :
- La barre de titre et le ruban avec les onglets (Accueil, Insertion, Mise en page).
- La zone de travail (feuille blanche virtuelle).
- La barre d'état (affiche le nombre de mots et la langue du dictionnaire).

### 2. Les Règles Fondamentales de Typographie
- Mettre une majuscule en début de phrase et après chaque point.
- Ponctuation simple (, .) : Pas d'espace avant, un espace après.
- Ponctuation double (: ; ? !) : Un espace insécable avant, un espace après.
- Pour changer de paragraphe, appuyer sur la touche **Entrée**. Pour aller à la ligne sans changer de paragraphe : **Maj + Entrée**.

### 3. Les Outils de Mise en Forme
- Police (Arial, Times New Roman), Taille (12pt pour le texte courant, 16pt pour les titres).
- Attributs : **Gras** (Ctrl+G), *Italique* (Ctrl+I), <u>Souligné</u> (Ctrl+U).
- Alignements : Aligné à gauche, Centré (pour les titres), Justifié (pour un document soigné).
              `,
              tpPratique: {
                titre: 'TP Pratique 2 : Rédaction d\'une lettre administrative et d\'un poème',
                enonce: 'Rédiger une demande d\'inscription adressée au Chef d\'Établissement avec titre centré en gras et corps de texte justifié.',
                guide: 'Utiliser la police Times New Roman taille 14, interligne 1.15, et exporter le résultat final en format PDF.'
              },
              exercices: [
                {
                  question: 'Citer les raccourcis clavier sous Windows pour : Enregistrer, Copier, Coller et Annuler.',
                  correction: '• Enregistrer : Ctrl + S\n• Copier : Ctrl + C\n• Coller : Ctrl + V\n• Annuler : Ctrl + Z'
                }
              ]
            }
          ]
        },
        {
          nom: 'Trimestre 2 (Séquences 3 & 4)',
          modules: [
            {
              id: 'info-6-m3',
              sequence: 'Séquence 3',
              titre: 'Navigation Web, Moteurs de Recherche & Éthique Numérique',
              duree: '8h de cours + 4h TP',
              objectifs: 'Naviguer efficacement sur Internet, formuler des requêtes pertinentes sur Google et adopter un comportement citoyen sécurisé.',
              coursComplet: `
### 1. Définitions Clés
- **Internet :** Réseau informatique mondial reliant des millions d'ordinateurs via le protocole TCP/IP.
- **Le Web (World Wide Web) :** Service d'Internet permettant de consulter des pages reliées entre elles par des hyperliens (URL).
- **Navigateur Web :** Logiciel client qui interprète le langage HTML (Chrome, Mozilla Firefox, Microsoft Edge, Safari).
- **Moteur de recherche :** Outil en ligne indexant les pages du web (Google, Bing, Qwant Junior).

### 2. Les Règles d'or de la Cybersécurité pour Jeunes
1. Ne jamais communiquer ses mots de passe, son adresse ou son numéro de téléphone en ligne.
2. Vérifier la présence du cadenas de sécurité (**HTTPS**) sur les sites consultés.
3. Toujours citer la source d'un texte ou d'une image pour respecter les droits d'auteur.
              `,
              tpPratique: {
                titre: 'TP Pratique 3 : Recherche documentaire sur les parcs nationaux du Cameroun',
                enonce: 'Effectuer une recherche sur le Parc National de Waza et enregistrer 2 photos légendées dans un document Word.',
                guide: 'Utiliser des mots-clés précis : "Parc National de Waza faune flore Cameroun officiel".'
              },
              exercices: [
                {
                  question: 'Quelle est la différence fondamentale entre un navigateur web et un moteur de recherche ?',
                  correction: 'Le navigateur est un logiciel installé sur l\'ordinateur qui sert à afficher les pages web (ex: Firefox), alors que le moteur de recherche est un site web spécialisé qui aide à trouver des informations (ex: Google).'
                }
              ]
            },
            {
              id: 'info-6-m4',
              sequence: 'Séquence 4',
              titre: 'Initiation à l\'Algorithmique & Programmation Visuelle avec Scratch',
              duree: '10h de cours + 8h TP',
              objectifs: 'Comprendre la notion d\'algorithme, de séquence ordonnée d\'instructions et animer des lutins avec Scratch.',
              coursComplet: `
### 1. Qu'est-ce qu'un algorithme ?
Un algorithme est une suite ordonnée, précise et non ambiguë d'instructions permettant de résoudre un problème donné ou d'accomplir une tâche.

### 2. Découverte de l'environnement Scratch
- **La Scène (Stage) :** Zone où s'affichent et évoluent les lutins (Sprites) sur un repère orthogonal (X de -240 à +240, Y de -180 à +180).
- **La Palette de Blocs :**
  - *Mouvement (bleu) :* avancer de 10 pas, tourner à droite de 90 degrés.
  - *Apparence (violet) :* dire « Bonjour ! » pendant 2 secondes, changer de costume.
  - *Événements (jaune) :* quand le drapeau vert est cliqué, quand la touche espace est pressée.
  - *Contrôle (orange) :* répéter 10 fois, attendre 1 seconde, si... alors.
              `,
              tpPratique: {
                titre: 'TP Pratique 4 : Tracé d\'un carré géométrique avec Scratch',
                enonce: 'Écrire un programme Scratch avec le bloc Stylo pour que le lutin dessine un carré de 100 pas de côté.',
                codeDemo: `// Algorithme Scratch équivalent
Quand drapeau vert cliqué :
  Effacer tout
  Stylo en position d'écriture
  Répéter 4 fois :
    Avancer de 100 pas
    Tourner à droite de 90 degrés`,
                guide: 'Ne pas oublier de relever le stylo à la fin du tracé.'
              },
              exercices: [
                {
                  question: 'Pourquoi utilise-t-on un angle de 90° pour faire tourner le lutin lors du tracé d\'un carré ?',
                  correction: 'Car la somme des angles d\'un polygone régulier est de 360°, et pour un carré à 4 côtés égaux : 360° / 4 = 90°.'
                }
              ]
            }
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Programme officiel MINESEC : Arithmétique des entiers et décimaux, fractions, géométrie plane (droites remarquables, angles, cercles) et proportionnalité.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'math-6-m1',
              sequence: 'Séquence 1',
              titre: 'Arithmétique des Nombres Entiers et Décimaux',
              duree: '12h de cours + 6h Exercices',
              objectifs: 'Maîtriser la numération décimale de position, les opérations fondamentales (+, -, ×, ÷) et les règles de priorité opératoire.',
              coursComplet: `
### 1. Numération Décimale de Position
Un nombre décimal possède une partie entière et une partie décimale séparées par une virgule.
- Dans le nombre **4 582,376** :
  - 4 est le chiffre des milliers, 5 des centaines, 8 des dizaines, 2 des unités.
  - 3 est le chiffre des dixièmes (1/10), 7 des centièmes (1/100), 6 des millièmes (1/1000).

### 2. Priorités Opératoires
Dans une suite d'opérations sans parenthèses :
1. On effectue en priorité les **multiplications et divisions**.
2. Puis on effectue les **additions et soustractions** de gauche à droite.
3. En présence de parenthèses, on calcule **d'abord ce qui est à l'intérieur des parenthèses**.

*Exemple :*
A = 15 + 4 × 3 = 15 + 12 = **27** (et non (15+4)×3=57).
B = (15 + 4) × 3 = 19 × 3 = **57**.
              `,
              calculateur: {
                type: 'priorite',
                titre: 'Calculateur interactif d\'arithmétique'
              },
              exercices: [
                {
                  question: 'Calculer l\'expression suivante en détaillant les étapes : C = 50 - 5 × (6 + 2).',
                  correction: 'Étape 1 (parenthèses) : 6 + 2 = 8.\nÉtape 2 (multiplication) : 5 × 8 = 40.\nÉtape 3 (soustraction) : 50 - 40 = 10.\nConclusion : C = 10.'
                },
                {
                  question: 'Poser la division euclidienne de 785 par 12. Donner le quotient entier et le reste.',
                  correction: '785 = (12 × 65) + 5 avec reste 5 < 12.\nQuotient = 65, Reste = 5.'
                }
              ]
            },
            {
              id: 'math-6-m2',
              sequence: 'Séquence 2',
              titre: 'Géométrie de Base : Droites Parallèles & Perpendiculaires',
              duree: '10h de cours + 6h TD',
              objectifs: 'Tracer et reconnaître des droites sécantes, perpendiculaires et parallèles à la règle et à l\'équerre. Utiliser les propriétés de déduction.',
              coursComplet: `
### 1. Définitions Fondamentales
- Deux droites sont **sécantes** si elles ont un unique point commun.
- Deux droites sont **perpendiculaires** si elles se coupent en formant un angle droit (90°). On note : $(D_1) \perp (D_2)$.
- Deux droites sont **parallèles** si elles ne se coupent jamais ou si elles sont confondues. On note : $(D_1) \parallel (D_2)$.

### 2. Propriétés Fondamentales de Déduction (À retenir par cœur)
- **Propriété 1 :** Si deux droites sont perpendiculaires à une même troisième droite, alors elles sont **parallèles entre elles**.
- **Propriété 2 :** Si deux droites sont parallèles, toute droite perpendiculaire à l'une est **perpendiculaire à l'autre**.
              `,
              exercices: [
                {
                  question: 'Soient trois droites (D1), (D2) et (D3) telles que (D1) ⊥ (D3) et (D2) ⊥ (D3). Que peut-on affirmer sur (D1) et (D2) ? Justifier avec une propriété du cours.',
                  correction: 'Puisque (D1) et (D2) sont toutes deux perpendiculaires à la même droite (D3), alors d\'après la Propriété 1 du cours, (D1) et (D2) sont parallèles entre elles : (D1) // (D2).'
                }
              ]
            }
          ]
        }
      ]
    }
  },

  '5eme': {
    classeTitle: 'Classe de 5ème',
    niveauBadge: 'Niveau 2 - 1er Cycle',
    cycle: 'Cycle d\'Orientation',
    matiereInformatique: {
      description: 'Programme officiel MINESEC : Tableur Microsoft Excel, réseaux locaux (LAN), sécurité et structures algorithmiques de base.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'info-5-m1',
              sequence: 'Séquence 1',
              titre: 'Gestion & Analyse de Données avec un Tableur (Excel / Calc)',
              duree: '12h de cours + 8h TP',
              objectifs: 'Maîtriser les cellules, lignes, colonnes, saisir des formules (=SOMME, =MOYENNE, =MIN, =MAX) et générer des graphiques statistiques.',
              coursComplet: `
### 1. Structure d'un Tableur
Un tableur est un logiciel conçu pour manipuler automatiquement des données numériques organisées sous forme de tableau (classeur composé de feuilles de calcul).
- **Cellule :** Intersection d'une colonne (lettres A, B, C...) et d'une ligne (chiffres 1, 2, 3...). Exemple : **B4**.
- **Plage de cellules :** Ensemble continu de cellules noté avec deux-points. Exemple : **A1:A10**.

### 2. Les Formules & Fonctions Essentielles
Toute formule commence obligatoirement par le signe **égal (=)**.
- Somme automatique : \`=SOMME(C2:C15)\`
- Moyenne des notes : \`=MOYENNE(D2:D20)\`
- Valeur maximale : \`=MAX(B2:B30)\`
- Valeur minimale : \`=MIN(B2:B30)\`
- Condition logique : \`=SI(E2>=10; "Admis"; "Ajourné")\`
              `,
              tpPratique: {
                titre: 'TP Pratique 1 : Bulletin de notes automatisé d\'une classe',
                enonce: 'Créer un tableau avec 5 élèves et 4 matières. Calculer la moyenne pondérée de chaque élève et tracer un histogramme comparatif.',
                guide: 'Appliquer des coefficients différents pour les Mathématiques (coef 4) et l\'Informatique (coef 2).'
              },
              exercices: [
                {
                  question: 'Quelle formule permet de calculer la moyenne des cellules B2, B3, B4 et B5 ?',
                  correction: 'La formule est : =MOYENNE(B2:B5) ou =(B2+B3+B4+B5)/4.'
                }
              ]
            },
            {
              id: 'info-5-m2',
              sequence: 'Séquence 2',
              titre: 'Architecture & Topologies des Réseaux Informatiques',
              duree: '8h de cours + 4h TP',
              objectifs: 'Distinguer les types de réseaux (LAN, MAN, WAN), identifier les équipements (Switch, Routeur, Câble RJ45) et comprendre les topologies physique et logique.',
              coursComplet: `
### 1. Classification Géographique des Réseaux
- **PAN (Personal Area Network) :** Réseau personnel (Bluetooth, portée < 10m).
- **LAN (Local Area Network) :** Réseau local au sein d'une salle informatique ou d'un lycée (portée < 1km).
- **MAN (Metropolitan Area Network) :** Réseau à l'échelle d'une ville (ex: campus universitaire à Yaoundé).
- **WAN (Wide Area Network) :** Réseau étendu mondial (ex: Internet).

### 2. Équipements d'Interconnexion
- **Switch (Commutateur) :** Relie plusieurs ordinateurs au sein d'un même réseau local et distribue les paquets aux seuls destinataires.
- **Routeur :** Relie deux réseaux différents entre eux (ex: le réseau du lycée et le réseau Internet).
- **Câble à paires torsadées (RJ45) / Fibre optique :** Médias de transmission filaires.
              `,
              exercices: [
                {
                  question: 'Quel équipement réseau est indispensable pour connecter le réseau local de votre établissement scolaire à Internet ?',
                  correction: 'C\'est le Routeur (Router / Modem-Routeur).'
                }
              ]
            }
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Programme officiel MINESEC : Nombres relatifs, opérations sur les fractions, symétrie centrale, angles et parallélogrammes.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'math-5-m1',
              sequence: 'Séquence 1',
              titre: 'Nombres Relatifs : Comparaison, Addition & Soustraction',
              duree: '12h de cours + 6h Exercices',
              objectifs: 'Repérer un point sur une droite graduée, additionner et soustraire deux nombres relatifs de même signe ou de signes contraires.',
              coursComplet: `
### 1. Qu'est-ce qu'un Nombre Relatif ?
Un nombre relatif est constitué d'un signe (+ ou -) et d'une distance à zéro (valeur absolue).
- Nombres positifs : +5, +12,4 (supérieurs à 0).
- Nombres négatifs : -3, -8,5 (inférieurs à 0).

### 2. Règle des Signes pour l'Addition
- **Deux nombres de même signe :** On garde le signe commun et on additionne leurs distances à zéro.
  *(+3) + (+5) = +8* | *(-4) + (-6) = -10*
- **Deux nombres de signes contraires :** On prend le signe de celui qui a la plus grande distance à zéro et on fait la différence des distances.
  *(+8) + (-3) = +5* | *(-9) + (+4) = -5*

### 3. Soustraction de Deux Relatifs
*Règle d'or :* Soustraire un nombre relatif revient à **ajouter son opposé** : $a - b = a + (-b)$.
- *(+5) - (+8) = (+5) + (-8) = -3*
- *(-7) - (-10) = (-7) + (+10) = +3*
              `,
              exercices: [
                {
                  question: 'Calculer : A = (-15) + (+23) et B = (-8) - (-14).',
                  correction: 'A = +8\nB = (-8) + (+14) = +6.'
                }
              ]
            }
          ]
        }
      ]
    }
  },

  '4eme': {
    classeTitle: 'Classe de 4ème',
    niveauBadge: 'Niveau 3 - 1er Cycle',
    cycle: 'Cycle de Consolidation',
    matiereInformatique: {
      description: 'Programme officiel MINESEC : Algorithmique structurée, variables, structures conditionnelles et itératives, bases de données et SQL.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'info-4-m1',
              sequence: 'Séquence 1',
              titre: 'Algorithmique : Variables, Types, Affectation & Entrées/Sorties',
              duree: '12h de cours + 6h TD',
              objectifs: 'Déclarer des variables (Entier, Réel, Chaîne, Booléen), utiliser les instructions LIRE et ECRIRE, et structurer un algorithme.',
              coursComplet: `
### 1. Structure Générale d'un Algorithme
\`\`\`text
Algorithme Nom_De_L_Algorithme
Variables
   identificateur : Type;
Constantes
   PI = 3.14;
Début
   // Corps de l'algorithme
   Ecrire("Message à afficher");
   Lire(variable);
   variable <- valeur; // Affectation
Fin
\`\`\`

### 2. Les Types de Données Standards
- **Entier :** Nombres entiers sans virgule (ex: -5, 0, 42).
- **Reel :** Nombres à virgule (ex: 3.14, -0.75).
- **Chaine :** Texte entre guillemets (ex: "Bonjour Yaoundé").
- **Booleen :** VRAI ou FAUX.
              `,
              tpPratique: {
                titre: 'TP Pratique : Algorithme de calcul du périmètre et de l\'aire d\'un rectangle',
                enonce: 'Écrire l\'algorithme demandant la longueur et la largeur à l\'utilisateur, puis affichant le périmètre et l\'aire.',
                codeDemo: `Algorithme Rectangle_Calculs
Variables
   L, l, P, A : Reel;
Début
   Ecrire("Entrez la longueur : ");
   Lire(L);
   Ecrire("Entrez la largeur : ");
   Lire(l);
   P <- 2 * (L + l);
   A <- L * l;
   Ecrire("Le périmètre est : ", P);
   Ecrire("L'aire est : ", A);
Fin`
              },
              exercices: [
                {
                  question: 'Soit l\'instruction : x <- 10; y <- 20; x <- y; y <- x; Quelles sont les valeurs finales de x et y ?',
                  correction: 'x vaut 20 et y vaut 20. Pour échanger les variables sans écraser la valeur, il faut obligatoirement une variable temporaire : temp <- x; x <- y; y <- temp.'
                }
              ]
            }
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Programme officiel MINESEC : Théorème de Pythagore, théorème de Thalès, calcul littéral et équations du premier degré.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'math-4-m1',
              sequence: 'Séquence 1',
              titre: 'Le Théorème de Pythagore & sa Réciproque',
              duree: '12h de cours + 8h TD',
              objectifs: 'Calculer la longueur de l\'hypoténuse ou d\'un côté de l\'angle droit dans un triangle rectangle. Démontrer qu\'un triangle est rectangle avec la réciproque.',
              coursComplet: `
### 1. Énoncé du Théorème Direct de Pythagore
Dans un triangle rectangle, le carré de la longueur de l'hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.
Si le triangle $ABC$ est rectangle en $A$, alors :
$$BC^2 = AB^2 + AC^2$$

### 2. Réciproque du Théorème de Pythagore
Si dans un triangle $ABC$, le plus grand côté vérifie $BC^2 = AB^2 + AC^2$, alors le triangle $ABC$ est **rectangle en A**.
              `,
              exercices: [
                {
                  question: 'Soit un triangle ABC rectangle en A tel que AB = 6 cm et AC = 8 cm. Calculer la longueur de l\'hypoténuse BC.',
                  correction: 'D\'après le théorème de Pythagore :\nBC² = AB² + AC² = 6² + 8² = 36 + 64 = 100.\nBC = √100 = 10 cm.'
                }
              ]
            }
          ]
        }
      ]
    }
  },

  '3eme': {
    classeTitle: 'Classe de 3ème (Préparation BEPC)',
    niveauBadge: 'Examen Officiel - BEPC',
    cycle: '1er Cycle (Examen d\'État)',
    matiereInformatique: {
      description: 'Programme officiel MINESEC pour le BEPC : Tableaux 1D/2D, programmation Web (HTML/CSS/JS), bases de données relationnelles et maintenance PC.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'info-3-m1',
              sequence: 'Séquence 1',
              titre: 'Structures de Données : Tableaux à une Dimension (Vecteurs)',
              duree: '12h de cours + 8h TD/TP',
              objectifs: 'Déclarer un tableau, le remplir avec une boucle Pour, calculer la moyenne, rechercher le maximum et trier des valeurs.',
              coursComplet: `
### 1. Qu'est-ce qu'un Tableau (Array) ?
Un tableau est une variable indicée capable de stocker sous un même nom plusieurs valeurs de **même type**.
- Déclaration : \`T : Tableau[1..N] de Reel;\`
- Accès à l'élément à l'indice i : \`T[i]\`

### 2. Parcours et Somme d'un Tableau
\`\`\`text
Algorithme SommeTableau
Variables
   T : Tableau[1..10] d'Entiers;
   i, Somme : Entier;
Début
   Somme <- 0;
   Pour i de 1 à 10 Faire
      Ecrire("Entrez la note ", i, " : ");
      Lire(T[i]);
      Somme <- Somme + T[i];
   FinPour
   Ecrire("Moyenne = ", Somme / 10);
Fin
\`\`\`
              `,
              exercices: [
                {
                  question: 'Écrire l\'algorithme qui recherche la note maximale dans un tableau T de 20 notes réelles.',
                  correction: 'Algorithme NoteMax\nVariables T : Tableau[1..20] de Reel; i : Entier; Max : Reel;\nDébut\n  Max <- T[1];\n  Pour i de 2 à 20 Faire\n    Si T[i] > Max Alors\n      Max <- T[i];\n    FinSi\n  FinPour\n  Ecrire("Note maximale = ", Max);\nFin'
                }
              ]
            }
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Programme officiel MINESEC pour le BEPC : Racines carrées, calcul littéral (identités remarquables), trigonométrie, équations/inéquations et statistiques.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'math-3-m1',
              sequence: 'Séquence 1',
              titre: 'Calcul Littéral & Identités Remarquables au BEPC',
              duree: '14h de cours + 8h Exercices',
              objectifs: 'Développer, factoriser et réduire des expressions algébriques à l\'aide des 3 identités remarquables.',
              coursComplet: `
### 1. Les 3 Identités Remarquables Fondamentales
1. **Carré d'une somme :** $(a + b)^2 = a^2 + 2ab + b^2$
2. **Carré d'une différence :** $(a - b)^2 = a^2 - 2ab + b^2$
3. **Produit d'une somme par leur différence :** $(a + b)(a - b) = a^2 - b^2$

### 2. Factorisation d'Expressions
Factoriser, c'est transformer une somme ou différence en un produit de facteurs.
- Exemple 1 : $4x^2 - 9 = (2x)^2 - 3^2 = (2x - 3)(2x + 3)$.
- Exemple 2 : $x^2 + 6x + 9 = (x + 3)^2$.
              `,
              exercices: [
                {
                  question: 'Développer et réduire E = (3x - 5)² - (2x + 1)(2x - 1).',
                  correction: 'E = (9x² - 30x + 25) - (4x² - 1) = 9x² - 30x + 25 - 4x² + 1 = 5x² - 30x + 26.'
                }
              ]
            }
          ]
        }
      ]
    }
  },

  '2nde': {
    classeTitle: 'Classe de Seconde (2nde A / C / TI)',
    niveauBadge: '2nd Cycle - Détermination',
    cycle: '2nd Cycle de l\'Enseignement Secondaire',
    matiereInformatique: {
      description: 'Programme officiel MINESEC : Numération binaire/hexadécimale, codage de l\'information, initiation au langage Python et maintenance logicielle.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'info-2-m1',
              sequence: 'Séquence 1',
              titre: 'Systèmes de Numération : Binaire, Décimal & Hexadécimal',
              duree: '12h de cours + 6h TD',
              objectifs: 'Convertir un nombre d\'une base à une autre (Base 10, Base 2, Base 16) et effectuer des additions binaires.',
              coursComplet: `
### 1. Pourquoi le binaire en informatique ?
Le microprocesseur est composé de transistors fonctionnant comme des interrupteurs (0 = courant ne passe pas, 1 = courant passe). Chaque chiffre binaire (0 ou 1) est un **Bit** (Binary Digit).
Un groupe de 8 bits forme un **Octet** (Byte).

### 2. Conversions de Bases
- **Binaire vers Décimal :** $(1101)_2 = 1 \times 2^3 + 1 \times 2^2 + 0 \times 2^1 + 1 \times 2^0 = 8 + 4 + 0 + 1 = (13)_{10}$.
- **Décimal vers Binaire :** On effectue des divisions successives par 2 et on relève les restes du dernier au premier.
- **Hexadécimal (Base 16) :** Utilise les chiffres de 0 à 9 et les lettres A (10), B (11), C (12), D (13), E (14), F (15).
              `,
              exercices: [
                {
                  question: 'Convertir le nombre décimal 45 en base 2.',
                  correction: '45 ÷ 2 = 22 reste 1\n22 ÷ 2 = 11 reste 0\n11 ÷ 2 = 5 reste 1\n5 ÷ 2 = 2 reste 1\n2 ÷ 2 = 1 reste 0\n1 ÷ 2 = 0 reste 1\nRésultat : (45)₁₀ = (101101)₂.'
                }
              ]
            }
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Programme officiel MINESEC : Ensembles de nombres, calcul dans R, équations et inéquations du 2nd degré, vecteurs du plan et fonctions numériques.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'math-2-m1',
              sequence: 'Séquence 1',
              titre: 'Polynômes du Second Degré : Forme Canonique & Discriminant',
              duree: '14h de cours + 8h TD',
              objectifs: 'Résoudre toute équation $ax^2+bx+c=0$ dans R à l\'aide du discriminant Delta.',
              coursComplet: `
### 1. Formule du Discriminant $\\Delta$
Pour toute équation $ax^2 + bx + c = 0$ avec $a \neq 0$ :
$$\\Delta = b^2 - 4ac$$

### 2. Discussion du Nombre de Solutions Réelles
- **Si $\\Delta > 0$ :** Deux solutions réelles distinctes :
  $$x_1 = \\frac{-b - \\sqrt{\\Delta}}{2a}, \\quad x_2 = \\frac{-b + \\sqrt{\\Delta}}{2a}$$
- **Si $\\Delta = 0$ :** Une solution double :
  $$x_0 = \\frac{-b}{2a}$$
- **Si $\\Delta < 0$ :** Aucune solution dans $\\mathbb{R}$ ($S = \\emptyset$).
              `,
              exercices: [
                {
                  question: 'Résoudre dans R l\'équation : 2x² - 5x + 2 = 0.',
                  correction: 'a = 2, b = -5, c = 2.\nΔ = (-5)² - 4(2)(2) = 25 - 16 = 9 = 3² > 0.\nx₁ = (5 - 3)/(2×2) = 2/4 = 1/2.\nx₂ = (5 + 3)/4 = 8/4 = 2.\nS = {1/2, 2}.'
                }
              ]
            }
          ]
        }
      ]
    }
  },

  '1ere': {
    classeTitle: 'Classe de Première (1ère C / D / TI - Probatoire)',
    niveauBadge: 'Examen Officiel - Probatoire',
    cycle: '2nd Cycle (Préparation Probatoire)',
    matiereInformatique: {
      description: 'Programme officiel MINESEC : Programmation structurée en C et Python, bases de données relationnelles SQL et réseaux locaux d\'entreprise.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'info-1-m1',
              sequence: 'Séquence 1',
              titre: 'Programmation en Langage C & Python : Fonctions & Procédures',
              duree: '16h de cours + 10h TP',
              objectifs: 'Modulariser un programme à l\'aide de fonctions avec passage de paramètres par valeur et par adresse.',
              coursComplet: `
### 1. Les Fonctions en Langage C
Une fonction permet de découper un problème complexe en sous-programmes réutilisables.
\`\`\`c
#include <stdio.h>

// Déclaration de la fonction factorielle
long factorielle(int n) {
    if (n <= 1) return 1;
    return n * factorielle(n - 1);
}

int main() {
    int nombre = 5;
    printf("La factorielle de %d est : %ld\\n", nombre, factorielle(nombre));
    return 0;
}
\`\`\`
              `,
              exercices: [
                {
                  question: 'Écrire en langage C une fonction booléenne estPremier(int n) qui renvoie 1 si n est premier, 0 sinon.',
                  correction: 'int estPremier(int n) {\n  if (n <= 1) return 0;\n  for (int i = 2; i * i <= n; i++) {\n    if (n % i == 0) return 0;\n  }\n  return 1;\n}'
                }
              ]
            }
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Programme officiel MINESEC pour le Probatoire : Dérivation, études de fonctions, barycentres, suites numériques et trigonométrie.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'math-1-m1',
              sequence: 'Séquence 1',
              titre: 'Dérivation & Étude des Fonctions Numériques',
              duree: '16h de cours + 10h TD',
              objectifs: 'Calculer la fonction dérivée f\'(x), déterminer le signe de f\'(x), dresser le tableau de variations et tracer la courbe représentative.',
              coursComplet: `
### 1. Formules Usuelles de Dérivation
- $(x^n)' = n x^{n-1}$
- $(u + v)' = u' + v'$
- $(u \\times v)' = u'v + uv'$
- $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$

### 2. Théorème du Sens de Variation
- Si $f'(x) > 0$ sur un intervalle $I$, alors $f$ est **strictement croissante** sur $I$.
- Si $f'(x) < 0$ sur un intervalle $I$, alors $f$ est **strictement décroissante** sur $I$.
- Si $f'(x) = 0$ et change de signe, la fonction admet un **extremum local**.
              `,
              exercices: [
                {
                  question: 'Soit f(x) = x³ - 3x + 2. Déterminer f\'(x) et dresser le tableau de variations de f sur R.',
                  correction: 'f\'(x) = 3x² - 3 = 3(x² - 1) = 3(x - 1)(x + 1).\nf\'(x) s\'annule en -1 et 1.\n• Sur ]-∞; -1], f\'(x) > 0 => f croissante.\n• Sur [-1; 1], f\'(x) < 0 => f décroissante.\n• Sur [1; +∞[, f\'(x) > 0 => f croissante.'
                }
              ]
            }
          ]
        }
      ]
    }
  },

  'tle': {
    classeTitle: 'Classe de Terminale (Tle C / D / TI - Baccalauréat)',
    niveauBadge: 'Examen Officiel - Baccalauréat',
    cycle: '2nd Cycle (Baccalauréat National)',
    matiereInformatique: {
      description: 'Programme officiel MINESEC pour le Baccalauréat : Programmation Orientée Objet (POO), Arbres Binaires de Recherche (ABR), Graphes et Réseaux sécurisés.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'info-t-m1',
              sequence: 'Séquence 1',
              titre: 'Programmation Orientée Objet (POO en Python / Java) & ABR',
              duree: '18h de cours + 12h TP',
              objectifs: 'Maîtriser les classes, objets, constructeurs, encapsulation, héritage et implémenter des arbres binaires de recherche.',
              coursComplet: `
### 1. Les Piliers de la POO
- **Classe :** Modèle définissant les attributs (données) et les méthodes (comportements).
- **Objet :** Instance concrète d'une classe.
- **Encapsulation :** Protection des données internes via des modificateurs d'accès.

\`\`\`python
class CompteBancaire:
    def __init__(self, titulaire, solde_initial=0):
        self.__titulaire = titulaire
        self.__solde = solde_initial

    def deposer(self, montant):
        if montant > 0:
            self.__solde += montant
            print(f"Dépôt de {montant} FCFA réussi. Nouveau solde : {self.__solde} FCFA")

    def get_solde(self):
        return self.__solde
\`\`\`
              `,
              exercices: [
                {
                  question: 'Définir la différence entre un parcours préfixe, infixe et postfixe d\'un arbre binaire.',
                  correction: '• Préfixe : Racine, Sous-arbre gauche, Sous-arbre droit (R-G-D).\n• Infixe : Sous-arbre gauche, Racine, Sous-arbre droit (G-R-D) -> donne les éléments triés dans un ABR.\n• Postfixe : Sous-arbre gauche, Sous-arbre droit, Racine (G-D-R).'
                }
              ]
            }
          ]
        }
      ]
    },
    matiereMathematiques: {
      description: 'Programme officiel MINESEC pour le Baccalauréat : Nombres complexes, calcul intégral, équations différentielles et lois de probabilités.',
      trimestres: [
        {
          nom: 'Trimestre 1 (Séquences 1 & 2)',
          modules: [
            {
              id: 'math-t-m1',
              sequence: 'Séquence 1',
              titre: 'Nombres Complexes : Forme Algébrique, Trigonométrique & Exponentielle',
              duree: '20h de cours + 12h TD',
              objectifs: 'Calculer le module et l\'argument d\'un nombre complexe, utiliser la formule de Moivre et d\'Euler, résoudre des équations dans C et géométrie complexe.',
              coursComplet: `
### 1. Forme Algébrique & Conjugué
Tout nombre complexe $z$ s'écrit de manière unique :
$$z = a + ib \\quad (a, b \\in \\mathbb{R}, i^2 = -1)$$
- Module : $|z| = \\sqrt{a^2 + b^2}$
- Conjugué : $\\bar{z} = a - ib$ avec $z \\cdot \\bar{z} = |z|^2 = a^2 + b^2$.

### 2. Forme Trigonométrique et Exponentielle
$$z = r(\\cos \\theta + i \\sin \\theta) = r e^{i\\theta}$$
où $r = |z|$ et $\\theta = \\arg(z) \\pmod{2\\pi}$.
              `,
              exercices: [
                {
                  question: 'Déterminer le module et un argument principal de z = 1 + i√3. Donner sa forme exponentielle.',
                  correction: '|z| = √(1² + (√3)²) = √(1 + 3) = √4 = 2.\ncos θ = 1/2 et sin θ = √3/2 => θ = π/3 [2π].\nForme exponentielle : z = 2 e^(iπ/3).'
                }
              ]
            }
          ]
        }
      ]
    }
  }
};
