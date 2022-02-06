const express = require('express');
//uses express module to configure server

const routes = express.Router();
//configure file routes through express.Router()

const viewPath = __dirname + '/views/';

const profile = {
   name: 'Vitor',
   avatar: 'https://avatars.githubusercontent.com/u/95248045?v=4',
   'monthly-budget': 4000,
   'days-per-week': 5,
   'hours-per-day': 6,
   'vacations-per-year': 3,
   'amount-hour': 75,
};

const jobs = [
   {
      id: 1,
      name: 'Pizzaria Guloso',
      'daily-hours': 2,
      'total-hours': 1,
      createdAt: Date.now(),
   },
   {
      id: 2,
      name: 'OneTwo Project',
      'daily-hours': 3,
      'total-hours': 40,
      createdAt: Date.now(),
   },
];

function remainingDays(job) {
   const dayRemaining = (job['total-hours'] / job['daily-hours']).toFixed(); //This will get, i.e.: 40/2 = 20 days to complete
   const createdAt = new Date(job.createdAt); //this will get the DAY that project was started, i.e.: 01/01
   const dueDay = createdAt.getDate() + Number(dayRemaining); //this will get the due day, i.e.: if it was started at 01/01 and I will work 40 hours but 2 by day, 21/01 will be my due day
   const dueDate = createdAt.setDate(dueDay);

   const timeDiff = dueDate - Date.now();
   // 86400000 = 1 day in ms
   const dayMs = 24 * 60 * 60 * 1000;
   const dayDiff = Math.floor(timeDiff / dayMs); //remaining days until last day

   return dayDiff;
}

//map vs foreach
//I can store map returnal into a variable
//I cant store forEach into it
routes.get('/', (req, res) => {
   const updatedJobs = jobs.map((job) => {
      const remaining = remainingDays(job);
      const status = remaining <= 0 ? 'done' : 'progress'; //check if theres any day left, if isnt then its done, if is then its progress

      //js object spread
      return {
         ...job,
         remaining,
         status,
         budget: profile['amount-hour'] * job['total-hours'], //if i'm working 10 hours in a project and my amount-hour is R$ 10,00, i'll get R$ 100,00
      };
   });
   return res.render(viewPath + 'index', { jobs: updatedJobs });
});

routes.get('/job', (req, res) => res.render(viewPath + 'job'));
//Routes.post will handle post form method
routes.post('/job', (req, res) => {
   const lastElementId = jobs[jobs.length - 1]?.id || 1; //will search id from jobs if theres no element with id, id will be 1.

   //Will push a new job into jobs array with req.body data
   jobs.push({
      id: lastElementId + 1,
      name: req.body.name,
      'daily-hours': req.body['daily-hours'],
      'total-hours': req.body['total-hours'],
      createdAt: Date.now(),
   });
   return res.redirect('/');
});
routes.get('/job/edit', (req, res) => res.render(viewPath + 'job-edit'));
routes.get('/profile', (req, res) =>
   res.render(viewPath + 'profile', { profile })
);

//export routes
module.exports = routes;
