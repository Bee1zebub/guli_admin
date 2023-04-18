import request from '@/utils/request' //固定，引入该request.js文件,该文件依赖并封装了axios

export default {
    getSubjectList(){
        return request({
            url: '/eduservice/edu-subject/getAllSubject',
            method: 'get'
        })
    }
}
