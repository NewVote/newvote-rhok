'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/angular-material/angular-material.min.css',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic',
        'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,600,700',
        'public/lib/quill/quill.core.css',
        'public/lib/quill/quill.bubble.css',
        'public/lib/quill/quill.snow.css'
      ],
      js: 'public/dist/lib.min.js',
      individualJs: [
        'public/lib/lodash/dist/lodash.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        // 'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-material/angular-material.min.js',
        'public/lib/angular-aria/angular-aria.min.js',
        'public/lib/quill/quill.js',
        'public/lib/ngQuill/src/ng-quill.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/angular-update-meta/dist/update-meta.js',
        'public/lib/angular-chart/dist/angular-chart.min.js',
        'public/lib/chart.js/dist/Chart.min.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
