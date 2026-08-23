const fs = require('fs');
const execSync = require('child_process').execSync;
const files = execSync('find app -name "*.tsx" -o -name "*.ts"').toString().split('\n').filter(Boolean);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  const rules = [
    { from: /\.eq\('is_active',\s*1\)/g, to: ".eq('is_active', true)" },
    { from: /\.eq\('is_active',\s*0\)/g, to: ".eq('is_active', false)" },
    { from: /\.eq\('is_approved',\s*1\)/g, to: ".eq('is_approved', true)" },
    { from: /\.eq\('is_approved',\s*0\)/g, to: ".eq('is_approved', false)" },
    { from: /\.eq\('is_featured',\s*1\)/g, to: ".eq('is_featured', true)" },
    { from: /\.eq\('is_featured',\s*0\)/g, to: ".eq('is_featured', false)" },
    { from: /\.eq\('is_published',\s*1\)/g, to: ".eq('is_published', true)" },
    { from: /\.eq\('is_published',\s*0\)/g, to: ".eq('is_published', false)" },
    { from: /\.eq\('is_admin',\s*1\)/g, to: ".eq('is_admin', true)" },
    { from: /\.eq\('is_admin',\s*0\)/g, to: ".eq('is_admin', false)" }
  ];

  for (const rule of rules) {
    if (content.match(rule.from)) {
      content = content.replace(rule.from, rule.to);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed booleans in', file);
  }
}
