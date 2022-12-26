import {Sequelize, DataTypes} from 'sequelize';
import config from '../config/config.js'

const sequelize = new Sequelize(config.db, config.username, config.password, {
    host: config.host,
    dialect: "mysql",
})
const Plan = sequelize.define('plan', {
    id: {
        type: DataTypes.STRING(16),
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        unique: true
    },
    description: DataTypes.TEXT,
    station_id: DataTypes.STRING(16),
    plan_start_on: DataTypes.STRING(13),
    plan_stop_on: DataTypes.STRING(13),
    startTime: DataTypes.STRING(13),
    stopTime: DataTypes.STRING(13),
    is_active: {
        type: DataTypes.INTEGER(2),
        defaultValue: 0
    },
    is_deleted: {
        type: DataTypes.INTEGER(2),
        defaultValue: 0
    },

    deviceInfo: DataTypes.TEXT,
    capture: DataTypes.TEXT,

    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,

    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE
    },
}, {
    freezeTableName: true
});

export default Plan
