//uses express module to configure server
const express = require('express');
//configure file routes through express.Router()
const routes = express.Router();
//imports
const ProfileController = require('./controllers/ProfileController');
const JobController = require('./controllers/JobController');
const DashboardController = require('./controllers/DashboardController');

routes.get('/', DashboardController.index);
routes.get('/job', JobController.create);
routes.post('/job', JobController.save); //Routes.post will handle post form method
routes.get('/job/:id', JobController.show);
routes.post('/job/:id', JobController.update);
routes.post('/job/delete/:id', JobController.delete);
routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);

//export routes
module.exports = routes;
