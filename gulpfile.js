//gulp本体
const { src, dest, watch, series, parallel } = require('gulp');

//html
const ejs = require('gulp-ejs');                       //EJSのコンパイル
const htmlbeautify = require('gulp-html-beautify')     //HTMLの整形
const htmlmin = require('gulp-htmlmin');               //HTMLの圧縮

//sass・CSS
const sass = require('gulp-sass')(require('sass'));    // Sassのコンパイル
const plumber = require('gulp-plumber');               //エラーが発生しても強制終了させない
const notify = require('gulp-notify');                 //エラー発生時のアラート出力
const postcss = require('gulp-postcss');               //postCSS
const autoprefixer = require('autoprefixer');          //ベンダープレフィックス付与
const cleancss = require('gulp-clean-css');            //CSSの圧縮
const rename = require('gulp-rename');                 //ファイル名変更

//javaScript
const uglify = require('gulp-uglify');                 //JSファイルの圧縮

//画像圧縮
const imagemin = require('gulp-imagemin');             //png、jpeg、gif、svgをロスレス圧縮
const imageminMozjpeg = require('imagemin-mozjpeg');   //jpegを不可逆圧縮
const imageminPngquant = require('imagemin-pngquant'); //pngを不可逆圧縮
const imageminSvgo = require('imagemin-svgo');         //svgを不可逆圧縮
const changed = require('gulp-changed');               //変更されたファイルだけ起動
const webp = require('gulp-webp');                     //WebPに変換

//ファイル監視
const browserSync = require('browser-sync');

//ファイル削除
const clean = require('gulp-clean');


//参照元パス
const srcBase = 'src';
const srcPath = {
  html:   srcBase + '/**/*.html',
  ejs:    srcBase + '/ejs/**/*.ejs',
  _ejs:   '!' + srcBase + '/ejs/**/_*.ejs',
  sass:   srcBase + '/assets/sass/**/*.scss',
  js:     srcBase + '/assets/js/*.js',
  img:    srcBase + '/assets/img/**/*',
}

//出力先パス
const distBase = 'dist';
const destPath = {
  html:   distBase + '/',
  css:    distBase + '/assets/css/',
  js:     distBase + '/assets/js/',
  img:    distBase + '/assets/img/',
}

//削除したいファイルパス
const cleanPath = {
  all:    distBase,
  assets: distBase + '/assets/',
  html:   distBase + '/**/*.html',
}



//////////////////////// Task ////////////////////////

//html
const html = () => {
  return src(srcPath.html)
  .pipe(dest(destPath.html))
}


//htmlの圧縮
const htmlMin = () => {
  return src(destPath.html + '/**/*.html')
  .pipe(
    htmlmin({//HTMLの圧縮
      removeComments: true, //コメントを削除
      collapseWhitespace: true, //余白を詰める
      collapseInlineTagWhitespace: true //inline要素間のスペース削除（spanタグ同士の改行などを詰める
    })
  )
  .pipe(dest(destPath.html))
}


//EJSのコンパイル
const ejsCompile = () => {
  return src([srcPath.ejs, srcPath._ejs]) //参照元
  .pipe( //エラーが出ても処理を止めない
    plumber({
      errorHandler: notify.onError('Error:<%= error.message %>')
    })
  )
  .pipe(ejs())
  .pipe(htmlbeautify({
    'indent_size': 2, //インデント幅を指定
    'content_unformatted': ['head', 'body', 'pre', 'span'], //整形を適用しないタグを指定
    'extra_liners': [], //html、head、bodyタグで改行を適用しない
  }))
  .pipe(rename({ extname: '.html' }))
  .pipe(dest(destPath.html));
}


//sassのコンパイル
const sassCompile = () => {
  return src(srcPath.sass, { //コンパイル元
    sourcemaps: true
  })
  .pipe( //エラーが出ても処理を止めない
    plumber({
      errorHandler: notify.onError('Error:<%= error.message %>')
    })
  )
  .pipe(sass({ outputStyle: 'expanded' })) //フォーマット指定
  .pipe(postcss([autoprefixer()]))  //ベンダープレフィックス付与
  .pipe(dest(destPath.css, { sourcemaps: '/' })) //コンパイル先
  .pipe(browserSync.stream()) //変更があった所のみコンパイル
  .pipe(notify({
    message: 'Sassをコンパイルしました',
    onLast: true
  }))
}


//cssのminファイルを生成
const cssMin = () => {
  return src(['dist/assets/css/*.css', '!dist/assets/css/*.min.css'], { //参照元
    sourcemaps: true
  })
  .pipe(cleancss())
  .pipe(
    rename({
      extname: '.min.css' //拡張子を.min.cssに変換
    })
  )
  .pipe(dest(destPath.css, { sourcemaps: '/' })) //出力先
  .pipe(browserSync.stream()) //変更があった所のみコンパイル
}


//js
const js = () => {
  return src(srcPath.js)
  .pipe(dest(destPath.js))
}

//jsの圧縮
const jsMin = () => {
  return src(srcPath.js) //参照元
  .pipe( //エラーが出ても処理を止めない
    plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    })
  )
  .pipe(uglify()) //js圧縮
  .pipe(
    rename({
      extname: '.min.js'
    })
  )
  .pipe(dest(destPath.js))
}


//画像の圧縮
const imgMin = () => {
  return src(srcPath.img)  //参照元
  .pipe(changed(destPath.img))  //変更のあったファイルのみ
  .pipe(
    imagemin(
      [
        imageminMozjpeg({ quality: 70 }),
        imageminPngquant({ quality: [.65, .70] }),
        imageminSvgo({
          removeViewBox: false,
        })
      ],
      {
        verbose: true //メタ情報削除
      }
    )
  )
  .pipe(dest(destPath.img))
}


//画像をWebPへ変換
const webP = () => {
  return src(srcPath.img + '*.{jpg,jpeg,png}') //参照元
  .pipe(webp())
  .pipe(dest(destPath.img))
}


//ローカルサーバー立ち上げ
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
}

const browserSyncOption = {
  server : {
    baseDir : 'dist', //ルート
    index : 'index.html',
  },
  open: true,
  reloadOnRestart: true,
}

//ブラウザリロード
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
}


// 全ファイル削除
const cleanAll = () => {
  return src(cleanPath.all)
  .pipe(clean());
}

// assetsフォルダを削除
const cleanAssets = () => {
  return src(cleanPath.assets)
  .pipe(clean());
}

// htmlファイルを削除
const cleanHtml = () => {
  return src(cleanPath.html)
  .pipe(clean());
}


//ファイル監視
const watchFiles = () => {
  watch(srcPath.html, series(html, browserSyncReload))
  watch(srcPath.ejs, series(ejsCompile, browserSyncReload))
  watch(srcPath.sass, series(sassCompile, cssMin, browserSyncReload))
  watch(srcPath.js, series(js, browserSyncReload))
  watch(srcPath.img, series(imgMin, browserSyncReload))
}


//処理をまとめて実行
exports.default = series(
  series(html, ejsCompile, sassCompile, cssMin, js, imgMin),
  parallel(watchFiles, browserSyncFunc)
);


//ファイル削除コマンド
exports.cleanAll = series(cleanAll);
exports.cleanAssets = series(cleanAssets);
exports.cleanHtml = series(cleanHtml);

//画像をWebP変換コマンド
exports.webP = series(webP);

//HTMLファイルの圧縮コマンド
exports.htmlMin = series(htmlMin);

//JSファイルの圧縮コマンド
exports.jsMin = series(jsMin);
