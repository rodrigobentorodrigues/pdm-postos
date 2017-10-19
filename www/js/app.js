angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform,  $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("postos.db");
    } else {
      // Ionic serve syntax
      db = window.openDatabase("postos.db", "1.0", "My app", -1);
    }

    console.log('criando banco');
    $cordovaSQLite.execute(db, "drop table posto");
    $cordovaSQLite.execute(db, "drop table preco");

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS posto (id integer primary key autoincrement, name text, bandeira text, lat float, lng float)");

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS preco (id integer primary key autoincrement, id_posto integer, gas float, alc float, die float, datapreco timestamp default current_timestamp, FOREIGN KEY (id_posto) REFERENCES posto(id))");

    $cordovaSQLite.execute(db, "INSERT INTO posto (name, bandeira, lat, lng) VALUES ('Posto Tico e Teca', 'BR', -6.756094290841853, -38.23115587234497)");

    $cordovaSQLite.execute(db, "INSERT INTO preco (id_posto, gas, alc, die) VALUES (1, 3.99, 2.89, 2.95)");

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.postos', {
    url: '/postos',
    views: {
      'tab-postos': {
        templateUrl: 'templates/tab-postos.html',
        controller: 'PostoCtrl'
        // controller: 'DashCtrl'
      }
    }
  })

    .state('tab.cadastro', {
      url: '/postos',
      views: {
        'tab-postos': {
          templateUrl: 'templates/tab-cadastro.html',
          controller: 'PostoCtrl'

        }
      }
    })

    .state('tab.detail', {
      url: '/postos/:postoId',
      views: {
        // 'chat-detail': {
          'tab-postos': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'PostoDetailCtrl'

        }
      }
    })

    .state('tab.precos', {
      url: '/postos/precos/:postoId',
      views: {
        // 'chat-detail': {
          'tab-postos': {
          templateUrl: 'templates/tab-precos.html',
          controller: 'PrecosCtrl'
          // controller: 'PostoDetailCtrl'

        }
      }
    })

  // .state('tab.postos', {
  //     url: '/postos',
  //     views: {
  //       'tab-postos': {
  //         templateUrl: 'templates/tab-postos.html',
  //         controller: 'PostoCtrl'
  //       }
  //     }
  //   })
    // .state('tab.chat-detail', {
    //   url: '/chats/:chatId',
    //   views: {
    //     'tab-chats': {
    //       templateUrl: 'templates/chat-detail.html',
    //       controller: 'ChatDetailCtrl'
    //     }
    //   }
    // })

  // .state('tab.precos', {
  //   url: '/precos',
  //   views: {
  //     'tab-precos': {
  //       templateUrl: 'templates/tab-precos.html',
  //       controller: 'PrecosCtrl'
  //     }
  //   }
  // })

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapaCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/postos');

});
