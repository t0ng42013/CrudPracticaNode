const express = require("express");
const router = express.Router();
const { User } = require("../models/productos.model");

const getUsers = async (req, res, next) => {
  let users;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ message: "ID Invalid" });
  }
  try {
    users = await User.findById(id);

    if (!users) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.user = users;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Usuario Not Found" });
  }
};

router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    console.log("GET ALL USER", user);
    if (user.length === 0) {
      return res.status(204).json([]);
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req?.body;
    // valida los datos de entrada
    if (!name || !email || !password) {
      return res
        .status(404)
        .json({ message: "Todos los campos son obligatorio" });
    }
    //crea una instancia de usuario
    const user = new User({ name, email, password });
    //guarda al usuario en en la base de datos
    const newUser = await user.save();
    //devuelve el usuario creado
    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error creando usuario:", error.message);
    res.status(500).json({ message: "Error creando usuario" });
  }
});

router.get("/:id", getUsers, async (req, res) => {
  res.status(200).json(res.user);
});

router.put("/:id", getUsers, async (req, res) => {
  try {
    const user = res.user;

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", getUsers, async (req, res) => {
  try {
    const user = res.user;

    if (!req.body.name || !req.body.email || !req.body.password) {
      res.status(400).json({ message: "Al menos debe enviar 1 campo" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;

    const userUpdate = await user.save();
    res.json(userUpdate);
  } catch (error) {console.error({message: error.message})}
});

router.delete("/:id", getUsers, async (req, res) => {
  try {
    const user = res.user
    await res.user.deleteOne();
    res.json({message:"Libro eliminado",user})
  } catch (error) {
    console.error({ message: error.message });
  }
});


module.exports = router;