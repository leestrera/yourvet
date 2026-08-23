const fs = require('fs');
const execSync = require('child_process').execSync;
const files = execSync('find app -name "page.tsx" -o -name "layout.tsx"').toString().split('\n').filter(Boolean);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.match(/searchParams\s*:\s*\{\s*message\?:\s*string\s*\}\s*/)) {
    content = content.replace(/searchParams\s*:\s*\{\s*message\?:\s*string\s*\}\s*/g, 'searchParams: Promise<{ message?: string }>');
    content = content.replace(/\bsearchParams\.message\b/g, '(await searchParams).message');
    changed = true;
  }
  
  if (content.match(/searchParams\s*:\s*\{\s*\[key:\s*string\]:\s*string\s*\|\s*string\[\]\s*\|\s*undefined\s*\}/)) {
    content = content.replace(/searchParams\s*:\s*\{\s*\[key:\s*string\]:\s*string\s*\|\s*string\[\]\s*\|\s*undefined\s*\}/g, 'searchParams: Promise<{ [key: string]: string | string[] | undefined }>');
    content = content.replace(/\bsearchParams\./g, '(await searchParams).');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed searchParams in', file);
  }
}
