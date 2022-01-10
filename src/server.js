const express = require('express')
//runs express() creating a express enviroment
const server = express()
//imports routes.js
const routes = require('./routes')

//sets ejs as project template engine
server.set('view engine', 'ejs')

//sets public folder as static dir to express
server.use(express.static('public'))

//use routes.js routes to control route acess
server.use(routes)

//server start listening to port 3000, every requisition in this port shall be processed by the server
server.listen(3000, () => {
   console.log('Running...')
})
