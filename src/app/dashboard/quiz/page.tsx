"use client";
import { StoreTournmentDataService } from "@/appwrite/appwriteService";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Picker from "emoji-picker-react";

interface QuestionData {
  question: string;
  image: File | null; // Placeholder for file upload, modify as needed
  type: string;
  options: string[];
}
interface FormData {
  quizName: string;
  colorSelect: string;
  startDate: string;
  endDate: string;
  basePoints: number;
  timePerQuestion: number;
  selectedTournamentId: string;
  selectedTournamentName: string;
  quizImageURL: string;
  quizImageId: string;
  questions: Question[];
  pointsPerSeconds: string;
}
interface Question {
  imageId: string | null;
  options: string[]; // Array of strings
  question: string;
  type: string;
  selectedTournamentId: string;
  correctAnswer: string;
  $id: string;
  $createdAt: string;
}

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

// Define the interface for a quiz question
interface QuizQuestion {
  question: string;
  type: string;
  options: QuestionOption[];
  imageId: string | undefined;
  previewUrl: string | undefined;
  selectedTournamentId: string | undefined;
  correctOptionIndex?: number;
}

interface Tournament {
  $id: string; // Assuming this is the ID type, adjust accordingly
  title: string;
  type: string;
  firstPrize: string;
  secondPrize?: string;
  thirdPrize?: string;
  startDate: string;
  endDate: string;
}
interface QuestionData {
  question: string; // Placeholder for file upload, modify as needed
  type: string;
  options: string[];
  imageId: string | undefined;
  previewUrl: string | undefined;
  selectedTournamentId: string | undefined;
  correctAnswer?: string;
  imageUrl?: string | undefined;
}

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#d63a3a");
  const [currentQuestionType, setCurrentQuestionType] =
    useState<string>("Multiple Choice");
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [tournamentOptions, setTournamentOptions] = useState([]);
  const [question, setQuestion] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [quizImageId, setquizImageId] = useState("");
  const [allQuestions, setAllquestions] = useState([]);
  const [questionImageId, setquestionImageId] = useState("");
  const [quizImage, setQuizImage] = useState<string>("");
  const [questionImage, setQuestionImage] = useState<string>("");
  const [quizImageUrl, setQuizImageUrl] = useState<string>("");
  const [questionDataByTournmentId, setQuestionDataByTournmentId] =
    useState(null);
  const [questionData, setQuestionData] = useState({
    question: "",
    options: [],
    type: "",
  });
  const [formData, setFormData] = useState<FormData>({
    quizName: '',
    colorSelect: '',
    startDate: '',
    endDate: '',
    basePoints: 0,
    timePerQuestion: 0,
    selectedTournamentId: '',
    selectedTournamentName: '',
    quizImageURL: '',
    quizImageId: '',
    questions: [],
    pointsPerSeconds: '',
  });
  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
  };
  const handleEmojiSelect = (emoji :  any)  => {
    setSelectedEmoji(emoji);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRemoveOption = (index: number): void => {
    const updatedOptions = [...questionData.options];
    updatedOptions.splice(index, 1);

    setQuestionData((prevData) => ({
      ...prevData,
      options: updatedOptions,
    }));
  };

  const handleQuestionTypeChange = (type: string): void => {
    setCurrentQuestionType(type);
    setQuestionData((prevData) => ({
      ...prevData,
      options: [], // Reset options when question type changes
    }));
  };

  const handleAddQuestions = () => {
    openModal();
  };
  const handleColorSelection = (color :  any) => {
    setSelectedColor(color);
    setFormData({
      ...formData,
      colorSelect: color,
    });
  };

  const handleAddOption = (): void => {
    if (questionData.options.length < 4) {
// @ts-ignore

      setQuestionData((prevData) => ({
        ...prevData,
        options: [...prevData.options, ""],
      }));
    }
  };

  const handleSaveQuestion = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();

    // Store the correct answer based on the question type
    let correctAnswer;
    if (currentQuestionType === "Yes/No") {
      const answerOptions = document.querySelectorAll('input[name="answer"]');
      const selectedOption = Array.from(answerOptions).find(
        (option: any) => option.checked
      );
// @ts-ignore

      correctAnswer = selectedOption ? selectedOption.value : null;
    } else {
      const answerOptions = document.querySelectorAll('input[name="options"]');
      const selectedOptionIndex = Array.from(answerOptions).findIndex(
        (option: any) => option.checked
      );
      correctAnswer =
        selectedOptionIndex !== -1
          ? questionData.options[selectedOptionIndex]
          : null;
    }

    if (
      currentQuestionType === "Multiple Choice" &&
      questionData.options.length < 4
    ) {
      toast.error("Please provide 4 options");
      return;
    }

    // Check if the correct answer is selected
    if (correctAnswer === null || correctAnswer === undefined) {
      // Display an error message or take appropriate action
      toast.error("Please select the correct answer");
      return; // Stop further execution
    }

    // Create a new question object with the collected data
    const newQuestion = {
      ...questionData,
      options:
        currentQuestionType === "Yes/No" ? ["Yes", "No"] : questionData.options,
      correctAnswer: correctAnswer,
      selectedTournamentId,
      imageUrl: quizImage,
      question: question,
      type: currentQuestionType,
      // emoji: selectedEmoji,
      imageId: questionImageId,
      previewUrl: questionImage,
    };

    // Log the new question object
    console.log(newQuestion);

    questionSave(newQuestion);
// @ts-ignore

    setQuestionDataByTournmentId((prevQuestionList) => [
      // @ts-ignore
      ...prevQuestionList,
      newQuestion,
    ]);

    // Reset the state or perform other actions as needed
    setQuestionData({
      question: "",
      type: "",
      options: [],
    });

    // Close the modal or handle other UI changes
    setIsModalOpen(false);
  };

  // //// for creating question ..///
  const questionSave = async (data: any) => {
    const storeService = new StoreTournmentDataService();
    console.log(data);
    try {
      const response = await storeService.createQuestions(data);
      console.log(response);
      if (response) {
        toast.success("Question created successfully");
      } else {
        toast.error("Error in creating Question");
      }
    } catch (error) {
      console.log("questionSave failed:", error);
    }
  };

  const handleOptionChange = (
    optionIndex: number,
    optionValue: string
  ): void => {
    const updatedOptions = [...(questionData.options as string[])]; // Type assertion

    updatedOptions[optionIndex] = optionValue;
// @ts-ignore

    setQuestionData((prevData) => ({
      ...prevData,
      options: updatedOptions,
    }));
  };

  const handleTournamentChange = async (e: { target: { value: any; }; }) => {
    const selectedValue = e.target.value;
    const [selectedId, selectedName] = selectedValue.split("|");
    setSelectedTournamentId(selectedId);
    setFormData({
      ...formData,
      selectedTournamentId: selectedId,
      selectedTournamentName: selectedName,
    });
    setQuestionData({
      ...questionData,
// @ts-ignore

      selectedTournamentId: selectedId,
    });

    /// getting question data by tournmanet id ..///
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.getAllQuestionByTournmentId(
        selectedId
      );
      console.log(response);
// @ts-ignore

      setQuestionDataByTournmentId(response?.documents);
    } catch (error) {
      console.log("Error in gettAllquestion by Id", error);
    }
  };

  const getallquestion = async () => {
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.getAllQuestions();
      console.log(response);
// @ts-ignore

      setAllquestions(response);
    } catch (error) {
      console.log("Error in getting all question API", error);
    }
  };

  useEffect(() => {
    getallquestion();
  }, []);

  useEffect(() => {
    const fetchTournaments = async () => {
      const storeService = new StoreTournmentDataService();
      try {
        const tournamentsData = await storeService.getAllTournaments();
// @ts-ignore

        setTournamentOptions(tournamentsData);
        console.log(tournamentsData);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);
  //reset form data ..//


  const resetFormData = () => {
    // @ts-ignore
    setFormData({
      
      quizName: "",
      colorSelect: "",
      startDate: "",
      endDate: "",
      basePoints: 0,
      timePerQuestion: 0,
      selectedTournamentId: "",
      selectedTournamentName: "",
      quizImageURL: "",
      quizImageId: "",
      questions: [],
    });
  };
  //// for getting  data from input fields
  const handleInputChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  ////  submit quiz form for creating quiz ..//
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(formData);
    if (
      !formData.quizName ||
      !formData.colorSelect ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.basePoints ||
      !formData.timePerQuestion ||
      !formData.selectedTournamentId
    ) {
      toast.error("Please fill in all the fields before creating Quiz.");
      return;
    }

    const selectedTournament: Tournament | undefined = tournamentOptions.find(
      // @ts-ignore
      (tournament) => tournament?.$id === selectedTournamentId
    );
    if (!selectedTournament) {
      // Handle the case when selectedTournament is undefined
    }
    console.error("Selected tournament is undefined.");

    // Check if the selected dates are within the tournament start and end dates
// @ts-ignore

    const startDate = new Date(selectedTournament.startDate);
// @ts-ignore

    const endDate = new Date(selectedTournament.endDate);
    const quizStartDate = new Date(formData.startDate);
    const quizEndDate = new Date(formData.endDate);

    if (quizStartDate < startDate || quizEndDate > endDate) {
      toast.error(
        "Quiz dates must be within the start and end dates of the selected tournament."
      );
      return;
    }

    try {
      const storeService = new StoreTournmentDataService();

      const questionsForTournament =
        await storeService.getAllQuestionsByTournamentId(selectedTournamentId);
      if (questionsForTournament?.documents.length === 0) {
        toast.error("please add atleast one question");
        return;
      }
      console.log(questionsForTournament?.documents);

      // Create the quiz object with tournament details and fetched questions
      const quizObject = {
        tournamentId: selectedTournamentId,
        quizName: formData.quizName,
        colorSelect: formData.colorSelect,
        startDate: formData.startDate,
        endDate: formData.endDate,
        basePoints: formData.basePoints,
        timePerQuestion: formData.timePerQuestion,
        questions: questionsForTournament?.documents, // Ensure questions are properly set here
        tournmentName: formData.selectedTournamentName,
// @ts-ignore

        quizImageUrl: quizImageUrl?.href,
        quizImageId: quizImageId,
        pointsPerSeconds: formData.pointsPerSeconds,
      };

      console.log(quizObject);

      // Store the quiz data on Appwrite
// @ts-ignore

      const response = await storeService.createQuiz(quizObject);
      console.log(response);

        if (response) {
          toast.success("Quiz created successfully");
          resetFormData();
          router.push("/dashboard/allquiz");
        }
    } catch (error) {
      console.error("Error in creating quiz", error);
    }
  };

  /// questions image upload ..//
  const questionsimageUpload = async (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];
    const storeService = new StoreTournmentDataService();
    if (!selectedTournamentId) {
      toast.error("Please select a tournament before adding a question");
      return;
    }
    try {
      const response = await storeService.quizFileUpload(file);
      if (response) {
        setquestionImageId(response?.$id);
        const imagUrl = await storeService.quizImagePreview(response.$id);
        console.log(imagUrl?.href);
        if (imagUrl) {
          setQuizImage(imagUrl.href);
          setQuestionImage(imagUrl.href);
        }
        setquizImageId(response.$id);

        toast.success("image upload success");
      } else {
        toast.error("image upload error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /// Quiz image upload ..//
  const quizImageUpload = async (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];
    const storeService = new StoreTournmentDataService();
    if (!selectedTournamentId) {
      toast.error("Please select a tournament before adding a question");
      return;
    }
    try {
      const response = await storeService.quizFileUpload(file);
      if (response) {
        const imagUrl = await storeService.quizImagePreview(response.$id);

        if (imagUrl) {
// @ts-ignore

          setQuizImageUrl(imagUrl);
        }
        setquizImageId(response.$id);

        toast.success("image upload success");
      } else {
        toast.error("image upload error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // for deleting the question ..//
// @ts-ignore

  const handleDelete = async (id, imageId) => {
    console.log(id);
    console.log(imageId);
    const storeService = new StoreTournmentDataService();
    try {
      if (imageId) {
        const imagDelete = await storeService.deleteImage(imageId);
        console.log(imagDelete);
      }
      const response = await storeService.deleteQuestion(id);
      if (response) {
        setQuestionDataByTournmentId((prevData) =>
// @ts-ignore

          prevData.filter((question) => question.$id !== id)
        );
        toast.success("Question deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const availableColors = [
    "#52099B",
    "#7712DB",
    "#FCC025",
    "#c43ad6",
    "#d6af3a",
    "#3ad0d6",
  ];
  return (
    <div className="col-span-12">
      <div className="max-w-full bg-green-800 rounded-md text-white text-lg font-semibold p-4">
        Create Quiz
      </div>

      <div className="p-4 bg-white rounded-md shadow-md mb-4">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tournamentSelect"
              className="block text-sm font-medium text-gray-700"
            >
              Select Tournament
            </label>
            <select
              id="tournamentSelect"
              value={`${selectedTournamentId}|${formData.selectedTournamentId}`}
              onChange={handleTournamentChange}
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
            >
              {/* Placeholder option */}
              <option value="">Select a tournament</option>
              {selectedTournamentId && formData.selectedTournamentId && (
                <option
                  key={`${selectedTournamentId}|${formData.selectedTournamentId}`}
                  value={`${selectedTournamentId}|${formData.selectedTournamentId}`}
                >
                  {formData.selectedTournamentName}
                </option>
              )}
              {tournamentOptions.map((tournament: Tournament) => (
                <option
                  key={tournament?.$id}
                  value={`${tournament?.$id}|${tournament.title}`}
                >
                  {tournament.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label
              htmlFor="formFile"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image for Quiz
            </label>
            <input
              type="file"
// @ts-ignore

              onChange={quizImageUpload}
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="inputField1"
              className="block text-sm font-medium text-gray-700"
            >
              Quiz Name
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="quizName"
                value={formData.quizName}
                onChange={handleInputChange}
                placeholder="Enter Quiz Name"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Select color
            </label>
            <div className="flex items-center">
              {availableColors.map((color, index) => (
                <div
                  key={index}
// @ts-ignore

                  onClick={() => handleColorSelection(color, index)}
                  className={`rounded-full border-3 p-1 focus:outline-none ${
                    color === selectedColor ? "border-black" : "border-white"
                  }`}
                  style={{
                    backgroundColor: color,
                    width: "30px",
                    border: `3px solid ${
                      color === selectedColor ? "black" : "white"
                    }`,
                    height: "30px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="inputField3"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              placeholder="Select Start Date"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="inputField4"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              placeholder="Select End Date"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="inputField6"
              className="block text-sm font-medium text-gray-700"
            >
              Base Points
            </label>
            <input
              type="number"
              id="basePoints"
              value={formData.basePoints}
              onChange={handleInputChange}
              placeholder="Enter Base points"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="inputField6"
              className="block text-sm font-medium text-gray-700"
            >
              Points Per Seconds
            </label>
            <input
              type="number"
              id="pointsPerSeconds"
              value={formData.pointsPerSeconds}
              onChange={handleInputChange}
              placeholder="Enter points per seconds"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="inputField7"
              className="block text-sm font-medium text-gray-700"
            >
              Time per Question
            </label>
            <input
              type="number"
              id="timePerQuestion"
              value={formData.timePerQuestion}
              onChange={handleInputChange}
              placeholder="Enter Time Per Question"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 focus:outline-none"
              onClick={handleAddQuestions} // Add your function for handling adding questions
            >
              Add Questions
            </button>
            <button
              type="submit"
              className="bg-green-800 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal content */}
              <form className="space-y-6 p-6">
                <div className="max-w-full bg-green-800 rounded-md text-white text-lg font-semibold p-4">
                  Add Question
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="question1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Question
                  </label>
                  <input
                    type="text"
                    id="question1"
                    placeholder="Enter Question 1"
                    onChange={(e) => setQuestion(e.target.value)}
                    className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="emoji"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Choose Emoji
                  </label>
                  <Picker
                    reactionsDefaultOpen={true}
                    onEmojiClick={handleEmojiSelect}
                    height={300}
                    width={460}
                  />
                  {selectedEmoji && (
                    <div>


                      {/* <p>Selected Emoji: {selectedEmoji?.emoji}</p> */}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="formFile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Image for Question
                  </label>
                  <input
                    type="file"
// @ts-ignore

                    onChange={questionsimageUpload}
                    className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="questionType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Question Type
                  </label>
                  <select
                    value={currentQuestionType}
                    onChange={(e) => handleQuestionTypeChange(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                  >
                    <option disabled>Select question type</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Yes/No">Yes/No</option>
                  </select>
                </div>
                {currentQuestionType === "Yes/No" ? (
                  <>
                    <div className="mb-3">
                      <label
                        htmlFor="optionYes"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Option Yes
                      </label>
                      <input
                        type="text"
                        id="optionYes"
                        placeholder="Enter Option Yes"
                        className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="optionNo"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Option No
                      </label>
                      <input
                        type="text"
                        id="optionNo"
                        placeholder="Enter Option No"
                        className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-3 flex items-center">
                      <label className="block text-2xl font-medium text-gray-700">
                        Select Answer:
                      </label>
                      <div className="ml-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio size-6"
                            name="answer"
                            value="yes"
                          />
                          <span className="ml-2  text-3xl">Yes</span>
                        </label>
                        <label className="inline-flex items-center ml-4">
                          <input
                            type="radio"
                            className="form-radio size-6"
                            name="answer"
                            value="no"
                          />
                          <span className="ml-2 text-3xl">No</span>
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {questionData.options.map((option, index) => (
                      <div key={index} className="mb-3 flex items-center">
                        <input
                          type="text"
                          id={`option${index + 1}`}
                          placeholder={`Enter Option ${index + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="radio"
                          id={`option${index + 1}`}
                          name="options"
                          className="ms-2 size-10"
                          // Handle radio button logic as needed
                        />
                        <MdDelete
                          color="red"
                          className="text-4xl ms-3"
                          onClick={() => handleRemoveOption(index)}
                        />
                      </div>
                    ))}
                  </>
                )}

                {questionData.options.length < 4 &&
                  (currentQuestionType === "Yes/No" ? (
                    ""
                  ) : (
                    <button
                      type="button"
                      className="bg-green-800 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none"
                      onClick={handleAddOption}
                    >
                      Add Option
                    </button>
                  ))}

                <div className="flex justify-end items-center space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white p-3 ms-3 rounded-md hover:bg-gray-600 focus:outline-none"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSaveQuestion(e)}
                    className="bg-green-800 text-white p-3 ms-3 rounded-md hover:bg-green-700 focus:outline-none"
                  >
                    Add Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-green-800 rounded-lg text-white">
            <tr>
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Question</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b"></th>

              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            
            {
            // @ts-ignore
            questionDataByTournmentId?.map((question, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{question?.question}</td>
                <td className="py-2 px-4 border-b">{question?.type}</td>
                <td className="py-2 px-4 border-b">
                  {question?.imageUrl ? (
                    <Image
                      src={question?.imageUrl}
                      width={50}
                      height={50}
                      alt={`Image for question ${index + 1}`}
                      className="max-w-full h-auto"
                    />
                  ) : (
                    "This question has no image"
                  )}
                </td>
                <td className="py-2 px-4 border-b"></td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-full"
                    onClick={() =>
                      handleDelete(question.$id, question?.imageId)
                    } // Add your delete function and pass the appropriate ID
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
