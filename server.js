// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();

//Check validator
const flash = require('express-flash');
app.use(flash());

//Session
var session = require('express-session');
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))

// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');

//Create Database by MongoDB and use mongoose for connect express to mongodb

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quotingdojo');

var QuoteSchema = new mongoose.Schema({
    name: { type: String, required: 'Your name must be longer than 2 characters', trim: true, minlength: 2},
    quote: { type: String, required: 'Quote must be longer than 10 characters', trim: true, minlength: 10 },
},{ timestamps: true })

mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'User'

// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function (req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('index');
})
// Add User Request 
app.post('/btquote', function (req, res) {
    console.log("POST DATA", req.body);
    // This is where we would add the user from req.body to the database.
    var newquote = new Quote({name: req.body.name, quote: req.body.quotetxt});

    newquote.save(function(err){
        if(err){
            // if there is an error upon saving, use console.log to see what is in the err object 
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for(var key in err.errors){
                req.flash('addquote', err.errors[key].message);
            }
            // redirect the user to an appropriate route
            res.redirect('/');
        }
        else {
            res.redirect('/quotes');
        }
    });
})

app.get('/quotes', function (req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    Quote.find({}, function(err, allquotes) {
        // Retrieve an array of users
        if(err){
            console.log(err);
        }
        else{
            res.render('quotes', {quotes: allquotes});
        }
        // This code will run when the DB is done attempting to retrieve all matching records to {}
       })
})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function () {
    console.log("listening on port 8000");
})