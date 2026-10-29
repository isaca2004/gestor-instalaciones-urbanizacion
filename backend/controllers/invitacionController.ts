import { resolve } from "bun";
import { db } from "../config/db";

//Genero un token aleatorio
function generarToken(): string{

    return Math.random()
        .toString(36)
        .substring(2, 12)
        .toUpperCase();
}

//Creo la invitacion
export const crearInvitacion = (): Promise<any> =>{
    return new Promise((resolve) => {
        
        //Genero el token
        const token = generarToken();

        //Lo guardo en la BD
        db.query(
            "INSERT INTO invitaciones (token) VALUES (?)",

            [token],

            (error: any) =>{
                
                if(error){
                    console.error(
                        "Error creando la invitación:",
                        error
                    );

                    return resolve({
                        success:false,
                        message:
                            "Error creando invitación"
                    });
                }

                return resolve({
                    success:true,
                    token,
                    message:
                        "Invitación creada"
                });
            }
        );
    });
};

//Validar la invitacion
export const validarInvitacion = (token: string): Promise<any> =>{
    return new Promise((resolve)=>{

        db.query(
            `SELECT * FROM invitaciones
            WHERE token = ?
            AND usado = FALSE`,

            [token],

            (error: any, results: any) => {
                
                if(error){
                    console.error(error);

                    return resolve({
                        success:false
                    });
                }

                //Si el token NO existe
                if(results.length === 0){
                    return resolve({
                        success:false,

                        message:
                            "Invitación no válida"
                    });
                }

                //En caso de que SI exista
                return resolve({
                    success: true,

                    data: results[0]
                });
            }
        );
    });
};

//Marcar la invitacion del token como usada
export const usarInvitacion = (token: string): Promise<any> =>{
    return new Promise((resolve) => {

        db.query(
            `UPDATE invitaciones
            SET usado = TRUE
            WHERE token = ?`,

            [token],

            (error: any) => {
                if(error){
                    console.error(error);

                    return resolve({
                        success:false
                    });
                }

                return resolve({
                    success: true
                });
            }
        );
    });
};