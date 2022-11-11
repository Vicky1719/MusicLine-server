const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/auth.middlewares");

//rutas de autenticación (signup y login)

// POST registrar un usuario

router.post("/signup", async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;

  // validaciones (los campos no deben estar vacios)

  if (
    firstName === "" ||
    lastName === "" ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    res.status(400).json({ errorMessage: "Debe cumplimentar todos los campos" });
    return;
  }

  try {
    
    // Validation 1:
    if (username.length < 4) {
      res
        .status(400)
        .json({
          errorMessage: "El nombre de usuario debe tener mínimo 4 caracteres",
        });
      return;
    }
  
    // Validación 2 formato d email
  
    const emailFormat =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if (emailFormat.test(email) === false) {
      res.status(400).json({ errorMessage: "Formato de email incorrecto" });
      return;
    }
  
    //validacion 3
  
    const passwordFormat =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (passwordFormat.test(password) === false) {
      res.status(400).json({
        errorMessage:
          "La contraseña debe tener mñinimo 8 caracteres, una mayúscula y un número",
      });
      return;
    }
  
    // Validacion 4: Email unico
    const foundEmail = await User.findOne({ email: email });
    if (foundEmail !== null) {
      res.status(406).json({ errorMessage: "Email ya registrado" });
      return;
    }
  
    // Validation 5: User unico
    const foundUser = await User.findOne({ username: username });
    if (foundUser !== null) {
      res.status(406).json({ errorMessage: "Username ya registrado." });
      return;
    }
    // 2. codificar la contraseña
    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = {
      email: email,
      password: hashPassword,
      lastName: lastName,
      firstName: firstName,
      username: username
    }

    // 3. crear el usuario
    await User.create(newUser)
    

    // 4. enviar un mensaje de OK al FE

    res.status(201).json("Usuario registrado correctamente")

  } catch (error) {
   next(error) 
  }
}
)


  //POST validar credencialaes login
  router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
   

    if (email === "" || password === "") {
      res.status(400).json({ errorMessage: "Debe tener email y contraseña" })
      return;
    }

  try {
    // que la contraseña sea correcta
     const foundUser = await User.findOne({ email: email });
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (isPasswordValid === false) {
      res.status(400).json({ errorMessage: "Credenciales no validas" });
      return;
    }

    // 2. crear algo parecido a la sesión (TOKEN) y enviarlo al cliente

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      username: foundUser.username,
    };

    const authToken = jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      { algorithm: "HS256" } // configuraciones Token (Header)
    );
    res.status(200).json({ authToken: authToken });

    // enviar el Token al cliente
  } catch (error) {
    next(error);
  }
});

module.exports = router;
