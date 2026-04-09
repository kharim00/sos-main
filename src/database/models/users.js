import { DataTypes,Model } from "sequelize";
import sequelize from "../../config/db.js";

class User extends Model{}

User.init({
    id:{
        type:DataTypes.STRING,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    fullName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:true,
        unique:true
    },
    phoneNUmber:{
        type:DataTypes.STRING,
        allowNull:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role:{
        type:DataTypes.ENUM('patient','doctor','admin'),
        defaultValue:'patient',
        allowNull:false
    },
    date_of_birth:{
    type:DataTypes.DATE,
    allowNull:true
    },
    gender:{
        type:DataTypes.ENUM('male','female','others'),
        allowNull:true
    },
    profile_image:{
        type:DataTypes.STRING,
        allowNull:true
    },
    status:{
        type:DataTypes.ENUM('active','inactive','blocked'),
        allowNull:true
    },
    emergency_contact:{
        type:DataTypes.STRING,
        allowNull:true
    },
    location:{
    type:DataTypes.STRING,
    allowNull:true,
}
},{
    sequelize,
    modelName:'User',
    tableName:'users',
    timestamps:true

})

export default User