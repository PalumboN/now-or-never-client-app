angular.module('nan.controllers', [])
.controller('MessagesCtrl', function($scope, $timeout, $ionicScrollDelegate, $state, socketProvider, contact) {

  $scope.data = {};
  $scope.me = JSON.parse(window.sessionStorage.user);
  $scope.messages = [];  
  $scope.messageCount = 5;
  $scope.data.message = "";
  $scope.noMoreTime = false

  var socket = socketProvider.current;

  socket.connect();

  socket.on('new_message', (function(_this) {
    return function(message) {
      return $scope.messages.push(message);
    };
  })(this));

  socket.on('find', (function(_this) {
    return function(user) {
      $scope.contact = user;
      contact.profile = user;
      $scope.messages.push({
        text: "Connected with " + user.name
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

.controller('LoginCtrl', function($scope, $state, facebookApi, geolocation) {

  if(window.sessionStorage.user) {
    console.log(window.sessionStorage.user);
    $state.go('main');
  };

  $scope.faceLogin = function() {
    facebookApi.login().then(function(data) {

      console.log(data);
      
      window.sessionStorage.accessToken = data.accessToken;

      facebookApi.getUser().then(function(user) {

        user.location = geolocation.currentPosition

        window.sessionStorage.user = JSON.stringify(user);

        window.location.reload();
      });
      
    });
  };

})

.controller('ProfileCtrl', function($scope, contact) {
  $scope.user = contact;
  $scope.showMeInteresan = false;
})

.controller('ConfigCtrl', function($scope) {
  $scope.user = JSON.parse(window.sessionStorage.user);
  $scope.showMeInteresan = true;
})
