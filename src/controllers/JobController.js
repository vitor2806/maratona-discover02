const Job = require('../model/Job');
const Profile = require('../model/Profile');
const Tools = require('../utils/jobTools');

module.exports = {
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

      //remove jobs to add updated job data into a new variable then do Job.update(variable) to update job data
      const newData = jobs.map((job) => {
         if (Number(job.id) === Number(jobID)) {
            job = updatedJob;
         }
         return job;
      });

      Job.update(newData);

      res.redirect('/job/' + jobID);
   },

   delete(req, res) {
      const jobID = req.params.id;

      Job.delete(jobID);

      return res.redirect('/');
   },
};
