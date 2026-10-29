//Usuario
const user = JSON.parse(localStorage.getItem("user"));

if(!user){
    window.location.href= "login.html";
}

//Muestro el nombre del usuario
document.getElementById("username").innerText = user.username;

//Menú
function toggleMenu(){
    document.getElementById("menu").classList.toggle("hidden");
}

//Navegacion
function irInicio(){
    window.location.href = "index.html";
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

function irInstalacion(id){
    window.location.href=`instalacion.html?id=${id}`;
}

function logout(){
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

//Para cambiar la contraseña
async function cambiarContrasena() {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const repeatPassword = document.getElementById("repeatPassword").value;

    if(!oldPassword || !newPassword || !repeatPassword){
        alert("Por favor, completa todos los campos.");
        return;
    }

    if(newPassword !== repeatPassword){
        alert("Las contraseñas no coinciden.");
        return;
    }
    try{
        const res = await fetch(`${API_URL}/change-password`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user.id_user,
                oldPassword,
                newPassword
            })
        });

        const data = await res.json();

        alert(data.message);
    }catch(error){
        console.error(error);
    }
}

//Hacer funciones globales
window.cambiarContrasena = cambiarContrasena;
window.toggleMenu = toggleMenu;

window.irInicio = irInicio;

window.irInstalacion = irInstalacion;

window.logout = logout;

window.cambiarContrasena =
    cambiarContrasena;
cargarInstalaciones();