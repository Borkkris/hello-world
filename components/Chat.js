import React from 'react';
import { View, Text, Button} from 'react-native';


export default class Chat extends React.Component {

// Passing the name from value={this.state.name} on start.js file

  componentDidMount() {
    // let { name } = this.props.route.params;
    // this.props.navigation.setOptions({ title: name });
  }

  render() {

    let { color } = this.props.route.params;

    return (
      <View style={{backgroundColor: color, flex:1, justifyContent: 'center', alignItems: 'center'}}>

        {/* Button to click on to navigate to the Start Screen */}
        <Button
        title='Go to Start'
        onPress={() => this.props.navigation.navigate('Start')}
        />
      </View>
    )
  }
}