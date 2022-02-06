//uses express module to configure server
const express = require('express');
//configure file routes through express.Router()
const routes = express.Router();
const viewPath = __dirname + '/views/';

//object literal
const Profile = {
   data: {
      name: 'Vitor',
      avatar: 'https://avatars.githubusercontent.com/u/95248045?v=4',
      'monthly-budget': 4000,
      'days-per-week': 5,
      'hours-per-day': 6,
      'vacation-per-year': 3,
      'amount-hour': 75,
   },

   controllers: {
      index(req, res) {
         return res.render(viewPath + 'profile', { profile: Profile.data });
      },

      update(req, res) {
         //req.body to get data
         const data = req.body;

         //weeks in a year
         const weeksInAYear = 52;

         //remove vacation from weeks in a year, getting how much weeks are in a month after it
         const weeksInAMonth = (weeksInAYear - data['vacation-per-year']) / 12;

         //how much hour a week
         const weekTotalHours = data['hours-per-day'] * data['days-per-week'];

         //total hours in a month
         const monthTotalHours = weekTotalHours * weeksInAMonth;

         //amount/hour value
         const amountPerHour = data['monthly-budget'] / monthTotalHours;

         Profile.data = {
            ...Profile.data, //first copy all data from profile
            ...req.body, //then copy all data from req.body
            'amount-hour': amountPerHour, //then add amountPerHour to 'amount-hour' key
         };

         return res.redirect('/profile');
      },
   },
};

//object literal
const Job = {
   data: [
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
   ],

   controllers: {
      index(req, res) {
         const updatedJobs = Job.data.map((job) => {
            const remaining = Job.tools.remainingDays(job);
            const status = remaining <= 0 ? 'done' : 'progress'; //check if theres any day left, if isnt then its done, if is then its progress

            //js object spread
            return {
               ...job,
               remaining,
               status,
               budget: Profile.data['amount-hour'] * job['total-hours'], //if i'm working 10 hours in a project and my amount-hour is R$ 10,00, i'll get R$ 100,00
            };
         });

         return res.render(viewPath + 'index', { jobs: updatedJobs });
      },

      create(req, res) {
         return res.render(viewPath + 'job');
      },

      save(req, res) {
         const lastElementId = Job.data[Job.data.length - 1]?.id || 1; //will search id from jobs if theres no element with id, id will be 1.

         //Will push a new job into jobs array with req.body data
         Job.data.push({
            id: lastElementId + 1,
            name: req.body.name,
            'daily-hours': req.body['daily-hours'],
            'total-hours': req.body['total-hours'],
            createdAt: Date.now(),
         });

         return res.redirect('/');
      },
   },

   tools: {
      remainingDays(job) {
         const dayRemaining = (
            job['total-hours'] / job['daily-hours']
         ).toFixed(); //This will get, i.e.: 40/2 = 20 days to complete
         const createdAt = new Date(job.createdAt); //this will get the DAY that project was started, i.e.: 01/01
         const dueDay = createdAt.getDate() + Number(dayRemaining); //this will get the due day, i.e.: if it was started at 01/01 and I will work 40 hours but 2 by day, 21/01 will be my due day
         const dueDate = createdAt.setDate(dueDay);

         const timeDiff = dueDate - Date.now();
         // 86400000 = 1 day in ms
         const dayMs = 24 * 60 * 60 * 1000;
         const dayDiff = Math.floor(timeDiff / dayMs); //remaining days until last day

         return dayDiff;
      },
   },
};

//map vs foreach
//I can store map returnal into a variable
//I cant store forEach into it

routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save); //Routes.post will handle post form method
routes.get('/job/edit', (req, res) => res.render(viewPath + 'job-edit'));
routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

//export routes
module.exports = routes;
