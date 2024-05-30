var Sequelize = require('sequelize');
const sequelize = require('../controllers/helpers/dbconnect');

   const inventory = sequelize.define('inventory', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    inventory_id:Sequelize.STRING(255),
    user_id: Sequelize.INTEGER,
    updated_user_id:Sequelize.INTEGER,
    name: Sequelize.STRING(255),
    description: Sequelize.TEXT,
    quantity: Sequelize.INTEGER,
    price: Sequelize.INTEGER,
    status: Sequelize.BOOLEAN,
    access_role: Sequelize.INTEGER,
    created_at: Sequelize.DATEONLY,
    updated_at: Sequelize.DATEONLY,
  
}, {
    freezeTableName: true,
    timestamps: false
});



module.exports = inventory;