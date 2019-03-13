const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const path = require('path')
const Dotenv = require('dotenv-webpack')
require('dotenv').config()

module.exports =  withImages(withCSS({
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    config.plugins = config.plugins || []

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ]

    return config
  }
}))