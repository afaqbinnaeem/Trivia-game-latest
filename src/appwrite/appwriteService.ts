import { MdDelete } from "react-icons/md";
import {
  Client,
  Databases,
  ID,
  Query,
  QueryTypesList,
  Storage,
} from "appwrite";
interface TournamentCreationParams {
  $id: string;
  title: string;
  type: string;
  firstPrize: string;
  secondPrize?: string;
  thirdPrize?: string;
  startDate: string;
  endDate: string;
}
interface CreateQuizParams {
  quizId: string;
  tournamentId: string;
  quizName: string;
  colorSelect: string;
  startDate: string;
  endDate: string;
  basePoints: number;
  timePerQuestion: number;
  questions: QuestionData[];
  tournmentName: string;
  quizImageUrl: string;
  quizImageId: string;
  pointsPerSeconds: string;
  fontStyle: string;
}
interface QuestionData {
  question: string;
  image: File | null;
  type: string;
  options: string[];
}

interface CreateQuestionsParams {
  correctAnswer: string;
  options: string[];
  type: string;
  imageUrl: string;
  selectedTournamentId: string;
  question: string;
  imageId: string;
}
interface UserPlayedInfo {
  userId: string;
  userEmail: string;
  quizPlayed: boolean;
  quizId: string;
  quizName: string;
  score: number;
}

