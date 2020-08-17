const express=require('express');

const router=express.Router();
const bcrypt=require('bcryptjs')
const passport =require('passport');
//User model
const User =require('../models/User');


//Login page
router.get('/login',(req,res)=>res.render('login'));

//Register Page
router.get('/register',(req,res)=>res.render('register'));

router.post('/register',(req,res)=>{
    const{name,email,password,password2}=req.body;
    let errors=[];

    //Check required fields
    if(!name || !email ||!password || !password2){
        errors.push({msg:'Please fill in all fields'});
    }

    //check passwords match
    if(password!== password2){
        errors.push({msg:'Passwords do not match'});
    }

    //check pass length

    if(password.length <6){
        errors.push({msg:'Password Should be at least 6 characters'});
    }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        //Validation passed
        User.findOne({email:email})
            .then(user=>{
                if(user){
                    //User exits
                    errors.push({msg:'Email is already registered'});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }else{
                    const newUser=new User({
                        name,
                        email,
                        password
                    })
                    
                    //Hash password
                    bcrypt.genSalt(10,(err,salt)=>
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err)throw err;
                            //setpassword to hashed
                            newUser.password=hash;
                            newUser.save()
                                .then(user=>{
                                    req.flash('success_msg','You are now registed and can log in ');
                                    res.redirect('/users/login')
                                })
                                .catch(err=>console.log(err));
                    }))
                }
            });
    }
})

//Login Handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
})

//Logout Hanle
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})




// Need to change this if needed
router.use(express.static('public'))
router.use('/css',express.static(__dirname+'public/css'));
router.use('/js',express.static(__dirname+'public/js'));
router.use('/img',express.static(__dirname+'public/img'));

module.exports=router;