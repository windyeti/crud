const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');


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
    req.list = result;
    res.render('tasks', req)
  })
});

app.post('/tasks', async (req, res) => {
  const { nameTask } = req.body;
  await new List({ name : nameTask, ready : false }).save();
  // res.redirect('/');
  res.send({"ok" : "ok"});
});
app.put('/complete', async (req, res) => {
  const { value } = req.body;
  await List.update( { _id : value }, { $set : { ready : true } });
  // res.redirect('/');
  res.send({'response' : 'пометил выполненым'});
});
app.delete('/delete', async (req, res) => {
    const { value } = req.body;
    await List.remove({ _id : value });
    res.send({'response' : 'удалил'});
});


app.listen(8989);