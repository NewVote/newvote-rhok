'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          console.log('validating with this thing')
          if (password) {
            var result = PasswordValidator.getResult(password);
            if (result.requiredTestErrors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.requiredTestErrors;
              ngModel.$setValidity('passwordVerify', false);
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
              ngModel.$setValidity('passwordVerify', true);
            }
          }
          return status;
        };
      }
    };
  }]);
