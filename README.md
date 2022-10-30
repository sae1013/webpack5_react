# Webpack

### 리액트 개발환경 세팅하면서 웹팩 알아보기

### 1. 웹팩 설치

- npm install -D webpack webpack-cli

### 2. HTML 로더 ,플러그인을 통해 테스트하기

(index.html에 빌드된 js파일이 defer 속성으로 자동으로 주입되는것을 확인)

```jsx
//webpack.config.js
const path = require('path');
const webpack = require('webpack')

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
		filename: '[name].webpack.bundle.js',
  },
  module: {
    rules:[
      {
        test: /\.html$/,
        use:[
          {
            loader:"html-loader",
            options:{minimize:true}
          }
        ]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.ProgressPlugin()
  ],

};

// 설명
// HtmlWebpackPlugin : 웹팩으로 빌드한 결과물로 HTML 파일을 생성해주는 플러그인
// ProgressPlugin : 웹팩의 빌드 진행율을 표시해주는 플러그인
```

### 3. 바벨을 설치하여 리액트 코드를 트랜스파일 할 수 있도록 세팅

```jsx
//.babelrc

{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

### 4. 바벨로더를 웹팩 로더에 추가한다. (컴파일, 번들링 전에 바벨로더를 먼저 태움)

이제, CSS로더를 활용해서 CSS도 번들링 해보자

### 5. CSS 로더 사용하기

먼저, style을 import 해오도록 한다 (웹팩 번들링을 위해서)

```jsx
// src/App.js

import React from 'react';
import './style/App.css';

function App(props) {
  return (
    <div className={"App"}>
      웹팩 보일러플레이트를 직접 세팅합니다.
    </div>
  );
}

export default App;
```

여기서 npm run build 를 돌리면, css파일을 해석하지 못한다(찾을수없다)는 에러가 뜬다.

따라서 CSS 로더를 사용해서, 번들링 전에, 변환을 해주어야한다.

```jsx
.module:{
	...
	{
		test: /\.css$/,
    use: [MiniCssExtractPlugin.loader,'css-loader'] // 실행은 오른쪽 -> 왼쪽 순서, 
	}
},
plugins:[
    ...
    new MiniCssExtractPlugin({
      filename:'style.css' // 이름을 지정안해주면, main.css란 파일명으로 번들링된다.
    })
  ],

// css-loader, MiniCssExtractPlugin.loader로 css 파일을 읽고, MiniCssExtract Plugin 을 통해, 번들링한 css파일을 뽑아낸다.
```

이렇게 설정을 하고, build를 하면, dist/index.html 에도 자동으로 style sheet가 주입되는걸 확인할 수 있다.

또한 여러개의 파일이 하나의 css파일로 번들링 된다.

```jsx
// dist/style.css 
/*!*********************************************************************!*\
  !*** css ./node_modules/css-loader/dist/cjs.js!./src/style/App.css ***!
  \*********************************************************************/
.App {
    color:red;
    font-size: 1rem;
}
/*!**********************************************************************!*\
  !*** css ./node_modules/css-loader/dist/cjs.js!./src/style/App2.css ***!
  \**********************************************************************/
