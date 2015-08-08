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
.run(function($ionicPlatform) {
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
    loginWindow = null, 
    loginURL = 'https://www.facebook.com/dialog/oauth',
    fbAppId = "984062531613818",
    redirectURL = "http://now-or-never-server.herokuapp.com/auth/facebook/callback",
    cordovaOAuthRedirectURL = "https://www.facebook.com/connect/login_success.html",
    scope = "email",
    loginProcessed = false;


  // Inappbrowser load start handler: Used when running in Cordova only
  function loginWindow_loadStartHandler(promise){
    return function(event) {
      console.log("LoadStart: " + event.url)
      var url = event.url;
      if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
          // When we get the access token fast, the login window (inappbrowser) is still opening with animation
          // in the Cordova app, and trying to close it while it's animating generates an exception. Wait a little...
          var timeout = 500;
          setTimeout(function () {
              loginWindow.close();
          }, timeout);
          oauthCallback(promise, url);
      }
    }
  };

  /**
   * Called  by the loginWindow loadstart event
   * handler defined in the login() function (when the app is running in the Cordova/PhoneGap container).
   * @param url - The oautchRedictURL called by Facebook with the access_token in the querystring at the ned of the
   * OAuth workflow.
   */
  function oauthCallback(promise, url) {
      // Parse the OAuth data received from Facebook
      var queryString,
          obj;

      loginProcessed = true;
      if (url.indexOf("access_token=") > 0) {
          queryString = url.substr(url.indexOf('#') + 1);
          obj = parseQueryString(queryString);
          promise.resolve({ accessToken: obj['access_token'] });
      } else if (url.indexOf("error=") > 0) {
          queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
          obj = parseQueryString(queryString);
          promise.reject({ error: obj.error });
      } else {
          promise.reject({ error: "not_authorized" });
      }
  };

  // Inappbrowser exit handler: Used when running in Cordova only
  function loginWindow_exitHandler(promise){ 
    return function(){
      console.log('exit and remove listeners');
      // Handle the situation where the user closes the login window manually before completing the login process
      if (loginCallback && !loginProcessed) promise.reject({ error: "user_cancelled" });
      loginWindow.removeEventListener('loadstop', loginWindow_loadStopHandler(promise));
      loginWindow.removeEventListener('exit', loginWindow_exitHandler(promise));
      loginWindow = null;
      console.log('done removing listeners');
    }
  }

  function parseQueryString(queryString) {
    var qs = decodeURIComponent(queryString),
        obj = {},
        params = qs.split('&');
    params.forEach(function (param) {
        var splitter = param.split('=');
        obj[splitter[0]] = splitter[1];
    });
    return obj;
  };

  // Called by loginWindow in browser Oauth
  var onmessage = function (promise) { 
    return function (event) {
      var key = event.message ? "message" : "data";
      promise.resolve(event[key]);
    }
  };


  var login = function() {
    var deferred = $q.defer();

    if (this.runningCordova()) redirectURL = cordovaOAuthRedirectURL;

    loginWindow = window.open(loginURL + '?client_id=' + fbAppId + '&redirect_uri=' + redirectURL +
      '&response_type=token&scope=' + scope, '_blank', 'location=no,clearcache=yes');

    window.addEventListener("message", onmessage(deferred), false);
    loginWindow.addEventListener("message", onmessage(deferred), false);

    if (this.runningCordova()) {
      loginWindow.addEventListener('loadstart', loginWindow_loadStartHandler(deferred));
      loginWindow.addEventListener('exit', loginWindow_exitHandler(deferred));
    }

    return deferred.promise;
  };

  return {
    runningCordova: function(){ return window.runningCordova },
    login: login
  };
});

document.addEventListener("deviceready", function () {
  window.runningCordova = true;
}, false);
