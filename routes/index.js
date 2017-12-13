var express = require('express');
var router = express.Router();
var expressSession = require('express-session');
var request = require('request');
var mongoose = require('mongoose');

var users = require('../controllers/users_controller');
var Task = mongoose.model('Task');

console.log("before / Route");
router.get('/', function (req, res) {
  console.log("/ Route");
  //    console.log(req);
  console.log(req.session);
  if (req.session.user) {
    console.log("/ Route if user");
    res.render('index', {
      username: req.session.username
    });
  } else {
    console.log("/ Route else user");
    req.session.msg = 'Access denied!';
    res.redirect('/login');
  }
});
router.get('/user', function (req, res) {
  console.log("/user Route");
  if (req.session.user) {
    res.render('user', { msg: req.session.msg });
  } else {
    req.session.msg = 'Access denied!';
    res.redirect('/login');
  }
});
router.get('/signup', function (req, res) {
  console.log("/signup Route");
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('signup', { msg: req.session.msg });
});
router.get('/login', function (req, res) {
  console.log("/login Route");
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('login', { msg: req.session.msg });
});
router.get('/logout', function (req, res) {
  console.log("/logout Route");
  req.session.destroy(function () {
    res.redirect('/login');
  });
});

router.get('/index', function (req, res, next) {
  Task.find(function (err, taskList) {
      if (err) { return next(err); }
      res.json(taskList);
  });
});

router.post('/index', function (req, res, next) {
  var task = new Task(req.body);
  task.save(function (err, task) {
      if (err) { return next(err); }
      res.json(task);
  });
});

router.param('task', function (req, res, next, id) {
  console.log("In param function");
  var query = Task.findById(id);
  console.log("query: ", query);
  query.exec(function (err, task) {
      if (err) { return next(err); }
      if (!task) { return next(new Error("can't find task")); }
      req.task = task;
      return next();
  });
});

router.get('/index/:task', function (req, res) {
  console.log("In get: ", req.task);
  res.json(req.task);
});

router.delete('/index/:task', function (req, res) {
  console.log("In Delete");
  console.log(req.task);
  req.task.remove();
  res.sendStatus(200);
});

router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);


module.exports = router;