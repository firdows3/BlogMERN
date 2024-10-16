'use client'

import Comments from "@/Components/comments";
import FormComments from "@/Components/form-comments";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function BlogDetail({ params }: { params: { id: String } }) {

    const inputClass = 'w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black'


    type EachPostType = {
        title: string,
        content: string,
    }

    const [eachPost, setEachPost] = useState<EachPostType>()

    const [editingData, setEditingData] = useState({
            title: eachPost?.title,
            content: eachPost?.content
        })

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:5173/blogPost/${params.id}`)
            setEachPost(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        e.preventDefault();;
        const { name, value } = e.target;
        
        setEditingData({...editingData, [name]: value})
    }


    const getToken = () => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; token=`)
        if (parts.length === 2) return parts.pop()?.split(';').shift()
    }
    const token = getToken()
    const router = useRouter()

    const handleEdit = async (e: FormEvent) => {
        e.preventDefault();
        console.log(params.id);
        
        try {
            const response = await axios.put(`http://localhost:5173/editBlogPost/${params.id}`, editingData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }, withCredentials: true
            });
            router.push('/myBlogs')
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5173/blogPost/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/myBlogs')
        } catch (error) {
            console.log(error);
        }
    }

    const [editing, setEditing] = useState(false)
    const [sure, setSure] = useState(false)

    useEffect(() => {
        fetchPost()
    }, [])

    useEffect(() => {
        if (eachPost) {
            setEditingData(
                {
                    title: eachPost.title,
                    content: eachPost.content
                }
            )
        }
        else setEditingData({title: '', content:''})
    }, [eachPost])


    return (
        <>
            <div className=" mx-auto y-8 p-20">
                <div className="w-md bg-white p-4 rounded-md shadow-md text-black break-words">
                    <h1 className="text-3xl font-bold mb-4">{eachPost?.title.toLocaleUpperCase()}</h1>
                    <p>{eachPost?.content}</p>
                </div>
                <button className="m-5 bg-blue-500 hover:bg-blur-600 text-white font-bold py-2 px-4 rounded-md fovus:outline-none focus:ring focus:border-blue-300 w-md disabled:bg-gray-400" onClick={() => setEditing(!editing)}>Edit</button>
                <button className="m-5 bg-blue-500 hover:bg-blur-600 text-white font-bold py-2 px-4 rounded-md fovus:outline-none focus:ring focus:border-blue-300 w-md disabled:bg-gray-400" onClick={() => setSure(!sure)}>Delete</button>
                <div className="block">
                    {
                        sure && <div className="w-64 bg-white p-10 mx-auto rounded-md shadow-md text-black">
                            <div>Are you sure to delete it?</div>
                            <div>
                                <button className="m-4 bg-blue-500 hover:bg-blur-600 text-white font-bold py-2 px-3 rounded-md fovus:outline-none focus:ring focus:border-blue-300 w-md disabled:bg-gray-400" onClick={handleDelete}>Yes</button>
                                <button className="m-4 bg-blue-500 hover:bg-blur-600 text-white font-bold py-2 px-3 rounded-md fovus:outline-none focus:ring focus:border-blue-300 w-md disabled:bg-gray-400" onClick={() => setSure(false)}>No</button>
                            </div>
                        </div>
                    }
                    {editing && eachPost &&
                        <>
                            <form className="max-w-md mx-auto p-4" onSubmit={handleEdit}>
                                <div className="mb-4">
                                    <input type="text" className={inputClass} placeholder="Enter the title" name="title" value={editingData?.title} onChange={handleChange} />
                                </div>
                                <div className="mb-4">
                                    <textarea className={inputClass} placeholder="Enter the content" name="content" value={editingData?.content} onChange={handleChange} />
                                </div>
                                <button type="submit" className="bg-blue-500 hover:bg-blur-600 text-white font-bold py-2 px-4 rounded-md fovus:outline-none focus:ring focus:border-blue-300 w-full disabled:bg-gray-400">Submit</button>
                            </form>
                        </>
                    }

                </div>
            </div>
            {/* <Comments /> */}
        </>
    )
}