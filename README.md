![Keepr Logo](logo-keepr.png "KEEPR")
KEEPR - A simple list of Angular components

[![Build Status](https://travis-ci.org/willmendesneto/keepr.png?branch=master)](https://travis-ci.org/willmendesneto/keepr)
[![Coverage Status](https://coveralls.io/repos/willmendesneto/keepr/badge.svg?branch=master)](https://coveralls.io/r/willmendesneto/keepr?branch=master)
=================

This project is a module with a list of services, directives and filters for begin your application with idea of simplify your bootstrap with Angular.


## 3rd party libraries dependencies ##
If you use CryptoOfflineStorageService, you can use CryptoJS file (http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/tripledes.js). If this library don't exists in DOM, this module works without crypt function

### Installation

1 - Via bower

```bash
$ bower install angular-keepr
```

2 - Clone this repository and access the generated folder

```bash
$ git clone git://github.com/willmendesneto/keepr.git [project-name]
$ cd [project-name]
```
Once you have keepr in your project, just include 'keepr' as a dependency in your Angular application and you’re good to go. It's works!

```javascript
    angular.module('myModule', ['keepr'])
```

### Services
* AlertService: Provide a Alert service for application
* CryptoLocalStorageService: Provide a service for Crypt/Decrypt localStorage data in application
* NotifyService: Provide a HTML5 Nitification service for intercept application messages
* HttpModel: Provide a simple $http model
* OfflineModel: Provide a model offline operations; Removed for [https://github.com/willmendesneto/ngOfflineModel](https://github.com/willmendesneto/ngOfflineModel)
* Speech: Provide a HTML5 Speech service in application

Services example:
http://plnkr.co/edit/zXMowcQ47GbxtDa1J8uB?p=info

### Filters
* camelCase: Provide camelcase filter for application
* capitalize: Provide capitalize filter for application
* charactersQuantity: Returns string filtered based in characters quantity + suffix
* conditional: Returns string conditional based in params passed for application
* encodeUri: Returns string encoded based in URI params
* inflector: Returns string filtered based in URI params
* list: Returns string list + string separator based in string value
* max: Returns maximum value based in string value
* min: Returns minimum value based in string value
* snakeCase: Returns string in snakeCase format based in param
* trim: Returns string without spaces based in param
* uncapitalize: Returns string with first character in lower case
* unique: Filter array and returns unique values in array
* validateEmail: Filter used for Email valid verificattion
* wordsQuantity: Filter string for returns string with words quantitu specified

Filters example:
http://plnkr.co/edit/Rln28ZDMpdXxO4ZVadNG?p=info

### Directives
* kpFlipContent: Add flip content for images in application
* kpMask: Add masks in input fields based in mask string
* kpPrintContent: Print html content based in configuration params
* kpLazyScroll: Add scroll spy in document for load images
* kpImageLazyLoad: Add lazy load for images in application

Directives example:
http://plnkr.co/edit/khcTtw2UYrysPROKwVIP?p=preview


## Author

**Wilson Mendes (willmendesneto)**
+ <https://plus.google.com/+WilsonMendes>
+ <https://twitter.com/willmendesneto>
+ <http://github.com/willmendesneto>


New features comming soon.
