# my-project

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 配置eslint

- .eslintrc.js 中增加规则

```js
// 不检查console
'no-console': 'off',
// 不检查结束的,
"comma-dangle": [2, "never"],
```

## 配置package.json中 使用eslint修改代码格式

```js
"lintfix": "eslint --ext .js,.vue src --fix",
```

## 合并分支

```bash
# 查看分支
$ git branch

# 切换分支
$ git checkout master

# 合并分支
$ git merge dev-index

# 把master分支的更新推送给远程服务器
$ git push origin master

# 删除分支
$ git branch -d dev-index

# 创建和切换分支

$ git branch dev-role
$ git checkout dev-role

# 或者

$ git branch -b dev-role


# 创建远程分支，当push的时候会自动创建

$ git push origin dev-role

# 查看所有分支包括远程分支

$ git branch -a

# 删除远程分支

$ git push origin --delete dev-role
```