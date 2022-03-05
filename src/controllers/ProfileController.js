const Profile = require('../model/Profile');

module.exports = {
   async index(req, res) {
      const profile = await Profile.get();
      return res.render('profile', { profile: profile });
   },

   async update(req, res) {
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

      await Profile.update({
         ...(await Profile.get()), //first copy all data from profile
         ...req.body, //then copy all data from req.body
         'amount-hour': amountPerHour, //then add amountPerHour to 'amount-hour' key
      });

      return res.redirect('/profile');
   },
};
