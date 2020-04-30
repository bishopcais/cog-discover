# @cisl/cog-discover

Get information and get/post for cogs running under cog-server.

## Usage

Include it in your code:

```js
const discover = require('@cisl/crun-discover');
// or typescript
import discover from '@cisl/crun-discover';
```

Find cogs by id

```js
discover.find('<cog-id>'.then((cogs) => {
  // code
});
```

Find one cog by id

```js
discover.findOne('<cog-id>').then((cog) => {
  // code
});
```


POST request to the cog

```js
cog.httpPost(path, data).then((response) => {
  // code
});
```

GET request from the cog

```js
cog.httpGet(path).then((response) => {
  // code
});
```

GET directly from one cog

```js
discover.findOneAndGet('<cog-id>', path).then((response) => {
  // code
});
```

POST directly to one cog

```js
discover.findOneAndPost('<cog-id>', path, data).then((response) => {
  // code
});
```

Advanced find queries could be used instead of cog-id.

```js
discover.find({ 'cogs.tags': 'red' }).then(cogs => {
  // code
});
```
