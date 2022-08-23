import React from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import './GroupParticipants.css';

const GroupParticipants = ({
  selectedUser,
  addParticipants,
  alreadySelected = false,
}) => {
  return (
    <div className={`grp-list ${alreadySelected ? 'selected' : ''}`}>
      {selectedUser.map((elm, id) => (
        <div
          key={elm._id}
          style={{
            transform: `translateX(${id * 70}px)`,
          }}
          className="grp-list-user">
          {elm.role !== 'dummy' ? (
            <div data-listuserid={elm._id} className="grp-user-cvr">
              <UserAvatar imgSrc={elm.photoUrl} size="50px" />
              <div className="grp-unselect">
                <svg
                  data-id={elm._id}
                  onClick={(e) => addParticipants(e, 'unselect')}
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </div>
              <p>{elm.firstName}</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupParticipants;
