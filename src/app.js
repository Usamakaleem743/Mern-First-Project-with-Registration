const express =require('express');
const app=express();
const path=require('path');
const hbs=require('hbs');
// const session = require('express-session');
require('./db/connection')
const bcrypt=require('bcryptjs');
const Register=require('./models/registerschema');

// const staticpath=path.join(__dirname,'./public');
const partialspath=path.join(__dirname,'./templates/partials');
app.use(express.static(path.join(__dirname,'./public')));
const templatepath=path.join(__dirname,'./templates/views');

app.set('view engine','hbs');
app.set('views',templatepath);
hbs.registerPartials(partialspath);

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/register',(req,res)=>{
    res.render('register')
});

app.post('/register',async(req,res)=>{
    try {
        const password=req.body.password;
        const cpassword=req.body.cpassword;
        if(password===cpassword){
            const registeremployee= new Register({
                username:req.body.username,
                email:req.body.email,
                phone:req.body.phone,
                password:password,
                cpassword:cpassword
            });
        await registeremployee.generateauthtoken();
        
        const registered=await registeremployee.save();
        console.log(`${req.body.username} : Registered Successfully.`)
        res.status(200).render('index');
        }
        else{
            res.status(400).send("Password & Confirm Password are not matched ! Please Try Again");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/login',(req,res)=>{
    res.render('login')
});

app.post('/login',async (req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const useremail=await Register.findOne({email:email});
        const isMatch=await bcrypt.compare(password,useremail.password);
        await useremail.generateauthtoken();
        // console.log('The Auth Token IS : ' + token)
        if(isMatch){
           res.status(200).render('index');
           console.log(` ${useremail.username} : Login Successfully`);
        }
        else{
            res.status(404).send('Invalid User or Password')
        }

    } catch (e) {
        res.status(400).send(e);
    }
});

const port=process.env.PORT || 3000;
app.listen(port,()=>{
      console.log(`This Project is nunning on Port : ${port}`)
});