import React from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import Dashboard from 'react-native-dashboard';

const items = [
  { name: 'Create Post', background: '#42b97c', icon: 'user', route: 'CreatePost' },
  { name: 'Your Posts', background: '#42b97c', icon: 'gratipay', route: 'PostsList' },
  { name: 'Available Requests', background: '#42b97c', icon: 'heart', route: 'RequestsList' },
  { name: 'Your Reviews', background: '#42b97c', icon: 'users', route: 'ReviewsList' },
  { name: 'Edit Profile', background: '#42b97c', icon: 'group', route: 'Profile' },
  { name: 'Log Out', background: '#42b97c', icon: 'calendar', route: 'Logout' },
];

export default class DashBoard extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  _card = el => {
    if(el.route === 'Logout') this._onLogOut();
    else this.props.navigation.navigate(el.route);
  }

  render() {
    return (
      <View style={styles.container}>
        <Dashboard items={items} background={true} card={this._card} column={2} />
      </View>
    );
  }

  _onLogOut = async () => {
    await AsyncStorage.removeItem('userToken');
    this.props.navigation.navigate('Auth');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9f1e4',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});