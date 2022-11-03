echo "1. Start build"
npm run build

echo "2. Start submitting code to the local repository"
git add *
 
echo "3. Commit the changes to the local repository"
git commit -m changes
 
echo "4. Push the changes to the remote git server"
git push




