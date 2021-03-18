const router = require('express').Router();

// require the product service
const productService = require('../services/productService.js');

// GET listing of all products
// Address http://server:port/product
// returns JSON
router.get('/', async (req, res) => {

    // Get products
    try {
        // Call the product service to get a list of products
        // getProducts() is an async function so use await
        const result = await productService.getProducts();
        // send json result via HTTP
        res.json(result);

        // Catch and send any errors  
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// GET a single product by id
// id passed as parameter via url
// Address http://server:port/product/:id
// returns JSON
router.get('/:id', async (req, res) => {

    // read value of id parameter from the request url - note param and not req
    const productId = req.params.id;

    // If validation passed execute query and return results
    // returns a single product with matching id
    try {
        // Send response with JSON result    
        let result = await productService.getProductById(productId);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// GET products by category id
// id passed as parameter via url
// Address http://server:port/product/:id
// returns JSON
router.get('/bycat/:id', async (req, res) => {

    let result;

    // read value of id parameter from the request url
    const categoryId = req.params.id;

    // If validation passed execute query and return results
    // returns a single product with matching id
    try {
        // Send response with JSON result    
        let result = await productService.getProductsByCatId(categoryId);
        res.json(result);

    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// POST - Insert a new product.
// This async function sends a HTTP POST request
router.post('/', async (req, res) => {

    // the request body contains the new product values - copy it
    const newProduct = req.body;

    // show what was copied in the console (server side)
    console.log("productController: ", newProduct);

    // Pass the new product data to the service and await the result
    try {
        // Send response with JSON result    
        result = await productService.createProduct(newProduct);
        // send a json response back to the client
        res.json(result);
        // handle server (status 500) errors
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});


// PUT update product
// Like post but productId is provided and method = put
router.put('/', async (req, res) => {
    // the request body contains the new product values - copy it
    const product = req.body;
    // show what was copied in the console (server side)
    console.log("productController update: ", product);
    // Pass the new product data to the service and await the result
    try {
        // Send response with JSON result    
        result = await productService.updateProduct(product);
        // send a json response back to the client
        res.json(result);
        // handle server (status 500) errors
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// DELETE single product by id.
router.delete('/:id', async (req, res) => {
    // read value of id parameter from the request url
    const productId = req.params.id;
    // If validation passed execute query and return results
    // returns a single product with matching id
    try {
        // Send response with JSON result    
        const result = await productService.deleteProduct(productId);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// Export as a module
module.exports = router;