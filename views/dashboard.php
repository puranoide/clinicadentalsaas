<?php

session_start();
if(!isset($_SESSION['correo'])) {
    header("Location:../index.php");
    exit();
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>dashboard</title>
    <link rel="stylesheet" href="../assets/css/dashboard.css">

    </head>
<body>
    <header>
        <h1>ODAM-PLATAFORMA</h1>
    </header>
    
    <div class="dashboard">
        <h2>Dashboard</h2>
        <p>Bienvenido, <?php echo $_SESSION['correo']; ?>.</p>
    </div class=container-float-citas>
    <input type="date">
    <div>
        <div class="container-float-citas">
            <label for="citas">paciente</label>
            <label for="citas">Hora</label>
        </div>
        <div class="container-float-citas">
            <label for="citas">paciente</label>
            <label for="citas">Hora</label>
        </div>
    </div>
    <div>

    </div>
    <script src="../assets/js/dashboard/dashboard.js"></script>
</body>
</html>