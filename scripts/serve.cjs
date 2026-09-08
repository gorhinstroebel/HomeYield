const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream');
const { assets } = require('./build-frontend.cjs');
const { localAsset, localRelease } = require('./local-downloads.cjs');

const root = path.resolve(__dirname, '..');
const allowed = new Set(assets);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function createPreviewServer(directory = root) {
  return http.createServer((request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const asset = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (['GET', 'HEAD'].includes(request.method) && (pathname === '/local-downloads.json' || pathname.startsWith('/local-downloads/'))) {
      try {
        if (pathname === '/local-downloads.json') {
          const data = JSON.stringify(localRelease(directory));
          response.writeHead(200, { 'Content-Type': types['.json'], 'Cache-Control': 'no-store' });
          response.end(request.method === 'HEAD' ? undefined : data);
          return;
        }
        const download = localAsset(directory, pathname.slice('/local-downloads/'.length));
        if (!download) {
          response.writeHead(404);
          response.end('Installer not available');
          return;
        }
        response.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Length': download.size,
          'Content-Disposition': `attachment; filename="${download.name}"`,
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        });
        if (request.method === 'HEAD') response.end();
        else pipeline(fs.createReadStream(download.filename), response, (error) => {
          if (error) console.error('HomeYield installer transfer failed.', error);
        });
      } catch (error) {
        console.error('HomeYield could not read local installers.', error);
        response.writeHead(500);
        response.end('Could not read local installers. See server output for details.');
      }
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method) || !allowed.has(asset)) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    fs.readFile(path.join(directory, asset), (error, data) => {
      if (error) {
        if (error.code !== 'ENOENT') console.error('HomeYield could not read frontend asset.', error);
        response.writeHead(error.code === 'ENOENT' ? 404 : 500);
        response.end(error.code === 'ENOENT' ? 'Not found' : 'Could not read frontend asset');
        return;
      }
      response.writeHead(200, {
        'Content-Type': types[path.extname(asset)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      const content = asset === 'downloads.html'
        ? data.toString('utf8').replace('name="homeyield-download-source" content="github"', 'name="homeyield-download-source" content="local"')
        : data;
      response.end(request.method === 'HEAD' ? undefined : content);
    });
  });
}

if (require.main === module) {
  const server = createPreviewServer();
  const host = process.env.TAURI_DEV_HOST || '127.0.0.1';
  server.listen(Number(process.env.PORT || 4173), host, () => {
    console.log(`HomeYield: http://${host}:${server.address().port}`);
  });
}

module.exports = { createPreviewServer };
