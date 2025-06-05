import mongoose from 'mongoose'

const userschema = new mongoose.Schema(
    {
        firstName:{
            type : String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type:String,
            required: true
        },
        bio:{
            type: String,
            default:""
        },
        qualification:{
            type: String,
            default:""
        },
        profilePhoto:{
            type:String,
            default:""
        },
        instagram:{
            type: String,
            default: ""
        },
        linkedin:{
            type: String,
            default: ""
        },
        facebook:{
            type: String,
            default: ""
        },
        github:{
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

const userModel = mongoose.model("User", userschema);
export default userModel;