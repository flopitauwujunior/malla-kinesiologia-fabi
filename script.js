let ramosGuardados = JSON.parse(localStorage.getItem("ramosKinesiologia")) || {};

const semestres = [
  { nombre: "1° Semestre", ramos: [
    "Fundamentos de anatomía para el movimiento humano",
    "Fundamentos del movimiento humano",
    "Biología celular",
    "Principios Matemáticos",
    "Taller de competencias comunicativas",
    "Taller integrado en ciencias"
  ]},
  { nombre: "2° Semestre", ramos: [
    "Anatomía y fisiología",
    "Actividad Física y salud",
    "Química",
    "Fisiología de tejidos",
    "Atención básica de urgencia",
    "Electivo formación general I"
  ]},
  { nombre: "3° Semestre", ramos: [
    "Fisiopatología y Farmacología",
    "Salud y Sociedad",
    "Bioquímica",
    "Fisiología articular",
    "Inglés I",
    "Electivo formación general II"
  ]},
  { nombre: "4° Semestre", ramos: [
    "Fisiología del metabolismo energético y del ejercicio",
    "Semiología kinésica e imagenología",
    "Rehabilitación con base en salud familiar y comunitaria",
    "Biomecánica y control motor",
    "Inglés II",
    "Electivo formación general III"
  ]},
  { nombre: "5° Semestre", ramos: [
    "Estadística para ciencias de la salud",
    "Rehabilitación del sistema locomotor infantil",
    "Rehabilitación cardiorrespiratorio infantil",
    "Neurorrehabilitación infantil",
    "Fisioterapia y ejercicio terapéutico",
    "Persona y sentido"
  ]},
  { nombre: "6° Semestre", ramos: [
    "Ética en salud",
    "Rehabilitación del sistema locomotor adulto",
    "Rehabilitación cardiorrespiratorio adulto",
    "Neurorrehabilitación adulto",
    "Rehabilitación geriátrica",
    "Electivo I"
  ]},
  { nombre: "7° Semestre", ramos: [
    "Metodología de la investigación",
    "Gestión en salud para kinesiólogos",
    "Paciente crítico",
    "Prescripción del ejercicio en pacientes crónicos",
    "Razonamiento clínico I",
    "Electivo II"
  ]},
  { nombre: "8° Semestre", ramos: [
    "Seminario de investigación",
    "Rehabilitación en condiciones especiales de salud",
    "Rehabilitación y reintegro aplicado a la actividad física y deporte",
    "Razonamiento clínico II",
    "Electivo III"
  ]},
  { nombre: "9° Semestre", ramos: [
    "Internado área musculo esquelético",
    "Internado área cardiorrespiratorio"
  ]},
  { nombre: "10° Semestre", ramos: [
    "Internado área Neurorrehabilitación",
    "Internado área de salud comunitaria"
  ]}
];

function guardarRamos() {
  const data = {};
  document.querySelectorAll(".semestre").forEach(sem => {
    const id = sem.id;
    const ramos = [];
    sem.querySelectorAll(".ramo").forEach(ramo => {
      ramos.push({
        texto: ramo.textContent,
        aprobado: ramo.classList.contains("aprobado")
      });
    });
    data[id] = ramos;
  });
  localStorage.setItem("ramosKinesiologia", JSON.stringify(data));
}

function crearRamo(ramoInfo) {
  const ramoDiv = document.createElement("div");
  ramoDiv.classList.add("ramo");
  ramoDiv.textContent = ramoInfo.texto;
  if (ramoInfo.aprobado) ramoDiv.classList.add("aprobado");
  ramoDiv.draggable = true;

  ramoDiv.addEventListener("click", () => {
    ramoDiv.classList.toggle("aprobado");
    guardarRamos();
  });

  ramoDiv.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("ramo", JSON.stringify({
      texto: ramoDiv.textContent,
      aprobado: ramoDiv.classList.contains("aprobado"),
      origenId: ramoDiv.parentElement.id
    }));
    ramoDiv.classList.add("moviendo");
  });

  return ramoDiv;
}

function crearMalla() {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";

  semestres.forEach((sem, idx) => {
    const div = document.createElement("div");
    div.classList.add("semestre");
    const id = `sem-${idx}`;
    div.setAttribute("id", id);
    div.innerHTML = `<h2>${sem.nombre}</h2>`;

    const ramos = ramosGuardados[id] || sem.ramos.map(t => ({ texto: t, aprobado: false }));

    ramos.forEach(ramoInfo => {
      const ramoDiv = crearRamo(ramoInfo);
      div.appendChild(ramoDiv);
    });

    div.addEventListener("dragover", (e) => e.preventDefault());

    div.addEventListener("drop", (e) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData("ramo"));
      const origen = document.getElementById(data.origenId);
      const moviendo = origen.querySelector(".moviendo");

      if (moviendo) {
        moviendo.classList.remove("moviendo");
        e.currentTarget.appendChild(moviendo);
        guardarRamos();
      }
    });

    container.appendChild(div);
  });
}

crearMalla();
