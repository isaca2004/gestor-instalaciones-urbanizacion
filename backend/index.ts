import { loginUser, changePassword } from "./controllers/loginController";
import { registerUser } from "./controllers/registerController";
import { getInstalaciones, createInstalacion } from "./controllers/instalacionController";
import { createReserva, getReservas, deleteReserva, getReservasusuario, getTodasReservas } from "./controllers/reservaController";
import { crearInvitacion, validarInvitacion, usarInvitacion } from "./controllers/invitacionController";
import { getUsuarios, deleteUsuario } from "./controllers/userController";
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

console.log("Backend Urbaniza iniciado en puerto 3000");
//Inicio del servidor backend con Bun
Bun.serve({
    hostname: "0.0.0.0",
    port: 3000,

    async fetch(req) {

        
        if (req.method === "OPTIONS") {
            return new Response("OK", { headers: corsHeaders });
        }

        const url = new URL(req.url);

        //Login
        if (req.method === 'POST' && url.pathname === '/login') {
            try {
                const body = await req.json();
                const res = await loginUser(body);

                return new Response(JSON.stringify(res), {
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                });

            } catch {
                return new Response(JSON.stringify({
                    success: false,
                    message: "Error en login"
                }), {
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                });
            }
        }

        //Register
        if (req.method === 'POST' && url.pathname === '/register') {
            const body = await req.json();
            const res = await registerUser(body);

            return new Response(JSON.stringify(res), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        //Instalaciones
        if (req.method === 'GET' && url.pathname === '/instalaciones') {
            const res = await getInstalaciones();

            return new Response(JSON.stringify(res), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        if (req.method === 'POST' && url.pathname === '/instalaciones') {
            const body = await req.json();
            const res = await createInstalacion(body);

            return new Response(JSON.stringify(res), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        //Obtener instalaciones
        if(req.method === "GET" && url.pathname === "/instalaciones"){
            const res = await getInstalaciones();

            return new Response(JSON.stringify(res), {
                headers:{
                    "Content-Type":"application/json",
                    ...corsHeaders
                }
            });
        }

       //Reservas del usuario
        if (req.method === 'GET' && url.pathname === '/reservas-usuario') {
            const user_id = url.searchParams.get('user_id');

            const res = await getReservasusuario(Number(user_id));

            return new Response(JSON.stringify(res), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        //Todas las reservas (ADMIN)
        if (req.method === 'GET' && url.pathname === '/reservas-admin') {
            const res = await getTodasReservas();

            return new Response(JSON.stringify(res), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }
        //Obtener todos los usuarios (ADMIN)
        if(req.method === "GET" && url.pathname === "/usuarios"){
            const res = await getUsuarios();

            return new Response(
                JSON.stringify(res),
                {
                    headers:{
                        "Content-Type":"application/json",
                        ...corsHeaders
                    }
                }
            );
        }

        //Obtener reservas por instalacion
        if (req.method === 'GET' && url.pathname === '/reservas') {
            const instalacion_id = url.searchParams.get('instalacion_id');
            const fecha = url.searchParams.get('fecha');

            const res = await getReservas(Number(instalacion_id), fecha!);

            return new Response(JSON.stringify(res), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        //Crear reserva
        if (req.method === 'POST' && url.pathname === '/reservas') {
            const body = await req.json();
            const res = await createReserva(body);

            return new Response(JSON.stringify(res), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        //Eliminar reserva
        if (req.method === 'DELETE' && url.pathname.startsWith('/reservas/')) {
            const id = url.pathname.split('/').pop();
            const body = await req.json();

            const res = await deleteReserva(Number(id), Number(body.usuario_id));

            return new Response(JSON.stringify(res), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        //Cambiar contraseña
        if (req.method === 'POST' && url.pathname === '/change-password') {
            const body = await req.json();

            //Comprueba que la contraseña actual sea la correcta
            const res = await changePassword(
                body.user_id,
                body.oldPassword,
                //Actualizo la contraseña del usuario
                body.newPassword
            );

            return new Response(JSON.stringify(res), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        //Crear invitacion al usuario
        if(req.method === "POST" && url.pathname === "/crear-invitacion"){
            const res = await crearInvitacion();

            return new Response(
                JSON.stringify(res),
                {
                    headers: {
                        "Content-Type":
                            "application/json",
                        
                        ...corsHeaders
                    }
                }
            );
        }

        //Validar la invitacion
        if(req.method === "GET" && url.pathname === "/validar-invitacion"){
            const token = url.searchParams.get("token");

            const res = await validarInvitacion(
                token || ""
            );

            return new Response(
                JSON.stringify(res),
                {
                    headers: {
                        "Content-Type":
                            "application/json",
                        
                        ...corsHeaders
                    }
                }
            );
        }

        //Eliminar a un usuario (ADMIN)
        if(
            req.method === "DELETE" &&
            url.pathname.startsWith("/usuarios/")
        ){
            const id = url.pathname.split("/").pop();

            const res = await deleteUsuario(Number(id));

            return new Response(
                JSON.stringify(res),
                {
                    headers:{
                        "Content-Type":"application/json",
                        ...corsHeaders
                    }
                }
            );
        }
        
        // 404
        return new Response(JSON.stringify({
            success: false,
            message: "Ruta no encontrada"
        }), {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
});