var vm = new Vue({
    el: '#main',
    data: {
        todoTitle: "",
        todo: [
        ]
    },
    methods: {
        addTodo: function (value) {
            var title = vm.$data.todoTitle;
            var temp = {title: title, time: value};
            vm.$data.todo.push(temp);
        },
        finishTodo: function (title) {
            var temp = vm.$data.todo;
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
        }
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
