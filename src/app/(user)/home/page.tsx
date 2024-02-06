"use client";
import React, { useEffect, useState } from "react";
import Trophy from "@/assets/images/Trophy.png";
import starImg from "@/assets/images/starImg.png";
import bulb from "@/assets/images/bulb.png";
import { StoreTournmentDataService } from "@/appwrite/appwriteService";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Quiz {
  $id: string;
  startDate: string;
  quizImageURL: string;
  quizName: string;
}

const Home: React.FC = () => {
  const router = useRouter();
  const [alltournments, setAllTournments] = useState<any[]>();
  const [liveTournment, setLiveTournment] = useState<any[]>();
  const [liveTournmentId, setLiveTournmentId] = useState<string>();
  const [quizes, setQuizes] = useState<any[]>([]);
  const [QuizPlayedCheckData, setQuizPlayedCheckData] = useState<any[]>([]);
  const [checkTodayQuizData, setcheckTodayQuizData] = useState<any[]>([]);
  const [PreviousQuizData, setPreviousQuizData] = useState<any[]>([]);
  const [checkIncommingQuizData, setcheckIncommingQuizData] = useState<any[]>([]);
  const [checkPlayedQuizData, setcheckPlayedQuizData] = useState<any[]>([]);
  const [remainingTime, setRemainingTime] = useState([]);




  // const [quizes, setQuizes] = useState<Quiz[]>([] as Quiz[]);

  useEffect(() => {
    const userId = Cookies.get("userId")
    if (userId) {
      const checkPlayedQuizData = async () => {
        try {
          const storeService = new StoreTournmentDataService();
          const response = await storeService.getAllUsersById(userId);
          if (response !== undefined) {
            setQuizPlayedCheckData(response);
          } else {
            console.error("Response is undefined.");
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      checkPlayedQuizData();
    }
  }, []);



  useEffect(() => {
    if (quizes && QuizPlayedCheckData) {
      const checkTodayQuizData = async () => {
        try {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().split('T')[0];

          const filteredQuizes = quizes.filter((quiz) => {
            const isStartDateMatch = quiz.startDate === formattedDate;
            const isQuizPlayed = QuizPlayedCheckData.some((playedQuiz) => playedQuiz.quizId === quiz.$id);
            return isStartDateMatch && !isQuizPlayed;
          });

          setcheckTodayQuizData(filteredQuizes);
          console.log(filteredQuizes, "setCheckTodayQuizData");
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      checkTodayQuizData();
    }
  }, [quizes, QuizPlayedCheckData]);


  useEffect(() => {

    if (quizes) {
      const checkPreviousQuizData = async () => {
        try {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().split('T')[0];
          const filteredQuizes = quizes.filter((quiz) => {
            return quiz.endDate < formattedDate;
          });
          setPreviousQuizData(filteredQuizes);


        } catch (error) {
          console.error('Error fetching users:', error);
        }

      }
      checkPreviousQuizData()
    }

  }, [quizes])

  useEffect(() => {
    if (quizes) {
      const checkIncomingQuizData = async () => {
        try {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString();

          const filteredQuizes = quizes.filter((quiz) => {
            const quizStartDate = new Date(quiz.startDate);
            // @ts-ignore
            const timeRemaining = quizStartDate - currentDate;

            // Calculate remaining time in hours
            const hoursRemaining = timeRemaining / (1000 * 60 * 60);

            // If remaining time is greater than 24 hours, set daysRemaining
            if (hoursRemaining > 24) {
              const daysRemaining = Math.floor(hoursRemaining / 24);
              quiz.daysRemaining = daysRemaining;
            }

            return quizStartDate > currentDate;
          });

          setcheckIncommingQuizData(filteredQuizes);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      checkIncomingQuizData();
    }
  }, [quizes]);


  useEffect(() => {
    if (quizes) {
      const checkPlayedQuizData = async () => {
        try {

          const filteredQuizes = quizes.filter((quiz) => {
            return QuizPlayedCheckData.some((playedQuiz) => playedQuiz.quizId === quiz.$id);
          });
          setcheckPlayedQuizData(filteredQuizes);
          console.log(filteredQuizes, "setcheckPlayedQuizData", QuizPlayedCheckData);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      checkPlayedQuizData();
    }
  }, [quizes, QuizPlayedCheckData]);



  useEffect(() => {
    if (typeof window !== "undefined") {
      const getAllTournments = async () => {
        const storeService = new StoreTournmentDataService();
        try {
          const tournments = await storeService.getAllTournaments();
          console.log(tournments);
          setAllTournments(tournments);

          const currentDate = new Date();
          const filteredTournaments = tournments?.filter((tournament) => {
            const startDate = new Date(tournament.startDate);
            const endDate = new Date(tournament.endDate);

            const isLive = currentDate >= startDate && currentDate <= endDate;
            return isLive;
          });

          setLiveTournment(filteredTournaments);

          if (filteredTournaments && filteredTournaments.length > 0) {
            setLiveTournmentId(filteredTournaments[0].$id);
            fetchQuizzesByTournamentId(filteredTournaments[0].$id);
          }
        } catch (error) {
          console.log(
            "Error in getting all tournament api from home file:",
            error
          );
        }
      };
      getAllTournments();
    }
  }, []);

  const fetchQuizzesByTournamentId = async (tournamentId: string) => {
    try {
      const storeService = new StoreTournmentDataService();
      const quizzes = await storeService.getAllquizById(tournamentId);
      console.log(quizzes?.documents);
      if (quizzes?.documents) {
        setQuizes(quizzes?.documents || []);
      }
    } catch (error) {
      console.log("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    const updateRemainingTime = () => {
      if (!checkIncommingQuizData || checkIncommingQuizData.length === 0) {
        return;
      }
  
      const updatedRemainingTimes = checkIncommingQuizData.map((quiz) => {
        const startDateObj = new Date(quiz.startDate);
        const currentDate = new Date();
        let remainingTime = null;
           //@ts-ignore
           const timeDifference = startDateObj - currentDate;
           const remainingHours = Math.floor(timeDifference / (1000 * 60 * 60));
           const remainingMinutes = Math.floor(timeDifference  / (1000 * 60));
           const remainingSeconds = Math.floor(timeDifference / 1000);
           if (remainingHours >= 24) {
             const remainingDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
             remainingTime = `${remainingDays} days`;
           } else {
            const formattedHours = String(Math.floor(Math.abs(remainingHours))).slice(-2).padStart(2, '0');
            const formattedMinutes = String(Math.floor(Math.abs(remainingMinutes))).slice(-2).padStart(2, '0');
            const formattedSeconds = String(Math.floor(Math.abs(remainingSeconds))).slice(-2).padStart(2, '0');
            remainingTime = `${formattedHours.replace("-", "")} : ${formattedMinutes.replace("-", "")} : ${formattedSeconds.replace("-", "")}`; 
           }
  
        return remainingTime;
      });
  //@ts-ignore
      setRemainingTime(updatedRemainingTimes);
    };
  
    const intervalId = setInterval(updateRemainingTime, 1000);
  
    return () => clearInterval(intervalId);
  }, [checkTodayQuizData]);
  


  return (
    <>
      <div className="bgPink">
        <div className="homeWelcome h-screen overflow-scroll">
          <h1 className="welHeading">welcome to trivialand</h1>
          <div className="trphy flex items-center justify-between mt-4">
            <div className="flex">
              <Image className="trophyImage" src={Trophy} alt="" />
              {liveTournment && liveTournment.length > 0 ? (
                <h3 className="ps-2 mb-0 livetournment">
                  {liveTournment[0].title}
                </h3>
              ) : (
                <p>No live tournaments currently.</p>
              )}
            </div>
            <div className="live ">
              <p className="livetext mb-0  flex items-center px-2">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                >
                  <circle cx="4" cy="4" r="4" fill="white" />
                </svg>{" "}
                <span className="text-white font-bold ps-1">LIVE</span>
              </p>
            </div>
          </div>

          <div className="mt-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="393"
              height="2"
              viewBox="0 0 393 2"
              fill="none"
              className="w-full"
            >
              <path
                d="M0 1L395 0.999965"
                stroke="#DB3512"
                strokeDasharray="10 10"
              />
            </svg>
          </div>
          <div className="quizList mt-3">
            {checkTodayQuizData.map((quiz) => {

              const divStyle = {
                backgroundImage: `url('${quiz.quizImageURL}')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                height: "315px",
                borderRadius: "25px",
                backgroundPosition: "center center",
                position: "relative",
              };

              return (
                <>
                  <Link
                    key={quiz.$id}
                    href={`/quizmultiprize/${quiz.$id}?id=${quiz.$id
                      }&Quiz=${quiz.quizName.replace(/\s+/g, "-")}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      key={quiz.$id}
                      // @ts-ignore
                      style={divStyle}
                      className="hhQuizOne mt-3"
                    >
                      <div
                        className="absolute top-0 right-0 bottom-0 left-0 opacity-70 rounded-lg"
                        style={{
                          zIndex: 1,
                          borderRadius: "25px",
                          backgroundColor: quiz?.colorSelect || "#6D10CA",
                        }}
                      ></div>
                      <div className="relative" style={{ zIndex: 2 }}>
                        <div className="openNowDiv flex px-1 justify-around">
                          <div className="flex items-center p-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="18"
                              viewBox="0 0 15 18"
                              fill="none"
                            >
                              <path
                                d="M14 7.26795C15.3333 8.03775 15.3333 9.96225 14 10.7321L3.5 16.7942C2.16667 17.564 0.500001 16.6018 0.500001 15.0622L0.500002 2.93782C0.500002 1.39822 2.16667 0.435971 3.5 1.20577L14 7.26795Z"
                                fill="#21E374"
                              />
                            </svg>
                            <span className="opennow ps-2">Open Now</span>
                          </div>

                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                            >
                              <path
                                d="M16.4211 7.18418C16.4211 9.45146 14.5831 11.2894 12.3158 11.2894C10.0485 11.2894 8.21054 9.45146 8.21054 7.18418C8.21054 4.91691 10.0485 3.07892 12.3158 3.07892C14.5831 3.07892 16.4211 4.91691 16.4211 7.18418Z"
                                stroke="white"
                                strokeWidth="2.05263"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.3158 14.3684C8.34807 14.3684 5.13159 17.5849 5.13159 21.5526H19.5C19.5 17.5849 16.2835 14.3684 12.3158 14.3684Z"
                                stroke="white"
                                strokeWidth="2.05263"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="players">961 players</span>
                          </div>
                        </div>
                        <h1 className="hhquizHeading mt-5 pt-3">
                          {quiz.quizName}
                        </h1>
                        <div className="quizFooter mt-5 flex items-center justify-around pt-12">
                          <Image src={starImg} alt="" />
                          <button className="joinGamebtn">
                            JOIN THE GAME
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              );
            })}
            {checkIncommingQuizData.map((quiz, index) => {
      
              const divStyle = {
                backgroundImage: `url('${quiz.quizImageURL}')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                height: "315px",
                borderRadius: "25px",
                backgroundPosition: "center center",
                position: "relative",
              };

              return (
                <>
                  <div
                    key={quiz.$id}
                    // @ts-ignore
                    style={divStyle}
                    className="hhQuizOne mt-3"
                  >
                    <div
                      className="absolute top-0 right-0 bottom-0 left-0 opacity-70 rounded-lg"
                      style={{
                        zIndex: 1,
                        borderRadius: "25px",
                        backgroundColor: quiz?.colorSelect || "#6D10CA",
                      }}
                    ></div>
                    <div className="relative" style={{ zIndex: 2 }}>
                      <div className="openNowDiv flex px-1 justify-around">
                        <div className="flex items-center p-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="18"
                            viewBox="0 0 15 18"
                            fill="none"
                          >
                            <path
                              d="M14 7.26795C15.3333 8.03775 15.3333 9.96225 14 10.7321L3.5 16.7942C2.16667 17.564 0.500001 16.6018 0.500001 15.0622L0.500002 2.93782C0.500002 1.39822 2.16667 0.435971 3.5 1.20577L14 7.26795Z"
                              fill="#21E374"
                            />
                          </svg>
                          <span className="opennow ps-2">Start In</span>
                        </div>

                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                          >
                            <path
                              d="M16.4211 7.18418C16.4211 9.45146 14.5831 11.2894 12.3158 11.2894C10.0485 11.2894 8.21054 9.45146 8.21054 7.18418C8.21054 4.91691 10.0485 3.07892 12.3158 3.07892C14.5831 3.07892 16.4211 4.91691 16.4211 7.18418Z"
                              stroke="white"
                              strokeWidth="2.05263"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.3158 14.3684C8.34807 14.3684 5.13159 17.5849 5.13159 21.5526H19.5C19.5 17.5849 16.2835 14.3684 12.3158 14.3684Z"
                              stroke="white"
                              strokeWidth="2.05263"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="players"> {remainingTime[index]}</span>
                        </div>
                      </div>
                      <h1 className="hhquizHeading mt-5 pt-3">
                        {quiz.quizName}
                      </h1>
                      <div className="quizFooter mt-5 flex items-center justify-around pt-12">
                        <Image src={starImg} alt="" />
                        <button className="joinGamebtn">
                          JOIN THE GAME
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            {checkPlayedQuizData.map((quiz) => {
              const divStyle = {
                backgroundImage: `url('${quiz.quizImageURL}')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                height: "315px",
                borderRadius: "25px",
                backgroundPosition: "center center",
                position: "relative",
              };

              return (
                <>
                  <div
                    key={quiz.$id}
                    // @ts-ignore
                    style={divStyle}
                    className="hhQuizOne mt-3"
                  >
                    <div
                      className="absolute top-0 right-0 bottom-0 left-0 opacity-70 rounded-lg"
                      style={{
                        zIndex: 1,
                        borderRadius: "25px",
                        backgroundColor: quiz?.colorSelect || "#6D10CA",
                      }}
                    ></div>
                    <div className="relative" style={{ zIndex: 2 }}>
                      <div className="openNowDiv flex px-1 justify-around">
                        <div className="flex items-center p-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="18"
                            viewBox="0 0 15 18"
                            fill="none"
                          >
                            <path
                              d="M14 7.26795C15.3333 8.03775 15.3333 9.96225 14 10.7321L3.5 16.7942C2.16667 17.564 0.500001 16.6018 0.500001 15.0622L0.500002 2.93782C0.500002 1.39822 2.16667 0.435971 3.5 1.20577L14 7.26795Z"
                              fill="#21E374"
                            />
                          </svg>
                          <span className="opennow ps-2">Closed</span>
                        </div>

                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                          >
                            <path
                              d="M16.4211 7.18418C16.4211 9.45146 14.5831 11.2894 12.3158 11.2894C10.0485 11.2894 8.21054 9.45146 8.21054 7.18418C8.21054 4.91691 10.0485 3.07892 12.3158 3.07892C14.5831 3.07892 16.4211 4.91691 16.4211 7.18418Z"
                              stroke="white"
                              strokeWidth="2.05263"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.3158 14.3684C8.34807 14.3684 5.13159 17.5849 5.13159 21.5526H19.5C19.5 17.5849 16.2835 14.3684 12.3158 14.3684Z"
                              stroke="white"
                              strokeWidth="2.05263"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="players">961 players</span>
                        </div>
                      </div>
                      <h1 className="hhquizHeading mt-5 pt-3">
                        {quiz.quizName}
                      </h1>
                      <div className="quizFooter mt-5 flex items-center justify-around pt-12">
                        <Image src={starImg} alt="" />
                        <button className="joinGamebtn">
                          You Played it
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>

          <div className="flex items-center my-4 pb-7">
            <Image src={bulb} className="bulb" alt="" />
            <p className="forthebrain mb-0 ps-2">For the brain</p>
          </div>
          <div>
            <svg
              className="w-full"
              xmlns="http://www.w3.org/2000/svg"
              width="393"
              height="2"
              viewBox="0 0 393 2"
              fill="none"
            >
              <path
                d="M0 1L395 0.999965"
                stroke="#DB3512"
                strokeDasharray="10 10"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
