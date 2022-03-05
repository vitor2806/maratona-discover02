const Job = require('../model/Job');
const Profile = require('../model/Profile');
const Tools = require('../utils/jobTools');

module.exports = {
   create(req, res) {
      return res.render('job');
   },

   async save(req, res) {
      //Will push a new job into jobs array with req.body data
      await Job.create({
         name: req.body.name,
         'daily-hours': req.body['daily-hours'],
         'total-hours': req.body['total-hours'],
         createdAt: Date.now(),
      });

      return res.redirect('/');
   },

   async show(req, res) {
      const jobs = await Job.get();
      const profile = await Profile.get();
      const jobID = req.params.id;
      const job = jobs.find((job) => Number(job.id) === Number(jobID)); //find function will search for a job that matches function parameter, if it matches then true is returned and stored in job const

      if (!job) {
         return res.send('Error: Job not found');
      }

      job.budget = Tools.calculateBudget(job, profile['amount-hour']);
      return res.render('job-edit', { job });
   },

   async update(req, res) {
      const jobID = req.params.id;

      const updatedJob = {
         name: req.body.name,
         'total-hours': req.body['total-hours'],
         'daily-hours': req.body['daily-hours'],
      };

      await Job.update(updatedJob, jobID);

      res.redirect('/job/' + jobID);
   },

   async delete(req, res) {
      const jobID = req.params.id;

      await Job.delete(jobID);

      return res.redirect('/');
   },
};
