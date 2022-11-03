// pages/find/find.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        all_list: [],
        top_list: [],
        global_list: []
    },

    // 点击搜索框跳转
    goToSearch: function () {
        wx.navigateTo({
            url: '/pages/search/search'
        })
    },

    // 获取所有榜单内容摘要
    getTopListDetail: function () {
        wx.showLoading({
          title: '数据加载中...',
        })
        wx.request({
            url: 'https://autumnfish.cn/toplist/detail',
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    all_list: res.data.list,
                    top_list: res.data.list.slice(0, 4),
                    global_list: res.data.list.slice(4)
                })
                wx.hideLoading()
            }
        })
    },

    // 点击榜单跳转
    listlink: function (e) {
        // console.log(e)
        let tag = e.currentTarget.dataset.tag
        const index = e.currentTarget.dataset.index
        const list_id = tag === 1 ? this.data.top_list[index].id : this.data.global_list[index].id
        wx.navigateTo({
            url: '/pages/listdetail/listdetail',
            success: (res) => {
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: list_id
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
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