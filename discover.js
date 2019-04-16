'use strict';

const fs = require('fs');
const request = require('request');
const querystring = require('querystring');

class Discover {
  constructor() {
    let configFile = 'cog.json';
    let config = {};
    if (fs.existsSync(configFile)) {
      config = JSON.parse(fs.readFileSync(configFile, {encoding: 'utf-8'}));
    }

    this.url = config.watcher || 'http://localhost:7777';
  }

  find(query, opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {};
      query = Object.assign(
        {'$unwind': '$cogs'},
        (typeof query === 'string') ? { 'cogs.id': query } : query,
        opts
      );
      query['connected'] = true;
      query['cogs.status'] = 'running';

      let url = `${this.url}/api/machine?${querystring.stringify(query)}`;

      request(url, (err, response, body) => {
        if (err) {
          reject('Error processing request');
        }

        let machines;
        try {
          machines = JSON.parse(body).entries;
        }
        catch (err) {
          reject('Error processing json');
        }
        if (!machines || machines.length === 0) {
          reject('Could not find any cogs matching query');
          return;
        }
        let map = machines.map((machine) => {
          return new Cog(machine.cogs);
        });
        resolve(map);
      });
    });
  }

  findOne(query) {
    return new Promise((resolve, reject) => {
      this.find(query, { '$limit': 1 })
        .then((cogs) => resolve(cogs[0]))
        .catch((err) => reject(err));
    });
  }

  findOneAndPost(query, path, data, cb) {
    this.findOne(query).then((cog) => {
      if (!cog) {
        throw new Error('Cog not found');
      }
      return cog.httpPost(path, data);
    });
  }

  findOneAndGet(query, path, cb) {
    this.findOne(query).then((cog) => {
      if (!cog) {
        throw new Error('Cog not found');
      }
      return cog.httpGet(path);
    });
  }
}

class Cog {
  constructor(json) {
    this.json = json;
  }

  get host() {
    let h = this.json.host;
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

  httpPost(path, data) {
    return new Promise((resolve, reject) => {
      request.post({
        url: this.url(path),
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
      }, (err, response, body) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response, body);
      });
    });
  }

  httpGet(path) {
    return new Promise((resolve, reject) => {
      request.get({ url: this.url(path) }, (err, response, body) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response, body);
      });
    });
  }
}

module.exports = new Discover();
