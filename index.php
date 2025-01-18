<?php
session_start();
if(isset($_SESSION['correo'])) {
    header("Location: views/dashboard.html");
    exit();
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ODAM-PLATAFORMA</title>
    <link rel="stylesheet" href="assets/css/index.css">

    </head>
<body>
    <header>
        <h1>ODAM-PLATAFORMA</h1>
    </header>
    
    <div class="login">
        <form action="" method="post">
            <label for="email">Email</label>
            <input type="text" name="email" id="email">
            <label for="password">Password</label>
            <input type="password" name="password" id="password">
            <button type="button" id="loginBtn" onclick="login()">Login</button>
        </form>
    </div>

    <script src="assets/js/auth.js"></script>
</body>
</html>