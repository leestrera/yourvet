const fs = require('fs');
const path = require('path');

function findActions(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findActions(filePath, fileList);
    } else if (file === 'actions.ts') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const adminDir = path.join(__dirname, 'app', 'admin');
const actionFiles = findActions(adminDir);

const authCheckStr = `
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
`;

let updated = 0;

actionFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Quick and dirty way to inject auth check after createClient() if it's not there
  if (content.includes('createClient()') && !content.includes('Unauthorized')) {
    content = content.replace(/(const supabase = await createClient\(\);)/g, `$1\n${authCheckStr}`);
    fs.writeFileSync(file, content);
    updated++;
    console.log('Secured:', file);
  }
});

console.log(`Updated ${updated} action files with strict auth checks.`);
