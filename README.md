TODO: write readme .md

# Introduction
This project aims to build a web application that allows car dealers to managed their car stock.
The app supports the following function
- Add/remove car
- List cars and stock levels
- Update car stock level
- Search car By make, model
The app is developed using `.NETCore 2.1` and `ReactJS` (using [create-react-app](https://github.com/facebook/create-react-app)). It also use Docker to containerize app and Swagger for documentation (using [Swashbuckle.Core](https://github.com/domaindrivendev/Swashbuckle))

## Requirement
### Development
- Dotnet core sdk 2.1
- Nodejs v10 and npm ^6.9.0
- (Optional) Docker Community edition
- (Optional) Any of the following (Visual studio 2017 or above , Visual Studio For Mac, Visual Studio Code)
### Production 
- Dotnet runtime 2.1
- Docker Community edition

## Getting started

## Install frontend npm packages
From the root of this folder, nagivate to ./CarDealer/ClienApp
and run `npm install` to restore all the npm package

## With visual studio
Open *CarDealer.sln* at the root of this folder using Visual Studio . The solution will contains only one project, which is set as default startup app. 
You can build the solution, then launch the app using `IIS Express` or `CarDealer` configuratio.
n
## With .net core CLI
### Development
You can run this command at the root of this solution to start the app in development mode
```
dotnet run -p CarDealer
```
If running success, it will tell you the app is listening on <host>:<port> (usually *http://localhost:5000* if there is no port conflict) You can visit this with your web browser to see the app
If you running for the first time without restoring the npm packages, it can often complain about `npm install return exit code -1`. In that case just run the command again, or make sure you have ran install npm package
### Release
To publish the app, you can navigate to project folder (./CarDealer ) and  run the following commands
```
dotnet build "CarDealer.csproj" -c Release -o ./app
dotnet publish "CarDealer.csproj" -c Release -o ./app
dotnet ./app/CarDealer.dll 
```
The app will tell you which host&port it's running on(usually localhost:5000,5001). You can then navigate to https://localhost:5001 to get to the frontend.
The release build frontend SPA will always redirect you to use https

Note: you probably have to give it appropriate permission e.g sudo or change the node_modules permission, or just remove node_modules directory
Due to different OS file system permission, and npm issues ( I encoutered a permission error and [this node-gyp error](https://github.com/nodejs/node-gyp/issues/1464) on Mac OS myself, but not on my window machine), I advise you to try using docker for production release



## Release build with Docker 
At the root directory of this project, you can find the dockerfile
describe the container build step.

The buildfile will do a fresh `Release` build everytime using docker container with appropriate `.netcore SDK` and `Node Runtime`

To build image, navigate to the root directory of this folder and run. (Make sure to give it appropriate permission to access )
```
docker build -t <your_repository>/<image_name> .
```
After building success, you can run the container with following command

```
docker run -d -p <hostport>:80 --name <your_container_name> <your_repository>/<image_name>
```
You can then navigate to localhost:80 in your web browser to see the page

Note: At the moment docker is not configured to use https

## Documentation

The project is configured to generate Swagger documentation using Swashbuckle. 

There is a swagger UI at `<app_url>/swagger/index.html`.

Note: If you running release build, you will need to access the above path using http url: The try it out function might not work properly. The server will try to redirect API request to https port but CORS is not enabled (we only let front end use the api)