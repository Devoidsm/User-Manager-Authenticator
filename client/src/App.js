//Imports
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import SignIn from './components/SignIn';
import Main from "./components/Main";
//Main App function
function App() {
  //Setting dafaults for login, OU and User data.
  let Logger =  JSON.parse(window.localStorage.getItem('isLoggedIn'));
  if(!Logger){
    Logger = false;
  }
  const [userData, setUserData] = useState();
  const [orgData, setorgData] = useState();
  const [allUsersData, setAllUsersData] = useState('');
  //Setting Login state for refresh
  const [isLoggedIn, setIsLoggedIn] = useState(Logger);
  //console log used to show isLoggedIn is not NULL
  console.log(isLoggedIn);
  //Main Return App
  return (
    <div className="App">
      {/*Header*/}
      <Header isLoggedIn={isLoggedIn}/>
      {/*When Logged In display the Main component or display the Login component if they are not*/}
      {isLoggedIn === false ? (
        <SignIn
          setIsLoggedIn={setIsLoggedIn}
          setUserData={setUserData}
        />) : (
          <Main
            isLoggedIn={isLoggedIn}
            userData={userData}
            orgData={orgData}
            setorgData={setorgData}
            allUsersData={allUsersData}
            setAllUsersData={setAllUsersData}
          />
        )}
    </div>
  );
}
//exporting main App function
export default App;