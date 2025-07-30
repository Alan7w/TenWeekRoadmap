interface GreetingProps {
    name: string
    message: 'You are 22 years old!'
    count: number
}

function Greeting (props: GreetingProps) {
    return (
        <div>
            <h1 style={{ color: 'slategray', fontFamily: 'Arial'}}>Hello, {props.name}! <br/> Welcome to Vite!</h1>
            <p style={{ color: 'magenta', fontFamily: 'Arial'}}>{props.message}</p>
            <h2 style={{ fontSize: '24px', color: 'aqua'}}>You have {props.count} unread messages.</h2>
        </div>
    )
}

export default Greeting