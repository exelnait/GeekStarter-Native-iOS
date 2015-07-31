'use strict';

var apiKey = "AIzaSyAzsSSccPSAAcfk-nk8qSljLsQq8SZ5N0Y";//ключ API
var React = require('react-native');
var {
    Image,
    PixelRatio,
    WebView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Component,
    ActivityIndicatorIOS
    } = React;

class MovieScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            status: 'No Page Loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
            statisticsLoaded: false,
            id: this.props.movie.snippet.resourceId?this.props.movie.snippet.resourceId.videoId:this.props.movie.id.videoId
    };
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        fetch('https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2C+statistics&id='+this.state.id+'&key='+apiKey)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    statistics : responseData.items[0].statistics,
                    statisticsLoaded : true
                });

                console.log(this.state.statistics)
            })
            .done();
    }
    render() {
        console.log(this.props.movie)
        if (!this.state.statisticsLoaded) {
            return (
                <View style={styles.container}>
                    <ActivityIndicatorIOS
                        hidden='true'
                        size='large'/>
                </View>
            );
        } else {
            return (
                <ScrollView>
                    <WebView
                        ref={'webview'}
                        automaticallyAdjustContentInsets={false}
                        style={styles.webView}
                        url={'https://www.youtube.com/embed/'+this.state.id+'?showinfo=0'}
                        startInLoadingState={true}
                        />
                    <View style={styles.contentContainer}>
                        <Text>
                            {this.props.movie.snippet.title}
                        </Text>
                        <Text style={styles.viewCount}>
                            {this.state.statistics.viewCount} просмотров
                        </Text>
                    </View>
                </ScrollView>
            );
        }
    }
}

var styles = StyleSheet.create({
    contentContainer: {
        padding: 10
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    detailsImage: {
        flex: 1,
        backgroundColor: '#eaeaea',
        marginRight: 10
    },
    webView: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        height: 190
    },
    viewCount: {
      fontSize: 12,
      color: '#CCCCCC',
      marginTop: 5
    }
});

module.exports = MovieScreen;
/*
 <Text>
 {this.props.movie.snippet.publishedAt}
 </Text>
 <Text>
 {this.props.movie.snippet.description}
 </Text>
 <Text>
 {this.state.statistics.commentCount} комментариев
 </Text>
*/