// index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        background: [],
        hot_singer: [],
        song_sheet: [],
        new_music: []
    },

    // 获取轮播图页面
    getBanners: function () {
        wx.request({
            url: 'https://autumnfish.cn/banner?type=1',
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    background: res.data.banners
                })
            }
        })
    },

    // 获取热门歌手
    getHotSinger: function () {
        wx.request({
            url: 'https://autumnfish.cn/top/artists?offset=0&limit=30',
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    hot_singer: res.data.artists.slice(0, 10)
                })
            }
        })
    },

    // 获取推荐歌单
    getSongSheet: function () {
        wx.request({
            url: 'https://autumnfish.cn/personalized?limit=6',
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    song_sheet: res.data.result
                })
            }
        })
    },

    // 获取最新音乐
    getNewMusic: function () {
        wx.request({
            url: 'https://autumnfish.cn/personalized/newsong',
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    new_music: res.data.result
                })
            }
        })
    },

    // 点击歌手跳转页面
    hotlink: function (e) {
        const index = e.currentTarget.dataset.index
        const singerdata = this.data.hot_singer
        wx.navigateTo({
            url: '/pages/singerdetail/singerdetail',
            success: (res) => {
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: singerdata[index] })
            }
        })
    },

    // 点击歌单跳转
    sheetlink: function(e) {
        const index = e.currentTarget.dataset.index
        const sheet_id = this.data.song_sheet[index].id
        wx.navigateTo({
            url: '/pages/songsheet/songsheet',
            success: (res) => {
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: sheet_id })
            }
        })
    },

    // 点击播放按钮跳转
    playlink: function (e) {
        const index = e.currentTarget.dataset.index
        const song = this.data.new_music
        let mid = song[index].id
        // 检测歌曲是否可以播放
        wx.request({
            url: 'https://autumnfish.cn/check/music?id=' + mid,
            method: 'GET',
            complete: (res) => {
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
                            res.eventChannel.emit('acceptDataFromOpenerPage', { data: objdata })
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

    // 监听页面加载
    onLoad: function (options) {
        this.getBanners()
        this.getHotSinger()
        this.getNewMusic()
        this.getSongSheet()
    },

    // 监听页面初次渲染完成
    onReady: function (options) {

    }
})