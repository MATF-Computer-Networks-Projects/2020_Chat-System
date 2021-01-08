# Chat System

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/34921120d07d4eeaac040fefa37030c8)](https://app.codacy.com/gh/MATF-Computer-Networks-Projects/2020_Chat-System?utm_source=github.com&utm_medium=referral&utm_content=MATF-Computer-Networks-Projects/2020_Chat-System&utm_campaign=Badge_Grade)

## About 

Purpose of this project was to implement fully functional chat system with group chats and file upload possibility using **only** web sockets.


## Important note

### No database 
Since there is no database, **as soon as you reload the page your user will disapear**

### Local testing 

Since this is most probably run localy, if you want to see multiple users you just need to open multiple browser tabs which are targeting the url on which the app is run.

## Project overview

Project is consisted of two main parts:

- client
- server 

### Client 

Client is Typescript app made with React framework and it's main purpose is to manage client communication and to display some kind of UI so we can actually use the chat

### Server 

Server is Typescript app made with express framework. It's basically a very simple server which listens to socket events sent from clients and handles them accordingly


## Socket.io 

Core of this project is the [socket.io](https://socket.io/) library for Typescript, which is just a nicer interface for native Javascript websocket interface. It's used both on the client and the server.

## Starting the projects

Since both client and server are seperate npm projects you need to run `npm install` in both of them. If you are in the root of the repo, commands are:

```
cd client
npm install 
```

and 

```
cd server
npm install 
```

After you've installed the dependencies you need to run the projects, which can be done with `npm run start`. Command is the same for both projects.

Client is started on port 3000, and server is started on 4000. You should make sure that those ports are available before starting the projects. If you want different ports, just change the `.env` files

### Env for server

For local setup, just rename `.env.example` to `.env` and you are good to go.

### Dependencies 

- npm version: 7.0.3
- node version: v15.0.1

It should work fine with everything that is relatively newer, if that's no the case, you can use [nvm](https://github.com/nvm-sh/nvm) to use these specific versions.

### Typescript problems

If you run into some TS related problems during build, please make sure that you are using TS installed in the project, not TS installed globally on your computer

## Screenshots 

### Register Page
![Register Page](https://i.postimg.cc/0QK5WjcG/register-Page.png)
### Home page
![Home page no user selected](https://i.postimg.cc/Jz0QQPnk/home-Page-No-User-Selected.png)

![Home page user selected](https://i.postimg.cc/fRPfqmtg/home-Page-User-Selected.png)

![Home page new message](https://i.postimg.cc/7LTMFhSP/home-Page-New-Message.png)

![Home page send attachments](https://i.postimg.cc/Fzhykx81/home-Page-Send-Attachments.png)

![Home page group created](https://i.postimg.cc/RhGc7Hxd/home-Page-New-Group.png)

![Home page send group message](https://i.postimg.cc/fWvjn6Sd/home-Page-Send-Group-Message.png)


