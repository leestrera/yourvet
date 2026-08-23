const fs = require('fs');
const glob = require('glob'); // Not available by default, but we have find

const execSync = require('child_process').execSync;
const files = execSync('find app/admin -name "page.tsx" -o -name "route.ts"').toString().split('\n').filter(Boolean);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('params }: { params: { id: string } }')) {
    content = content.replace('params }: { params: { id: string } }', 'params }: { params: Promise<{ id: string }> }');
    // Replace const id = params.id or const postId = params.id
    content = content.replace(/=\s*params\.id/g, '= (await params).id');
    // Replace params.id in template literals or object accesses
    content = content.replace(/\bparams\.id\b/g, '(await params).id');
    changed = true;
  }
  
  // also check for petId
  if (content.includes('params }: { params: { id: string, petId: string } }')) {
    content = content.replace('params }: { params: { id: string, petId: string } }', 'params }: { params: Promise<{ id: string, petId: string }> }');
    content = content.replace(/\bparams\.id\b/g, '(await params).id');
    content = content.replace(/\bparams\.petId\b/g, '(await params).petId');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
