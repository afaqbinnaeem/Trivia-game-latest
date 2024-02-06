"use client";
import React, { useEffect, useState } from "react";
import avatar from "../assets/images/avatar-1.png";
import av2 from "@/assets/images/av2.png";
import av3 from "@/assets/images/av3.png";
import av4 from "@/assets/images/av4.png";
import av5 from "@/assets/images/av5.png";
import { toast } from "react-toastify";
import Image from "next/image";
import Cookies from "js-cookie";
import { StoreTournmentDataService } from "@/appwrite/appwriteService";


export default function Home() {

  const [activeTab, setActiveTab] = useState("tab1");
  const [selectedAvatar, setSelectedAvatar] = useState(av5);
  const [showModel, setShowModel] = useState(false);
  const [QuizPlayedCheckData, setQuizPlayedCheckData] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const userId = Cookies.get("userId")
    console.log(userId, "userid");

    if (userId) {
      const checkPlayedQuizData = async () => {
        try {
          const storeService = new StoreTournmentDataService();
          const response = await storeService.getAllUsersById(userId);
          console.log(response, "response: ")
          if (response !== undefined) {
            setQuizPlayedCheckData(response);
          } else {
            console.error('Response is undefined.');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }

      }
      checkPlayedQuizData()
    }

  }, [])

  const handleAvatarSelection = (avatarSrc: string) => {
    // @ts-ignore

    setSelectedAvatar(avatarSrc);
  };

  const tabStyle = (tabName: string) => ({
    borderBottom: activeTab === tabName ? "2px solid #DC432B" : "",
    color: activeTab === tabName ? "#DC432B" : "",
    cursor: "pointer",
    padding: "10px",
  });
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //     try {
    //       // Call authService signup method
    //       await authService.signup(userDetails.email, userDetails.name);

    //       toast.success('User Register successfully!');
    //       navigate('/login');
    //     } catch (error) {
    //       console.error('signup failed:', error);
    //     }
    //   };
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="main-bg h-screen">
        <div className="nvHeading">
          <h1 className="loginHeading">
            <div>Hey</div>
            Alex 1992#
          </h1>
        </div>
        <div className="mt-3 px-3">
          <div className="flex justify-between">
            <button
              className="tabOne"
              style={tabStyle("tab1")}
              onClick={() => setActiveTab("tab1")}
            >
              info
            </button>
            <button
              className="tabOne"
              style={tabStyle("tab2")}
              onClick={() => setActiveTab("tab2")}
            >
              History
            </button>
          </div>

          {activeTab === "tab1" && (
            <div>
              <div className="container mt-10">
                <form>
                  <div className="mb-3 ">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="form-label navLabel ps-3"
                    >
                      Email
                    </label>
                    <div>
                      <input
                        type="email"
                        className="form-control w-full navInput mt-3"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="alex1992#@gmail.com"
                        onChange={(e) => {
                          setUserDetails({
                            ...userDetails,
                            email: e.target.value,
                          });
                        }}
                      />

                    </div>

                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label navLabel ps-3"
                    >
                      Nickname
                    </label>
                    <input
                      type="name"
                      className="form-control  w-full navInput mt-3"
                      id="exampleInputPassword1"
                      placeholder="Alex 1992#"
                      onChange={(e) => {
                        setUserDetails({
                          ...userDetails,
                          name: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label navLabel ps-3"
                    >
                      Avatar
                    </label>
                    <br />
                    {selectedAvatar && (
                      <div className="m-auto mx-52 d-flex justify-content-center">
                        <Image
                          src={selectedAvatar}
                          onClick={() => setShowModel(true)}
                          alt="selectedAvatar"
                        />
                      </div>
                    )}
                  </div>
                  <div className="sbButton d-flex justify-content-center mt-5">
                    <button
                      type="submit"
                      className="loginButton"
                      // @ts-ignore

                      onClick={(e) => handleSignup(e)}
                    >
                      SAVE
                    </button>
                  </div>

                  {/* Modal */}
                  {/* Custom Tailwind CSS Modal */}
                  {showModel && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                          className="fixed inset-0 transition-opacity"
                          aria-hidden="true"
                        >
                          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span
                          className="hidden sm:inline-block sm:align-middle sm:h-screen"
                          aria-hidden="true"
                        >
                          &#8203;
                        </span>
                        <div
                          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="modal-headline"
                        >
                          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            {/* Your modal content */}
                            <div className="row g-2">
                              {[
                                [av2, av3, av5],
                                [av4, av3, av2],
                                [av3, av5, av4],
                                [av2, av3, av4],
                                [av3, av4, av2],
                              ].map((row, rowIndex) => (
                                <div
                                  key={rowIndex}
                                  className="flex justify-between items-center"
                                >
                                  {row.map((avatar, index) => (
                                    <Image
                                      key={index}
                                      className="avImage"
                                      src={avatar}
                                      alt=""
                                      onClick={() => {
                                        // @ts-ignore

                                        handleAvatarSelection(avatar);
                                        setShowModel(false);
                                      }}
                                    />
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
          {activeTab === "tab2" &&


            (<div>
              <table className="min-w-full table-auto mt-5">
                <thead>
                  <tr>
                    <th className="px-2 text-start py-2 border-b-2  border-gray-200 bg-transparent" style={{ color: '#828282' }}>Quiz name</th>
                    <th className="px-2 text-start  py-2 border-b-2  border-gray-200 bg-transparent" style={{ color: '#828282' }}>Pos</th>
                    <th className="px-2 text-start  py-2 border-b-2  border-gray-200 bg-transparent" style={{ color: '#828282' }}>Score</th>

                  </tr>
                </thead>
                <tbody>
                  {QuizPlayedCheckData?.map((quizData) => (
                    <tr key={quizData.$id}>
                      <td className="px-2 border-b-2 py-4 border-gray-200 hh-td">{quizData.quizName}</td>
                      <td className="px-2 py-4 border-b-2 border-gray-200 hh-td">{quizData.score}</td>
                      <td className="px-2 py-4 border-b-2 border-gray-200 hh-td">{quizData.score}</td>
                    </tr>
                  ))}

                </tbody>
              </table>




            </div>)}
        </div>
      </div>
    </div>
  );
}
