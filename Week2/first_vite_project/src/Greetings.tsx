interface GreetingProps {
    name: string
}

function Greeting (props: GreetingProps) {
    return (
        <div>
            <h1>Hello, {props.name}! <br/> Welcome to Vite!</h1>
        </div>
    )
}

export default Greeting