const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const userSchema = new Schema(
  {
    phone: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const validateAddUser = (user) => {
  const schema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

const validatePhone = (user) => {
  const schema = Joi.object({
    phone: Joi.string().required(),
  });
  return schema.validate(user);
};

const Users = mongoose.model("Users", userSchema);

module.exports = {
  Users,
  validateAddUser,
  validatePhone,
};
