<?php

session_start();
if (!isset($_SESSION['correo'])) {
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
        <?php
        if ($_SESSION['idrol'] == 1) {
            echo '<p>Has iniciado sesión como administrador.</p>';
        } elseif ($_SESSION['idrol'] == 2) {
            echo '<p>Has iniciado sesión como atencion al cliente.</p>';
        } ?>

        <p id="salir" class="salir">cerrar session</p>

    </div>

    <div class="citas_hoy_container">
        <h4>Citas de hoy</h4>
        <input type="date" id="citas_hoy">
        <div id="citas" class="citas">

        </div>

    </div>

    <div class="formulariodebusqueda">
        <form action="../controllers/paciente.php" method="post" id="formBuscar">
            <label for="dni">DNI:</label>
            <input type="number" id="dni" name="dni" required>
            <button type="submit">Buscar</button>
        </form>
    </div>
    <div class="contenidousuario" id="contenidousuario">

    </div>

    <div class="conteainerAgregarPaciente" id="conteainerAgregarPaciente">

    </div>
    <div class="CitaInfo" id="CitaInfo">

    </div>
    <script src="../assets/js/dashboard/dashboard.js"></script>
</body>

</html>