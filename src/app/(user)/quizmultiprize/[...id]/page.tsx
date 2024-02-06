"use client";
import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
import profile from "@/assets/images/user.png";
import elipse from "@/assets/images/Ellipse 51.png";
// import Navbar from "./Navbar";
import Carousel from "@/components/Carousel";
import eye from "@/assets/images/eye.png";
import tick from "@/assets/images/tick.png";
import time from "@/assets/images/time.png";
import { StoreTournmentDataService } from "@/appwrite/appwriteService";
import crosBg from "@/assets/images/crosBg.png";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import YellowBorder from "@/assets/images/yellowBorder.jpeg";
import { useSearchParams } from "next/navigation";

interface Quiz {
  $id: string;
  quizImageURL: string;
  quizName: string;
  endDate?: string;
  tournamentId: string;
}

interface Tournament {
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
}

const page: React.FC = () => {
  const { id } = useParams();

  const dateId = id as string;

  const [quiz, setQuiz] = useState<Quiz | any>(null);
  const [tournament, setTournament] = useState<Tournament | any>(null);

  const quizData = async () => {
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.getSingleQuizById(dateId);
      if (response) {
        setQuiz(response);
      }
      const tournment = await storeService.getTournamentById(
        response?.tournamentId
      );
      const tournaments = tournment?.documents;
      if (tournaments && tournaments.length > 0) {
        setTournament(tournaments[0]);
      } else {
        setTournament(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(tournament);
  // console.log(tournament?.firstPrize)

  const divStyle = {
    backgroundImage: `url('${quiz?.quizImageURL}')`,
    height: " 315px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
  };

  const endDate = quiz?.endDate ? new Date(quiz.endDate) : null;
  const formattedStartDate = endDate
    ? `${endDate.getMonth() + 1}:${endDate.getDate()}:${endDate.getFullYear()}`
    : "";

  useEffect(() => {
    quizData();
  }, [id]);

  return (
    <div>
      <div className="main-bg overflow-hidden">
        <div
          className="quizBannerTwo relative"
          style={{ backgroundImage: `url('${quiz?.quizImageURL}')` }}
        >
          {/* Overlay div */}
          <div
            className="absolute top-0 right-0 bottom-0 left-0 opacity-70 rounded"
            style={{
              zIndex: 1,
              backgroundColor: quiz?.colorSelect || "#6D10CA",
            }}
          ></div>

          {/* Content Container */}
          <div
            className="statusBar flex justify-between items-center px-3"
            style={{ position: "relative", zIndex: 2 }}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                >
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
                </svg>
              </svg>
              <p className="stPlays mb-0">961 plays</p>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <circle cx="5" cy="5" r="5" fill="#FCC025" />
                  </svg>
                </svg>
              </svg>
              <p className="stPlaysEnds mb-0 ps-1">
                Ends: {formattedStartDate}
              </p>
            </div>
          </div>
          <div
            className="mainGameHeadingQuiz"
            style={{ position: "relative", zIndex: 200 }}
          >
            <h2 className="welcomePiza">Welcome to:</h2>
            <h1 className="gameHeading">{quiz?.quizName}</h1>
            <h2 className="gameHeadingTwo">A prize-winning quiz game</h2>
          </div>
        </div>

        <div className="qmSecond bgPurple py-5">
          {/* <div className="imgYelow">
        
        </div> */}
          <div className="flex justify-center items-center py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-108 h-2"
              viewBox="0 0 108 2"
              fill="none"
            >
              <path
                opacity="0.8"
                d="M0 1L108 1.00001"
                stroke="white"
                strokeDasharray="10 10"
              />
            </svg>
            <p className="qmPrize px-3 mb-0">The Prizes</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-108 h-2"
              viewBox="0 0 108 2"
              fill="none"
            >
              <path
                opacity="0.8"
                d="M0 1L108 1.00001"
                stroke="white"
                strokeDasharray="10 10"
              />
            </svg>
          </div>

          {tournament && (
            <>
              {tournament.type === "contest" ? (
                <>
                  {tournament.firstPrize ? (
                    // Always show the first prize
                    <div className="slide text-center relative">
                      {/* ... */}
                    </div>
                  ) : null}

                  {tournament.secondPrize && tournament.thirdPrize ? (
                    // Show Carousel with all three prizes
                    <Carousel
                      first={tournament.firstPrize}
                      second={tournament.secondPrize}
                      third={tournament.thirdPrize}
                    />
                  ) : null}
                </>
              ) : null}

              {/* Do not show anything if the tournament type is 'free' */}
            </>
          )}
          <div className="pt-5">
            <p className="crThankyou mb-0"> Think you have it with Pizza? </p>
            <p className="crThankyou ">Play the game and win prizes! </p>
          </div>

          <div className="leaderBoardBtn flex justify-center items-center">
            {/* <button className="qzleaderBtn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-32 h-14"
                viewBox="0 0 32 14"
                fill="none"
              >
                <path
                  d="M1 1H6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M1 7H6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M1 13H6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M11 1L31 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M11 7L31 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M11 13L31 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="ps-2 mb-0">View leaderboard</span>
            </button> */}
          </div>

          <div className="quizFooter mt-4 flex items-center mb-32 justify-around">
            {/* <img src={starImg} alt="" /> */}
            <Link
              key={quiz?.$id}
              href={`/newlayout/${quiz?.$id}?id=${
                quiz?.$id
              }&Quiz=${quiz?.quizName.replace(/\s+/g, "-")}`}
              className="text-decoration-none text-inherit"
            >
              <button className="startplaying">start playing</button>
            </Link>
          </div>

          {/* <div className="flex justify-center items-center py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-108 h-2"
              viewBox="0 0 108 2"
              fill="none"
            >
              <path
                opacity="0.8"
                d="M0 1L108 1.00001"
                stroke="white"
                strokeDasharray="10 10"
              />
            </svg>
            <p className="qmPrize px-3 mb-0">How to win?</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-108 h-2"
              viewBox="0 0 108 2"
              fill="none"
            >
              <path
                opacity="0.8"
                d="M0 1L108 1.00001"
                stroke="white"
                strokeDasharray="10 10"
              />
            </svg>
          </div> */}

          <div className="mt-3">
            <div className="flex justify-between items-center px-4">
              <div className="qzEye">
                <Image src={eye} alt="" />
                <p className="eyeContent mb-0 pt-2"> Read </p>
                <p className="eyeContent"> Carefully </p>
              </div>
              <div className="qzTick">
                <Image src={tick} alt="" />
                <p className="eyeContent mb-0 pt-2"> Don’t be </p>
                <p className="eyeContent"> wrong </p>
              </div>
              <div className="qzTime">
                <Image src={time} alt="" />
                <p className="eyeContent mb-0 pt-2"> Answer</p>
                <p className="eyeContent"> Fast </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-108 h-2"
              viewBox="0 0 108 2"
              fill="none"
            >
              <path
                opacity="0.8"
                d="M0 1L108 1.00001"
                stroke="white"
                strokeDasharray="10 10"
              />
            </svg>
            <p className="qmPrize px-3 mb-0">The Prizes</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-108 h-2"
              viewBox="0 0 108 2"
              fill="none"
            >
              <path
                opacity="0.8"
                d="M0 1L108 1.00001"
                stroke="white"
                strokeDasharray="10 10"
              />
            </svg>
          </div>

          <div className="p-3">
            <p className="qqPrizeContent">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt
            </p>
          </div>

          <div className="flex justify-center items-center py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-108 h-2"
              viewBox="0 0 108 2"
              fill="none"
            >
              <path
                opacity="  0.8"
                d="M0 1L108 1.00001"
                stroke="white"
                strokeDasharray="10 10"
              />
            </svg>
            <p className="qmPrize px-3 mb-0">Legal</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-108 h-2"
              viewBox="0 0 108 2"
              fill="none"
            >
              <path
                opacity="0.8"
                d="M0 1L108 1.00001"
                stroke="white"
                strokeDasharray="10 10"
              />
            </svg>
          </div>

          <div className="p-3">
            <p className="qqPrizeContent">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
