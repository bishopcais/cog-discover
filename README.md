# @cisl/crun-discover

Get information and get/post for cogs running under crun-server.

## Usage
Include it in your code:
```js
const discover = require('@cisl/crun-discover');
```

Find cogs by id
```js
discover.find('<cog-id>'.then((cogs) => {
  ...
});
```

Find one cog by id
```js
discover.findOne('<cog-id>').then((cog) => {
  ...
});
```


POST request to the cog
```js
cog.httpPost(path, data).then((response, body) => {
  ...
}).catch((error) => {
  ...
});
```

GET request from the cog
```js
cog.httpGet(path).then((response, body) => {
  ...
}).catch((error) => {
  ...
});
```

GET directly from one cog
```js
discover.findOneAndGet('<cog-id>', path).then((response, body) => {
  ...
}).catch((error) => {
  ...
});
```

POST directly to one cog 
```js
discover.findOneAndPost('<cog-id>', path, data,).then((response, body) => {
  ...
}).catch((error) => {
  ...
});
```

Advanced find queries could be used instead of cog-id.
```js
discover.find({ 'cogs.tags': 'red' }, function(err, cogs) {
  ...
});
```
