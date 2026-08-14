<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: connexion.php");
    exit();
}

$conn = new mysqli("localhost", "root", "", "elearning");
if ($conn->connect_error) {
    die("Échec de la connexion : " . $conn->connect_error);
}

$user_id = $_SESSION['user_id'];
$erreur = "";

// Mettre à jour les informations si le formulaire est soumis
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_nom = trim($_POST['nom'] ?? '');
    $new_email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);

    if (!empty($new_nom) && $new_email) {
        $update_sql = "UPDATE utilisateurs SET nom = ?, email = ? WHERE id = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("ssi", $new_nom, $new_email, $user_id);
        
        if ($update_stmt->execute()) {
            $_SESSION['user_nom'] = $new_nom;
            $_SESSION['user_email'] = $new_email;
            $update_stmt->close();
            $conn->close();
            header("Location: profil.php");
            exit();
        } else {
            $erreur = "Erreur lors de la mise à jour du profil.";
        }
        $update_stmt->close();
    } else {
        $erreur = "Veuillez fournir un nom valide et une adresse e-mail correcte.";
    }
}

// Récupérer les informations actuelles de l'utilisateur
$sql = "SELECT nom, email FROM utilisateurs WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modifier le Profil</title>
    <link rel="stylesheet" href="index.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5" id="container" style="max-width: 500px;">
        <h2 class="text-center mb-4">Modifier Mon Profil</h2>

        <?php if (!empty($erreur)): ?>
            <div class="alert alert-danger"><?= htmlspecialchars($erreur) ?></div>
        <?php endif; ?>

        <form action="update_profile.php" method="POST">
            <div class="mb-3">
                <label class="form-label">Nom</label>
                <input type="text" class="form-control" name="nom" value="<?= htmlspecialchars($user['nom'] ?? '') ?>" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" name="email" value="<?= htmlspecialchars($user['email'] ?? '') ?>" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Mettre à jour</button>
        </form>
        <a href="profil.php" class="btn btn-secondary w-100 mt-3">Annuler</a>
    </div>
</body>
</html>