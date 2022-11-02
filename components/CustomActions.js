import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';

// asks user for permission 
import * as Permissions from "expo-permissions";

// API
import * as ImagePicker from "expo-image-picker";

import * as Location from 'expo-location';


export default class CustomActions extends React.Component {

     imagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("Status from imagePicker: ", { status });
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
        }).catch((error) => console.log(error));
        console.log("Result: ", result);
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
          // console.log("from image picker function: ", { image });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  takePhoto = async () => {
    // const { status } = await Permissions.askAsync(
    //   Permissions.CAMERA,
    //   Permissions.MEDIA_LIBRARY
    // );
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        // console.log("Result: ", result);

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  getLocation = async () => {
    try {
      // const { status } = await Permissions.askAsync(
      //   Permissions.LOCATION_FOREGROUND
      // );
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const result = await Location.getCurrentPositionAsync({}).catch(
          (error) => console.log(error)
        );
        // const longitude = JSON.stringify(result.coords.longitude);
        // const altitude = JSON.stringify(result.coords.latitude);
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

    // Function that handles communication features
    onActionPress = () => {
        const options = ['Choose from library', 'Take Picture', 'Send location', 'Cancel'];
        const cancelButtonIndex = options.length -1;
        // used to hand down data (the options you want to display) to the ActionSheet component
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return;
                    case 1:
                        console.log('user wants to take a picture');  
                        return;
                    case 2:
                        console.log('user wants to get their location');
                        default:
                }
            },
        );
    }

    render() {
        return (
            <TouchableOpacity 
                style={[styles.container]}
                onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
        container: {
            width: 26,
            height: 26,
            marginLeft: 10,
            marginBottom: 10,
        },
        wrapper: {
            borderRadius: 13,
            borderColor: '#b2b2b2',
            borderWidth: 2,
            flex: 1,
        },
       iconText: {
            color: '#b2b2b2',
            fontWeight: 'bold',
            fontSize: 16,
            backgroundColor: 'transparent',
            textAlign: 'center',
        },
    });

    CustomActions.contextTypes = {
        actionSheet: PropTypes.func,
    };