const mysql = require('mysql');

const pool = mysql.createPool({
    host : 'localhost',
    port : '3307',
    database : 'crud',
    user : 'root',
    password : 'root'
});

class Task {
    static async getAll() {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err) {
                    reject(err)
                }
                connection.query('SELECT * FROM `listTasks` WHERE 1', (err, rows) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(rows);
                    connection.release();
                });
            });
        });
    }
    static create(task) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err) { throw err}
                connection.query('INSERT INTO `listTasks` (name) VALUES (?)', task, (err, result) => {
                    if(err) { throw err}
                    resolve(result);
                    // console.log('result id:', result.insertId);
                    connection.release();
                });
            });
        });
    }
    static update(id, task) {
    }
    static complete(id) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if(err) reject(err);
                conn.query('UPDATE `listTasks` SET ready=true WHERE id=?', id, (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                    conn.release();
                })
            })
        })
    }
    static delete(id) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if(err) reject(err);
                conn.query('DELETE FROM `listTasks` WHERE id=?', id, (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                    conn.release();
                })
            })
        })
    }
}

module.exports = Task;