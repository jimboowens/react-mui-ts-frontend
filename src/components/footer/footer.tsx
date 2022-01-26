import React, { Component } from "react";

import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Link from "@mui/material/Link";

const FooterContainer = styled.div`
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100% !important;
  height: 100px !important ;
  background: inherit;
`;

function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://github.com/jimboowens">
          Jim Owens
        </Link>{" "}
        {new Date().getFullYear()}.
      </Typography>
    );
  }

class Footer extends Component {
  render() {
    return (
      <FooterContainer>
        {/* <Typography>Footer Text</Typography> */}
        <Copyright />
      </FooterContainer>
    );
  }
}

export default Footer;