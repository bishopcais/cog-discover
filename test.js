var Discover = require ('./discover');

var dc = new Discover({ url: 'http://localhost:7777' });

dc.findOne({ 'cogs.tags': 'green' }, function(err, cog) {
  cog.httpGet('api', (err, res, body) =>{
    if (err) return console.log(err);
    console.log(body);
  });
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
