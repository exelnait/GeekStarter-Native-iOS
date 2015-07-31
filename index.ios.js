'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TabBarIOS,
    View,
    Text
} = React;

var VideosList = require('./VideosList');
var TabBarItemIOS = TabBarIOS.Item;

class GeekStarter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'NewVideos'
    };
  }
  icon(imageUri) {
    return {
        uri: imageUri,
        isStatic: true
    }
  }
  render() {
    return (
        <TabBarIOS
            selectedTab={this.state.selectedTab}>
          <TabBarItemIOS
              accessibilityLabel="NewVideos"
              title="Новые видео"
              name="NewVideos"
              icon={this.icon('bookmarks')}
              selected={this.state.selectedTab === 'NewVideos'}
              onPress={() => {
                this.setState({
                  selectedTab: 'NewVideos'
                });
              }}>
            <React.NavigatorIOS
                tintColor='#0099CC'
                initialRoute={{
                  title: 'Новые видео',
                  component: VideosList
                }}
                style={styles.mainContainer}
              />
          </TabBarItemIOS>
          <TabBarItemIOS
              accessibilityLabel="Playlists"
              title="Плэйлисты"
              name="Playlists"
              icon={this.icon('more')}
              selected={this.state.selectedTab === 'Playlists'}
              onPress={() => {
                this.setState({
                  selectedTab: 'Playlists'
                });
              }}>
            <View><Text>Playlists</Text></View>
          </TabBarItemIOS>
        </TabBarIOS>
    );
  }
}


var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8'
  }
});

React.AppRegistry.registerComponent('GeekStarter', () => GeekStarter);
