const express = require("express");
const router = express.Router();
const { Product } = require("../models/productos.model");

//MIDDELWARE
const getProduct = async (req, res, next) => {
  let product;
  const { id } = req.params; //extraigo el id del params

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //verifico el id del product que sea valido
    return res.status(404).json({ message: "ID INVALID" });
  }

  try {
    product = await Product.findById(id);

    if (!product) {
      //si no hay product encontrad
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.product = product;
  next();
};

// Obtener todos los productos GET ALL
router.get("/", async (req,res) => {
  try {
    const product = await Product.find();
    console.log("GET ALL", product);
    if (product.length === 0) {
      //si  no hay nada devuelve 204 y un array vacio
      return res.status(204).json([]);
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//crear un producto nuevo
router.post("/", async (req, res) => {
  const { name, description, price, image, categoryId } = req?.body;

  if (!name || !description || !price || !image) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

   const productData = { name, description, price, image };
   if (categoryId) {
     productData.category = categoryId;
   }

   const product = new Product(productData);

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

//GET por ID
router.get("/:id", getProduct, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.put('/:id', getProduct, async (req, res) => {
  try {
    const product = res.product

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;

    const updateProduct = product.save();
    res.json(updateProduct);


  } catch (error) {
    console.error({message:"Error en modificar productos"});
  }
});

router.patch('/:id', getProduct, async(req , res)=>{
try {
     const product = res.product;

     if(!req.body.name && !req.body.description && ! req.body.price && !req.body.image ){
        res.status(404).json({message:"Ingrese al menos un campo"})
     }

     product.name = req.body.name || product.name;
     product.description = req.body.description || product.description;
     product.price = req.body.price || product.price;
     product.image = req.body.image || product.image;

     const updateProduct = product.save();
     res.json(updateProduct);

} catch (error) {
  res.status(500).json({message:"Error en modificar product"});
}
})

router.delete('/:id', getProduct ,async(req, res ) => {
try {
  const product = res.product
  await res.product.deleteOne();
  res.json({message:"archivo borrado"})
} catch (error) {
   return res.status(404).json({ message: 'Error al borrar producto' });
}
})

module.exports = router;

