import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import SubHeading from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

export const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    return <div className="flex justify-center bg-gray-900 h-screen">

        <div className="flex justify-center flex-col">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign in"} />
                <SubHeading label={"Enter your credentials to access your account"} />
                <InputBox onChange={(e) => {
                    setEmail(e.target.value)
                }} label={"Email"} placeholder={"yogeshpoul9999@gmail.com"} />

                <InputBox onChange={(e) => {
                    setPassword(e.target.value)
                }} label={"Password"} placeholder={"123"} />
                <div className="pt-3">
                    <Button
                        onClick={async () => {
                            setIsLoading(true);
                            try {
                                const response = await axios.post(`${API_URL}/auth/login`, {
                                    email,
                                    password,
                                });
                                localStorage.setItem("token", "Bearer " + response.data.token);
                                navigate("/dashboard");
                            } catch (error) {
                                if (error.response && error.response.data && error.response.data.error) {
                                    alert(error.response.data.error); // Alert the error message from the server
                                } else {
                                    alert("An unexpected error occurred. Please try again."); // Fallback for other errors
                                }
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        label={isLoading ? "Loading..." : "Sign in"}
                    />
                </div>
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
            </div>
        </div>
    </div>
}