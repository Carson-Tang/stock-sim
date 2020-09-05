import React from "react";
import history from "./../history";
import { Button } from '@material-ui/core'

const StocksPage = () => {

  const loginRedirect = () => {
    history.push('/login')
    window.location.reload()
  }

  const registerRedirect = () => {
    history.push('/register')
    window.location.reload()
  }

  return (
    <>
      <div>StocksPage</div>
      <Button onClick={() => loginRedirect()}>To Login Page</Button>
      <Button onClick={() => registerRedirect()}>To Register Page</Button>
    </>
  );

};

export default StocksPage;