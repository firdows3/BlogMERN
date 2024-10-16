'use client'

import FormPost from "@/Components/form-post";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyBlogs() {

    type MyPost = {
        id: String,
        content: String,
        title: String,
    }

    const [myPost, setMypost] = useState<MyPost[]>([])
    const myPostReversed = myPost && [...myPost].reverse();

    const fetchPost = async () => {
        const getToken = () => {
            const value = `; ${document.cookie}`
            const parts = value.split(`; token=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift()
        }
        const token = getToken();
        try {
            const response = await axios.get('http://localhost:5173/blogPost', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMypost(response.data.myBlogs)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPost();
    }, [])

    return (
        <main className="max-w-4xl mx-auto my-5 mt-20">
            <div className="max-w-4xl mx-auto y-8 mb-20">
                <h1 className="text-3xl font-bold mb-4">My Blogs</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {myPostReversed?.map((post, index) => {

                        return (
                            <Link key={index} href={`/myBlogs/${post?.id}`} className="bg-white p-4 rounded-md shadow-md text-black break-words overflow-auto max-h-32 " style={{scrollbarWidth: 'none'}}>
                                <h1 className="text-3xl font-bold mb-4">{post?.title.toLocaleUpperCase()}</h1>
                                <p>{post?.content}</p>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <FormPost />
        </main>
    )
}