import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.ts";

export const User = sequelize.define('user', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        unique: true,
    }
}, {
    tableName: "users"
})