angular.module('nan.services', [])

.service('Speakers', function ($http, $q){

  this.get = function() {
  var dfd = $q.defer();
    //$http.jsonp('https://www.google.com/uds/Gfeeds?callback=JSON_CALLBACK&num=10&hl=es&output=json&q=http%3A%2F%2Famericaonlinegames.info%2Fforum%2Fexternal.php%3Ftype%3DRSS2%26forumids%3D17%26count%3D6&key=notsupplied&v=1.0&nocache=1430615831589')
    $http.jsonp('https://www.google.com/uds/Gfeeds?callback=JSON_CALLBACK&num=10&hl=es&output=json&q=http%3A%2F%2Frecorreruruguay.blogspot.com%2Ffeeds%2Fposts%2Fdefault%3Falt%3Drss&key=notsupplied&v=1.0&nocache=1430615831589')
   .success(function(data) {
      dfd.resolve(data);
    })
    .error(function(data) {
      dfd.reject(data);
    });

    return dfd.promise;
  };
})

.service('Agenda', function ($http, $q){

  this.get = function() {
    var dfd = $q.defer();

    $http.get('agenda.json')
    .success(function(data) {

      var day1 = _.filter(data, function(event){ return event.date =="day1" }),
          day2 = _.filter(data, function(event){ return event.date =="day2" });

      dfd.resolve({
        "day1": day1,
        "day2": day2
      });
    })
    .error(function(data) {
      dfd.reject(data);
    });

    return dfd.promise;
  };

  this.getEvent = function(eventId){
    var dfd = $q.defer();

    $http.get('agenda.json')
    .success(function(data) {
      var event = _.find(data, {id: eventId});
      dfd.resolve(event);
    })
    .error(function(data) {
      dfd.reject(data);
    });

    return dfd.promise;
  };
})

;
