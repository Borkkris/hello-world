# Chat App

## Description
This is a native mobile app built using React Native that allows users to enter a chat room, then send messages, images, and their location.

## Objective

To build a chat app for mobile devices using React Native. The app will provide users with a chat interface and options to share images and their
location.

<!-- ## API used

[Google Calender API](https://developers.google.com/calendar) -->

## Tech used  
- React Native
- Expo App
- Android Emulator
- React Native Gifted Chat 
- Google Firebase

## User Stories

1. As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my
friends and family.
2. As a user, I want to be able to send messages to my friends and family members to exchange
the latest news.
3. As a user, I want to send images to my friends to show them what I’m currently doing.
4. As a user, I want to share my location with my friends to show them where I am
5. As a user, I want to be able to read my messages offline so I can reread conversations at any
time.
6. As a user with a visual impairment, I want to use a chat app that is compatible with a screen
reader so that I can engage with a chat interface


## Development Process

### Setup Expo as Development Environment

1. Install Expo CLI

```
npm insatll expo-cli --location=global
```

2. Create a new expo project

```
expo init [projectname]
```

3. Navigate to the project

```
cd [projectname]
```

4. Start expo project

```
npm start or expo start
```

### Install React Navigation library to navigate between screens

1. Navigate to project folder and run

```
npm install react-navigation
```

2. Install necessary dependencies

```
npm install @react-navigation/native @react-navigation/stack
expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

### Set up Android Studio as Android Emulator

1. Download Android Studio
2. Make sure 'Android Virtual Device' is installed
3. Add Android SDK Location to ~/.zshrc file

```
export ANDROID_SDK=/Users/myuser/Library/Android/sdk
export PATH=/Users/myuser/Library/Android/sdk/platform-tools:$PATH
```

4. Create virtual device and click play to start

5. Select 'Run app on Android' in Expo to run app on virtual device

### Integreat Gifted Chat library to create chat UI

1. Install Gifted Chat

```
npm install react-native-gifted-chat
```

2. Integrate Gifted Chat into application

```
import { GiftedChat } from 'react-native-gifted-chat';
```

3. Follow instructions to set up chat: https://github.com/FaridSafi/react-native-gifted-chat

### Set up Cloud Firestore as data storage platform

1. Install Firestore via Firebase

```
npm install firebase@8
```

2. Import Firestore in application 

3. Register App in Firebase settings

4. Copy config code to application

5. Initialize app

```
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
```

6. Set up anonymous authentication in firebase console

### Set up Async Storage for offline functionalities

1. Install package

```
expo install @react-native-community/async-storage
```

2. Import AsyncStorage into app

```
import AsyncStorage from '@react-native-community/async-storage';
```

3. Store and retrieve state from Async Storage

### To check weather the user is online or offline

1. Install package

```
expo install @react-native-community/netinfo
```

2. Import NetInfo into app

```
import NetInfo from '@react-native-community/netinfo';
```

3. Call the fetch() method on NetInfo to check the connection


<!-- ## Links 
- [Github Code](https://github.com/wichofly/meet.git)
- App hosted on [Github](https://wichofly.github.io/meet/) -->
