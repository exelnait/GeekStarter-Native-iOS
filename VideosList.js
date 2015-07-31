var channelId = "UCFduc8vLZuz-6tkOm0LDVJw";
var apiKey = "AIzaSyAzsSSccPSAAcfk-nk8qSljLsQq8SZ5N0Y";//ключ API
var VIDEOS_URL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+contentDetails&maxResults=12&playlistId=UUFduc8vLZuz-6tkOm0LDVJw&key="+apiKey;

var React = require('react-native');
var {
    ActivityIndicatorIOS,
    StyleSheet,
    ListView,
    View,
    PixelRatio,
    Component,
    TextInput
    } = React;
var VideoCell = require('./VideosCell');
var VideoScreen = require('./VideoScreen');

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 5,
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#cccccc'
    },
    title: {
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'left'
    },
    thumbnail: {
        width: 90,
        height: 45,
        marginRight: 10
    },
    searchBar: {
        marginTop: 64,
        padding: 3,
        paddingLeft: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchBarInput: {
        fontSize: 15,
        flex: 1,
        height: 30
    },
    spinner: {
        width: 30
    },
    separator: {
        height: 1,
        backgroundColor: '#eeeeee'
    }
});

var timeoutID = null;
var LOADING = {};
var resultsCache = {
    dataForQuery: {},
    nextPageNumberForQuery: {},
    totalForQuery: {},
};
class VideosList extends Component {
    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.state = {
            isLoading: false,
            isLoadingTail: false,
            loaded: false,
            filter: '',
            queryNumber: 0,
            dataSource: dataSource
        };
    }
    componentDidMount() {
        this.loadLastVideos();
    }
    openVideo(movie) {
        console.log(movie);
        this.props.navigator.push({
            title: '',
            component: VideoScreen,
            passProps: {movie},
            rightButtonTitle: 'Поделиться'
        });
    }
    renderMovie(movie) {
        return (
            <VideoCell
                onSelect={() => this.openVideo(movie)}
                movie={movie}
                />
        );
    }
    getDataSource(videos) {
        return this.state.dataSource.cloneWithRows(videos);
    }
    loadLastVideos() {
        fetch(VIDEOS_URL)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    dataSource: this.getDataSource(responseData.items),
                    loaded: true
                });
                console.log(responseData)
            })
            .done();
    }
    searchByFilter(query) {
        timeoutID = null;
        this.setState({
            filter: query
        });
        var cachedResultsForQuery = resultsCache.dataForQuery[query];
        if (cachedResultsForQuery) {
            if (!LOADING[query]) {
                this.setState({
                    dataSource: this.getDataSource(cachedResultsForQuery),
                    isLoading: false
                });
            } else {
                this.setState({isLoading: true});
            }
            return;
        }
        LOADING[query] = true;
        resultsCache.dataForQuery[query] = null;
        this.setState({
            isLoading: true,
            queryNumber: this.state.queryNumber + 1,
            isLoadingTail: false
        });
        fetch('https://www.googleapis.com/youtube/v3/search?part=id%2C+snippet&channelId='+channelId+'&maxResults='+10+'&order=relevance&q='+query+'&key='+apiKey)
            .then((response) => response.json())
            .catch((error) => {
                LOADING[query] = false;
                resultsCache.dataForQuery[query] = undefined;

                this.setState({
                    dataSource: this.getDataSource([]),
                    isLoading: false
                });
            })
            .then((responseData) => {
                LOADING[query] = false;
                resultsCache.totalForQuery[query] = responseData.total;
                resultsCache.dataForQuery[query] = responseData.movies;
                resultsCache.nextPageNumberForQuery[query] = 2;

                if (this.state.filter !== query) {
                    // do not update state if the query is stale
                    return;
                }
                console.log(responseData.items)
                this.setState({
                    isLoading: false,
                    dataSource: this.getDataSource(responseData.items)
                });
            })
            .done();

    }
    onSearchChange(parent, event) {
        var filter = event.nativeEvent.text.toLowerCase();
        clearTimeout(timeoutID);
        if (filter == '') {
            parent.loadLastVideos();
        } else {
            timeoutID = setTimeout(() => parent.searchByFilter(filter), 300);
        }
    }
    render() {
        if (!this.state.loaded) {
            return (
                <View style={styles.container}>
                    <ActivityIndicatorIOS
                        hidden='true'
                        size='large'/>
                </View>
            );
        }
        return (
            <View style={{'flex':1, 'marginBottom':48}}>
                <SearchBar
                    onSearchChange={this.onSearchChange}
                    isLoading={this.state.isLoading}
                    parent={this}
                    />
                <View style={styles.separator} />
                <ListView
                    ref="listview"
                    renderFooter={this.renderFooter}
                    onEndReached={this.onEndReached}
                    automaticallyAdjustContentInsets={false}
                    keyboardDismissMode="onDrag"
                    keyboardShouldPersistTaps={true}
                    showsVerticalScrollIndicator={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderMovie.bind(this)}
                    />
            </View>
        )
    }
}
class SearchBar extends Component {
    render() {
        return (
            <View style={styles.searchBar}>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChange={this.props.onSearchChange.bind(this, this.props.parent)}
                    placeholder="Найти видео..."
                    onFocus={this.props.onFocus}
                    style={styles.searchBarInput}
                    />
                <ActivityIndicatorIOS
                    animating={this.props.isLoading}
                    style={styles.spinner}
                    />
            </View>
        );
    }
}

module.exports = VideosList;