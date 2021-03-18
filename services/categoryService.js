// Dependencies

// require the database connection
const categoryRepository = require('../repositories/categoryRepository.js');

// Get all products via the repository
// return products
let getCategories = async () => {
    const categories = await categoryRepository.getCategories();
    return categories;
};

// Module exports
// expose these functions
module.exports = {
    getCategories,
};