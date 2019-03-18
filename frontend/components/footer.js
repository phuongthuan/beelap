import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
  min-height: 70px;
  background-color: #ddd;
  width: 100%;
  color: ${props => props.theme.Onyx};
`;

const Footer = props => (
  <FooterWrapper {...props}>
    <div className="row justify-content-center">
      <div className="d-flex align-self-center">2019 © Beelap</div>
    </div>
  </FooterWrapper>
);

export default Footer;
