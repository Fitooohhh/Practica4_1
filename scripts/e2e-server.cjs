const { spawn } = require('node:child_process');
const path = require('node:path');

const tsxCli = require.resolve('tsx/cli');
const viteCli = path.resolve(path.dirname(require.resolve('vite')), '../../bin/vite.js');
const api = spawn(process.execPath, [tsxCli, 'apps/server/src/server.ts'], { env: { ...process.env, PORT: '4000', REPOSITORY_MODE: 'memory' }, stdio: 'inherit' });
const web = spawn(process.execPath, [viteCli, '--config', 'vite.config.ts', '--host', '127.0.0.1'], { stdio: 'inherit' });
const stop = () => { api.kill(); web.kill(); };
process.on('SIGINT', stop); process.on('SIGTERM', stop); process.on('exit', stop);
