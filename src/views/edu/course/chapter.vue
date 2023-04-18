<template>
    <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>
        <!-- active最重要 -->
        <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="提交审核"/>
        </el-steps>

        <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

        <!-- 章节列表 -->
        <ul class="chanpterList">
        <!-- key:添加唯一标识 -->
            <li v-for="chapter in chapterVideoList"
                :key="chapter.id">
                <p>
                    {{ chapter.title }}
                    <span class="acts">
                        <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                        <el-button style="" type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
                        <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                    </span>
                    
                    
                </p>

                <!-- 视频小节 -->
                <ul class="chanpterList videoList">
                    <li
                        v-for="video in chapter.children"
                        :key="video.id">
                        <p>{{ video.title }}
                            <span class="acts">
                                <!-- TODO 编辑小节 -->
                                <el-button style="" type="text">编辑</el-button>
                                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                            </span>
                        </p>
                    </li>
                </ul>
            </li>
        </ul>

        <el-form label-width="120px">
            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="previous">上一步</el-button>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
            </el-form-item>
        </el-form>

        <!-- 使用对话框添加和修改章节表单 
        :visible.sync="dialogChapterFormVisible: 是否弹出对话框 -->
        <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
            <el-form :model="chapter" label-width="120px">
                <el-form-item label="章节标题">
                    <el-input v-model="chapter.title"/>
                </el-form-item>
                <el-form-item label="章节排序">
                    <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 使用对话框添加和修改小节表单 
        :visible.sync="dialogVideoFormVisible: 是否弹出对话框 -->
        <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
            <el-form :model="video" label-width="120px">
                <el-form-item label="小节标题">
                    <el-input v-model="video.title"/>
                </el-form-item>
                <el-form-item label="小节排序">
                    <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
                </el-form-item>
                <el-form-item label="是否免费">
                    <!-- 结合el-radio-group元素和子元素el-radio可以实现单选组，在el-radio-group中绑定v-model，在el-radio中设置好label即可，
                        无需再给每一个el-radio绑定变量，另外，还提供了change事件来响应变化，它会传入一个参数value。 -->
                    <el-radio-group v-model="video.free">
                        <el-radio :label="1">免费</el-radio>
                        <el-radio :label="0">默认</el-radio>
                    </el-radio-group>
                <!-- TODO -->
                </el-form-item>

                <el-form-item label="上传视频">
                    <!-- 
                    file-list	上传的文件列表
                    limit	最大允许上传个数
                    on-success	文件上传成功时的钩子	function(response, file, fileList)	
                    on-exceed	文件超出个数限制时的钩子
                    on-remove	文件列表移除文件时的钩子
                    ! before-remove	删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
                      -->
                    <el-upload
                        :on-success="handleVodUploadSuccess"
                        :on-remove="handleVodRemove"
                        :before-remove="beforeVodRemove"
                        :on-exceed="handleUploadExceed"
                        :file-list="fileList"
                        :action="BASE_API+'/eduvod/video/uploadAlyiVideo'"
                        :limit="1"
                        class="upload-demo">
                    <el-button size="small" type="primary">上传视频</el-button>
                    <el-tooltip placement="right-end">
                        <div slot="content">最大支持1G，<br>
                            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                            SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                            <!-- Icon 图标 -->
                        <i class="el-icon-question"/>
                    </el-tooltip>
                    </el-upload>
		        </el-form-item>
            </el-form>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import chapter from '@/api/edu/chapter'
    import video from '@/api/edu/video'


    export default {
    data() {
        return {
            BASE_API: process.env.BASE_API, // 接口API地址
            fileList: [],//上传文件列表
            
            video: {
                title: '', //文件名称
                sort: 0,
                free: 0, //0为false ,1为true
                videoSourceId: '', //vod中的id值
                chapterId: ''
            },
            chapter: {
                id:'',
                title: '',
                sort: 0
            },

            dialogChapterFormVisible: false, //章节弹框
            dialogVideoFormVisible:false, //小节弹框


            saveBtnDisabled: false, // 保存按钮是否禁用

            courseId: '',
            chapterVideoList: [], //重要：树形结构的关键数据
        }
    },
    created() {
        //获取路由的id值
        if(this.$route.params && this.$route.params.id) {
            this.courseId = this.$route.params.id
            //根据课程id查询章节和小节
            console.log(this.courseId)
            this.getChapterVideo()
        }
    },
    methods: {
        //=======================上传视频========================
        //点击确定调用的方法
        handleVodRemove() {
            //调用接口的删除视频的方法
            video.deleteAliyunvod(this.video.videoSourceId)
                .then(response => {
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除视频成功!'
                    });
                    //把文件列表清空
                    this.fileList = []
                    //把video视频id和视频名称值清空
                    //上传视频id赋值
                    this.video.videoSourceId = ''
                    //上传视频名称赋值
                    this.video.videoOriginalName = ''
                })
        },
        //点击×调用这个方法
        beforeVodRemove(file,fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
         //上传视频成功调用的方法
         handleVodUploadSuccess(response, file, fileList) {
            //上传视频id赋值
            this.video.videoSourceId = response.data.videoId
            //上传视频名称赋值
            this.video.videoOriginalName = file.name
        },
        handleUploadExceed() {
            this.$message.warning('想要重新上传视频，请先删除已上传的视频')
        },
        //==============================小节操作====================================
        //删除小节
        removeVideo(videoId) {
            this.$confirm('此操作将删除小节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                video.deleteVideo(videoId)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除小节成功!'
                    });
                    //刷新页面
                    this.getChapterVideo()
                })
            }).catch(() => { //点击取消，执行catch方法
                // //取消也将 chapterId 设置为空
                // this.video.chapterId = ''
            }) 
        },
        
        //添加小节
        addVideo() {
            this.video.courseId = this.courseId 
            console.log(this.video.chapterId)
            video.addVideo(this.video)
                .then(res => {
                    this.dialogVideoFormVisible = false
                    this.$message({
                        type: 'success',
                        message: '添加小节成功!'
                    })
                    //刷新再次获取列表
                    this.getChapterVideo()
                    // //添加完成后 chapterId 设置为空
                    // this.video.chapterId = ''
                })
        },

        saveOrUpdateVideo() {
            this.addVideo()
        },

        // 添加小节弹框的方法,设置video的章节id
        openVideo(chapterId){
            this.dialogVideoFormVisible = true
            this.video.chapterId = chapterId
            this.video.title =  ''
            this.video.sort =  0
            this.video.free =  0 
        },
        //==============================章节操作====================================
        //删除章节
        removeChapter(chapterId) {
            this.$confirm('此操作将删除章节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                chapter.deleteChapter(chapterId)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //刷新页面
                    this.getChapterVideo()
                })
            }) //点击取消，执行catch方法
        },

        //！弹出修改章节页面，修改章节弹框数据回显
        openEditChatper(chapterId) {
            //弹框
            this.dialogChapterFormVisible = true
            //调用接口
            //修改章节弹框数据回显
            chapter.getChapter(chapterId)   
                .then(response => {
                    this.chapter = response.data.chapter
                })
        },
        //弹出添加章节页面
        openChapterDialog() {
            //弹框
            this.dialogChapterFormVisible = true
            //表单数据清空
            this.chapter.title = ''
            this.chapter.sort = 0
        },
        
        saveOrUpdate() {
            if(!this.chapter.id) {
                this.addChapter()
            } else {
                this.updateChapter()
            }
        },

        //修改章节的方法
        updateChapter() {
            chapter.updateChapter(this.chapter)
                .then(response =>  {
                    //关闭弹框
                    this.dialogChapterFormVisible = false
                    //提示
                    this.$message({
                        type: 'success',
                        message: '修改章节成功!'
                    });
                    //刷新页面
                    this.getChapterVideo()
                })
        },
        
        //添加章节
        addChapter() {
            //设置课程id到chapter对象里面
            this.chapter.courseId = this.courseId
            chapter.addChapter(this.chapter)
                .then(response => {
                    //关闭弹框
                    this.dialogChapterFormVisible = false
                    //提示
                    this.$message({
                        type: 'success',
                        message: '添加章节成功!'
                    });
                    //刷新页面
                    this.getChapterVideo()
                })
        },
        //=======================================
        //根据课程id查询章节和小节
        getChapterVideo() {
            chapter.getAllChapterVideo(this.courseId)
                .then(response => {
                    this.chapterVideoList = response.data.allChapterVideo
                })
        },
        
        previous(){
            //跳转到第一步
            console.log('previous')
            //此时的路径为 '/course/info/1' 因为上一步已经填好并保存了，此时是需要进行修改了
            this.$router.push({path:'/course/info/' + this.courseId})
        },
        next() {
            //跳转到第三步
            console.log('next')
            this.$router.push({ path: '/course/publish/' + this.courseId })
        }
    }
}
</script>

<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
  z-index: 1;
  position: relative,
}
.chanpterList .acts {
    z-index: 2;
    position: relative;
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>