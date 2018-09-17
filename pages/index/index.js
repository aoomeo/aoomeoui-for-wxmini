//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
  },

  onLoad: function () {
   console.log(this.selectComponent('#upload'));
  },
  getValue:function(){
    console.log(this.selectComponent('#input').value)
  }
 
})
