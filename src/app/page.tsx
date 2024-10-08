"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import logo from "../assets/logo.png";
import blair2 from "../assets/blair2.jpg";
import dan from "../assets/dan.jpg";
import nate from "../assets/nate.jpg";
import serena from "../assets/serena.jpg";
import { Bell, LogIn, Search, Send } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { io } from "socket.io-client";
import { Notification, Post } from "@/types/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AppContext";

const socket = io("http://localhost:4000", { withCredentials: true });

export default function Home() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [post, setPost] = useState<Post | null>(null);

  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      setNotifications([]);
    }
  }, []);

  const router = useRouter()

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get<{ posts: Post[] }>(
          "http://localhost:4000/post",
        );
        console.log(response.data);
        setPost(response.data.posts.at(-1) || null);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPost();
  }, []);

  useEffect(() => {
    socket.on("new_post", (post) => {
      console.log("Nuevo post recibido:", post);
      if (post) {
        const newNotification = { id: post.id, message: `New post: ${post.title}` };
        setNotifications((prevNotifications) => {
          const updatedNotifications = [newNotification,...prevNotifications];
          localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
          return updatedNotifications;
        });
      }
    });
  
    return () => {
      socket.off("new_post");
    };
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter((n) => n.id !== id);
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      return updatedNotifications;
    });
  }, []);

  return (
    <div className="contenedor inset-0 w-[100vw] h-[100vh] px-[124px] relative">
      <header className="flex justify-between items-center py-4">
        <Image className="w-[300px]" src={logo} alt="Gossip Girl Logo" />
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
              onClick={() => router.push("/login")}
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
              {notifications.map((notification) => (
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

      {post ? (
        <div className="flex justify-center gap-[30px] mt-8">
          <div>
            <h3 className="text-[30px] font-[400] text-blue-400">welcome</h3>
            <p className="text-sm w-[150px] mb-[5px] parrafos">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
              amet ea in veli!
            </p>

            <h3 className="text-[30px] font-[400] text-[#e9857a]">gossip</h3>
            <p className="text-sm w-[150px] mb-[5px] parrafos">
              Lorem ipsum dolor sit amet, consectetur.
            </p>

            <h3 className="text-[30px] font-[400] text-[#ffffb2]">pics</h3>
            <p className="text-sm w-[150px] mb-[5px] parrafos">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>

            <h3 className="text-[30px] font-[400] text-pink-400">parties</h3>
            <p className="text-sm w-[150px] mb-[5px] parrafos">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis.
            </p>

            <a href="" className="text-[30px] text-green-300">
              links
            </a>
          </div>

          <div
            className={`w-[300px] shadow-md bg-white rounded-[16px] text-black flex flex-col items-center gap-[10px] p-[14px] h-fit`}
          >
            <h5 className="font-[500] text-[18px]">{post.title}</h5>
            <div>
              <img className="w-[250px]" src={post.image} alt="queen b" />
            </div>
            <p className="w-[250px] parrafos">{post.content}</p>
            <div className="flex justify-end w-full">
              <span className="pr-4 text-sm text-[#4bd1d3] font-[400]">
                xo xo GOSSIP GIRL
              </span>
            </div>
          </div>

          <div>
            <div className="bg-personalizado rounded-[100%] text-sm text-center mb-4 w-[80px] h-[80px] flex flex-col items-center">
              <Link href="/">
                <Image
                  className="w-[50px] rounded-[100%] pt-[2px]"
                  src={nate}
                  alt=""
                />
                home
              </Link>
            </div>
            <div className="bg-personalizado rounded-[100%] text-sm text-center mb-4 w-[80px] h-[80px] flex flex-col items-center">
              <Link href="/blogs">
                <Image
                  className="w-[50px] rounded-[100%] pt-[2px]"
                  src={dan}
                  alt=""
                />
                posts
              </Link>
            </div>{" "}
            <div className="bg-personalizado rounded-[100%] text-sm text-center mb-4 w-[80px] h-[80px] flex flex-col items-center">
              <Image
                className="w-[50px] rounded-[100%] pt-[2px]"
                src={blair2}
                alt=""
              />
              pics
            </div>{" "}
            <div className="bg-personalizado rounded-[100%] text-sm text-center mb-4 w-[80px] h-[80px] flex flex-col items-center">
              <Image
                className="w-[50px] rounded-[100%] pt-[2px]"
                src={serena}
                alt=""
              />
              links
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-[150px]">
          <div className="loader flex justify-center items-center w-[100vw] h-[100vh]">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
            <div className="bar4"></div>
            <div className="bar5"></div>
            <div className="bar6"></div>
            <div className="bar7"></div>
            <div className="bar8"></div>
            <div className="bar9"></div>
            <div className="bar10"></div>
            <div className="bar11"></div>
            <div className="bar12"></div>
          </div>
        </div>
      )}

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
