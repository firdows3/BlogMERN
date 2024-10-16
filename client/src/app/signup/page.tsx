"use client"

import Link from "next/link"
import { ChangeEvent, FormEvent, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const inputClass = 'w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'


export default function Signup() {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5173/Signup', formData)
            router.push('/login')
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="mt-20">
            <form className="max-w-md mx-auto p-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input type="text" className={inputClass} placeholder="Username" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <input type="email" className={inputClass} onChange={handleChange} value={formData.email} name="email" placeholder="Email"/>
                </div>
                <div className="mb-4">
                    <input type="password" className={inputClass} name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blur-600 text-white font-bold py-2 px-4 rounded-md fovus:outline-none focus:ring focus:border-blue-300 w-full disabled:bg-gray-400">Submit</button>
            </form>
            <p className="max-w-md mx-auto p-4 text-small text-gray-500 text-center">Already have an account ?<Link href='/login'>Login</Link></p>
        </div>
    )
}