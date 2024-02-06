"use client";
import React, { useEffect, useState } from "react";
import profile from "@/assets/images/user.png";
import elipse from "@/assets/images/Ellipse 51.png";
import Image from "next/image";
import authService from "@/appwrite/authAppwriteService";
import { useRouter } from "next/navigation";

const Nickname = () => {
  const router = useRouter();
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleNickName = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (nickName.length > 12) {
      setError("* 12 characters max");
      return;
    }

    // Rest of your code for creating an account

    const password = email + "newUser123";
    const response = await authService.createAccount(email, password, nickName);
    console.log(response);

    if (response) {
      router.push("/login");
    }
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/[?&]email=([^&]*)/);
    const emailValue = match ? match[1] : "";
    console.log(emailValue);
    setEmail(emailValue);
  }, []);

  return (
    <div>
      <div className="main-bg h-screen">
        <div className="quizBannerNickname"></div>
        <div className="quizCenter">
          <h1 className="welcomeHeading mb-0 HindBold w265">
            Choose your player nickname
          </h1>
          <h4 className="ss-heading mb-0 pt-2">Here you can be</h4>
          <h4 className="ss-heading mb-0">whatever you want to be</h4>
        </div>
        <div className=" px37">
          <input
            type="text"
            className="form-control quizInput w-full"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Your Nickname here"
            onChange={(e) => {
              setNickName(e.target.value);
              setError("");
            }}
          />
          {error && <p className="text-red-700 font-semibold text-center">{error}</p>}

          <div className="sbButton d-flex justify-content-center mt-5">
            <button
              onClick={(e) => handleNickName(e)}
              className="loginButton flex items-center justify-center"
            >
              <span className="pe-3">Next</span>{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                >
                  <path
                    d="M11.3211 17.7359C11.3211 13.032 15.1344 9.21869 19.8384 9.21869"
                    stroke="white"
                    strokeWidth="2.63401"
                  />
                  <path
                    d="M11.4833 0.70144C11.4833 5.40539 15.2966 9.21869 20.0006 9.21869"
                    stroke="white"
                    strokeWidth="2.63401"
                  />
                  <path
                    d="M0.715576 9.21869H19.0357"
                    stroke="white"
                    strokeWidth="2.63401"
                  />
                </svg>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nickname;
