import { db } from "../config/db";
import { usarInvitacion } from "./invitacionController";

//Registrar al usuario

export const registerUser = (body: any): Promise<any> => {

    return new Promise((resolve) => {

        //Datos
        const {
            bloque,
            escalera,
            piso,
            letra,
            password,
            token
        } = body;

        //Validar
        if(
            !bloque ||
            !escalera ||
            !piso ||
            !letra ||
            !password ||
            !token
        ){

            return resolve({
                success: false,
                message: "Faltan datos"
            });
        }

        //Formateo la escalera
        const escaleraFormateada =
            String(escalera).padStart(2, "0");

        //Genero el nombre del usuario según los datos que haya introducido de la vivienda
        const username =`${bloque.toUpperCase()}${escaleraFormateada}PISO${piso}${letra.toUpperCase()}`;

        //El rol por defecto será de usuario normal
        const rol = "vecino";

        //Insert
        db.query(

            `INSERT INTO users
            (username, password, rol)

            VALUES (?, ?, ?)`,

            [
                username,
                password,
                rol
            ],

            (error: any) => {

                if(error){

                    console.log(error);

                    return resolve({

                        success: false,

                        message:
                            "Error creando usuario"
                    });
                }

                //Marco la invitacion del admin como que ya ha sido usada
                console.log("TOKEN RECIBIDO", token);
                usarInvitacion(token);

                resolve({

                    success: true,

                    message:"Usuario creado correctamente"
                });
            }
        );
    });
};