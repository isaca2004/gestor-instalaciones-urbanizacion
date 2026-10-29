//Usuario
// Obtener usuario guardado
const user = JSON.parse(localStorage.getItem("user"));

// Solo administrador
if(!user || user.rol !== "admin"){
    window.location.href = "../index.html";
}
//Menu
// Abrir/cerrar menú hamburguesa
function toggleMenu(){
    document.getElementById("menu").classList.toggle("hidden");
}
// Cerrar menú al hacer click fuera
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
// Ir al inicio
function irInicio(){
    window.location.href = "../index.html";
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
//Ir a instalación
function irInstalacion(id){
    window.location.href = `../instalaciones/instalacion.html?id=${id}`;
}

//Cerrar sesión
function logout(){
    localStorage.removeItem("user");
    window.location.href = "../login.html";
}


//Crear instalacion
async function crearInstalacion(){

    //Obtener nombre
    const nombre = document.getElementById("nombre").value;

    try{

        //Petición backend
        const res = await fetch(`${API_URL}/instalaciones`, {

            method: "POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({
                nombre
            })
        });

        //Convertir respuesta
        const data = await res.json();

        //Mostrar mensaje
        alert(data.message);

    }catch(error){

        console.error(error);
    }
}


//Funciones globales

window.toggleMenu = toggleMenu;
window.irInicio = irInicio;
window.irInstalacion = irInstalacion;
window.logout = logout;
cargarInstalaciones();