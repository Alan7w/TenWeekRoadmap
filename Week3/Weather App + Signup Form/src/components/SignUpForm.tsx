import { useState, useRef } from "react";
import "../styles/SignUpForm.css";

function SignUpForm () {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    function validateForm () {
        if (!formData.email.includes('@') || !formData.email.includes('.com')) {
            emailRef.current?.focus()
            return
        } else {
            if (validatePassword(formData.password)) {
                console.log("Form submitted with the following data:", formData)
                const successMessage = document.createElement('h2')
                successMessage.innerText = "Account created successfully!"
                successMessage.className = "successMessageStyle"
                document.getElementById("formContainer")?.appendChild(successMessage)
            } else {
                passwordRef.current?.focus()
                return
            }
        }

        setFormData({
            name: "",
            email: "",
            password: "",
        })
    }

    function validatePassword (inputValue: string) {
        const reqs = [
            { id: '1', test: (v: string) => v.length >= 8 },
            { id: '2', test: (v: string) => /[0-9]/.test(v) },
            { id: '3', test: (v: string) => /[!@#$%^&*]/.test(v) }
        ];
        let validCount = 0;
        reqs.forEach(({ id, test }) => {
            const reqItem = document.getElementById(id);
            const valid = test(inputValue);
            reqItem?.style.setProperty("color", valid ? "green" : "red");
            if (valid) validCount++;
        });
        return validCount == reqs.length;
    }

    return (
        <div className="formContainerStyle" id="formContainer">
            <h1 className="headerStyle">This is the Signup Form</h1>
            <p className="subtitleStyle">Enter your details below:</p>

            <form action="#" className="formStyle">
                <label htmlFor="name" className="labelStyle">Name: </label>
                <input 
                    ref={nameRef}
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
                    ref={emailRef}
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
                    ref={passwordRef}
                    className="inputStyle"
                    type="password" 
                    id="password" 
                    value={formData.password} 
                    onInput={(e) => validatePassword((e.target as HTMLInputElement).value)}
                    onChange={(e) => setFormData({
                        ...formData, password: e.target.value
                    })}/>

                <h3 style={{ textAlign: "center", color: "#262637" }}>Password requirements:</h3>
                <ul className="passwordRequirementsStyle">
                    <li id="1">At least 8 characters long</li>
                    <li id="2">Includes at least 1 number</li>
                    <li id="3">Includes at least 1 special character (e.g., !@#$%^&*)</li>
                </ul>

                <button 
                    className="buttonStyle"
                    type="submit"
                    disabled = {!formData.name || !formData.email || !formData.password}                    
                    onClick={() => {validateForm()}}
                >
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default SignUpForm;