function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const diasSemana = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function formatCitaDate(date) {
  const citaDate = new Date(date);
  citaDate.setDate(citaDate.getDate() + 1);
  return `${diasSemana[citaDate.getDay()]}, ${citaDate.getDate()} de ${
    meses[citaDate.getMonth()]
  }`;
}

function createCitaElement(cita) {
  const conteinerflotante = document.createElement("div");
  conteinerflotante.classList.add("float-citas");
  conteinerflotante.addEventListener("click", function() {
    console.log(cita);
  });
  const labelPaciente = document.createElement("label");
  const id_cita = document.createElement("label");
  id_cita.textContent = `ID cita: ${cita.id}`;
  labelPaciente.textContent = `Paciente: ${cita.paciente.dni}`;
  const labelFecha = document.createElement("label");
  labelFecha.textContent = `Fecha: ${formatCitaDate(cita.fecha)}`;

  conteinerflotante.append(
    id_cita,
    document.createElement("br"),
    labelPaciente,
    document.createElement("br"),
    labelFecha
  );
  return conteinerflotante;
}

async function fetchCitas(date) {
  try {
    const response = await fetch("../controllers/citas.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "get_citas",
        citas_hoy: date,
      }),
    });

    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    if (!data.success) {
      throw new Error(data.message || "Error al obtener citas");
    }

    return data.citas;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

function renderCitas(citas, loadingMessage) {
  const conteiner_citas = document.getElementById("citas");
  conteiner_citas.innerHTML = "";
  
  if (!citas || citas.length === 0) {
    loadingMessage.textContent = "No se encontraron citas para esta fecha";
    conteiner_citas.appendChild(loadingMessage);
    return;
  }

  const citasElements = citas.map(createCitaElement);
  conteiner_citas.append(...citasElements);
}
// Set initial date
document.getElementById("citas_hoy").value = getTodayDate();

// Initial load
window.onload = async function () {
  const conteiner_citas = document.getElementById("citas");
  const loadingMessage = document.createElement("div");
  loadingMessage.textContent = "Cargando citas...";
  loadingMessage.classList.add("loading-message");
  conteiner_citas.appendChild(loadingMessage);

  const citas = await fetchCitas(document.getElementById("citas_hoy").value);
  renderCitas(citas, loadingMessage);
};

// Handle date changes
document
  .getElementById("citas_hoy")
  .addEventListener("change", async function () {
    const conteiner_citas = document.getElementById("citas");
    const loadingMessage = document.createElement("div");
    loadingMessage.textContent = "Cargando citas...";
    loadingMessage.classList.add("loading-message");
    conteiner_citas.appendChild(loadingMessage);
    const citas = await fetchCitas(this.value);
    renderCitas(citas, loadingMessage);
  });

