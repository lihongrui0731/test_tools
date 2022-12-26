import {Sequelize} from 'sequelize'
import config from './config/config.js';
import Plan from './model/plan.js'

const connection = config.host;
const db = config.db;
const username = config.username;
const password = config.password;
const sequelize = new Sequelize(db, username, password, {
    host: connection,
    dialect: "mysql",
})
async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('connection established!');
    } catch (err) {
        console.log('connection failed,', err)
    }
}

async function main() {
    await testConnection();
    const plans = await Plan.findAll({raw: true})
    console.log(plans)
}

main()
