const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mysql = require('mysql');
const dotenv = require("dotenv");

dotenv.config();
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

connection.connect(function(err) {

    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
        console.log('Conexión exitosa con el ID: ' + connection.threadId);
});

app.get('/api/menus', (req, res) => {

    connection.query('SELECT * FROM menu', function (error, results) {

        if (error){
            console.log('Error en la consulta: ' + error);
            res.send({mensaje: 'Error en la consulta'});
        } else {
            console.log('Consulta exitosa');
            res.send(results);
        }    
    });
});

app.post('/api/nuevoMenu', (req, res) => {

    let {primerPlato, postre, segundoPlato, precio} = req.body;

    const sql = `INSERT INTO menu (primerPlato, postre, segundoPlato, precio) VALUES ('${primerPlato}', '${postre}' , '${segundoPlato}' , ${precio})`;

    connection.query(sql, function (error, results) {

        if (error){
            console.log('Error en la consulta: ' + error);
            res.send({mensaje: 'Error en la consulta'});
        } else {
            console.log('Consulta exitosa');
            res.send(results);
        }    
    });
});

app.put('/api/editarMenu/:id', (req, res) => {

    let {primerPlato, postre, segundoPlato, precio} = req.body;

    let id = req.params.id;

    const sql = "UPDATE menu SET primerPlato = ?, postre = ?, segundoPlato = ?, precio = ? WHERE id = ?;";

    connection.query(sql,[primerPlato, postre, segundoPlato, precio, id], function (error, results) {

        if (error){
            console.log('Error en la consulta: ' + error);
            res.send({mensaje: 'Error en la consulta'});
        } else {
            console.log('Consulta exitosa');
            res.send(results);
        }    
    });
});

app.delete('/api/borrarMenu', (req, res) => {

    let {id} = req.body;

    connection.query("DELETE FROM menu WHERE id = ?",[id], function (error, results) {

        if (error){
            console.log('Error en la consulta: ' + error);
            res.send({mensaje: 'Error en la consulta'});
        } else {
            console.log('Consulta exitosa');
            console.log(id);
            res.send(results);
        }    
    });
});


app.listen(port || 3000, (e) =>{
    e
    ? console.log(`Error en servidor: ${e}`)
    : console.log("Servidor andando!");
});