export default function Comments() {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold">Comments</h2>
            <ul>
                <li className="mb-4 bg-slate-300 p-2">
                    <div className="flex items-center mb-2">
                        <div className="text-blue-500 font-bold mr-2">John doe</div>
                        <div className="text-gray-500">10-no</div>
                    </div>
                    <p>Awesome!</p>
                </li>
            </ul>
        </div>
    )
}