import { db } from '../config/db';

//OBtener todas las instalaciones
//Esta función devuelve todas las instalaciones registradas en la base de datos
export const getInstalaciones = (): Promise<any> =>{
    //DEvuelvo un promise ya que db.query funciona con callbacks
    return new Promise((resolve) =>{
        //Consulta SQL para obtener todas las instalaciones
        db.query(
            'SELECT * FROM instalaciones',
            //Callback que se ejecuta cuando MySQL responde
            (error: any, results: any)=>{
                
                //Si ocurre un error en la consulta
                if (error){
                    console.error("ERROR MYSQL:", error);

                    //Respondo al frontend con error controlado
                    return resolve({
                        success: false,
                        message: "Error en servidor"
                    });
                }

                //Si todo funciona correctamente devuelvo los datos
                return resolve({
                    success: true,
                    data: results
                });
            }
        );
    });
};

//Crear una instalacion (Solo puede el admin)
export const createInstalacion = (body: any): Promise<any> =>{
    const {nombre} = body;

    return new Promise((resolve) =>{

        //Compruebo que el nombre de la instalación no esté vacío
        if(!nombre){
            return resolve({
                success: false,
                message: "El nombre de la instalación es obligatorio."
            });
        }

        //Introducción en la BD
        db.query(
            'INSERT INTO instalaciones (nombre) VALUES (?)',
            [nombre],

            (error:any) =>{

                if(error){
                    console.error("Error creando la instalación:", error);

                    return resolve({
                        success: false,
                        message: "Error al crear instalación"
                    });
                }

                return resolve({
                    success: true,
                    message: "Instalación creada con éxito"
                });
            }
        );
    });
};