var Sequelize = require('sequelize');
const sequelize = require('../controllers/helpers/dbconnect');

   const customer = sequelize.define('customer', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: Sequelize.INTEGER,
    updated_user_id:Sequelize.INTEGER,
    name: Sequelize.STRING(255),
    drugs_count: Sequelize.INTEGER,
    quantity: Sequelize.INTEGER,
    price: Sequelize.DOUBLE,
    status: Sequelize.BOOLEAN,
    created_at: Sequelize.DATEONLY,
    updated_at: Sequelize.DATEONLY,
  
}, {
    freezeTableName: true,
    timestamps: false
});



module.exports = customer;