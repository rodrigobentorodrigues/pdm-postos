angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

// Controlador para listar postos
.controller('PostoCtrl', function($scope, Chats) {

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

})

.controller('PrecosCtrl', function($scope) {})

// Buscar por ID
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})


// Controlador cadastro
.controller('CadastroCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
