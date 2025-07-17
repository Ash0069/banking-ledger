'use client';

import { useState } from 'react';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const body = isLogin ? { email: formData.email, password: formData.password } : formData;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Banking Ledger</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-center text-black">{isLogin ? 'Login' : 'Register'}</h2>
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border rounded text-black"
              required
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded text-black"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border rounded text-black"
            required
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {isLogin ? 'Login' : 'Register'}
          </button>
          {message && <p className="text-center text-sm text-red-500">{message}</p>}
        </form>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage(null);
            setFormData({ name: '', email: '', password: '' });
          }}
          className="w-full mt-4 text-sm text-center underline text-gray-600 hover:text-gray-900"
        >
          {isLogin ? 'Need to create an account?' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
}