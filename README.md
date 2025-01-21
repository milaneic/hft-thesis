# Master's Thesis Project: Developing a Concept for Easier Data Manipulation in Smaller Apps Using NoSQL

## Overview

This project is part of my master's thesis, titled **"Developing a Concept for Easier Data Manipulation in Smaller Apps by Using NoSQL"** . The thesis explores the suitability of NoSQL databases for smaller web applications, comparing them with traditional relational databases (RDBMS). The project focuses on implementing a web service using **GraphQL** and **NoSQL** to demonstrate the advantages of this approach for easier data manipulation in smaller applications.

## Table of Content:

- [Introduction](#introduction)
- [Project structure](#project-structure)
- [Setup](#setup)

## Introduction

The primary goal of this project is to demonstrate how NoSQL databases, combined with GraphQL APIs, can simplify data manipulation in smaller applications. By using **NestJS** as the backend framework, I have implemented a system that manages logistics operations, such as orders, trips, events, and vehicles, without the need for complex relationships typically seen in relational databases.

## Project Structure

This project is divided into four backend services and two frontend services.

1. **REST Backend with SQL Database**
   This backend service is built using REST API principles and connects to an SQL database to handle data management and operations.
2. **REST Frontend**
   The frontend interface interacts with the REST backend to provide users with a visual interface for accessing data stored in the SQL database.
3. **GraphQL Backend with SQL Database**
   A GraphQL-based backend service that uses an SQL database to provide a more flexible API layer.
4. **GraphQL Backend with MongoDB (using ORM)**
   This backend service is built using GraphQL and connects to a MongoDB database with the help of an Object-Relational Mapper (ORM) to manage the data structure.
5. **GraphQL Backend with MongoDB (No ORM)**
   A GraphQL backend that connects directly to MongoDB, avoiding the use of an ORM, and instead using MongoDB's native document-based storage model.
6. **GraphQL Frontend**
   A single frontend that is used for all three previusly mentioned GraphQL based backendservies.

## Technologies Used

- **Backend** :

  - NestJS
  - GraphQL
  - SQL(MySQL)
  - NoSQL (MongoDB)
  - Docker
  - TypeScript

- **Frontend** :

  - Next.js
  - React
  - GraphQL (Apollo Client)

- **Other** :

  - JWT Authentication (NextAuth)
  - Docker Compose for multi-service orchestration

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/milaneic/hft-thesis.git
   cd hft-thesis
   ```

2. Depending of which application you want to run chose which you want to run.
      REST - npm run start:rest
      GRAPHQL SQL - npm run start:graph
      MONGO NOSQL ORM - npm run start:orm
      MONGO NOSQL- npm run start:mongo



## Testing

1. Download Apache JMeter from https://jmeter.apache.org/download_jmeter.cgi.
2. 