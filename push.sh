#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

git add -A
git commit -m 'deploy'

### imporant 注意替换 如果发布到 https://<USERNAME>.github.io/<REPO>
git push 

cd -