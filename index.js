const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const handlebars = require('handlebars');
const path = require('path');

const { Task } = require('./models');
// const data = Task.getAll();
// data.then((result) => {
//     console.log('result',result)
// },
//     (err) => {
//     console.log('err', err)
//     })
const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
// app.use((req, res) => {
//     res.redirect(req.get('/'));
// });

// app.get('/', (req, res) => {
//     res.send('Упс!!! Наш заголовок!!!');
// });

app.get('/', (req, res) => {
    const tasks = Task.getAll();
    tasks.then(
        (data) => {
            let newArray = [];
            for(let i = 0; data.length > i; i++ ) {
                newArray.push(data[i]);
            }
            req.list = newArray;
            res.render('tasks', req);
        }
    );
});

app.post('/tasks', async (req, res) => {
    const { nameTask } = req.body;
    await Task.create(nameTask);
    res.send({"ok" : "ok"});
});
app.put('/complete', async (req, res) => {
    // console.log('put=>req.boby', req.body);
    await Task.complete(req.body.value);
    res.send({'response' : 'пометил выполненым'});
});
app.delete('/delete', async (req, res) => {
    // console.log('put=>req.boby', req.body);
    await Task.delete(req.body.value);
    res.send({'response' : 'удалил'});
});


app.listen(8989);