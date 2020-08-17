const express=require('express');

const router=express.Router();

//User model
const User =require('../models/User');

const {ensureAuthenticated}=require('../config/auth')

router.get('/',(req,res)=>{
    let logged,name;
    if(req.isAuthenticated()){
        logged='logged in';
        name=req.user.name;
    }
    res.render('main',{
        logged,
        name:name
    })
});
router.use(express.json({limit:'1mb'}))

//Dashboard
router.get('/scoreboard',ensureAuthenticated,(req,res)=>{
    res.render('scoreboard',{
        name:req.user.name,
        score:req.user.score,
        highScore:req.user.highScore
    })
    
})
router.post('/api',ensureAuthenticated,(req,res)=>{
    res.json({
        status:'success'
    });
    let score=req.body.score;
    let email=req.user.email;
    console.log(email);
    User.findOne({email:email})
        .then(user=>{
            if(user.highScore<score){
                user.highScore=score
            }
            if(user.score.length>=30){
                user.score.shift();
            }
            user.score.push(score);
            console.log(user);
            user.save()
                .then(user=>console.log(user))
                .catch(res.status(500).send())
        })
        .catch(err=>console.log(err));
})

router.get('/score',(req,res)=>{
    res.json({
        status:'success',
        score:req.user.score
    });
})

module.exports=router;

