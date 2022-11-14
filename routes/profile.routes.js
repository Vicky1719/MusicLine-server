const router = require("express").Router();
const User = require("../models/User.model");

const isAuthenticated  = require ("../middlewares/auth.middlewares");

//GET mi perfil 
router.get("/my-profile", isAuthenticated, async (req, res, next) => {
    try {
        await User.findById(req.payload._id)
        res.status(200).json("mi perfil")

    } catch (error) {
        next(error);
    }

})

//PATCH editar usuario
router.patch("/:userId/edit", isAuthenticated, async (req, res, next) => {
    const userUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
    };

    try {
        await User.findByIdAndUpdate(req.params.userId, userUpdate)

        res.status(200).json("Actualizar perfil")
    } catch (error) {
        next(error)
    }
})

//POST borrar usuario
router.post("/:userId/delete", isAuthenticated, async (req, res, next)=> {
    try{
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("Borrar perfil")
    } catch(error) {
        next(error)
    }
})

module.exports = router;