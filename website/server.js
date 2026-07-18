const http = require('http');
const fs = require('fs');
const path = require('path');

const websiteRoot = __dirname;
const port = Number(process.env.PORT || 4173);
const host = '127.0.0.1';

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const cleanPath = decodeURIComponent(url.pathname);
  const requestedPath = cleanPath === '/' ? '/index.html' : cleanPath;
  const filePath = path.join(websiteRoot, requestedPath);

  if (!filePath.startsWith(websiteRoot)) {
    return null;
  }

  return filePath;
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequestPath(request.url);

  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, contents) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
    });
    response.end(contents);
  });
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Try PORT=4174 npm run website`);
  } else {
    console.error(error.message);
  }

  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Tafasili website running at http://localhost:${port}`);
  console.log('Press Ctrl+C to stop the website server.');
});
