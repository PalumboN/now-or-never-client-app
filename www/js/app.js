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
    console.log($window.cordova);
    console.log(window.plugins);
    console.log(window.ionic);
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
});
