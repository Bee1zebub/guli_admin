<template>
    <div class="app-container">
        <el-form label-width="80px" style="width:50%">
            <el-form-item label="讲师名称" >
            <el-input v-model="teacher.name" />
            </el-form-item>

            <el-form-item label="讲师排序">
            <!--TODO:计数器不能使用+ - 按钮 -->
            <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
            </el-form-item>

            <el-form-item label="讲师头衔">
            <el-select v-model="teacher.level" clearable placeholder="请选择">
            <!--
            数据类型一定要和取出的json中的一致，否则没法回填。因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
            </el-select>
            </el-form-item>

            <el-form-item label="讲师资历">
            <el-input v-model="teacher.career"/>
            </el-form-item>

            <el-form-item label="讲师简介">
            <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
            </el-form-item>

            <!-- 讲师头像 不是通过axois上传-->
            <el-form-item label="讲师头像">
                <!-- 头衔缩略图 -->
                <pan-thumb :image="teacher.avatar"/>
                <!-- 文件上传按钮 -->
                <el-button type="primary" icon="el-icon-upload"
                @click="imagecropperShow=true">更换头像
                </el-button>
                <!--
                v-show：是否显示上传组件
                imagecropperShow：是否弹出上传头像界面

                :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                :url：后台上传的url地址
                BASE_API:图片上传地址的主机名
                
                field:表单组件input的类型
                @close：关闭上传组件
                @crop-upload-success：上传成功后的回调 -->
                <image-cropper
                v-show="imagecropperShow"
                :width="300"
                :height="300"
                :key="imagecropperKey"
                :url="BASE_API+'/eduoss/fileoss/upload'"
                field="file"
                @close="close"
                @crop-upload-success="cropSuccess"/>
            </el-form-item>

            <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary"
            @click="saveOrUpdate">保存
            </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'

// 引入组件相关模块
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
    components:{
        ImageCropper,PanThumb  //声明头像上传相关组件
    },
    data() {
        return{
            teacher: {
                name: '',
                sort:  0,
                level: 1,
                career: '',
                intro: '',
                avatar: ''
            },
            //保存按键是否能多次提交
            saveBtnDisabled: false,  

            //头像上传功能相关变量
            imagecropperShow: false,  //是否弹出上传头像界面
            imagecropperKey: 0, //类似于id，如果一个页面多个图片上传控件，可以做区分
            BASE_API: process.env.BASE_API, // api 的 base_url

        }
    },
    //vue监听，如果路径方式变化，则调用方法体
    watch: {
        $route(to, from) {
        console.log('watch $route')
        this.init()
        }
    },
    created() {
        this.init()
    },
    methods: {
        //！！！页面渲染之前调用方法，判断url路径是否有路径参数
        init(){
            //如果路径有id值，则数据回显，同时保存按钮之后调用 updateTeacher()方法
            if(this.$route.params && this.$route.params.id){
            const id =this.$route.params.id
            this.getInfo(id)
            }else{
                //如果没有，则将teacher值清空，则不会回显数据
                this.teacher = {
                    name: '',
                    sort:  0,
                    level: 1,
                    career: '',
                    intro: '',
                    avatar: ''}
            }
        },
        //！！！点击保存按钮，判断调用 saveTeacher() 或 updateTeacher()方法
        saveOrUpdate(){
            //判断是否有id值，数据回显会为teacher变量设置相关属性值
            if(!this.teacher.id){
                //添加讲师
                this.saveTeacher()
            }else{
                //修改讲师
                this.updateTeacher()
            }
        },

        //添加讲师的方法
        saveTeacher(){
            teacherApi.addTeacher(this.teacher)
            .then(res => { //添加成功执行then
                //提示信息
                this.$message({
                    message: '保存成功!',
                    type: 'success'
                });
                //回到列表页面 路由跳转
                this.$router.push({path: '/teacher/table'})
            })
        },

        //回显
        getInfo(id){
            teacherApi.getTeacherInfo(id)
            .then(res => {
                console.log(res)
                this.teacher = res.data.items  //把查询到的所有的值全都添加到teacher属性值中。包括没定义的id值等
            })
        },

        //修改讲师的方法，无事件调用，则不需要形参
        updateTeacher(){
            //使用此时通过双向绑定的表单修改的teacher变量值作为参数，修改讲师
            teacherApi.updateTeacher(this.teacher) //!注意：需要使用 this.teacher
            .then(res => {
                //提示信息
                //alert()
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                })
                //路由跳转到初始界面
                this.$router.push({path: '/teacher/table'}) //根据此url地址，直接展示路由对应的页面
            })
        },

        //头像上传的关闭上传弹窗方法
        close(){
            this.imagecropperShow = false
        },

        //头像上传成功后的回调方法
        //data：框架自动将 response.data 封装成 data
        cropSuccess(data){
            this.teacher.avatar = data.url
            this.imagecropperShow = false 
            this.imagecropperKey += 1  //类似于id，如果一个页面多个图片上传控件，可以做区分
        }
    }
}
</script>