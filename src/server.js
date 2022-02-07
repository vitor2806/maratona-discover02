//runs express() creating a express enviroment
const express = require('express');
const server = express();
//imports routes.js
const routes = require('./routes');
const path = require('path');

//sets ejs as project template engine
server.set('view engine', 'ejs');

//This will tell to server that ejs files are avaliable inside __dirname (where server.js is at) + views folder
server.set('views', path.join(__dirname, 'views'));

//sets public folder as static dir to express
server.use(express.static('public'));

//use urlencoded to translate form data (active permission to use req.body)
//IT MUST BE SET BEFORE SERVER.USE(ROUTES)
server.use(express.urlencoded({ extended: true }));

//use routes.js routes to control route acess
server.use(routes);

//server start listening to port 3000, every requisition in this port shall be processed by the server
server.listen(3000, () => {
   console.log('Running...');
});
