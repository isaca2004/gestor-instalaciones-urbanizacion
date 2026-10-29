async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/login`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const text = await res.text(); 

    try {
        const data = JSON.parse(text);

        if(!data.success){
            alert("Credenciales incorrectas");
            return;
        }
        console.log(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html";

    } catch (error) {
        console.error("❌ Respuesta no es JSON:", text);
        alert("Error en el servidor");
    }
}