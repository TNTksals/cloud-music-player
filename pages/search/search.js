// pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyword: '',
        history_search: [],
        hot_search: [],
        search_res: []
    },

    // 获取热搜列表
    getHotSearch: function () {
        wx.request({
            url: 'https://autumnfish.cn/search/hot/detail',
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    hot_search: res.data.data
                })
            }
        })
    },

    // 输入时保存关键字
    getKeyWord: function(e) {
        // console.log(e.detail.value)
        this.setData({
            keyword: e.detail.value
        })
    },

    // 点击清空输入框和搜索结果
    clearValue: function () {
        this.setData({
            keyword: '',
            search_res: []
        })
    },

    // 输入完成后点击搜索
    getSearchResult: function (e) {
        // console.log(e.detail.value)
        if (e.detail.value.length === 0) {
            this.setData({
                search_res: []
            })
            return
        }
        wx.showLoading({
            title: '数据加载中...',
        })
        let kw = e.detail.value
        wx.request({
            url: 'https://autumnfish.cn/cloudsearch?keywords=' + kw,
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    search_res: res.data.result.songs
                })
                this.saveSearchHistory(kw)
                wx.hideLoading()
            }
        })
    },

    // 保存搜索历史
    saveSearchHistory: function (kw) {
        let st = new Set(this.data.history_search.reverse())
        st.delete(kw)
        st.add(kw)
        this.setData({
            history_search: Array.from(st).reverse()
        })
    },

    // 点击搜索历史关键字搜索
    goToSearch: function(e) {
        // console.log(e.currentTarget.dataset)
        wx.showLoading({
            title: '数据加载中...',
        })
        let kw = e.currentTarget.dataset.kw
        this.setData({
            keyword: kw
        })
        wx.request({
            url: 'https://autumnfish.cn/cloudsearch?keywords=' + kw,
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    search_res: res.data.result.songs
                })
                this.saveSearchHistory(kw)
                wx.hideLoading()
            }
        })
    },

    // 点击清空搜索历史
    clearHistory: function() {
        this.setData({
            history_search: []
        })
    },

    // 点击播放按钮跳转
    playlink: function (e) {
        const index = e.currentTarget.dataset.index
        const songs = this.data.search_res
        let mid = songs[index].id
        // 检测歌曲是否可以播放
        wx.request({
            url: 'https://autumnfish.cn/check/music?id=' + mid,
            method: 'GET',
            complete: (res) => {
                // console.log(res.data)
                if (res.data.message === 'ok') {
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
        this.getHotSearch()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        wx.setNavigationBarTitle({
            title: '搜索',
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
        this.setData({
            hot_search: [],
            search_res: []
        })
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