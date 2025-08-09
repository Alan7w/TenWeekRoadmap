import TodoList from "../components/TodoList"
import '../styles/TodoList.css'
import { useState } from "react"

function TodoListPage() {
    const [todos, setTodos] = useState([
        { id: generateRandomID(), text: 'Learn React',       completed: false },
        { id: generateRandomID(), text: 'Build a Todo App',  completed: false },
        { id: generateRandomID(), text: 'Deploy to Vercel',  completed: false },
        { id: generateRandomID(), text: 'Write Tests',       completed: false }
    ])

    window.localStorage.setItem('storedTodos', JSON.stringify(todos))

    function generateRandomID () {
        return Math.floor(Math.random() * 1000)
    }

    function handleToggle (id:number) {
        const updatedTodos = todos.map(todo => todo.id == id ? { ...todo, completed: !todo.completed } : todo)
        setTodos(updatedTodos)
    }

    function handleDelete(id:number) {
        const updatedTodos = todos.filter(todo => todo.id !== id)
        setTodos(updatedTodos)
    }

    function addTodo () {
        const todoInput = document.getElementById('addTodoInput') as HTMLInputElement
        const newTodo = {id: generateRandomID(), text: todoInput.value, completed: false}
        todos.push(newTodo)
        setTodos([...todos])
        todoInput.value = ''
        console.log(todos)
    }

    return (
        <div className='todoListContainerStyle'>
            <h2 className='todoHeaderStyle'>Todo List</h2>
            <p className="todoSubtitleStyle">This is the list of the things I plan to do</p>
            <TodoList
                items={todos}
                onToggle={handleToggle}
                onDelete={handleDelete}
            />
            <div className="addTodoContainerStyle">
                <input type="text" id="addTodoInput" className="addTodoInputStyle"/>
                <button className='addTodoButtonStyle' onClick={addTodo}>Add Todo</button>
            </div>
            
        </div>
    )
}

export default TodoListPage