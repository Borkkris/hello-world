import React from 'react';
import { View, Text, Button} from 'react-native';


export default class Chat extends React.Component {
  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
  }

  render() {

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Button
        title='Go to Start'
        onPress={() => this.props.navigation.navigate('Start')}
        />
      </View>
    )
  }
}