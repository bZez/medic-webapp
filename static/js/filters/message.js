var format = require('../modules/format'),
    _ = require('underscore');

(function () {

  'use strict';

  var module = angular.module('inboxFilters');

  var getFormName = function(TranslateFrom, message, forms) {
    var form = _.findWhere(forms, { code: message.form });
    if (form) {
      return TranslateFrom(form.name);
    }
    return message.form;
  };

  module.filter('summary', ['$translate', 'TranslateFrom',
    function($translate, TranslateFrom) {
      return function(record, forms) {
        if (!record || !forms) {
          return '';
        }
        if (record.form) {
          return getFormName(TranslateFrom, record, forms);
        }
        if (record.message && record.message.message) {
          return record.message.message;
        }
        if (record.tasks &&
            record.tasks[0] &&
            record.tasks[0].messages &&
            record.tasks[0].messages[0]) {
          return record.tasks[0].messages[0].message;
        }
        return $translate.instant('tasks.0.messages.0.message');
      };
    }
  ]);

  module.filter('title', ['$translate', 'TranslateFrom',
    function($translate, TranslateFrom) {
      return function(record, forms) {
        if (!record || !forms) {
          return '';
        }
        if (record.form) {
          return getFormName(TranslateFrom, record, forms);
        }
        if (record.kujua_message) {
          return $translate.instant('Outgoing Message');
        }
        return $translate.instant('sms_message.message');
      };
    }
  ]);

  module.filter('clinic', function () {
    return format.clinic;
  });

}());
