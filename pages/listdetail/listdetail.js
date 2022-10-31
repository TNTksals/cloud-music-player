// pages/listdetail/listdetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list_id: 0,
        list_name: '',
        cover_img: '',
        creator_img: '',
        creator_name: '',
        description: '',
        offset: 0,
        song_list: []
    },

    // 获取榜单详情
    getListInfo: function () {
        wx.showLoading({
            title: '数据加载中...',
        })
        let lid = this.data.list_id
        wx.request({
            url: 'https://autumnfish.cn/playlist/detail?id=' + lid,
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    list_name: res.data.playlist.name,
                    cover_img: res.data.playlist.coverImgUrl,
                    creator_img: res.data.playlist.creator.avatarUrl,
                    creator_name: res.data.playlist.creator.nickname,
                    description: res.data.playlist.description,
                })
                this.getListSongs()
            }
        })
    },

    // 获取榜单歌曲
    getListSongs: function () {
        wx.showLoading({
            title: '数据加载中...',
        })
        let sid = this.data.list_id
        let ofs = this.data.offset
        wx.request({
            url: `https://autumnfish.cn/playlist/track/all?id=${sid}&limit=10&offset=${ofs}`,
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    song_list: [...this.data.song_list, ...res.data.songs]
                })
                wx.hideLoading()
            }
        })
    },

    // 点击播放按钮跳转
    playlink: function (e) {
        const index = e.currentTarget.dataset.index
        const song = this.data.music_list
        let mid = song[index].id
        // 检测歌曲是否可以播放
        wx.request({
            url: 'https://autumnfish.cn/check/music?id=' + mid,
            method: 'GET',
            complete: (res) => {
                // console.log(res.data)
                if (res.data.message === 'ok') {
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
        eventChannel.on('acceptDataFromOpenerPage', data => {
            // console.log(data)
            this.setData({
                list_id: data.data
            })
            this.getListInfo()
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
        this.getListSongs()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})