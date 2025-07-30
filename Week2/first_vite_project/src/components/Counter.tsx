import { useState } from "react"

interface CounterProps {
    step?: number
}

function Counter (props: CounterProps) {
    const [count, setCount] = useState(0)
    return (
        <div>
            <button onClick={() => setCount(count => {
                return count + (props.step || 1)
            })}>
                Count is {count}
            </button>
        </div>
    )
}

export default Counter