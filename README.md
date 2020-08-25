# [Super Design](http://alexshan.com/) &middot; ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg) [![Coverage Status](https://coveralls.io/repos/github/AlexShan2008/super-design/badge.svg)](https://coveralls.io/github/AlexShan2008/super-design)

An React UI library with React components use TypeScript and storybook

## NPM 安装

```sh
cd your-project
npm i super-design styled-components --save
```

## 引入 `super-design` 

在你所需要的页面，引入所需组件即可：

```jsx
import { Button } from 'super-design'

function App() {
  return (
    <div className="App">
      <Button>Super Design</Button>
    </div>
  );
}
```

## 运行组件 Demo

```sh
git clone https://github.com/AlexShan2008/super-design
npm i
npm run storybook
```