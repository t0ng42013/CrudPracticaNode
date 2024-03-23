const express = require("express");
const router = express.Router();
const { Category } = require("../models/productos.model");

const getCategory = async (req, res, next) => {
  try {
    let category;
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      //verifico el id del product que sea valido
      return res.status(404).json({ message: "ID INVALID" });
    }
    category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "category Not Found" });
    }
    res.category = category;
    next();
  } catch (error) {
    console.error({ message: "Error", error });
  }
};

router.get("/", async (req, res) => {
  try {
    const category = await Category.find();
    if (category.length === 0) {
      return res.status(204).json([]);
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error en GET ALL" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description } = req?.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }
    const category = new Category({
      name,
      description,
    });

    const categoty = await category.save();
    res.status(201).json(categoty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", getCategory, async (req, res) => {
  res.json(res.category);
});

router.put("/:id", getCategory, async (req, res) => {
  try {
    const categoty = res.category;

    categoty.name = req.body.name || categoty.name;
    categoty.description = req.body.description || categoty.description;

    const UpdateCateg = await categoty.save();
    res.json(UpdateCateg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", getCategory, async (req, res) => {
  try {
    const category = res.category;

    if (!req.body.name || req.body.description) {
      return res
        .status(400)
        .json({ message: "al menos un campo es obligatorio" });
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;

    const updateCateg = await category.save();
    res.json(updateCateg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", getCategory, async (req, res) => {
  try {
    const category = res.category;
    await res.category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: " Error al eliminar la categoria" });
  }
});

module.exports = router;
