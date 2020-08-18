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
        highScore:req.user.highScore,
        highScorecpp:req.user.highScorecpp
    })
    
})
router.post('/api',ensureAuthenticated,(req,res)=>{
    res.json({
        status:'success'
    });
    let score=req.body.score;
    let cppbasic=req.body.cppbasic;
    let email=req.user.email;
    console.log(email);
    User.findOne({email:email})
        .then(user=>{
            if(cppbasic===0){
                if(user.highScore<score){
                    user.highScore=score
                }
                if(user.score.length>=30){
                    user.score.shift();
                }
                user.score.push(score);
                user.save()
                    .then(user=>console.log(user))
                    .catch(res.status(500).send())
            }else{
                if(user.highScorecpp<score){
                    user.highScorecpp=score
                }
                if(user.scorecpp.length>=30){
                    user.scorecpp.shift();
                }
                user.scorecpp.push(score);
                user.save()
                    .then(user=>console.log(user))
                    .catch(res.status(500).send())
            }
        })
        .catch(err=>console.log(err));
})

router.get('/score',(req,res)=>{
    res.json({
        status:'success',
        score:req.user.score,
        scorecpp:req.user.scorecpp
    });
})

module.exports=router;

