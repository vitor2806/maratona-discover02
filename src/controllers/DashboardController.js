const Job = require('../model/Job');
const Profile = require('../model/Profile');
const JobTools = require('../utils/jobTools');

module.exports = {
   index(req, res) {
      const jobs = Job.get();
      const profile = Profile.get();

      const statusCount = {
         progress: 0,
         done: 0,
         total: jobs.length,
      };

      const updatedJobs = jobs.map((job) => {
         const remaining = JobTools.remainingDays(job);
         const status = remaining <= 0 ? 'done' : 'progress'; //check if theres any day left, if isnt then its done, if is then its progress

         statusCount[status]++; //is the same as status == 'done' ? statusCount.done++ : statusCount.progress++;

         //js object spread
         return {
            ...job,
            remaining,
            status,
            budget: JobTools.calculateBudget(job, profile['amount-hour']), //if i'm working 10 hours in a project and my amount-hour is R$ 10,00, i'll get R$ 100,00
         };
      });

      return res.render('index', {
         jobs: updatedJobs,
         profile: profile,
         statusCount: statusCount,
      });
   },
};
