import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

import Header from '../components/Header';
// import Footer from '../components/footer';
import Meta from '../components/Meta';

const theme = {
  lemon: '#F3C622',
  dark: '#23212C',
  orange: '#FCB43A',
  onyx: '#3A3637',
  yellow: '#FCD615',
  red: '#992409',
  maxWidth: '1000px',
  bs: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const StyledPage = styled.div`
  color: ${props => props.theme.dark};
`;

// const Inner = styled.div`
//   max-width: ${props => props.theme.maxWidth};
//   margin: 0 auto;
//   padding: 2rem;
// `;

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto', sans-serif;
    src: url('../static/Roboto-Regular.ttf');
    font-weight: normal;
    font-style: normal;
  }   
  html {
    box-sizing: border-box;
    font-size: 10px;
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
  }

  p, h1, h2 {
    margin: 0;
  }
  
  header {
    width: 100%;
    box-shadow: 0 5px 10px ${props => props.theme.onyx};
    margin-bottom: 3rem;
  }
  main {
    padding: 3em 0;
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
        <StyledPage>
          <Meta title="Beelap" />
          <Header />
          <div className="container">{children}</div>
          {/* <Footer theme={theme} /> */}
          <GlobalStyle />
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export { theme };
