"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import timeimg from "@/assets/images/timeImage.png";
import starss from "@/assets/images/star.png";
import quesImage from "@/assets/images/quesImage.png";
import quesSpeaker from "@/assets/images/quesSpeacker.png";
import muteSpeaker from "@/assets/images/speaker-off.png";
// import { useParams } from "react-router-dom";
import { StoreTournmentDataService } from "@/appwrite/appwriteService";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import CountUp from "react-countup";
// @ts-ignore
import Clapping from "@/assets/audio/clapping.mp3";
// @ts-ignore
import BackgroundMusic from "@/assets/audio/thinking.mp3";
// @ts-ignore
import WrongAnswerSound from "@/assets/audio/wrong.mp3";
// import  TickSVG from "@/assets/images/tickk.svg";
// import  CrossSVG  from "@/assets/images/cross.svg";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

type OptionType = string | number | boolean;

const QuesWithImage = () => {
  const questionStartTimeRef = useRef<number | null>(null);
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]); // Adjust 'any[]' to match your question type
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<any | null>(null); // Adjust 'any' to match your option type
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [localTimer, setLocalTimer] = useState<number | null>(timer);
  const [isSecondImageVisible, setIsSecondImageVisible] = useState(true);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const searchParams = useSearchParams();
  const Quizid = searchParams.get("id");
  const Quiz = searchParams.get("Quiz"); // Assuming the parameter name is 'id'

  const [questionStartTime, setQuestionStartTime] = useState<number | null>(
    null
  );
  const [timePerQuestionInmiliSeconds, setTimePerQuestionInmiliSeconds] =
    useState<number>(0);
  const [pointsPerSecondInMiliSecond, setPointPerSecondInMiliSecond] =
    useState<number>(0);
  const [excetPoints, setExactPoints] = useState<number>(0);
  const [basePoint, setBasePoint] = useState<number>(0);
  const [isCounting, setIsCounting] = useState(false);

  const params = useParams();
  const id: string = Array.isArray(params.id) ? params.id[0] : params.id;

  const clapping = new Audio(Clapping);
  const backgroundMusicRef = useRef(new Audio(BackgroundMusic));
  const wrongAnswerSound = new Audio(WrongAnswerSound);

  // backgroundMusicRef.current.loop = true;
  // backgroundMusicRef.current.play();

  useEffect(() => {
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.play();

    return () => {
      // Ensure the elements you're trying to clean up exist before removing them
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
  const heightSize = window.innerHeight;
  console.log("height", heightSize);

  const handleImageClick = () => {
    setIsSecondImageVisible((prev) => !prev);
    setIsSoundMuted((prev) => !prev);

    // Toggle the background music's muted property
    backgroundMusicRef.current.muted = !backgroundMusicRef.current.muted;
  };

  const getQuizByQuizId = async () => {
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.getSingleQuizById(
        Array.isArray(id) ? id[0] : id
      );
      console.log(response);

      //// getting time from api and convert in into miliseconds ..//
      const timePerQuestionInMilliseconds =
        JSON.parse(response?.pointsPerSeconds) * 1000;
      console.log(timePerQuestionInMilliseconds);
      setTimePerQuestionInmiliSeconds(timePerQuestionInMilliseconds);

      /// getting point per seconds from api and convert in into miliseconds ..//
      const pointsperSecondInMiliSeconds =
        JSON.parse(response?.pointsPerSeconds) / 1000;
      setPointPerSecondInMiliSecond(pointsperSecondInMiliSeconds);
      console.log(pointsperSecondInMiliSeconds);

      const basePoint = JSON.parse(response?.basePoints);
      setBasePoint(basePoint);

      // setTimer(JSON.parse(response?.timePerQuestion));
      setTimer(10000);
      const parsedQuestions = JSON.parse(response?.questions).map(
        (question: any) => ({
          ...question,
          options: JSON.parse(question.options),
        })
      );
      console.log(parsedQuestions);

      setQuestions(parsedQuestions);
    } catch (error) {
      console.log("Error in getQuizDataByTournamentId", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getQuizByQuizId();
    };

    fetchData();

    return () => clearInterval(intervalId!);
  }, [id, currentQuestionIndex]);

  useEffect(() => {
    if (timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setLocalTimer((prev) => (prev ? prev - 1 : prev));
      }, 1000);
      setIntervalId(interval);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleTimeout();
    }
  }, [id, currentQuestionIndex, timer]);

  useEffect(() => {
    // Set the start time for the first question
    if (currentQuestionIndex === 0) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex]);

  const finishQuiz = async () => {
    clearInterval(intervalId!);
    console.log(
      "Quiz Finished! Correct: ",
      correctCount,
      " Wrong: ",
      wrongCount
    );
    const points = excetPoints;

    // Stop the continuous background music when the quiz ends
    if (!backgroundMusicRef.current.paused) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }

    const userId = Cookies.get("userId");
    const userEmail = Cookies.get("providerUid");
    const quizName = Quiz?.replace(/-/g, " ");
    const quizId = Quizid;
    const score = points;
    const quizPlayed = true;
    try {
      const storeService = new StoreTournmentDataService();
      // @ts-ignore
      const response = await storeService.saveUserPlayedInfo(
        // @ts-ignore
        userId,
        userEmail,
        quizPlayed,
        quizId,
        quizName,
        score
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    router.push(`/quizfinish?quizId=${quizId}&score=${score}`);
  };

  const handleOptionSelect = (option: any) => {
    console.log("handleOptionSelect called");
    clearInterval(intervalId!);

    const isCorrect = option === questions[currentQuestionIndex]?.correctAnswer;

    const startTime = questionStartTime;

    setSelectedOption({ ...option, isCorrect });

    // Check if the option is correct
    if (isCorrect) {
      const elapsedTime = Date.now() - startTime!;
      const pointsForThisQuestion =
        elapsedTime * pointsPerSecondInMiliSecond + basePoint;

      // Check if the sound is not muted before adding points
      if (!isSoundMuted) {
        setExactPoints((prev) => Math.floor(prev + pointsForThisQuestion));
        setCorrectCount((prev) => prev + 1);

        // Play the sound only when the correct option is selected and sound is not muted
        clapping.play();
      } else if (isSoundMuted) {
        setExactPoints((prev) => Math.floor(prev + pointsForThisQuestion));
        setCorrectCount((prev) => prev + 1);
      }
    } else {
      setWrongCount((prev) => prev + 1);
      wrongAnswerSound.play();
    }

    // Move to the next question
    setTimeout(() => {
      console.log("Moving to the next question");
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimer(questions[currentQuestionIndex + 1]?.timePerQuestion || 10);
        setSelectedOption(null);
        setQuestionStartTime(Date.now());
      } else {
        finishQuiz();
      }
    }, 1000);
  };

  const handleTimeout = () => {
    const defaultIncorrectOption = "Some default incorrect option";
    handleOptionSelect(defaultIncorrectOption);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimer(questions[currentQuestionIndex + 1]?.timePerQuestion || 10);
        setSelectedOption(null);
        setQuestionStartTime(Date.now());
      } else {
        finishQuiz();
      }
    }, 1000);
  };
  const getOptionColor = (option: any) => {
    if (selectedOption) {
      const isCorrectOption =
        option === questions[currentQuestionIndex]?.correctAnswer;

      if (selectedOption.isCorrect && isCorrectOption) {
        // Correctly selected option
        return "selected-correct";
      } else if (!selectedOption.isCorrect && !isCorrectOption) {
        // Incorrectly selected option
        return "selected-wrong";
      } else if (!selectedOption.isCorrect && isCorrectOption) {
        // Incorrectly selected option, but the current option is correct
        return "selected-correct-green";
      }
    }
    return "";
  };
  const handleExit = async () => {
    // Pause and reset background music

    const userId = Cookies.get("userId");
    const userEmail = Cookies.get("providerUid");
    const quizName = Quiz?.replace(/-/g, " ");
    const quizId = Quizid;
    const score = excetPoints;
    const quizPlayed = true;
    try {
      const storeService = new StoreTournmentDataService();
      // @ts-ignore
      const response = await storeService.saveUserPlayedInfo(
        // @ts-ignore
        userId,
        userEmail,
        quizPlayed,
        quizId,
        quizName,
        score
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    backgroundMusicRef.current.pause();
    backgroundMusicRef.current.currentTime = 0;

    // Clear the interval if it exists
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null); // Set intervalId to null after clearing
    }

    router.push("/home");
  };

  useEffect(() => {
    if (timer === 0) {
      handleTimeout();
    }
  }, [timer]);

  const containerVariants = {
    hidden: { opacity: 1, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 1,
        staggerChildren: 1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const fadeInVariants = {
    initial: { opacity: 1, y: 1000 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1,
        duration: 1.5, // Longer duration for smoother effect
        // ease: "linear", // Easing function for a smooth transition
        ease: [0.17, 0.17, 0.17, 0.17],
      },
    },
    exit: {
      opacity: 1,
      y: -1000,
      delay: 1,

      transition: {
        duration: 1.5,
        // ease: "linear", // Easing function for a smooth exit
        ease: [0.17, 0.17, 0.17, 0.17],
      },
    },
  };

  return (
    <div className="">
      <div className={`quesBg h-screen overflow-hidden`}>
        <AnimatePresence>
          <motion.div
            key={currentQuestionIndex}
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="questionStatusbar flex justify-between items-center px-2">
              <div className="exit cursor-pointer">
                <div
                  className="flex justify-center items-center"
                  onClick={handleExit}
                >
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
                      strokeWidth="2.41379"
                    />
                    <path
                      d="M8.95142 17.6637C8.95142 12.8632 4.94364 8.97168 -0.000209644 8.97168"
                      stroke="white"
                      strokeWidth="2.41379"
                    />
                    <path
                      d="M20.276 8.97168L1.02155 8.97168"
                      stroke="white"
                      strokeWidth="2.41379"
                    />
                  </svg>
                  <p className="quesExit ps-2 mb-0">Exit</p>
                </div>
              </div>
              <div className="quesTime">
                <CountdownCircleTimer
                  key={currentQuestionIndex}
                  size={70}
                  isPlaying={timer !== null && timer > 0}
                  duration={timer || 0}
                  colors={["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"]}
                  colorsTime={[7, 5, 2]}
                  onComplete={() => handleTimeout()}
                >
                  {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
              </div>

              <div className="quesStars flex">
                <div
                  className={`${isCounting ? "starFireEffect" : ""} starIcon`}
                >
                  {/* Replace this with your star SVG or image */}
                  <Image src={starss} alt="" width={20} />
                </div>
                <div className="pointdiv">
                  <CountUp
                    start={0}
                    end={excetPoints}
                    duration={2.5}
                    onStart={() => setIsCounting(true)}
                    onEnd={() => setIsCounting(false)}
                  />
                  <p className="quesPoints">Points</p>
                </div>
              </div>
            </div>
            <div className="quesImageDiv quizimagehight">
              {Array.isArray(questions) &&
                questions.length > 0 &&
                currentQuestionIndex < questions.length &&
                // Check if the question has an imageUrl before rendering the Image component
                (questions[currentQuestionIndex].imageUrl ? (
                  <Image
                    key={`image-${currentQuestionIndex}`}
                    src={questions[currentQuestionIndex].imageUrl}
                    alt="question image"
                    width={100}
                    height={100}
                    className="quesimage"
                    // style={{ width: "100%", height: "300px" }}
                  />
                ) : (
                  ""
                ))}
            </div>
            <div
              className={`quesPadding ${
                questions[currentQuestionIndex]?.imageUrl
                  ? "with-image"
                  : "without-image"
              }`}
            >
              <div className="questionAsking flex items-center justify-between">
                <div className="questionNumber">
                  <p className="queNumber mb-0">
                    Question {currentQuestionIndex + 1} / {questions.length + 1}
                  </p>
                </div>
                <div className="quesSpeaker" onClick={handleImageClick}>
                  <Image
                    src={isSecondImageVisible ? quesSpeaker : muteSpeaker}
                    alt="speakerimage"
                  />
                </div>
              </div>

              <div className="quesHeadingDiv pt-2">
                {currentQuestionIndex < questions.length && (
                  <motion.h1
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2 }}
                    className="quesHeading"
                    style={
                      questions[currentQuestionIndex]?.imageUrl
                        ? { marginTop: "20px", padding: "0px 25px" }
                        : { marginTop: "0px", padding: "0px 25px" }
                    }
                  >
                    {questions[currentQuestionIndex].question}
                  </motion.h1>
                )}
              </div>

              <div className="quesOptionsdiv my-4">
                {currentQuestionIndex < questions.length && (
                  <motion.div
                    key={`container-${currentQuestionIndex}`} // Unique key for the container
                    className="options-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {questions[currentQuestionIndex].options.map(
                      (option: OptionType, optionIndex: number) => (
                        <motion.div
                          key={`${currentQuestionIndex}-${optionIndex}`} // Unique key for each question and option
                          className={`quesOptions mt-3 ${getOptionColor(
                            option
                          )}`}
                          onClick={() => handleOptionSelect(option)}
                          variants={itemVariants}
                        >
                          <p className="quesP cursor-pointer mb-0">{option}</p>
                        </motion.div>
                      )
                    )}
                  </motion.div>
                )}
              </div>

              <div className="flex justify-center items-center mt-5">
                <div className="exit cursor-pointer">
                  <div className="flex justify-center items-center">
                    <p
                      className="quesExit pe-2 mb-0"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) => prev + 1)
                      }
                    >
                      SKIP
                    </p>
                  </div>
                </div>
                <div className="exit cursor-pointer">
                  <div className="flex justify-center items-center">
                    {/* <p className="quesExit pe-2 mb-0">Skip</p> */}
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
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuesWithImage;
