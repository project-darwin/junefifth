window.app = angular.module('pricewise',
  ['ngCookies',
  'ngResource',
  'ui.bootstrap',
  'ui.router',
  'pricewise.controllers',
  'pricewise.services'
  ]);

angular.module('pricewise.controllers',
  ['pricewise.controllers.index',
  'pricewise.controllers.navbar',
  'pricewise.controllers.user'
  ]);

angular.module('pricewise.services',
  ['pricewise.services.global',
  'pricewise.services.user'
  ]);