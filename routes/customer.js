var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
require('dotenv').config()
var customerController = require('../controllers/customer/customer'); 

router.use(function (req, res, next) { 

    let accessTokenFromClient;
    if (req.headers.authorization) {
        if (req.headers.authorization.split(' ')[0] === 'Bearer') {
            accessTokenFromClient = req.headers.authorization.split(' ')[1]
        } else {
            accessTokenFromClient = req.headers.authorization
        }
    }
    if (!accessTokenFromClient){
        return res.status(401).send({ success: 0, message: "Authorization Token missing from header" ,code: 401});
    } 
    jwt.verify(accessTokenFromClient,process.env.SECRETKEY,(error,response)=>{
        if(error){
           return res.status(403).json({ verified:false, message:'invalid token'})
         }
         
        next();
     })
});
//All Customers
router.get('/', customerController.view);
// Add Customer
router.post('/add', customerController.add);
//Soft Delete Customer
router.post('/soft-delete', customerController.softDelete);
//Hard Delete Customer
router.post('/hard-delete', customerController.hardDelete);

   

module.exports = router;
