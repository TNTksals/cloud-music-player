// pages/find/find.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hot_list: [],
        top_list: []
    },

    // 获取热搜列表
    getHotSearch: function () {
        wx.request({
            url: 'https://autumnfish.cn/search/hot',
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    hot_list: res.data.result.hots
                })
            }
        })
    },

    // 获取所有榜单内容摘要
    getTopListDetail: function () {
        wx.request({
            url: 'https://autumnfish.cn/toplist/detail',
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    top_list: res.data.list
                })
            }
        })
    },

    // 点击榜单跳转
    listlink: function(e) {
        const index = e.currentTarget.dataset.index
        const list_id = this.data.top_list[index].id
        wx.navigateTo({
            url: '/pages/listdetail/listdetail',
            success: (res) => {
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: list_id })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getHotSearch()
        this.getTopListDetail()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        wx.setNavigationBarTitle({
            title: '发现',
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

    }
})