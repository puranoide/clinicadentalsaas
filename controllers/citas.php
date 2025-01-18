<?php

function getCitasbyDate($conexion, $citas_hoy) {
    // Sanitize inputs to prevent SQL injection
    $citas_hoy = mysqli_real_escape_string($conexion, $citas_hoy);
    $query = "SELECT * FROM siguiente_cita WHERE fecha = ?";
    $stmt = mysqli_prepare($conexion, $query);
    mysqli_stmt_bind_param($stmt, "s", $citas_hoy);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if (mysqli_num_rows($result) > 0) {
        $citas = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $citas[] = $row;
        }
        return $citas;
    } else {
        return false;
    }
}

function getPacienteByid($conexion, $id) {
    // Sanitize inputs to prevent SQL injection
    $id = mysqli_real_escape_string($conexion, $id);
    $query = "SELECT * FROM paciente WHERE id = ?";
    $stmt = mysqli_prepare($conexion, $query);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if (mysqli_num_rows($result) > 0) {
        $paciente = mysqli_fetch_assoc($result);
        return $paciente;
    } else {
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
        case 'get_citas':
            if (!$conexion) {
                echo json_encode(['error' => 'No se pudo conectar a la base de datos']);
                exit;
            }
            
            // Resto del código...
            try {
            $response = getCitasbyDate($conexion, $data['citas_hoy']);

            if ($response) {
                for ($i = 0; $i < count($response); $i++) {
                    $response[$i]['paciente'] = getPacienteByid($conexion, $response[$i]['pacienteid']);
                }
                
                echo json_encode(['success' => true, 'citas' => $response,'message' => 'Citas encontradas']);
            }
            else {
                echo json_encode(['success' => false, 'message' => 'Citas no encontradas']);
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