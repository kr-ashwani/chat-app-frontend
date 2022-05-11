import React from "react";
import UserAvatar from "../../components/userAvatar/UserAvatar";
import { useAuth } from "../../context/AuthContext";
import "./UserInfo.css";
import { format } from "date-fns";

const UserInfo = () => {
  const { currentUser } = useAuth();

  return (
    <div className="userInfo">
      <h4>Welcome to JWT Authentication.</h4>
      <div className="currentuserInfo">
        <UserAvatar imgSrc={currentUser.photoUrl} size="300px" />
        <table>
          <thead>
            <tr>
              <th style={{ width: "40%" }}></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(currentUser).map((elem, id) => {
              if (elem[0] === "photoUrl") return null;
              if (elem[0] === "createdAt" || elem[0] === "lastLoginAt")
                return (
                  <tr className="userInfoField" key={`${id}`}>
                    <td>{elem[0]}</td>
                    <td>
                      {format(new Date(elem[1]), "EE do MMMM yyyy hh:mm:ss a")}
                    </td>
                  </tr>
                );
              if (Array.isArray(elem[1]))
                return (
                  <tr className="userInfoField" key={`${id}`}>
                    <td>{elem[0]}</td>
                    <td>{elem[1].join(" , ")}</td>
                  </tr>
                );
              return (
                <tr className="userInfoField" key={`${id}`}>
                  <td>{elem[0]}</td>
                  {typeof elem[1] === "boolean" ? (
                    <td>{`${elem[1]}`}</td>
                  ) : (
                    <td>{elem[1]}</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserInfo;
