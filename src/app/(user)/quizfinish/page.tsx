'use client'
import React, { Suspense } from "react";
import profile from "@/assets/images/user.png";
import av3 from "@/assets/images/av3.png";
// import starsImg from "@/assets/images/StarssImage.png";
import starImg from "@/assets/images/starImg.png";
import fun from "@/assets/images/fun.png";
import Image from "next/image";
// import { useSearchParams } from "next/navigation";


const Page = () => {

  // const param = useSearchParams()
  // console.log(param)
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="bgPurple">
      <div className="quizBannerFinish p-10">
        <div className="p50">
          <h1 className="gameHeading">The Pizza King</h1>
          <h2 className="gameHeadingTwo">A prize-winning quiz game</h2>
        </div>
      </div>

      <div className="quizCompletedDiv text-center mb-9">
        <Image src={av3} alt="" className="mx-60" />

        <div className="quizComHeadingDiv mt-3">
          <h3 className="quizComHeading">Quiz completed Successfully</h3>
          <h3 className="quizComPosition">Your position: 200 / 500</h3>
        </div>
        <div className="quizComHeadingDiv mt-3">
          {/* <h3 className="quizComHeading">Correct Answers : {param.get('correct')}</h3>
          <h3 className="quizComPosition">Wrong Answers : {param.get('wrong')}</h3> */}
        </div>
        <div className="flex items-center justify-center mt-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={50}
            height={50}
            x={0}
            y={0}
            viewBox="0 0 511.987 511"
            // @ts-ignore
            style={{ enableBackground: "new 0 0 512 512" }}
            xmlSpace="preserve"
            className=""
          >
            <g>
              <path
                fill="#ffc107"
                d="M510.652 185.902a27.158 27.158 0 0 0-23.425-18.71l-147.774-13.419-58.433-136.77C276.71 6.98 266.898 0.494 255.996 0.494s-20.715 6.487-25.023 16.534l-58.434 136.746-147.797 13.418A27.208 27.208 0 0 0 1.34 185.902c-3.371 10.368-.258 21.739 7.957 28.907l111.7 97.96-32.938 145.09c-2.41 10.668 1.73 21.696 10.582 28.094 4.757 3.438 10.324 5.188 15.937 5.188 4.84 0 9.64-1.305 13.95-3.883l127.468-76.184 127.422 76.184c9.324 5.61 21.078 5.097 29.91-1.305a27.223 27.223 0 0 0 10.582-28.094l-32.937-145.09 111.699-97.94a27.224 27.224 0 0 0 7.98-28.927zm0 0"
                opacity={1}
                data-original="#ffc107"
                className=""
              />
            </g>
          </svg>
          {/* <h1 className="quizTotalPoints ps-3">{param.get('points')}</h1> */}
        </div>
      </div>

      <div className="svgDivider">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="393"
          height="2"
          viewBox="0 0 393 2"
          fill="none"
        >
          <path
            d="M-8 1H414"
            stroke="#FCC025"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex justify-center items-center mt-3 pb-4">
        <Image className="me-2" src={starImg} alt="" />
        <button className="pointsShareBtn flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15 8C16.6569 8 18 6.65685 18 5C18 3.34315 16.6569 2 15 2C13.3431 2 12 3.34315 12 5C12 5.12548 12.0077 5.24917 12.0227 5.37061L7.08259 7.84064C6.54303 7.32015 5.8089 7 5 7C3.34315 7 2 8.34315 2 10C2 11.6569 3.34315 13 5 13C5.80892 13 6.54306 12.6798 7.08263 12.1593L12.0227 14.6293C12.0077 14.7508 12 14.8745 12 15C12 16.6569 13.3431 18 15 18C16.6569 18 18 16.6569 18 15C18 13.3431 16.6569 12 15 12C14.1911 12 13.457 12.3201 12.9174 12.8406L7.97733 10.3706C7.9923 10.2492 8 10.1255 8 10C8 9.8745 7.99229 9.7508 7.97733 9.62934L12.9174 7.15932C13.4569 7.67984 14.1911 8 15 8Z"
              fill="#600DB2"
            />
          </svg>
          Share with friends!
        </button>
      </div>

      <div className="my-4 text-center flex items-center justify-center">
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
            strokeWidth="2"
          />
          <path
            d="M16.0314 10C11.6632 10 8.12207 13.5411 8.12207 17.9094"
            stroke="white"
            strokeWidth="2"
          />
          <path d="M8.12207 0L8.12207 17.0126" stroke="white" strokeWidth="2" />
        </svg>
        <p className="nextQuiz ps-2">Next Game</p>
      </div>

      <div className="relatedQuiz">
        <div className="hhQuizThree ">
          <div className="statusBar flex justify-between items-center px-3">
            <div className="flex items-center">
              <Image className="pe-2" src={profile} alt="" />
              <p className="stPlays mb-0">961 plays</p>
            </div>
            <div className="text-center">
              <Image className=" img-fluid w-50" src={fun} alt="" />
            </div>
          </div>

          <h1 className="hhquizHeading mt-2">Hola</h1>
          <h1 className="hhquizHeading">Mexicana</h1>
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
              strokeWidth="1.77012"
            />
            <path
              d="M8.3125 0.655129C8.3125 4.17548 11.2515 7.0293 14.877 7.0293"
              stroke="#EFEFEF"
              strokeWidth="1.77012"
            />
            <path
              d="M0.0078125 7.0293H14.1277"
              stroke="#EFEFEF"
              strokeWidth="1.77012"
            />
          </svg>
        </div>
      </div>
    </div>
    </Suspense>
  );

};

// const SuspendedPage = () => {
//   return (
//     <React.Suspense fallback={<div>Loading...</div>}>
//       <Page />
//     </React.Suspense>
//   );
// };

export default Page;
