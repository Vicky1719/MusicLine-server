const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs")

//rutas de autenticación (signup y login)

// POST registrar un usuario

router.post("/signup", async (req, res, next) =>{
    const { firstName, lastName, userName, email, password, photoUser, favorites } = req.body

// validaciones (los campos no deben estar vacios)

if(firstName === "" || lastName === "" || userName === "" || email === "" || password === "") {
    res.status(400).json({errorMessage: "Debe tener email y contraseña"})
    return; 
}

// Validation 2: 
if (userName.length < 4) {
    res.status(400).json({ errorMessage: "El nombre de usuario debe tener mínimo 4 caracteres" });
  }

  // Validación 3 formato d email


  const emailFormat =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
if (!emailFormat.test(email)) {
  res.status(400).json({ errorMessage: "Formato de email incorrecto" });
  return;
}

//validacion 4

const passworFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
if(passworFormat.test(password) === false) {
    res.status(400).json({errorMessage: "La contraseña debe tener mñinimo 8 caracteres, una mayúscula y un número"})
    return;
}

try {
    //usuario y email únicos
    const foundUser = await User.findOne ({
        $or: [{userName: userName}, {email: email}],
    })
    if (foundUser === null ) {
        res.status(400).json({errorMessage: "Credencailes incorrectas"})
    }
     // que la contraseña sea correcta
     const isPasswordValid = await bcrypt.compare(password, foundUser.password)
     if (isPasswordValid === false) {
       res.status(400).json({errorMessage: "Credenciales no validas"}) 
       return;
     }
 
 
     // 2. crear algo parecido a la sesión (TOKEN) y enviarlo al cliente
     
     
     const payload = {
       _id: foundUser._id,
       email: foundUser.email,
       userName: foundUser.userName,
       lastName: foundUser.lastName,
       firstName: foundUser.firstName
     }
 
     const authToken = jwt.sign(
       payload, 
       process.env.TOKEN_SECRET, 
      
     )
 
   
     // enviar el Token al cliente
     res.status(200).json({ authToken: authToken })
   
   
   } catch (error) {
     next(error)
   }
 
 

 
 
 
 module.exports = router;