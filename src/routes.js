const express = require('express')
const routes = express.Router()

//if i'm using only one line function (like this above, where it content will be only a return) I can use it without {} and return
routes.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'))
routes.get('/job', (req, res) => res.sendFile(__dirname + '/views/job.html'))
routes.get('/job/edit', (req, res) =>
   res.sendFile(__dirname + '/views/job-edit.html')
)
routes.get('/profile', (req, res) =>
   res.sendFile(__dirname + '/views/profile.html')
)

module.exports = routes
