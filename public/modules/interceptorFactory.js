angular.module('app')
  .factory('InterceptorFactory', ['TokenService', function(TokenService) {
      // automatically attach Authorization header
      return {
        request: function(config) {
          var token = TokenService.getToken();
          config.headers.Authorization = token;
          return config;
        },

        // If a token was sent back, save it
        response: function(res) {
          if (res.data && res.data.data && res.data.data.token)
            TokenService.saveToken(res.data.data.token);
          return res;
        }
      }
}])
