'use client'

import FormPost from "@/Components/form-post";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {

  type Post = {
    id: String,
    content: String,
    title: String,
    username: String
  }

  type MyPost = {
    id: String,
  }

  const [posts, setPosts] = useState<Post[]>([])
  const [myPost, setMyPost] = useState<MyPost[]>([])
  const postsReversed = posts && [...posts].reverse()

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5173/blogPost')
      setPosts(response.data?.allBlogs)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchMyPost = async () => {
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
      setMyPost(response.data.myBlogs)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchMyPost()
  }, [])

  return (
    <div className="max-w-4xl mx-auto y-8">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {postsReversed?.map((post, index) => {

          const isMyBlog = myPost?.some(mypost => mypost.id === post.id)

          return (
            <Link key={index} href={isMyBlog ? `/myBlogs/${post?.id}` : `/blogs/${post?.id}`} className="bg-white p-4 rounded-md shadow-md text-black break-words">
              <div className="overflow-auto max-h-32 h-32" style={{scrollbarWidth: 'none'}}>
                <h1 className="text-3xl font-bold mb-4">{post?.title.toLocaleUpperCase()}</h1>
                <p>{post?.content}</p>
              </div>
              <h6 className="text-gray-500 text-right mt-4">written by: {post?.username}</h6>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
