const Job = require('../model/Job');
const Profile = require('../model/Profile');
const JobTools = require('../utils/jobTools');

module.exports = {
   async index(req, res) {
      const jobs = await Job.get();
      const profile = await Profile.get();

      const statusCount = {
         progress: 0,
         done: 0,
         total: jobs.length,
      };

      let jobTotalHours = 0;

      const updatedJobs = jobs.map((job) => {
         const remaining = JobTools.remainingDays(job);
         const status = remaining <= 0 ? 'done' : 'progress'; //check if theres any day left, if isnt then its done, if is then its progress

         statusCount[status]++; //is the same as status == 'done' ? statusCount.done++ : statusCount.progress++;

         //if the job isn't done yet, then get the amount of daily hours from it
         jobTotalHours =
            status == 'progress'
               ? (jobTotalHours += Number(job['daily-hours']))
               : jobTotalHours;

         //js object spread
         return {
            ...job,
            remaining,
            status,
            budget: JobTools.calculateBudget(job, profile['amount-hour']), //if i'm working 10 hours in a project and my amount-hour is R$ 10,00, i'll get R$ 100,00
         };
      });

      const freeTime = profile['hours-per-day'] - jobTotalHours;

      return res.render('index', {
         jobs: updatedJobs,
         profile: profile,
         statusCount: statusCount,
         freeTime: freeTime,
      });
   },
};
