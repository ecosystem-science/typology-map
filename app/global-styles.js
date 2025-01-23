import { createGlobalStyle } from 'styled-components';
// html {
//   scroll-behavior: smooth;
// }

const GlobalStyle = createGlobalStyle`


  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow-y: scroll !important;
    color: black;
  }

  body.fontLoaded {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fff;
    min-height: 100%;
    min-width: 100%;
  }

  h1 {
    font-family: Kanit, Arial, sans-serif;
    font-weight: 500;
  }

  p,
  label {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.5em;
  }

  p {
    margin: 10px 0;
  }

  a {
    color: #C60000;
    text-decoration: none;
    &:visited {
      color: #C60000;
    }
    &:hover {
      text-decoration: underline;
      color: #8D0202;
    }
    &:focus {
      text-decoration: underline;
      color: #8D0202;
      outline: 0;
    }
  }

  figure {
    margin: 0;
  }

  sub {
    top: 0.5em;
  }

  sup {
    top: -.5em;
  }
  sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: initial;
  }

  .rle-content a {
    font-weight: 600;
  }

  .rle-content h1,
  .rle-content h2,
  .rle-content h3,
  .rle-content h4 {
    line-height: 1.15;
  }

  .rle-caption-markdown p {
    margin: 0;
  }
  .rle-caption-markdown a {
    color: white;
  }
  .rle-iframe-feedback-form-wrapper {
    position: relative;
    overflow: hidden;
    padding-top: 166%;
  }
  .rle-iframe-feedback-form {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  .rle-html .rle-content h1,
  .rle-html .rle-content h2 {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 20px;
    margin: 30px 0 10px;
  }
  .rle-html-page .rle-content h1:first-of-type {
    font-family: Kanit, Arial, sans-serif;
    font-size: 40px;
    margin: 0 0 40px;
  }
  .rle-html .rle-content h3,
  .rle-html .rle-content h4 {
    font-size: 17px;
    margin: 20px 0 5px;
  }
  .rle-html .rle-content {
    font-size: 15px;
  }
  .rle-content p.lead,
  .rle-html-group .rle-content blockquote,
  .rle-html-group .rle-content blockquote p,
  .rle-html-group .rle-content > p:first-of-type {
    font-size: 16px;
    @media (min-width: 721px) {
      font-size: 20px;
    }
  }
  .rle-html-group .rle-content > p:first-of-type {
    margin-bottom: 40px;
  }

  .rle-html-group .rle-content blockquote {
    margin: 0 0 40px;
    padding: 0;
    border: 0;
    outline: 0;
    font-size: 100%;
    vertical-align: baseline;
    background: transparent;
    quotes: none;
    &::after {
      content: '';
      content: none;
    }
    &::before {
      content: '';
      content: none;
    }
  }

  .rle-content table {
    width: 100%;
    margin: 20px 0 40px;
    font-size: 13px;
    line-height: 17px;
    @media (min-width: 721px) {
      width: auto;
    }
  }

  .rle-content th,
  .rle-content td {
    padding: 3px 5px;
    @media (min-width: 721px) {
      min-width: 100px;
      padding: 3px 10px;
    }
    &:first-child {
      padding-left: 1px;
    }
    &:last-child {
      padding-right: 1px;
    }
  }

  .rle-content th {
    text-align: left;
    border-bottom: 1px solid;
    vertical-align: top;
  }
  .rle-content th em{
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    @media (min-width: 721px) {
      font-size: 13px;
      line-height: 17px;
    }
  }

  .rle-content b,
  .rle-content strong {
    font-weight: 600;
  }

  .rle-content ul,
  .rle-content ol {
    padding-left: 20px;
    @media (min-width: 721px) {
      padding-left: 25px;
    }
  }
  .rle-content ul li,
  .rle-content ol li {
    padding-bottom: 7px;
    &:last-child {
      padding-bottom: 0;
    }
  }

  .rle-content ul li blockquote,
  .rle-content ol li blockquote {
    margin: 0;
  }
  .leaflet-interactive {
    &:focus {
      outline: none;
    }
  }
`;

export default GlobalStyle;
