const express = require('express');
const app = express();
const chalk = require('chalk');
const path = require('path');
const ejs = require('ejs');
const { Guest, Table, Group } = require('./db');

app.use(require('body-parser').json());
app.engine('html', ejs.renderFile);

module.exports = app;

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next)=> res.render(path.join(__dirname, 'index.html'), {
  accessToken: process.env.accessToken
}));


app.get('/api/groups', async(req, res, next)=> {
  try {
    res.send(await Group.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/tables', async(req, res, next)=> {
  try {
    res.send(await Table.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/tables/:group', async(req, res, next)=> {
  try {
    res.send(await Table.findAll({
      where: {
        group: req.params.group
      }
    }))
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/guests', async(req, res, next)=> {
  try {
    res.send(await Guest.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/guests/:group', async(req, res, next)=> {
  try {
    res.send(await Guest.findAll({
      where: {
        group: req.params.group
      }
    }));
  }
  catch(ex){
    next(ex);
  }
});


// app.post('/api/users/:userId/reservations', async(req, res, next)=> {
//   try {
//     res.status(201).send(await Reservation.create({ userId: req.params.userId, restaurantId: req.body.restaurantId}));
//   }
//   catch(ex){
//     next(ex);
//   }
// });

// app.delete('/api/reservations/:id', async(req, res, next)=> {
//   try {
//     const reservation = await Reservation.findByPk(req.params.id);
//     await reservation.destroy();
//     res.sendStatus(204);
//   }
//   catch(ex){
//     next(ex);
//   }
// });

app.use((err, req, res, next)=> {
  console.log(chalk.red(err.stack));
  res.status(500).send({ error: err.message });
});
