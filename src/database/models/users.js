import { DataTypes,Model } from "sequelize";
import sequelize from "../../config/db.js";

class User extends Model{}

User.init({
    id:{
        type:DataTypes.UUID,
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
        type:DataTypes.STRING,
        enum:['patient','doctor','admin'],
        defaultValue:'patient',
        allowNull:false
    },
    date_of_birth:{
    type:DataTypes.DATE,
    allowNull:true
    },
    gender:{
        type:DataTypes.STRING,
        enum:['male','female','others'],
    
    },
    profile_image:{
        type:DataTypes.STRING,
        allowNull:true
    },
    status:{
        type:DataTypes.STRING,
        enum:['active','inactive','blocked']
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