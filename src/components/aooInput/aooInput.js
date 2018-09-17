// component/aooInput.js
Component({
  behaviors: ['wx://component-export'],
  export() {
    return { value: this.data.textValue }
  },
  properties: {
    backgroundColor: {  //输入框背景色
      type: String,
      value: "#f5f5f5"
    },
    placeholder: String, //占位符
    fontSize: {  //输入字体大小
      type: String,
      value: "30rpx"
    },
    fontColor: {  //输入字体颜色(包括占位符)
      type: String,
      value: "#333"
    },
    maxLength: {  //最大输入长度，设置为-1时不限制最大长度
      type: Number,
      value: 140
    },
    placeholderColor: { //占位符颜色
      type: String,
      value: "#888"
    },
    disabled: {
      type: Boolean,
      value: false
    },
    focus: {
      type: Boolean,
      value: true
    },
    inputType: {
      type: String,
      value: 'number'
    },
    confirmType: {
      type: String,
      value: 'done'
    },
    clearType: {   //清楚按钮的显示规则 normal/always/none
      type: String,
      value: 'normal',
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    inputFocusFlag: false,
    textValue: '',
  },

  methods: {
    getFocus: function (e) {
      this.setData({
        inputFocusFlag: true
      })
    },
    loseFocus: function (e) {
      this.setData({
        inputFocusFlag: false
      });
    },
    countText: function (e) {
      let value = e.detail.value;
      this.setData({
        textValue: value
      });
    },
    clearText: function (e1) {
      console.log('clearText');
      this.setData({
        textValue: ''
      });
    }
  }
})
