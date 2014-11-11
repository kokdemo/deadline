var vm = new Vue({
    el: '#main',
    data: {
        showPage: {
            todolist: true,
            history: false,
            statistics: false
        },
        todoTitle: "",
        childTodo: [],
        todo:{
            todo0: [],
            todo1: [],
            todo2: [],
            todo3: [],
            history: []
        },
        todoList:[{name:"todo3"},{name:"todo2"},{name:"todo1"},{name:"todo0"}],
        todoTag:[0,0,0,0]
    },
    methods: {
        //增加todo 区分单一任务和子任务
        addTodo: function (value) {
            var title = vm.$data.todoTitle;
            if(title != "" || vm.$data.childTodo != []){
                var date = new Date();
                //alert(vm.$data.childTodo !="");
                if(vm.$data.childTodo != ""){
                    //有子任务
                    //alert(title);
                    var tempData = {
                        title: vm.$data.childTodo[0].title,
                        time:value,
                        lock:false,
                        timestamp:date.getTime(),
                        show:true,
                        childTodo: vm.$data.childTodo
                    };
                }else{
                    var tempData = {
                        title: title,
                        time:value,
                        lock:false,
                        timestamp:date.getTime(),
                        show:true,
                        childTodo: vm.$data.childTodo
                    };
                    //alert(tempData.title);
                }
                var temp = vm.$data.todo;
                temp['todo'+value].push(tempData);
                vm.$data.todoTitle = "";
                vm.$data.childTodo = [];
                todo.changeWord();
                todo.changeWidth();
                //console.info(vm.$data.childTodo);
            }else{
                alert("少侠你还没有输入任务内容呢。")
            }
        },
        //完成一整个任务
        finishTodo: function (title,time,child) {
            var temp = vm.$data.todo["todo"+time];
            for (var i = 0; i < temp.length; i++) {
                if (title === temp[i].title) {

                    if(child != null){
                        //如果任务的传入子任务不为空，说明不是一个单一任务。
                        var childArray = temp[i].childTodo;
                        for(var j=0;j<childArray.length;j++){
                            if(child == childArray[j].title){
                                //childArray.splice(j, 1);
                                childArray[j].show = false;
                                alert(childArray[j]);
                            }
                        }
                    }else{
                        //如果任务的传入子任务其他情况，说明是一个单一任务或者全任务被完成。
                        //alert(child);
                        var date = new Date();
                        if(temp[i].lock == true){
                            //如果任务被锁定，点击完成，任务只会被隐藏而不会消失,同时时间戳更新。
                            temp[i].timestamp = date.getTime();
                            temp[i].show = false;
                        }else{
                            var done= temp.splice(i, 1);
                            var addtime = new Date(parseInt(done[0].timestamp));
                            //var date = now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                            var cost = (date.getTime() - done[0].timestamp)/1000;
                            var costTime = "";
                            if(cost >= 3600*24){
                                //如果花费时间大于一天
                                costTime = Math.floor(cost/(3600*24)) + 'd';
                            }else if(cost >= 3600){
                                //如果花费时间大于一小时
                                costTime = Math.floor(cost/3600) + 'h';
                            }else if(cost >= 60){
                                //如果花费时间小于一小时
                                costTime = Math.floor(cost/60) + 'm';
                            }else{
                                //花费小于一分钟
                                costTime = '一瞬';
                            }
                            //alert(costTime);
                            done[0].cost = costTime;
                            done[0].timestamp = addtime.getMonth()+'/'+addtime.getDate();
                            vm.$data.todo.history.push(done[0]);
                        }
                        break;
                    }

                }
            }
        },
        //增加添加中的子任务
        addChildTodo: function(){
            //alert("1");
            var title = vm.$data.todoTitle;
            if(title != ""){
                vm.$data.childTodo.push({title:title,show:true});
                vm.$data.todoTitle = "";
            }else{
                alert("少侠你还没有输入任务内容呢。")
            }

        },
        //移除添加中的子任务
        removeChildTodo: function(title){
            var temp = vm.$data.childTodo;
            if (title === temp[0].title){
                //如果移除主标题，那么就删除整个子任务
                vm.$data.childTodo = [];
            }
            for (var i = 1; i < temp.length; i++) {
                //如果不是点击标题，那么按条删除
                if (title === temp[i].title) {
                    temp.splice(i, 1);
                    break;
                }
            }
        },
        //切换任务状态
        toggleTask: function(title,time){
            var temp = vm.$data.todo["todo"+time];
            for (var i = 0; i < temp.length; i++) {
                if (title === temp[i].title) {

                    temp[i].lock = !temp[i].lock;
                    break;
                }
            }
            setTimeout(function(){
                todo.changeWidth();
            },50);
        },
        //删除所有任务并初始化
        deleteAll: function(){
            if(confirm("确定要移除所有的任务吗？"))
            {
                vm.$data.todo ={};
//                vm.$data.todo['todo0'] = [];
//                vm.$data.todo['todo1'] = [];
//                vm.$data.todo['todo2'] = [];
//                vm.$data.todo['todo3'] = [];
            }
            else
            {
                alert("你大概是手滑了……");
            }
        },
        //切换页面
        tabPage: function(name){
            var temp = vm.$data.showPage;
            for(var i in temp){
                if( i == name ){
                    temp[i] = true;
                }else{
                    temp[i] = false;
                }
                //alert(temp);
            }
        }
    }
});

