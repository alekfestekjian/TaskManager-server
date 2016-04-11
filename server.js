// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var user = require('./models/user');
var task = require('./models/task');

var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
// mongodb://<dbuser>:<dbpassword>@ds011800.mlab.com:11800/mp4-server

mongoose.connect('mongodb://admin:password@ds021010.mlab.com:21010/mp4-server');
// mongoose.connect('mongodb://localhost:5000/mp4-server');
//
// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");

  // res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Nothing here. Go to /users or /tasks to play with the API.' ,data:[]});
});

/*
USERS ROUTING
*/
var userRoute = router.route('/users');

/*
GET
*/
userRoute.get(function(req, res,next) {
    var id = {};
    var fields = {};
    var sort = {};
    var skip = {};
    var limit = {};
    var count ={};
    var select = {};
    if(typeof(req.query.where) != "undefined"){
      id = JSON.parse(req.query.where);
    }
    if(typeof(req.query.fields) != "undefined"){
      fields = JSON.parse(req.query.fields);
    }
    if(typeof(req.query.sort) != "undefined"){
      sort = JSON.parse(req.query.sort);
    }
    if(typeof(req.query.skip) != "undefined"){
      skip = JSON.parse(req.query.skip);
    }
    if(typeof(req.query.limit) != "undefined"){
      limit = JSON.parse(req.query.limit);
    }
    if(typeof(req.query.select) != "undefined"){
      select = JSON.parse(req.query.select);
    }
    if(typeof(req.query.count) != "undefined"){
      count = JSON.parse(req.query.count);
    }

    var options = {
      "skip": skip,
      "limit": limit,
      "sort": sort,
      "select": select,
      "count": count
    };
    user.find(id,fields,options,function(err,users){

        if(err){
            res.status(404);
            res.send(err);
            return;
        }
        res.status(200);
        res.json({message: "OK",data:users});
    });
});

/*
POST
*/
userRoute.post(function(req, res,next) {
  var name = req.body.name;
  var email = req.body.email;
  if(!name || !email){
    res.status(500);
    res.json({message:"Validation Error: You are missing name or email",data:[]});
    return;
  }
  user.name = req.body.name;
  user.email = req.body.email;


  user.create(req.body,function(err,user) {
    if(err){
        res.status(500);
        res.json({message:"Email already exists",data:[]});
        return;
    }
    res.status(201);
    res.json({message: "User added",data:user});
  });
});
// Options
userRoute.options(function(req, res){
      res.writeHead(200);
      res.end();
});
// ------------------------


/*
USERS ID ROUTING
*/
var userIDRoute = router.route('/users/:id');
/*
GET
*/
userIDRoute.get(function(req, res,next){
  user.findById(req.params.id,function(err,users){
    if(err || users == null){
      res.status(404);
      res.send({message: "User not found",data: []});
      return;
    }
    res.json({message: "OK",data:users});
  });
});
/*
PUT
*/
userIDRoute.put(function(req, res,next) {
  user.findByIdAndUpdate(req.params.id,req.body,function(err,user) {
    if(err){
        res.status(500);
        res.json({message:"Email already exists",data:[]});
        return;
    }
    if(user == null){
        res.status(404);
        res.json({message:"User not found",data:[]});
        return;
    }
    if(user.name == "" || user.email == ""){
        res.status(500);
        res.json({message:"Validation Error: You are missing name or email",data:[]});
        return;
    }
    res.json({message: "User updated",data:user});
  });
});
/*
DELETE
*/
userIDRoute.delete(function(req, res,next) {
  user.findByIdAndRemove(req.params.id, function(err,user) {
     if(err || user == null){
       res.status(404);
       res.json({message:"User doesn't exist",data:[]});
       return;
     }
     res.json({message:  "User deleted",data:[] });
    });
});

/*
TASKS ROUTING
*/
var taskRoute = router.route('/tasks');
/*
TASK GET
*/
taskRoute.get(function(req, res,next) {
    var id = {};
    var fields = {};
    var sort = {};
    var skip = {};
    var limit = {};
    var count ={};
    var select = {};
    if(typeof(req.query.where) != "undefined"){
      id = JSON.parse(req.query.where);
    }
    if(typeof(req.query.fields) != "undefined"){
      fields = JSON.parse(req.query.fields);
    }
    if(typeof(req.query.sort) != "undefined"){
      sort = JSON.parse(req.query.sort);
    }
    if(typeof(req.query.skip) != "undefined"){
      skip = JSON.parse(req.query.skip);
    }
    if(typeof(req.query.limit) != "undefined"){
      limit = JSON.parse(req.query.limit);
    }
    if(typeof(req.query.select) != "undefined"){
      select = JSON.parse(req.query.select);
    }
    if(typeof(req.query.count) != "undefined"){
      count = JSON.parse(req.query.count);
    }


    var options = {
      "skip": skip,
      "limit": limit,
      "sort": sort,
      "select": select,
      "count": count
    };

    task.find(id,fields,options,function(err,tasks){

        if(err){
          res.send(err);
        }
        res.json({message: "OK",data:tasks});
        console.log("found tasks");
    });
});

/*
TASK POST
*/

taskRoute.post(function(req, res,next) {
  console.log(typeof(req.body.name) == "undefined");
  console.log(typeof(req.body.deadline) == "undefined");

  if(typeof(req.body.name) == "undefined" || typeof(req.body.deadline) == "undefined"){
    res.json({message:"You are missing name or deadline",data:[]});
    return;
  }
  task.name = req.body.name;
  task.deadline = req.body.deadline;


  task.create(req.body,function(err,task) {
     if(err){
       res.send(err);
     }
     console.log("creating");
     res.json({message: "OK",data:task});
  });
});
/*
TASK ID ROUTE
*/

var taskIDRoute = router.route('/tasks/:id');
/*
TASK ID GET
*/
taskIDRoute.get(function(req, res,next){

  task.findById(req.params.id,function(err,tasks){
    if(err || user == null){
      res.send(err);
    }
    res.json({message: "OK",data:tasks});
    console.log("found tasks");
  });
});
/*
TASK PUT
*/
taskIDRoute.put(function(req, res,next) {
  task.findByIdAndUpdate(req.params.id,req.body,function(err,task) {
     if(err || task == null){
       console.log("FAIL");
       res.status(404);
       res.send(err);
     }
     console.log("creating");
     res.json({message: "OK",data:task});
  });
});
/*
TASK DELETE
*/
taskIDRoute.delete(function(req, res,next) {
  task.findByIdAndRemove(req.params.id, function(err,task) {
     if(err || task == null){
       res.status(404);
       res.send(err);
     }
     res.json({message:  "task was deleted from database" });
    });
});

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
