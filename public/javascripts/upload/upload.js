function PhotoUpload(v,control){
               let viewParams = {
                    inputFile:null,
                    dragDrop:null,
                    submitBtn:null,
                }

                let controlParams = {
                    filter:function(file){
                        return file
                    },

                }
                this.domCount = 0; //缓存Dom数
                this.control = $.extend({},controlParams,control);//筛选照片等方法 
                this.views = $.extend({},viewParams,v); //关于DOM的相关残书
                this.fileArray = [];//存放待上传的照片
                this.dragDrop = this.views.dragDrop;
                this.inform = this.control.inform;
                console.log('asf',control)
                this.init();
            }

            PhotoUpload.prototype = {
                init:function(){
                    let self = this;
                    
                    if(this.views.inputFile){
                        this.views.inputFile.on("change",function(e){
                            self.getFiles(e);
                        });
                    }
                    if(this.views.submitBtn){
                        this.views.submitBtn.on("click",function(e){
                            self.submitData();
                        })
                    }
                },
                submitData:function(){
                    let self = this;
                    let file = this.fileArray;
                    let form  = new FormData();
                    let condition = this.fileArray.length <= 0?true:false;
                    let checked = this.inform.author = self.control.check(condition);
                    let opt = this.control.ajaxConfig;
                    if(!checked){
                        this.views.inputAuthor();
                        return
                    }else{
                        for(let i = 0; i < file.length; i++){
                            form.append('file',file[i]);
                        }
                        console.log('thisi',file)

                        form.append('information',JSON.stringify(this.inform));
                        self.Ajax(opt,form);
                        
                    }
                    
                },

                Ajax:function(opt,form){
                    let xhr = new XMLHttpRequest();
                    let self = this;
                    if(xhr.upload){ 
                        xhr.upload.addEventListener("progress",function(e){ 
                            console.log(e.total)
                        },false);
                    }

                    xhr.onreadystatechange = function(e){
                        if(xhr.readyState === 4){ 
                        //与服务端链接状态 
                            if(xhr.status === 200){ 
                            //服务器返回状态
                                let res = JSON.parse(xhr.responseText)
                            console.log('r',opt.file)
                                self.successCb(res)
                                /*self.views.success();*/
                            }else{
                                alert('上传失败')
                            }
                        }
                    }

                    xhr.open(opt.type,opt.url,opt.async);

                    xhr.send(form||null);

                },

                dropEvent:function(e){

                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    let type = e.type === "dragover"? "onDragOver": "onDragLeave";
                    e.target[type];
                    return this
                },
                delete:function(j){    
                    let targetFile = this.fileArray[j];
                    this.upArray(targetFile);
                        
                },

                /*把要删除的数据从数组清除*/
                upArray:function(targetFile){
                    let temArr = [];
                    let k = 0;
                    let tar = arguments.length === 2?arguments[1]:arguments[0].name
                    console.log('fie',this.fileArray)
                    for(let i = 0; i < this.fileArray.length; i++){
                            if(this.fileArray[i].name !== tar){
                                this.fileArray[i].index = k;
                                temArr.push(this.fileArray[i]);
                                k++
                            }else{
                               this.fileArray[i].index = k;
                            }
                        }
                    
                    this.fileArray = temArr;
                },

                getFiles:function(e){
                    e = e || window.event;
                    if(e.type !== "change") {
                        this.dropEvent(e);
                    }
                    
                    let self = this;
                    let file = e.target.files || e.dataTransfer.files;
                    let len = this.fileArray.length;
                    let target = e.target;
                    let tempO = this.control.filter(file);
                    console.log('te',tempO)
                    if(tempO.match) {
                        this.views.imgEorr(tempO); 
                        return
                    };
                    let finalfile = tempO.data;
                    this.opreatfile(finalfile,len);
                    this.views.selected(finalfile,target,this);                    
                },

                opreatfile:function(file,arrLen){
                   let len = arrLen;
                   for(let i = 0; i < file.length; i++){
                    if(!file[i].hasOwnProperty("index")){
                        file[i].index = len + i
                        this.fileArray.push(file[i]);
                    }
                   }
                },
                successCb:function(msg){
                    console.log('msg',msg)
                    if(msg.codeStatus === 0){
                        alert('部分上传失败')    
                    }else{
                        alert('全部上传成功')
                    }
                    msg.sucData.forEach((item)=>{
                        this.upArray(null,item)
                    })
                    
                }
            }
    
            window.photoUpload = PhotoUpload;