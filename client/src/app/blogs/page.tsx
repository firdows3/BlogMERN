'use client'

import FormPost from "@/Components/form-post";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export default function Blogs() {

  type Post = {
    id: String,
    content: String,
    title: String,
    username: String
  }

  type MyPost = {
    id: String,
  }

  const inputClass = 'w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'

  const [posts, setPosts] = useState<Post[]>([])
  const [myPost, setMyPost] = useState<MyPost[]>([])
  const postsReversed = posts && [...posts].reverse()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedBlogs, setSearchedBlogs] = useState<Post[]>([])

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
      console.log(response.data);
      setMyPost(response.data.myBlogs)
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchQuery(e.target.value)
  }

  const filteredSearchBlogs = postsReversed?.filter(post => {
    return post?.title.toLowerCase().includes(searchQuery.toLowerCase())
  })
  useEffect(() => {
    setSearchedBlogs(filteredSearchBlogs)
  }, [searchQuery])

  useEffect(() => {
    fetchPosts()
    fetchMyPost()
  }, [])

  return (
    <div className="max-w-4xl mx-auto y-8">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>
      <div className="mb-4">
        <input type="text" className={inputClass} placeholder="Search" name="search" value={searchQuery} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {searchQuery ?
          searchedBlogs?.map((post, index) => {

            const isMyBlog = myPost?.some(mypost => mypost.id === post.id)

            return (
              <Link key={index} href={isMyBlog ? `/myBlogs/${post?.id}` : `/blogs/${post?.id}`} className="bg-white p-4 rounded-md shadow-md text-black break-words">
                <div className="overflow-auto max-h-32 h-32" style={{ scrollbarWidth: 'none' }}>
                  <h1 className="text-3xl font-bold mb-4">{post?.title.toLocaleUpperCase()}</h1>
                  <p>{post?.content}</p>
                </div>
                <h6 className="text-gray-500 text-right mt-4">written by: {post?.username}</h6>
              </Link>
            )
          }) :
          postsReversed?.map((post, index) => {

            const isMyBlog = myPost?.some(mypost => mypost.id === post.id)

            return (
              <Link key={index} href={isMyBlog ? `/myBlogs/${post?.id}` : `/blogs/${post?.id}`} className="bg-white p-4 rounded-md shadow-md text-black break-words">
                <div className="overflow-auto max-h-32 h-32" style={{ scrollbarWidth: 'none' }}>
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
