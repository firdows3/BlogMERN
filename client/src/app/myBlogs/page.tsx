'use client'

import FormPost from "@/Components/form-post";
import axios from "axios";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export default function MyBlogs() {

    const inputClass = 'w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'


    type MyPost = {
        id: String,
        content: String,
        title: String,
    }

    const [myPost, setMypost] = useState<MyPost[]>([])
    const myPostReversed = myPost && [...myPost].reverse();
    const [searchQuery, setSearchQuery] = useState('')
    const [searchedBlogs, setSearchedBlogs] = useState<MyPost[]>([])

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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchQuery(e.target.value)
    }

    const filteredSearchBlogs = myPostReversed?.filter(post => {
        return post?.title.toLowerCase().includes(searchQuery.toLowerCase())
    })
    useEffect(() => {
        setSearchedBlogs(filteredSearchBlogs)
    }, [searchQuery])

    return (
        <main className="max-w-4xl mx-auto my-5 mt-20">
            <div className="max-w-4xl mx-auto y-8 mb-20">
                <h1 className="text-3xl font-bold">My Blogs</h1>
                <div className="mb-4">
                    <input type="text" className={inputClass} placeholder="Search" name="search" value={searchQuery} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {searchQuery ?
                        searchedBlogs?.map((post, index) => {

                            return (
                                <Link key={index} href={`/myBlogs/${post?.id}`} className="bg-white p-4 rounded-md shadow-md text-black break-words overflow-auto max-h-32 " style={{ scrollbarWidth: 'none' }}>
                                    <h1 className="text-3xl font-bold mb-4">{post?.title.toLocaleUpperCase()}</h1>
                                    <p>{post?.content}</p>
                                </Link>
                            )
                        })
                        :
                        myPostReversed?.map((post, index) => {

                            return (
                                <Link key={index} href={`/myBlogs/${post?.id}`} className="bg-white p-4 rounded-md shadow-md text-black break-words overflow-auto max-h-32 " style={{ scrollbarWidth: 'none' }}>
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