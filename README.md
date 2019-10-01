TODO: write readme .md

# Introduction
This project aims to build a web application that allows car dealers to managed their car stock.
The app supports the following function

## Requirement
### Development
- Dotnet core sdk 2.1
- Nodejs v10 and npm ^6.9.0
- (Optional) Docker Community edition
### Production 
- Dotnet runtime 2.1
- Docker daemon



## Getting started

## Install frontend npm packages
From the root of this folder, nagivate to ./CarDealer/ClienApp
and run `npm install` to restore all the npm package

## With visual studio
You can open *CarDealer.sln* at the root of this folder. The solution will contains only one project, which is set as default startup app. 
## With .net core CLI
You can run this command at the root of this solution to start the app in development mode
```
dotnet run -p CarDealer
```
If running success, it will tell you the app is listening on <host>:<port>, usually *http://localhost:500*. You can visit this with your web browser to see the app
If you running for the first time without restoring the npm packages, it can often complain about `npm install return exit code -1`. In that case just run the command again, or make sure you have ran install npm package

To publish the app, you can navigate to project folder (./CarDealer ) and  run the following commands
```
dotnet build "CarDealer.csproj" -c Release -o ./app
dotnet publish "CarDealer.csproj" -c Release -o ./app
dotnet ./app/CarDealer.dll 
```
Note: you probably have to give it appropriate permission e.g sudo or change the node_modules permission, or just remove node_modules directory


### Docker 
At the root directory of this project, you can find the dockerfile
describe the container build step.

The buildfile will do a fresh `Realease` build everytime using docker container with appropriate `.netcore sdk` and `npm`

To build image, navigate to the root directory of this folder and run. (Make sure to give it appropriate permission to access )
```
docker build -t <your_repository>/<image_name> .
```
After building success, you can run the container with following command

```
docker run -d -p <hostport>:80 --name <your_container_name> <your_repository>/<image_name>
```
you can then navigate to localhost in your web browser to see the page

