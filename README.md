# gulp

Web制作の案件で使うために構築した、gulpの開発環境です。
HTML・CSS・JavaScript・画像の処理をまとめて自動化しています。

※現在の開発では、主にViteやNext.jsを使用しています。

## 使用技術

gulp / Sass / EJS / PostCSS（Autoprefixer）/ Browsersync

## できること

- EJSでヘッダー・フッターなどを共通化してHTMLを生成
- Sassのコンパイル、ベンダープレフィックスの付与、CSSの圧縮
- JavaScriptの圧縮
- 画像の圧縮とWebPへの変換
- Browsersyncによる、ファイル保存時のブラウザ自動更新

## Sassのディレクトリ構成

```
sass/
├── foundation/   # リセットCSS、ベースのスタイル
├── global/       # 変数、mixin
├── layout/       # レイアウト
├── page/         # ページごとのスタイル
└── utility/      # 余白や配置などのユーティリティクラス
```
