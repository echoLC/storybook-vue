## Overview
markdown-editor is a markdown editor based on vue.js.

## Install 
```bash
npm install markdown-editor --save
```    

```javascript
import MarkdownEditor from 'markdown-editor'
```

Register component:
```javascript
Vue.component('markdown-editor', MarkdownEditor)
```

## Usage
```html
<markdown-editor v-model="content" :qiniu="qiniu"></markdown-editor>
```

## Options

| Options | type | Descriptions |
| --- | --- | --- |
| id | string | 初始化编辑器dom元素的id |
| options | object| 编辑器的一些配置，例如:toolbarItems，详情查阅[tui.editor](https://github.com/nhnent/tui.editor) |
| height | string | 初始化编辑器的高度，例如:300px |
| language | string | 编辑器的语言，例如:zh_CN，en_US |
| qiniu | object | 七牛相关信息，主要包括，token， host，uploadDomain（上传文件到七牛的域名）信息，例如: {token: 'xxx', uploadDomain: 'http://up-z2.qiniu.com', host: 'http://qn.xx.com/'}，如果有配置上传图片的功能，必填 |
| prefix | string | 上传图片的prefix，例如:texas/article/ |

