<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: admin_login.php');
    exit();
}

$pdo = new PDO("mysql:host=localhost;dbname=elearning;charset=utf8", "root", "");
$users = $pdo->query("SELECT id, nom, email FROM utilisateurs ORDER BY nom ASC")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Messagerie Utilisateurs</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 30px; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { margin-bottom: 20px; color: #0f172a; }
        .user-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .user-item:last-child { border-bottom: none; }
        .btn-chat { background: #0284c7; color: white; text-decoration: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; }
        .btn-chat:hover { background: #0369a1; }
        .btn-back { display: inline-block; margin-bottom: 15px; text-decoration: none; color: #64748b; }
    </style>
</head>
<body>

<div class="container">
    <a href="admin_dashboard.php" class="btn-back">← Retour au tableau de bord</a>
    <h1>Messagerie des Étudiants</h1>

    <?php foreach ($users as $user): ?>
        <div class="user-item">
            <div>
                <strong><?= htmlspecialchars($user['nom']) ?></strong><br>
                <small style="color: #64748b;"><?= htmlspecialchars($user['email']) ?></small>
            </div>
            <a href="conversation.php?id_utilisateur=<?= $user['id'] ?>" class="btn-chat" cite="4">Ouvrir la conversation</a>
        </div>
    <?php endforeach; ?>
</div>

</body>
</html>