const Job = require('../model/Job');
const Profile = require('../model/Profile');
const Tools = require('../utils/jobTools');

module.exports = {
   index(req, res) {
      const jobs = Job.get();
      const profile = Profile.get();

      const updatedJobs = jobs.map((job) => {
         const remaining = Tools.remainingDays(job);
         const status = remaining <= 0 ? 'done' : 'progress'; //check if theres any day left, if isnt then its done, if is then its progress

         //js object spread
         return {
            ...job,
            remaining,
            status,
            budget: Tools.calculateBudget(job, profile['amount-hour']), //if i'm working 10 hours in a project and my amount-hour is R$ 10,00, i'll get R$ 100,00
         };
      });

      return res.render('index', { jobs: updatedJobs });
   },

   create(req, res) {
      return res.render('job');
   },

   save(req, res) {
      const jobs = Job.get();
      const lastElementId = jobs[jobs.length - 1]?.id || 0; //will search id from jobs if theres no element with id, id will be 1.

      //Will push a new job into jobs array with req.body data
      jobs.push({
         id: lastElementId + 1,
         name: req.body.name,
         'daily-hours': req.body['daily-hours'],
         'total-hours': req.body['total-hours'],
         createdAt: Date.now(),
      });

      return res.redirect('/');
   },

   show(req, res) {
      const jobs = Job.get();
      const profile = Profile.get();
      const jobID = req.params.id;
      const job = jobs.find((job) => Number(job.id) === Number(jobID)); //find function will search for a job that matches function parameter, if it matches then true is returned and stored in job const

      if (!job) {
         return res.send('Error: Job not found');
      }

      job.budget = Tools.calculateBudget(job, profile['amount-hour']);
      return res.render('job-edit', { job });
   },

   update(req, res) {
      const jobs = Job.get();
      const jobID = req.params.id;
      const job = jobs.find((job) => Number(job.id) === Number(jobID)); //find function will search for a job that matches function parameter, if it matches then true is returned and stored in job const
      if (!job) {
         return res.send('Error: Job not found');
      }

      const updatedJob = {
         ...job,
         name: req.body.name,
         'total-hours': req.body['total-hours'],
         'daily-hours': req.body['daily-hours'],
      };

      jobs = jobs.map((job) => {
         if (Number(job.id) === Number(jobID)) {
            job = updatedJob;
         }
         return job;
      });
      res.redirect('/job/' + jobID);
   },

   delete(req, res) {
      const jobs = Job.get();
      const jobID = req.params.id;
      jobs = jobs.filter((job) => Number(job.id) !== Number(jobID)); //filter acts almost as find function, but instead of returning true it will remove it from the list
      return res.redirect('/');
   },
};
