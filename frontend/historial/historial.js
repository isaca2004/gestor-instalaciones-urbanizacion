//Usuario
const user = JSON.parse(localStorage.getItem("user"));

//Solo usuarios normales (No admin)
if(!user|| user.rol === "admin"){
    window.location.href = "../index.html";
}

//Menu
function toggleMenu(){
    document.getElementById("menu")
        .classList.toggle("hidden");
}

//Cerrar menu
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
function irInicio(){
    window.location.href = "../index.html";
}
function irInstalacion(id){
    window.location.href= `../instalaciones/instalacion.html?id=${id}`;
}
function logout(){
    localStorage.removeItem("user");

    window.location.href = "../login.html";
}

//Cargar las instalaciones
async function cargarInstalaciones() {
    const contenedor = document.getElementById("listaInstalaciones");

    if(!contenedor) return;

    try{
        const res = await fetch(
            `${API_URL}/instalaciones`
        );

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

//Cargar historial
async function cargarHistorial() {
    try{
        const res = await fetch(`${API_URL}/reservas-usuario?user_id=${user.id_user}`);

        const data = await res.json();

        if(!data.success){
            console.error(data);

            return;
        }
        mostrarHistorial(data.data);
    }catch(error){
        console.error(error);
    }
}

//Mostrar el historial
function mostrarHistorial(reservas){
    const contenedor = document.getElementById("listaReservas");

    contenedor.innerHTML = "";

    if(reservas.length === 0){
        contenedor.innerHTML = "<p>No tienes reservas.</p>";

        return;
    }

    reservas.forEach(r =>{
        const div = document.createElement("div");

        div.classList.add("reserva");

        const fecha = new Date(r.fecha).toLocaleDateString("es-ES");

        div.innerHTML = `
            <b>${r.instalacion}</b><br>
            ${fecha} - ${r.hora}
            `;
            contenedor.appendChild(div);
    });
}

//Funciones globales
window.toggleMenu = toggleMenu;

window.irInicio = irInicio;

window.irInstalacion = irInstalacion;

window.logout = logout;

//Inicio
cargarInstalaciones();
cargarHistorial();