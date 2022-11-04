import React from 'react';
import { View, Platform, KeyboardAvoidingView, Button } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

// importing react-natives storage-system asyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// to check if user is online or offline
import NetInfo from '@react-native-community/netinfo';

// Component CustomActions (Action Button)
import CustomActions from './CustomActions';

// MapView Component
import MapView from 'react-native-maps';


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
    // safes the messages when user is offline
    this.saveMessages();
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


    // find out the user's connection status, you can call the fetch() method on NetInfo, which returns a promise
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        
        this.setState({
          isConnected: true,
        })
        console.log('online');

        // reference to read all the documents in the "messages" collection
        this.referenceChatMessages = firebase.firestore().collection('messages');

        // Authenticate user anonymously using Firebase
        // listens to authentication changes
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if(!user) {
            firebase.auth().signInAnonymously();
          }

          this.setState ({
            uid: this.state.user._id,
            messages: [
              // Object 1
              {
              _id: 3,
              createdAt: new Date(),
              user: {
                _id: 4,
                name: 'Christian',
                avatar: 'https://placeimg.https://firebasestorage.googleapis.com/v0/b/chatapp-528fd.appspot.com/o/Bildschirmfoto%202022-10-30%20um%2015.01.53.png?alt=media&token=ea2b0658-785a-4d99-987e-a3d4dd937744/140/140/any',
              },
              // location
              location: {
                latitude: 48.864601,
                longitude: 2.398704,
              },
            }],
            user: {
              _id: this.state.user._id,
              name: name,
            },
          });
          // once the user is authenticated the onSnapshot() creates an updated snapshot of the collection
          // the onCollectionUpdate writes the chat messages to state messages
          this.unsubscribe = this.referenceChatMessages
          .orderBy('createdAt', 'desc')
          .onSnapshot(this.onCollectionUpdate);
        });
      }
      // if user is offline, mesages will be load and displayed by asyncStorage
      else {
        this.setState({
          isConnected: false,
        });
        console.log('offline');
        this.getMessages();
      }
    });
    
  }

  componentWillUnmount() {
    if (this.isConnected) {
      // stops listening to the collection changes
      this.unsubscribe();
      // stop listening to authentication
      this.authUnsubscribe();
    }
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

  // responsible for creating the circle button
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
   };

  // showing the user’s location
  renderCustomView (props) {
  const { currentMessage} = props;
  if (currentMessage.location) {
    return (
        <MapView
          style={{width: 250,
            height: 300,
            borderRadius: 13,
            margin: 3}}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,}}
         />
     );
   }
   return null;
 }

  render() {

  let { color, name } = this.props.route.params;


    return (
      <View style = {{ backgroundColor: color, flex:1}}> 

        {/* GiftedChat */}
        <GiftedChat 
          messages={this.state.messages}

          isConnected={this.state.isConnected}


          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderCustomView={this.renderCustomView}
          // the prop renderActions
          renderActions={this.renderCustomActions}     

          onSend={(messages) => this.onSend(messages)}

          user={{ _id: this.state.user._id, name: name }}
        />
        {/* for Android so that the input field won’t be hidden beneath the keyboard */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}