.App2 {
    color:white;
}
```

### 6. SASS (SCSS) 사용하기

실무에서 npm run build를 하면 , node-sass , sass-loader 버전 의존성, 호환성에 의해 웹팩개발서버를 띄울때 흔하게 에러를 볼 수 있다. node-sass 때문에 애먹은적이 있는데, node-sass , sass-loader, node, webpack 버전은 서로 의존성을 갖고있기 때문에 하나를 버전 업하려면 줄줄이 호환성을 맞춰주어야 한다.

### Sass Loader

npm install sass-loader node-sass

```jsx
{
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
//sass-loader -> css-loader -> MiniCssExtractPlugin.loader 순으로 해석한다.
```

 이제 scss파일, css 파일이 모두 하나의 css 파일안에 번들링 된다

### Post CSS Loader

### 7. WebpackDevServer (개발서버)

여기까지 진행하면서, 계속 npm 스크립트를 통해 일반 빌드를 수행하고, live-server로 dist/index.html을 확인 했다. 이제 파일에 변경점이 생길때마다 자동으로 빌드를 하고, 개발서버를 띄워주도록 설정해보자

**참고 ) WebpackDevserver를 통한 빌드 vs 일반 웹팩빌드 차이점**

개발서버 빌드는, 결과물이 메모리에 저장되는 인메모리 빌드 방식이라서 파일로 생성하지않기때문에, dist/ 에서 볼 수 없다.

따라서 실제결과물을 직접 확인하려면 웹팩 명령어를 통해 이전처럼 빌드결과물을 파일로 생성해야한다.

**Why 인메모리 빌드 방식인가?** 

파일 입출력의 속도보다, 메모리 입출력이 빠르고 리소스소모가 적다고 한다.

webpack 설정파일에 devServer를 추가한다. 아래는 현재까지의 최종 코드이다.

개발서버로 띄울 페이지는, dist/index.html 파일이다.

```jsx
const path = require('path');
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack.bundle.js',
  },
	devServer: { // 개발서버 추가
	    static: {
	      directory:path.join(__dirname,'dist'), // /dist/index.html 파일을 serve
	    },
	    compress: true,
	    port: 3000
  },
  module: {
    rules:[
      {
        test:/\.(js|jsx)$/,
        exclude: "/node_modules",
        use:['babel-loader']
      },
      {
        test: /\.html$/,
        use:[
          {
            loader:"html-loader",
            options:{minimize:true}
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader,'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename:'style.css'
    })
  ],

};

// 설명
// HtmlWebpackPlugin : 웹팩으로 빌드한 결과물로 HTML 파일을 생성해주는 플러그인
// ProgressPlugin : 웹팩의 빌드 진행율을 표시해주는 플러그인
```

```jsx
//package.json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "start": "webpack-dev-server"
  },
```

package.json 의 스크립트 명령어에 webpack-dev-server 를 추가한다. 

“ —hot “ 은 webpack4 이후버전부터는,HMR(Hot Module Replacement)이 이미 내장되어있기 때문에 안붙여도 된다고한다. 

비활성화 하려면, 명시적으로 only 설정을 붙인다.

```jsx
module.exports = {
  //...
  devServer: {
    hot: 'only', 
  },
};
```

---

### 8.빌드전 Dist 폴더  Clean-up 하기

현재 세팅에따르면, 번들링된 파일은 /dist 에 생성된다. 하지만 새로운 엔트리 파일을 추가하거나, 이름을 변경하여 빌드를 한다면, 이전 빌드결과물에 누적되어 새롭게 생성된다.

output 설정에 clean 을 추가하면, 빌드결과물을 dist에 떨구기전에, clean 작업을 수행한다. 

```jsx
module.exports = {
   entry: {
     test: './src/index.js', // 생성되는 file 이름을 index->test로 변경
   },
   output: {
     filename: '[name].webpack.bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true, 
   },
 };
```

 webpack v4 이상부터  따로 clean-webpack-plguin 을 추가할 필요가 없다.

---

### 9. 개발환경(dev, prod) 분리

개발환경에 따라 웹팩의 빌드 최적화 여부가 결정된다. 따라서 보통 dev , prod 개발환경을 분리하여 세팅한다.

- development
    
    webpack.config.dev.js 생성
    
    ```jsx
    const path = require('path');
    const webpack = require('webpack')
    const webpackDevServer = require('webpack-dev-server');
    const MiniCssExtractPlugin = require("mini-css-extract-plugin");
    
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    
    module.exports = {
      mode:'development',
      entry: {
        index: './src/index.js'
      },
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].webpack.bundle.js',
        clean:true
      },
      devServer: {
        static: {
          directory:path.join(__dirname,'dist'),
        },
        compress: true,
        port: 3000
      },
      module: {
        rules:[
          {
            test:/\.(js|jsx)$/,
            exclude: "/node_modules",
            use:['babel-loader']
          },
          {
            test: /\.html$/,
            use:[
              {
                loader:"html-loader",
                options:{minimize:true}
              }
            ]
          },
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader,'css-loader']
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
          }
        ]
      },
      plugins:[
        new HtmlWebpackPlugin({
          template: './public/index.html',
          filename: 'index.html'
        }),
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
          filename:'style.css'
        })
      ],
    
    };
    ```
    
- production
    
    webpack.config.prod.js 생성
    

```jsx
const path = require('path');
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode:'production',
  ... 위와 동일
};
```

```jsx
//package.json
// 명령어 참고 https://webpack.kr/api/cli/#config-path
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start:dev": "webpack-dev-server --config ./webpack.config.dev.js",
    "start:prd": "webpack-dev-server --config ./webpack.config.prod.js",
    "build:dev": "webpack --config webpack.config.dev",
    "build:prd": "webpack --config webpack.config.prod"
  },
