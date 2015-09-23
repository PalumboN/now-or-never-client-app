angular.module('nan.controllers', [])

.controller('SearchCtrl', function($scope, $state, $cookies, socketProvider, contact) {

  var socket = socketProvider.current;
  $scope.me = JSON.parse($cookies.user);

  socket.on('find',  function(user) {
    console.log(user);
    contact.profile = user;
    $state.go("chat", user);
  });

  socket.emit('searching', $scope.me);
})


.controller('MessagesCtrl', function($scope, $timeout, $ionicScrollDelegate, $state, $cookies, socketProvider, contact) {

  $scope.contact = contact.profile;
  $scope.data = {};
  $scope.me = JSON.parse($cookies.user);
  $scope.messages = [];  
  $scope.messageCount = 5;
  $scope.data.message = "";
  $scope.noMoreTime = false

  var socket = socketProvider.current;

  socket.on('new_message', (function(_this) {
    return function(message) {
      return $scope.messages.push(message);
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

.controller('LoginCtrl', function($scope, $state, $cookies, facebookApi, geolocation) {

  // var yo = {
  //   birthday: "04/18/1993",
  //   cover: {
  //     id: "10204933777479410",
  //     offset_y: 24,
  //     source: "https://scontent.xx.fbcdn.net/hphotos-xpt1/t31.0-8/q82/s720x720/10520821_10204933777479410_7465816825665442407_o.jpg"
  //   },
  //   email: "nahueljumbo@hotmail.com",
  //   gender: "male",
  //   id: "10206329532532414",
  //   location: {
  //     latitude: -34.5820151,
  //     longitude: -58.432307599999994
  //   },
  //   name: "Nahuel Palumbo",
  //   picture: {
  //     data: {
  //       is_silhouette: false,
  //       url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfp1/v/t1.0-1/p200x200/10888368_10204785596694983_6656199760302407731_n.jpg?oh=b60e07b88d75e21d47cd73c82b5ca237&oe=5677C684&__gda__=1453452819_6e34277b43b41167496e14b4e060c47a"    
  //     }
  //   }
  // }

  // $cookies.user = JSON.stringify(yo);


  if($cookies.user) {
    $state.go('main');
  };

  $scope.faceLogin = function() {
    facebookApi.login().then(function(data) {

      $cookies.accessToken = data.accessToken;

      facebookApi.getUser().then(function(user) {

        user.location = geolocation.currentPosition

        $cookies.user = JSON.stringify(user);

        window.location.reload();
      });
      
    });
  };

})

.controller('ProfileCtrl', function($scope, $ionicHistory, contact) {
  $scope.user = contact.profile;
  $scope.showMeInteresan = false;
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
})

.controller('ConfigCtrl', function($scope, $ionicHistory, $cookies) {
  $scope.user = JSON.parse($cookies.user);
  $scope.showMeInteresan = true;
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
})
