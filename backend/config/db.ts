import mysql from 'mysql';

//Creo conexion con la base de datos
export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'urbanizacion_db'
});

//Conectamos
db.connect((err)=>{
    if(err){
        console.error("Error conectando a la BD:", err);
    }else{
        console.log("Conectando a MySQL");
    }
});