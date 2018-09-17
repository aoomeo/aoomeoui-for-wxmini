/**
 * 多图上传组件：
 * created by : qianjun on 2018/09/05
 * description:
 * @param imgUrls ['',''] --> images [imageObj] imageObj:uuid, url ,status ,percent ,filePath
 */
Component({
  properties: {
    url: String,

    maxSize: {
      type: Number,
      value: 6,
    },

    imageSize: {
      type: Number,
      value: 180,
    },

    imgUrls: { //将String数组 转成 对象数组
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal != null && newVal != undefined) {
          let images = [];
          for (let i = 0; i < newVal.length; i++) {
            let imageObj = {
              uuid: this._createUUID(),
              url: newVal[i],
              status: 'success'
            }
            images.push(imageObj);
          }
          this.setData({
            images: images
          });
        }
      }
    }
  },

  data: {
    images: [],
  },

  attached: function () {
    this.data.uploadTaskMap = new Map();
  },

  detached: function () {
    if (this.uploadTaskMap != null && this.uploadTaskMap != undefined) {
      this.uploadTaskMap.forEach(function (item, key, mapObj) {
        if (item != null) {
          item.abort();
        }
      });
      this.uploadTaskMap.clear();
    }
  },

  methods: {
    /**
     * 删除图片，当删除正在上传的图片时，要把网络请求abort
     */
    removeImg: function (e) {
      let uuid = e.currentTarget.dataset.uuid;
      if (this.data.uploadTaskMap.get(uuid) != null) {
        let uploadTask = this.data.uploadTaskMap.get(uuid);
        uploadTask.abort();
        this.data.uploadTaskMap.delete(uuid);
      }
      let index = this._getIndexByUUID(uuid);
      this.data.images.splice(index, 1);
      this.setData({
        images: this.data.images
      });
    },
    /**
     * 选择图片 
     */
    chooseImg: function () {
      let self = this;
      wx.chooseImage({
        count: 1,
        success: function (res) {
          let tempFilePaths = res.tempFilePaths;
          const uuid = self._createUUID();
          let imgObj = {
            uuid: uuid,
            filePath: tempFilePaths[0],
            status: 'pending',
            percent: 0,
          }
          self.data.images.push(imgObj);
          self.setData({
            images: self.data.images
          });
          const uploadTask = wx.uploadFile({
            url: self.data.url,
            filePath: tempFilePaths[0],
            name: 'picture',
            success: function (res) {
              if (res.statusCode === 200) {
                let responseData = JSON.parse(res.data);
                let url = responseData.obj.imageUrl;
                let imageObj = self._getItemByUUID(uuid);
                imageObj.status = 'success';
                imageObj.url = url;
                self.setData({
                  images: self.data.images
                });
                wx.showToast({
                  title: '图片上传成功！',
                  icon: 'success'
                });
                self.data.uploadTaskMap.delete(uuid);
              } else {
                let images = self.data.images;
                let index = self._getIndexByUUID(uuid);
                images.splice(index, 1);
                self.setData({
                  images: images
                });
                wx.showToast({
                  title: '图片上传失败！',
                  icon: 'none'
                });
                self.data.uploadTaskMap.delete(uuid);
              }
            },
            fail: function (err) {
              if (err.errMsg === 'uploadFile:fail abort') {
                return;
              }
              let images = self.data.images;
              let index = self._getIndexByUUID(uuid);
              images.splice(index, 1);
              self.setData({
                images: images
              });
              wx.showToast({
                title: '图片上传失败！',
                icon: 'none'
              });
              self.data.uploadTaskMap.delete(uuid);
            }
          });

          self.data.uploadTaskMap.set(uuid, uploadTask);

          uploadTask.onProgressUpdate((res) => {
            let imageObj = self._getItemByUUID(uuid);
            imageObj.percent = res.progress;
            self.setData({
              images: self.data.images
            });
          });

        },
      })
    },

    /**
     * public
     * 判断是否上传都已完成 
     */
    isUploadCompleted: function () {
      for (let i = 0; i < this.data.images.length; i++) {
        let imageObject = this.data.images[i];
        if (imageObject.status !== 'success') {
          return false;
        }
      }
      return true;
    },

    /**
     * public
     * 获取图片列表
     */
    getImageList: function () {
      let arrays = [];
      for (let i = 0; i < this.data.images.length; i++) {
        arrays.push(this.data.images[i].url);
      }
      return arrays;
    },

    /**
     * UUID: 13位时间戳 + 3位随机数
     */
    _createUUID: function () {
      return String(new Date().getTime()) + Math.round(Math.random() * 900 + 100);
    },
    _getItemByUUID: function (uuid) {
      for (let i = 0; i < this.data.images.length; i++) {
        if (uuid == this.data.images[i].uuid) {
          return this.data.images[i];
        }
      }
      return null;
    },
    _getIndexByUUID: function (uuid) {
      for (let i = 0; i < this.data.images.length; i++) {
        if (uuid == this.data.images[i].uuid) {
          return i;
        }
      }
      return null;
    }
  },
})