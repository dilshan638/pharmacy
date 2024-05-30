var signupModel = require('../../models/signup');
var inventoryModel = require('../../models/inventory');
var helpers = require('../helpers/common_functions');
var moment = require('moment');
const dotenv = require('dotenv');

dotenv.config();
module.exports = {
    add: async function (req, res) {
        try {
            if (!req.body.inventory_id || !req.body.user_id || !req.body.name || !req.body.description || !req.body.quantity || !req.body.price) {
                return res.status(400).json({
                    error: "bad request",
                });
            }
            let find_inventory = await helpers.findOne(null, { inventory_id: req.body.inventory_id }, null, null, null, null, null, inventoryModel);
            let find_user = await helpers.findOne(null, { id: req.body.user_id }, null, null, null, null, null, signupModel);
            if (!find_user) {
                return res.status(409).json({ status: "Not a valid identifier" })
            }
            //update
            if (req.body.id) {
                 req.body.updated_at = moment(Date.now()).format("YYYY-MM-DD");
                 let find_inventory_update = await helpers.findOne(null, { id: req.body.id }, null, null, null, null, null, inventoryModel);
          
                  let data = {
                    updated_at: req.body.updated_at,
                    description:req.body.description,
                    name: req.body.name,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    updated_user_id:req.body.user_id
                }
                if(!find_inventory){
                    data.inventory_id=req.body.inventory_id
                    console.log(data)
                    let update = await inventoryModel.update(data, { where: { id: req.body.id } })
                    return res.status(200).json({ status: "Inventory Updated Successfully" })
                }
               
                 if(req.body.inventory_id==find_inventory_update.dataValues.inventory_id){
                    let update = await inventoryModel.update(data, { where: { id: req.body.id } })
                    return res.status(200).json({ status: "Inventory Updated Successfully" })
                 }
                 if(req.body.inventory_id!=find_inventory_update.dataValues.inventory_id){
                    if (find_inventory) {
                        return res.status(409).json({ status: "This inventory id already exists" })
                    }
                    data.inventory_id=req.body.inventory_id
                    let update = await inventoryModel.update(data, { where: { id: req.body.id } })
                    return res.status(200).json({ status: "Inventory Updated Successfully" })
                 }
                 
               

            }
            //insert
            if(!req.body.id){
                if (find_user.dataValues.role == 2 || find_user.dataValues.role == 3) {
                    return res.status(409).json({ status: "Only owners have access to this feature." })
                }
    
                if (find_inventory) {
                    return res.status(409).json({ status: "This inventory id already exists" })
                }
    
                if (find_user.dataValues.role == 1) {
                    req.body.status = true
                    req.body.created_at = moment(Date.now()).format("YYYY-MM-DD");
                    req.body.updated_at = moment(Date.now()).format("YYYY-MM-DD");
                    req.body.access_role = find_user.dataValues.role
                    req.body.updated_user_id=req.body.user_id
                    let savedata = await helpers.save(req.body, inventoryModel);
                    return res.status(200).json({ status: "Inventory Added Successfully" })
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    },
    view: async function (req, res) {
        try {

            let inventory = await helpers.findAll(null, {status:true}, null, null, null, null, null, inventoryModel)
            return res.status(200).json({ inventory: inventory })

        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
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
                let update = await inventoryModel.update({status:false}, { where: {id:req.body.id} })
                return res.status(200).json({ status: "Inventory Soft Deleted Successfully" })
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
                let delete_inventory =await helpers.delete(req.body.id, inventoryModel);
                return res.status(200).json({ status: "Inventory Hard Deleted Successfully" })
            }
             

        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    },

}  
