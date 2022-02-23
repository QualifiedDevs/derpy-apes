// const withTM = require("next-transpile-modules")([
//   "@mui/material",
//   "@mui/lab",
//   "@mui/system",
//   "@mui/icons-material",
// ]); // pass the modules you would like to see transpiled

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  concurrentFeatures: true,
  images: {
    domains: ["ipfs.io"],
  },
};
