const express = require('express')
const server = express()

server.get('/', (req, res) => {
   console.log('Im here')

   return res.send('Hello')
})

server.listen(3000, () => {
   console.log('Running...')
})
