# dev

## install react project

```sh
npx create-react-app super-design
```

## cd your project

```sh
cd super-design
```

## install storybook

```sh
npx -p @storybook/cli sb init --type react_scripts --use-npm
```

## install dependencies

```sh
npm i @storybook/addon-storysource -D
```

## run storybook

```sh
npm run storybook
```

## css in js

```sh
npm install  styled-components @types/styled-components -D
```
## polished

> 为了在styled-components里像scss等预处理器一样写常用函数，还需要安装下polished这个库。

```sh
npm install --save polished
```