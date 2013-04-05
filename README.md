# doubanIMDb

豆瓣电影 + IMDb + 烂番茄

![screenshots](http://i.imgur.com/U6MGE.jpg)	

这里是chrome extension的源代码

Firefox和Opera用户，你可以安装这个[userscript](http://userscripts.org/scripts/show/103552)


## Features

* IMDb的电影评分
* IMDb TOP250
* 烂番茄TOMATOMETER

##Todos

* 增加加载数据过程中的过度效果

##Development

这个扩展用[coffeescript](http://coffeescript.org/)编写, 你需要coffeescript的编译器来完成开发。

* 安装node.js和npm
* 安装coffeescript编译器 `npm install -g coffee-script`
* 在开发中, 可使用 `cake build` 将 `src/` 中的 coffeescript 源文件编译成对应的 javascript 文件到`build/中`, `cake watch` 动态检测文件变化并编译。

##Contributor

* @seansay
* @ayanamist

##Feedback

请使用Issues来反馈你遇到的问题;)

##License

doubanIMDb以MIT license发布

* [http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)