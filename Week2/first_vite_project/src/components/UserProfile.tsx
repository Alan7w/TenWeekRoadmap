import { useState } from "react"

interface UserProfileProps {
    name: string
    avatarUrl?: string
    email: string
    bio?: string
}

function UserProfile (props: UserProfileProps) {
    const {name, email, bio} = props
    const defaultAvatar = "https://github.com/identicons/jasonlong.png"
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
            />
            <br />
            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={updateAvatar}>Update Avatar</button>
            <button onClick={() => setCurrentAvatarUrl(defaultAvatar)}>Reset Avatar</button>
            <h2>{name}</h2>
            <p>{email}</p>
            <p>{bio || defaultBio}</p>
        </div>
    )
}

export default UserProfile