import request from '@/utils/request'
export default {

    //==================vod=====================
    //删除vod中的视频
    deleteAliyunvod(id) {
        return request({
            url: '/eduvod/video/removeVideo/'+id,
            method: 'delete'
          })
    },
    //==================vod=====================


    //添加小节
    addVideo(video) {
        return request({
            url: '/eduservice/video/addVideo',
            method: 'post',
            data: video
          })
    },
    
    //删除小节
    deleteVideo(id) {
        return request({
            url: '/eduservice/video/deleteVideo/'+id,
            method: 'delete'
          })
    }
    
}