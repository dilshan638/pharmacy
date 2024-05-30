var Sequelize = require('sequelize');
const sequelize = require('../controllers/helpers/dbconnect');

   const signup = sequelize.define('signup', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    username: Sequelize.STRING(255),
    email: Sequelize.STRING(255),
    role: Sequelize.INTEGER,
    first_name: Sequelize.STRING(100),
    last_name: Sequelize.STRING(100),
    address:Sequelize.STRING(255),
    phone_number: Sequelize.STRING(55),
    password: Sequelize.TEXT,
    created_at: Sequelize.DATEONLY,
    updated_at: Sequelize.DATEONLY,
  
}, {
    freezeTableName: true,
    timestamps: false
});



module.exports = signup;