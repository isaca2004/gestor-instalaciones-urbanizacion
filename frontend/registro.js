//Token URL
const params = new URLSearchParams(window.location.search);

const token = params.get("token");

//Valido la invitacion
async function validarToken() {
    try{
        const res = await fetch(
            `${API_URL}/validar-invitacion?token=${token}`
        );

        const data = await res.json();

        //Token NO valido
        if(!data.success){
            document.getElementById("estado")
                .innerText = "Invitación no válida";
            return;
        }

        //Token valido
        document.getElementById("estado")
            .innerText = "Invitación válida";
        
        document.getElementById("formulario")
            .classList.remove("hidden");
    }catch(error){
        console.error(error);
    }
}

//Registro
async function registrarse() {
    const bloque = document.getElementById("bloque").value;
    const escalera = document.getElementById("escalera").value;
    const piso = document.getElementById("piso").value;
    const letra = document.getElementById("letra").value;
    const password = document.getElementById("password").value;

    //Compruebo que los valores de la escalera y el piso sean numeros
    if(isNaN(Number(escalera)) || isNaN(Number(piso))){
        alert("La escalera y el piso solo pueden ser números. No pueden ser letras.");
        return;
    }

    try{
        const res = await fetch(
            `${API_URL}/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    bloque,
                    escalera,
                    piso,
                    letra,
                    password,
                    token
                })
            }
        );

        const data = await res.json();

        if(!data.success){
            alert(data.message);
            return;
        }

        alert("Cuenta creada con éxito");

        //Login
        window.location.href = "login.html";
    }catch(error){
        console.error(error);
    }
}

//Inicio
validarToken();