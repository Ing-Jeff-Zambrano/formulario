const formulario = document.getElementById("formulario");
const mensajeExito = document.getElementById("mensaje-exito");
const terminos = document.getElementById("terminos");


const campos = {
  nombre: document.getElementById("nombre"),
  correo: document.getElementById("correo"),
  telefono: document.getElementById("telefono"),
  edad: document.getElementById("edad"),
  curso: document.getElementById("curso"),
  password: document.getElementById("password"),
  confirmar: document.getElementById("confirmar"),
};


const radiosModalidad = document.querySelectorAll('input[name="modalidad"]');


const reglas = {
  nombre: (v) => {
    if (!v.trim()) return "El nombre es obligatorio.";
    if (v.trim().length < 3) return "Debe tener al menos 3 caracteres.";
    return "";
  },
  correo: (v) => {
    if (!v.trim()) return "El correo es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Ingresa un correo válido.";
    return "";
  },
  telefono: (v) => {
    if (!v.trim()) return "El teléfono es obligatorio.";
    if (!/^\d+$/.test(v)) return "Solo se permiten números.";
    if (v.length !== 10) return "Debe tener 10 dígitos.";
    return "";
  },
  edad: (v) => {
    if (v === "") return "La edad es obligatoria.";
    const edad = Number(v);
    if (!Number.isInteger(edad)) return "Ingresa un número entero.";
    if (edad < 16 || edad > 99) return "Debe estar entre 16 y 99.";
    return "";
  },
  curso: (v) => (v === "" ? "Debes seleccionar un curso." : ""),
  password: (v) => {
    if (!v) return "La contraseña es obligatoria.";
    if (v.length < 8) return "Debe tener al menos 8 caracteres.";
    return "";
  },
  confirmar: (v) => {
    if (!v) return "Confirma tu contraseña.";
    if (v !== campos.password.value) return "Las contraseñas no coinciden.";
    return "";
  },
};


function mostrarEstado(campo, mensaje) {
  document.getElementById(`error-${campo.id}`).textContent = mensaje;
  campo.classList.toggle("invalido", mensaje !== "");
  campo.classList.toggle("valido", mensaje === "");
}


function validarCampo(nombre) {
  const campo = campos[nombre];
  const mensaje = reglas[nombre](campo.value);
  mostrarEstado(campo, mensaje);
  return mensaje === "";
}


function validarModalidad() {
  const seleccionada = document.querySelector('input[name="modalidad"]:checked');
  document.getElementById("error-modalidad").textContent = seleccionada
    ? ""
    : "Selecciona una modalidad.";
  return Boolean(seleccionada);
}


function validarTerminos() {
  document.getElementById("error-terminos").textContent = terminos.checked
    ? ""
    : "Debes aceptar los términos para continuar.";
  return terminos.checked;
}


// Solo dígitos en el teléfono mientras se escribe
campos.telefono.addEventListener("input", () => {
  campos.telefono.value = campos.telefono.value.replace(/\D/g, "");
});


Object.keys(campos).forEach((nombre) => {
  const campo = campos[nombre];
  campo.addEventListener("input", () => {
    validarCampo(nombre);
    // Si cambia la contraseña, se revalida la confirmación
    if (nombre === "password" && campos.confirmar.value) validarCampo("confirmar");
  });
  campo.addEventListener("blur", () => validarCampo(nombre));
});


radiosModalidad.forEach((radio) => radio.addEventListener("change", validarModalidad));
terminos.addEventListener("change", validarTerminos);


document.querySelectorAll(".ojo").forEach((boton) => {
  boton.addEventListener("click", () => {
    const input = document.getElementById(boton.dataset.objetivo);
    input.type = input.type === "password" ? "text" : "password";
  });
});


formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  mensajeExito.classList.remove("mensaje-error");


  const resultados = Object.keys(campos).map(validarCampo);
  resultados.push(validarModalidad(), validarTerminos());


  if (resultados.includes(false)) {
    mensajeExito.textContent = "Corrige los errores antes de enviar.";
    mensajeExito.classList.add("mensaje-error");
    return;
  }


  const modalidad = document.querySelector('input[name="modalidad"]:checked').value;
  const primerNombre = campos.nombre.value.trim().split(" ")[0];


  mensajeExito.textContent =
    `¡Listo, ${primerNombre}! Quedaste inscrito en "${campos.curso.value}" (${modalidad}).`;


  formulario.reset();
  Object.values(campos).forEach((campo) => campo.classList.remove("valido", "invalido"));
});
