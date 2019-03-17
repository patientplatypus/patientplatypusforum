var Feed = module.exports = {
  feed: [],
  add: function(item) {
    Feed.feed.push(item);
  },
  displayOne: function() {
    returnItem = Feed.feed(0)
    Feed.feed.shift()
    return returnItem
  },
  displayAll: function(){
    return Feed.feed;
  }
}