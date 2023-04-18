<template>
    <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>
        <!-- active最重要 可为0 -->
        <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="提交审核"/>
        </el-steps>

        <el-form label-width="120px">
            <el-form-item label="课程标题">
                <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。"/>
            </el-form-item>

            <!-- 所属分类 -->
            <!-- 和讲师列表都是使用的下拉列表的方式展示 -->
            <!--单向绑定这些值：key值表示唯一 label值为显示的值  value值为真实传入的值 -->
            <el-form-item label="课程分类">
                <!-- 加上一个change事件，在切换选项时触发 -->
                <el-select
                    v-model="courseInfo.subjectParentId"
                    placeholder="一级分类" @change="subjectLevelOneChanged">
                    <el-option
                        v-for="subject in subjectOneList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>

                </el-select>

                <!-- 二级分类 -->
                <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
                    <el-option
                        v-for="subject in subjectTwoList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                </el-select>
            </el-form-item>

            <!-- 课程讲师 -->
            <el-form-item label="课程讲师">
            <el-select
                v-model="courseInfo.teacherId"
                placeholder="请选择讲师">
                <!-- 使用v-for遍历所有的 teacherList讲师列表 -->
                <!--key值表示唯一 label值为显示的值  value值为真实传入的值 -->
                <el-option
                    v-for="teacher in teacherList"
                    :key="teacher.id"
                    :label="teacher.name"
                    :value="teacher.id"/>
            </el-select>
            </el-form-item>


            <el-form-item label="总课时">
                <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
            </el-form-item>

            <!-- 课程简介 TODO 富文本编辑器 -->
            <el-form-item label="课程标题">
                <tinymce :height="300" v-model="courseInfo.description" id='tinymce'></tinymce>
            </el-form-item>
            
            <!-- 课程封面 TODO 试用上传头像组件-->
            <el-form-item label="课程封面">
                <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="BASE_API+'/eduoss/fileoss/upload'"
                class="avatar-uploader">
                <img :src="courseInfo.cover" width="50%" style="float:left">
                </el-upload>
            </el-form-item>

            <el-form-item label="课程价格">
                <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
            </el-form-item>

            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import course from '@/api/edu/course'
    import subject from '@/api/edu/subject'
    import Tinymce from '@/components/Tinymce' //引入组件，第三方组件需要声明才能使用

    export default {
        //vue监听，如果路径方式变化，则调用方法体
        watch: {
            $route(to, from) {
            console.log('watch $route')
            this.init()
            }
        },
        components: { Tinymce },
        data() {
            return {
                saveBtnDisabled: false, // 保存按钮是否禁用
                //VO类数据
                courseInfo:{
                    title: '',
                    subjectId: '',  //二级分类id
                    subjectParentId:'',//一级分类id
                    teacherId: '',
                    lessonNum: 0,
                    description: '',
                    cover: '/static/01.jpg', //封面默认值
                    price: 0
                },
                BASE_API: process.env.BASE_API, // 接口API地址，用于上传封面
                teacherList:[],   //封装所有的讲师
                subjectOneList:[],//一级分类
                subjectTwoList:[] //二级分类
            }
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                //获取路由id值
                //有则调用更新方法
                if(this.$route.params && this.$route.params.id) {
                    this.courseId = this.$route.params.id
                    //调用根据id查询课程的方法
                    this.getInfo()

                //没有则调用添加方法
                } else {
                    //先清空数据
                    this.courseInfo = {
                        title: '',
                        subjectId: '',  //二级分类id
                        subjectParentId:'',//一级分类id
                        teacherId: '',
                        lessonNum: 0,
                        description: '',
                        cover: '/static/01.jpg', //封面默认值
                        price: 0
                    }
                    //初始化所有讲师
                    this.getListTeacher()
                    //初始化一级分类
                    this.getOneSubject()
                }
            },
            getInfo(){
                course.getCourseInfoId(this.courseId)
                .then(response => {
                    //在courseInfo课程基本信息，包含 一级分类id 和 二级分类id
                    this.courseInfo = response.data.courseInfoVo
                    //1 查询所有的分类，包含一级和二级
                    subject.getSubjectList()
                        .then(response => {
                            //2 获取所有一级分类
                            this.subjectOneList = response.data.list
                            //3 把所有的一级分类数组进行遍历，
                            for(var i=0;i<this.subjectOneList.length;i++) {
                                //获取每个一级分类
                                var oneSubject = this.subjectOneList[i]
                                //比较当前courseInfo里面一级分类id和所有的一级分类id
                                if(this.courseInfo.subjectParentId == oneSubject.id) {
                                    //获取一级分类所有的二级分类
                                    this.subjectTwoList = oneSubject.children
                                }
                            }
                        })
                        //初始化所有讲师
                        this.getListTeacher()
                })
            },

            //保存然后跳转
            //跳转页面时，向路径上传递课程id参数（RESTFUL风格）http://localhost:9528/#/course/info/1421
            //添加课程
            addCourse() {
                course.addCourseInfo(this.courseInfo)
                    .then(response => {
                        //提示
                        this.$message({
                            type: 'success',
                            message: '添加课程信息成功!'
                        });
                        //跳转到第二步，重定向，会清空之前的数据
                        this.$router.push({path:'/course/chapter/'+response.data.courseId})
                    })
            },

            //修改课程
            updateCourse() {
                course.updateCourseInfo(this.courseInfo)
                    .then(response => {
                        //提示
                        this.$message({
                            type: 'success',
                            message: '修改课程信息成功!'
                        });
                        //跳转到第二步
                        this.$router.push({path:'/course/chapter/'+this.courseId})
                    })
            },

            saveOrUpdate() {
                //判断添加还是修改
                if(!this.courseInfo.id) {
                    //添加
                    this.addCourse()
                } else {
                    this.updateCourse()
                }
            },

            //查询所有的一级分类
            getOneSubject() {
                subject.getSubjectList()
                    .then(response => {
                        this.subjectOneList = response.data.list
                    })
            },
            //重要!!!
            //点击某个一级分类，触发change，显示对应二级分类
            //该框架封装了事件方法，该方法有一个value值，代表该选项的id值
            //| 事件名称 | 说明                  | 回调参数                  |
            //| change   | 在 Input 值改变时触发 | (value: string \| number) |
            subjectLevelOneChanged(value) {
                //value就是一级分类id值
                //遍历所有的分类，包含一级和二级
                //subjectOneList中包含了二级列表，children属性
                 for(var i=0;i<this.subjectOneList.length;i++) {
                //     //每个一级分类
                     var oneSubject = this.subjectOneList[i]
                //     //判断：所有一级分类id 和 点击一级分类id是否一样
                     if(value === oneSubject.id) {
                //         //从一级分类获取里面所有的二级分类
                         this.subjectTwoList = oneSubject.children
                //         //把二级分类id值清空
                         this.courseInfo.subjectId = ''
                     }
                 }
            },

            //查询所有的讲师
            getListTeacher() {
                course.getListTeacher()
                    .then(response => {
                        console.info('查询所有的讲师')
                        this.teacherList = response.data.items
                    })
            },

            //上传封面方法
            //上传之前调用的方法
            //before-upload	| 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。|	function(file)
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg'
                const isLt2M = file.size / 1024 / 1024 < 10

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!')
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!')
                }
                return isJPG && isLt2M
            },
            //上传封面成功调用的方法
            handleAvatarSuccess(res, file) {
                this.courseInfo.cover = res.data.url
            },
        }
}
</script>

<style scoped>
.tinymce-container {
line-height: 29px;
}
</style>