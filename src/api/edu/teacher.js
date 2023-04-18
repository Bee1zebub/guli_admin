import request from '@/utils/request' //固定，引入该request.js文件,该文件依赖并封装了axios

export default{
    //1、讲师列表（条件分页查询）
    //current:当前页 limit：每页记录数 teacherQuery：传入的条件对象
    getTeacherListPage(current,limit,teacherQuery){
        return request({
            //后端的请求路径（接口）
            //url: '/eduservice/edu-teacher/pageTeacherCondition/'+current+'/'+limit,  
            //使用ES6模板字符串
            url: `/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            //不传json数据就是如下写法
            // data: {
            //   username,
            //   password
            // }

            //teacherQuery：传入的条件对象,后端使用RequestBody获取数据
            //data表示把对象转换成json进行传递
            data: teacherQuery
        })
    },
    //2、删除讲师
    deleteTeacherId(id){
        return request({
            url: `/eduservice/edu-teacher/delete/${id}`,
            method: 'delete',
        })
    },
    //3、添加讲师
    addTeacher(teacher){
         return request({
            url: '/eduservice/edu-teacher/addTeacher',
            method: 'post',
            data: teacher
        })
    },
    //4、根据id查询讲师
    getTeacherInfo(id){
        return request({
            url: `/eduservice/edu-teacher/getTeacher/${id}`,
            method: 'get'
        })
    },
    //5、根据id修改讲师
    //由于回填数据查询时已经得到所有数据，所以可以直接传入修改后的teacher变量（与表单双向绑定）
    updateTeacher(teacher){
        return request({
            url: `/eduservice/edu-teacher/updateTeacher`,
            method: 'post',
            data: teacher //向后台传入json类型值
        })
    }
}