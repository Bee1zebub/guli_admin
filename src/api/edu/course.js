import request from '@/utils/request'

export default {
    //1 添加课程信息
    addCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/course/addCourseInfo',
            method: 'post',
            data: courseInfo  //json形式传递
          })
    },

    //2 查询所有讲师
    getListTeacher() {
        return request({
            url: '/eduservice/edu-teacher/findAll',
            method: 'get'
        })
    },

    //3.按照id查询讲师
    getCourseInfoId(id) {
        return request({
            url: '/eduservice/course/getCourseInfo/'+id, //路径变量
            method: 'get' 
          })
    },
    //4.修改课程信息
    updateCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/course/updataCourseInfo',
            method: 'post',
            data: courseInfo  //json格式
          })
    },

    //=======课程发布==========
    //5.课程确认信息显示
    getPublihCourseInfo(id) {
        return request({
            url: '/eduservice/course/getPublishCourseInfo/'+id,
            method: 'get'
        })
    },
    //6.课程最终发布
    publishCourse(id) {
        return request({
            url: '/eduservice/course/publishCourse/'+id,
            method: 'post'
          })
    },
    //=======课程列表=========
    //7.返回按条件分页查询的课程信息
    getCourseListPage(page,limit,courseQuery) {
        return request({
            url: `/eduservice/course/pageCourseCondition/${page}/${limit}`,
            method: 'post',
            data: courseQuery
        })
    },
    //8.按照id删除课程
    removeCourse(courseId){
        return request({
            url: '/eduservice/course/removeCourse/'+courseId,
            method: 'delete',
        })
    }
}
