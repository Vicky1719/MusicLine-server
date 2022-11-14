const router = require("express").Router();
const Comments = require("../models/Comments.model")
const jwt = require("jsonwebtoken")
const isAuthenticated = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");


// //GET lista de co  lista de commentarios
// router.get("/", async (req, res, next) => {
//     try {
//         const response = await Creation.find()
//         res.status(200).json(response)
//     } catch(error) {
//         next(error)
//     }
// })

//POST crear comentario
router.post("/create", async (req, res, next) => {

    const newComments = {
        description: req.body.description,
        // creation: req.body.creation,
        // user: req.body.user // aquí tengo que cambiar para poner el payload
    }
    
    try {
        const response = await Comments.create(newComments)
     
        res.status(201).json("Nuevo comentario creado")
    } catch(error) {
        next(error)
    }
})

//PATH Edita un comentario
router.patch("/:commentsId/edit", async (req, res, next) => {
    const commentsUpdate = {
        description: req.body.description,
        // creation: req.body.creation,
        // user: req.body.user // aquí tengo que cambiar para poner el payload
    }

    try {
        await Comments.findByIdAndUpdate(req.params.commentsId, commentsUpdate)
        res.status(200).json("Comentario actualizado")
    } catch(error) {
        next(error)
    }
})



//DELETE Borrar comentario
router.delete("/:commentsId/delete", async (req, res, next) => {
    try {
      await Comments.findByIdAndDelete(req.params.commentsId)
      res.status(200).json("Comentario borrado")
    } catch(error) {
        next(error)
    }
})












module.exports = router