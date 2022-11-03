# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹，这里是默认的路径，可以自定义
cd ./public

git init
git add -A
git commit -m

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/D-A-I-H-A-O/MyBlog.git master:blogs

cd -

# 最后发布的时候执行 bash deploy.sh


