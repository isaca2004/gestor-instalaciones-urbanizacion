//Usuario
const user = JSON.parse(localStorage.getItem("user"));

if(!user){
    window.location.href="../login.html";
}

//Menu
function toggleMenu(){
    document.getElementById("menu").classList.toggle("hidden");
}

function toggleUserMenu(){
    document.getElementById("userSubmenu").classList.toggle("hidden");
}

//Para cerrar el menu lateral
document.addEventListener("click", function(e){
    const menu = document.getElementById("menu");
    const icon = document.querySelector(".menu-icon");

    if(!menu.contains(e.target) && !icon.contains(e.target)){
        menu.classList.add("hidden");
    }
});

//navegacion
function irInicio(){
    window.location.href = "../index.html";
}

function irInstalacion(id){
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

function irDatos(){
    window.location.href = "../datos.html";
}

function logout(){
    localStorage.removeItem("user");
    window.location.href = "../login.html";
}

//Cargar las reservas del usuario
async function cargarReservas() {
    try{
        let url = "";

        //Admin
        if(user.rol === "admin"){
            url = `${API_URL}/reservas-admin`;
        }

        //Usuario normal
        else{
            url = `${API_URL}/reservas-usuario?user_id=${user.id_user}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if(!data.success){
            console.error("Error backend:", data);
            return;
        }

        mostrarReservas(data.data);
    }catch(error){
        console.error("Error cargando reservas:", error);
    }
}

//Mostrar reservas
function mostrarReservas(reservas){

    const contenedor = document.getElementById("listaReservas");

    contenedor.innerHTML = "";

    const ahora = new Date();

    //SOLO reservas futuras
    reservas = reservas.filter(r => {

        const fechaReserva = new Date(r.fecha);

        return fechaReserva >= ahora;
    });

    if(reservas.length === 0){
        contenedor.innerHTML = "<p>No tienes reservas pendientes.</p>";
        return;
    }

    reservas.forEach(r =>{

        const div = document.createElement("div");

        div.classList.add("reserva");

        //Formatear fecha
        const fechaFormateada = new Date(r.fecha)
            .toLocaleDateString("es-ES");

        div.innerHTML = `
            <div>
                <b>${r.instalacion || "Instalación"}</b><br>

                ${fechaFormateada} - ${r.hora}

                ${user.rol === "admin"
                    ? `<br><small>Usuario: ${r.username}</small>`
                    : ""}
            </div>

            <div>
                <button class="btn-delete"
                    onclick="eliminarReserva(${r.id})">
                    Cancelar
                </button>
            </div>
        `;

        contenedor.appendChild(div);
    });
}

//Eliminar una reserva
async function eliminarReserva(id) {
    if(!confirm("¿Eliminar reserva?")) return;

    try{
        const res = await fetch(`${API_URL}/reservas/${id}`, {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario_id: user.id_user
            })
        });

        const data = await res.json();

        alert(data.message);

        cargarReservas();
    }catch(error){
        console.error("Error eliminando:", error);
    }
}

//Lo hago accesible desde el html
window.eliminarReserva = eliminarReserva;

//Fuerzo que el menu lateral este cerrado
document.addEventListener("DOMContentLoaded", () =>{
    document.getElementById("menu")?.classList.add("hidden");
});
window.toggleMenu = toggleMenu;

window.irInicio = irInicio;

window.irInstalacion = irInstalacion;

window.irDatos = irDatos;

window.logout = logout;

window.eliminarReserva = eliminarReserva;
//Inicio
document.addEventListener("DOMContentLoaded", () =>{
    cargarReservas();
});

cargarInstalaciones();