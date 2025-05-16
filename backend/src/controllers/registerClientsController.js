// Importamos todas las librerías
import jsonwebtoken from "jsonwebtoken"; // Token
import bcryptjs from "bcryptjs"; // Encriptar
import nodemailer from "nodemailer"; // Enviar correos
import crypto from "crypto"; // Generar código

import clientsModel from "../models/customers.js"; // Modelo de clientes
import { config } from "../config.js";

// Array de funciones
const registerClientController = {};

registerClientController.registerClient = async (req, res) => {
  // 1- Pedimos las cosas que vamos a guardar
  const {
    name,
    email,
    password,
    telephone,
    adress, // Cambiado a 'adress' según el modelo
    dui,
  } = req.body;

  try {
    // Verificar si el cliente ya existe
    const existClient = await clientsModel.findOne({ email });
    if (existClient) {
      return res.json({ message: "Client already exists" });
    }

    // Encriptar la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    // Guardamos en la base de datos
    const newClient = new clientsModel({
      name,
      email,
      password: passwordHash,
      telephone,
      adress, // Cambiado a 'adress' según el modelo
      dui: dui || null,
    });

    await newClient.save();

    // Generar un código de verificación
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas

    // TOKEN
    const tokenCode = jsonwebtoken.sign(
      {
        email,
        verificationCode,
        expiresAt,
      },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn }
    );

    // Guardar el token en una cookie
    res.cookie("verificationToken", tokenCode, {
      maxAge: 2 * 60 * 60 * 1000, // Duración de la cookie: 2 horas
    });

    // Enviar correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const mailOptions = {
      from: config.email.user,
      to: email,
      subject: "Verificación de correo",
      text: `Para verificar que eres dueño de la cuenta, utiliza este código ${verificationCode}\n Este código expira en dos horas\n`,
    };

    // Envío del correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("error" + error);
      res.json({ message: "Email sent" });
    });

    res.json({ message: "Client registered, Please verify your email" });
  } catch (error) {
    res.json({ message: "error" + error });
  }
};

registerClientController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken;

  if (!token) {
    return res.json({ message: "Please register your account first" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode } = decoded;

    if (verificationCode !== storedCode) {
      return res.json({ message: "Invalid verification code" });
    }

    const client = await clientsModel.findOne({ email });
    if (!client) {
      return res.json({ message: "Client not found" });
    }

    // No hay un campo isVerified en el modelo de clientes, así que este paso se omite
    // Si necesitas un campo similar, deberías agregarlo al esquema

    res.clearCookie("verificationToken");

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.json({ message: "error" + error });
  }
};

export default registerClientController;
