import React from "react";

export const Restart = ({ width = "20px", height = "20px" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32" // Adjusted for a 32x32 grid
    xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2a14 14 0 1 0 14 14h-2a12 12 0 1 1-3.9-8.5V10l4-4-4-4v3A14 14 0 0 0 16 2z"></path>
  </svg>
);


export const Pause = () => (
  <svg width="800px" height="800px" viewBox="-7.5 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4h2v24h-2zM17 4h2v24h-2z"></path>
  </svg>
);

export const Play = () => (
  <svg width="800px" height="800px" viewBox="-7.5 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4l20 12-20 12z"></path>
  </svg>
);

export const Skip = () => (
  <svg width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4v24l12-12-12-12zM18 4h2v24h-2z"></path>
  </svg>
);


export const Focus = () => (
  <svg width="800px" height="800px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.16923 2.00234C8.11301 2.00078 8.0566 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 7.9434 13.9992 7.88699 13.9977 7.83077L15.7642 6.06422C15.9182 6.68407 16 7.33249 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C8.66751 0 9.31593 0.0817526 9.93578 0.235791L8.16923 2.00234Z" fill="#000000"/>
    <path d="M4 7.99996C4 6.13612 5.27477 4.57002 7 4.12598V6.26752C6.4022 6.61333 6 7.25968 6 7.99996C6 9.10453 6.89543 9.99996 8 9.99996C8.74028 9.99996 9.38663 9.59776 9.73244 8.99996H11.874C11.4299 10.7252 9.86384 12 8 12C5.79086 12 4 10.2091 4 7.99996Z" fill="#000000"/>
    <path d="M14 2L13 0L10 3V4.58579L7.79289 6.79289L9.20711 8.20711L11.4142 6H13L16 3L14 2Z" fill="#000000"/>
  </svg>
);