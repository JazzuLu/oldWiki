/**
 * * @2019年8月26日
 * * @author pancras
 * * @describe vue-cli 3.x配置文件
 *  参考：https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE
 */

const path = require('path');

const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  //baseUrl 从 Vue CLI 3.3 起已弃用，请使用publicPath.映射资源url,注意是域名后的子路径上
  publicPath: '/',
  assetsDir: './static',
  //文件名加hash 方便缓存
  filenameHashing:true,
  //关闭jslint检查
  lintOnSave:false,
  //sourceMap 用于追踪编译后的代码到源代码的映射，生产环境下最好禁用
  productionSourceMap:true,
  transpileDependencies:["vuetify"],
  pwa:{
    iconPaths:{
      // favicon32: 'bluebee-logo.png',
      // favicon16: 'bluebee-logo.png',
      // appleTouchIcon: 'bluebee-logo.png',
      // maskIcon: 'bluebee-logo.png',
      // msTileImage: 'bluebee-logo.png'
    }
  },


  //更改webpack 相关的配置
  chainWebpack: config => {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力(使用在移动端)
     */
    // config
    // .plugins
    // .delete('prefetch')
    // .delete('preload')
    // config
    // .entry('main')
    // .add('babel-polyfill')

    //文件路径别名配置
    config
      .resolve
      .alias
      .set('@', resolve('./src/'))
      .set('util', resolve('./src/util'))
      .set('mixins', resolve('./src/mixins'))
    //SVG icon 处理器配置
    config
      .module
      .rule('svg')
      .uses
      .clear()
    config
      .module
      .rule('svg')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons')) //处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    // 修改images loader 添加svg处理
    config
      .module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('@/icons'))
      .end()
    config
      .plugin('html')
      .tap(args=>{
        console.log(args)
        return args
      })
  },

  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      // sass: {
      //     // @/ 是 src/ 的别名
      //     // 所以这里假设你有 `src/variables.scss` 这个文件
      //     data: `@import "@/style/index.scss";`
      // }
      less: {
        javascriptEnabled: true
      }
    }

  },

  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        "windows.jQuery":"jquery"
      })
    ]
  },

  //开发服务器配置
  devServer: {
    host: '0.0.0.0',
    port: 3002,
    compress: false,
    //open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {

      'api': {
        // target: 'http://192.168.0.148:8001',
        target: 'https://bbw.bluebeecloud.com',
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        },
        headers: {
          // Cookie: 'sessionid=uvxx8xatb5xcwdh75i2bs9g60v636toa',
        }
      },
    },
  }
}
