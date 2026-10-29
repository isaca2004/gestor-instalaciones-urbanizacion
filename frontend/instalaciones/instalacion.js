//Usuario

const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "../login.html";

//ID instalación

const params = new URLSearchParams(window.location.search);
const idParam = params.get("id");
const instalacion_id = idParam ? parseInt(idParam) : null;

//Cargar el nombre de la instalacion
async function cargarNombreInstalacion() {
    try{
        const res = await fetch(
           `${API_URL}/instalaciones`
        );

        const data = await res.json();

        if(!data.success) return;

        //Busco la instalacion actual
        const instalacion = data.data.find(
            i => i.id == instalacion_id
        );

        //Si no existe la instalacion
        if(!instalacion){
            document.getElementById("titulo")
                .innerText = "Instalación";
            return;
        }

        //Muestro el nombre de la instalacion
        document.getElementById("titulo")
            .innerText = 
            `Reserva de ${instalacion.nombre}`;
    }catch(error){
        console.error(error);
    }
}

// Validación ID
if (!instalacion_id) {

    console.error("ID inválido");

    window.location.href = "../index.html";
}

//Menu

function toggleMenu() {
    document.getElementById("menu").classList.toggle("hidden");
}

function toggleUserMenu() {
    document.getElementById("userSubmenu").classList.toggle("hidden");
}

//Cerrar menú al hacer click fuera
document.addEventListener("click", function (e) {
    const menu = document.getElementById("menu");
    const icon = document.querySelector(".menu-icon");

    if (!menu.contains(e.target) && !icon.contains(e.target)) {
        menu.classList.add("hidden");
    }
});


//Navegación

function irInstalacion(id) {
    window.location.href = `../instalaciones/instalacion.html?id=${id}`;
}
//Cargar instalaciones
async function cargarInstalaciones() {
    const contenedor = document.getElementById("listaInstalaciones");

    if(!contenedor) return;

    try{
        const res = await fetch(`${API_URL}/instalaciones`);

        const data = await res.json();

        if(!data.success) return;

        contenedor.innerHTML = "";
        
        data.data.forEach(instalacion =>{
            const btn = document.createElement("button");

            btn.innerText = instalacion.nombre;

            btn.onclick = () =>{
                irInstalacion(instalacion.id);
            };

            contenedor.appendChild(btn);
        });
    }catch(error){
        console.error(error);
    }
}
function irDatos() {
    window.location.href = "../datos.html";
}

function irInicio() {
    window.location.href = "../index.html";
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "../login.html";
}


//Modales info

function abrirNormas() {
    document.getElementById("modalInfoTitle").innerText = "Normas de reserva";

    document.getElementById("modalInfoText").innerHTML = `
        <h3>Tipo de calendario</h3>
        <p>Se muestra una semana completa de reservas por instalación.</p>
        
        <h3>Máximo de reservas por día</h3>
        <p>Solo se permite una reserva por usuario al día.</p>
        
        <h3>Máximo semanal</h3>
        <p>No puedes reservar el mismo turno más de una vez por semana.</p>
        
        <h3>Normas especiales</h3>
        <p><b>No está permitido el uso indebido de las instalaciones.</b></p>
    `;

    document.getElementById("modalInfo").classList.remove("hidden");
}

function abrirUso() {
    document.getElementById("modalInfoTitle").innerText = "Información de uso";

    document.getElementById("modalInfoText").innerHTML = `
        <h3>Leyenda de colores</h3>

        <div style="display:flex;align-items:center;margin:10px 0;">
            <div style="width:25px;height:25px;background:#4a90c2;margin-right:10px;"></div>
            <span>Disponible</span>
        </div>

        <div style="display:flex;align-items:center;margin:10px 0;">
            <div style="width:25px;height:25px;background:red;margin-right:10px;"></div>
            <span>Reservado</span>
        </div>

        <h3>Opciones</h3>
        <p>Haz clic en un turno libre para reservar.</p>
        <p>Las reservas son por instalación y horario.</p>
    `;

    document.getElementById("modalInfo").classList.remove("hidden");
}

//Cerrar modal info 
function cerrarModalInfo() {
    document.getElementById("modalInfo").classList.add("hidden");
}

//Hacer accesibles desde HTML
window.abrirNormas = abrirNormas;
window.abrirUso = abrirUso;
window.cerrarModalInfo = cerrarModalInfo;


//Variables modal reserva

let fechaSeleccionada = null;
let horaSeleccionada = null;


//Horas

function generarHoras() {

    //Club social
    if (instalacion_id === 1) {

        return [
            "10:00:00",
            "17:00:00"
        ];
    }

    //Resto de las instalaciones
    const horas = [];

    let hora = 10;
    let minuto = 30;

    while (hora < 22 || (hora === 22 && minuto === 30)) {

        const h = String(hora).padStart(2, "0");
        const m = String(minuto).padStart(2, "0");

        horas.push(`${h}:${m}:00`);

        minuto += 30;

        if (minuto >= 60) {
            hora += 1;
            minuto -= 60;
        }

        hora += 1;
    }

    return horas;
}

