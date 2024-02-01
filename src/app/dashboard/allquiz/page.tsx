"use client";
import { StoreTournmentDataService } from "@/appwrite/appwriteService";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Quiz {
  $id: string;
  quizName: string;
  tournmentName: string;
  startDate: string;
  endDate: string;
  basePoints: number;
  quizImageId: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface CreateQuizParams {
  quizId: string;
  tournamentId: string;
  colorSelect: string;
  timePerQuestion: number;
  // ... other properties
}

interface QuizListComponentProps {
  quizData: Quiz[];
  setViewQuestionVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleViewQuestions: (quizId: string) => void;
  handleUpdate: (quizId: string) => void;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
  handleDelete: (quizId: string, imageId: string) => void;
}

const Page: React.FC = () => {
  const [quizData, setQuizData] = useState<Quiz[] | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [singleQuizData, setSingleQuizData] = useState<Quiz>({
    $id: "",
    quizName: "",
    tournmentName: "",
    startDate: "",
    endDate: "",
    basePoints: 0,
    quizImageId: "",
  });
  const [tournmentData, setTournmentData] = useState<any | null>(null);
  const [viewQuestionVisible, setViewQuestionVisible] = useState<boolean>(false);
  const [questionsData, setQuestionsData] = useState<Question[] | null>(null);

  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchAllQuizData = async () => {
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.allQuizesData();
      console.log(response);
  
      if (response) {
        // Assuming Document has a structure similar to Quiz
        const quizDataArray: Quiz[] = response.map((document) => ({
          $id: document.$id || "",
          quizName: document.quizName || "",
          tournmentName: document.tournmentName || "",
          startDate: document.startDate || "",
          endDate: document.endDate || "",
          basePoints: document.basePoints || 0,
          quizImageId: document.quizImageId || "",
        }));
  
        setQuizData(quizDataArray);
      } else {
        console.error("Received undefined response from allQuizesData");
      }
    } catch (error) {
      console.log("Error in allQuizDataService", error);
    }
  };

  const handleDelete = async (id: string, imageId: string) => {
    console.log(id);
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.deleteQuiz(id);
      const imgDelete = await storeService.deleteQuizImage(imageId);
      console.log(imgDelete);
      if (response) {
        toast.success("Quiz deleted successfully");
        fetchAllQuizData();
      } else {
        toast.error("Error in Quiz Deleting");
      }
    } catch (error) {
      console.log("Error in delete quiz", error);
    }
  };

  const handleUpdate = async (id: string) => {
    console.log(id);
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.getQuizById(id);
      console.log(response);
  
      if (response) {
        setSingleQuizData(prevState => ({
          ...prevState,
          quizId: response?.$id || "",
          quizName: response?.quizName || "",
          tournmentName: response?.tournmentName || "",
          startDate: response?.startDate || "",
          endDate: response?.endDate || "",
          basePoints: response?.basePoints || 0,
        }));
        
  
        const tournmentById = await storeService.getTournamentById(
          response?.tournamentId
        );
        console.log(tournmentById?.documents);
        setTournmentData(tournmentById?.documents || null);
      }
    } catch (error) {
      console.log("Error in update quiz by Id service", error);
    }
  };

  /// updating quiz in model ..//
  const updateQuiz = async () => {
    const storeService = new StoreTournmentDataService();
    try {
      const quizStartDate = singleQuizData.startDate;
      const quizEndDate = singleQuizData.endDate;
      const tournamentStartDate = tournmentData[0]?.startDate;
      const tournamentEndDate = tournmentData[0]?.endDate;
      console.log(tournamentStartDate, tournamentEndDate);
      if (
        quizStartDate < tournamentStartDate ||
        quizEndDate > tournamentEndDate
      ) {
        toast.error(
          `your selected tournament ending date is ${tournamentEndDate} you are selecting the wrong date`
        );
        closeModal();
        return;
      }
// @ts-ignore

      const response = await storeService.updateQuiz(singleQuizData);

      if (response) {
        toast.success("quiz updated successfully");
        closeModal();
        fetchAllQuizData();
      }
    } catch (error) {
      console.log("updating quiz failed", error);
    }
  };

  const handleViewQuestions = async (id: string) => {
    console.log(id);
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.getQuizById(id);
      console.log(response?.questions);
      setQuestionsData(JSON.parse(response?.questions));
    } catch (error) {
     
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllQuizData();
  }, []);
  return (
    <>
      <div className="max-w-full bg-green-800 rounded-md text-white text-lg font-semibold p-4">
        All quizes
      </div>
      <table className="w-full bg-white border border-gray-300 rounded">
        <thead>
          <tr>
            <th className="border-b p-3">Quiz Name</th>
            <th className="border-b p-3">Tournament Name</th>
            <th className="border-b p-3">Start Date</th>
            <th className="border-b p-3">End Date</th>
            <th className="border-b p-3">Base Points</th>
            <th className="border-b p-3"></th>
            <th className="border-b p-3">Actions</th>
            <th className="border-b p-3"></th>
          </tr>
        </thead>
        <tbody>
          {quizData &&
            quizData.map((quiz) => (
              <tr key={quiz.$id}>
                <td className="border-b p-3">{quiz.quizName}</td>
                <td className="border-b p-3">{quiz.tournmentName}</td>
                <td className="border-b p-3">{quiz.startDate}</td>
                <td className="border-b p-3">{quiz.endDate}</td>
                <td className="border-b p-3">{quiz.basePoints}</td>
                <td className="border-b p-3">
                  <button
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-600 focus:outline-none"
                    onClick={() => {
                      setViewQuestionVisible(true);
                      handleViewQuestions(quiz.$id);
                    }}
                  >
                    View Questions
                  </button>
                </td>
                <td className="border-b p-3">
                  <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
                    onClick={() => {
                      handleUpdate(quiz.$id);
                      setModalOpen(true);
                    }}
                  >
                    Update
                  </button>
                </td>
                <td className="border-b p-3">
                  <button
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none"
                    onClick={() => handleDelete(quiz.$id, quiz.quizImageId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>

        <>
          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 overflow-y-auto z-50">
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
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="p-6">
                    <h2 className="text-4xl font-semibold mb-4">
                      Update Tournament
                    </h2>
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Quiz Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your question here"
                        value={singleQuizData?.quizName || ""}
                        onChange={(e) =>
                          setSingleQuizData({
                            ...singleQuizData,
                            quizName: e.target.value,
                          })
                        }
                        className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tournment Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your question here"
                        value={singleQuizData?.tournmentName || ""}
                        //  onChange={(e) => setSingleQuizData({ ...singleQuizData, tournmentName: e.target.value })}
                        className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        placeholder="Enter your question here"
                        value={singleQuizData?.startDate || ""}
                        onChange={(e) =>
                          setSingleQuizData({
                            ...singleQuizData,
                            startDate: e.target.value,
                          })
                        }
                        className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        placeholder="Enter your question here"
                        value={singleQuizData?.endDate || ""}
                        onChange={(e) =>
                          setSingleQuizData({
                            ...singleQuizData,
                            endDate: e.target.value,
                          })
                        }
                        className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Base Point
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your question here"
                        value={singleQuizData?.basePoints || ""}
                        onChange={(e) =>
                          setSingleQuizData({
                            ...singleQuizData,
                             basePoints: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={closeModal}
                        className="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 focus:outline-none mr-2"
                      >
                        Close
                      </button>
                      <button
                        onClick={updateQuiz}
                        className="bg-green-800 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none"
                      >
                        Update Quiz
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>

        {/* show question model */}
        <>
  {/* Modal */}
  {viewQuestionVisible && (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="p-6">
            <h2 className="text-4xl font-semibold mb-4">
              Questions Info
            </h2>
            <div>
              {questionsData && questionsData.length > 0 ? (
                // Map over questions if it exists
                questionsData.map((question, index) => {
                  // Parse options from JSON string to JavaScript array
// @ts-ignore

                  const optionsArray = JSON.parse(question?.options || "[]") as string[];

                  return (
                    <div key={index}>
                      {/* Display question text */}
                      <p className="font-bold">
                        Question {index + 1}: {question.question}
                      </p>

                      {/* Display all options */}
                      <ul>
                        {optionsArray.map((option, optionIndex) => (
                          <li key={optionIndex}>
                            {option}
                            {option === question.correctAnswer && (
                              <span className="ml-2 text-green-500">(Correct)</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })
              ) : (
                // Render a message or handle the case when questionsData or questions is undefined
                <p>No questions available.</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewQuestionVisible(false)}
                className="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 focus:outline-none mr-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</>

      </table>
    </>
  );
};

export default Page;
