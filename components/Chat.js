import React, { useId } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

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
      }

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

        this.referenceChatMessages = firebase
        .firestore()
        .collection('messages');

  }

  //  method allows us to execute the React code when the component is already placed in the DOM (Document Object Model). 
  // This method is called during the Mounting phase of the React Life-cycle i.e after the component is rendered.
  componentDidMount() {
     //Display username in navigation
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // reference to read all the documents in the "messages" collection
    this.referenceChatMessages = firebase
    .firestore()
    .collection('messages');

    // Authenticate user anonymously using Firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        firebase.auth().signInAnonymously();
      }

      this.setState ({
        uid: user._id,
        messages: [],
        user: {
          _id: user._id,
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
        user: data.user,
      });
    });
     // the empty messages getting updated here
    this.setState({
      messages,
    }); 
  }

  
  // the message a user has just sent gets appended to the state messages so that it can be displayed in the chat
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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

  // adds a new mesasage to the Chat with some informations
  addMessage() {

    const message = this.state.messages[0];

    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user:message.user,
      image:message.image || null,
      location: message.location || null,
    });
  }

  render() {

  let { color } = this.props.route.params;

    return (
      <View style = {{ backgroundColor: color, flex:1}}> 

        <GiftedChat 
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id:1
          }}
        />       
        {/* for Android so that the input field won’t be hidden beneath the keyboard */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}