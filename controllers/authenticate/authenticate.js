var signupModel = require('../../models/signup');
var helpers = require('../helpers/common_functions');
var  moment = require('moment');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
dotenv.config();
module.exports = {
    signUp : async function(req,res){
        try{
           if(!req.body.username || !req.body.email || !req.body.role || !req.body.first_name || !req.body.last_name || !req.body.address || !req.body.phone_number || !req.body.password ){
                return res.status(400).json({
                    error: "bad request",
                });
            }
            let find_user_email =await helpers.findOne(null, {email:req.body.email}, null, null, null, null, null, signupModel);
            let find_user_username =await helpers.findOne(null, {username:req.body.username}, null, null, null, null, null, signupModel);
            let find_user_phone_number =await helpers.findOne(null, {phone_number:req.body.phone_number}, null, null, null, null, null, signupModel);
          
            if(find_user_email){
                return res.status(409).json({status:"This email already exists"})
            }
            if(find_user_username){
                return res.status(409).json({status:"This username already exists"})
            }
            if(find_user_phone_number){
                return res.status(409).json({status:"This phone number already exists"})
            }
            if(req.body.role==0 ||req.body.role>3){
                return res.status(409).json({status:"The specified user does not have a valid role"})
            }
                //password operation
                let encrypted_password =bcryptjs.hashSync(req.body.password.trim(),10);
                req.body.password = encrypted_password
                req.body.created_at=moment(Date.now()).format("YYYY-MM-DD");
                req.body.updated_at=moment(Date.now()).format("YYYY-MM-DD");
                 //Generate JWT
                 const userInfoUsername={
                    email: req.body.email,
                }
                let token=  await jwt.sign(userInfoUsername, process.env.SECRETKEY,{
                    expiresIn:'1h' //15m
                }) 
               
                let savedata = await helpers.save(req.body, signupModel);
                let data={
                    username:req.body.username,
                    email:req.body.email,
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    address:req.body.address,
                    phone_number:req.body.phone_number,
                    token:token,
                    user_id:savedata.dataValues.id
                }
                //send email
                const transporter = nodemailer.createTransport({
                    service: process.env.SERVICE,
                    auth: {
                        user:  process.env.USER_EMAIL,
                        pass:  process.env.PASSWORD_EMAIL,
                    },
                  });
                     
                  var html = fs.readFileSync(path.join(__dirname, '../../public/templates') + '/registration.html', 'utf8');
                  contents2 = await html.replace("{{name}}", data.first_name +' '+ data.last_name );
                  contents2 = await contents2.replace("{{username}}", data.username);
                  contents2 = await contents2.replace("{{phone_number}}", data.phone_number);
                  contents2 = await contents2.replace("{{date}}", req.body.created_at);
                  
                  // Define the email options
                  const mailOptions = {
                    from:  process.env.USER_EMAIL,
                    to:   req.body.email,
                    subject: 'Registration Details ',
                    html: contents2,
                  };
                  
                  // Send the email
                  transporter.sendMail(mailOptions,  (error, info) => {
                    if (error) {
                      console.log('Error occurred:');
                      console.log(error.message);
                    } else {
                      console.log('Email sent successfully!');
                      return res.status(200).json({status:"Registration Successfully",data:data})
                    }
                  });
              
         
        }catch (error) {
             console.log(error)
             res.status(500).send({message:error})
         } 
     },
     signIn : async function(req,res){
        try{
            if(!req.body.username || !req.body.password){
                return res.status(400).json({
                    error: "bad request",
                });
            }
            let find_user_username =await helpers.findOne(null, {username:req.body.username}, null, null, null, null, null, signupModel);
            let find_user_email =await helpers.findOne(null, {email:req.body.username}, null, null, null, null, null, signupModel);

            if((find_user_username==null) && (find_user_email==null)){
                return res.status(403).json({status:"Incorrect Username Or Password"})
             }
            if(find_user_username!=null){
                if(!bcryptjs.compareSync(req.body.password,find_user_username.dataValues.password)){
                    return res.status(403).json({status:"Incorrect Username Or Password"})
                  }
                if(bcryptjs.compareSync(req.body.password,find_user_username.dataValues.password)){
                    //Generate JWT
                    const userInfoUsername={
                        email: find_user_username.dataValues.email,
                    }
                 let token=  await jwt.sign(userInfoUsername, process.env.SECRETKEY,{
                        expiresIn:'1h' //15m
                    }) 
                    var data ={
                        username:find_user_username.dataValues.username,
                        email:find_user_username.dataValues.email,
                        first_name:find_user_username.dataValues.first_name,
                        last_name:find_user_username.dataValues.last_name,
                        address:find_user_username.dataValues.address,
                        phone_number:find_user_username.dataValues.phone_number,
                        token:token,
                        user_id:find_user_username.dataValues.id
                    }
                return res.status(200).json({status:"Login Successfully",data:data})
                }
             }

             if(find_user_email!=null){
                if(!bcryptjs.compareSync(req.body.password,find_user_email.dataValues.password)){
                    return res.status(403).json({status:"Incorrect Username Or Password"})
                  }
                if(bcryptjs.compareSync(req.body.password,find_user_email.dataValues.password)){
                    //Generate JWT
                    const userInfoEmail={
                        email: find_user_email.dataValues.email,
                    }
                 let token=  await jwt.sign(userInfoEmail, process.env.SECRETKEY,{
                        expiresIn:'1h' //15m
                    }) 
                    var data ={
                        username:find_user_email.dataValues.username,
                        email:find_user_email.dataValues.email,
                        first_name:find_user_email.dataValues.first_name,
                        last_name:find_user_email.dataValues.last_name,
                        address:find_user_email.dataValues.address,
                        phone_number:find_user_email.dataValues.phone_number,
                        token:token,
                        user_id:find_user_email.dataValues.id
                    }
                    return res.status(200).json({status:"Login Successfully",data:data})
                }
             }


           
        }catch (error) {
            console.log(error)
            res.status(500).send({message:error})
        } 
     },
     
}  
