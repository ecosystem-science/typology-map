import { createGlobalStyle } from 'styled-components';

const Style = createGlobalStyle`
  #ll-map .leaflet-bar {
    box-shadow: none;
  }
  .leaflet-bar {
    border-radius: 0 !important;
  }
  #ll-map .leaflet-bar a {
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 9999px;
    padding: 12px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    width: 48px;
    height: 48px;
    &:hover {
      background-color: white;
    }
    &:first-child {
      margin-bottom: 6px;
    }
  }
  #ll-map .leaflet-draw-actions {
    box-shadow: none;
  }
  #ll-map .leaflet-draw-actions a {
    background-color: rgba(255,255,255,0.85);
    border: 0;
    margin: 0 2px 0 0;
    color: black;
    border-radius: 0 !important;
    &:hover {
      background-color: white;
    }
  }

  #ll-map .leaflet-draw-tooltip {
  	background: #333333;
  	border: 1px solid #333333;
  	border-radius: 0 !important;
    font-weight: 400 !important;
  }

  #ll-map .leaflet-draw-tooltip::before {
  	border-right-color: #333333;
  }

  #ll-map .leaflet-error-draw-tooltip {
  	background-color: #8D0202;
    border-color: #8D0202;
  	color: white;
    font-weight: 400 !important;
  }
  #ll-map .leaflet-error-draw-tooltip span{
    font-weight: 400 !important;
  }

  #ll-map .leaflet-error-draw-tooltip::before {
  	border-right-color: #8D0202;
  }

  #ll-map .leaflet-draw-tooltip-single {
  	margin-top: -12px
  }

  #ll-map .leaflet-draw-tooltip-subtext {
  	color: white;
    font-style: italic;
  }

  #ll-map .leaflet-draw-edit-edit.leaflet-disabled {
    display: none;
  }

`;

export default Style;
