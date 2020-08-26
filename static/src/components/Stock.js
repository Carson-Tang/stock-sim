import React from "react";
import {
  Container, CssBaseline
} from '@material-ui/core'

class Stock extends React.Component {
  constructor(props) {
    super(props)
    this.stockTicket = props.match.params.ticket
  }



  render() {
    return <>
      <React.Fragment>
        <CssBaseline />
        <Container fixed>
          <h3>{this.stockTicket}</h3>
          <h2>$300.00</h2>
          <h4>+$2.20 (+0.67%) Today</h4>
          <h4>+$3.20 (+0.95%) After Hours</h4>
        </Container>

      </React.Fragment>
    </>
  }
}

export default Stock;