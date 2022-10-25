import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [], // A chat app needs to send, receive, and display messages, so it makes sense to add messages into the state object
    }
  }

// Passing the name from value={this.state.name} on start.js file

  componentDidMount() {
     //Display username in navigation
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.setState({
      // each message requires an _id, a creation date, and a user object
      messages: [ 
        // static message
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          // user object, likewise, requires a user ID, name, and avatar
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        // system message
        { 
          _id: 3,
          text: 'You entered the Chat (.tipIT)',
          createdAt: new Date,
          system: true,
          // Any additional custom parameters are passed through
        }
      ],
    })
    
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