"use client";
import { StoreTournmentDataService } from "@/appwrite/appwriteService";
import authService from "@/appwrite/authAppwriteService";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [users, setUsers] = useState<Document[]>([]);

  const getAllUsers = async () => {
    const storeService = new StoreTournmentDataService();
    try {
      const response = await storeService.getAllUsers();
      // const response = await authService.allUsers();
      console.log(response);
      if (response) {
        // @ts-ignore
        setUsers(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border-b p-2">No.</th>
            <th className="border-b p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className="border-b p-2 text-center">{index + 1}</td>

              <td className="border-b p-2 text-center">
                {
                  // @ts-ignore
                  user?.userEmail
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
