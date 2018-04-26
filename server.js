const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');

const { List, User } = require('./models');
// const User = {
//   username : 'yegor',
//   passport : 'hamhamham'
// };

mongoose.connect('mongodb://localhost:27017/tasks', (err) => {
  if (err) throw err;
  console.log('Подключились');
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser());
//
app.use((req, res, next) => {
  console.log('req.body', req.body);
  next();
});
//

const session = require('cookie-session');
app.use(session({ keys : ['secret'] }));

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, "public")));

// ------ подключение passport

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy((username, password, done) => {
  console.log('username', username);
  console.log('password', password);
  // .select('_id username fullname')
  // .lean() -- преобразует объект монгодб в обычный объект js

  User.findOne({ username }).lean().then(user => {
    if (user && user.password === password) {
      console.log('user.username from passport', user);
      delete user.password;
      console.log('user.password from passport', user);
      done(null, user);
    } else {
      done(null, false);
    }
  });

}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    delete user.password;
    done(null, user);
  })
});

const authHandler = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
});

app.post('/login', authHandler);
app.get('/login', (req, res) => {
  res.render('authForm');
});

const mustBeAuthenticated = (req, res, next) => {
  if ( req.isAuthenticated() ) {
    next()
  } else {
    res.redirect('/login');
  }
};

app.all('/', mustBeAuthenticated);
app.all('/todo', mustBeAuthenticated);
app.all('/todo/*', mustBeAuthenticated);

// app.get('/logout', (req, res) => {
//   req.logout();
//   res.send('LOGOUT OK');
//   // res.redirect('/');
// });

app.get('/logout', (req, res) => {
  req.logout();
  // res.send('LOGOUT OK');
  res.redirect('/');
});

// ------ конец подключения passport

app.get('/', async (req, res) => {
  await List.find().lean().then(result => {
    console.log('result', result);
    const nnnnn = req.user;
    console.log('nnnnn',nnnnn);
    // console.log('req.user.username', user.username);
    req.data = { list : result, user : req.user };
    console.log('req.data', req.data);
    res.render('tasks', req.data)
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


app.listen(8888);