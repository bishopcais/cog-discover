"use strict"

const
  request = require('request'),
  querystring = require('querystring'),
  _ = require('underscore');


class Discover {
  constructor(opts) {
    if (!opts.url) {
      throw 'The watcher url is requried';
    }
    this.url = opts.url;
  }

  find(query, cb, opts) {
    query = _.extend(
      { '$unwind': '$cogs' },
      (typeof query == 'string' ? { 'cogs.id': query } : query),
      opts
    );
    query['cogs.status'] = 'running';

    var url = `${this.url}/api/machine?${querystring.stringify(query)}`;

    request(url, (err, response, body) => {
      if (err) {
        return cb('Error processing request');
      }

      try {
        var machines = JSON.parse(body).entries;
        var map = _.map(machines, (machine) => {
          return new Cog(machine.cogs);
        });
      }
      catch(err) {
        return cb('Error processing json'); 
      }
      cb(null, map);
    });
  }

  findOne(query, cb) {
    this.find(query, function(err, cogs){
      if (err) {
        return cb(err);
      }
      return cb(null, cogs[0]);
    }, { '$limit': 1 });
  }

  findOneAndPost(query, path, data, cb) {
    this.findOne(query, (err, cog) => {
      if (err) {
        return cb(err);
      }
      if (!cog) {
        return cb('Cog not found');
      }
      cog.httpPost(path, data, cb);
    });
  }

  findOneAndGet(query, path, cb) {
    this.findOne(query, (err, cog) => {
      if (err) {
        return cb(err);
      }
      if (!cog) {
        return cb('Cog not found');
      }
      cog.httpGet(path, cb);
    });
  }
}

class Cog{
  constructor(json) {
    this.json = json;
  }

  get host() {
    var h = this.json.host;
    if (h && h.endsWith('/')) {
      h = h.slice(0, -1);
    }
    return h;
  }

  get port() {
    return this.json.port;
  }

  url(path) {
    return `${this.host}:${this.port}/${path || ''}`;
  }

  httpPost(path, data, cb) {
    return request.post({
      url: this.url(path),
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }, cb);
  }

  httpGet(path, cb) {
    return request.get({ url: this.url(path) }, cb);
  }
}

module.exports = Discover;