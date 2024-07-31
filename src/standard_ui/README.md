# Introduction
A React JS library with utility components and functions that aim to make web app development easier.

Refer to the example/test project to learn how to implement the library effectively.

# Requirements

## Dependencies
The library requires the following node packages to be installed in the project:
    * @mui/icons-material: run 'npm install @mui/icons-material @mui/material @emotion/styled @emotion/react'
    * react-router-dom: run 'npm install react-router-dom'
    * react-spinners: run 'npm install react-spinners'

## PageContainer
The top component of each page should be PageContainer. Each page should define the 'element' of a Route component (from the react-router-dom library).

## Theme Context
To make use of the components' theme functionality, one must define a context (using the React Context API) which provides the string that refers to the desired theme.