//Usuario
const user = JSON.parse(localStorage.getItem("user"));

//SOLO Admin
if(!user || user.rol !== "admin"){
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
    window.location.href = `../instalaciones/instalacion.html?id=${id}`;
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

//Crear la invitacion para el usuario
async function crearInvitacion() {
    
    try{
        const res = await fetch(
            `${API_URL}/crear-invitacion`,

            {
                method: "POST"
            }
        );

        const data = await res.json();

        if(!data.success){
            alert("Error creando la invitación");

            return;
        }

        //Enlace
        const enlace = `${window.location.origin}/frontend/register.html?token=${data.token}`;

        const resultado = document.getElementById("resultado");

        resultado.innerHTML = `
            <div class="resultado-invitacion">
                <h2>Invitación creada</h2>
                <div class="enlace-box">
                    ${enlace}
                </div>

                <div class="qr-container">
                    <canvas id="qr"></canvas>
                </div>

                <button class="btn-copiar"
                    onclick="copiarEnlace('${enlace}')">
                    
                    Copiar enlace
                </button>
            </div>
        `;

        //Crear el QR
        QRCode.toCanvas(
            document.getElementById("qr"),

            enlace
        );
    }catch(error){
        console.error(error);
    }
}

//Copiar el enlace
function copiarEnlace(enlace){
    navigator.clipboard.writeText(enlace);

    alert("Enlace copiado");
}



//Funciones globales
window.toggleMenu = toggleMenu;
window.irInicio = irInicio;
window.irInstalacion = irInstalacion;
window.logout = logout;
window.crearInvitacion = crearInvitacion;
window.copiarEnlace = copiarEnlace;

//Inicio
cargarInstalaciones();