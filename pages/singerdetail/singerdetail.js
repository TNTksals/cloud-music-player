Page({

    /**
     * 页面的初始数据
     */
    data: {
        singer: {},
        singer_detail: {},
        singer_songs: []
    },

    // 获取歌手详情
    getSingerDetail: function () {
        let sid = this.data.singer.id
        wx.request({
            url: 'https://autumnfish.cn/artist/detail?id=' + sid,
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    singer_detail: res.data.data
                })
            }
        })
    },

    // 获取歌手热门歌曲
    getSingerSongs: function () {
        let sid = this.data.singer.id
        wx.request({
            url: 'https://autumnfish.cn/artist/top/song?id=' + sid,
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    singer_songs: res.data.songs
                })
            }
        })
    },

    // 点击播放按钮跳转
    playlink: function (e) {
        const index = e.currentTarget.dataset.index
        const song = this.data.singer_songs
        let mid = song[index].id
        // 检测歌曲是否可以播放
        wx.request({
            url: 'https://autumnfish.cn/check/music?id=' + mid,
            method: 'GET',
            success: (res) => {
                // console.log(res.data)
                if (res.data.message === 'ok')
                {
                    const objdata = {}
                    objdata.musiclist = song
                    objdata.nowindex = index
                    // console.log(objdata)
                    wx.navigateTo({
                        url: '/pages/play/play',
                        success: (res) => {
                            res.eventChannel.emit('acceptDataFromOpenerPage', {
                                data: objdata
                            })
                        }
                    })
                } 
                else 
                {
                    wx.showModal({
                        showCancel: true,
                        content: '歌曲没有版权，请选择其他歌曲进行播放',
                        title: '提示'
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
          title: '数据加载中...',
        })
        // 获取页面传输过来的歌手基本数据并进行了存储
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', data => {
            // console.log(data)
            this.setData({
                singer: data.data
            })
            this.getSingerDetail()
            this.getSingerSongs()
            wx.hideLoading()
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        wx.setNavigationBarTitle({
            title: this.data.singer.name,
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },
})