//Usuario

const user = JSON.parse(localStorage.getItem("user"));

// Solo administrador
if(!user || user.rol !== "admin"){
    window.location.href = "../index.html";
}


//Menu

//Abrir/cerrar menú
function toggleMenu(){

    document.getElementById("menu")
        .classList.toggle("hidden");
}

//Cerrar menú lateral
document.addEventListener("click", function(e){

    const menu = document.getElementById("menu");

    const icon = document.querySelector(".menu-icon");

    if(
        menu &&
        icon &&
        !menu.contains(e.target) &&
        !icon.contains(e.target)
    ){
        menu.classList.add("hidden");
    }
});


//Navegacion

//Ir al inicio
function irInicio(){

    window.location.href = "../index.html";
}

//Ir a instalación (segun su id)
function irInstalacion(id){

    window.location.href =
        `../instalaciones/instalacion.html?id=${id}`;
}

//Cerrar sesión
function logout(){

    localStorage.removeItem("user");

    window.location.href = "../login.html";
}

//Cargar instalaciones

async function cargarInstalaciones(){

    const contenedor =
        document.getElementById("listaInstalaciones");

    if(!contenedor) return;

    try{

        const res = await fetch(
            `${API_URL}/instalaciones`
        );

        const data = await res.json();

        if(!data.success) return;

        contenedor.innerHTML = "";

        data.data.forEach(instalacion => {

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

//Cargar reservas

async function cargarReservas() {

    try{

        const res = await fetch(
            `${API_URL}/reservas-admin`
        );

        const data = await res.json();

        if(!data.success){

            console.error(data);

            return;
        }

        mostrarReservas(data.data);

    }catch(error){

        console.error(error);
    }
}

//Mostrar las reservas de los vecinos

function mostrarReservas(reservas){

    const contenedor =
        document.getElementById("listaReservas");

    contenedor.innerHTML = "";

    const ahora = new Date();

    //Que solo puedan hacer reservas en un futuro (No cuando haya pasado la hora de dicho dia)
    reservas = reservas.filter(r => {

        const fecha = new Date(r.fecha);

        const [hora, minutos] =
            r.hora.split(":");

        fecha.setHours(Number(hora));
        fecha.setMinutes(Number(minutos));
        fecha.setSeconds(0);

        return fecha.getTime() >= ahora.getTime();
    });

    //Sin reservas
    if(reservas.length === 0){

        contenedor.innerHTML =
            "<p>No hay reservas activas.</p>";

        return;
    }

    //Pintar reservas
    reservas.forEach(r => {

        const div = document.createElement("div");

        div.classList.add("reserva");

        const fecha = new Date(r.fecha)
            .toLocaleDateString("es-ES");

        div.innerHTML = `
            <div>

                <b>${r.instalacion}</b><br>

                ${fecha} - ${r.hora}<br>

                <small>
                    Usuario: ${r.username}
                </small>

            </div>

            <button class="btn-delete"
                onclick="eliminarReserva(${r.id})">

                Cancelar

            </button>
        `;

        contenedor.appendChild(div);
    });
}

//Eliminar reserva

async function eliminarReserva(id) {

    if(!confirm("¿Eliminar reserva?")) return;

    try{

        const res = await fetch(

            `${API_URL}/reservas/${id}`,

            {
                method: "DELETE",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    usuario_id: user.id_user
                })
            }
        );

        const data = await res.json();

        alert(data.message);

        cargarReservas();

    }catch(error){

        console.error(error);
    }
}


//Funciones globales

window.toggleMenu = toggleMenu;

window.irInicio = irInicio;

window.irInstalacion = irInstalacion;

window.logout = logout;

window.eliminarReserva = eliminarReserva;

//Inicio

cargarReservas();

cargarInstalaciones();