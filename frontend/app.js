//Usuario

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

console.log("Usuario:", user);


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

    if (
        menu &&
        icon &&
        !menu.contains(e.target) &&
        !icon.contains(e.target)
    ) {
        menu.classList.add("hidden");
    }
});


//Navegacion

function irInstalacion(id) {
    window.location.href = `instalaciones/instalacion.html?id=${id}`;
}

function irDatos() {
    window.location.href = "datos.html";
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

//Cargar las instalaciones
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


//Boton mis reservas


document.addEventListener("DOMContentLoaded", () => {

    const btnReservas = document.getElementById("btnReservas");

    if(btnReservas){

        btnReservas.addEventListener("click", () => {
            window.location.href = "misreservas/misreservas.html";
        });
    }
});

//Boton secundario

document.addEventListener("DOMContentLoaded", () => {

    const titulo = document.getElementById("tituloSecundario");
    const boton = document.getElementById("btnSecundario");

    if(!titulo || !boton) return;

    //Panel de control (ADMIN)
    if(user.rol === "admin"){

        document.getElementById("btnReservas")
            ?.classList.add("hidden");

        titulo.innerText = "Panel de control";

        boton.addEventListener("click", () => {
            window.location.href = "panelcontrol/panelcontrol.html";
        });

        //Mostrar el boton de invitaciones
        document.getElementById("btnInvitaciones")
            ?.classList.remove("hidden");

        const btnInv = document.getElementById("btnInvitaciones");

        if(btnInv){
            btnInv.addEventListener("click", () =>{
                window.location.href = "invitaciones/invitaciones.html";
            });
        }
    }

    //Usuario vecino
    else{

        titulo.innerText = "Historial";

        boton.addEventListener("click", () => {
            window.location.href = "historial/historial.html";
        });
    }
});

//Tarjetas de crear usuario e instalaciones (SOLO ADMIN)
document.addEventListener("DOMContentLoaded", () =>{
    if(user.rol !== "admin") return;

    const panel = document.getElementById("panelCards");

    if(!panel) return;

    //Crear instalacion
    const cardInstalacion = document.createElement("div");

    cardInstalacion.classList.add("card");

    cardInstalacion.innerHTML = `
        <h2>Crear instalación</h2>
    `;

    cardInstalacion.addEventListener("click", ()=>{
        window.location.href = "crearinstalacion/crearinstalacion.html";
    });

    panel.appendChild(cardInstalacion);

    //Gestionar usuarios
    const cardUsuarios = document.createElement("div");

    cardUsuarios.classList.add("card");

    cardUsuarios.innerHTML = `
        <h2>Gestionar usuarios</h2>
    `;
    cardUsuarios.addEventListener("click", () =>{
        window.location.href = "usuarios/usuarios.html";
    });

    panel.appendChild(cardUsuarios);
});




//Hacer funciones globales

window.toggleMenu = toggleMenu;
window.toggleUserMenu = toggleUserMenu;
window.irInstalacion = irInstalacion;
window.irDatos = irDatos;
window.logout = logout;
cargarInstalaciones();