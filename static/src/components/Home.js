import React, { Fragment, useEffect } from "react";
import { Button } from '@material-ui/core'

const Home = () => {


  const register = async () => {
    try {
      // Send a POST request to the Go server for the selected product
      // with the vote type
      const response = await fetch(
        `http://localhost:8080/register`,
        {
          method: "POST",
          body: JSON.stringify({
            "username": "Pookmeister",
            "password": "testpassword",
            "firstname": "Carson",
            "lastname": "Tang",
          }),
        }
      );
      console.log(response)
      if (response.ok) {
        console.log(response)
      } else console.log(response.status);
    } catch (error) {
      console.error(error);
    }
  };

  const login = async () => {
    try {
      // Send a POST request to the Go server for the selected product
      // with the vote type
      const response = await fetch(
        `http://localhost:8080/login`,
        {
          method: "POST",
          body: JSON.stringify({
            "username": "Pookmeister",
            "password": "testpassword",
          }),
        }
      ).then(response => response.json()).then(data => console.log(data));
      console.log(response)
      if (response.ok) {
        console.log(response)
        console.log(response.json())
      } else console.log(response.status);
    } catch (error) {
      console.error(error);
    }
  };



    const getProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/login")
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }

/*   const getProfile = async () => {
    try {
      // Send a GET request to the server and add the signed in user's
      // access token in the Authorization header
      const response = await fetch("http://localhost:8080/profile");
      const responseData = await response.json();
      console.log(responseData)
    } catch (error) {
      console.error(error);
    }
  }; */

  return (
    <Fragment>
      <div className="container">
        <div className="jumbotron text-center mt-5">
          <h1>We R VR</h1>
          <p>Provide valuable feedback to VR experience developers.</p>
{/*           {!isAuthenticated && (
            <button className="btn btn-primary btn-lg btn-login btn-block" onClick={() => loginWithRedirect({})}>Sign in</button>
          )} */}
        </div>
      </div>
      <Button onClick={() => register()}>click me to register</Button>
      <Button onClick={() => login()}>click me to login</Button>
      <Button onClick={() => getProfile()}>click me to getProfile</Button>
    </Fragment>
  );
};

export default Home;