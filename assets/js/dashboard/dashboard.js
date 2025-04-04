// Constantes globales
const DIAS_SEMANA = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Elementos del DOM
const conteinerUsuario = document.getElementById("contenidousuario");
const conteinerCitas = document.getElementById("citas");
const inputFechaCitas = document.getElementById("citas_hoy");
const formBuscar = document.getElementById("formBuscar");
const btnSalir = document.getElementById("salir");
const conteainerAgregarPaciente = document.getElementById("conteainerAgregarPaciente");
const iduser = Number(document.getElementById("idUser").textContent);

const CitaInfoContainer = document.getElementById("CitaInfo");
// Utilidad para obtener la fecha actual en formato YYYY-MM-DD
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Formatear fecha para mostrar en formato legible
function formatCitaDate(date) {
  const citaDate = new Date(date);
  citaDate.setDate(citaDate.getDate() + 1);
  return `${DIAS_SEMANA[citaDate.getDay()]}, ${citaDate.getDate()} de ${MESES[citaDate.getMonth()]}`;
}

// Crear elemento HTML para una cita
function createCitaElement(cita) {
  const conteinerFlotante = document.createElement("div");
  conteinerFlotante.classList.add("float-citas");
  console.log(cita);
  conteinerFlotante.addEventListener("click", () => RenderCitaData(cita));

  conteinerFlotante.innerHTML = `
    <label>ID cita: ${cita.id}</label><br>
    <label>Paciente: ${cita.pacienteid}</label><br>
    <label>Fecha: ${formatCitaDate(cita.fecha)}</label>
  `;

  return conteinerFlotante;
}

function RenderCitaData(cita) {
  console.log(cita);
  CitaInfoContainer.style.display = "block";
  var buttonCerrar = document.createElement("button");
  buttonCerrar.classList.add("cerrarButtonFloat");
  buttonCerrar.textContent = "Cerrar";
  buttonCerrar.addEventListener("click", function () {
    CitaInfoContainer.style.display = "none";
    CitaInfoContainer.innerHTML = "";
  });



  CitaInfoContainer.innerHTML = `
    <label>Paciente procediente de : ${cita.procedencia}</label><br>
    <label>DNI: ${cita.dni}</label><br>
    <label>Descripción: ${cita.detalle}</label>
    <br>  <br>  <br>  
  `;

  CitaInfoContainer.appendChild(buttonCerrar);

}
// Obtener citas desde el servidor
async function fetchCitas(date, sedes) {
  try {
    const response = await fetch("../controllers/citas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_citas", citas_hoy: date, sedes: sedes }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || "Error al obtener citas");

    return data.citas || [];
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return [];
  }
}

// Renderizar citas en el DOM
function renderCitas(citas, loadingMessage) {
  conteinerCitas.innerHTML = "";
  if (!citas || citas.length === 0) {
    loadingMessage.textContent = "No se encontraron citas para esta fecha";
    loadingMessage.classList.remove("loading-spinner");
    conteinerCitas.appendChild(loadingMessage);
    return;
  }

  const citasElements = citas.map(createCitaElement);
  conteinerCitas.append(...citasElements);
}

// Crear y manejar el spinner de carga
function createLoadingSpinner() {
  const loadingMessage = document.createElement("div");
  loadingMessage.classList.add("loading-spinner");
  return loadingMessage;
}

// Cargar citas iniciales al iniciar la página
async function loadInitialCitas(sedes) {
  alert(sedes)
  const loadingMessage = createLoadingSpinner();
  conteinerCitas.appendChild(loadingMessage);

  const citas = await fetchCitas(inputFechaCitas.value, sedes);
  renderCitas(citas, loadingMessage);
}

// Manejar cambio de fecha para actualizar citas
async function handleDateChange(sedesids) {
  const loadingMessage = createLoadingSpinner();
  conteinerCitas.appendChild(loadingMessage);
  console.log('funcion con fecha', inputFechaCitas.value, sedesids);
  const citas = await fetchCitas(inputFechaCitas.value, sedesids);
  renderCitas(citas, loadingMessage);
}

// Crear elemento de cita por paciente
function createCitaPorPacienteElement(cita) {
  const elementoCita = document.createElement("div");
  elementoCita.classList.add("cita_element");
  elementoCita.innerHTML = `
    <p class="cita_fecha">Fecha: ${formatCitaDate(cita.fecha)}</p>
    <p class="cita_descripcion">Descripción: ${cita.detalle}</p>
  `;
  return elementoCita;
}

// Mostrar información del paciente encontrado
function renderPaciente(data) {
  conteinerUsuario.style.display = "block";
  conteinerUsuario.innerHTML = "";

  if (!data.success) {
    const pError = document.createElement("p");
    pError.classList.add("error");
    pError.textContent = data.message || "Paciente no encontrado";
    conteinerUsuario.appendChild(pError);
    return;
  }

  const paciente = data.paciente;
  const divCitas = document.createElement("div");
  divCitas.id = "citas";
  divCitas.classList.add("citasporpaciente");

  const citasElements = data.citas.map(createCitaPorPacienteElement);
  divCitas.append(...citasElements);

  const estadoStyles = {
    color: paciente.estado == 1 ? "green" : "red",
    fontWeight: "bold",
    textDecoration: "underline",
    fontSize: "16px",
    padding: "10px"
  };

  const pCodPaciente = document.createElement("p");
  pCodPaciente.classList.add("codpaciente");
  pCodPaciente.textContent = `DNI: ${paciente.dni}-Pacienteid: ${paciente.id}`;

  const pNombre = document.createElement("p");
  pNombre.classList.add("nombrepaciente");
  pNombre.textContent = `Nombre: ${paciente.nombreCompleto}`;

  const pEstado = document.createElement("p");
  pEstado.textContent = paciente.estado == 1 ? "ACTIVO" : "INACTIVO";
  Object.assign(pEstado.style, estadoStyles);

  const buttonAgregarCita = document.createElement("button");
  buttonAgregarCita.classList.add("agregar_cita");
  buttonAgregarCita.textContent = "Agregar Cita";
  buttonAgregarCita.addEventListener("click", () => renderAgregarPaciente(paciente));

  conteinerUsuario.append(pNombre, pCodPaciente, pEstado, divCitas, buttonAgregarCita);
}

