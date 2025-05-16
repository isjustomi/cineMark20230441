import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },

    email: {
      type: String,
    },

    password: {
        type: String,
        require: true,
    },

    telephone: {
        type: String,
        require: true,
    },

    address: {
      type: String,
      rquire:true,
    },

    workRange:{
        type: String,
        require:true,
    },

    hireDate: {
      type: Date,
      require: true,
    },

    salary: {
        type: Number,
        require: true,
    },

    dui: {
      type: String,
      require: true,
    },

  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("employee", employeeSchema);
