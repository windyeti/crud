const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
// const handlebars = require('handlebars');
const path = require('path');
const mongoose = require('mongoose');


// const { Task } = require('./models');
const { List } = require('./models');

mongoose.connect('mongodb://localhost:27017/tasks', (err) => {
  if (err) throw err;
  console.log('Подключились');
});

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());


app.get('/', async (req, res) => {
  await List.find().then(result => {
    console.log('result', result);
    res.render('tasks', result)
  })
});

// app.post('/tasks', async (req, res) => {
//     const { nameTask } = req.body;
//     await Task.create(nameTask);
//     res.send({"ok" : "ok"});
// });
// app.put('/complete', async (req, res) => {
//     await Task.complete(req.body.value);
//     res.send({'response' : 'пометил выполненым'});
// });
// app.delete('/delete', async (req, res) => {
//     await Task.delete(req.body.value);
//     res.send({'response' : 'удалил'});
// });


app.listen(8989);