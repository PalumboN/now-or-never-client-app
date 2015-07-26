angular.module('nan.controllers', [])
.controller('MessagesCtrl', function($scope, $timeout, $ionicScrollDelegate, $cookies, socketFactory, contact) {

  $scope.data = {};
  $scope.me = JSON.parse($cookies.user);
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
    return function(user) {
      $scope.contact = user;
      contact.profile = user.profile;
      $scope.messages.push({
        text: "Connected with " + user.profile.displayName
      });
    };
  })(this));

  socket.on('lost_user', (function(_this) {
    return function() {
      $scope.messages.push({
        text: "Searching..."
      });
      return socket.emit('searching', $scope.me);
    };
  })(this));

  $scope.messages.push({
    text: "Searching..."
  });

  socket.emit('searching', $scope.me);


  $scope.hideTime = true;

  var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  $scope.sendMessage = function() {
    if ($scope.data.message.length < 1) {
      return
    }
    message = {
      user: $scope.me,
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

.controller('ProfileCtrl', function($scope, contact) {
  $scope.user = contact;
  $scope.showMeInteresan = false;
})

.controller('ConfigCtrl', function($scope, $cookies) {
  $scope.user = JSON.parse($cookies.user);
  $scope.showMeInteresan = true;
})
