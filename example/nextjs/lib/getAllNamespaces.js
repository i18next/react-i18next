const fs = require('fs');

function getAllNamespaces(path) {
  const ns = [];
  fs.readdirSync(path).forEach(file => {
    ns.push(file.replace('.json', ''));
  });
  return ns;
}

module.exports = getAllNamespaces;
