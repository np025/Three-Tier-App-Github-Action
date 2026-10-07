import { useState } from "react"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import SubHeading from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BottomWarning } from "../components/BottomWarning"
import { API_URL } from "../config"

export const Signup = () => {
    const [fullName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    

    const handleSignup = async () => {
        setLoading(true);
        try {
            console.log("api URL",API_URL)
            const response = await axios.post(`${API_URL}/auth/signup`, {
                fullName,
                email,
                password
            });

            console.log("response",response);
            if (response.status === 200) {
                navigate("/");
            } else {
                alert("Enter Correct details!");
            }
        } catch (error) {
            alert("Error occurred during sign up. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center bg-gray-900 h-screen bg-cover bg-no-repeat">
            <div className="flex flex-col flex-justify-center m-auto mt-28">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign Up"} />
                    <SubHeading label={"Enter your infromation to create account"} />
                    <InputBox onChange={(e) => {
                        setName(e.target.value)
                    }} label={"Name"} placeholder={"Name"} />
    
                    <InputBox onChange={(e) => {
                        setEmail(e.target.value)
                    }} label={"Email"} placeholder={"email@gmail.com"} />
                    <InputBox onChange={(e) => {
                        setPassword(e.target.value)
                    }} label={"password"} placeholder={"password"} />
                    <div className="pt-4">
                        <Button onClick={handleSignup} label={loading ? "Signing up..." : "Sign up"} disabled={loading} />
                    </div>
                    <BottomWarning label={"Already have an account ? "} buttonText={"Sign In"} to={"/signin"} />
                    {/* <BottomWarning label={"Already have an account ? "} buttonText={"Sign In"} to={"/signin"} /> */}
                </div>
            </div>
        </div>
    );
};