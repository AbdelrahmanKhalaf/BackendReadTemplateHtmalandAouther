import { ObjectId, ObjectID } from "mongodb";
import mongoose, { Schema, disconnect, model, Model, Document } from "mongoose";
import joi, { any, boolean, date, number, string } from "joi";
import jwt from "jsonwebtoken";
import config from "../config/config"
import becrypt from "bcryptjs"
import slugify from 'slugify';
import { geocoder } from '../helpers/geocoder'
import { NextFunction } from "express";
process.env.SUPPRESS_NO_CONFIG_WARNING = "../models/user.model.ts";
const schema = new Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: [30, "Name can not be more than 30 charcters"],
    required: [true, 'please add a name'],
    trim: true
  },
  age: {
    type: String,
  },
  gender: {
    type: Number,
  },
  email: {
    type: String,
    maxlength: 315,
    required: true,
    // match: ['/^[^\s@]+@[^\s@]+$/', 'Pleas use a valid email'],
    // enum: [
    //   'just use to you cant use any value not exited here'
    // ]
  },
  phone: {
    type: Number,
    minlength: 8,
    maxlength: 100,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  avatar: {
    type: String,
    default: "uploads/avatar_1587657175473.png",
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 2015,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  address: {
    type: String,
    minlength: 10,
    maxlength: 360,
    required: [true, 'pleas add address']
  },
  resetLink: {
    type: String,
    default: "",
  },
  verify: {
    type: Boolean,
    default: false,
  },
  confirmPassword: {
    type: String,
    required: true
  },
  blocked: {
    type: Boolean,
    default: false

  },
  walt: {
    type: Number,
    default: 0
  },
  location: {
    type: {
      type: String,

      default: "point"
    },
    coordinates: {
      type: [Number],
      require: true,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  }
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
  email: String;
  password: String | any;
  phone: String;
  gender: number;
  confirmPassword: String | any;
  address: String | any,
  location: any
}
schema.methods.generaToken = function (): any {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    config.JTWSecretPivate
  );
  return token;
};

export const User = mongoose.model("users", schema);
export function validateUser(user: any) {
  const schema = {
    name: joi.string().min(8).max(30).required(),
    email: joi.string().email().min(8).max(100).required(),
    phone: joi.number().min(11).required(),
    password: joi.string().min(8).max(28).required(),
    confirmPassword: joi.string().min(8).max(100).required(),
    address: joi.string().min(10).max(500).required(),
  };
  return joi.validate(user, schema);
}
export function validateUserUpdate(userUpdate: any) {
  const schema = {
    name: joi.string().min(8).max(315),
    phone: joi.any(),
    age: joi.number(),
    gender: joi.any(),
    password: joi.string().min(8).max(100),
  };
  return joi.validate(userUpdate, schema);
}
export async function validateAddInformtionUser(userUpdate: any) {
  const schema = await {
    address: joi.string().min(11).max(315),
    age: joi.number(),
    gender: joi.number(),
    password: joi.string().min(8).max(100),
  };
  return joi.validate(userUpdate, schema);
}
export async function validateUserPassword(userUpdate: any) {
  const schema = await {
    password: joi.string().min(8).max(100).required(),
    newPass: joi.string().min(8).max(100).required(),
  };
  return joi.validate(userUpdate, schema);
}
export async function vaildavatar(userUpdate: any) {
  const schema = await {
    avatar: joi.date().required(),
  };
  return joi.validate(userUpdate, schema);
}
export async function validateUserEmail(userUpdate: any) {
  const schema = await {
    email: joi.string().min(8).max(100).required(),
    password: joi.string().min(8).max(100).required(),
  };
  return joi.validate(userUpdate, schema);
}

