const express = require('express');
const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();


(async () => {
  await app.prepare();
  const server = express();
  const registerI18n = require('./i18n')
  registerI18n(server)
  

  server.get('*', (req, res) => handle(req, res));

  await server.listen(3000);
  console.log(`> Ready on http://localhost:3000`);
})();
