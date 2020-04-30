import { stringify as queryStringifed } from 'querystring';
import { NetworkInterfaceInfo, CpuInfo } from 'os';
import fetch from 'node-fetch';
import loadCogFile from '@cisl/cog-loader';

interface CogInterface {
  id: string;
  type: string;
  description: string;
  tags: string[];
  pid: number;
  cwd: string;
  run: string;
  args: string[];
  host: string;
  port: string;
  status: string;
}

interface Machine {
  user: string;
  username: string;
  pid: number;
  platform: string;
  interfaces: NetworkInterfaceInfo[];
  cpus: CpuInfo[];
  memory: number;
  hostname: string;
  connected: boolean;
  lastConnected: string;
  cogs: CogInterface | CogInterface[];
}

interface QueryParams {
  "cogs.id"?: string;
  "cog.tags"?: string;
  "$limit"?: number;
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | undefined | null;
}

interface InstantiatedQueryParams extends QueryParams {
  connected: boolean;
  "cogs.status": string;
  "$unwind": string;
}

class Cog {
  private cog: CogInterface;

  public constructor(cog: CogInterface) {
    this.cog = cog;
  }

  public get host(): string {
    let h = this.cog.host;
    if (h && h.endsWith('/')) {
      h = h.slice(0, -1);
    }
    return h;
  }

  public get port(): string {
    return this.cog.port;
  }

  public url(path: string): string {
    return `${this.host}:${this.port}/${path || ''}`;
  }

  public async httpPost(path: string, data: unknown): Promise<unknown> {
    const headers: {[key: string]: string} = {};
    if (typeof data === 'object') {
      data = JSON.stringify(data);
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(this.url(path), {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    try {
      return await res.json();
    }
    catch (exc) {
      return await res.text();
    }
  }

  public async httpGet(path: string): Promise<unknown> {
    const res = await fetch(this.url(path));
    try {
      return await res.json();
    }
    catch (exc) {
      return await res.text();
    }
  }
}

function isSingleCog(cog: CogInterface | CogInterface[]): cog is CogInterface {
  return 'id' in cog;
}

const config = loadCogFile({});

const url = config.watcher || 'http://localhost:7777';

export async function find(query: string | QueryParams, opts: QueryParams = {}): Promise<Cog[]> {
  const query_obj: InstantiatedQueryParams = Object.assign(
    (typeof query === 'string') ? { 'cogs.id': query } : query,
    opts,
    {
      '$unwind': '$cogs',
      'connected': true,
      'cogs.status': 'running'
    }
  );

  const req = await fetch(`${url}/api/machine?${queryStringifed(query_obj)}`);
  const machines: Machine[] = await req.json();
  if (!machines || machines.length == 0) {
    throw new Error('Could not find any cogs matching query');
  }
  const cogs: Cog[] = [];
  for (const machine of machines) {
    if (isSingleCog(machine.cogs)) {
      cogs.push(new Cog(machine.cogs));
    }
    else {
      for (const cog of machine.cogs) {
        cogs.push(new Cog(cog));
      }
    }
  }
  return cogs;
}

export async function findOne(query: string | QueryParams): Promise<Cog> {
  const cogs = await find(query, {'$limit': 1});
  if (cogs.length === 0) {
    throw new Error(`Could not find cog with that query: ${query}`);
  }
  return cogs[0];
}

export async function findOneAndPost(query: string | QueryParams, path: string, data: unknown): Promise<unknown> {
  const cog = await findOne(query);
  return cog.httpPost(path, data);
}

export async function findOneAndGet(query: string | QueryParams, path: string): Promise<unknown> {
  const cog = await findOne(query);
  return cog.httpGet(path);
}
