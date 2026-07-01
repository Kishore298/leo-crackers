const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        replaceInDir(fullPath);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace single quotes
      if (/'http:\/\/localhost:5000\/api/g.test(content)) {
        content = content.replace(/'http:\/\/localhost:5000\/api/g, 'process.env.REACT_APP_API_URL + \'');
        changed = true;
      }
      
      // Replace backticks
      if (/`http:\/\/localhost:5000\/api/g.test(content)) {
        content = content.replace(/`http:\/\/localhost:5000\/api/g, '`${process.env.REACT_APP_API_URL}');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
console.log('Replacement complete.');
