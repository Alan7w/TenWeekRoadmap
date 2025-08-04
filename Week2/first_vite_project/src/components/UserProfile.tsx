import { useState } from "react"

// import avatarImage from '../images/avatarImage.png'
// import flagstaff from '../images/flagstaff.png'
import crushpose from '../../images/crushpose.jpeg'

interface UserProfileProps {
    name: string
    avatarUrl?: string
    email: string
    bio?: string
}

function UserProfile (props: UserProfileProps) {
    const {name, email, bio} = props
    const defaultAvatar = crushpose
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState(props.avatarUrl || defaultAvatar)
    const [inputValue, setInputValue] = useState("")
    const defaultBio = "This is a placeholder bio!"
    
    const updateAvatar = () => {
        if (inputValue.trim()) {
            setCurrentAvatarUrl(inputValue.trim())
            setInputValue('')
        }
    }
    
    return (
        <div>
            <img 
                src={currentAvatarUrl} 
                alt={currentAvatarUrl == defaultAvatar ? `Default avatar for ${name}` : `${name}'s avatar`} 
                width={"250px"}
                height={"300px"}
            />
            <br />
            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={updateAvatar} style={{margin: "0.5rem 1rem"}}>Update Avatar</button>
            <button onClick={() => setCurrentAvatarUrl(defaultAvatar)} style={{margin: "0.5rem 1rem"}}>Reset Avatar</button>
            <h2>{name}</h2>
            <p>{email}</p>
            <p>{bio || defaultBio}</p>
        </div>
    )
}

export default UserProfile