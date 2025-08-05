import { useState } from "react";
import "./SignUpForm.css";

function SignUpForm () {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    return (
        <div className="formContainerStyle" id="formContainer">
            <h1 className="headerStyle">This is the Signup Form</h1>
            <p className="subtitleStyle">Enter your details below:</p>

            <form action="#" className="formStyle">
                <label htmlFor="name" className="labelStyle">Name: </label>
                <input 
                    className="inputStyle"
                    type="text" 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({
                        ...formData, name: e.target.value
                    })}/>
                <br />

                <label htmlFor="email" className="labelStyle">Email: </label>
                <input
                    className="inputStyle"
                    type="email" 
                    id="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({
                        ...formData, email: e.target.value
                    })}/>
                <br />

                <label htmlFor="password" className="labelStyle">Password: </label>
                <input 
                    className="inputStyle"
                    type="password" 
                    id="password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({
                        ...formData, password: e.target.value
                    })}/>

                <button 
                    className="buttonStyle"
                    type="submit"
                    disabled = {!formData.name || !formData.email || !formData.password}                    
                    onClick={() => {
                        console.log("Form submitted with the following data:", formData)
                        setFormData({
                            name: "",
                            email: "",
                            password: "",
                        })
                        const successMessage = document.createElement('h2')
                        successMessage.innerText = "Account created successfully!"
                        successMessage.className = "successMessageStyle"
                        document.getElementById("formContainer")?.appendChild(successMessage)
                    }}
                >
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default SignUpForm;