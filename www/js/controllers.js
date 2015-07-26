angular.module('nan.controllers', [])

.controller('MessagesCtrl', function($scope, $timeout, $ionicScrollDelegate, socketFactory) {

  $scope.data = {};
  $scope.myId = JSON.parse($cookies.user).profile.displayName;
  $scope.messages = [];

  var socket = socketFactory({ ioSocket: io.connect('http://localhost:3000', { forceNew: true }) });

  socket.on('new_message', (function(_this) {
    return function(message) {
      return $scope.messages.push(message);
    };
  })(this));

  socket.on('find', (function(_this) {
    return function(userNick) {
      return $scope.messages.push({
        text: "Connected with " + userNick
      });
    };
  })(this));

  socket.on('lost_user', (function(_this) {
    return function() {
      $scope.messages.push({
        text: "Searching..."
      });
      return socket.emit('searching', '@s.nick');
    };
  })(this));

  $scope.messages.push({
    text: "Searching..."
  });

  socket.emit('searching', $scope.myId);

  $scope.hideTime = true;

  var alternate,
    isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  $scope.sendMessage = function() {
    alternate = !alternate;

    message = {
      userId: 12345,
      text: $scope.data.message
    };

    $scope.messages.push(message);

    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);

    socket.emit('send_message', message);
  };


  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };


  $scope.data = {};
  $scope.myId = '12345';
  $scope.messages = [];

})
.controller('LoginCtrl', function($scope, $cookies, $state) {
 $scope.getCookie = function() {
    return $cookies.user
  };
  if($scope.getCookie()){
    $state.go('main')
  }


})
