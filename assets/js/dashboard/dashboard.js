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
  conteinerFlotante.addEventListener("click", () => console.log(cita));

  conteinerFlotante.innerHTML = `
    <label>ID cita: ${cita.id}</label><br>
    <label>Paciente: ${cita.paciente.nombreCompleto}</label><br>
    <label>Fecha: ${formatCitaDate(cita.fecha)}</label>
  `;

  return conteinerFlotante;
}

// Obtener citas desde el servidor
async function fetchCitas(date) {
  try {
    const response = await fetch("../controllers/citas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_citas", citas_hoy: date }),
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
async function loadInitialCitas() {
  const loadingMessage = createLoadingSpinner();
  conteinerCitas.appendChild(loadingMessage);

  const citas = await fetchCitas(inputFechaCitas.value);
  renderCitas(citas, loadingMessage);
}

// Manejar cambio de fecha para actualizar citas
async function handleDateChange() {
  const loadingMessage = createLoadingSpinner();
  conteinerCitas.appendChild(loadingMessage);

  const citas = await fetchCitas(inputFechaCitas.value);
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
  pCodPaciente.textContent = `DNI: ${paciente.dni}`;

  const pNombre = document.createElement("p");
  pNombre.classList.add("nombrepaciente");
  pNombre.textContent = `Nombre: ${paciente.nombreCompleto}`;

  const pEstado = document.createElement("p");
  pEstado.textContent = paciente.estado == 1 ? "ACTIVO" : "INACTIVO";
  Object.assign(pEstado.style, estadoStyles);

  const buttonAgregarCita = document.createElement("button");
  buttonAgregarCita.classList.add("agregar_cita");
  buttonAgregarCita.textContent = "Agregar Cita";
  buttonAgregarCita.addEventListener("click", () => alert("Cita Agregada"));

  conteinerUsuario.append(pNombre, pCodPaciente, pEstado, divCitas, buttonAgregarCita);
}

// Buscar paciente por DNI
async function buscarPacientePorDni(dni) {
  try {
    const response = await fetch("http://localhost/clinicadentalsaas/controllers/paciente.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_pacientebyDni", dni }),
    });

    const data = await response.json();
    renderPaciente(data);
  } catch (error) {
    console.error("Error al buscar paciente:", error);
    renderPaciente({ success: false, message: "Error al buscar paciente" });
  }
}

// Manejar el formulario de búsqueda
function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(formBuscar);
  const dni = formData.get("dni");
  buscarPacientePorDni(dni);
}

// Manejar el logout
async function handleLogout() {
  try {
    const response = await fetch("http://localhost/clinicadentalsaas/controllers/auth.php", {
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

// Inicialización
function initialize() {
  inputFechaCitas.value = getTodayDate();
  window.onload = loadInitialCitas;
  inputFechaCitas.addEventListener("change", handleDateChange);
  formBuscar.addEventListener("submit", handleFormSubmit);
  btnSalir.addEventListener("click", handleLogout);
}

// Ejecutar inicialización
initialize();