// pages/songsheet/songsheet.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sheet_id: 0,
        sheet_info: {},
        sheet_songs: [],
        offset: 0
    },

    // 获取歌单详情
    getSheetInfo: function () {
        wx.showLoading({
            title: '数据加载中...',
        })
        let sid = this.data.sheet_id
        wx.request({
            url: 'https://autumnfish.cn/playlist/detail?id=' + sid,
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    sheet_info: res.data.playlist
                })
                this.getSheetSongs()
            }
        })
    },

    // 获取推荐歌单歌曲
    getSheetSongs: function () {
        wx.showLoading({
            title: '数据加载中...',
        })
        let sid = this.data.sheet_id
        let ofs = this.data.offset
        wx.request({
            url: `https://autumnfish.cn/playlist/track/all?id=${sid}&limit=20&offset=${ofs}`,
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    sheet_songs: [...this.data.sheet_songs, ...res.data.songs]
                })
                wx.hideLoading()
            }
        })
    },

    // 点击播放按钮跳转
    playlink: function (e) {
        const index = e.currentTarget.dataset.index
        const songs = this.data.sheet_songs
        let mid = songs[index].id
        // 检测歌曲是否可以播放
        wx.request({
            url: 'https://autumnfish.cn/check/music?id=' + mid,
            method: 'GET',
            success: (res) => {
                // console.log(res.data)
                if (res.data.message == 'ok') {
                    const objdata = {}
                    objdata.musiclist = songs
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
                } else {
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
    onLoad(options) {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', sheetdata => {
            // console.log(sheetdata)
            this.setData({
                sheet_id: sheetdata.data
            })
            this.getSheetInfo()
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

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
        this.setData({
            offset: this.data.offset + 10
        })
        this.getSheetSongs()
    }
})