const router = require('express').Router();

// require the category service
const categoryService = require('../services/categoryService.js');

// GET listing of all categories
// Address http://server:port/category
// returns JSON
router.get('/', async (req, res) => {

    // Get categories
    try {
        // Call the category service to get a list of categories
        // getcategories() is an async function so use await
        const result = await categoryService.getCategories();
        // send json result via HTTP
        res.json(result);

      // Catch and send any errors  
      } catch (err) {
        res.status(500);
        res.send(err.message);
      }
});

// Export as a module
module.exports = router;