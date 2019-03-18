import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

import Nav from '../components/nav';
import Footer from '../components/footer';
import Head from '../components/head';
import theme from '../lib/theme';

const StyledPage = styled.div`
  background: #ffffff;
  color: ${props => props.theme.Dark_Gunmetal};
`;

const NavWrapper = styled(Nav)`
  background-color: ${props => props.theme.Yellow_Orange};
  li {
    a {
      color: ${props => props.theme.Onyx};
    }
  }
  width: 100%;
  height: 45px;
`;

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto', sans-serif;
    src: url('../static/Roboto-Regular.ttf');
  }   
  html {
    box-sizing: border-box;
    font-size: 10px  ;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    font-family: 'Roboto', 'Arial', sans-serif;
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
  }
  a {
    font-family: 'Roboto', 'Arial', sans-serif;
    text-decoration: none;
    color: ${theme.Dark_Gunmetal};
  }
`;

export default class Page extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    const { children } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <StyledPage className="container-fluid">
          <div className="row">
            <Head title="Beelap" />
            <NavWrapper />
            <div className="container py-5">{children}</div>
            <Footer theme={theme} />
          </div>
          <GlobalStyle />
        </StyledPage>
      </ThemeProvider>
    );
  }
}
