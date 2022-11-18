const router = require("express").Router();
const Creation = require("../models/Creation.model")
const Comments = require ("../models/Comments.model")
const jwt = require("jsonwebtoken")
const isAuthenticated = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");


//GET lista de creaciones 
router.get("/", async (req, res, next) => {
    try {
        const response = await Creation.find()
        res.status(200).json(response)
    } catch(error) {
        next(error)
    }
})

//POST crear creacion
router.post("/create",  isAuthenticated, async (req, res, next) => {

    const newCreation = {
        name: req.body.name,
        description: req.body.description,
        letter: req.body.letter,
        music: req.body.music,
        song: req.body.song,
        user: req.payload._id
        
    }
    
    try {
        const response = await Creation.create(newCreation)
     
        res.status(201).json("Nueva creacion creada")
    } catch(error) {
        next(error)
    }
})

//PATH Edita una creacion
router.patch("/:creationId/edit",  isAuthenticated, async (req, res, next) => {
    const creationUpdate = {
        name: req.body.name,
        description: req.body.description,
        letter: req.body.letter,
        music: req.body.music,
        song: req.body.song
    }

    try {
        await Creation.findByIdAndUpdate(req.params.creationId, creationUpdate)
        res.status(200).json("Creación actualizada")
    } catch(error) {
        next(error)
    }
})

//GET Detalles de la creacion
router.get("/:creationId/detail", async (req, res, next) => {
    const {creationId } = req.params
    try {
      const response = await Creation.findById(creationId)
      res.status(200).json(response)
    } catch(error) {
        next(error)
    }
})

//GET mis creaciones 
router.get("/my-creation", isAuthenticated , async (req, res, next) => {

    try {
      const response = await Creation.find({
        user: req.payload._id
      })
      res.status(200).json(response)
    } catch(error) {
        next(error)
    }
})


//DELETE Borra creacion
router.delete("/:creationId/delete", async (req, res, next) => {
    try {
      await Creation.findByIdAndDelete(req.params.creationId)
      res.status(200).json("Creación borrada")
    } catch(error) {
        next(error)
    }
   
})
 //GET Buscar comentarios
 router.get("/:creationId/comment", async (req, res, next) => {
    const {creationId } = req.params
    try {
      const response = await Comments.find({"creation":`${creationId}`})
      res.status(200).json(response)
    } catch(error) {
        next(error)
    }
})
//POST crear comentario /api/creation/comments
router.post("/:creationId/comment", isAuthenticated, async (req, res, next) => {

    console.log("dec", req.params)
    const newComments = {
        description: req.body.description,
        creation: req.params.creationId,
       user: req.payload._id 
    }
    
    try {
         await Comments.create(newComments)
     
        res.status(201).json("Nuevo comentario creado")
    } catch(error) {
        next(error)
    }
})


//DELETE Borra comentario
router.delete("/:commentId/delete", async (req, res, next) => {
    try {
      await Comment.findByIdAndDelete(req.params.commentId)
      res.status(200).json("Comentario borrado")
    } catch(error) {
        next(error)
    }
})


//PATCH  creaciones favoritas
router.patch("/:creationId/favorites", isAuthenticated, async (req, res, next) => {
    try {
      await User.findByIdAndUpdate(req.payload._id, {
        $addToSet: {favorites: req.params.creationId},
      })
      res.status(200).json("Creación agregada a favoritos")
    } catch(error) {
        next(error)
    }
})

//GET lista de co  lista de commentarios
 router.get("/", async (req, res, next) => {
    try {
      const response = await Creation.find()
       res.status(200).json(response)
   } catch(error) {
        next(error)
    }
 })

//DELETE borrar de favoritos
router.patch("/:creationId/delete-favorites", isAuthenticated, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.payload._id, {
        $pull: {favorites: req.params.creationId},
    })
    res.status(200).json("Creación borrada de favoritos")
  }catch(error) {
    next(error)
  }
})








module.exports = router