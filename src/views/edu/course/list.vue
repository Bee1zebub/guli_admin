<template>
  <div class="app-container">
    课程列表
    <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
        <el-form-item label="名称">
            <el-input v-model="courseQuery.title" placeholder="课程标题"></el-input>
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="courseQuery.status" placeholder="课程状态">
                <el-option label="未发布" value="Draft"></el-option>
                <el-option label="已发布" value="Normal"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getList()">查询</el-button>
            <el-button type="default" @click="resetData()">清空</el-button>
        </el-form-item>
    </el-form>   

    <!--表格渲染 -->
    <template>
            <!-- 表格，将list集合单向绑定 -->
            <el-table
                v-loading="loading"
                :data="list"
                element-loading-text="数据加载中"
                border
                fit
                :highlight-current-row = "true"
                width="100%">
                
                <el-table-column
                label="序号"
                width="70"
                align="center">
                    <!-- scope代表整个表格；scope.$index拿到每一行的index-->
                    <template slot-scope="scope">
                        {{ (page - 1) * limit + scope.$index + 1 }}
                    </template>
                </el-table-column>
                
                <el-table-column prop="cover" label="封面" width="150" >
                </el-table-column>

                <!--prop：直接输入list集合中对象的属性； label：表头名称-->
                <el-table-column prop="title" label="名称" width="150" />

                <el-table-column label="转态" width="80">
                <!-- scope代表整个表格；scope.row拿到每一行的数据；需要将其写在template标签中-->
                    <template slot-scope="scope">  
                        {{ scope.row.status === 'Draft'?'未发布':'已发布' }} 
                    </template>
                </el-table-column>

                <el-table-column prop="lessonNum" label="课时数" width="160"/>
                <el-table-column prop="price" label="价格" width="160"/>
                <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
                <el-table-column prop="gmtModified" label="修改时间" width="160"/>

                <!-- 重要！！！ -->
                <el-table-column label="操作" width="200" align="center">
                <!-- scope代表整个表格；scope.row拿到每一行的数据；需要将其写在template标签中-->
                    <template slot-scope="scope">
                        <!-- vue路由，to表示链接的地址, -->
                        <!-- 点击修改按钮，路由跳转，该路由对对应页面和添加讲师页面相同（均为src/views/save.vue） -->
                        <!-- 该地址包含 路径变量scope.row.id（ <template slot-scope="scope">固定用法获取表的行对应值） -->
                        <router-link :to="'/course/info/'+scope.row.id">
                            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
                        </router-link>
                        <router-link :to="'/course/chapter/'+scope.row.id">
                            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
                        </router-link>

                        <el-button type="text" size="mini" icon="el-icon-delete"
                        @click="removeDataById(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        
        <!-- 分页组件 
        size-change	    pageSize    改变时会触发	每页条数
        current-change	currentPage 改变时会触发	当前页  -->
        <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        :page-sizes="[1, 2, 3, 4, 10]"
        style="padding: 30px 0; text-align: center;"
        layout="sizes,total, prev, pager, next, jumper"
        @current-change="getListByPage"
        @size-change="getListBySize"
        />



  </div>
</template>

<script>
import course from '@/api/edu/course'
export default {
    data() {
        return {
            list: null, //查询之后接口返回的集合
            page: 1,//当前页
            limit: 10,//每页记录数
            total: 0,//总记录数
            courseQuery: { //条件封装对象
                title: '',
                status: ''
            },

            loading: true
        }
    },
    created(){
        this.getList()
    },
    methods: {
        removeDataById(courseId){
            this.$confirm('此操作将永久删除讲师纪录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .then(() => { //点击确定，执行then()方法
                    //调用删除的方法
                    course.removeCourse(courseId)
                    .then(res => {
                        //提示信息
                        this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //回到最开始的查询列表页面
                    this.getList()
                    })
                })//点击取消，执行catch()方法
                // .catch(() => { 
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });          
                // }); 
        },
        //查询结果
        getList(page = 1) {
            this.page = page
            course.getCourseListPage(this.page,this.limit,this.courseQuery)
                .then(res => {
                    this.loading = false
                    this.list = res.data.records
                    this.total = res.data.total
                    console.log(this.list)
                    console.log(this.total)
                })
        },
        //分页按条件查询返回结果,传入默认page参数为1
        getListByPage(page){
            this.page = page
            this.getList()
        },
        // 调整每页显示条数，注意只能有一个limit参数
        getListBySize(limit = 10){
            this.limit = limit
            //axios.post().then().catch()
            course.getCourseListPage(this.page,this.limit,this.courseQuery)
                .then(res => {
                    //res是成功后返回的数据
                    console.log(res)
                    this.list = res.data.records  //此时的res则为查询到的列表对象
                    this.total = res.data.total
                    console.log(this.list) //!注意，不能省略this（不能省略）
                    console.log(this.total)
            }) //请求成功
            .catch(error => {
                console.log(error)
            }) //请求失败
        },
        resetData(){
            this.courseQuery = {}
            this.getList()
        },

    }
}
</script>

<style>

</style>