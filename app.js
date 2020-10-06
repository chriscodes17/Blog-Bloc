const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParse = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
require('dotenv').config();

//express setup
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParse.urlencoded({ extended: true }));

//models
const Blog = require('./models/blog');
const User = require('./models/user');
const Comment = require('./models/comment');
const user = require('./models/user');

//mongoose setup
// mongoose.set("useNewUrlParser", true);
// mongoose.set("useFindAndModify", false);
// mongoose.set("useCreateIndex", true);
// mongoose.set("useUnifiedTopology", true);
// mongoose.connect("mongodb://localhost/blog_bloc");

//mongoAtlas config
mongoose.connect('mongodb+srv://dbBlog:p2d6p1vR7oboaclj@blog-bloc.egnn2.mongodb.net/Blog-Bloc?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

//Passport and Auth configs
app.use(require('express-session')({
    secret: 'coding is fun',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//current user data
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//Routes
app.use(require('./routes/blogs'));
app.use(require('./routes/comments'));
app.use(require('./routes/authentication'));

//Port Config
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

