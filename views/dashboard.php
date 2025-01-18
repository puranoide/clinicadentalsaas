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
    </div >
    
    <div class="citas_hoy_container">
        <h4>Citas de hoy</h4>
    <input type="date" id="citas_hoy">
        <div class="citas"></div>
        <div class="float-citas">
            <label for="citas">Angel Gabriel Acosta Sanchez</label><br>
            <label for="citas">03-03-2025 6:00 PM</label>
        </div>
        <div class="float-citas">
        <label for="citas">Angel Gabriel Acosta Sanchez</label><br>
        <label for="citas">03-03-2025 6:00 PM</label>
        </div>
        <div class="float-citas">
            <label for="citas">Angel Gabriel Acosta Sanchez</label><br>
            <label for="citas">03-03-2025 6:00 PM</label>
        </div>
        <div class="float-citas">
        <label for="citas">Angel Gabriel Acosta Sanchez</label><br>
        <label for="citas">03-03-2025 6:00 PM</label>
        </div>
        <div class="float-citas">
            <label for="citas">Angel Gabriel Acosta Sanchez</label><br>
            <label for="citas">03-03-2025 6:00 PM</label>
        </div>
        <div class="float-citas">
        <label for="citas">Angel Gabriel Acosta Sanchez</label><br>
        <label for="citas">03-03-2025 6:00 PM</label>
        </div>
    </div>

    </div>
    <script src="../assets/js/dashboard/dashboard.js"></script>
</body>
</html>