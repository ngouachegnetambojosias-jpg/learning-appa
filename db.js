import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'brpmyzvctg3z2haivjvk-mysql.services.clever-cloud.com',
  user: process.env.DB_USER || 'u7p6luzk2gh0aoiy',
  password: process.env.DB_PASSWORD || 'O7b3Zy5ErVY37YYuoriy',
  database: process.env.DB_NAME || 'brpmyzvctg3z2haivjvk',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 10000
};

let pool = null;
let isConnected = false;

// In-memory memory mirror / cache fallback for instant rendering and resilient offline fallback
export const memoryDb = {
  users: [
    {
      id: 1,
      nom: "Josias Ngouachegne",
      email: "eleve@upskill.com",
      password: bcrypt.hashSync("eleve123", 10),
      photo: "/images/etudiants.jpg",
      classe: "3eme",
      created_at: new Date('2025-01-10T08:00:00Z')
    },
    {
      id: 2,
      nom: "Marie Claire Tagne",
      email: "marie.tagne@gmail.com",
      password: bcrypt.hashSync("pass123", 10),
      photo: null,
      classe: "4eme",
      created_at: new Date('2025-02-14T10:30:00Z')
    },
    {
      id: 3,
      nom: "Jean-Paul Kamga",
      email: "jp.kamga@yahoo.fr",
      password: bcrypt.hashSync("pass123", 10),
      photo: null,
      classe: "superieur",
      created_at: new Date('2025-03-01T14:15:00Z')
    }
  ],
  admins: [
    {
      id: 1,
      email: "admin@upskill.com",
      password: bcrypt.hashSync("admin123", 10),
      nom: "Directeur Pédagogique"
    }
  ],
  abonnements: [
    {
      id: 1,
      user_id: 1,
      plan: "Annuel",
      transaction_id: "UPSKILL_INIT_001",
      telephone: "677889900",
      operateur: "Orange Money",
      montant: 25000,
      statut_paiement: "succes",
      created_at: new Date('2025-01-10T08:30:00Z')
    }
  ],
  epreuves: [
    {
      id: 1,
      titre: "BEPC 2024 - Épreuve d'Informatique Théorique & Pratique (MINESEC Corrigé Officiel)",
      niveau: "Classe de 3ème (BEPC)",
      matiere: "Informatique",
      fichier: "743550194-Correction-Bac-Maths.pdf",
      telechargements: 242
    },
    {
      id: 2,
      titre: "BEPC 2024 - Épreuve de Mathématiques (Algèbre & Géométrie Thalès/Pythagore)",
      niveau: "Classe de 3ème (BEPC)",
      matiere: "Mathématiques",
      fichier: "743550194-Correction-Bac-Maths.pdf",
      telechargements: 310
    },
    {
      id: 3,
      titre: "Probatoire 2024 Série C/D/TI - Informatique (Programmation C, SQL & Réseaux)",
      niveau: "Classe de 1ère (Probatoire)",
      matiere: "Informatique",
      fichier: "Maths-TleDTI-Eval4-College-Retraite-Mars-2021.pdf",
      telechargements: 189
    },
    {
      id: 4,
      titre: "Probatoire 2024 Série C/D - Mathématiques (Dérivées, Limites & Barycentres)",
      niveau: "Classe de 1ère (Probatoire)",
      matiere: "Mathématiques",
      fichier: "Maths-TleDTI-Eval4-College-Retraite-Mars-2021.pdf",
      telechargements: 275
    },
    {
      id: 5,
      titre: "Baccalauréat 2024 Série C/D/TI - Informatique (POO Python, ABR & Réseaux d'Entreprise)",
      niveau: "Classe de Terminale (Baccalauréat)",
      matiere: "Informatique",
      fichier: "Maths-TleDTI-Eval4-College-Retraite-Mars-2021.pdf",
      telechargements: 412
    },
    {
      id: 6,
      titre: "Baccalauréat Scientifique C/D - Mathématiques Générales (Complexes, Intégrales, Probas)",
      niveau: "Classe de Terminale (Baccalauréat)",
      matiere: "Mathématiques",
      fichier: "743550194-Correction-Bac-Maths.pdf",
      telechargements: 530
    },
    {
      id: 7,
      titre: "Composition Régionale 4ème - Informatique & Algorithmique (Boucles et SGBD)",
      niveau: "Classe de 4ème",
      matiere: "Informatique",
      fichier: "743550194-Correction-Bac-Maths.pdf",
      telechargements: 164
    },
    {
      id: 8,
      titre: "Évaluation Séquentielle 4ème - Mathématiques (Théorème de Pythagore & Calcul Littéral)",
      niveau: "Classe de 4ème",
      matiere: "Mathématiques",
      fichier: "743550194-Correction-Bac-Maths.pdf",
      telechargements: 178
    },
    {
      id: 9,
      titre: "Évaluation Harmonisée 5ème - Informatique (Tableur Excel & Architecture Réseau)",
      niveau: "Classe de 5ème",
      matiere: "Informatique",
      fichier: "743550194-Correction-Bac-Maths.pdf",
      telechargements: 125
    },
    {
      id: 10,
      titre: "Contrôle Continu 5ème - Mathématiques (Nombres Relatifs, Fractions & Symétrie)",
      niveau: "Classe de 5ème",
      matiere: "Mathématiques",
      fichier: "743550194-Correction-Bac-Maths.pdf",
      telechargements: 140
    },
    {
      id: 11,
      titre: "Évaluation Séquence 2 - Classe de 6ème Informatique (Matériel PC & Bureautique)",
      niveau: "Classe de 6ème",
      matiere: "Informatique",
      fichier: "743550194-Correction-Bac-Maths.pdf",
      telechargements: 198
    },
    {
      id: 12,
      titre: "Évaluation Trimestrielle 6ème - Mathématiques (Décimaux, Fractions & Géométrie)",
      niveau: "Classe de 6ème",
      matiere: "Mathématiques",
      fichier: "743550194-Correction-Bac-Maths.pdf",
      telechargements: 215
    },
    {
      id: 13,
      titre: "Évaluation Séquence 4 - Classe de 2nde Informatique (Numération Binaire & Python)",
      niveau: "Classe de 2nde",
      matiere: "Informatique",
      fichier: "Maths-TleDTI-Eval4-College-Retraite-Mars-2021.pdf",
      telechargements: 154
    },
    {
      id: 14,
      titre: "Évaluation Séquentielle 2nde C - Mathématiques (Polynômes du 2nd Degré & Vecteurs)",
      niveau: "Classe de 2nde",
      matiere: "Mathématiques",
      fichier: "743550194-Correction-Bac-Maths.pdf",
      telechargements: 220
    }
  ],
  panier: [
    {
      id: 1,
      user_id: 1,
      document: "743550194-Correction-Bac-Maths.pdf",
      created_at: new Date()
    }
  ],
  evaluations: [
    {
      id: 1,
      titre: "Devoir Séquence 3 : Algorithmique & Boucles 'Pour' / 'Tant que'",
      description: "Écrire l'algorithme complet permettant de calculer et d'afficher la somme des N premiers entiers naturels saisis par l'utilisateur. Justifiez le choix de la boucle utilisée et détaillez la trace d'exécution.",
      date_creation: new Date('2025-02-01')
    },
    {
      id: 2,
      titre: "Quiz de Synthèse : Architecture des Réseaux Informatiques (LAN vs WAN)",
      description: "Définissez les notions d'adresse IP, masque de sous-réseau, passerelle par défaut. Expliquez comment un commutateur (Switch) achemine les trames au sein d'un réseau local d'entreprise.",
      date_creation: new Date('2025-02-15')
    },
    {
      id: 3,
      titre: "Travail Pratique : Conception d'une Base de Données Gestion de Bibliothèque",
      description: "Proposez le modèle conceptuel de données (MCD) avec les entités LIVRE, ADHERENT, EMPRUNT ainsi que les cardinalités correspondantes. Rédigez la requête SQL de sélection des livres empruntés.",
      date_creation: new Date('2025-03-01')
    }
  ],
  reponses: [
    {
      id: 1,
      utilisateur_id: 1,
      evaluation_id: 1,
      reponse: "Algorithme Somme_N\nVariables i, N, S : Entier\nDébut\n  Ecrire('Entrer N : ')\n  Lire(N)\n  S <- 0\n  Pour i de 1 à N Faire\n    S <- S + i\n  FinPour\n  Ecrire('La somme est : ', S)\nFin",
      fichier: null,
      note: 18,
      appreciation: "Excellente copie ! L'algorithme est parfaitement structuré, les variables sont bien typées et la boucle 'Pour' est le choix optimal.",
      points_forts: ["Structure algorithmique impeccable", "Choix judicieux de la boucle Pour", "Initialisation correcte de la somme S"],
      axes_amelioration: ["Penser à vérifier que N est strictement positif avant la boucle"],
      correction_detaillee: "La solution proposée est optimale avec une complexité O(N). La trace d'exécution pour N=3 donne S=0+1+2+3=6.",
      statut_correction: "valide_admin",
      date_reponse: new Date('2025-02-03')
    },
    {
      id: 2,
      utilisateur_id: 2,
      evaluation_id: 2,
      reponse: "Une adresse IP est le numéro d'identification d'un appareil sur un réseau. Le commutateur (switch) lit l'adresse MAC pour envoyer les paquets uniquement au bon destinataire.",
      fichier: null,
      note: 15.5,
      appreciation: "Bonne maîtrise des définitions de base des réseaux locaux.",
      points_forts: ["Définition claire de l'adresse IP", "Rôle du commutateur bien compris au niveau de la table MAC"],
      axes_amelioration: ["Préciser la différence entre IPv4 (32 bits) et IPv6", "Expliquer le rôle de la passerelle par défaut"],
      correction_detaillee: "Le commutateur travaille au niveau 2 (Liaison) du modèle OSI grâce aux trames Ethernet et adresses MAC.",
      statut_correction: "corrige_ia",
      date_reponse: new Date('2025-02-16')
    }
  ],
  messages: [
    {
      id: 1,
      expediteur_id: 1,
      destinataire_id: 1,
      isAdminSender: 0,
      contenu: "Bonjour Monsieur, j'ai une question concernant l'exercice sur les boucles imbriquées en classe de 4ème.",
      image: null,
      date_envoi: new Date(Date.now() - 1000 * 60 * 60 * 24),
      lu: 1
    },
    {
      id: 2,
      expediteur_id: 1,
      destinataire_id: 1,
      isAdminSender: 1,
      contenu: "Bonjour Josias ! Pour les boucles imbriquées, la boucle interne s'exécute entièrement pour chaque itération de la boucle externe. N'hésite pas à tracer un tableau d'état des variables.",
      image: null,
      date_envoi: new Date(Date.now() - 1000 * 60 * 60 * 12),
      lu: 1
    }
  ]
};

