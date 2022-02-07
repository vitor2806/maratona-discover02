//map vs foreach
//I can store map returnal into a variable
//I cant store forEach into it
let data = {
   name: 'Vitor',
   avatar: 'https://avatars.githubusercontent.com/u/95248045?v=4',
   'monthly-budget': 4000,
   'days-per-week': 5,
   'hours-per-day': 6,
   'vacation-per-year': 3,
   'amount-hour': 75,
};

module.exports = {
   get() {
      return data;
   },

   update(newData) {
      data = newData;
   },
};
