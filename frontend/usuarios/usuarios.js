//Usuario logueado
const user = JSON.parse(localStorage.getItem("user"));

//Solo admin
if(!user || user.rol !== "admin"){
    window.location.href = "../index.html";
}

//Menu

function toggleMenu() {
    document.getElementById("menu")
        .classList.toggle("hidden");
}

function toggleUserMenu() {
    document.getElementById("userSubmenu")
        .classList.toggle("hidden");
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
function irInicio() {
    window.location.href = "../index.html";
}

function irDatos() {
    window.location.href = "../datos.html";
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "../login.html";
}

//Cargar instalaciones

async function cargarInstalaciones() {

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

        data.data.forEach(instalacion =>{

            const btn =
                document.createElement("button");

            btn.innerText = instalacion.nombre;

            btn.onclick = () =>{
                window.location.href =
                `../instalaciones/instalacion.html?id=${instalacion.id}`;
            };

            contenedor.appendChild(btn);
        });

    }catch(error){
        console.error(error);
    }
}

//Cargo a los usuarios

async function cargarUsuarios() {

    try{

        const res = await fetch(
            `${API_URL}/usuarios`
        );

        const data = await res.json();

        if(!data.success){

            alert("Error cargando usuarios");

            return;
        }

        const tbody =
            document.getElementById("usuariosBody");

        tbody.innerHTML = "";

        data.data.forEach(usuario =>{

            const fila =
                document.createElement("tr");

            fila.innerHTML = `
                <td>${usuario.id_user}</td>
                <td>${usuario.username}</td>
                <td>${usuario.rol}</td>
                <td>
                    ${
                        usuario.rol === "admin"
                        ? "-"
                        : `
                            <button
                                class="btn-eliminar"
                                onclick="eliminarUsuario(${usuario.id_user})">
                                Eliminar
                            </button>
                        `
                    }
                </td>
            `;

            tbody.appendChild(fila);
        });

    }catch(error){
        console.error(error);
    }
}

//Eliminar usuario

async function eliminarUsuario(id) {

    if(!confirm("¿Eliminar usuario?")){
        return;
    }

    try{

        const res = await fetch(
            `${API_URL}/usuarios/${id}`,
            {
                method:"DELETE"
            }
        );

        const data = await res.json();

        alert(data.message);

        cargarUsuarios();

    }catch(error){
        console.error(error);
    }
}

//Funciones globales

window.toggleMenu = toggleMenu;
window.toggleUserMenu = toggleUserMenu;
window.irInicio = irInicio;
window.irDatos = irDatos;
window.logout = logout;
window.eliminarUsuario = eliminarUsuario;

//Inicio

cargarInstalaciones();
cargarUsuarios();