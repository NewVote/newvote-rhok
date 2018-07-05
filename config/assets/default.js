'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/angular-material/angular-material.css',
        'public/lib/quill/quill.core.css',
        'public/lib/quill/quill.bubble.css',
        'public/lib/quill/quill.snow.css',
        'public/lib/angular-ui-carousel/dist/ui-carousel.min.css',
        'public/lib/ang-accordion/css/ang-accordion.css',

        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic',
        'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,600,700'
      ],
      js: [
        'public/lib/lodash/dist/lodash.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        // 'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/quill/quill.js',
        'public/lib/ngQuill/src/ng-quill.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/angular-update-meta/dist/update-meta.js',
        'public/lib/chart.js/dist/Chart.js',
        'public/lib/angular-chart.js/dist/angular-chart.js',
        'public/lib/angular-material-icons/angular-material-icons.js',
        'public/lib/ngstorage/ngStorage.js',
        'public/lib/angular-ui-carousel/dist/ui-carousel.min.js',
        'public/lib/angular-recaptcha/release/angular-recaptcha.js',
        'public/lib/ang-accordion/js/ang-accordion.js'

      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
