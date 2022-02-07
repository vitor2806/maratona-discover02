//uses express module to configure server
const express = require('express');
//configure file routes through express.Router()
const routes = express.Router();
//imports
const ProfileController = require('./controllers/ProfileController');

//object literal
const Job = {
   data: [
      {
         id: 1,
         name: 'Pizzaria Guloso',
         'daily-hours': 2,
         'total-hours': 4,
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
               budget: Job.tools.calculateBudget(
                  job,
                  Profile.data['amount-hour']
               ), //if i'm working 10 hours in a project and my amount-hour is R$ 10,00, i'll get R$ 100,00
            };
         });

         return res.render('index', { jobs: updatedJobs });
      },

      create(req, res) {
         return res.render('job');
      },

      save(req, res) {
         const lastElementId = Job.data[Job.data.length - 1]?.id || 0; //will search id from jobs if theres no element with id, id will be 1.

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

      show(req, res) {
         const jobID = req.params.id;
         const job = Job.data.find((job) => Number(job.id) === Number(jobID)); //find function will search for a job that matches function parameter, if it matches then true is returned and stored in job const
         if (!job) {
            return res.send('Error: Job not found');
         }

         job.budget = Job.tools.calculateBudget(
            job,
            Profile.data['amount-hour']
         );
         return res.render('job-edit', { job });
      },

      update(req, res) {
         const jobID = req.params.id;
         const job = Job.data.find((job) => Number(job.id) === Number(jobID)); //find function will search for a job that matches function parameter, if it matches then true is returned and stored in job const
         if (!job) {
            return res.send('Error: Job not found');
         }

         const updatedJob = {
            ...job,
            name: req.body.name,
            'total-hours': req.body['total-hours'],
            'daily-hours': req.body['daily-hours'],
         };

         Job.data = Job.data.map((job) => {
            if (Number(job.id) === Number(jobID)) {
               job = updatedJob;
            }
            return job;
         });
         res.redirect('/job/' + jobID);
      },

      delete(req, res) {
         const jobID = req.params.id;
         Job.data = Job.data.filter((job) => Number(job.id) !== Number(jobID)); //filter acts almost as find function, but instead of returning true it will remove it from the list
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

      calculateBudget: (job, amountPerHour) =>
         amountPerHour * job['total-hours'],
   },
};
//map vs foreach
//I can store map returnal into a variable
//I cant store forEach into it

routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save); //Routes.post will handle post form method
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);
routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);

//export routes
module.exports = routes;
