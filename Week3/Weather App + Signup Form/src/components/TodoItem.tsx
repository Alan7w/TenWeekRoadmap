import '../styles/TodoList.css'

interface TodoItemProps {
    id: number
    text: string
    completed: boolean
    onToggle: (id: number) => void
    onDelete: (id: number) => void
}

function TodoItem (props: TodoItemProps) {
    return (
        <div className="todoItemStyle">
            <label className={props.completed ? 'todoLabelCompleted' : 'todoLabelStyle'} htmlFor={props.text}>{props.text}</label>
            <input 
                id={props.text} 
                type="checkbox" 
                checked={props.completed} 
                onChange={() => {
                    props.onToggle(props.id)
                }} 
            />
            <button className='todoDeleteButtonStyle' onClick={() => props.onDelete(props.id)}>
                Delete
            </button>
        </div>
    )
}

export default TodoItem