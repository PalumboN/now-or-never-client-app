angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

angular.module('nan', [
  'ionic',
  'btford.socket-io',
  'nan.controllers',
  'nan.services',
  'nan.filters',
  'nan.directives',
  'ngMap',
  'ngCordova',
  'timer',
  'jlareau.pnotify',
  'ngCookies'
])
.run(function($ionicPlatform, $window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

}).config(function($ionicConfigProvider) {
  // remove back button previous title text
  // use unicode em space characters to increase touch target area size of back button
  $ionicConfigProvider.backButton.previousTitleText(false).text('&emsp;&emsp;');
})
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'templates/main.html'
    })
    .state('config', {
      url: '/config',
      templateUrl: 'templates/config.html',
      controller: 'ConfigCtrl'
    })
    .state('contactProfile', {
      url: '/profile',
      templateUrl: 'templates/config.html',
      controller: 'ProfileCtrl'
    })
    .state('chat', {
      url: '/chat',
      templateUrl: 'templates/chat.html',
      controller: 'MessagesCtrl',
      onEnter: function(socketProvider){
        socketProvider.current.connect()
        console.log("Connected");
      },
      onExit: function(socketProvider){
        socketProvider.current.disconnect()
        console.log("Disconnected");
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })


   $urlRouterProvider.otherwise('/login');

})


.factory("contact",function() { return {}; })


.factory("socketProvider", function(socketFactory) { 
  return { current: socketFactory({ ioSocket: io.connect('http://now-or-never-server.herokuapp.com', { forceNew: true }) }) };
})


.factory("facebookApi", function($q) { 

  var 
    loginURL = 'https://www.facebook.com/dialog/oauth',
    fbAppId = "984062531613818",
    redirectURL = "http://now-or-never-server.herokuapp.com/auth/facebook/callback",
    cordovaOAuthRedirectURL = "https://www.facebook.com/connect/login_success.html",
    scope = "email";

  var onmessage = function (promise) { 
    return function (event) {
      var key = event.message ? "message" : "data";
      promise.resolve(event[key]);
    }
  };


  var login = function() {
    var deferred = $q.defer();

    var loginWindow = window.open(loginURL + '?client_id=' + fbAppId + '&redirect_uri=' + redirectURL +
      '&response_type=token&scope=' + scope, '_blank', 'location=no,clearcache=yes');

    window.addEventListener("message", onmessage(deferred), false);
    loginWindow.addEventListener("message", onmessage(deferred), false);

    return deferred.promise;
  };


  return {
    login: login
  }; 

});
