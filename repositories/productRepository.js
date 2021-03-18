// Dependencies

// require the database connection
const { sql, dbConnPoolPromise } = require('../database/db.js');

// models
const Product = require('../models/product.js');

// Define SQL statements here for use in function below
// These are parameterised queries note @named parameters.
// Input parameters are parsed and set before queries are executed

// Get all products from the products table
// for json path - Tell MS SQL to return results as JSON (avoiding the need to convert here)
const SQL_SELECT_ALL = 'SELECT * FROM dbo.product ORDER BY product_name ASC for json path;';

// Get a single product matching a id, @id
// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_ID = 'SELECT * FROM dbo.product WHERE _id = @id for json path, without_array_wrapper;';

// Get all products from a category (by its id @id)
// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_CATID = 'SELECT * FROM dbo.product WHERE category_id = @id ORDER BY product_name ASC for json path;';

// Second statement (Select...) returns inserted record identified by _id = SCOPE_IDENTITY()
const SQL_INSERT = 'INSERT INTO dbo.product (category_id, product_name, product_description, product_stock, product_price) VALUES (@categoryId, @productName, @productDescription, @ProductStock, @ProductPrice); SELECT * from dbo.product WHERE _id = SCOPE_IDENTITY();';
const SQL_UPDATE = 'UPDATE dbo.product SET category_id = @categoryId, product_name = @productName, product_description = @productDescription, Product_stock = @ProductStock, Product_price = @ProductPrice WHERE _id = @id; SELECT * FROM dbo.product WHERE _id = @id;';
const SQL_DELETE = 'DELETE FROM dbo.product WHERE _id = @id;';

// Get all products
// This is an async function named getProducts defined using ES6 => syntax
let getProducts = async () => {

    // define variable to store products
    let products;

    // Get a DB connection and execute SQL (uses imported database module)
    // Note await in try/catch block
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // execute query
            .query(SQL_SELECT_ALL);

        // first element of the recordset contains products
        products = result.recordset[0];
        console.log(products);

        // Catch and log errors to cserver side console 
    } catch (err) {
        console.log('DB Error - get all products: ', err.message);
    }

    // return products
    return products;
};

// get product by id
// This is an async function named getProductById defined using ES6 => syntax
let getProductById = async (productId) => {

    let product;

    // returns a single product with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, productId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        product = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get product by id: ', err.message);
    }

    // return the product
    return product;
};

// Get products by category
let getProductsByCatId = async (categoryId) => {

    let products;

    // returns products with matching category id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set named parameter(s) in query
            .input('id', sql.Int, categoryId)
            // execute query
            .query(SQL_SELECT_BY_CATID);

        // Send response with JSON result    
        products = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get product by category id: ', err.message);
    }

    return products;
};

// insert/ create a new product
// parameter: a validated product model object
let createProduct = async (product) => {

    // Declare constanrs and variables
    let insertedProduct;

    // Insert a new product
    // Note: no Product yet
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set named parameter(s) in query
            // checks for potential sql injection
            .input('categoryId', sql.Int, product.category_id)
            .input('productName', sql.NVarChar, product.product_name)
            .input('productDescription', sql.NVarChar, product.product_description)
            .input('productStock', sql.Int, product.product_stock)
            .input('productPrice', sql.Decimal, product.product_price)

            // Execute Query
            .query(SQL_INSERT);

        // The newly inserted product is returned by the query    
        insertedProduct = result.recordset[0];

        // catch and log DB errors
    } catch (err) {
        console.log('DB Error - error inserting a new product: ', err.message);
    }

    // Return the product data
    return insertedProduct;
};

// update an existing product
let updateProduct = async (product) => {
    // An empty variable for the updated product
    let updatedProduct;

    // Update an existing product
    // Note: no Product yet
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()

            // set named parameter(s) in query
            // checks for potential sql injection
            .input('id', sql.Int, product._id)
            .input('categoryId', sql.Int, product.category_id)
            .input('productName', sql.NVarChar, product.product_name)
            .input('productDescription', sql.NVarChar, product.product_description)
            .input('productStock', sql.Int, product.product_stock)
            .input('productPrice', sql.Decimal, product.product_price)

            // Execute Query
            .query(SQL_UPDATE);

        // The newly inserted product is returned by the query    
        updatedProduct = result.recordset[0];

        // catch and log DB errors
    } catch (err) {
        console.log('DB Error - error updating product: ', err.message);
    }
    // Return the updated product data
    return updatedProduct;
};

// delete a product
let deleteProduct = async (productId) => {
    // record how many rows were deleted  > 0 = success
    let rowsAffected = 0;
    // returns a single product with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, productId)
            // execute query
            .query(SQL_DELETE);

        // Was the product deleted?    
        rowsAffected = Number(result.rowsAffected);
    } catch (err) {
        console.log('DB Error - get product by id: ', err.message);
    }
    // Nothing deleted
    if (rowsAffected === 0)
        return false;
    // successful delete
    return true;
};

// Export 
module.exports = {
    getProducts,
    getProductById,
    getProductsByCatId,
    createProduct,
    updateProduct,
    deleteProduct
};
