'use strict';

angular.module('core').service('UploadService', ['Upload', '$q',
  function (Upload, $q) {

    var svc = this;

    svc.upload = function(file) {
      if (file && !file.$error) {
        file.upload = Upload.upload({
          url: 'https://api.cloudinary.com/v1_1/newvote/upload',
          data: {
            file: file,
            upload_preset: 'qhf7z3qa'
          }
        }).progress(function (e) {
          file.progress = Math.round((e.loaded * 100.0) / e.total);
          file.status = 'Uploading... ' + file.progress + '%';
        }).success(function (data, status, headers, config) {
          file.result = data;
        }).error(function (data, status, headers, config) {
          file.result = data;
        });
      }
      return file.upload || $q.reject();
    };

  }
]);