export class StoreTournmentDataService {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client
      .setEndpoint(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`)
      .setProject(`${process.env.NEXT_PUBLIC_PROJECTID}`);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  ///// creating tournment ..///
  async createTournment({
    title,
    type,
    firstPrize,
    secondPrize,
    thirdPrize,
    startDate,
    endDate,
  }: TournamentCreationParams) {
    try {
      console.log(title, type, firstPrize, secondPrize, thirdPrize);

      let documentData: any = {
        title: title,
        type: type,
        startDate: startDate,
        endDate: endDate,
      };

      // Check if the type is 'contest' and at least first prize is provided
      if (type === "contest" && firstPrize) {
        documentData = {
          ...documentData,
          firstPrize: firstPrize,
          ...(secondPrize && { secondPrize: secondPrize }),
          ...(thirdPrize && { thirdPrize: thirdPrize }),
        };
      } else if (type === "free") {
        // If type is 'free', exclude prizes
      } else {
        // Handle other cases or throw an error for invalid types
        throw new Error("Invalid tournament type");
      }

      return await this.databases.createDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_TOURNMENT_COLLECTION_ID}`,
        ID.unique(),
        documentData
      );
    } catch (error) {
      console.log("Appwrite service :: createTournment :: error", error);
    }
  }

  //// fetching all tournments ..//
  async getAllTournaments() {
    try {
      const response = await this.databases.listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_TOURNMENT_COLLECTION_ID}`
      );
      console.log(response.documents);
      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: getAllTournaments :: error", error);
      return [];
    }
  }

  /// FOR delete tournament acoording to ID...//
  async deleteTournament(tournamentId: string) {
    console.log(tournamentId);
    try {
      return await this.databases.deleteDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_TOURNMENT_COLLECTION_ID}`,
        tournamentId
      );
    } catch (error) {
      console.log("Appwrite service :: deleteTournment :: error", error);
    }
  }

  async getTournamentById(tournamentId: string) {
    try {
      const singleTournment = await this.databases.listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_TOURNMENT_COLLECTION_ID}`,
        [Query.equal("$id", tournamentId)]
      );

      return singleTournment;
    } catch (error) {
      console.log("Appwrite service :: deleteTournment :: error", error);
    }
  }

  /// update tournment by id ..//
  async updateTournment({
    title,
    type,
    firstPrize,
    secondPrize,
    thirdPrize,
    $id,
    startDate,
    endDate,
  }: TournamentCreationParams) {
    try {
      return await this.databases.updateDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_TOURNMENT_COLLECTION_ID}`,
        $id,
        {
          title,
          type,
          firstPrize,
          secondPrize,
          thirdPrize,
          startDate,
          endDate,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updateTournment :: error", error);
    }
  }

  /// image upload //..//
  async quizFileUpload(file: any) {
    try {
      return await this.bucket.createFile(
        `${process.env.NEXT_PUBLIC_BUCKET_ID}`,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
    }
  }

  /// preview image url ../
  async quizImagePreview(imageId: any) {
    try {
      return await this.bucket.getFilePreview(
        `${process.env.NEXT_PUBLIC_BUCKET_ID}`,
        imageId
      );
    } catch (error) {
      console.log("Appwrite service :: Image preview :: error", error);
    }
  }

  //// creating quiz ...//
  async createQuiz({
    tournamentId,
    quizName,
    colorSelect,
    startDate,
    endDate,
    basePoints,
    timePerQuestion,
    questions,
    tournmentName,
    quizImageUrl,
    quizImageId,
    pointsPerSeconds,
    fontStyle,
  }: CreateQuizParams) {
    try {
      console.log(pointsPerSeconds);

      // if (questions?.documents.length == 0) {
      //   return false
      // }
      const document = await this.databases.createDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_COLLECTION_ID}`,
        ID.unique(),
        {
          tournamentId: tournamentId,
          questions: JSON.stringify(questions),
          quizName: quizName,
          colorSelect: colorSelect,
          startDate: startDate,
          endDate: endDate,
          basePoints: basePoints,
          timePerQuestion: timePerQuestion,
          tournmentName: tournmentName,
          quizImageURL: quizImageUrl,
          quizImageId: quizImageId,
          pointsPerSeconds: pointsPerSeconds,
          fontStyle: fontStyle,
        }
      );

      return document;
    } catch (error) {
      console.log("Appwrite service createQuiz:", error);
    }
  }

  ////getting all questions thats have same tournaments ID ...///

  async getAllQuestionsByTournamentId(
    selectedTournamentId: string | number | boolean | QueryTypesList
  ) {
    try {
      const response = await this.databases.listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_QUESTIONS_ID}`,
        [Query.equal("selectedTournamentId", selectedTournamentId)]
      );

      return response;
    } catch (error) {
      console.log("Appwrite service getAllQuestionsAgainstTournmentId:", error);
    }
  }

  /// getting all quizes data ..//
  async allQuizesData() {
    try {
      const response = await this.databases.listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_COLLECTION_ID}`
      );
      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: allQuizesData :: error", error);
    }
  }

  /////  get single quiz by id  ..///
  async getQuizById(id: string) {
    try {
      const response = await this.databases.getDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_COLLECTION_ID}`,
        id
      );
      return response;
    } catch (error) {
      console.log("Appwrite service updateQuiz:", error);
    }
  }

  async deleteQuiz(id: string) {
    try {
      console.log(id);
      return await this.databases.deleteDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_COLLECTION_ID}`,
        id
      );
    } catch (error) {
      console.log("Appwrite service :: deleteQuiz :: error", error);
    }
  }

  //// delete quiz image because its bucket is saperate ..//
  async deleteQuizImage(imageId: string) {
    try {
      if (imageId) {
        await this.bucket.deleteFile(
          `${process.env.NEXT_PUBLIC_QUIZ_BUCKET_ID}`,
          imageId
        );
        return true;
      }
      return;
    } catch (error) {
      console.log("Appwrite service :: deleteImage :: error", error);
    }
  }

  /// get single tournament data according to Id

  // async getTournamentById(tournmentId: string | number | boolean | QueryTypesList) {
  //   try {
  //     const singleTournment = await this.databases.listDocuments(
  //       `${process.env.NEXT_PUBLIC_DATABASEID}`,
  //       `${process.env.NEXT_PUBLIC_TOURNMENT_COLLECTION_ID}`,
  //       [Query.equal('$id', tournmentId)],
  //     )

  //     return singleTournment
  //   } catch (error) {
  //     console.log('Appwrite service :: deleteTournment :: error', error)
  //   }
  // }

  /////  update quiz  ..///
  async updateQuiz({
    quizName,
    colorSelect,
    startDate,
    endDate,
    basePoints,
    timePerQuestion,
    questions,
    quizId,
  }: CreateQuizParams) {
    try {
      const response = await this.databases.updateDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_COLLECTION_ID}`,
        quizId,
        {
          quizName,
          colorSelect,
          startDate,
          endDate,
          basePoints,
          timePerQuestion,
          questions,
        }
      );
      return response;
    } catch (error) {
      console.log("Appwrite service updateQuiz:", error);
    }
  }

  // get all quizes that have same tournment id..//
  async getAllquizById(tournmentId: string) {
    try {
      const allMatchedQuizes = await this.databases.listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_COLLECTION_ID}`,
        [Query.equal("tournamentId", tournmentId)]
      );

      return allMatchedQuizes;
    } catch (error) {
      console.log("Appwrite service :: getAllquizById :: error", error);
    }
  }

  async getSingleQuizById(id: string) {
    try {
      console.log(id);
      const response = await this.databases.getDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_COLLECTION_ID}`,
        id
      );
      return response;
    } catch (error) {
      console.log("Appwrite service :: getSingleQuizById :: error");
    }
  }

  async createQuestions({
    options,
    type,
    question,
    selectedTournamentId,
    correctAnswer,
    imageUrl,
    imageId,
  }: CreateQuestionsParams) {
    // console.log( emoji)
    try {
      const document = await this.databases.createDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_QUESTIONS_ID}`,
        ID.unique(),
        {
          options: options ? JSON.stringify(options) : "",
          type,
          question,
          selectedTournamentId,
          correctAnswer,
          ...(imageUrl && { imageUrl }),
          ...(imageId && { imageId }),
        }
      );
      return document;
    } catch (error) {
      console.log("Appwrite service :: createQuestions :: error", error);
      throw error;
    }
  }

  async getAllQuestions() {
    try {
      const response = await this.databases.listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_QUESTIONS_ID}`
      );

      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: getAllQuestions :: error", error);
    }
  }

  /// gett all question according to tournment Id ../

  async getAllQuestionByTournmentId(selectedTournamentId: string) {
    console.log(selectedTournamentId);
    try {
      const response = await this.databases.listDocuments(
        "6596481ab83bb47fccee",
        "659bdef6aa6067f12fec",
        [Query.equal("selectedTournamentId", selectedTournamentId)]
      );
      return response;
    } catch (error) {
      console.log("Appwrite service :: getAllQuestion :: error", error);
    }
  }

  /// Delte Question//
  async deleteQuestion(id: string) {
    try {
      return await this.databases.deleteDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_QUESTIONS_ID}`,
        id
      );
    } catch (error) {
      console.log("Appwrite service :: deleteQuestion :: error", error);
    }
  }

  /////Delete image ..//
  async deleteImage(id: string) {
    try {
      await this.bucket.deleteFile(
        `${process.env.NEXT_PUBLIC_QUIZ_BUCKET_ID}`,
        id
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteImage :: error", error);
    }
  }

  // gett quiz that have tournment id ..//

  async getQuizByTournmentId(id: string) {
    try {
      console.log(id);
      const response = await this.databases.listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_QUIZ_COLLECTION_ID}`,
        [Query.equal("tournamentId", id)]
      );
      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: getQuizByTournmentId :: error");
    }
  }

  //// creating user info who played quiz

  async saveUserPlayedInfo(
    userId: string,
    userEmail: string,
    quizPlayed: boolean,
    quizId: string,
    quizName: string,
    score: number
  ): Promise<UserPlayedInfo | undefined> {
    try {
      console.log("userId:", userId);
      console.log("userEmail:", userEmail);
      console.log("quizName:", quizName);
      console.log("quizId:", quizId);
      console.log("score:", score);
      console.log("quizPlayed:", quizPlayed);

      const response = await this.databases.createDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_USER_HISTORY_COLLECTION}`,
        ID.unique(),
        {
          userId,
          quizId,
          quizPlayed,
          quizName,
          score,
          userEmail,
        }
      );

      return response.documents as UserPlayedInfo;
    } catch (error) {
      console.log("Appwrite service :: saveUserPlayedInfo :: error", error);
      return undefined;
    }
  }

  async getAllUsers() {
    try {
      const response = await this.databases.listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_USER_HISTORY_COLLECTION}`
      );
      return response.documents;
    } catch (error) {
      console.log("AppWriteService :: getAllUsers :: Error", error);
    }
  }

  // getting single user according to user Id ..//
  async getAllUsersById(userId: string) {
    try {
      console.log(userId, "hyper");

      const response = await this.databases.listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_USER_HISTORY_COLLECTION}`,
        [Query.equal("userId", userId)]
      );
      return response.documents;
    } catch (error) {
      console.log("AppWriteService :: getAllUsers :: Error", error);
    }
  }

  async getQuizsPlayedByUser(quizId: string) {
    try {
      console.log(quizId);
      const response = await this.databases.listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${process.env.NEXT_PUBLIC_USER_HISTORY_COLLECTION}`,
        [Query.equal("quizId", quizId)]
      );
      console.log(response);

      return response.documents;
    } catch (error) {
      console.log("AppWriteService :: getQuizsPlayedByUser :: Error", error);
    }
  }
}
