@echo off

chcp 65001

cd public/

git add -A

git commit -m 'DAIHAO'

git push -f https://github.com/D-A-I-H-A-O/MyBlog.git main:blogs

