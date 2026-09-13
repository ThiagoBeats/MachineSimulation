// ---------------------------------------------------------------------------
// Servidor estatico simples, para conferir o site localmente do mesmo jeito
// que o GitHub Pages vai servir: apenas arquivos, sem nenhuma logica.
//
//   node ferramentas/servir.js [porta]
//
// Depois abra  http://127.0.0.1:8125/
// ---------------------------------------------------------------------------
const http = require('http');
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const PORTA = +(process.argv[2] || 8125);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.view': 'text/html; charset=utf-8', '.content': 'text/html; charset=utf-8',
  '.usercontrol': 'text/html; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.mp4': 'video/mp4',
  '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.wasm': 'application/wasm',
  '.mjs': 'application/javascript; charset=utf-8'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const arquivo = path.join(RAIZ, p.replace(/^\/+/, ''));
  if (!arquivo.startsWith(RAIZ)) { res.writeHead(403); return res.end('forbidden'); }

  fs.stat(arquivo, (err, st) => {
    if (err || !st.isFile()) {
      console.log('  404 ' + p);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('not found');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(arquivo).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(arquivo).pipe(res);
  });
}).listen(PORTA, '127.0.0.1', () => {
  console.log('Servindo ' + RAIZ);
  console.log('  http://127.0.0.1:' + PORTA + '/');
});
