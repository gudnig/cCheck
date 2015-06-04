"use strict";angular.module("cCheckApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/unauthorized",{templateUrl:"views/unauthorized.html"}).when("/addTrainee",{templateUrl:"views/addtrainee.html",controller:"FightersCtrl"}).when("/addSession",{templateUrl:"views/addsession.html",controller:"SessionsCtrl"}).otherwise({redirectTo:"/login"})}]).constant("API_URL","https://ccheckapi.herokuapp.com/").run(["$rootScope","$location","authService",function(a,b,c){function d(a,b){var c=!1;return b.forEach(function(b){0===b.localeCompare(a)&&(c=!0)}),c}var e=["/login","/about"],f=["/addTrainee"];a.$on("$routeChangeError",function(a,c,d,e){e.authenticated===!1&&b.path("/login")}),a.$on("$routeChangeStart",function(){var a=b.path();d(a,e)||c.loggedIn()?d(a,f)&&"Þjálfari"!==c.role()&&b.path("/unauthorized"):b.path("/login")})}]).config(["$httpProvider",function(a){a.interceptors.push("authInterceptor")}]).config(["$resourceProvider",function(a){a.defaults.stripTrailingSlashes=!1}]).config(["datepickerConfig",function(a){a.showButtonBar=!1}]).controller("NavController",["$scope","$location","authService",function(a,b,c){a.isActive=function(a){return a===b.path()},a.logout=function(){c.logout(),b.path("/login")},a.loggedIn=function(){return c.loggedIn()?!0:!1},a.isTrainer=function(){return c.loggedIn()?"Þjálfari"===c.role():!1}}]),angular.module("cCheckApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("cCheckApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("cCheckApp").controller("LoginCtrl",["$scope","$location","authService",function(a,b,c){a.user="",a.pass="",a.login=function(){c.login(a.user,a.pass).then(function(){b.path("/")})}}]),angular.module("cCheckApp").factory("authService",["$http","$q","$window","API_URL",function(a,b,c,d){function e(){return k}function f(e,f){var g=b.defer();return a.post(d+"api-token-auth/",{username:e,password:f}).then(function(a){k={Token:a.data.token,Name:a.data.name,Status:a.data.status},c.sessionStorage.setItem("user",JSON.stringify(k)),l=!0,g.resolve(k)},function(a){g.reject(a)}),g.promise}function g(){c.sessionStorage.user=null,k=null,l=!1}function h(){return l}function i(){return l?k.Status:"guest"}function j(){c.sessionStorage.user&&(k=JSON.parse(c.sessionStorage.getItem("user")),k&&(l=!0))}var k,l=!1;return j(),{login:f,getUser:e,logout:g,loggedIn:h,role:i}}]),angular.module("cCheckApp").factory("authInterceptor",["$rootScope","$q","$window","$location",function(a,b,c,d){return{request:function(a){a.headers=a.headers||{};var b=JSON.parse(sessionStorage.getItem("user"));return b&&(a.headers.Authorization="Token "+b.Token),a},response:function(a){return 401===a.status&&d.path("/login"),a||b.when(a)}}}]),angular.module("cCheckApp").factory("fighters",["$resource","API_URL",function(a,b){return a(b+"fighters/:id")}]).factory("users",["$resource","API_URL",function(a,b){return a(b+"users/:id")}]).factory("sessions",["$resource","API_URL",function(a,b){return a(b+"sessions/:id")}]),angular.module("cCheckApp").controller("FightersCtrl",["$scope","fighters",function(a,b){a.statuses=["Nýliði","Bardagamaður","Þjálfari"],a.alerts=[],a.closeAlert=function(b){a.alerts.splice(b,1)},a.newFighter={},a.newFighter.status="Nýliði",a.newFighter.name="",a.load=!1,a.newFighter.user=null,a.dateOptions={formatYear:"yy",startingDay:1},a.addFighter=function(){a.alerts=[];var c=b.save(a.newFighter);a.load=!0,c.$promise.then(function(b){a.newFighter={},a.newFighter.status="Nýliði",a.alerts.push({type:"success",msg:"Bardagamaður: "+b.name+" hefur verið skráður"}),a.load=!1},function(b){console.log(b.data),a.alerts.push({type:"danger",msg:"Villa kom upp, athugaðu villuskilaboðin og reyndu aftur: "+JSON.stringify(b.data)}),a.load=!1})}}]),angular.module("cCheckApp").controller("SessionsCtrl",["$scope","fighters","sessions","$q",function(a,b,c,d){a.statuses=[{status:"Allir",filter:""},{status:"Nýliðar",filter:"Nýliði"},{status:"Bardagamenn",filter:"Bardagamaður"},{status:"Þjálfarar",filter:"Þjálfari"}],a.format="dd.MM.yyyy",a.fighters=b.query(),a.alerts=[],a.load=!1,a.dt=new Date,a.closeAlert=function(b){a.alerts.splice(b,1)},d.all([a.fighters.$promise]).then(function(){a.fighters.forEach(function(a){a.attendance=null})}),a.open=function(b){b.preventDefault(),b.stopPropagation(),a.opened=!0},a.session={},a.session.description="",a.session.half_attendance=[],a.session.full_attendance=[],a.registerSession=function(){a.alerts=[],a.session.date=a.dt.toJSON().slice(0,10),a.fighters.forEach(function(b){"full"===b.attendance?a.session.full_attendance.push(b.id):"half"===b.attendance&&a.session.half_attendance.push(b.id)});var b=c.save(a.session);a.load=!0,b.$promise.then(function(b){a.session={},a.session.description="",a.session.half_attendance=[],a.session.full_attendance=[],a.alerts.push({type:"success",msg:"Mæting fyrir "+b.date+" hefur verið skráð. Fjöldi: "+(b.full_attendance.length+b.half_attendance.length)}),a.load=!1},function(b){console.log(b.data),a.alerts.push({type:"danger",msg:"Villa kom upp, athugaðu villuskilaboðin og reyndu aftur: "+JSON.stringify(b.data)}),a.load=!1})}}]);