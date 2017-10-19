angular.module('starter.services', [])

// ->>


.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
  var self = this;

  // Handle query's and potential errors
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
  }

  // Proces a result set
  self.getAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }
    return output;
  }

  // Proces a single result
  self.getById = function(result) {
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }

  return self;
})

.factory('Postos', function($cordovaSQLite, DBA) {
  var self = this;

  self.all = function() {
    // return DBA.query("SELECT id, name, bandeira, lat, lng FROM posto")
    return DBA.query("SELECT * FROM posto")
      .then(function(result){
        return DBA.getAll(result);
      });
  }

  self.get = function(postoId) {
    var parameters = [postoId];
    return DBA.query("SELECT id, name, bandeira, lat, lng FROM posto WHERE id = (?)", parameters)
      .then(function(result) {

        return DBA.getById(result);
      });
  }

  self.add = function(posto) {
    var parameters = [posto.name, posto.bandeira, posto.lat, posto.lng];
    return DBA.query("INSERT INTO posto (name, bandeira, lat, lng) VALUES (?, ?, ?, ?)", parameters);
  }

  return self;
})

// -> preços
.factory('Precos', function($cordovaSQLite, DBA) {
  var self = this;

  self.allByPosto = function(postoId) {
    var parameters = [postoId];
    return DBA.query("SELECT id, gas, alc FROM preco WHERE id_posto = (?) order by id desc", parameters)
      .then(function(result){
        return DBA.getAll(result);
      });
  }

  self.add = function(preco) {
    var parameters = [preco.id_posto, preco.gas, preco.alc];
    return DBA.query("INSERT INTO preco (id_posto, gas, alc) VALUES (?, ?, ?)", parameters);
  }

  return self;
})

// ->>

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
