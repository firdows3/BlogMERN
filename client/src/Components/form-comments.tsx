'use client'

import { ChangeEvent, useState } from "react"

export default function FormComments () {

    const [comment, setComment] = useState('')

    const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setComment(e.target.value)
    }

    const handleSubmit = () => {
        console.log(comment);
        
    }

    return (
        <>
        <div className="mt-4 max-w-4xl p-20">
            <label htmlFor="comments" className="block text-gray-700 text-sm font-bold mb-2">Add Comment</label>
            <input type="text" className="max-w-5xl py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" name="comment " value={comment}  onChange={handleCommentChange}/>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-1xl py-2 px-2 rounded-md mt-2 disabled:bg-gray-400 ml-5" onSubmit={handleSubmit}>Send</button>
        </div>
        </>
    )
}