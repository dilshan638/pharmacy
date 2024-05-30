var signupModel = require('../../models/signup');
var customerModel = require('../../models/customer');
var helpers = require('../helpers/common_functions');
var moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    add: async function (req, res) {
        try {
            if (!req.body.name || !req.body.user_id || !req.body.drugs_count || !req.body.quantity || !req.body.price) {
                return res.status(400).json({
                    error: "bad request",
                });
            }
            
            let find_user = await helpers.findOne(null, { id: req.body.user_id }, null, null, null, null, null, signupModel);
            if (!find_user) {
                return res.status(409).json({ status: "Not a valid identifier" })
            }
            //update
            if(req.body.id){
                req.body.updated_at = moment(Date.now()).format("YYYY-MM-DD");
                let data ={
                    updated_at:req.body.updated_at,
                    name:req.body.name,
                    drugs_count:req.body.drugs_count,
                    quantity:req.body.quantity,
                    price:req.body.price,
                    updated_user_id:req.body.user_id
              }
                let update = await customerModel.update(data, { where: {id:req.body.id} })
                return res.status(200).json({ status: "Customer Updated Successfully" })

            }

            //add
            if(!req.body.id){
                if (find_user.dataValues.role==2 ||find_user.dataValues.role==3 ) {
                    return res.status(409).json({ status: "Only owners have access to this feature." })
                }
                if (find_user.dataValues.role==1  ) {
                    req.body.status = true
                    req.body.updated_user_id=req.body.user_id
                    req.body.created_at = moment(Date.now()).format("YYYY-MM-DD");
                    req.body.updated_at = moment(Date.now()).format("YYYY-MM-DD");
                    req.body.access_role = find_user.dataValues.role
                    let savedata = await helpers.save(req.body, customerModel);
                    return res.status(200).json({ status: "Customer Added Successfully" })
                }
            }
           
            


        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    },
    view:async function(req,res){
        try{
         
         let customers = await helpers.findAll(null, {status:true}, null, null, null, null, null, customerModel)
         return res.status(200).json({customers:customers})
  
        }catch (error) {
               console.log(error)
               res.status(500).send({message:error})
           } 
    },
    softDelete: async function (req, res) {
        try {
            if (!req.body.id || !req.body.user_id ) {
                return res.status(400).json({
                    error: "bad request",
                });
            }
            
            let find_user = await helpers.findOne(null, { id: req.body.user_id }, null, null, null, null, null, signupModel);
            if (!find_user) {
                return res.status(409).json({ status: "Not a valid identifier" })
            }
            if (find_user.dataValues.role==3 ) {
                return res.status(409).json({ status: "Owners and Managers have access to this feature." })
            }
            if (find_user.dataValues.role==2 || find_user.dataValues.role==1 ) {
                let update = await customerModel.update({status:false}, { where: {id:req.body.id} })
                return res.status(200).json({ status: "Customer Soft Deleted Successfully" })
            }
             

        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    },
    hardDelete: async function (req, res) {
        try {
            if (!req.body.id || !req.body.user_id ) {
                return res.status(400).json({
                    error: "bad request",
                });
            }
            
            let find_user = await helpers.findOne(null, { id: req.body.user_id }, null, null, null, null, null, signupModel);
            if (!find_user) {
                return res.status(409).json({ status: "Not a valid identifier" })
            }
            if (find_user.dataValues.role==2 || find_user.dataValues.role==3  ) {
                return res.status(409).json({ status: "Only Owners  have access to this feature." })
            }
            if (find_user.dataValues.role==1 ) {
                let delete_customer =await helpers.delete(req.body.id, customerModel);
                return res.status(200).json({ status: "Customer Hard Deleted Successfully" })
            }
             

        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    },


}  

