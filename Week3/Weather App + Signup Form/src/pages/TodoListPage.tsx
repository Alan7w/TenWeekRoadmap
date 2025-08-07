import TodoList from "../components/TodoList"
import '../styles/TodoList.css'
import { useState } from "react"

function TodoListPage() {
    const [todos, setTodos] = useState([
    { id: 543, text: 'Learn React',       completed: false },
    { id: 222, text: 'Build a Todo App',  completed: false },
    { id: 3245, text: 'Deploy to Vercel',  completed: false },
    { id: 7656, text: 'Write Tests',       completed: false }
  ])

  function handleToggle (id:number) {
    const updatedTodos = todos.map(todo => todo.id == id ? { ...todo, completed: !todo.completed } : todo)
    setTodos(updatedTodos)
  }

  function handleDelete(id:number) {
    const updatedTodos = todos.filter(todo => todo.id !== id)
    setTodos(updatedTodos)
  }

  return (
    <div className='todoListContainerStyle'>
    <h2 className='todoHeaderStyle'>Todo List</h2>
    <TodoList
        items={todos}
        onToggle={handleToggle}
        onDelete={handleDelete}
    />

    <button className='addTodoButtonStyle'>Add Todo</button>
    <button className='restoreTodosButtonStyle'>Restore Todos</button>
    </div>
  )
}

export default TodoListPage