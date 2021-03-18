// Dependencies
// require the database connection
const { sql, dbConnPoolPromise } = require('../database/db.js');
// models
const Category = require('../models/category.js');

// Define SQL statements here for use in function below
// These are parameterised queries note @named parameters.
// Input parameters are parsed and set before queries are executed

// Get all products from the products table
// for json path - Tell MS SQL to return results as JSON (avoiding the need to convert here)
const SQL_SELECT_ALL = 'SELECT * FROM dbo.category ORDER BY category_name ASC for json path;';

// Get all products
// This is an async function named getProducts defined using ES6 => syntax
let getCategories = async () => {
    // define variable to store products
    let categories;

    // Get a DB connection and execute SQL (uses imported database module)
    // Note await in try/catch block
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // execute query
            .query(SQL_SELECT_ALL);
        
        // first element of the recordset contains products
        categories = result.recordset[0];

    // Catch and log errors to cserver side console 
    } catch (err) {
        console.log('DB Error - get all categories: ', err.message);
    }
    // return products
    return categories;
};
// Export 
module.exports = {
    getCategories
};