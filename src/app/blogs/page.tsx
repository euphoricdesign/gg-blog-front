"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Bell, LogIn, Search, Send } from "lucide-react";
import logo from "../../assets/logo.png";
import Link from "next/link";
import axios, { AxiosResponse } from "axios";
import { io } from "socket.io-client";
import { Notification, Post } from "@/types/types";
import { useAuth } from "@/contexts/AppContext";

const socket = io("http://localhost:4000", { withCredentials: true });

export default function PostsPage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [posts, setPosts] = useState([]);

  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/post");
        console.log(response.data);
        setPosts(response.data.posts.reverse());
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPosts();
  }, []);

  // Escuchar nuevos posts a través de socket.io
  useEffect(() => {
    socket.on("new_post", (post) => {
      console.log("Nuevo post recibido:", post);
      if (post) {
        const newNotification = { id: post.id, message: `New post: ${post.title}` };
        setNotifications((prevNotifications) => {
          const updatedNotifications = [...prevNotifications, newNotification];
          localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
          return updatedNotifications;
        });
      }
    });
  
    return () => {
      socket.off("new_post");
    };
  }, []);

  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id),
    );
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-[124px]">
      <header className="flex justify-between items-center py-4">
        <Link href="/">
          <Image className="w-[300px]" src={logo} alt="Gossip Girl Logo" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search gossip..."
              className="bg-white bg-opacity-20 rounded-full py-2 px-4 text-white placeholder-gray-300 focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 text-white" size={20} />
          </div>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white relative"
              >
                <Bell size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {notifications && notifications.length}
                </span>
              </button>
              <button
                onClick={logout}
                className="text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              // onClick={() => setisAuthenticated(true)}
              className="text-white flex items-center gap-2"
            >
              <LogIn size={24} />
              Login
            </button>
          )}
        </div>
      </header>

      {showNotifications && (
        <div className="absolute right-[124px] top-20 bg-white text-black rounded-lg shadow-lg p-4 w-64">
          <h3 className="font-bold mb-2">Notifications</h3>
          {notifications.length > 0 && (
            <ul>
              {notifications.reverse().map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-center justify-between"
                >
                  {notification.message}
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-pink-500">Latest Gossip</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-[100%] h-[16rem] object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-pink-400">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-300">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isAuthenticated && (
        <div className="fixed bottom-8 right-8">
          <button className="bg-pink-500 text-white rounded-full p-4 shadow-lg hover:bg-pink-600 transition-colors">
            <Send size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
