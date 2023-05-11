const{model, Schema}= require("mongoose");

const userSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        phone:{
            type:String,
            enum:["ADMIN", "USER"],
            default:"USER",
        },
        phoneOtp:String
    },
    {timestamps:true}
);

module.exports= model("USer", userSchema);