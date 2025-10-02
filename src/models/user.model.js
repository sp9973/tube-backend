import mongoose,{Schema} from "mongoose";
import  json  from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema= new Schema({
    username:{
        type : String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true     
    },
    email:{
        type : String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true,

    },
    fullname : {
        type : String,
        required:true,
        trim:true,
        index:true

    },
    avatar : {
        type : String,
        required:true,
    },
    coverImage : {
        type : String,
    },
    password:{
        type : String,
        required: [true,"password is required"],
        unique:true,
        lowercase:true,
        trim:true   
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video",
        }
    ],
    refreshToken: {
        type:String,
    }

},{timestamps:true})

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
    
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id : this.id,
        username:this.username,
        fullname:this.fullname,
        email:this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id : this.id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User=mongoose.model("User",userSchema)