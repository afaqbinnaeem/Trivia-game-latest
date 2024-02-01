'use client'
import React, { useState } from 'react';
import avatar from '../assets/images/avatar-1.png';
import av2 from '@/assets/images/av2.png';
import av3 from '@/assets/images/av2.png';
import av4 from '@/assets/images/av2.png';
import av5 from '@/assets/images/av2.png';
// import authService from '../services/appwriteConfig';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Image from 'next/image';

const Tabs: React.FC = () => {
//   const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tab1');
  const [selectedAvatar, setSelectedAvatar] = useState(av5);
  const [showModel, setShowModel] = useState(true);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
  });

  const handleAvatarSelection = (avatarSrc: string) => {
    // @ts-ignore
    setSelectedAvatar(avatarSrc);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

//     try {
//       // Call authService signup method
//       await authService.signup(userDetails.email, userDetails.name);

//       toast.success('User Register successfully!');
//       navigate('/login');
//     } catch (error) {
//       console.error('signup failed:', error);
//     }
//   };
  }

  const tabStyle = (tabName: string) => ({
    borderBottom: activeTab === tabName ? '2px solid #DC432B' : '',
    color: activeTab === tabName ? '#DC432B' : '',
    cursor: 'pointer',
    padding: '10px',
  });

  return (
    <div className="mt-3">
      <div className="flex justify-around">
        <button
          className="tabOne"
          style={tabStyle('tab1')}
          onClick={() => setActiveTab('tab1')}
        >
          info
        </button>
        <button
          className="tabOne"
          style={tabStyle('tab2')}
          onClick={() => setActiveTab('tab2')}
        >
          History
        </button>
      </div>

      {activeTab === 'tab1' && (
        <div>
          <div className="container mt-3">
            <form>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label navLabel ps-3">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control navInput"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="alex1992#@gmail.com"
                  onChange={(e) => {
                    setUserDetails({ ...userDetails, email: e.target.value });
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label navLabel ps-3">
                  Nickname
                </label>
                <input
                  type="name"
                  className="form-control navInput"
                  id="exampleInputPassword1"
                  placeholder="Alex 1992#"
                  onChange={(e) => {
                    setUserDetails({ ...userDetails, name: e.target.value });
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label navLabel ps-3">
                  Avatar
                </label>
                <br />
                {selectedAvatar && (
                  <div
                    className="m-auto flex justify-center"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <Image src={selectedAvatar} alt="selectedAvatar " />
                  </div>
                )}
              </div>
              <div className="sbButton flex justify-center mt-5">
                
                <button type="submit" className="loginButton" onClick={
                  // @ts-ignore
                  (e) => handleSignup(e)}>
                  SAVE
                </button>
              </div>

              {/* Modal */}
              {showModel && (
                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content br40">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel"></h1>
                        {/* close button */}
                        <button
                          type="button"
                          className="btn-close pe-5"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body navScroll">
                        <div className="grid grid-cols-3 gap-4">
                          {[av2, av3, av5, av4, av3, av2, av3, av5, av4, av2, av3, av4].map(
                            (avatar, index) => (
                              <Image
                                key={index}
                                className="avImage"
                                src={avatar}
                                alt=""
                                // @ts-ignore
                                onClick={() => handleAvatarSelection(avatar)}
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {activeTab === 'tab2' && <div>Content of Tab 2</div>}
    </div>
  );
};


export default Tabs;
