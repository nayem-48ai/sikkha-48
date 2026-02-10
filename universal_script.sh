null
null
ZIP_FILE=$(ls *.zip | head -n 1)
if [ -f "$ZIP_FILE" ]; then
  unzip -o "$ZIP_FILE" -d .
  rm "$ZIP_FILE"
fi

node -e "
const fs = require('fs');
const filePath = fs.readdirSync('.').find(f => f.startsWith('vite.config.'));
if (filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('base:')) {
    content = content.replace(/return\s*\{/, \"return {\n      base: './',\");
    fs.writeFileSync(filePath, content);
    console.log('Successfully fixed base path in ' + filePath);
  }
}
"

git config --global user.name "github-actions[bot]"
git config --global user.email "github-actions[bot]@users.noreply.github.com"
git add .
git diff --quiet && git diff --staged --quiet || (git commit -m "fix: added base path for github pages" && git push origin main)

npm install
npm run build
touch dist/.nojekyll

# আপনার দেওয়া লিঙ্ক থেকে ফাইলটি ডাউনলোড করে dist ফোল্ডারে README.md নামে রাখা হচ্ছে
curl -L https://raw.githubusercontent.com/nayem-48ai/nayem-48ai/refs/heads/tnx_bd/README.md -o dist/README.md

null
