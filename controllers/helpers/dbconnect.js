var Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
global.Op = Sequelize.Op;
 const connection = new Sequelize(process.env.DatabaseName, process.env.Username, process.env.Password, {
  host:process.env.Host, 
    dialect: 'mysql',  
    port: process.env.Port,  
    pool: { 
        max: 100,
        min: 0,
        idle: 20000,
        acquire: 20000 
    }
});

connection
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = connection;