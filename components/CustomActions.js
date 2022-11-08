import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { connectActionSheet } from "@expo/react-native-action-sheet";

// API
import * as ImagePicker from "expo-image-picker";
import * as Location from 'expo-location';

// import firestore from "firebase";
import firebase from "firebase";

export default class CustomActions extends React.Component {

    // ImagePicker: function for the user to pick an image from library with asking for permission
    imagePicker = async () => {
    // expo permission
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    try {
      if (status === "granted") {
        // pick image
        const result = await ImagePicker.launchImageLibraryAsync({ // API
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
        })
        // canceled process
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // function for the user to take a picture with asking for permission
    takePhoto = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({ //API
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
    // function for the user to show his location with asking for permission
    getLocation = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        const result = await Location.getCurrentPositionAsync( //to read the location data.
          {}
        ).catch((error) => console.log(error));
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
      console.log("error here", error, error.message);
    }
  };

    // upload images to firebase
    uploadImageFetch = async (uri) => {
        const blob = await new Promise((resolve, reject) => { // Promise
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e)
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const imageNameBefore = uri.split("/");
        const imageName = imageNameBefore[imageNameBefore.length -1];
        //  create a reference to the storage
        const ref = firebase.storage().ref().child(`image/${imageName}`);

        const snapshot = await ref.put(blob);
        // close the connection again
        blob.close();
        // To get the image URL from storage, use the asynchronous getDownloadURL method:
        return await snapshot.ref.getDownloadURL();
        
    }

    // Function that handles communication features
    onActionPress = () => {
        const options = ['Choose from library', 'Take Picture', 'Send location', 'Cancel'];
        const cancelButtonIndex = options.length -1;
        // used to hand down data (the options you want to display) to the ActionSheet component
        this.props.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                
                switch (buttonIndex) {
                    
                    case 0:
                        console.log('user wants to pick an image');
                        return ( this.imagePicker(),
                        alert("Don't worry, we will never store your Images!")
                       )
                    case 1:
                        console.log('user wants to take a picture');  
                        return ( this.takePhoto(),
                        alert("Don't worry, we will never store your Images!")
                        );
                    case 2:
                        console.log('user wants to get their location');
                        return ( this.getLocation(),
                        alert("Don't worry, we will never store your Location!")
                        );
                }
            },
        );
    }

    render() {
        return (
            <TouchableOpacity 
                accessible={true}
                accessibilityLabel="More options"
                accessibilityHint="Let’s you choose to send an image or your geolocation."
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

    CustomActions = connectActionSheet(CustomActions);