// Buscar paciente por DNI
async function buscarPacientePorDni(dni, sedesids) {
  try {
    const response = await fetch("../controllers/paciente.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_pacientebyDni", dni, sedes: sedesids }),
    });

    const data = await response.json();
    renderPaciente(data);
  } catch (error) {
    console.error("Error al buscar paciente:", error);
    renderPaciente({ success: false, message: "Error al buscar paciente" });
  }
}
//funcion para renderizar el componente de agregar paciente

function renderAgregarPaciente(Paciente) {
  conteainerAgregarPaciente.style.display = "block";
  var buttonCerrar = document.createElement("button");
  buttonCerrar.classList.add("cerrarButtonFloat");
  buttonCerrar.textContent = "Cerrar";
  buttonCerrar.addEventListener("click", function () {
    conteainerAgregarPaciente.style.display = "none";
    conteainerAgregarPaciente.innerHTML = "";
  });

  var FormContainer = document.createElement("form");
  FormContainer.id = "formAgregarPacienteCita";
  FormContainer.style.display = "block";
  FormContainer.classList.add("formAgregarPacienteCita");

  var inputIdPaciente = document.createElement("input");
  inputIdPaciente.type = "hidden";
  inputIdPaciente.id = "pacienteid";
  inputIdPaciente.name = "pacienteid";
  inputIdPaciente.value = Paciente.id;

  var inputDni = document.createElement("input");
  inputDni.type = "text";
  inputDni.id = "dni";
  inputDni.name = "dni";
  inputDni.value = 'Cita para el paciente:' + Paciente.dni;

  var inputFecha = document.createElement("input");
  inputFecha.type = "date";
  inputFecha.id = "fecha";
  inputFecha.name = "fecha";

  var inputDetalle = document.createElement("input");
  inputDetalle.type = "text";
  inputDetalle.id = "detalle";
  inputDetalle.name = "detalle";
  inputDetalle.placeholder = "Detalle de la cita";

  var inputGuardar = document.createElement("input");
  inputGuardar.type = "submit";
  inputGuardar.id = "guardar";
  inputGuardar.value = "Guardar";
  inputGuardar.addEventListener("click", function (event) {
    event.preventDefault();
    //alert(`Cita guardada:${inputFecha.value}, ${inputDetalle.value}, ${inputIdPaciente.value}`);
    //agregarCita(inputDni.value, inputFecha.value, inputDetalle.value);
    agregarCita(inputIdPaciente.value, inputFecha.value, inputDetalle.value);
  });

  FormContainer.appendChild(inputIdPaciente);
  FormContainer.appendChild(inputDni);
  FormContainer.appendChild(inputFecha);
  FormContainer.appendChild(inputDetalle);
  FormContainer.appendChild(inputGuardar);


  conteainerAgregarPaciente.appendChild(buttonCerrar);
  conteainerAgregarPaciente.appendChild(FormContainer);

}

// Manejar el formulario de búsqueda
function handleFormSubmit(event, sedesids) {
  event.preventDefault();
  console.log("Formulario enviado:sedes", sedesids);
  //alert(sedesids);
  const formData = new FormData(formBuscar);
  const dni = formData.get("dni");
  buscarPacientePorDni(dni, sedesids);
}

// Manejar el logout
async function handleLogout() {
  try {
    const response = await fetch("../controllers/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });

    const data = await response.json();
    alert(data.message);
    window.location.href = "../index.php";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("Error al cerrar sesión");
  }
}

function fetchSedeByid(id) {
  fetch("../controllers/auth.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_sedebyid", iduser: id }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        const sedesids = [];
        console.error("el usuario no tiene sede:", sedesids);
        loadInitialCitas(sedesids);
        return;
      }
      console.log("Respuesta del servidor sedes:", data);
      const sedesids = data.sede.map((sede) => sede.idsede);
      console.log(sedesids);
      loadInitialCitas(sedesids);
      inputFechaCitas.addEventListener("change", () => handleDateChange(sedesids));
      formBuscar.addEventListener("submit", () => handleFormSubmit(event, sedesids));
    })
    .catch((error) => {
      console.error("Error al obtener sede:", error);
    });
}

function agregarCita(id, fecha, detalle) {
  alert(`Cita guardada:  ${fecha}, ${detalle}, id del paciente en base de datos: ${id}`);
  fetch("../controllers/paciente.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "agregar_cita", id: id, fecha: fecha, detalle: detalle }),
  }).then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Cita guardada correctamente");
        window.location.reload();
      } else {
        alert(data.message);
      }
    }).catch((error) => {
      console.error("Error al guardar la cita:", error);
    });
}

// Inicialización
function initialize() {
  inputFechaCitas.value = getTodayDate();

  //inputFechaCitas.addEventListener("change", handleDateChange);
  //formBuscar.addEventListener("submit", handleFormSubmit);
  btnSalir.addEventListener("click", handleLogout);
  fetchSedeByid(iduser);


}

// Ejecutar inicialización
initialize();