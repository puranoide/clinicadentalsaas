<?php

function login($conexion, $correo, $contraseña) {
    // Sanitize inputs to prevent SQL injection
    $correo = mysqli_real_escape_string($conexion, $correo);
    $contraseña = mysqli_real_escape_string($conexion, $contraseña);
    $query = "SELECT * FROM usuario WHERE correo = ? AND contraseña = ?";
    $stmt = mysqli_prepare($conexion, $query);
    mysqli_stmt_bind_param($stmt, "ss", $correo, $contraseña);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        session_start();
        $_SESSION['correo'] = $row['correo'];
        $_SESSION['nombre'] = $row['nombres']; 
        $_SESSION['idrol'] = $row['idrol'];
        return true;
    }
    else {
        return false;
    }
}

// Verify if receiving POST request with JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Set response header as JSON
    header('Content-Type: application/json');
    
    // Decode received JSON
    $data = json_decode(file_get_contents("php://input"), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    
    // Validate received data    
    
    include_once('../config/db.php');
    switch ($data['action']) {
        case 'login':
            if (!$conexion) {
                echo json_encode(['error' => 'No se pudo conectar a la base de datos']);
                exit;
            }
            
            // Resto del código...
            try {
            $response = login($conexion, $data['email'], $data['password']);
            if ($response) {
                echo json_encode(['success' => 'login exitoso']);
            }
            else {
                echo json_encode(['error' => 'login fallido']);
            }
        }
            catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;
        default:
            echo json_encode(['success' => false]);
            break;
    }
}

?>