import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }
    
        setIsSubmitting(true);
    
        try {
            await register({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            navigate('/dashboard');
        } 
        catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Register for Todo App</h1>
        
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
        
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border rounded"
                            required
                        />
                    </div>
          
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded"
                            required
                        />
                    </div>
          
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded"
                            required
                            minLength="8"
                        />
                    </div>
          
                    <div className="mb-6">
                        <label htmlFor="passwordConfirmation" className="block text-gray-700 font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="passwordConfirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full p-3 border rounded"
                            required
                            minLength="8"
                        />
                    </div>
          
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-3 rounded font-medium hover:bg-indigo-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
        
                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};