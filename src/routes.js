const express = require('express')
const routes = express.Router()

const viewPath = __dirname + '/views/'

//if i'm using only one line function (like this above, where it content will be only a return) I can use it without {} and return
routes.get('/', (req, res) => res.render(viewPath + 'index'))
routes.get('/job', (req, res) => res.render(viewPath + 'job'))
routes.get('/job/edit', (req, res) => res.render(viewPath + 'job-edit'))
routes.get('/profile', (req, res) => res.render(viewPath + 'profile'))

module.exports = routes
