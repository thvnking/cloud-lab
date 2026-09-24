const fs = require('fs');
const path = require('path');

const root = __dirname.replace(/\\scripts?$/, '');
const files = [
  path.join(root, 'server', 'server.js'),
  path.join(root, 'server', 'models', 'Student.js'),
  path.join(root, 'client', 'src', 'App.jsx'),
  path.join(root, '.env'),
  path.join(root, 'package.json')
];

const missing = files.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error('Missing files:');
  missing.forEach((file) => console.error('-', file));
  process.exit(1);
}

const envContent = fs.readFileSync(path.join(root, '.env'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const checks = [
  {
    name: 'MONGODB_URI configured',
    pass: /MONGODB_URI\s*=\s*mongodb/i.test(envContent),
  },
  {
    name: 'Server script exists',
    pass: packageJson.scripts && !!packageJson.scripts.start,
  },
  {
    name: 'Student schema includes required fields',
    pass: /studentId|name|email/.test(fs.readFileSync(path.join(root, 'server', 'models', 'Student.js'), 'utf8')),
  },
  {
    name: 'React app has CRUD form',
    pass: /handleSubmit|handleEdit|handleDelete/.test(fs.readFileSync(path.join(root, 'client', 'src', 'App.jsx'), 'utf8')),
  },
];

let allPass = true;
for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} - ${check.name}`);
  if (!check.pass) allPass = false;
}

if (allPass) {
  console.log('\nLab 3 check: SUCCESS');
} else {
  console.log('\nLab 3 check: FAILED');
  process.exit(1);
}
