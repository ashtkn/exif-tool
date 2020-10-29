# EXIFツール

## 概要

以下のことを一括で行います．

* EXIF情報の削除された画像ファイルを出力する．
* 画像ファイルのEXIF情報を読み取り，JSONファイルとして出力する．出力する情報は以下のとおりです．
  * `filename`: ファイル名
  * `imageWidth`: 幅（ピクセル）
  * `imageHeight`: 高さ（ピクセル）
  * `cameraMaker`: カメラのメーカー
  * `cameraModel`: カメラのモデル
  * `lens`: レンズ
  * `createDate`: 撮影日
  * `modifyDate`: 更新日
  * `creatorTool`: 画像を出力したソフトウェア
  * `focalLength`: 焦点距離
  * `exposureTime`: 露光時間
  * `fNumber`: F値
  * `isoSpeedRatings`: ISO感度

## セットアップ

* 画像のEXIF情報を編集するソフトウェア`jhead`をコンピュータにインストールする．
  * Macの場合は，`brew install jhead`でインストールできます．
* プロジェクトルートディレクトリで，`npm i`を実行し，必要なパッケージをインストールする．

## 使い方

1. `images`ディレクトリにEXIF情報が入っている画像ファイルを置いてください．
2. シェルスクリプト`run.sh`を実行してください．
3. `exports`ディレクトリにEXIF情報が入ったJSONファイルとEXIF情報が削除された画像ファイルが出力されます．
