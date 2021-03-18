// Dependencies
// Input validation package
// https://www.npmjs.com/package/validator
const baseValidators = require('../validators/baseValidators.js');
const productValidator = require('../validators/productValidators');

// require the database connection
const productRepository = require('../repositories/productRepository.js');

// Get all products via the repository
// return products
let getProducts = async () => {
    const products = await productRepository.getProducts();
    return products;
};

// Get product by id
// Validate input
// return product
let getProductById = async (productId) => {
    // Validate input using validator module
    // important as a bad input could crash the server or lead to an attack
    // appending + '' to numbers as the validator only works with strings
    if (!baseValidators.id(productId)) {
        console.log("getProducts service error: invalid id parameter");
        return "invalid parameter";
    }
    // get product (if validation passed)
    const product = productRepository.getProductById(productId);
    return product;
};

// Get products for a particular category (by cat id)
// Validate input
// return products
let getProductsByCatId = async (categoryId) => {
    // Validate input - important as a bad input could crash the server or lead to an attack
    // appending + '' to numbers as the validator only works with strings
    if (!baseValidators.id(categoryId)) {
        console.log("getProductsByCatId service error: invalid id parameter");
        return "invalid parameter";
    }
    // get products (if validation passed)
    const products = productRepository.getProductsByCatId(categoryId);
    return products;
};

// Insert a new product
// This function accepts product data as a paramter from the controller.
let createProduct = async (product) => {
    // declare variables
    let newlyInsertedProduct;
    // Call the product validator - kept seperate to avoid clutter here
    let validatedProduct = productValidator.validateProduct(product);

    // If validation returned a product object - save to database
    if (validatedProduct != null) {
        newlyInsertedProduct = await productRepository.createProduct(validatedProduct);
    } else {
        // Product data failed validation 
        newlyInsertedProduct = { "error": "invalid product" };
        // log the result
        console.log("productService.createProduct(): form data validate failed");
    }
    // return the newly inserted product
    return newlyInsertedProduct;
}

// product update service
let updateProduct = async (product) => {
    // Declare variables and consts
    let updatedProduct;
    // call the product validator
    let validatedProduct = productValidator.validateProduct(product);

    // If validation returned a product object - save to database
    if (validatedProduct != null) {
        updatedProduct = await productRepository.updateProduct(validatedProduct);
    } else {
        // Product data failed validation 
        updatedProduct = { "error": "Product update failed" };
        // debug info
        console.log("productService.updateProduct(): form data validate failed");
    }
    // return the newly inserted product
    return updatedProduct;

}

//
// deleteProduct Service
// Validate input, call repository, return result
let deleteProduct = async (productId) => {
    let deleteResult = false;
    // Validate input
    // appending + '' to numbers as the validator only works with strings
    if (!baseValidators.id(productId)) {
        console.log("deleteProducts service error: invalid id parameter");
        return false;
    }
    // delete product by id
    // result: true or false
    deleteResult = await productRepository.deleteProduct(productId);
    // sucess
    return deleteResult;
};


// Module exports
// expose these functions
module.exports = {
    getProducts,
    getProductById,
    getProductsByCatId,
    createProduct,
    updateProduct,
    deleteProduct
};