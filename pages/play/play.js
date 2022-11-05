const format = require("../../utils/util.js")

Page({
    /**
     * 页面的初始数据
     */
    data: {
        audio: null,
        music_list: [],
        cur_index: 0,
        cur_music: {},
        music_info: {},
        lrclist: [],
        lrcindex: -1,
        lrctop: 0,
        isplay: true,
        isloop: false,
        duration: {},
        fduration: '00:00',
        cur_time: {},
        fcur_time: '00:00'
    },

    // 获取歌曲详情
    getSongInfo: function () {
        let mid = this.data.cur_music.id
        wx.request({
            url: 'https://autumnfish.cn/song/detail?ids=' + mid,
            method: 'GET',
            success: (res) => {
                // console.log(res)
                this.setData({
                    music_info: res.data.songs[0]
                }),
                this.getLrc()
            }
        })
    },

    // 获取歌词
    getLrc: function () {
        let mid = this.data.cur_music.id
        wx.request({
            url: 'https://autumnfish.cn/lyric?id=' + mid,
            method: 'GET',
            success: (res) => {
                // console.log(res)
                const lrcstr = res.data.lrc.lyric
                this.lrcSet(lrcstr)
            }
        })
    },

    // 处理歌词(字符串处理)
    lrcSet: function (lrcstr) {
        let lrclist = []
        lrcstr = lrcstr.split("\n")
        // console.log(lrclist)
        const re = /\[\d{2}:\d{2}\.\d{2,3}\]/
        lrcstr.forEach(item => {
            let item_time = item.match(re)
            if (item_time) {
                item_time = item_time[0].slice(1, -1)
                // console.log(item_time)
                item_time = item_time.split(":")
                // console.log(item_time)
                const h = item_time[0]
                const m = item_time[1]
                const time = parseFloat(h) * 60 + parseFloat(m)
                // console.log(time)
                const lrc = item.replace(re, "")
                // console.log(lrc)
                lrclist.push({ time, lrc })
            }
        });
        // console.log(lrclist)
        this.setData({
            lrclist: lrclist
        })
    },

    // 初始化播放器
    audioInit: function () {
        this.setData({
            audio: wx.getBackgroundAudioManager()
            // audio: wx.createInnerAudioContext()
        })
        let mid = this.data.cur_music.id
        this.data.audio.title = this.data.cur_music.name
        this.data.audio.coverImgUrl = this.data.cur_music.al.picUrl
        this.data.audio.singer = this.data.cur_music.ar[0].name
        this.data.audio.src = 'https://music.163.com/song/media/outer/url?id=' + mid + 
        '&level=exhigh'
        this.observeAudio()
    },

    // 监听播放状态
    observeAudio: function () {
        this.data.audio.onPlay(() => {
            this.setData({
                isplay: true
            })
        })

        this.data.audio.onPause(() => {
            this.setData({
                isplay: false
            })
        })

        this.data.audio.onStop(() => {
            this.setData({
                isplay: false
            })
        })

        this.data.audio.onCanplay(() => {
            this.data.audio.play()
            // console.log(this.data.duration)
        })

        this.data.audio.onTimeUpdate(() => {
            // 滑动条进度
            let cur = {}
            cur.m = parseInt(this.data.audio.currentTime / 60)
            cur.s = parseInt(this.data.audio.currentTime - cur.m * 60)
            let dur = {}
            dur.m = parseInt(this.data.audio.duration / 60)
            dur.s = parseInt(this.data.audio.duration - dur.m * 60)
            this.setData({
                fduration: format.formatTime(dur.m, dur.s, 'm:s'),
                fcur_time: format.formatTime(cur.m, cur.s, 'm:s'),
                duration: dur,
                cur_time: cur
            })

            // 歌词滚动
            var playtime = this.data.audio.currentTime
            var lrctimelist = this.data.lrclist
            var len = lrctimelist.length
            for (var i = 0; i < len; i++) {
                if (i == lrctimelist.length - 1 && playtime >= lrctimelist[i].time) {
                    this.setData({ lrcindex: i })
                    break
                }
                else if (playtime >= lrctimelist[i].time && playtime < lrctimelist[i + 1].time) {
                    this.setData({ lrcindex: i })
                    break
                }
            }
            let index = this.data.lrcindex
            this.setData({
                lrctop: (index - 4) * 40
            })
        })

        this.data.audio.onEnded(() => {
            this.setData({
                isplay: false
            })
            if (this.data.isloop) {
                // this.data.audio.stop()
                // this.observeAudio()
                this.data.audio.pause()
                let mid = this.data.cur_music.id
                this.data.audio.title = this.data.cur_music.name
                this.data.audio.coverImgUrl = this.data.cur_music.al.picUrl
                this.data.audio.singer = this.data.cur_music.ar[0].name
                this.data.audio.src = 'https://music.163.com/song/media/outer/url?id='
                + mid + '&level=exhigh'
            } 
            else
                this.nextdate()
        })

        this.data.audio.onPrev(() => {
            this.predate()
        })

        this.data.audio.onNext(() => {
            this.nextdate()
        })
    },

    // 播放按钮控制
    playdate: function () {
        let date = this.data.isplay
        if (date === true)
            this.data.audio.pause()
        else
            this.data.audio.play()
    },

    // 上一首按钮控制
    predate: function () {
        this.data.audio.pause()
        let index = this.data.cur_index === 0 ?
            this.data.music_list.length - 1 : this.data.cur_index - 1
        let mid = this.data.music_list[index].id
        wx.request({
            url: 'https://autumnfish.cn/check/music?id=' + mid,
            method: 'GET',
            success: (res) => {
                if (res.data.message === 'ok') {
                    this.setData({
                        cur_index: index,
                        cur_music: this.data.music_list[index]
                    })
                    // console.log(this.data.nowindex, this.data.cur_music.id)
                    this.getSongInfo()
                    this.data.audio.title = this.data.cur_music.name
                    this.data.audio.coverImgUrl = this.data.cur_music.al.picUrl
                    this.data.audio.singer = this.data.cur_music.ar[0].name
                    this.data.audio.src = 'https://music.163.com/song/media/outer/url?id=' + mid + '&level=exhigh'
                    this.observeAudio()
                }
                else {
                    wx.showModal({
                        showCancel: true,
                        content: '歌曲没有版权，请选择其他歌曲进行播放',
                        title: '提示'
                    })
                }
            }
        })
    },

    // 下一首按钮控制
    nextdate: function () {
        this.data.audio.pause()
        let index = this.data.cur_index === this.data.music_list.length - 1 ?
            0 : this.data.cur_index + 1
        let mid = this.data.music_list[index].id
        wx.request({
            url: 'https://autumnfish.cn/check/music?id=' + mid,
            method: 'GET',
            success: (res) => {
                if (res.data.message === 'ok') {
                    this.setData({
                        cur_index: index,
                        cur_music: this.data.music_list[index],
                    })
                    // console.log(this.data.nowindex, this.data.cur_music.id)
                    this.getSongInfo()
                    this.data.audio.title = this.data.cur_music.name
                    this.data.audio.coverImgUrl = this.data.cur_music.al.picUrl
                    this.data.audio.singer = this.data.cur_music.ar[0].name
                    this.data.audio.src = 'https://music.163.com/song/media/outer/url?id=' + mid + '&level=exhigh'
                    this.observeAudio()
                } 
                else {
                    wx.showModal({
                        showCancel: true,
                        content: '歌曲没有版权，请选择其他歌曲进行播放',
                        title: '提示'
                    })
                }
            }
        })
    },

    // 播放模式控制
    changePlayMode: function () {
        let date = this.data.isloop
        this.setData({
            isloop: date ? false : true
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取页面传输过来的歌曲基本数据并进行了存储
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', objdata => {
            // console.log(objdata)
            this.setData({
                music_list: objdata.data.musiclist,
                cur_index: objdata.data.nowindex,
                cur_music: objdata.data.musiclist[objdata.data.nowindex]
            })
            this.getSongInfo()
            this.audioInit()
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
        this.data.audio.stop()
    }
})