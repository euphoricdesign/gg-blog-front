"use client";
import { useAuth } from "@/contexts/AppContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  const { login } = useAuth();

  const handleInputChange = ({target}) => {
    const {name, value} = target
    if (isLogin) {
        setLoginData({
            ...loginData,
            [name]: value
        })
    } else setRegisterData({
        ...registerData,
        [name]: value
    })
  }

  const onLogin = async (e: any) => {
    e.preventDefault()
    const response = await axios.post("http://localhost:4000/auth/login", loginData)
    const {user, token} = response.data
    login(user, token);
    setLoginData({
        email: '',
        password: ''
    })
    setSuccess(true)
    router.push("/")

  }

  const onRegister = async (e: any) => {
    e.preventDefault()
    await axios.post("http://localhost:4000/auth/register", registerData)
    setRegisterData({
        username: '',
        email: '',
        password: ''
      })

      setIsLogin(true)
  }

  return (
    <div className="flex h-screen contenedor">
      <div className="flex w-full justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl text-center text-slate-800 mb-6">
            {isLogin ? "Login" : "Register"}
          </h1>
          <form>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={registerData.username}
                  name="username"
                  placeholder="Your username"
                  className="text-slate-600 border-b-2 border-gray-300 focus:border-gold-500 w-full py-2 px-1"
                  required
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={isLogin ? loginData.email : registerData.email}
                placeholder="Your email"
                className="text-slate-800 border-b-2 border-gray-300 focus:border-gold-500 w-full py-2 px-1"
                required
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={isLogin ? loginData.password : registerData.password}
                placeholder="Your password"
                className="text-slate-600 border-b-2 border-gray-300 focus:border-gold-500 w-full py-2 px-1"
                required
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-gray-600">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="bg-black text-gold-500 hover:bg-gold-500 hover:text-white w-full py-2 rounded transition duration-200"
              onClick={isLogin ? onLogin : onRegister}
            >
              {isLogin ? "Login" : "Register"}
            </button>
            <p className="text-center text-gray-600 mt-4">
              {isLogin ? "Don't have an account?" : "¿Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-gold-500 hover:underline ml-1"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </form>
          <p className="text-center text-gray-500 mt-4">
            And who am I? That's a secret I'll never tell...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
