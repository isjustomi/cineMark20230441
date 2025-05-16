/*
    Campos:
        nombre
        email
        password
        telephone
        adress
        dui
*/

import { Schema, model } from "mongoose";

const customersSchema = new Schema(
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

    adress: {
        type: String,
        require: true,
    },

    dui: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("customers", customersSchema);
