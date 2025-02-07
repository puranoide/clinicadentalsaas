<?php

function getpacientebydni($con, $dni)
{
    $sql = "SELECT * FROM paciente WHERE dni = '$dni'";
    $result = mysqli_query($con, $sql);
    if (mysqli_num_rows($result) > 0) {
        $paciente = mysqli_fetch_assoc($result);
        return $paciente;
    } else {
        return false;
    }
}

function getPacientecitasbyid($con, $id)
{
    $sql = "SELECT * FROM siguiente_cita WHERE pacienteid = '$id'";
    $result = mysqli_query($con, $sql);
    $citas = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $citas[] = $row;
    }
    return $citas;
}


include_once('../config/db.php');

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
        case 'get_pacientebyDni':
            if (!$conexion) {
                echo json_encode(['error' => 'No se pudo conectar a la base de datos']);
                exit;
            }

            // Resto del código...
            try {
                $response = getpacientebydni($conexion, $data['dni']);

                if ($response) {
                    $citas = getPacientecitasbyid($conexion, $response['id']);
                    echo json_encode(['success' => true, 'paciente' => $response, 'citas' => $citas, 'message' => 'paciente  encontrado']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'paciente no encontrado,dni '.$data['dni']]);
                }
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;
        default:
            echo json_encode(['success' => false]);
            break;
    }
}
