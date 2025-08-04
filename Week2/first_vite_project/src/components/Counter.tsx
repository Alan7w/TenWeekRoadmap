import { useState, useEffect } from "react"

interface CounterProps {
    step?: number
    label?: string
    id?: string // Add unique identifier
}

function Counter (props: CounterProps) {
    const STORAGE_KEY = `counter-${props.id || 'default'}`
    
    const [count, setCount] = useState(() => {
        const savedCount = localStorage.getItem(STORAGE_KEY)
        return savedCount ? parseInt(savedCount, 10) : 0
    })
    
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, count.toString())
    }, [count, STORAGE_KEY])
    return (
        <div>
            <button onClick={() => setCount(count => {
                return count + (props.step || 1)
            })}>
                {props.label ||  "Count is "}: {count}
            </button>
        </div>
    )
}

export default Counter