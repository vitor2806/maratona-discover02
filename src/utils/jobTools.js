module.exports = {
   remainingDays(job) {
      const dayRemaining = (job['total-hours'] / job['daily-hours']).toFixed(); //This will get, i.e.: 40/2 = 20 days to complete
      const createdAt = new Date(job.createdAt); //this will get the DAY that project was started, i.e.: 01/01
      const dueDay = createdAt.getDate() + Number(dayRemaining); //this will get the due day, i.e.: if it was started at 01/01 and I will work 40 hours but 2 by day, 21/01 will be my due day
      const dueDate = createdAt.setDate(dueDay);

      const timeDiff = dueDate - Date.now();
      // 86400000 = 1 day in ms
      const dayMs = 24 * 60 * 60 * 1000;
      const dayDiff = Math.floor(timeDiff / dayMs); //remaining days until last day

      return dayDiff;
   },

   calculateBudget: (job, amountPerHour) => amountPerHour * job['total-hours'],
};
