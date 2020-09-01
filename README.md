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
import { GlobalStyle,  Avatar, Badge, Button, Icon, Radio, Highlight, Tree, Upload, Modal } from 'super-design'

const source = [
    {
        value: "北京分行",
        children: [
            {
                value: "朝阳支行办事处",
                children: [
                    { value: "朝阳支行办事处-1" },
                    { value: "朝阳支行办事处-2" },
                ],
            },
            { value: "海淀支行办事处" },
            { value: "石景山支行办事处" },
        ],
    },
    {
        value: "天津分行",
        children: [
            { value: "和平支行办事处" },
            { value: "河东支行办事处" },
            { value: "南开支行办事处" },
        ],
    },
];

function App() {
  return (
    <div className="App">

      <GlobalStyle />
      <Avatar size='large' username='Alex' />
      <Badge>I am a badge</Badge>
      <Radio label='帅气' />
      <Button>Super Design</Button>
      <Highlight>Super Design</Highlight>
      <Icon icon='watch' color='white' />
      <Tree source={source} />
      <Upload />
      <Modal />

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