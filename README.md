#Discover Module for Cog Runner (crun)

Discover module lets you discover cogs that're registered and running on a crun server.

###How to use

Require package by
```js
  Discover = require('crun.discover')
```

Initialize module by
```js
  var dc = new Discover({ url: '<watcher_url>' });
```

Find cogs by id
```js
  dc.find('<cog-id>', function(err, cogs) {
    var cog = cogs[0];
    cog.host
    cog.port
    ...
  });
```

Find one cog by id
```js
  dc.findOne('<cog-id>', function(err, cog) {
    cog.host
    cog.port
    ...
  });
```


POST request to the cog
```js
  cog.httpPost(path, data, function(error, response, body) {
    ...
  });
```

GET request from the cog
```js
  cog.httpGet(path, function(error, response, body){
    ...
  });
```

GET directly from one cog
```js
  dc.findOneAndGet('<cog-id>', path, function(error, response, body) {
    ...
  });
```

POST directly to one cog 
```js
  dc.findOneAndPost('<cog-id>', path, data, function(error, response, body) {
    ...
  });
```

Advanced find queries could be used instead of cog-id.
```js
  dc.find({ 'cogs.tags': 'red' }, function(err, cogs) {
    ...
  });
```
