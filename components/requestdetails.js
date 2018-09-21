import React from 'react';
import { View, AsyncStorage, StyleSheet, Button } from 'react-native';
import { FormLabel } from 'react-native-elements';
import * as data from  '../containers/firebase';

export default class RequestDetails extends React.Component {
  static navigationOptions = {
    title: 'Request Details',
  };

  constructor(props) {
    super(props);
    this.state = {
      post: {},
      users: [],
      user_id: '',
    }
    this._getUser();
  }

  _getUser = async () => {
    const user_id = await AsyncStorage.getItem('userToken');
    this.setState({user_id:user_id});
  }

  componentDidMount() {
    const { navigation } = this.props;
    const post = navigation.getParam('post', {});
    console.log(post);
    this.setState({post:post});
    data.usersRef.on('value', (snapshot) => {
      let val = snapshot.val();
      let items = Object.values(val);
      this.setState({users:items});
    });
  }

  _checkInterested = async () => {
    const { navigation } = this.props;
    const post = this.state.post;
    if (post.interested && !post.interested.includes(this.state.user_id)) post.interested.push(this.state.user_id)
    else post.interested = [this.state.user_id];
    data.db.ref('/posts/'+post.id).set(post);
    this.setState({post:post});
  }

  _uncheckInterested = async () => {
    const { navigation } = this.props;
    const post = this.state.post;
    const index = post.interested.indexOf(this.state.user_id);
    post.interested.splice(index,1);
    data.db.ref('/posts/'+post.id).set(post);
    this.setState({post:post});
  }

  render(){
    let user = this.state.users.length ? this.state.users.find((user)=>user.id===this.state.post.poster_id) : '';
    let interestedButton = this.state.post.interested && this.state.post.interested.includes(this.state.user_id) ?
    <Button color='red' title="No More Interested" onPress={this._uncheckInterested}/> : 
    <Button color='#42b97c' title="Be Interested" onPress={this._checkInterested}/>;
    
    return (
      <View style={styles.container}>
        <FormLabel>Producer</FormLabel>
        <FormLabel>Full Name: {user.full_name}</FormLabel>
        <FormLabel>NIF: {user.nif_number}</FormLabel>
        <FormLabel></FormLabel>
        <FormLabel>{this.state.post.product} </FormLabel>
        <FormLabel>{this.state.post.quantity} kg</FormLabel>
        <FormLabel>{this.state.post.price} eur per kg</FormLabel>
        <FormLabel>{this.state.post.location}</FormLabel>
        {interestedButton}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9f1e4',
    alignItems: 'center',
    justifyContent: 'center',
  },
});