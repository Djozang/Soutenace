import { useAuth } from "../contexts/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-4">
                <TaskForm />
                <TaskList />
            </main>
        </div>
    );
}
