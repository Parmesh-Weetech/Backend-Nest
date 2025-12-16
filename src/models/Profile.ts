import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.ts";

export const Profile = sequelize.define('profile', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'profile'
})