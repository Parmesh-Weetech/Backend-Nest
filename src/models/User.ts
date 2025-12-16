import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.ts";

export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /[a-z]{2}/i
        }
    }
}, {
    tableName: "users",
    paranoid: true,
})