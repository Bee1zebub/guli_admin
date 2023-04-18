<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom:30px;"/>

    <!--
    ref ---参数绑定的值
    default-expand-all --- 是否默认展开所有节点	boolean 
    filter-node-method --- 对树节点进行筛选时执行的方法(即上方的输入框控件)，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏-->
    <el-tree
    ref="subjectTree"
    :data="subjectList"
    :props="defaultProps"
    :filter-node-method="filterNode"
    class="filter-tree"
    default-expand-all
    />
 </div>

</template>

<script>
import subject from '@/api/edu/subject'

export default {
    data(){
        return {
            filterText: '',  //输入框的内容，双向绑定
            subjectList: [], //重要：树形结构的关键数据
            defaultProps: {
                children: 'children',
                label: 'title'  //树形结构名称，修改成 title
            }
        }
    },
    created(){
        this.getAllSubjectList();
    },
    watch: {
      filterText(val) {
        //this.$refs.tree.filter(val);subjectTree
        this.$refs.subjectTree.filter(val);  //把 tree改成ref后面的值
      }
    },
    methods:{
        // value：输入值；data：当前列表
        filterNode(value, data) {
            
            if (!value) return true
            //return data.title.indexOf(value) !== -1
            return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        },
        getAllSubjectList(){
            subject.getSubjectList()
            .then(res => {
                console.log(res)
                this.subjectList = res.data.list
            })
        }
    }
}
</script>

<style>

</style>