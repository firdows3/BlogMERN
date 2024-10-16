'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {

    const pathName = usePathname()

    return (
        <>
        <header className="bg-blue-500 p-4">
            <nav className="flex justify-between items-center nav-w-4xl mx-auto">
                <Link href='/' className="text-white text-2xl font-bold">Blogs</Link>
                <ul className="flex space-x-4">
                    <li>
                        <Link href='/blogs' className={pathName === '/blogs' ? "underline text-white hover:underline" : "text-white hover:underline"}>Blogs</Link>
                    </li>
                    <li>
                        <Link href='/myBlogs' className={pathName === '/myBlogs' ? "underline text-white hover:underline" : "text-white hover:underline"}>My Blogs</Link>
                    </li>
                    <li>
                        <Link href='/login' className={pathName === '/login' ? "underline text-white hover:underline" : "text-white hover:underline"}>Login</Link>
                    </li>
                </ul>
            </nav>
        </header>
        </>
    )
}