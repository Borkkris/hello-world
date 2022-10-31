import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

// importing react-natives storage-system asyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// to check if user is online or offline
import NetInfo from '@react-native-community/netinfo';

// required to make firebase work
// Import functions from SDKs
const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [], // A chat app needs to send, receive, and display messages, so it makes sense to add messages into the state object
      uid: 0,
      user: {
        _id: '',
        name:'',
        avatar:'',
      },
      isConnected: false,
    }

    // My web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyDF4A1B6Xua1-EiSWmt2iNqbp92R1XDObs",
      authDomain: "chatapp-528fd.firebaseapp.com",
      projectId: "chatapp-528fd",
      storageBucket: "chatapp-528fd.appspot.com",
      messagingSenderId: "934694372043",
      appId: "1:934694372043:web:92bcc2926177389290d14e"
    };

    if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        // Reference to Firestore collection
        this.referenceChatMessages = firebase
        .firestore()
        .collection('messages');
  }

  // the onCollectionUpdate writes the chat messages to state messages
  // Whenever something changes in the messages collection (and, thus, when onSnapshot() is fired), this function needs to be called, like this onCollectionUpdate() function. 
  // This function needs to retrieve the current data in the messages collection and store it in the state lists, allowing that data to be rendered in the view
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
           _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || '',
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
     // the empty messages getting updated here
    this.setState({
      messages,
    }); 
  }

  // retrieve chat messages from asyncStorage (instead of filling your message state with static data)
  async getMessages() {
    let messages = '';
    try {
      // using await in your async function to wait until the asyncStorage promise settles
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        // JSON.parse converts the saved string back into an object
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // stores Chat messages
  async saveMessages() {
    try {
      // converts JS object or value into a JSON String
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // deletes stored messages
  async deleteMessages () {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  };

  //  method allows us to execute the React code when the component is already placed in the DOM (Document Object Model). 
  // This method is called during the Mounting phase of the React Life-cycle i.e after the component is rendered.
  componentDidMount() {
     //Display username in navigation
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // function that loads the messages from asyncStorage
    this.getMessages();

    // find out the user's connection status, you can call the fetch() method on NetInfo, which returns a promise
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({isConnected: true});
        console.log('online');
      } else {
        this.setState({isConnected: false});
        console.log('offline');

      }
      });

    // reference to read all the documents in the "messages" collection
    this.referenceChatMessages = firebase
    .firestore()
    .collection('messages');

    // Authenticate user anonymously using Firebase
    // listens to authentication changes
    this.authUnsubscribe = firebase
    .auth()
    .onAuthStateChanged((user) => {
      if(!user) {
        firebase.auth().signInAnonymously();
      }

      this.setState ({
        uid: this.state.user._id,
        messages: [],
        user: {
          _id: this.state.user._id,
          name: name,
        },
      });
        // once the user is authenticated the onSnapshot() creates an updated snapshot of the collection
        // the onCollectionUpdate writes the chat messages to state messages
        this.unsubscribe = this.referenceChatMessages
       .orderBy("createdAt", "desc")
       .onSnapshot(this.onCollectionUpdate);
    });
      }

  componentWillUnmount() {
      // stops listening to the collection changes
      this.unsubscribe();
      // stop listening to authentication
      this.authUnsubscribe();
  }

  // adds a new mesasage to the Chat with some informations
  addMessages = (message) => {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };
  
  // the message a user has just sent gets appended to the state messages so that it can be displayed in the chat
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
      this.addMessages(this.state.messages[0]);
      this.deleteMessages();
    });
  }

  // renders the bubble where the message is in
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
        }}
      />
    );
  }

  // only renders the default inputToolbar when user is online
  renderInputToolbar(props) {
    if (this.state.isConnected == false){
    } else {
      return(
        <InputToolbar 
          {...props}
        />
      );
    } 
  }

  render() {

  let { color, name } = this.props.route.params;

    return (
      <View style = {{ backgroundColor: color, flex:1}}> 

        <GiftedChat 
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{ _id: this.state.user._id, name: name }}
        />       
        {/* for Android so that the input field won’t be hidden beneath the keyboard */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}