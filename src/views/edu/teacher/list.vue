<template>
    <div class="app-container">
        <!--顶部查询表单-->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
            <!-- 数据变量可以不定义name属性值，会自动加入 -->
            <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
            </el-form-item>

            <el-form-item>
            <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
            <el-option value="1" label="高级讲师"/>
            <el-option value="2" label="首席讲师"/>
            </el-select>
            </el-form-item>

            <el-form-item label="添加时间">
            <el-date-picker
            v-model="teacherQuery.begin"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            />
            </el-form-item>

            <el-form-item>
            <el-date-picker
            v-model="teacherQuery.end"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            />
            </el-form-item>

            <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
            
            <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>

    
        <!--表格渲染 -->
        <template>
            <!-- 表格，将list集合单向绑定 -->
            <el-table
                v-loading="listLoading"
                :data="list"
                element-loading-text="数据加载中"
                border
                fit
                highlight-current-row>
                
                <el-table-column
                label="序号"
                width="70"
                align="center">
                <!-- scope代表整个表格；scope.$index拿到每一行的index-->
                <template slot-scope="scope">
                {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
                </el-table-column>
                
                <!--prop：直接输入list集合中对象的属性； label：表头名称-->
                <el-table-column prop="name" label="名称" width="80" />

                <el-table-column label="头衔" width="80">
                <!-- scope代表整个表格；scope.row拿到每一行的数据；需要将其写在template标签中-->
                <template slot-scope="scope">  
                {{ scope.row.level===1?'高级讲师':'首席讲师' }} 
                </template>
                </el-table-column>

                <el-table-column prop="intro" label="资历" />
                <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
                <el-table-column prop="sort" label="排序" width="60" />

                <!-- 重要！！！ -->
                <el-table-column label="操作" width="200" align="center">
                <!-- scope代表整个表格；scope.row拿到每一行的数据；需要将其写在template标签中-->
                <template slot-scope="scope">
                <!-- vue路由，to表示链接的地址, -->
                <!-- 点击修改按钮，路由跳转，该路由对对应页面和添加讲师页面相同（均为src/views/save.vue） -->
                <!-- 该地址包含 路径变量scope.row.id（ <template slot-scope="scope">固定用法获取表的行对应值） -->
                <router-link :to="'/teacher/edit/'+scope.row.id">
                <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                </router-link>

                <el-button type="danger" size="mini" icon="el-icon-delete"
                @click="removeDataById(scope.row.id)">删除</el-button>
                </template>
                </el-table-column>
                </el-table>
        </template>
        
        <!-- 分页组件 getList方法可以省略括号,不需要添加参数，框架会自己添加-->
        <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        :page-sizes="[1, 2, 3, 4, 10]"
        style="padding: 30px 0; text-align: center;"
        layout="sizes,total, prev, pager, next, jumper"
        @current-change="getList"
        @size-change="getListBySize"
        />
    </div>
</template>

<script>
//引入teacher.js文件
import teacher from '@/api/edu/teacher'

export default {
    //注意：表单组件主要都是直接绑定数据变量（单向绑定或双向绑定）实现功能，方法也是通过形参修改数据变量后绑定数据变量进行操作
    //写核心代码位置。不需要new Vue({...}),因为main.js封装好了
    data(){ //定义数据变量和初始值
        return {
            list: null,//查询之后接口返回的集合
            page: 1,//当前页
            limit: 10,//每页记录数
            total: undefined,//总记录数
            teacherQuery: {} ,//条件封装对象

            listLoading: true
        }
    },
    created(){ //页面渲染之前执行，一般调用methods的定义的方法
        this.getList()
    },
    methods: { //创建具体的方法，调用teacher.js定义的方法
        //调整当前页数，注意只能有一个page参数
        //讲师列表的方法,page=1表示在未传递参数，或者参数为 undefined 时，使用默认参数
        getList(page=1){
            this.page = page
            //axios.post().then().catch()
            teacher.getTeacherListPage(this.page,this.limit,this.teacherQuery)
            .then(res => {
                //res是成功后返回的数据
                console.log(res)
                this.list = res.data.rows  //此时的res则为查询到的列表对象
                this.total = res.data.total
                console.log(this.list) //!注意，不能省略this（不能省略）
                console.log(this.total)

                this.listLoading = false
            }) //请求成功
            .catch(error => {
                console.log(error)
            }) //请求失败
        },
        // 调整每页显示条数，注意只能有一个limit参数
        getListBySize(limit){
            this.limit = limit
            //axios.post().then().catch()
            teacher.getTeacherListPage(this.page,this.limit,this.teacherQuery)
            .then(res => {
                //res是成功后返回的数据
                console.log(res)
                this.list = res.data.rows  //此时的res则为查询到的列表对象
                this.total = res.data.total
                console.log(this.list) //!注意，不能省略this（不能省略）
                console.log(this.total)
            }) //请求成功
            .catch(error => {
                console.log(error)
            }) //请求失败
        },
        resetData(){
            this.teacherQuery = {}
            this.getList()
        },
        //删除讲师的方法
        removeDataById(id){
            this.$confirm('此操作将永久删除讲师纪录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            })
            .then(() => { //点击确定，执行then()方法
                //调用删除的方法
                teacher.deleteTeacherId(id)
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
        }
    } 
}
</script>
