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
function renderPaciente(data,sedesids) {
  conteinerUsuario.style.display = "block";
  conteinerUsuario.innerHTML = "";
  console.log("Recibiendo Sedes:", sedesids);
  if (!data.success) {
    console.log("sedes dentro de la condicion", sedesids);
    renderPacienteNoEncontrado(data.DNI,sedesids);
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
    renderPaciente(data, sedesids);
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

function renderPacienteNoEncontrado(dni, sedesids) {
  //alert("Paciente no encontrado");
  console.log('sedes dentro de la funcion_no_encontrado', sedesids);
  const pError = document.createElement("p");
  pError.classList.add("error");
  pError.textContent = "Paciente no encontrado, DNI: " + dni + ", Sedes: " + sedesids.join(", ");
  
  const pMessage= document.createElement("p");
  pMessage.classList.add("cuestionMensaje");
  pMessage.textContent ="deseas registar este paciente en esta sede?"

  const formAddPaciente= document.createElement("form");
  formAddPaciente.classList.add("formAgregarPacienteCita");

  //labeles
  const labelNombres = document.createElement("label");
  labelNombres.textContent = "Nombres:";
  const labelDni = document.createElement("label");
  labelDni.textContent = "DNI:";
  const labelSede = document.createElement("label");
  labelSede.textContent = "Sede:";
  const labelUser = document.createElement("label");
  labelUser.textContent = "User:";
  const labelRole = document.createElement("label");
  labelRole.textContent = "Role:";
  const labelCpaciente= document.createElement("label");
  labelCpaciente.textContent = "Codigo del paciente:";
  const labelProcedencia= document.createElement("label");
  labelProcedencia.textContent = "Procedencia:";
  const labelEdad= document.createElement("label");
  labelEdad.textContent = "Edad:";

  //necesitamos craear los inputs para la creacion del paciente

  const NombresP= document.createElement("input");
  NombresP.type = "text";
  NombresP.placeholder = "Nombres";
  NombresP.required = true;

  const inputDni = document.createElement("input");
  inputDni.type = "text";
  inputDni.placeholder = "DNI";
  inputDni.value = dni;
  inputDni.required = true;
  inputDni.readOnly = true;

  const Sede=document.createElement("input");
  Sede.type = "number";
  Sede.placeholder = "Sede";
  Sede.value = sedesids;
  Sede.required = true;
  Sede.readOnly = true;
  

  const userRegister = document.createElement("input");
  userRegister.type = "text";
  userRegister.placeholder = "user";
  userRegister.value = iduser;
  userRegister.required = true;
  userRegister.readOnly = true;

  const roleP= document.createElement("input");
  roleP.type = "number";
  roleP.placeholder = "Rol";
  roleP.value = 3;
  roleP.required = true;
  roleP.readOnly = true;

  const cPaciente= document.createElement("input");
  cPaciente.type = "text";
  cPaciente.placeholder = "Codigo del paciente";
  cPaciente.required = true;

  const procedenciaP= document.createElement("input");
  procedenciaP.type = "text";
  procedenciaP.placeholder = "Procedencia";
  procedenciaP.required = true;

  const edadF= document.createElement("input");
  edadF.type = "number";
  edadF.placeholder = "Edad";
  edadF.required = true;

  const estadoP= document.createElement("input");
  estadoP.type = "hidden";
  estadoP.placeholder = "Estado";
  estadoP.value = 1;
  estadoP.required = true;

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Guardar";

  //integracion de los input y labeles

  formAddPaciente.appendChild(labelNombres);
  formAddPaciente.appendChild(NombresP);
  formAddPaciente.appendChild(labelDni);
  formAddPaciente.appendChild(inputDni);
  formAddPaciente.appendChild(labelSede);
  formAddPaciente.appendChild(Sede);
  formAddPaciente.appendChild(labelUser);
  formAddPaciente.appendChild(userRegister);
  formAddPaciente.appendChild(labelRole);
  formAddPaciente.appendChild(roleP);
  formAddPaciente.appendChild(labelCpaciente);
  formAddPaciente.appendChild(cPaciente);
  formAddPaciente.appendChild(labelProcedencia);
  formAddPaciente.appendChild(procedenciaP);
  formAddPaciente.appendChild(labelEdad);
  formAddPaciente.appendChild(edadF);
  formAddPaciente.appendChild(estadoP);
  formAddPaciente.appendChild(submitButton);

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    const nombres = NombresP.value;
    const dni = inputDni.value;
    const sedevalue = Sede.value;
    const user = userRegister.value;
    const role = roleP.value;
    const codigoPaciente = cPaciente.value;
    const procedencia = procedenciaP.value;
    const edad = edadF.value;
    const estado = estadoP.value;

    alert(`Nombres: ${nombres}, DNI: ${dni}, Sede: ${sedevalue}, User: ${user}, Role: ${role}, Codigo del paciente: ${codigoPaciente}, Procedencia: ${procedencia}, Edad: ${edad}, Estado: ${estado}`);
  });



  //integra lo necesario para la craecion del componente
  conteinerUsuario.appendChild(pError);
  conteinerUsuario.appendChild(pMessage);
  conteinerUsuario.appendChild(formAddPaciente);

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