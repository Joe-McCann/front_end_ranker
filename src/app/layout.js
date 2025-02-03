"use client";

import { useState } from "react";
import { UserContext, UserProvider } from "./UserContext"; // Import the context provider

import "./globals.css";
import "./HomePage.css"; // Import the CSS file


export default function RootLayout({ children }) {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Track modal visibility
  const [passwordError, setPasswordError] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const cleanUpState = () => {
    setPasswordError(false);
    setShowSignUp(false);
    setShowLoginModal(false); // Close the modal after login
  };

  return (
    <UserProvider>
    <html lang="en">
      <body>
        {/* Header */}
        <header className="header">
          <div className="header-title">Ranker</div>
          <UserContext.Consumer>
            {({ isLoggedIn, setUsername, setIsLoggedIn }) => (
              <button
                className="header-button"
                onClick={() => isLoggedIn ? setShowProfileModal(true) : setShowLoginModal(true)}
              >
                {isLoggedIn ? "Account" : "Login"}
              </button>
            )}
          </UserContext.Consumer>
        </header>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{(showSignUp) ? "Sign Up" : "Login"}</h2>
              <UserContext.Consumer>
                {({ setUsername, setIsLoggedIn, setLists }) => (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const username = document.getElementById("username_form").value;
                    const password = document.getElementById("password_form").value;

                    if (showSignUp) {
                      const email = document.getElementById("email_form").value;
                      const confirm = document.getElementById("confirm_password_form").value;
                      if (confirm !== password){
                        setPasswordError(true);
                        return;
                      }

                      setPasswordError(false);
                      fetch("http://127.0.0.1:8080/users", {
                        method : "POST",
                        headers : { "Content-type": "application/json" },
                        body : JSON.stringify({ username : username, password : password, email : email })
                      }).then(data => {
                        setUsername(username);
                        return fetch(`http://127.0.0.1:8080/users?username=${username}`);
                      }).then((response) => {
                        return response.json();
                      }).then((data) => {
                        setLists(data);
                        console.log(data);
                        cleanUpState();
                        setIsLoggedIn(true);
                      });
                    }
                    
                    else {
                      fetch("http://127.0.0.1:8080/login", {
                        method : "POST",
                        headers : { "Content-type": "application/json" },
                        body : JSON.stringify({ username : username, password : password })
                      }).then(data => {
                        setUsername(username);
                        return fetch(`http://127.0.0.1:8080/users?username=${username}`);
                      }).then((response) => {
                        return response.json();
                      }).then((data) => {
                        setLists(data);
                        console.log(data);
                        cleanUpState();
                        setIsLoggedIn(true);
                      });
                    }
                  }}
                >
                  <div className="form-group">
                    <label>Username:</label>
                    <input type="name" required className="form-input" id="username_form"/>
                  </div>
                  {showSignUp && <div className="form-group">
                    <label>Email:</label>
                    <input type="email" className="form-input" id="email_form"/>
                  </div>}
                  <div className="form-group">
                    <label>Password:</label>
                    <input type="password" required className="form-input" id="password_form"/>
                  </div>
                  { 
                    showSignUp && <div className="form-group">
                      {passwordError && <p className="errorText">Passwords must match!</p>}
                      <label>Confirm Password:</label>
                      <input type="password" required className="form-input" id="confirm_password_form"/>
                    </div>
                  }
                  <button type="submit" className="login-button">
                    {(showSignUp) ? "Sign Up" : "Login"}
                  </button> 
                </form>
              )}
              </UserContext.Consumer>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignUp(false);
                }}
                className="close-button"
              >
                Close
              </button>
              {!showSignUp && <p onClick={() => setShowSignUp(true)}>
                <u>Sign Up</u>
              </p>}
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="main">{children}</main>
      </body>
    </html>
    </UserProvider>
  );
}