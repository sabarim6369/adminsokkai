import validator from "validator";
import { mongoose } from "mongoose";

const SignupsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Sorry, please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: validator.isStrongPassword,
      message: "Please ensure that you have entered a strong password",
    },
    phone: {
      validate: {
        validator: validator.isMobilePhone,
        message: "Please ensure the valid phone number",
      },
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "customer",
    },
  },
});

const Customer = mongoose.model("CustomerAuth", SignupsSchema);

export default Customer;
