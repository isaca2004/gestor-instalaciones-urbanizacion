import { resolve } from 'bun';
import {db} from '../config/db';

//Crear una reserva
export const createReserva = (body: any): Promise<any> =>{
    const {usuario_id, instalacion_id, fecha, hora} = body;

    return new Promise((resolve) =>{

        //Validación básica
        if(!usuario_id|| !instalacion_id|| !fecha|| !hora){
            return resolve({
                success: false,
                message: "Faltan datos obligatorios en la reserva."
            });
        }

        //Compruebo si ya existe una reserva para la misma instalacion, fecha y hora
        db.query(
            `SELECT * FROM reservas
            WHERE instalacion_id = ?
            AND fecha = ?
            AND hora = ?`,
            [instalacion_id, fecha, hora],

            (error:any, results: any)=>{
                if(error){
                    console.error("Error comprobando la reserva:", error);
                    return resolve({success: false});
                }

                //SI ya existe una reserva la bloqueamos
                if(results.length > 0){
                    return resolve({
                        success: false,
                        message: "Ya hay una reserva a esta hora para esta instalación"
                    });
                }

                //Introduzco la reserva en la BD
                db.query(
                    `INSERT INTO reservas
                    (usuario_id, instalacion_id, fecha, hora)
                    VALUES (?, ?, ?, ?)`,
                    [usuario_id, instalacion_id, fecha, hora],

                    (error: any) =>{
                        if(error){
                            console.error("Error creando reserva:", error);
                            return resolve({success: false});
                        }

                        return resolve({
                            success: true,
                            message: "Reserva creada con éxito."
                        });
                    }
                );
            }
        );
    });
};

//Obtengo las reservas segun instalacion y la fecha
export const getReservas = (instalacion_id: number, fecha: string): Promise<any> =>{

    return new Promise((resolve) =>{
        db.query(
            `SELECT * FROM reservas
            WHERE instalacion_id=?
            AND fecha= ?`,
            [instalacion_id, fecha],

            (error: any, results: any) =>{
                if(error){
                    console.error("Error obteniendo reservas:", error);
                    return resolve({success: false});
                }

                return resolve({
                    success: true,
                    data: results
                });
            }
        );
    });
    
};

//Eliminar reserva
export const deleteReserva = (reserva_id: number, usuario_id: number): Promise<any> =>{
    return new Promise((resolve) =>{
        //Obtengo el usuario para conocer si es administrador o usuario normal
        db.query(
            'SELECT rol FROM users WHERE id_user = ?',
            [usuario_id],

            (error:any, userResult: any) =>{
                if(error || userResult.length === 0){
                    return resolve({success: false, message: "Usuario no válido"});
                }

                const rol = userResult[0].rol;

                //Obtengo la reserva
                db.query(
                    'SELECT * FROM reservas WHERE id =?',
                    [reserva_id],

                    (error:any, reservaResult: any)=>{
                        if(error || reservaResult.length === 0){
                            return resolve({success:false, message: "La reserva que estás buscando no existe."});
                        }

                        const reserva = reservaResult[0];

                        //Validar permisos
                        //SI es admin puede borrar las reservas que quiera
                        if (rol === 'admin'){
                            eliminar();
                        }

                        //Si es usuario solo podra eliminar sus reservas
                        else if (reserva.usuario_id === Number(usuario_id)){
                            eliminar();
                        }

                        //No permitido
                        else{
                            return resolve({
                                success: false,
                                message: "No tienes permisos para eliminar esta reserva."
                            });
                        }

                        //Funcion de eliminar reservas
                        function eliminar(){
                            db.query(
                                'DELETE FROM reservas WHERE id = ?',
                                [reserva_id],

                                (error:any) =>{
                                    if(error){
                                        return resolve({success: false});
                                    }

                                    return resolve({
                                        success:true,
                                        message: "Reserva eliminada con éxito."
                                    });
                                }
                            );
                        }
                    }
                );
            }
        );
    });
};

//Usuario vea sus reservas
export const getReservasusuario = (user_id: number): Promise<any> =>{
    return new Promise((resolve) =>{
        db.query(
            `SELECT r.*, i.nombre AS instalacion
            FROM reservas r
            JOIN instalaciones i ON r.instalacion_id = i.id
            WHERE r.usuario_id = ?`,
            [user_id],

            (error, results) =>{
                if(error) return resolve({success: false});
                resolve({success:true, data: results});
            }
        );
    });
};

//Que el administrador pueda ver las reservas de todos los usuarios
export const getTodasReservas = (): Promise<any> =>{
    return new Promise((resolve) =>{
        db.query(
            `SELECT r.*, u.username, i.nombre AS instalacion
            FROM reservas r
            JOIN users u ON r.usuario_id = u.id_user
            JOIN instalaciones i ON r.instalacion_id = i.id`,

            (error, results) =>{
                if(error) return resolve({success:false});
                resolve({success:true, data:results});
            }
        );
    });
};