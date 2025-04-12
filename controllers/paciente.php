<?php

function getpacientebydni($con, $dni, $sedes)
{
    $placeholders = implode(',', array_fill(0, count($sedes), '?'));
    $sql = "SELECT * FROM paciente WHERE dni = ? and sedeid IN ($placeholders)";
    $stmt = mysqli_prepare($con, $sql);
    $bind_params = array_merge([$dni], $sedes); // Corrected the order of bind parameters
    mysqli_stmt_bind_param($stmt, 's' . str_repeat('i', count($sedes)), ...$bind_params); // Corrected the types order
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
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
//fixear el nombre
function agregarCitaPaciente($con, $pacienteid, $fecha, $detalle)
{
    $sql = "INSERT INTO siguiente_cita (pacienteid, fecha, detalle) VALUES (?,?,?)";
    $stmt = mysqli_prepare($con, $sql);
    mysqli_stmt_bind_param($stmt, "iss", $pacienteid, $fecha, $detalle);
    $result = mysqli_stmt_execute($stmt);
    return $result;
}

function agregarPaciente($con,$nombre, $dni, $sede, $user, $role, $codigoPaciente, $procedencia, $edad, $estado){

    $sql = "INSERT INTO paciente (nombreCompleto, dni, sedeid, userid, roleid, cod_paciente, procedencia, edad, estado) VALUES (?,?,?,?,?,?,?,?,?)";
    $stmt = mysqli_prepare($con, $sql);
    mysqli_stmt_bind_param($stmt, "ssiiissii", $nombre, $dni, $sede, $user, $role, $codigoPaciente, $procedencia, $edad, $estado);
    $result = mysqli_stmt_execute($stmt);
    return $result;

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
                $response = getpacientebydni($conexion, $data['dni'], $data['sedes']);

                if ($response) {
                    $citas = getPacientecitasbyid($conexion, $response['id']);
                    echo json_encode(['success' => true, 'paciente' => $response, 'citas' => $citas, 'message' => 'paciente  encontrado']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'paciente no encontrado,dni ' . $data['dni'],'DNI'=>$data['dni']]);
                }
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;
        case 'agregar_cita':
            if (!$conexion) {
                echo json_encode(['error' => 'No se pudo conectar a la base de datos']);
                exit;
            }
            try {
                $response = agregarCitaPaciente($conexion, $data['id'], $data['fecha'], $data['detalle']);

                if ($response) {
                    echo json_encode(['success' => true, 'message' => 'Cita guardada correctamente']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Error al guardar la cita']);
                }
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            
            break;
        case 'add_paciente':
            if (!$conexion) {
                echo json_encode(['error' => 'No se pudo conectar a la base de datos']);
                exit;
            }
            try {
            $response = agregarPaciente($conexion, $data['nombreCompleto'], $data['dniI'], $data['sedeidI'], $data['useridI'], $data['roleidI'], $data['cod_pacienteI'], $data['procedenciaI'], $data['edadI'], $data['estadoI']);

            if ($response) {
                echo json_encode(['success' => true, 'message' => 'Paciente guardado correctamente']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al guardar el paciente']);
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
