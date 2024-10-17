'use client'

import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react"

export default function FormComments({ postId }: { postId: String }) {

   

    const [comment, setComment] = useState('')

    const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setComment(e.target.value)
    }

    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            const getToken = () => {
                const value = `; ${document.cookie}`
                const parts = value.split(`; token=`)
                if (parts.length === 2) return parts.pop()?.split(';').shift()
            }
            const token = getToken()
            const response = await axios.post('http://localhost:5173/comments', { comment, postId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setComment('')
        } catch (error) {
            console.log(error);
            
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit} className="mt-4 max-w-4xl p-20">
                <label htmlFor="comments" className="block text-gray-700 text-sm font-bold mb-2">Add Comment</label>
                <input type="text" className="max-w-5xl py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" name="comment " value={comment} onChange={handleCommentChange} />
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-1xl py-2 px-2 rounded-md mt-2 disabled:bg-gray-400 ml-5" disabled={comment.trim() === ''} >Send</button>
            </form>
        </>
    )
}