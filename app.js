const express=require('express')
const expressLayouts=require('express-ejs-layouts');
const mongoose =require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport =require('passport');
require('dotenv').config();
//Passpart config
require('./config/passport')(passport);

const app=express();


//connect to Mongo
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology: true },)
    .then(()=>console.log('MongoDB connected'))
    .catch(err=>console.log(err));

//Ejs
app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({extended:false}));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

//connect flash
app.use(flash());

//Global Vars

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});


app.use(express.static('public'))
app.use('/css',express.static(__dirname+'public/css'));
app.use('/js',express.static(__dirname+'public/js'));
app.use('/img',express.static(__dirname+'public/img'));

//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))


const PORT=process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on ${PORT}`));