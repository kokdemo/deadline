/*global jQuery, Handlebars */
function progressBar(){
	var now = new Date;
	var nowTime = now.getTime();
	var dom = $("li .progress-bar");
	var texts = $(".lastTime span");
	var lastTime=[],partTime=[],tomato;
	var datas = JSON.parse(localStorage.getItem("todos"));
	for (var i = 0; i <= datas.length - 1; i++) {
		lastTime[i] = Math.floor((nowTime - datas[i].time)/1000);
		partTime[i] = (datas[i].plan-lastTime[i])/datas[i].plan*100;
		tomato = Math.floor((datas[i].plan-lastTime[i])/60/25);
		if (partTime[i] >0 ) {
			if (partTime[i] > 66) {
				dom.eq(i).attr('class','progress-bar progress-bar-striped active progress-bar-success')
			} else if (partTime[i] > 33){
					dom.eq(i).attr('class','progress-bar progress-bar-striped active progress-bar-warning')
			} else{
				dom.eq(i).attr('class','progress-bar progress-bar-striped active progress-bar-danger')
			}
			dom.eq(i).attr('style','width:'+partTime[i]+"%");
			texts.eq(i).text(tomato+"个番茄")
		} else{
			dom.eq(i).addClass('progress-bar-default');
            dom.eq(i).children().css("color","black");
			texts.eq(i).text("拖延乃兵家常事，大侠请重新来过");
		};
	};
}

function titleClick(){
    $(".title-span").click(function(){
        $(this).toggleClass("hidden");
        $(this).next().toggleClass("hidden");
        //alert("1");
    });
}
jQuery(function( $ ) {
	'use strict';

	var Utils = {
		// https://gist.github.com/1308368
		uuid: function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b},
		pluralize: function( count, word ) {
			return count === 1 ? word : word + 's';
		},
		store: function( namespace, data ) {
			if ( arguments.length > 1 ) {
				return localStorage.setItem( namespace, JSON.stringify( data ) );
			} else {
				var store = localStorage.getItem( namespace );
				return ( store && JSON.parse( store ) ) || [];
			}
		}
	};

	var App = {
		init: function() {
			this.ENTER_KEY = 13;
			this.todos = Utils.store('todos');
			this.cacheElements();
			this.bindEvents();
			this.render();
			
		},
		cacheElements: function() {
			this.todoTemplate = Handlebars.compile( $('#todo-template').html() );
			this.footerTemplate = Handlebars.compile( $('#footer-template').html() );
			this.$todoApp = $('#todoapp');
			this.$newTodo = $('#new-todo');
            this.$plantimes = $('#plan-times-minute');
            this.$btnsubmit = $('#btn-submit');
			this.$toggleAll = $('#toggle-all');
			this.$main = $('#main');
			this.$todoList = $('#todo-list');
			this.$footer = this.$todoApp.find('#footer');
			this.$count = $('#todo-count');
			this.$clearBtn = $('#clear-completed');
		},
		bindEvents: function() {
			var list = this.$todoList;
            this.$btnsubmit.on( 'click',this.create);
			//this.$plantimes.on( 'keyup', this.create );
			this.$toggleAll.on( 'change', this.toggleAll );
			this.$footer.on( 'click', '#clear-completed', this.destroyCompleted );
			list.on( 'change', '.toggle', this.toggle );
			list.on( 'dblclick', 'label', this.edit );
			list.on( 'keypress', '.edit', this.blurOnEnter );
			list.on( 'blur', '.edit', this.update );
			list.on( 'click', '.destroy', this.destroy );

		},
		render: function() {
			this.$todoList.html( this.todoTemplate( this.todos ) );
			this.$main.toggle( !!this.todos.length );
			this.$toggleAll.prop( 'checked', !this.activeTodoCount() );
			this.renderFooter();

			Utils.store( 'todos', this.todos );
			progressBar();
            titleClick();

		},
		renderFooter: function() {
			var todoCount = this.todos.length,
				activeTodoCount = this.activeTodoCount(),
				footer = {
					activeTodoCount: activeTodoCount,
					activeTodoWord: Utils.pluralize( activeTodoCount, 'item' ),
					completedTodos: todoCount - activeTodoCount
				};

			this.$footer.toggle( !!todoCount );
			this.$footer.html( this.footerTemplate( footer ) );
		},
		toggleAll: function() {
			var isChecked = $( this ).prop('checked');
			$.each( App.todos, function( i, val ) {
				val.completed = isChecked;
			});
			App.render();
		},
		activeTodoCount: function() {
			var count = 0;
			$.each( this.todos, function( i, val ) {
				if ( !val.completed ) {
					count++;
				}
			});
			return count;
		},
		destroyCompleted: function() {
			var todos = App.todos,
				l = todos.length;
			while ( l-- ) {
				if ( todos[l].completed ) {
					todos.splice( l, 1 );
				}
			}
			App.render();
		},
		// Accepts an element from inside the ".item" div and
		// returns the corresponding todo in the todos array
		getTodo: function( elem, callback ) {
			var id = $( elem ).closest('li').data('id');
			$.each( this.todos, function( i, val ) {
				if ( val.id === id ) {
					callback.apply( App, arguments );
					return false;
				}
			});
		},
		create: function(e) {
            var $planhour = $('#plan-times-hour');
            var $planminute = $('#plan-times-minute');
            var $plan = $planhour.val()*3600+$planminute.val()*60;
			var $input = $("#new-todo"),
				val = $.trim( $input.val() );
			if (!val ||!$plan ) {
				return;
			}
			var createtime= new Date;
		   	var timevalue = createtime.getTime();
		   
			App.todos.push({
				id: Utils.uuid(),
				title: val,
				completed: false,
				time: timevalue,
                plan: parseInt($plan)
			});
			$input.val('');
            $planhour.val(0);
            $planminute.val(0);
			App.render();
			
		},
		
		toggle: function() {
			App.getTodo( this, function( i, val ) {
				val.completed = !val.completed;
			});
			App.render();
		},
		edit: function() {
			$(this).closest('li').addClass('editing').find('.edit').focus();
		},
		blurOnEnter: function( e ) {
			if ( e.keyCode === App.ENTER_KEY ) {
				e.target.blur();
			}
		},
		update: function() {
			var val = $.trim( $(this).removeClass('editing').val() );
			App.getTodo( this, function( i ) {
				if ( val ) {
					this.todos[ i ].title = val;
				} else {
					this.todos.splice( i, 1 );
				}
				this.render();
			});
		},
		destroy: function() {
			App.getTodo( this, function( i ) {
				this.todos.splice( i, 1 );
				this.render();
			});
		}
	};
	
	App.init();
	setInterval('progressBar()',5000);
    //titleClick();
});
