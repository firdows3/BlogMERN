"use client"

import Link from "next/link"
import { ChangeEvent, FormEvent, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const inputClass = 'w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'


export default function Login() {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const router = useRouter()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5173/Login', formData)
            const token = response.data.token;
            document.cookie = `token =${token}; path=/; max-age=3600; secure; samesite=strict`
            router.push('/')
        } catch (error) {
            console.log(error);
            
        }
    }

    const isFormValid = () => {
        return (
            formData.email.trim() !== '' ||
            formData.password.trim() !== ''
        )
    }

    return (
        <div className="mt-20">
            <form className="max-w-md mx-auto p-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input type="email" className={inputClass} onChange={handleChange} value={formData.email} name="email" placeholder="Email"/>
                </div>
                <div className="mb-4">
                    <input type="password" className={inputClass} name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blur-600 text-white font-bold py-2 px-4 rounded-md fovus:outline-none focus:ring focus:border-blue-300 w-full disabled:bg-gray-400" disabled={!isFormValid()}>Submit</button>
            </form>
            <p className="max-w-md mx-auto p-4 text-small text-gray-500 text-center">Create account ?<Link href='/signup'>Signup</Link></p>
        </div>
    )
}