// Initialize connection and schema
export async function initDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    console.log('✅ Connected successfully to MySQL database on Clever Cloud (par-mysql-c6)');
    isConnected = true;

    // Create Tables
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        photo VARCHAR(255) NULL,
        classe VARCHAR(50) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nom VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS abonnements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plan VARCHAR(100) NOT NULL,
        transaction_id VARCHAR(100) NOT NULL,
        telephone VARCHAR(50) NOT NULL,
        operateur VARCHAR(50) DEFAULT 'Mobile Money',
        montant INT DEFAULT 0,
        statut_paiement VARCHAR(50) DEFAULT 'succes',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS epreuves (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titre VARCHAR(255) NOT NULL,
        niveau VARCHAR(100) NOT NULL,
        matiere VARCHAR(100) NOT NULL,
        fichier VARCHAR(255) NOT NULL,
        telechargements INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS panier (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        document VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titre VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS reponses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        utilisateur_id INT NOT NULL,
        evaluation_id INT NOT NULL,
        reponse TEXT NOT NULL,
        fichier VARCHAR(255) NULL,
        note INT NULL,
        date_reponse DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        expediteur_id INT NOT NULL,
        destinataire_id INT NOT NULL,
        isAdminSender TINYINT(1) DEFAULT 0,
        contenu TEXT NOT NULL,
        image VARCHAR(255) NULL,
        date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
        lu TINYINT(1) DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed Admin if not exists
    const [adminRows] = await conn.query('SELECT id FROM admins WHERE email = ?', ['admin@upskill.com']);
    if (adminRows.length === 0) {
      await conn.query(
        'INSERT INTO admins (email, password, nom) VALUES (?, ?, ?)',
        ['admin@upskill.com', bcrypt.hashSync('admin123', 10), 'Directeur Pédagogique']
      );
    }

    // Seed Demo User if not exists
    const [userRows] = await conn.query('SELECT id FROM users WHERE email = ?', ['eleve@upskill.com']);
    if (userRows.length === 0) {
      await conn.query(
        'INSERT INTO users (nom, email, password, photo, classe) VALUES (?, ?, ?, ?, ?)',
        ['Josias Ngouachegne', 'eleve@upskill.com', bcrypt.hashSync('eleve123', 10), '/images/etudiants.jpg', '3eme']
      );
    }

    // Seed Epreuves if empty
    const [epreuveRows] = await conn.query('SELECT COUNT(*) as count FROM epreuves');
    if (epreuveRows[0].count === 0) {
      for (const ep of memoryDb.epreuves) {
        await conn.query(
          'INSERT INTO epreuves (titre, niveau, matiere, fichier, telechargements) VALUES (?, ?, ?, ?, ?)',
          [ep.titre, ep.niveau, ep.matiere, ep.fichier, ep.telechargements]
        );
      }
    }

    // Seed Evaluations if empty
    const [evalRows] = await conn.query('SELECT COUNT(*) as count FROM evaluations');
    if (evalRows[0].count === 0) {
      for (const ev of memoryDb.evaluations) {
        await conn.query(
          'INSERT INTO evaluations (titre, description) VALUES (?, ?)',
          [ev.titre, ev.description]
        );
      }
    }

    // Sync memory from DB
    await syncMemoryFromDatabase(conn);

    conn.release();
    console.log('✅ Database schema and seed verified successfully.');
    return true;
  } catch (err) {
    console.error('⚠️ MySQL Connection Notice:', err.message);
    console.log('ℹ️ Running in memory-safe resilient mode with instant fallback.');
    isConnected = false;
    return false;
  }
}