var todo = {
    saveState: function () {
        var state = vm.$data.todo;
        try {
            localStorage.setItem('todofiles', JSON.stringify(state));
            console.log('save state', JSON.stringify(state));
        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
                alert('Quota exceeded!');
            }
        }
    },
    resumeState: function () {
        var state = localStorage.getItem('todofiles');
        if (state) {
            var date =new Date();
            var timestamp = date.getTime();
            var hour = date.getHours();
            state = JSON.parse(state);
            //console.log('resume state', JSON.stringify(state));
            vm.$data.todo = state;
            //搜索一遍所有的任务，按照条件还原那些锁定任务。
            var temp = vm.$data.todo;
            var todolist = ["todo0","todo1","todo2","todo3"];
            for(var i=0;i< todolist.length;i++){
                var tempArray = temp[todolist[i]];
                for(var j=0;j<tempArray.length;j++){
                    var tempObj = tempArray[j];
                    //判断，当任务被隐藏，且时间戳小于当前时间4小时以上，且访问事件晚于早晨8点
                    if(tempObj.show == false && timestamp - tempObj.timestamp >14400  && hour >= 8){
                        tempObj.show = true;
                    }
                }
            }
        }else{
            this.resetData();
        }
    },
    resetData: function(){
        var date = new Date();
        var timestamp = date.getTime();
        vm.$data.todo = {
            todo3: [
                {title: "在输入框中添加任务", time: "3",show:true, lock:false,timestamp:timestamp,childTodo:[]},
                {title: "点击按钮设置紧要度", time: "3",show:true, lock:false,timestamp:timestamp,childTodo:[]},
                {title: "完成后点击「完事」", time: "3",show:true, lock:false,timestamp:timestamp,childTodo:[]},
                {title: "任务会自动排序", time: "3",show:true,timestamp:timestamp,childTodo:[]}
            ],
            todo2: [
                {title: "接着尝试「锁定」", time: "2",show:true,lock:false,timestamp:timestamp,childTodo:[]},
                {title: "点击任务标题锁定", time: "2",show:true,lock:false,timestamp:timestamp,childTodo:[]},
                {title: "再次点击会解锁", time: "2",show:true,lock:false ,timestamp:timestamp,childTodo:[] },
                {title: "锁定任务每天刷新", time: "2",show:true,lock:false,timestamp:timestamp,childTodo:[]}
            ],
            todo1: [
                {title: "", time: "1",show:true,lock:false,timestamp:timestamp,
                    childTodo:[
                        {title: "开始体验子任务",show:true},
                        {title: "在输入框中输入",show:true},
                        {title: "输入回车增加子任务",show:true},
                        {title: "其余同part1",show:true}
                    ]
                }
            ],
            todo0: [
                {title: "最后提示", time: "0",show:true,lock:false,timestamp:timestamp,childTodo:[]},
                {title: "「删除所有」危险", time: "0",show:true,lock:false,timestamp:timestamp,childTodo:[]},
                {title: "开始你的「俟现」吧！", time: "0",show:true,lock:false,timestamp:timestamp,childTodo:[]}
            ]
        }
    },
    changeWord: function (){
        var i = Math.floor(Math.random() * 6);
        var funnyWord = ["你是开源社区的成员吗？", "拖延是可耻的！", "学而不思则罔，思而不学完蛋……", "又忘了做什么吗？面壁思过去！", "还有什么没完成？"];
        $("#input-todo").attr("placeholder", funnyWord[i]);
    },
    changeWidth: function(){
        var width = document.body.scrollWidth;
        if(width>600){
            width = 600 ;
        }
        $(".todolist-title").width(width*0.95-110);
    },
    init:function(){
        todo.changeWidth();
        todo.resumeState();
        setTimeout(function(){todo.changeWidth()},100);
        setTimeout(function(){todo.changeWidth()},100);
        setTimeout(function(){todo.changeWidth()},100);
    }
};

$(document).ready(function(){
    todo.init();
});

window.onunload = function () {
    todo.saveState();
};
