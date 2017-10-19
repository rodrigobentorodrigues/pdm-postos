angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

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

})

.factory('PostoIdDetail', function(){
  return { id: null };
})


.controller('PrecosCtrl', function($scope, $state, $stateParams, PostoIdDetail, Precos) {
  console.log(PostoIdDetail.id);
  $scope.preco = {
    id_posto : PostoIdDetail.id
  };

  $scope.addPriceHistory = function () {
    console.log($scope.preco);
    Precos.add($scope.preco).then(function functionName() {
      $state.go('tab.detail', { postoId: PostoIdDetail.id });
    });
  }

})


.controller('PostoDetailCtrl', function($scope, $state, $stateParams, Postos, Precos, PostoIdDetail) {

  $scope.precos = [];
  $scope.preco = {};

  $scope.updatePrecos = function(id_posto) {
    console.log("idposto:" + id_posto);
    Precos.allByPosto(id_posto).then(function(precos){

      $scope.precos = precos;
      console.log(precos);
    });
  }


  console.log("pegando posto");
  Postos.get($stateParams.postoId).then(function (result) {
    $scope.posto = result;
    PostoIdDetail.id = result.id;
    // atualizando precos do posto
    $scope.updatePrecos(PostoIdDetail.id);
  });


  $scope.toAddPrice = function addPrice() {
    $state.go('tab.precos');
  }

})


// Controlador mapa
.controller('MapaCtrl', function($scope, $ionicLoading, $compile, Postos) {

  var map = null;
  var markers = [];

  $scope.$on('$stateChangeSuccess', function(){
    if (map == null) {
      initialize();
      google.maps.event.addDomListener(window, 'load', initialize);
      $scope.updatePostosOnMap();
    } else {
      console.log("recarregando marcadores");
      clearMarkers();
      $scope.updatePostosOnMap();
    }
  });

  $scope.addMarker = function addMarker(posto) {
    console.log(posto);
    var local = new google.maps.LatLng(posto.lat, posto.lng);

    var infowindow = new google.maps.InfoWindow({
      content: '<div><h4>'+ posto.name + '</h4><p>Bandeira: ' + posto.bandeira + '</p></div>'
    });
    for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
    var aqui = new google.maps.Marker({
      position: local,
      map: map,
      icon: "../img/myicon.png",
      title: posto.name
    });

    aqui.addListener('click', function() {
      infowindow.open(map, aqui);
    });

    markers.push(aqui);

  }

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
      markers.pop(markers[i]);
    }
  }

  $scope.updatePostosOnMap = function updatePostoOnMap() {
    Postos.all().then(function addMarkers(postos) {
      for (var i = 0; i < postos.length; i++) {
        $scope.addMarker(postos[i]);
      }
    });
  }

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

    $scope.map = map;

    map.addListener('click', function(event) {
      console.log("LAT: " + event.latLng.lat() + " LNG: " + event.latLng.lng());
    });


  }


});
