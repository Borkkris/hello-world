import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {  name: '', 
                    color: '' }
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/Background-Image.jpg')}style={styles.image}>

            <Text style={styles.title}>tipIT</Text>

          <View style={styles.box}>            
            {/* More than 2 styles we use [] */}
            {/*Allows user to input name to display in chat*/}
            <TextInput style={[styles.input, styles.text]}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Your Name'
            />
            {/* Allows users to pick a color */}
            <View style={styles.colorWrapper}>
              <Text style={[styles.textWrapper, styles.label]}>Choose Background Color</Text>
              <View style={styles.colors}>
                <TouchableOpacity style={[styles.color, styles.colorBlack]} onPress={() => this.setState({ color: '#090C08' })} />
                <TouchableOpacity style={[styles.color, styles.colorPurple]} onPress={() => this.setState({ color: '#474056' })} />
                <TouchableOpacity style={[styles.color, styles.colorGrey]} onPress={() => this.setState({ color: '#8A95A5' })} />
                <TouchableOpacity style={[styles.color, styles.colorGreen]} onPress={() => this.setState({ color: '#B9C6AE' })} />
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}>
                <Text style={styles.buttonText}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    
  },

  title: {
    fontSize: 35,
    fontWeight: '600',
    color: '#2b2a2a',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 60,
  },

  box: {
    backgroundColor: '#ffffffdf',
    width: '88%',
    alignItems: 'center',
    height: '50%',
    justifyContent: 'space-evenly',
    borderRadius: 5,
    padding: 10,
    marginTop:100,
  },

  input: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    color: '#686474',
    fontWeight: '400',
  },

  text: {
    color: '#6b6676',
    fontSize: 16,
    fontWeight: '700',
    padding: 5,
  },

  textWrapper: {
    color: '#6b6676',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40,
  },

  label: {
    marginBottom: '7%',
  },

  colorWrapper: {
    width: '88%',
    height: '60%',
    justifyContent: 'center',
  },

  colors: {
    flexDirection: 'row',
    cursor: 'pointer',
    justifyContent: 'space-between',
    marginBottom: 40,
  },

  color: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },

  colorBlack: {
    backgroundColor: '#090C08',
  },

  colorPurple: {
    backgroundColor: '#474056',
  },

  colorGrey: {
    backgroundColor: '#8A95A5',
  },

  colorGreen: {
    backgroundColor: '#B9C6AE',
  },

  // buttonWrapper: {
  //   width: '88%',
  //   flex: 1,
  //   justifyContent: 'end',
  // },

  button: {
    backgroundColor: '#9568445a',
    height: 50,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },

  buttonText: {
    padding: 10,
    color: '#2b2a2a',
    fontSize: 16,
    fontWeight: '600',
  },
})