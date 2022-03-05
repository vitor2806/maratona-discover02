const Database = require('../db/config');

//map vs foreach
//I can store map returnal into a variable
//I cant store forEach into it
module.exports = {
   async get() {
      const db = await Database();

      //get only returns one info.
      //ATTENTION: data has value_hour, front end has value-hour
      const data = await db.get(`SELECT * FROM profile`);

      await db.close();

      return {
         name: data.name,
         avatar: data.avatar,
         'monthly-budget': data.monthly_budget,
         'amount-hour': data.value_hour,
         'days-per-week': data.days_per_week,
         'hours-per-day': data.hours_per_day,
         'vacation-per-year': data.vacation_per_year,
      };
   },

   async update(newData) {
      const db = await Database();

      db.run(`UPDATE profile SET
         name = "${newData.name}",
         avatar = "${newData.avatar}",
         monthly_budget = ${newData['monthly-budget']},
         days_per_week = ${newData['days-per-week']},
         vacation_per_year = ${newData['vacation-per-year']},
         hours_per_day = ${newData['hours-per-day']},
         value_hour = ${newData['amount-hour']}
      `);

      await db.close();
   },
};