```

## 10. 소스맵

참고: [https://webpack.kr/configuration/devtool](https://webpack.kr/configuration/devtool)

복호화 사이트: [https://www.convertstring.com/ko/EncodeDecode/Base64Decode](https://www.convertstring.com/ko/EncodeDecode/Base64Decode)

소스 맵(Source Map)이란 압축된 파일과 원본 파일을 서로 연결시켜주는 기능이다.

번들링된 압축된 파일로 디버깅을 할수없으니, 개발코드를 복원시켜 개발자가 디버깅을 할 수 있도록 도와준다.

따라서 코드노출 보안상, 개발단계에서 사용하게 된다. 

번들된 파일을 뜯어보면, 보통 주석으로 `sourceMappingURL` =”인코딩된 문자열” 로 표현하는데

그러면 웹 브라우저가 이를 인식하고, 암호화된 문자열을 해석하여, 원본코드를 복원하게 된다. 

원본코드를 따로 네트워크에 요청해서 받아오는게 아니라, 모듈(파일)을 문자열로 암호화하고, 번들링 된 파일의sourceMappingURL에 삽입한다. 이 URL을 이용하여  코드를 복호화하여 파일을  그대로 복호화하는 기술 이다. 

설정에따라 bundle파일에 소스매핑이 다 포함될수도있고, 소스맵 파일을 따로생성하여 분리할 수도 있다. 

아래는, ‘inline-source-map’ 으로 설정하여 번들링한 index.bundle.js 파일이다.

사용하는 노드모듈을 포함한 js파일들이 인코딩되어 아래에 포함된다.

- inline-source-map 을 사용해서 빌드했을때

![스크린샷 2022-10-30 오후 8 49 25](https://user-images.githubusercontent.com/63229394/198887805-031d97e8-abf2-4b2a-ac71-95bbb2ddce37.png)

- eval-source-map 을 사용해서 빌드 했을 때
    
이번엔 웹팩에서 개발모드 소스맵에 추천하는 eval-source-map을 사용했을때이다. 
    
![스크린샷 2022-10-30 오후 8 58 51](https://user-images.githubusercontent.com/63229394/198887808-b0e54034-c321-4313-a76f-1b9379a2e620.png)
    
문자열을 다시 Base64로 디코딩하게되면, 소스맵을 확인할 수 있다.
    
![스크린샷 2022-10-30 오후 9 00 49](https://user-images.githubusercontent.com/63229394/198887786-ba52552e-4e72-4d5e-87b5-ac8f27fda7ee.png)

    
원본 파일이름이 App.js 라는 내용과,  sourcesContent에 App.js의 코드가 그대로 들어가있다. 

브라우저가 위처럼 복호화하여, src 디렉토리 하위에 App.js파일을 생성하고 코드내용을 복원하게된다. 
    

```jsx
//webpack.config.dev.js
module.exports = {
  mode:'development',
  entry: {
    index: './src/index.js'
  },
  devtool:'inline-source-map', // 추가
}
```

여기까지가 아주 간단한 ‘기본적’인 세팅 

---

### 세팅에 필요한 모듈

```jsx
    "@babel/preset-env": "^7.19.4",
    "@babel/preset-react": "^7.18.6",
    "babel-loader": "^9.0.0",
    "css-loader": "^6.7.1",
    "html-loader": "^4.2.0",
    "html-webpack-plugin": "^5.5.0",
    "mini-css-extract-plugin": "^2.6.1",
    "node-sass": "^7.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sass-loader": "^13.1.0",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.11.1"
```

