"use client";
import React, { useEffect, useState } from "react";
import profile from "@/assets/images/user.png";
import av3 from "@/assets/images/av3.png";
import starsImg from "@/assets/images/StarssImage.png";
import starImg from "@/assets/images/starImg.png";
import fun from "@/assets/images/fun.png";
import timeimg from "@/assets/images/timeImage.png";
import starss from "@/assets/images/starss.png";
import quesImage from "@/assets/images/quesImage.png";
import quesSpeaker from "@/assets/images/quesSpeacker.png";
import pizza from "@/assets/images/Pizza.png";
import positionImage from "@/assets/images/positionImage.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { StoreTournmentDataService } from "@/appwrite/appwriteService";

const LeaderBoard = () => {
  const [quiz, setQuiz] = useState();
  const param = useSearchParams();
  const id = param.get("quizId");
  console.log(id);

  const getDataOfQuizPlayedByUsers = async () => {
    const storeService = new StoreTournmentDataService();
    try {
      if (id) {
        const response = await storeService.getQuizsPlayedByUser(id);
        console.log(response);
      }
    } catch (error) {
      console.log("Error in getting QuizData played by user", error);
    }
  };

  const getQuizByQuizId = async () => {
    const storeService = new StoreTournmentDataService();
    try {
      if (id) {
        const response = await storeService.getQuizById(id);
        console.log(response);
        //@ts-ignore
        setQuiz(response);
      }
    } catch (error) {
      console.log("Error in getting Quiz", error);
    }
  };

  useEffect(() => {
    getDataOfQuizPlayedByUsers();
  }, []);

  useEffect(() => {
    getQuizByQuizId();
  }, []);

  //@ts-ignore
  const backgroundImage = quiz?.quizImageURL || 'no image found';

  return (
    <div>
      <div className="bgPurple">
        <div className="questionStatusbar flex justify-between items-center p-2">
          <div className="exit cp">
            <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="18"
                viewBox="0 0 21 18"
                fill="none"
              >
                <path
                  d="M9.12187 0.279633C9.12187 5.08012 5.11409 8.97168 0.170246 8.97168"
                  stroke="white"
                  stroke-width="2.41379"
                />
                <path
                  d="M8.95142 17.6637C8.95142 12.8632 4.94364 8.97168 -0.000209644 8.97168"
                  stroke="white"
                  stroke-width="2.41379"
                />
                <path
                  d="M20.276 8.97168L1.02155 8.97168"
                  stroke="white"
                  stroke-width="2.41379"
                />
              </svg>
              <p className="quesExit ps-2 mb-0">Exit</p>
            </div>
          </div>

          <div className=" flex">
            <div className="tt-days">
              <div className="flex">
                <div className="ss-days">
                  <p className="time-p mb-0">0</p>
                </div>
                <div className="ss-days">
                  <p className="time-p mb-0">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="quizBannerLeaderBoard"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            borderRadius: "0px 0px 25px 25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "300px",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        >
          <div className="p50">
            <h1 className="gameHeading">
              {
                //@ts-ignore
                quiz?.quizName
              }
            </h1>
            <h2 className="gameHeadingTwo">A prize wining quiz game</h2>
            <div className="leaderHeadingdiv flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6"
                height="6"
                viewBox="0 0 6 6"
                fill="none"
              >
                <circle cx="3" cy="3" r="3" fill="#5C0BAC" />
              </svg>
              <p className="leaderBoardHeading mb-0 px-2">
                Tournament Leaderboard
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6"
                height="6"
                viewBox="0 0 6 6"
                fill="none"
              >
                <circle cx="3" cy="3" r="3" fill="#5C0BAC" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <p className="leaderPlace text-center pt-10 py-4">
            You are in place 125
          </p>
        </div>
        <div className="px-2">
          <div className="tournamentPoisitiondiv bg-white mx-2 rounded-2xl">
            <div className="tournamentPoisition p-2">
              <div className="positionNumberImage flex items-center justify-between">
                <div className="flex items-center">
                  <p className="mb-0 px-2 pnNumber">1</p>
                  <div className="positionimgName flex items-center">
                    <Image className="rounded-3xl" src={positionImage} alt="" />
                    <p className="positionName mb-0 px-3">Alex Holland</p>
                  </div>
                </div>
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M7.63362 1.73169C8.19672 0.605927 9.80328 0.605927 10.3664 1.73169L11.904 4.80576C12.1264 5.25031 12.5511 5.5589 13.0426 5.63301L16.4414 6.14545C17.6861 6.33311 18.1825 7.86103 17.2859 8.74445L14.8374 11.1568C14.4833 11.5056 14.3211 12.0049 14.4025 12.4953L14.9654 15.8861C15.1716 17.1278 13.8718 18.0721 12.7546 17.4923L9.7037 15.9092C9.2625 15.6802 8.7375 15.6802 8.2963 15.9092L5.24543 17.4923C4.12817 18.0721 2.82844 17.1278 3.03458 15.8861L3.5975 12.4953C3.67891 12.0049 3.51667 11.5056 3.16259 11.1568L0.714134 8.74445C-0.182521 7.86103 0.313932 6.33311 1.5586 6.14545L4.95738 5.63301C5.44889 5.5589 5.87362 5.25031 6.09598 4.80576L7.63362 1.73169Z"
                      fill="#FCC025"
                    />
                  </svg>
                  <p className="pttNumber mb-0 px-2">76865</p>
                </div>
              </div>
            </div>
          </div>
          <div className="tournamentPoisitiondiv bg-white mx-2 rounded-2xl mt-2">
            <div className="tournamentPoisition p-2">
              <div className="positionNumberImage flex items-center justify-between">
                <div className="flex items-center">
                  <p className="mb-0 px-2 pnNumber">2</p>
                  <div className="positionimgName flex items-center">
                    <Image className="rounded-3xl" src={positionImage} alt="" />
                    <p className="positionName mb-0 px-3">David</p>
                  </div>
                </div>
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M7.63362 1.73169C8.19672 0.605927 9.80328 0.605927 10.3664 1.73169L11.904 4.80576C12.1264 5.25031 12.5511 5.5589 13.0426 5.63301L16.4414 6.14545C17.6861 6.33311 18.1825 7.86103 17.2859 8.74445L14.8374 11.1568C14.4833 11.5056 14.3211 12.0049 14.4025 12.4953L14.9654 15.8861C15.1716 17.1278 13.8718 18.0721 12.7546 17.4923L9.7037 15.9092C9.2625 15.6802 8.7375 15.6802 8.2963 15.9092L5.24543 17.4923C4.12817 18.0721 2.82844 17.1278 3.03458 15.8861L3.5975 12.4953C3.67891 12.0049 3.51667 11.5056 3.16259 11.1568L0.714134 8.74445C-0.182521 7.86103 0.313932 6.33311 1.5586 6.14545L4.95738 5.63301C5.44889 5.5589 5.87362 5.25031 6.09598 4.80576L7.63362 1.73169Z"
                      fill="#9E9E9E"
                    />
                  </svg>
                  <p className="pttNumber mb-0 px-2">76865</p>
                </div>
              </div>
            </div>
          </div>
          <div className="tournamentPoisitiondiv bg-white mx-2 rounded-2xl mt-2">
            <div className="tournamentPoisition p-2">
              <div className="positionNumberImage flex items-center justify-between">
                <div className="flex items-center">
                  <p className="mb-0 px-2 pnNumber">3</p>
                  <div className="positionimgName flex items-center">
                    <Image className="rounded-3xl" src={positionImage} alt="" />
                    <p className="positionName mb-0 px-3">John dear</p>
                  </div>
                </div>
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M7.63362 1.73169C8.19672 0.605927 9.80328 0.605927 10.3664 1.73169L11.904 4.80576C12.1264 5.25031 12.5511 5.5589 13.0426 5.63301L16.4414 6.14545C17.6861 6.33311 18.1825 7.86103 17.2859 8.74445L14.8374 11.1568C14.4833 11.5056 14.3211 12.0049 14.4025 12.4953L14.9654 15.8861C15.1716 17.1278 13.8718 18.0721 12.7546 17.4923L9.7037 15.9092C9.2625 15.6802 8.7375 15.6802 8.2963 15.9092L5.24543 17.4923C4.12817 18.0721 2.82844 17.1278 3.03458 15.8861L3.5975 12.4953C3.67891 12.0049 3.51667 11.5056 3.16259 11.1568L0.714134 8.74445C-0.182521 7.86103 0.313932 6.33311 1.5586 6.14545L4.95738 5.63301C5.44889 5.5589 5.87362 5.25031 6.09598 4.80576L7.63362 1.73169Z"
                      fill="#BF7E7E"
                    />
                  </svg>
                  <p className="pttNumber mb-0 px-2">76865</p>
                </div>
              </div>
            </div>
          </div>
          <div className="svgDivider py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="366"
              height="3"
              viewBox="0 0 366 3"
              fill="none"
            >
              <path
                d="M1 1L365 2"
                stroke="#FCC025"
                stroke-linecap="round"
                stroke-dasharray="10 10"
              />
            </svg>
          </div>

          <div className="tournamentPoisitiondiv bgPurple ppBorder mx-rounded-2xlrounded-4 mt-2">
            <div className="tournamentPoisition p-2">
              <div className="positionNumberImage flex items-center justify-between">
                <div className="flex items-center">
                  <p className="mb-0 ps-2 pe-3 pnNumberFinal text-white borderDashed lineHight49">
                    125
                  </p>
                  <div className="positionimgName flex items-center ps-4 borderDashed">
                    <Image className="rounded-3xl" src={positionImage} alt="" />
                    <p className="positionNameFinal mb-0 px-3 text-white">
                      John dear
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <p className="pnNumberFinal mb-0 px-2 text-white">76865</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 text-center finalNext">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="18"
            viewBox="0 0 17 18"
            fill="none"
          >
            <path
              d="M0.212695 9.84766C4.58092 9.84766 8.12207 13.3888 8.12207 17.757"
              stroke="white"
              stroke-width="1.74468"
            />
            <path
              d="M16.0314 10C11.6632 10 8.12207 13.5411 8.12207 17.9094"
              stroke="white"
              stroke-width="1.74468"
            />
            <path
              d="M8.12207 0L8.12207 17.0126"
              stroke="white"
              stroke-width="1.74468"
            />
          </svg>
          <p className="nextQuiz">Next Game</p>
        </div>
        <div className="relatedQuiz">
          <div className="hhQuizThree">
            <div className="statusBar flex justify-between items-center px-3">
              <div className="flex items-center">
                <Image className="pe-2 " src={profile} alt="" />
                <p className="stPlays mb-0">961 plays</p>
              </div>
              <div className="text-center">
                <Image className=" img-fluid w-50" src={fun} alt="" />
              </div>
            </div>

            <h1 className="hhquizHeading pt-0">Hola Mexicana</h1>
            <h4 className="hQuizHeadingTwo">1st wins Bella Air-fryer!</h4>
            <div className="quizFooter mt-4 flex items-center justify-around">
              <Image src={starImg} alt="" />

              <button className="joinGamebtn">let’s play!</button>
            </div>
          </div>
        </div>
        <div className="exit cp py-3">
          <div className="flex justify-center items-center">
            <p className="quesAllGame pe-2 mb-0">To all games</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
            >
              <path
                d="M8.18768 13.4035C8.18768 9.88311 11.1267 7.0293 14.7522 7.0293"
                stroke="#EFEFEF"
                stroke-width="1.77012"
              />
              <path
                d="M8.3125 0.655129C8.3125 4.17548 11.2515 7.0293 14.877 7.0293"
                stroke="#EFEFEF"
                stroke-width="1.77012"
              />
              <path
                d="M0.0078125 7.0293H14.1277"
                stroke="#EFEFEF"
                stroke-width="1.77012"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
