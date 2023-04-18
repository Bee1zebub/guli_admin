<template>
    <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>
        <!-- active最重要 -->
        <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="提交审核"/>
        </el-steps>

        <!-- 发布数据显示表单，因为值展示数据故不需要双向绑定 -->
        <div class="ccInfo">
            <img :src="coursePublish.cover">
            <div class="main">
                <h2>{{ coursePublish.title }}</h2>
                <p class="gray"><span>共{{ coursePublish.lessonNum }}课时</span></p>
                <p><span>所属分类：{{ coursePublish.subjectLevelOne }} — {{ coursePublish.subjectLevelTwo }}</span></p>
                <p>课程讲师：{{ coursePublish.teacherName }}</p>
                <h3 class="red">￥{{ coursePublish.price }}</h3>
            </div>
        </div>

        <div>
            <el-button @click="previous">返回修改</el-button>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
        </div>
    </div>
</template>

<script>
 import course from '@/api/edu/course'
    export default {
    data() {
        return {
            coursePublish:{}, //课程发布数据回显
            courseId : '', //课程id

            saveBtnDisabled: false // 保存按钮是否禁用
        }
    },
    created() {
        console.log('info created')
        //获取路径变量
        if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
        }
        this.init()
    },
    methods: {
        init(){
            this.getCoursePublishId()
        },
        //课程最终发布
        publish(){
            this.$confirm('此操作将发布课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                course.publishCourse(this.courseId)
                    .then(res => {
                        this.$message({
                            type: 'success',
                            message: '发布课程成功!'
                        });
                        this.saveBtnDisabled = true
                    })
            }).catch(() => { //点击取消，执行catch方法
                // //取消也将 chapterId 设置为空
                // this.video.chapterId = ''
            }) 
        },
        //课程发布数据回显，根据课程id查询
        getCoursePublishId() {
            course.getPublihCourseInfo(this.courseId)
                .then(res => {
                    this.coursePublish = res.data.publishCourse
                })
        },

        previous(){
            //跳转到第二步
            console.log('next')
            //此时的路径为 '/course/info/1' 因为上一步已经填好并保存了，此时是需要进行修改了
            this.$router.push({path:'/course/chapter/1'})
        },
        next() {
            //跳转到列表展示页
            console.log('next')
            this.$router.push({ path: '/course/list' })
        }
    }
}
</script>

<style scoped>
.ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main {
    margin-left: 520px;
}

.ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}

.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
</style>