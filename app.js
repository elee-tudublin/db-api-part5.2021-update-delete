// require imports packages required by the application
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Specify Host and port
const HOST = '127.0.0.1';
const PORT = 8080;

// app is a new instance of express (the web app framework)
let app = express();

// adding morgan to log HTTP requests
// app.use(morgan('dev'));

// Application settings
app.use((req, res, next) => {
    // Globally set Content-Type header for the application
    res.setHeader("Content-Type", "application/json");
    next();
}); 

// Allow app to support differnt body content types (using the bodyParser package)
app.use(express.text());
// support json encoded bodies
app.use(express.json());
// support url encoded bodies
app.use(express.urlencoded({
    extended: true 
}));

// cors
// https://www.npmjs.com/package/cors
// https://codesquery.com/enable-cors-nodejs-express-app/
// Simple Usage (Enable All CORS Requests)
app.use(cors({ credentials: true, origin: true }));
app.options('*', cors()); // include before other routes

/* Configure app Routes to handle requests from browser */

// The default route 
app.use('/', require('./controllers/index'));
// route to /product
app.use('/product', require('./controllers/productController'));
// route to /category
app.use('/category', require('./controllers/categoryController'));


// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found: '+ req.method + ":" + req.originalUrl);
    err.status = 404;
    next(err);
});

// Start the HTTP server using HOST address and PORT consts defined above
// Lssten for incoming connections
const server = app.listen(PORT, HOST, () => {
    console.log(`Express server listening on http://localhost:${PORT}`);
});

// export this as a module, making the app object available when imported.
module.exports = app;