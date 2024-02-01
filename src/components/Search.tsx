'use client'
import React, { useState } from 'react';
import searchIcon from '@/assets/images/search.png'
import Image from 'next/image';

const SearchComponent: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => setShowSearch(!showSearch);

  const searchBoxStyle = {
    width: showSearch ? '183px' : '0',
    opacity: showSearch ? 1 : 0,
    transition: 'width 0.5s ease, opacity 0.5s ease',
    position: 'absolute',
    right: '85px',
    borderRadius: '10px',
    border: '1px solid #333',
    height: '30px',
    padding: '12px',
    top: '0',
    // Additional styles for the search box
  };

  return (
    <div className="flex">
      <Image
        src={searchIcon}
        onClick={toggleSearch}
        style={{ cursor: 'pointer', width: '24px', height: '24px' }}
        alt="Search"
      />
      {/* <input
        type="text"
        style={searchBoxStyle}
        placeholder="Search..."
        className="transition-all duration-500 ease-in-out"
      /> */}
    </div>
  );
};

export default SearchComponent;
