"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"

const inputClass = 'w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'


export default function FormPost() {

    const [formData, setFormData] = useState({
        title: '',
        content: ''
    })
    const router = useRouter()

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        e.preventDefault();;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        try {
            const getToken = () => {
                const value = `; ${document.cookie}`
                const parts = value.split(`; token=`);
                if (parts.length === 2) return parts.pop()?.split(';').shift()
            }
            const token = getToken();
            const response = axios.post('http://localhost:5173/blogPost', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            router.push('/blogs')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <form className="max-w-md mx-auto p-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input type="text" className={inputClass} placeholder="Enter the title" name="title" value={formData.title} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <textarea className={inputClass} placeholder="Enter the content" name="content" value={formData.content} onChange={handleChange} />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blur-600 text-white font-bold py-2 px-4 rounded-md fovus:outline-none focus:ring focus:border-blue-300 w-full disabled:bg-gray-400">Submit</button>
            </form>
        </>
    )
}