//Formatear horas
function formatearRangoHora(hora) {

    if (instalacion_id === 1) {
        if (hora === "10:00:00") return "10:00 - 16:00";
        if (hora === "17:00:00") return "17:00 - 23:00";
    }

    let [h, m] = hora.split(":").map(Number);

    let finHora = h;
    let finMin = m + 30;

    if (finMin >= 60) {
        finHora += 1;
        finMin -= 60;
    }

    finHora += 1;

    const inicio = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const fin = `${String(finHora).padStart(2, "0")}:${String(finMin).padStart(2, "0")}`;

    return `${inicio} - ${fin}`;
}

//Fechas

function generarFechas() {
    const fechas = [];
    const hoy = new Date();

    for (let i = 0; i < 7; i++) {
        const fecha = new Date();
        fecha.setDate(hoy.getDate() + i);

        fechas.push(fecha.toISOString().split("T")[0]);
    }

    return fechas;
}

function formatearFechas(fechaStr) {
    const fecha = new Date(fechaStr);

    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const diaSemana = dias[fecha.getDay()];
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");

    return `${diaSemana}\n${dia}/${mes}`;
}

//Calendario

async function cargarCalendario() {

    const fechas = generarFechas();
    const calendario = document.getElementById("calendario");

    calendario.innerHTML = "";

    //Cabecera
    const header = document.createElement("div");
    header.classList.add("tabla");

    const empty = document.createElement("div");
    empty.classList.add("celda");
    header.appendChild(empty);

    fechas.forEach(fecha => {
        const celda = document.createElement("div");
        celda.classList.add("celda");
        celda.innerText = formatearFechas(fecha);
        header.appendChild(celda);
    });

    calendario.appendChild(header);

    const horas = generarHoras();

    for (let hora of horas) {

        const fila = document.createElement("div");
        fila.classList.add("tabla");

        //Hora
        const celdaHora = document.createElement("div");
        celdaHora.classList.add("celda");
        celdaHora.innerText = formatearRangoHora(hora);
        fila.appendChild(celdaHora);

        for (let fecha of fechas) {

            const celda = document.createElement("div");
            celda.classList.add("celda");

            try {
                const res = await fetch(`${API_URL}/reservas?instalacion_id=${instalacion_id}&fecha=${fecha}`);
                const data = await res.json();

                if (!data.success) {
                    celda.innerText = "-";
                    fila.appendChild(celda);
                    continue;
                }

                const reservas = data.data || [];
                const ocupada = reservas.find(r => r.hora === hora);

                if (ocupada) {

                    if (ocupada.usuario_id === user.id_user) {
                        celda.classList.add("mia");
                        celda.innerText = "Tu reserva";
                    } else {
                        celda.classList.add("ocupado");
                        celda.innerText = "Reservado";
                    }

                } else {
                    celda.classList.add("libre");
                    celda.innerText = "Libre";
                    celda.addEventListener("click", () => abrirModal(fecha, hora));
                }

            } catch (error) {
                console.error(error);
                celda.innerText = "Error";
            }

            fila.appendChild(celda);
        }

        calendario.appendChild(fila);
    }
}

//Modal reserva

function abrirModal(fecha, hora) {

    fechaSeleccionada = fecha;
    horaSeleccionada = hora;

    document.getElementById("modalText").innerText =
        `¿Reservar el ${fecha} en el turno ${formatearRangoHora(hora)}?`;

    document.getElementById("modal").classList.remove("hidden");
}

function cerrarModal() {
    document.getElementById("modal").classList.add("hidden");
}

//Crear reserva

async function confirmarReservaFinal() {

    //Fecha y hora actual
    const ahora = new Date();

    //Partes fecha
    const [anio, mes, dia] = fechaSeleccionada.split("-");

    //Partes hora
    const [hora, minutos] = horaSeleccionada.split(":");

    //Crear fecha reserva
    const fechaReserva = new Date(
        Number(anio),
        Number(mes) - 1,
        Number(dia),
        Number(hora),
        Number(minutos)
    );

    console.log("AHORA:", ahora);
    console.log("RESERVA:", fechaReserva);

    //Validar la fecha 
    if (fechaReserva.getTime() <= ahora.getTime()) {

        alert("Ya ha pasado la hora disponible para realizar esta reserva.");

        return;
    }

    cerrarModal();

    try {

        const bodyData = {
        usuario_id: user.id_user,
        instalacion_id,
        fecha: fechaSeleccionada,
        hora: horaSeleccionada
        };


        const res = await fetch(
            `${API_URL}/reservas`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });

        const data = await res.json();

        alert(data.message);

        cargarCalendario();

    } catch (error) {

        console.error(error);
    }
}
//Inicio

cargarCalendario();



//Hacer funciones globales
window.confirmarReservaFinal = confirmarReservaFinal;
window.cerrarModal = cerrarModal;
console.log("INSTALACION JS CARGADO");
window.testReserva = function(){

    alert("FUNCION TEST OK");

    console.log("TEST OK");
}
window.toggleMenu = toggleMenu;

window.toggleUserMenu = toggleUserMenu;

window.irInicio = irInicio;

window.irInstalacion = irInstalacion;

window.irDatos = irDatos;

window.logout = logout;

window.confirmarReservaFinal =
    confirmarReservaFinal;

window.cerrarModal = cerrarModal;
cargarInstalaciones();
cargarNombreInstalacion();