FROM mcr.microsoft.com/dotnet/core/aspnet:2.1-stretch-slim AS base
WORKDIR /app
#EXPOSE 80
#EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.1-stretch AS base-build-with-npm

# install node js
RUN apt-get update -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash --debug
RUN apt-get install nodejs -yq

FROM base-build-with-npm AS build
WORKDIR /src
COPY CarDealer/CarDealer.csproj CarDealer/
RUN dotnet restore "CarDealer/CarDealer.csproj"
COPY . .
WORKDIR "/src/CarDealer/ClientApp"
RUN npm install 
WORKDIR "/src/CarDealer"
RUN dotnet dev-certs https
RUN dotnet build "CarDealer.csproj" -c Release -o /app


FROM build AS publish
RUN dotnet publish "CarDealer.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CarDealer.dll"]
