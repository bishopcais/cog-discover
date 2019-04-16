'use strict';

const discover = require('./discover');

discover.findOne({'cogs.tags': 'transcript-displayer'}).then(cog => {
  console.log(cog);
});

// dc.findOneAndPost('delta', 'api', { message: 'testing2' }, (err, res, body) =>{
//   if (err) return console.log(err);
//   console.log(body);
// });


// dc.findOne({ 'cogs.type': 'Delta' }, function(err, cog) {
//   cog.httpPost('api', { message: 'testing3' }, (err, res, body) =>{
//     if (err) return console.log(err);
//     console.log(body);
//   });
// });
