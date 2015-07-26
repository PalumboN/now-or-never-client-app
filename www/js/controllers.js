angular.module('nan.controllers', [])

.controller('MessagesCtrl', function($scope, $timeout, $ionicScrollDelegate, $cookies, socketFactory) {

  $scope.data = {};
  $scope.myId = JSON.parse($cookies.user).profile.displayName;
  $scope.messages = [];  
  $scope.messageCount = 5;
  $scope.data.message = "";
  $scope.noMoreTime = false
  

  var socket = socketFactory({ ioSocket: io.connect('http://172.17.31.99:3000', { forceNew: true }) });

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

  var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  $scope.sendMessage = function() {
    if ($scope.data.message.length < 1) {
      return
    }
    message = {
      userId: $scope.myId,
      text: $scope.data.message
    };

    $scope.messages.push(message);

    $scope.data.message = "";
    $ionicScrollDelegate.scrollBottom(true);

    socket.emit('send_message', message);

    $scope.messageCount--;
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

  $scope.timeOutBaby = function() {
    return ($scope.messageCount == 0 || $scope.noMoreTime)
  };

  $scope.finishCount = function () {
      $scope.noMoreTime = true
  }


})
.controller('LoginCtrl', function($scope, $cookies, $state) {
 $scope.getCookie = function() {
    return $cookies.user
  };
  if($scope.getCookie()){
    $state.go('main')
  }


})
