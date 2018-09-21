import React from 'react';
import { View, Alert, StyleSheet, Button } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';
import * as data from  './../containers/firebase';

export default class PostDetails extends React.Component {
  static navigationOptions = {
    title: 'Product Details',
  };

  constructor(props) {
    super(props);
    this.state = {
      post: {},
      users: {},
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    const postId = navigation.getParam('id', 'NO-ID');
    data.db.ref('/posts/'+postId).on('value', (snapshot) => {
      let val = snapshot.val();
      this.setState({post:val});
    });
    data.usersRef.on('value', (snapshot) => {
      let val = snapshot.val();
      this.setState({users:val});
    });
  }

  editProduct() {
    const res = data.editProduct(this.state.post);
    if (res) {
      Alert.alert('Post edited!');
      this.props.navigation.goBack();
    } else Alert.alert('Fields still required');
  }

  confirmExchanged(receiver_id) {
    const post = this.state.post;
    delete post.interested;
    post.receiver = receiver_id;
    data.editProduct(post).then(this.setState({post:post}));
  }

  render(){
    let receiver = this.state.post.receiver ? <FormLabel>Traded with {Object.values(this.state.users).find((user)=>this.state.post.receiver === user.id).full_name}</FormLabel> : <FormLabel></FormLabel>;
    let interested = Object.values(this.state.users).filter((user)=>this.state.post.interested && this.state.post.interested.includes(user.id));
      let usersInterested = interested ? interested.map((user)=>{
        return <View><FormLabel>Interested: {user.full_name+' '+user.phone_number}</FormLabel>
          <Button color='#42b97c' title="Confirm Exchanged" onPress={() => this.confirmExchanged(user.id)}/></View>; 
      }) : <FormLabel>No interested</FormLabel>;

    return (
      <View style={styles.container}>
        <FormLabel>Product</FormLabel>
        <FormInput value={this.state.post.product} 
          onChangeText={(text)=>this.setState(prevState=>({post: {...prevState.post,product:text}}))}/>

        <FormLabel>Quantity (kg)</FormLabel>
        <FormInput value={this.state.post.quantity} keyboardType='numeric'
          onChangeText={(text)=>this.setState(prevState=>({post: {...prevState.post,quantity:text}}))}/>

        <FormLabel>Price (eur per kg)</FormLabel>
        <FormInput value={this.state.post.price} keyboardType='numeric'
          onChangeText={(text)=>this.setState(prevState=>({post: {...prevState.post,price:text}}))}/>

        <FormLabel>Location</FormLabel>
        <FormInput value={this.state.post.location} 
          onChangeText={(text)=>this.setState(prevState=>({post: {...prevState.post,location:text}}))}/>
      
        {usersInterested}
        {receiver}
        <Button color='#42b97c' title="Edit Post" onPress={() => this.editProduct()}/>
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