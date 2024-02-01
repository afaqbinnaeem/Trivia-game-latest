"use client";
import React, { useState } from "react";
import profile from "@/assets/images/user.png";
import elipse from "@/assets/images/Ellipse 51.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
// @ts-ignore
import CryptoJS from 'crypto-js';

const SignUpOne = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | undefined>();
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!email) {
      setError("Please provide your email address.");
      return;
    }
    if (!checkboxChecked) {
      setError("Please check the privacy policy to continue.");
      return;
    }
    router.push(`/nickname?email=${email || ""}`);
    setEmail("");
  };
  return (
    <div>
      <div className="main-bg h-screen">
        <div className="quizBandner">
          {/* <div className="mainGameHeading">
          <h1 className='gameHeading'>The Pizza King</h1>
          <h2 className='gameHeadingTwo'>A prize wining quiz game</h2>
        </div> */}
        </div>
        <div className="quizCenter welPadding">
          <h1 className="welcomeHeading mb-0 HindBold">Welcome</h1>
          <h4 className="ss-heading mb-0 pt-2">Before we start,</h4>
          <h4 className="ss-heading mb-0">lets set up your user</h4>
        </div>
        <div className=" px37">
          <input
            type="email"
            className="form-control quizInput w-full"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Your Email here"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="quizAgreeCheckBox flex items-center justify-center">
            <input
              type="checkbox"
              id="myCheckbox"
              className="custom-checkbox"
              onChange={(e) => {
                setCheckboxChecked(e.target.checked);
                setError(null); // Clear the error when the checkbox state changes
              }}
            />

            <p className="agreePolicy mb-0 ps-2">I agree with privacy policy</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="sbButton flex justify-center mt-5">
            <button
              onClick={(e) => handleEmail(e)}
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
            </button>
          </div>
          <div className="quizAgreeCheckBox flex items-center justify-center">
            <p className="agreePolicy ps-2 mb40">
              You already have an account?{" "}
              <span
                className="signInLink HindiBold cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Sign in{" "}
              </span>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpOne;
