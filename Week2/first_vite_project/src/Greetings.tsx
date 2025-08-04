interface GreetingProps {
    name: string
    message: string
    count: number
}

function Greeting (props: GreetingProps) {
    return (
        <div>
            <h1 style={{ color: 'slategray', fontFamily: 'Arial'}}>Hello, {props.name}! </h1>
            <h2 style={{ color: 'magenta', fontFamily: 'Arial'}}>{props.message}</h2>
            <p style={{ fontSize: '24px', color: 'aqua'}}>You have {props.count} unread messages.</p>
        </div>
    )
}

export default Greeting