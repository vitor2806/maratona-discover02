const express = require('express')
//uses express module to configure server

const routes = express.Router()
//configure file routes through express.Router()

const viewPath = __dirname + '/views/'

const profile = {
   name: 'Vitor',
   avatar: 'https://avatars.githubusercontent.com/u/95248045?v=4',
   'monthly-budget': 4000,
   'days-per-week': 5,
   'hours-per-day': 6,
   'vacations-per-year': 3,
}

const jobs = [
   {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2,
      "total-hours": 60,
      createdAt: Date.now()
   },
   {
      id: 2,
      name: "OneTwo Project",
      "daily-hours": 3,
      "total-hours": 40,
      createdAt: Date.now()
   }
]

//if i'm using only one line function (like this above, where it content will be only a return) I can use it without {} and return
routes.get('/', (req, res) => res.render(viewPath + 'index', {jobs}))
routes.get('/job', (req, res) => res.render(viewPath + 'job'))
//Routes.post will handle post form method
routes.post('/job', (req, res) => {

   const lastElementId = jobs[jobs.length - 1]?.id  || 1 //will search id from jobs if theres no element with id, id will be 1.

   //Will push a new job into jobs array with req.body data
   jobs.push({
      id: lastElementId + 1,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      createdAt: Date.now()
   })
   return res.redirect('/')
})
routes.get('/job/edit', (req, res) => res.render(viewPath + 'job-edit'))
routes.get('/profile', (req, res) => res.render(viewPath + 'profile', { profile }))

module.exports = routes
//export routes
