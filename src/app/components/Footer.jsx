import { Box } from "@mui/system";
import React from "react";
// import "./Footer.css";

const Footer = () => {
  return (
    <Box className="h-[25vh] bg-[#042C22] flex flex-col justify-center items-center">
      <Box>
        <img src="logo_dark.svg" alt="QKart-icon"></img>
      </Box>
      <p className="p-2 text-white opacity-50 text-center font-[300] w-full md:w-[40%]">
        QKart is your one stop solution to the buy the latest trending items
        with India's Fastest Delivery to your doorstep
      </p>
    </Box>
  );
};

export default Footer;
