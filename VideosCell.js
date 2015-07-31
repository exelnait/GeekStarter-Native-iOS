'use strict';

var React = require('react-native');
var {
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    Component
    } = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    },
    rightContainer: {
        flex: 1
    },
    title: {
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'left'
    },
    year: {
        textAlign: 'left'
    },
    thumbnail: {
        width: 90,
        height: 45,
        marginRight: 10
    }
});

class VideoCell extends Component {
    render() {
        return (
            <TouchableHighlight
                onPress={this.props.onSelect.bind(this)}
                underlayColor='#99d9f4'>
                <View style={styles.container}>
                    <Image
                        source={{uri: this.props.movie.snippet.thumbnails.medium.url}}
                        style={styles.thumbnail}
                        />
                    <View style={styles.rightContainer}>
                        <Text style={styles.title}>{this.props.movie.snippet.title}</Text>
                    </View>
                </View>
            </TouchableHighlight>

        );
    }
}

module.exports = VideoCell;