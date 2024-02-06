"use client";
import { StoreTournmentDataService } from "@/appwrite/appwriteService";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
interface FormData {
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  $id: string;
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

const Page = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "",
    startDate: "",
    endDate: "",
    firstPrize: "",
    secondPrize: "",
    thirdPrize: "",
    $id: "",
  });
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament>();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    if (id === "type") {
      setSelectedType(value);
    }
  };

  // on Form submit tournment created
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.type ||
      !formData.startDate ||
      !formData.endDate
    ) {
      // Display an error message or handle the validation error appropriately
      toast.error("Please fill in all required fields.", { position: "top-center" });
      return;
    }
  
    if (formData.type === 'contest' && !formData.firstPrize) {
      // Display an error message if the type is 'contest' and no first prize is provided
      toast.error("Please enter at least the first prize for a contest.", { position: "top-center" });
      return;
    }
  
    // Check if the selected start and end date already exist in another tournament
    const overlappingTournament = tournaments.find(
      (tournament) =>
        (formData.startDate >= tournament.startDate &&
          formData.startDate <= tournament.endDate) ||
        (formData.endDate >= tournament.startDate &&
          formData.endDate <= tournament.endDate) ||
        (formData.startDate <= tournament.startDate &&
          formData.endDate >= tournament.endDate)
    );
  
    if (overlappingTournament) {
      toast.error(
        "Please select another date. Tournament already exists in this time span."
      );
      return;
    }
  
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.createTournment(formData);
      console.log(response);
      // Function for fetching all tournaments data
      fetchTournaments();
      if (response) {
        toast.success("Tournament created successfully", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error while creating tournament", error);
    }
    
    // Reset form data
    setFormData({
      title: "",
      type: "",
      firstPrize: "",
      secondPrize: "",
      thirdPrize: "",
      startDate: "",
      endDate: "",
      $id: "",
    });
  };
  

  ///fetching all tournments/..////
  const fetchTournaments = async () => {
    const storeService = new StoreTournmentDataService();
    try {
      const tournamentsData = await storeService.getAllTournaments();
      // Assuming tournamentsData is an array of objects, adjust as needed
      const mappedTournaments: Tournament[] = tournamentsData.map((item) => ({
        $id: item.$id, // replace with actual ID property
        title: item.title,
        type: item.type,
        firstPrize: item.firstPrize,
        secondPrize: item.secondPrize,
        thirdPrize: item.thirdPrize,
        startDate: item.startDate,
        endDate: item.endDate,
      }));

      setTournaments(mappedTournaments);
      console.log(mappedTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  // for deleting tournments...//
  const handleDelete = async (tournamentId: string) => {
    const storeService = new StoreTournmentDataService();
    console.log(tournamentId);

    try {
      const response = await storeService.getQuizByTournmentId(tournamentId);
      console.log(response);

      if (response && response.length > 0) {
        toast.error(
          "Quiz is created with this tournament, you cannot delete this tournament"
        );
        return;
      }

      await storeService.deleteTournament(tournamentId);
      fetchTournaments();
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }
  };

  /// for updating tournments ..//
  const handleUpdate = async (tournamentId: string) => {
    console.log(tournamentId);
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.getTournamentById(tournamentId);

      // Use optional chaining and set a default value for documents
      const documents = response?.documents || [];

      console.log(documents);

      // Assuming that documents is an array
      // @ts-ignore
      setSelectedTournament(documents.length > 0 ? documents[0] : null);
      setModalOpen(true); // Open the modal
    } catch (error) {
      console.log("Update tournament error", error);
    }
  };

  //upDate tournments ..///
  // for update tournment..////////////////////////////////
  const handleTournmentUpdate = async () => {
    const storeService = new StoreTournmentDataService();
    try {
      console.log(selectedTournament);
      // @ts-ignore
      const response = await storeService.updateTournment(selectedTournament);
      if (response) {
        closeModal();
        fetchTournaments();
        toast.success("tournament Updated successfully", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("error while updating tournament", error);
      toast.error("error while updating tournament", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <div className="col-span-12">
      <div className="max-w-full bg-green-800 rounded-md text-white text-lg font-semibold p-4">
        Create Tournaments
      </div>
      <div className="max-w-full bg-white border rounded-md overflow-hidden shadow-md">
        <div className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Name (topic/description)
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter something..."
                onChange={handleInputChange}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <select
                id="type"
                onChange={handleInputChange}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              >
                <option value="">Select an option</option>
                <option value="free">Free</option>
                <option value="contest">Contest</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                type="date"
                onChange={handleInputChange}
                id="startDate"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                onChange={handleInputChange}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              />
            </div>

            {selectedType !== "free" && (
              <div className="container">
                <div className="text-center">
                  <h2 className="text-4xl font-semibold mb-4">Prizes</h2>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="firstPrize"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Prize
                  </label>
                  <input
                    type="text"
                    id="firstPrize"
                    onChange={handleInputChange}
                    placeholder="Enter First Prize"
                    className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="secondPrize"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Second Prize
                  </label>
                  <input
                    type="text"
                    id="secondPrize"
                    onChange={handleInputChange}
                    placeholder="Enter Second Prize"
                    className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="thirdPrize"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Third Prize
                  </label>
                  <input
                    type="text"
                    id="thirdPrize"
                    onChange={handleInputChange}
                    placeholder="Enter Third Prize"
                    className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-green-800 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none"
              >
                Create Tournament
              </button>
            </div>
          </form>
        </div>
      </div>

      <>
        {/* Modal */}
        {isModalOpen && selectedTournament && (
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
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your question here"
                      value={selectedTournament?.title || ''}
                      onChange={(e) =>
                        setSelectedTournament({
                          ...selectedTournament,
                          title: e.target.value,
                        })
                      }
                      className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type
                    </label>
                    <select
                      onChange={(e) =>
                        setSelectedTournament({
                          ...selectedTournament,
                          type: e.target.value,
                        })
                      }
                      className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                    >
                      <option disabled>Select Type</option>
                      <option>free</option>
                      <option>contest</option>
                    </select>
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
                      value={selectedTournament?.startDate || ''}
                      onChange={(e) =>
                        setSelectedTournament({
                          ...selectedTournament,
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
                      value={selectedTournament?.endDate || ''}
                      onChange={(e) =>
                        setSelectedTournament({
                          ...selectedTournament,
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
                      First Prize
                    </label>
                    <input
                      type="text"
                      //  placeholder="Enter your question here"
                      value={selectedTournament?.firstPrize || ''}
                      onChange={(e) =>
                        setSelectedTournament({
                          ...selectedTournament,
                          firstPrize: e.target.value,
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
                      Second Prize
                    </label>
                    <input
                      type="text"
                      //  placeholder="Enter your question here"
                      value={selectedTournament?.secondPrize || ''}
                      onChange={(e) =>
                        setSelectedTournament({
                          ...selectedTournament,
                          secondPrize: e.target.value,
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
                      Third Prize
                    </label>
                    <input
                      type="text"
                      //  placeholder="Enter your question here"
                      value={selectedTournament?.thirdPrize || ''}
                      onChange={(e) =>
                        setSelectedTournament({
                          ...selectedTournament,
                          thirdPrize: e.target.value,
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
                      onClick={handleTournmentUpdate}
                      className="bg-green-800 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none"
                    >
                      Update tournment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>

      <div className="container mt-2">
        <table className="min-w-full border rounded-lg border-gray-300  overflow-hidden">
          <thead className="bg-green-800 text-white rounded-lg">
            <tr>
              <th className="py-2 px-4"> # </th>
              <th className="py-2 px-4"> Title </th>
              <th className="py-2 px-4"> Type </th>
              <th className="py-2 px-4"> First Prize </th>
              <th className="py-2 px-4"> Second Prize </th>
              <th className="py-2 px-4"> Third Prize </th>
              <th className="py-2 px-4"> S-Date </th>
              <th className="py-2 px-4"> E-Date </th>
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((tournament: Tournament, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{tournament.title}</td>
                <td className="py-2 px-4">{tournament.type}</td>
                <td className="py-2 px-4">{tournament.firstPrize}</td>
                <td className="py-2 px-4">{tournament.secondPrize}</td>
                <td className="py-2 px-4">{tournament.thirdPrize}</td>
                <td className="py-2 px-4">{tournament.startDate}</td>
                <td className="py-2 px-4">{tournament.endDate}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none"
                    onClick={() => handleUpdate(tournament.$id)}
                  >
                    Update
                  </button>
                </td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none"
                    onClick={() => {
                      handleDelete(tournament.$id);
                    }}
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
