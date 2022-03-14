rm -rf posts/
cp -R ../Blog/public/ posts/
rm -rf posts/index.xml
cp -R ./index.xml posts/
git add -A
git commit -m "6"
git push -f origin main