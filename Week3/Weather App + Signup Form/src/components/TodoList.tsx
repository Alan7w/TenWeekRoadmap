import TodoItem from "./ToDoItem"

interface TodoListProps {
    items: Array <{
        id: number
        text: string
        completed: boolean
    }>
    onToggle: (id: number) => void
    onDelete: (id: number) => void
}

function TodoList (props: TodoListProps) {
    return (
        <div>
            {props.items.map(item => (
                <TodoItem
                    key={item.id}
                    id={item.id}
                    text = {item.text}
                    completed = {item.completed}
                    onToggle={props.onToggle}
                    onDelete={props.onDelete}
                />
            ))}
        </div>
    )
}

export default TodoList