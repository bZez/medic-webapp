var _ = require('underscore');

(function () {

  'use strict';

  var inboxControllers = angular.module('inboxControllers');

  inboxControllers.controller('ConfigurationTranslationLanguagesCtrl',
    ['$scope', '$rootScope', 'Settings', 'UpdateSettings', 'ExportProperties',
    function ($scope, $rootScope, Settings, UpdateSettings, ExportProperties) {

      var createLocaleModel = function(settings, locale) {
        var result = {
          locale: locale
        };
        var content = ExportProperties(settings, locale.code);
        if (content) {
          var blob = new Blob([ content ], { type: 'text/plain' });
          result.export = {
            name: 'messages-' + locale.code + '.properties',
            url: (window.URL || window.webkitURL).createObjectURL(blob)
          };
        }
        return result;
      };

      var setLanguageStatus = function(locale, disabled) {
        Settings(function(err, res) {
          if (err) {
            return console.log('Error loading settings', err);
          }
          var update = _.findWhere(res.locales, { code: locale.code });
          if (!update) {
            return console.log('Could not find locale to update');
          }
          update.disabled = disabled;
          UpdateSettings({ locales: res.locales }, function(err) {
            if (err) {
              return console.log('Error updating settings', err);
            }
            var model = _.findWhere($scope.languagesModel.locales, { code: locale.code });
            if (model) {
              model.disabled = disabled;
            }
          });
        });
      };

      Settings(function(err, res) {
        if (err) {
          return console.log('Error loading settings', err);
        }
        $scope.languagesModel = {
          default: {
            locale: res.locale,
            outgoing: res.locale_outgoing
          },
          locales: _.map(res.locales, function(locale) {
            return createLocaleModel(res, locale);
          })
        };
      });
      $scope.prepareEditLanguage = function(locale) {
        $rootScope.$broadcast('EditLanguageInit', locale);
      };
      $scope.prepareDeleteLanguage = function(locale) {
        $rootScope.$broadcast('DeleteLanguageInit', locale);
      };
      $scope.setLocale = function(locale) {
        UpdateSettings({ locale: locale.code }, function(err) {
          if (err) {
            return console.log('Error updating settings', err);
          }
          $scope.languagesModel.default.locale = locale.code;
        });
      };
      $scope.setLocaleOutgoing = function(locale) {
        UpdateSettings({ locale_outgoing: locale.code }, function(err) {
          if (err) {
            return console.log('Error updating settings', err);
          }
          $scope.languagesModel.default.outgoing = locale.code;
        });
      };
      $scope.$on('LanguageUpdated', function(e, data) {
        $scope.languagesModel.locales = data.locales;
      });
      $scope.disableLanguage = function(locale) {
        setLanguageStatus(locale, true);
      };
      $scope.enableLanguage = function(locale) {
        setLanguageStatus(locale, false);
      };
      $scope.prepareImport = function(locale) {
        $rootScope.$broadcast('ImportTranslationInit', locale);
      };

    }
  ]);

}());