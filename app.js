const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user.js');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb://localhost/CRUD";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) //this return promise
  .then((result) =>{ console.log("Database-connected");})
  //after db connected than it will listen to port3000
  .catch(err => console.log(err)); //else errors will be shown
const PORT = 3001;
  app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  });
// register view engine
app.set('view engine', 'ejs');
 
// middleware & static files
app.use(express.static('public')); //this will helps to use style.css file
app.use(express.urlencoded({ extended: true })); //this will helps to get submitted data of form in req.body obj





//users i.e index route
app.get('/users',(req,res)=>{
  console.log("req made on"+req.url);
   User.find().sort({createdAt:-1})//it will find all data and show it in descending order
    .then(result => { 
      res.render('index', { users: result ,title: 'Home' }); //it will then render index page along with users
    })
    .catch(err => {
      console.log(err);
    });
})

//about route
app.get('/about',(req,res)=>{
  console.log("req made on"+req.url);
  res.render('about',{title:'About'});
})





//route for edit/name/action variable that will display current value to input field
app.get('/edit/:name/:action',(req,res)=>{
  const name = req.params.name;
  console.log("req made on"+req.url);
  User.findOne({name:name})
    .then(result => {
      res.render('edit', { user: result ,title: 'Edit-User' });
    })
    .catch(err => {
      console.log(err);
    });
})

//submitting data routes
//route for user create
app.get('/user/create',(req,res)=>{
  console.log("GET req made on"+req.url);
  res.render('adduser',{title:'Add-User'});
})
app.post('/user/create', (req, res) => {
  // Parse the form data including subject and teacher
  const { name, email, password, address, number, subject, teacher} = req.body;

  // Create a new user with the data
  const user = new User({ name, email, password, address, number, subject, teacher });

  // Save the user to the database
  user.save()
    .then(result => {
      res.redirect('/users');
    })
    .catch(err => {
      console.log(err);
    });
});

// home routes
app.get('/', (req, res) => {
  res.redirect('/users'); //this will redirect page to /users
});


//route for users/withvar
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(result => {
      res.render('details', { user: result, action:'edit',title: 'User Details' });
    })
    .catch(err => {
      console.log(err);
    });
});


//route for updating users data
app.post('/edit/:id',(req,res)=>{
  console.log("POST req made on"+req.url);
  User.updateOne({_id:req.params.id},req.body) //then updating that user whose id is get from url 
                                               //first passing id which user is to be updated than passing update info
    .then(result => {
      res.redirect('/users');//is success save this will redirect to home page
      console.log("Users profile Updated");
    })
    .catch(err => { //if data not saved error showed
      console.log(err);
    });

})


//routes for deleting users by getting users name from url then finding that  users then doing delete
app.post('/users/:name',(req,res)=>{ //form action of details.ejs pass name of user that later is assume as name
  const name = req.params.name;
  console.log(name);
  User.deleteOne({name:name})
  .then(result => {
    res.redirect('/users');
  })
  .catch(err => {
    console.log(err);
  });
})


//teacher
// Add a route to display the students for the current teacher
app.get('/teacher/:teacher', (req, res) => {
  const name = req.params.name;

  // Find all students with this teacher's name
  User.find({ teacher: name })
    .then(students => {
      res.render('teacher', { students });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/teacher', (req, res) => {
  res.render('teacher', { title: 'Teacher Login' });
});

app.post('/teacher', (req, res) => {
  const teacher = req.body.teacher; // Assuming the input field name is 'teacherName'

  if (teacher) {
    res.redirect(`/teacher/${teacher}`);
  } else {
     //not
  }
});




//404 errors routes
//this will auto run incase no routes
//Note: must put this route at last route list
app.use((req,res)=>{
  console.log("req made on"+req.url);
  res.render('404',{title:'NotFound'});
})


/*
// Add a route to display the students for the current teacher
app.get('/teacher', (req, res) => {
  const teacherName = req.params.teacherName;

  // Find all students with this teacher's name
  User.find({ teacher: teacher })
    .then(students => {
      res.render('teacher-students', { students, teacherName });
    })
    .catch(err => {
      console.log(err);
    });
});

*/


