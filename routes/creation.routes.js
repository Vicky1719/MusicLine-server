const router = require("express").Router();
const Creation = require("../models/Creation.model")
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
router.post("/create", async (req, res, next) => {

    const newCreation = {
        name: req.body.name,
        description: req.body.description,
        letter: req.body.letter,
        music: req.body.music,
        song: req.body.song
    }
    
    try {
        const response = await Creation.create(newCreation)
     
        res.status(201).json("Nueva creacion creada")
    } catch(error) {
        next(error)
    }
})

//PATH Edita una creacion
router.patch("/:creationId/edit", async (req, res, next) => {
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

//GET Buscar creacion
router.get("/:creationId/search", async (req, res, next) => {
    try {
      const response = await Creation.findById(req.params.creationId)
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

//DELETE borrar de favoritos
router.delete("/:creationId/delete-favorites", isAuthenticated, async (req, res, next) => {
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