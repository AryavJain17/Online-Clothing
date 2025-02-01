const express = require("express");
const router = express.Router();
require("../db/conn");
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");




router.get("/", (req,res)=>{
    res.send("Hello server router page");
})

router.post("/register",async (req,res)=>{
   const { name, email, phone, password, cpassword} = req.body;

   if( !name || !email || !phone || !password || !cpassword){
    return res.status(422).json({error:"plz fill all fields properly"})
   }

   try {
    const userExist = await User.findOne({email});
    if(userExist){
        res.status(422).json({error:"User already exist"});
    }else if(password != cpassword){
        res.status(422).json({error:"passwords are not matching"});
    }else{
    const user = new User({name, email, phone, password, cpassword});
   const userRegistered =  await user.save();
   console.log(`${user} registered successfully`);
console.log(userRegistered);
    res.status(201).json({message:"user registered successfully!"})}
   } catch (error) {
    console.log(error)
   }
})


//login router
router.post("/signin", async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({error: "plz fill all the details"});
        }
        const userLogin = await User.findOne({email});
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+ 25892000000),
                httpOnly:true
            })

            if(!isMatch){
                res.status(400).json({message:"Invalid details"});
            }else{
                res.json({message:"user logged in successfully"})
            }
        }else{
            res.status( 400).json({message:"Invalid details"});
        }
        
        // console.log(userLogin);
        
    } catch (error) {
        console.log(error)
    }

})

router.post("/contactus",authenticate, async(req,res)=>{
    try {
        const {name,email,phone,message}=req.body;
        if(!name || !email || !phone || !message){
            console.log("Error in contact formm");
            return res.json({
                error:"Plz fill contact form"
            })
        }

        const userContact = await User.findOne({_id:req.userId});
        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message);
            await userContact.save();
            res.status(201).json({message:"User Contact Successful"})
        }
    } catch (error) {
        console.log(error);
    }
})



router.get("/logoutb",authenticate, (req,res)=>{
    console.log("Logout Page");
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send("userLogout");
})



module.exports = router;