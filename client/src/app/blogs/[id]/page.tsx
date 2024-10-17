'use client'

import Comments from "@/Components/comments";
import FormComments from "@/Components/form-comments";
import axios from "axios";
import { useEffect, useState } from "react";

export default function BlogDetail({ params }: { params: { id: String } }) {

    type EachPostType = {
        title: String,
        content: String,
        username: String
    }
    const [eachPost, setEachPost] = useState<EachPostType>()

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:5173/blogPost/${params.id}`)
            setEachPost(response.data)
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPost()
    }, [])

    return (
        <>
            <div className=" mx-auto y-8 p-20">
                <div className="w-md bg-white p-4 rounded-md shadow-md text-black break words">
                    <h1 className="text-3xl font-bold mb-4">{eachPost?.title.toLocaleUpperCase()}</h1>
                    <p>{eachPost?.content}</p>
                    <h6 className="text-gray-500 text-right">written by: {eachPost?.username}</h6>
                </div>
            </div>
            <Comments postId={params.id} />
            <FormComments postId={params.id} />
        </>
    )
}