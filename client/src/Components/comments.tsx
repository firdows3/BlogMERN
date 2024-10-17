'use client'
import axios from "axios"
import { useEffect, useState } from "react";

export default function Comments({ postId }: { postId: String }) {

    type CommentType = {
        id: String,
        postId: String,
        comment: String,
        username: String
    }

    const [comments, setComments] = useState<CommentType[]>([])
    const reversedComment = [...comments].reverse()

    const fetchComment = async () => {
        try {
            const response = await axios.get(`http://localhost:5173/comments/${postId}`)
            setComments(response.data)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchComment()
    }, [])

    return (
        <div className="mt-8 mx-auto pl-20 pr-20 h-40 overflow-auto">
            <h2 className="text-2xl font-bold">Comments</h2>
            <ul>
                {
                    reversedComment?.map((comment, index) => {
                        return (
                            <li key={index} className="mb-1">
                                <div className="flex items-center mb-2">
                                    <div className="text-blue-500 mr-2">{comment?.username}</div>
                                    <p className="text-black">{comment?.comment}</p>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}