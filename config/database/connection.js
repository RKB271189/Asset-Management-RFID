const config = require('../database/database');
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'adminmacchi1234',
    database: 'relcon_tag_scanner'
});
async function execute_data(query, post) {
    let data = {
        result: false,
        records: '',
        fields: '',
        error: ''
    };
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (errorconnection, connection) {
            if (errorconnection) {
                console.log(errorconnection);
                connection.release();
                reject(errorconnection);
            }
            connection.release();
            connection.query(query, post, function (error, detail) {
                if (error) {
                    reject(error.sqlMessage)
                } else {
                    data.result = true;
                    data.records = detail;
                    resolve(data);
                }
            });
        });
    }).catch(function (error) {
        console.log(error);
        data.error = error;
        return data;
    });;
}
async function fetch_data(query) {
    let data = {
        result: false,
        records: '',
        fields: '',
        error: ''
    };
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (errorconnection, connection) {
            if (errorconnection) {
                console.log(errorconnection);
                connection.release();
                reject(errorconnection);
            } else {
                connection.release();
                connection.query(query, function (error, records, fields) {
                    if (error) {
                        reject(error.sqlMessage);
                    } else {
                        data.records = records;
                        data.fields = fields;
                        data.result = true;
                        data.error = '';
                        resolve(data);
                    }
                });
            }
        });

    }).catch(function (error) {
        console.log(error);
        data.error = error;
        return data;
    });
}
async function create_database() {

}
module.exports = {
    fetch_data,
    execute_data
};