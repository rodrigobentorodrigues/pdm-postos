angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

// Controlador para listar postos
// .controller('PostoCtrl', function($scope, Chats) {
//
//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   };
//
// })

.controller('PostoCtrl', function($scope, $state, Postos) {

  $scope.postos = [];
  $scope.posto = {};

  $scope.updatePosto = function() {
    Postos.all().then(function(postos){
      $scope.postos = postos;
    });
  }

  $scope.updatePosto();


  $scope.createNewPosto = function(posto) {
    Postos.add(posto);
    $scope.updatePosto();
    $state.go('tab.postos');
  };

  $scope.toAddPage = function toAddPage() {
    $state.go('tab.cadastro');
  }

  $scope.addPosto = function(form) {
    $scope.createNewPosto($scope.posto).then(function functionName() {
      $state.go('tab.postos');
    });

  }

})

.controller('PrecosCtrl', function($scope) {})

// Buscar por ID
.controller('PostoDetailCtrl', function($scope, $stateParams, Postos) {
  $scope.posto = {};
  var x = Postos.get($stateParams.postoId);
  console.log("posto:"  + $scope.posto.name);
  console.log("postxo:"  + x.id);


  $scope.toAddPage = function addPrice() {
  }


})


// Controlador cadastro
.controller('MapaCtrl', function($scope, $ionicLoading, $compile, Postos) {

  var map = null;

  $scope.$on('$stateChangeSuccess', function(){
    if (map == null) {
      initialize();
      google.maps.event.addDomListener(window, 'load', initialize);
    }
  });

  function initialize() {

    var mapOptions = {
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

    //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
    var compiled = $compile(contentString)($scope);

    var infowindow = new google.maps.InfoWindow({
      content: compiled[0]
    });

    // google.maps.event.addListener(marker, 'click', function() {
    //   infowindow.open(map,marker);
    // });

    navigator.geolocation.getCurrentPosition(function(pos) {
      var positionNow = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
      $scope.map.setCenter(positionNow);
      // $scope.loading.hide();

      var aqui = new google.maps.Marker({
        position: positionNow,
        map: map,
        title: 'Você está aqui'
      });

      console.log(map.getCurrentPosition);

    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });


    var addMarker = function addMarker(posto) {
      console.log(posto);
      var local = new google.maps.LatLng(posto.lat, posto.lng);


      var aqui = new google.maps.Marker({
        position: local,
        map: map,
        title: 'Você está aqui'
      });

    }


    Postos.all().then(function addMarkers(postos) {
      for (var i = 0; i < postos.length; i++) {
        console.log("adicionou um markacor");
        var x = addMarker(postos[i]);
      }
    });

    // google.maps.event.addListener(map, 'click', function(event){
    //   console.log('aqui');
    //   var marker = new google.maps.Marker({
    //       position: event.latLng,
    //       map: map
    //   });
    //   console.log(event.latLng.lng());

      // google.maps.event.addListener(marker, 'click', function () {
      //   console.log('clicou');
      // });

    // });

    $scope.map = map;


  }
  google.maps.event.addDomListener(window, 'load', initialize);

});
