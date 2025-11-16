import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaChevronDown } from 'react-icons/fa';

const ProfileSelect = ({ selectedProfileIds, onChange }) => {
  const { list: profiles } = useSelector((state) => state.profiles);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const toggleOption = (profileId) => {
    if (selectedProfileIds.includes(profileId)) {
      onChange(selectedProfileIds.filter(id => id !== profileId));
    } else {
      onChange([...selectedProfileIds, profileId]);
    }
  };

  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCount = selectedProfileIds.length;

  return (
    <div className="profile-select-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className={`multi-profile-select-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCount === 0 && <span className="placeholder">Select profiles...</span>}
        {selectedCount > 0 && (
            <span className="selected-count">
              {selectedCount} {selectedCount === 1 ? 'profile' : 'profiles'} selected
            </span>
        )}
        <FaChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="multi-profile-dropdown">
          <input
            type="text"
            className="profile-search-input"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="profile-options-list">
            {filteredProfiles.map(profile => (
              <label key={profile._id} className="multi-profile-option">
                <input
                  type="checkbox"
                  checked={selectedProfileIds.includes(profile._id)}
                  onChange={() => toggleOption(profile._id)}
                />
                <span>{profile.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelect;