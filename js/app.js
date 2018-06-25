(function () {

	/*const todos = [
		{
			id: 1,
			title: 'Taste JavaScript',
			completed: true
		},
		{
			id: 2,
			title: 'Buy a unicorn',
			completed: false
		}
	]*/

	// 特殊的： 聚焦不能使用 bind 钩子函数
	Vue.directive('focus', {
		inserted: function (el) {
			el.focus()
		}
	})

	// 该指令被作用到所有的 li 中的 input 上
	Vue.directive('todo-focus', {
		update (el, binding) {

			if (binding.value) {
				el.focus()
			}
		}
	})

	window.app = new Vue({
		data: {
			todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
			message: 'Todo List',
			editedTodo: '',
			filterText: 'all'
		},
		methods: {
			addNewTodos (e) {
				const target = e.target
				const value = e.target.value.trim()

				if (!value.length) {
					return
				}

				const todos = this.todos

				todos.push({
					id: todos.length ? todos[todos.length - 1] + 1 : 1,
					title: value,
					completed: false
				})
				target.value = ''
			},

			toggleTodos (e) {
				const checked = e.target.checked
				this.todos.forEach(item => {
					item.completed = checked
				})
			},

			deleteTodos (index) {
				this.todos.splice(index,1)
			},

			editTodos (todo) {
				// 把这个变量等于双击的 todo
				this.editedTodo = todo
			},

			keyDownTodos (todo, index, e) {
				const target = e.target
				const value = target.value.trim()
				if (!value.length) {
					this.todos.splice(index, 1)
				}
				else {
					todo.title = value
					this.editedTodo = null
				}
			},

			cancelEditTodos () {
				// 去除样式
				this.editedTodo = null
			},

			removeCompletedTodos () {

				for (let i = 0; i < this.todos.length; i++) {
					if (this.todos[i].completed) {
						this.todos.splice(i, 1)
						i --  // 在遍历过程中删除元素之后，让索引减一次，防止有漏网之鱼
					}
				}
			},


		},
		computed: {

			// 简写的方法
			// remainingCount () {
			// 	return this.todos.filter(t => !t.completed).length
			// }

			remainingCount: {
				// 访问 remainingCount 自动调用 get 方法
				get () {
					return this.todos.filter(t => !t.completed).length
				},
				// 当 实例.remainingCount = XXX 的时候自动调用 set 方法
				set () {

				}
			},

			toggleAllState: {
				// 取值
				get () {
					return this.todos.every(t => t.completed)
				},
				// 赋值
				set () {
					const checked = !this.toggleAllState
					this.todos.forEach(item => item.completed = checked)
				}
			},

			filterTodos () {
				// 如果 	all todos
				//		active todos.filter(t => !t.completed)
				//      completed todos.filter(t => t.completed)
				switch (this.filterText) {
					case 'active':
						return this.todos.filter(t => !t.completed);
						break;
					case 'completed':
						return this.todos.filter(t => t.completed);
						break;
					default:
						return this.todos
				}
			}
		},
		watch: {
			// 引用类型只能监视一层
			todos: {
				handler (val, oldVal) {
					// 侦听 todos 变化后储存本次变化记录
					// 这里既可以使用 this.todos 来访问，也可以使用 val 来的得到最新的 todos
					window.localStorage.setItem('todos', JSON.stringify(val))
				},
				deep: true
			},
		}

	}).$mount('#app')

	// 页面初始化的时候调用一次，保持路由路劲状态
	hashChange()

	// 该事件在页面初始化的时候不会执行，只有 change 才会执行
	// 注册 hash（锚点）的改变事件
	window.onhashchange = hashChange

	function hashChange() {
		app.filterText = window.location.hash.substr(2)
	}

})();
