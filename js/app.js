var vm = new Vue({
    el: '#main',
    data: {
        todoTitle: "",
        todo:{
            todo0: [],
            todo1: [],
            todo2: [],
            todo3: []
        },
        todoTag:[0,0,0,0]
    },
    methods: {
        addTodo: function (value) {
            var title = vm.$data.todoTitle;
            if(title != ""){
                var tempData = {title: title, time: value};
                var temp = vm.$data.todo;
                if(value == "0"){
                    temp['todo0'].push(tempData);
                }else if(value == "1"){
                    temp['todo1'].push(tempData);
                }else if(value == "2"){
                    temp['todo2'].push(tempData);
                }else if(value == "3"){
                    temp['todo3'].push(tempData);
                }
                vm.$data.todoTitle = "";
                todo.changeWord();
                todo.changeWidth();
            }else{
                alert("少侠你还没有输入任务内容呢。")
            }
        },
        finishTodo: function (title,time) {
            var temp = vm.$data.todo["todo"+time];
            for (var i = 0; i < temp.length; i++) {
                if (title === temp[i].title) {
                    temp.splice(i, 1);
                    break;
                }
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
            state = JSON.parse(state);
            console.log('resume state', JSON.stringify(state));
            vm.$data.todo = state;
        }else{
            vm.$data.todo = {
                todo0: [{title: "完成后点击「完事」", time: "0"}],
                todo1: [{title: "任务会自动排序", time: "1"}],
                todo2: [{title: "点击按钮设置紧要度", time: "2"}],
                todo3: [{title: "在输入框中添加任务", time: "3"}]
            }
        }
    },
    changeWord: function (){
        var i = Math.floor(Math.random() * 6);
        var funnyWord = ["你是开源社区的成员吗？", "拖延是可耻的！", "学而不思则罔，思而不学完蛋……", "又忘了做什么吗？面壁思过去！", "还有什么没完成？"];
        $("#input-todo").attr("placeholder", funnyWord[i]);
    },
    changeWidth: function(){
        var width = document.body.scrollWidth;
        $(".todolist-title").width(width-100);
    },
    init:function(){
        todo.resumeState();
    }
};

$(document).ready(function(){
    todo.init();
});

window.onunload = function () {
    todo.saveState();
};