async function syncMemoryFromDatabase(conn) {
  try {
    const [users] = await conn.query('SELECT * FROM users');
    if (users.length > 0) memoryDb.users = users;

    const [admins] = await conn.query('SELECT * FROM admins');
    if (admins.length > 0) memoryDb.admins = admins;

    const [abonnements] = await conn.query('SELECT * FROM abonnements');
    if (abonnements.length > 0) memoryDb.abonnements = abonnements;

    const [epreuves] = await conn.query('SELECT * FROM epreuves');
    if (epreuves.length > 0) memoryDb.epreuves = epreuves;

    const [panier] = await conn.query('SELECT * FROM panier');
    if (panier.length > 0) memoryDb.panier = panier;

    const [evaluations] = await conn.query('SELECT * FROM evaluations');
    if (evaluations.length > 0) memoryDb.evaluations = evaluations;

    const [reponses] = await conn.query('SELECT * FROM reponses');
    if (reponses.length > 0) memoryDb.reponses = reponses;

    const [messages] = await conn.query('SELECT * FROM messages');
    if (messages.length > 0) memoryDb.messages = messages;
  } catch (err) {
    console.error('Error syncing memory:', err.message);
  }
}

// Data Access Service Object
export const dbService = {
  isDatabaseConnected() {
    return isConnected;
  },

  // USERS
  async getUsers() {
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC');
        memoryDb.users = rows;
        return rows;
      } catch (err) {
        console.error('MySQL getUsers error:', err.message);
      }
    }
    return memoryDb.users;
  },

  async getUserById(id) {
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.error('MySQL getUserById error:', err.message);
      }
    }
    return memoryDb.users.find(u => u.id === Number(id)) || null;
  },

  async getUserByEmail(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.error('MySQL getUserByEmail error:', err.message);
      }
    }
    return memoryDb.users.find(u => (u.email || '').toLowerCase() === cleanEmail) || null;
  },

  async createUser({ nom, email, password, photo = null, classe = '3eme' }) {
    const hash = bcrypt.hashSync(password, 10);
    const cleanEmail = email.trim().toLowerCase();
    let newId = Date.now();

    if (isConnected && pool) {
      try {
        const [result] = await pool.query(
          'INSERT INTO users (nom, email, password, photo, classe) VALUES (?, ?, ?, ?, ?)',
          [nom.trim(), cleanEmail, hash, photo, classe]
        );
        newId = result.insertId;
      } catch (err) {
        console.error('MySQL createUser error:', err.message);
      }
    } else {
      newId = Math.max(0, ...memoryDb.users.map(u => u.id || 0)) + 1;
    }

    const newUser = {
      id: newId,
      nom: nom.trim(),
      email: cleanEmail,
      password: hash,
      photo,
      classe,
      created_at: new Date()
    };
    memoryDb.users.push(newUser);
    return newUser;
  },

  async updateUser(id, { nom, email, photo, password }) {
    const user = memoryDb.users.find(u => u.id === Number(id));
    if (user) {
      if (nom) user.nom = nom.trim();
      if (email) user.email = email.trim().toLowerCase();
      if (photo) user.photo = photo;
      if (password) user.password = bcrypt.hashSync(password, 10);
    }

    if (isConnected && pool) {
      try {
        if (password && photo) {
          await pool.query('UPDATE users SET nom = ?, email = ?, photo = ?, password = ? WHERE id = ?', [
            nom || user?.nom,
            email ? email.trim().toLowerCase() : user?.email,
            photo,
            bcrypt.hashSync(password, 10),
            id
          ]);
        } else if (photo) {
          await pool.query('UPDATE users SET nom = ?, email = ?, photo = ? WHERE id = ?', [
            nom || user?.nom,
            email ? email.trim().toLowerCase() : user?.email,
            photo,
            id
          ]);
        } else if (password) {
          await pool.query('UPDATE users SET nom = ?, email = ?, password = ? WHERE id = ?', [
            nom || user?.nom,
            email ? email.trim().toLowerCase() : user?.email,
            bcrypt.hashSync(password, 10),
            id
          ]);
        } else {
          await pool.query('UPDATE users SET nom = ?, email = ? WHERE id = ?', [
            nom || user?.nom,
            email ? email.trim().toLowerCase() : user?.email,
            id
          ]);
        }
      } catch (err) {
        console.error('MySQL updateUser error:', err.message);
      }
    }
    return user;
  },

  // ADMINS
  async getAdmins() {
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM admins ORDER BY id DESC');
        memoryDb.admins = rows;
        return rows;
      } catch (err) {
        console.error('MySQL getAdmins error:', err.message);
      }
    }
    return memoryDb.admins;
  },

  async getAdminByEmail(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM admins WHERE LOWER(email) = ?', [cleanEmail]);
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.error('MySQL getAdminByEmail error:', err.message);
      }
    }
    return memoryDb.admins.find(a => (a.email || '').toLowerCase() === cleanEmail) || null;
  },

  async createAdmin({ nom, email, password }) {
    const hash = bcrypt.hashSync(password, 10);
    const cleanEmail = email.trim().toLowerCase();
    let newId = Date.now();

    if (isConnected && pool) {
      try {
        const [result] = await pool.query(
          'INSERT INTO admins (nom, email, password) VALUES (?, ?, ?)',
          [nom.trim(), cleanEmail, hash]
        );
        newId = result.insertId;
      } catch (err) {
        console.error('MySQL createAdmin error:', err.message);
      }
    } else {
      newId = Math.max(0, ...memoryDb.admins.map(a => a.id || 0)) + 1;
    }

    const newAdmin = {
      id: newId,
      nom: nom.trim(),
      email: cleanEmail,
      password: hash
    };
    memoryDb.admins.push(newAdmin);
    return newAdmin;
  },

  // ABONNEMENTS
  async getAbonnements() {
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM abonnements ORDER BY id DESC');
        memoryDb.abonnements = rows;
        return rows;
      } catch (err) {
        console.error('MySQL getAbonnements error:', err.message);
      }
    }
    return memoryDb.abonnements;
  },

  async getActiveAbonnement(userId) {
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query(
          'SELECT * FROM abonnements WHERE user_id = ? AND statut_paiement = "succes" ORDER BY id DESC LIMIT 1',
          [userId]
        );
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.error('MySQL getActiveAbonnement error:', err.message);
      }
    }
    return memoryDb.abonnements.find(a => a.user_id === Number(userId) && a.statut_paiement === 'succes') || null;
  },

  async createAbonnement({ user_id, plan, transaction_id, telephone, operateur = 'Mobile Money', montant = 5000 }) {
    let newId = Date.now();
    if (isConnected && pool) {
      try {
        const [res] = await pool.query(
          'INSERT INTO abonnements (user_id, plan, transaction_id, telephone, operateur, montant, statut_paiement) VALUES (?, ?, ?, ?, ?, ?, "succes")',
          [user_id, plan, transaction_id, telephone, operateur, montant]
        );
        newId = res.insertId;
      } catch (err) {
        console.error('MySQL createAbonnement error:', err.message);
      }
    } else {
      newId = Math.max(0, ...memoryDb.abonnements.map(a => a.id || 0)) + 1;
    }

    const newSub = {
      id: newId,
      user_id: Number(user_id),
      plan,
      transaction_id,
      telephone,
      operateur,
      montant,
      statut_paiement: 'succes',
      created_at: new Date()
    };
    memoryDb.abonnements.push(newSub);
    return newSub;
  },

  // EPREUVES
  async getEpreuves(filter = {}) {
    if (isConnected && pool) {
      try {
        let sql = 'SELECT * FROM epreuves WHERE 1=1';
        const params = [];
        if (filter.niveau && filter.niveau !== 'all') {
          sql += ' AND niveau = ?';
          params.push(filter.niveau);
        }
        if (filter.matiere && filter.matiere !== 'all') {
          sql += ' AND matiere = ?';
          params.push(filter.matiere);
        }
        if (filter.search) {
          sql += ' AND (titre LIKE ? OR matiere LIKE ?)';
          params.push(`%${filter.search}%`, `%${filter.search}%`);
        }
        sql += ' ORDER BY id DESC';
        const [rows] = await pool.query(sql, params);
        return rows;
      } catch (err) {
        console.error('MySQL getEpreuves error:', err.message);
      }
    }

    return memoryDb.epreuves.filter(ep => {
      if (filter.niveau && filter.niveau !== 'all' && ep.niveau !== filter.niveau) return false;
      if (filter.matiere && filter.matiere !== 'all' && ep.matiere !== filter.matiere) return false;
      if (filter.search && !ep.titre.toLowerCase().includes(filter.search.toLowerCase()) && !ep.matiere.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  },

  async createEpreuve({ titre, niveau, matiere, fichier }) {
    let newId = Date.now();
    if (isConnected && pool) {
      try {
        const [res] = await pool.query(
          'INSERT INTO epreuves (titre, niveau, matiere, fichier, telechargements) VALUES (?, ?, ?, ?, 0)',
          [titre, niveau, matiere, fichier]
        );
        newId = res.insertId;
      } catch (err) {
        console.error('MySQL createEpreuve error:', err.message);
      }
    } else {
      newId = Math.max(0, ...memoryDb.epreuves.map(e => e.id || 0)) + 1;
    }

    const newEp = {
      id: newId,
      titre,
      niveau,
      matiere,
      fichier,
      telechargements: 0,
      created_at: new Date()
    };
    memoryDb.epreuves.unshift(newEp);
    return newEp;
  },

  async deleteEpreuve(id) {
    if (isConnected && pool) {
      try {
        await pool.query('DELETE FROM epreuves WHERE id = ?', [id]);
      } catch (err) {
        console.error('MySQL deleteEpreuve error:', err.message);
      }
    }
    const idx = memoryDb.epreuves.findIndex(e => e.id === Number(id));
    if (idx !== -1) memoryDb.epreuves.splice(idx, 1);
    return true;
  },

  async incrementDownloads(filename) {
    if (isConnected && pool) {
      try {
        await pool.query('UPDATE epreuves SET telechargements = telechargements + 1 WHERE fichier = ?', [filename]);
      } catch (err) {
        console.error('MySQL incrementDownloads error:', err.message);
      }
    }
    const item = memoryDb.epreuves.find(e => e.fichier === filename);
    if (item) item.telechargements = (item.telechargements || 0) + 1;
  },

  // PANIER
  async getPanier(userId) {
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM panier WHERE user_id = ? ORDER BY id DESC', [userId]);
        return rows;
      } catch (err) {
        console.error('MySQL getPanier error:', err.message);
      }
    }
    return memoryDb.panier.filter(p => p.user_id === Number(userId));
  },

  async addToPanier(userId, document) {
    const user_id = Number(userId);
    const doc = String(document);
    const existing = memoryDb.panier.find(p => p.user_id === user_id && p.document === doc);
    if (!existing) {
      let newId = Date.now();
      if (isConnected && pool) {
        try {
          const [res] = await pool.query('INSERT INTO panier (user_id, document) VALUES (?, ?)', [user_id, doc]);
          newId = res.insertId;
        } catch (err) {
          console.error('MySQL addToPanier error:', err.message);
        }
      } else {
        newId = Math.max(0, ...memoryDb.panier.map(p => p.id || 0)) + 1;
      }
      const item = { id: newId, user_id, document: doc, created_at: new Date() };
      memoryDb.panier.push(item);
      return item;
    }
    return existing;
  },

  async removeFromPanier(userId, document) {
    const user_id = Number(userId);
    const doc = String(document);
    if (isConnected && pool) {
      try {
        await pool.query('DELETE FROM panier WHERE user_id = ? AND document = ?', [user_id, doc]);
      } catch (err) {
        console.error('MySQL removeFromPanier error:', err.message);
      }
    }
    const idx = memoryDb.panier.findIndex(p => p.user_id === user_id && p.document === doc);
    if (idx !== -1) memoryDb.panier.splice(idx, 1);
    return true;
  },

  // EVALUATIONS & REPONSES
  async getEvaluations() {
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM evaluations ORDER BY id ASC');
        memoryDb.evaluations = rows;
        return rows;
      } catch (err) {
        console.error('MySQL getEvaluations error:', err.message);
      }
    }
    return memoryDb.evaluations;
  },

  async createEvaluation({ titre, description, bareme = "Note sur 20", corrige_type = "" }) {
    let newId = Date.now();
    if (isConnected && pool) {
      try {
        const [res] = await pool.query(
          'INSERT INTO evaluations (titre, description) VALUES (?, ?)',
          [titre, description]
        );
        newId = res.insertId;
      } catch (err) {
        console.error('MySQL createEvaluation error:', err.message);
      }
    } else {
      newId = Math.max(0, ...memoryDb.evaluations.map(e => e.id || 0)) + 1;
    }

    const newEval = {
      id: newId,
      titre,
      description,
      bareme,
      corrige_type,
      date_creation: new Date()
    };
    memoryDb.evaluations.push(newEval);
    return newEval;
  },

  async deleteEvaluation(id) {
    const evalId = Number(id);
    if (isConnected && pool) {
      try {
        await pool.query('DELETE FROM evaluations WHERE id = ?', [evalId]);
      } catch (err) {
        console.error('MySQL deleteEvaluation error:', err.message);
      }
    }
    const idx = memoryDb.evaluations.findIndex(e => e.id === evalId);
    if (idx !== -1) memoryDb.evaluations.splice(idx, 1);
    return true;
  },

  async getReponses(userId = null) {
    if (isConnected && pool) {
      try {
        let sql = 'SELECT * FROM reponses';
        const params = [];
        if (userId) {
          sql += ' WHERE utilisateur_id = ?';
          params.push(userId);
        }
        sql += ' ORDER BY id DESC';
        const [rows] = await pool.query(sql, params);
        return rows;
      } catch (err) {
        console.error('MySQL getReponses error:', err.message);
      }
    }
    if (userId) {
      return memoryDb.reponses.filter(r => r.utilisateur_id === Number(userId));
    }
    return memoryDb.reponses;
  },

  async getReponseById(id) {
    const repId = Number(id);
    return memoryDb.reponses.find(r => r.id === repId) || null;
  },

  async submitReponse({ utilisateur_id, evaluation_id, reponse, fichier = null }) {
    let newId = Date.now();
    if (isConnected && pool) {
      try {
        const [res] = await pool.query(
          'INSERT INTO reponses (utilisateur_id, evaluation_id, reponse, fichier, note) VALUES (?, ?, ?, ?, NULL)',
          [utilisateur_id, evaluation_id, reponse, fichier]
        );
        newId = res.insertId;
      } catch (err) {
        console.error('MySQL submitReponse error:', err.message);
      }
    } else {
      newId = Math.max(0, ...memoryDb.reponses.map(r => r.id || 0)) + 1;
    }

    const item = {
      id: newId,
      utilisateur_id: Number(utilisateur_id),
      evaluation_id: Number(evaluation_id),
      reponse,
      fichier,
      note: null,
      appreciation: null,
      points_forts: [],
      axes_amelioration: [],
      correction_detaillee: null,
      statut_correction: 'en_attente',
      date_reponse: new Date()
    };
    memoryDb.reponses.push(item);
    return item;
  },

  async updateNote(reponseId, note, appreciation = null) {
    if (isConnected && pool) {
      try {
        await pool.query('UPDATE reponses SET note = ? WHERE id = ?', [note, reponseId]);
      } catch (err) {
        console.error('MySQL updateNote error:', err.message);
      }
    }
    const rep = memoryDb.reponses.find(r => r.id === Number(reponseId));
    if (rep) {
      rep.note = Number(note);
      if (appreciation) rep.appreciation = appreciation;
      rep.statut_correction = 'valide_admin';
    }
    return rep;
  },

  async saveCorrectionAI({ reponseId, note, appreciation, points_forts, axes_amelioration, correction_detaillee, bareme, statut_correction = 'corrige_ia' }) {
    const rep = memoryDb.reponses.find(r => r.id === Number(reponseId));
    if (rep) {
      rep.note = Number(note);
      rep.appreciation = appreciation;
      rep.points_forts = points_forts || [];
      rep.axes_amelioration = axes_amelioration || [];
      rep.correction_detaillee = correction_detaillee;
      rep.bareme = bareme;
      rep.statut_correction = statut_correction;
    }

    if (isConnected && pool) {
      try {
        await pool.query('UPDATE reponses SET note = ? WHERE id = ?', [note, reponseId]);
      } catch (err) {
        console.error('MySQL saveCorrectionAI error:', err.message);
      }
    }
    return rep;
  },

  // MESSAGES
  async getMessages(userId) {
    const uId = Number(userId);
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query(
          'SELECT * FROM messages WHERE expediteur_id = ? OR destinataire_id = ? ORDER BY id ASC',
          [uId, uId]
        );
        return rows;
      } catch (err) {
        console.error('MySQL getMessages error:', err.message);
      }
    }
    return memoryDb.messages.filter(m => m.expediteur_id === uId || m.destinataire_id === uId);
  },

  async sendMessage({ expediteur_id, destinataire_id, isAdminSender = 0, contenu, image = null }) {
    let newId = Date.now();
    if (isConnected && pool) {
      try {
        const [res] = await pool.query(
          'INSERT INTO messages (expediteur_id, destinataire_id, isAdminSender, contenu, image, lu) VALUES (?, ?, ?, ?, ?, 0)',
          [expediteur_id, destinataire_id, isAdminSender ? 1 : 0, contenu, image]
        );
        newId = res.insertId;
      } catch (err) {
        console.error('MySQL sendMessage error:', err.message);
      }
    } else {
      newId = Math.max(0, ...memoryDb.messages.map(m => m.id || 0)) + 1;
    }

    const item = {
      id: newId,
      expediteur_id: Number(expediteur_id),
      destinataire_id: Number(destinataire_id),
      isAdminSender: isAdminSender ? 1 : 0,
      contenu,
      image,
      date_envoi: new Date(),
      lu: 0
    };
    memoryDb.messages.push(item);
    return item;
  }
};
