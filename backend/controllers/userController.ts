import { db } from "../config/db";

//Obtengo todos los usuarios
export const getUsuarios = (): Promise<any> => {
    return new Promise((resolve) => {
        db.query(
            `SELECT id_user, username, rol
            FROM users
            ORDER BY id_user ASC`,

            (error: any, results: any) =>{
                if(error){
                    console.error(
                        "Error obteniendo usuarios:",
                        error
                    );

                    return resolve({
                        success: false,
                        message: "Error obteniendo usuarios"
                    });
                }

                return resolve({
                    success: true,
                    data: results
                });
            }
        );
    });
};

//Eliminar a un usuario
export const deleteUsuario = (
    id_user: number
): Promise<any> => {
    return new Promise((resolve) => {
        //Compruebo si el usuario que voy a eliminar existe
        db.query(
            `SELECT * FROM users
            WHERE id_user = ?`,

            [id_user],

            (error: any, results: any) =>{
                if(error){
                    console.error(error);

                    return resolve({
                        success: false,
                        message: "Error en servidor"
                    });
                }

                if(results.length === 0){
                    return resolve({
                        success: false,
                        message:"Usuario no encontrado"
                    });
                }

                const usuario = results[0];

                //A continuacion evito que se pueda eliminar el usuario con rol admin
                if(usuario.rol === "admin"){
                    return resolve({
                        success: false,
                        message:"No se puede eliminar un administrador"
                    });
                }

                //Eliminar usuario (con rol de vecino)
                db.query(
                    `DELETE FROM users
                    WHERE id_user = ?`,

                    [id_user],

                    (error:any) => {
                        if(error){
                            console.error(error);

                            return resolve({
                                success: false,
                                message: "Error eliminando usuario"
                            });
                        }

                        return resolve({
                            success: true,
                            message:"Usuario eliminado con exito"
                        });
                    }
                );
            }
        );
    });
};