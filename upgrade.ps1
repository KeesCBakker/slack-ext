echo "Upgrading NCU:"
npm install -g npm-check-updates

cd packages

echo "Upgrading handlebars-a-la-json:"
cd handlebars-a-la-json
ncu -u
npm install
cd ..

echo "Upgrading handlebars-dir:"
cd handlebars-dir
ncu -u
npm install
cd ..

echo "Upgrading slack-ext-dialog:"
cd slack-ext-dialog
ncu -u
npm install
cd ..

echo "Upgrading slack-ext-updatable-message:"
cd slack-ext-updatable-message
ncu -u
npm install
cd ..

echo "Upgrading root:"
cd ..
ncu -u
npm install

echo "Building & testing:"
npm run build
npm test

git add .
git commit -m "Packages upgrade"

echo "Ready!"