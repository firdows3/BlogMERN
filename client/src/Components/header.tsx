'use client'
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const getToken = () => {
        const value = `; ${document.cookie}`;
        const parts = value.split('; token=')
        if (parts.length === 2) return parts.pop()?.split(';').shift()
    }
    const token = getToken();
    useEffect(() => {
        if (token)  setIsLoggedIn(true);
        else  setIsLoggedIn(false)
    }, [token])
    
    const router = useRouter()
    const logout = async() => {
        try {
            await axios.post('http://localhost:5173/logout')
            document.cookie = "token=; path=/;"
            router.push('/login')
        } catch (error) {
            console.log(error);
        }
    }

    const pathName = usePathname()
    return (
        <>
            <header className="bg-blue-500 p-4">
                <nav className="flex justify-between items-center nav-w-4xl mx-auto">
                    <Link href='/' className="text-white text-2xl font-bold">Blogs</Link>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href='/' className={pathName === '/' ? "underline text-white hover:underline" : "text-white hover:underline"}>Home</Link>
                        </li>
                        <li>
                            <Link href='/myBlogs' className={pathName === '/myBlogs' ? "underline text-white hover:underline" : "text-white hover:underline"}>My Blogs</Link>
                        </li>
                        {isLoggedIn ? <button onClick={logout}>logout</button> :
                            <li>
                                <Link href='/login' className={pathName === '/login' ? "underline text-white hover:underline" : "text-white hover:underline"}>Login</Link>
                            </li>}
                    </ul>
                </nav>
            </header>
        </>
    )
}