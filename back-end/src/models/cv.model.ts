import mongoose, { Schema, disconnect, model, Model, Document } from "mongoose";
import joi, { any, boolean, date, number, string } from "joi";
process.env.SUPPRESS_NO_CONFIG_WARNING = "../models/user.model.ts";
const schema = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: [30, "Name can not be more than 30 charcters"],
        required: [true, 'please add a name'],
        trim: true
    },
    dec: {
        type: String,
        required: [true, 'please add a name'],
    },
    path: {
        type: String,
        required: [true, 'please add a file'],
    },
    avatar: {
        type: String,
        default: "uploads/avatar_1587657175473.png",
        required: true,
    },

});
//GECODER & Create location field
// schema.pre('save', async (next) =>  {
//   let boda:any = this;
//   let loc = await geocoder.geocode(this.address);
//   this.location = {
//     type:'point',
//     coordintates:[loc[0].longitude, loc[0].latitude],
//     formattedAddress:loc[0].formattedAddress,
//     streetName:loc[0].streetName,
//     city:loc[0].city,
//     stateCode:loc[0].stateCode,
//     zipcode:loc[0].zipcode,
//     countryCode:loc[0].countryCode,
//   }
//   this.address = undefined;
//   next()
// })
export interface Iusers extends Document {
    name: String;
    path: String;
    dec: String | any;
    avater: String;
}
export const CV = mongoose.model("cv", schema);
export function validCv(user: any) {
    const schema = {
        name: joi.string().min(8).max(30).required(),
        dec: joi.string().min(11).required(),
    };
    return joi.validate(user, schema);
}

