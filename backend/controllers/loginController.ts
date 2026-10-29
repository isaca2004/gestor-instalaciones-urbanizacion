import { db } from '../config/db';


//Login del usuario

export const loginUser = (body: any): Promise<any> => {

    const { username, password } = body;

    return new Promise((resolve) => {

        //Consulta SQL
        db.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password],

            (error, results) => {

                //Error de la BD
                if (error) {
                    console.error("Error en login:", error);
                    return resolve({
                        success: false,
                        message: "Error en servidor"
                    });
                }

                //El usuario no existe
                if ((results as any).length === 0) {
                    return resolve({
                        success: false,
                        message: "Credenciales incorrectas"
                    });
                }

                //Login OK
                return resolve({
                    success: true,
                    user: (results as any)[0]
                });
            }
        );
    });
};
export const changePassword = (user_id: number, oldPassword: string, newPassword: string): Promise<any> => {

    return new Promise((resolve) => {

        // comprobar contraseña actual
        db.query(
            'SELECT * FROM users WHERE id_user = ? AND password = ?',
            [user_id, oldPassword],

            (error: any, results: any) => {

                if (error) {
                    return resolve({ success: false, message: "Error en servidor" });
                }

                if (results.length === 0) {
                    return resolve({ success: false, message: "Contraseña actual incorrecta" });
                }

                // actualizar contraseña
                db.query(
                    'UPDATE users SET password = ? WHERE id_user = ?',
                    [newPassword, user_id],

                    (error: any) => {

                        if (error) {
                            return resolve({ success: false, message: "Error actualizando contraseña" });
                        }

                        return resolve({
                            success: true,
                            message: "Contraseña actualizada correctamente"
                        });
                    }
                );
            }
        );
    });
};