const mongoose = require('mongoose');
// const { List } = require('../schema');


class Task {
    static async getAll() {
        mongoose.connect('mongodb://localhost:27017/tasks', (err) => {
            if (err) throw err;
            // return {'11111' : '22222'}
          return List.find().then(() => { return {'11111' : '22222'} });
        })

    }
    static create(task) {
        // return new Promise((resolve, reject) => {
        //     pool.getConnection((err, connection) => {
        //         if(err) { throw err}
        //         connection.query('INSERT INTO `listTasks` (name) VALUES (?)', task, (err, result) => {
        //             if(err) { throw err}
        //             resolve(result);
        //             connection.release();
        //         });
        //     });
        // });
    }
    static update(id, task) {
    }
    static complete(id) {
        // return new Promise((resolve, reject) => {
        //     pool.getConnection((err, conn) => {
        //         if(err) reject(err);
        //         conn.query('UPDATE `listTasks` SET ready=true WHERE id=?', id, (err, result) => {
        //             if(err) reject(err);
        //             resolve(result);
        //             conn.release();
        //         })
        //     })
        // })
    }
    static delete(id) {
        // return new Promise((resolve, reject) => {
        //     pool.getConnection((err, conn) => {
        //         if(err) reject(err);
        //         conn.query('DELETE FROM `listTasks` WHERE id=?', id, (err, result) => {
        //             if(err) reject(err);
        //             resolve(result);
        //             conn.release();
        //         })
        //     })
        // })
    }
}

module.exports = Task;