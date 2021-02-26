(function(){/*
 cronos v1.0.0
 https://ktfth.github.io/cronos

 Licensed ISC
*/
'use strict';(function(){function h(d){if(m[d])return m[d].exports;var f=m[d]={exports:{}};t[d](f,f.exports,h);return f.exports}var t={579:function(d,f){function g(a,e){if("minute"===a&&void 0===e)return 60*g();if("hour"===a&&void 0===e)return 60*g("minute");if((void 0===a||"second"===a)&&void 0===e)return 1E3}function u(a){a=a.split(":");var e=0;0<parseInt(a[0],10)&&(e+=g("hour")*parseInt(a[0],10));0<parseInt(a[1],10)&&(e+=g("minute")*parseInt(a[1],10));0<parseInt(a[2],10)&&(e+=g("second")*parseInt(a[2],
10));return e}function v(a){a=a.split(":").map(function(e){return parseInt(e,10)});return a=[10>a[0]&&0<a[0]?"0"+a[0]:a[0],10>a[1]&&0<a[1]?"0"+a[1]:a[1],10>a[2]&&0<a[2]?"0"+a[2]:a[2]].join(":")}function c(a,e,l){l=void 0===l?{enableTheLastPhaseRecord:!1}:l;var b=this;b.display=a;b.enableTheLastPhaseRecord=l.enableTheLastPhaseRecord;b.releaseTheLastPhaseOfHour=!1;b.isHourUpdate=!1;b.releaseTheLastPhaseOfMinute=!1;b.isMinuteUpdate=!1;b.releaseTheLastPhaseOfSecond=!1;b.isSecondUpdate=!1;b.trigger=null;
(function(q){var n=u(b.getDisplay());b.setDisplay(v(b.getDisplay()));b.trigger=setInterval(function(){0<n&&(b.setDisplay(b.getDisplay().split(":").map(function(k,p){2===p&&(k=b.displaySecond(k));1===p&&(k=b.displayMinute(k));0===p&&(k=b.displayHour(k));return k}).join(":")),b.updateHour(),b.checkHourUpdate(),b.updateMinute(),b.checkMinuteUpdate(),b.updateSecond(),b.checkSecondUpdate());n-=1E3;null!==b.trigger&&0===n&&b.stop();q&&q()},1E3)})(e)}c.prototype.stop=function(){clearInterval(this.trigger);
return this};c.prototype.getDisplay=function(){return this.display};c.prototype.setDisplay=function(a){this.display=a;return this};c.prototype.updateHour=function(){if(this.releaseTheLastPhaseOfHour){var a=this.getDisplay().split(":");a[1]="59";a[2]="59";this.setDisplay(a.join(":"));this.releaseTheLastPhaseOfHour=!1}return this};c.prototype.checkHourUpdate=function(){if(this.isHourUpdate){var a=this.getDisplay().split(":");0<parseInt(a[0],10)&&(a[1]="59",this.setDisplay(a.join(":")),this.isHourUpdate=
!1)}return this};c.prototype.updateMinute=function(){if(this.releaseTheLastPhaseOfMinute){var a=this.getDisplay().split(":");a[2]="59";this.setDisplay(a.join(":"));this.releaseTheLastPhaseOfMinute=!1}return this};c.prototype.checkMinuteUpdate=function(){if(this.isMinuteUpdate){var a=this.getDisplay().split(":");0<parseInt(a[1],10)&&(a[2]="59",this.setDisplay(a.join(":")),this.isMinuteUpdate=!1)}return this};c.prototype.updateSecond=function(){if(this.releaseTheLastPhaseOfSecond){var a=this.getDisplay().split(":");
this.setDisplay(a.join(":"));this.releaseTheLastPhaseOfSecond=!1}return this};c.prototype.checkSecondUpdate=function(){if(this.isSecondUpdate){var a=this.getDisplay().split(":");0<parseInt(a[2],10)&&(this.setDisplay(a.join(":")),this.isSecondUpdate=!1)}return this};c.prototype.displaySecond=function(a){a=parseInt(a,10);0<a&&(--a,this.releaseTheLastPhaseOfSecond||0!==a||(this.releaseTheLastPhaseOfSecond=!0),this.isSecondUpdate=!0);0===a&&(this.enableTheLastPhaseRecord&&(this.releaseTheLastPhaseOfSecond=
!0),a="00");return 10>a&&0<a?"0"+a:a};c.prototype.displayMinute=function(a){a=parseInt(a,10);0<a&&"00"===this.getDisplay().split(":")[2]&&(this.releaseTheLastPhaseOfSecond&&(--a,this.releaseTheLastPhaseOfSecond=!1,this.isMinuteUpdate=!0),this.releaseTheLastPhaseOfMinute||0!==a||(this.releaseTheLastPhaseOfMinute=!0));0===a&&(a="00");return 10>a&&0<a?"0"+a:a};c.prototype.displayHour=function(a){a=parseInt(a,10);0<a&&"00"===this.getDisplay().split(":")[1]&&(this.releaseTheLastPhaseOfHour||(--a,this.isHourUpdate=
this.releaseTheLastPhaseOfHour=!0),this.releaseTheLastPhaseOfMinute&&(--a,this.releaseTheLastPhaseOfMinute=!1,this.isHourUpdate=!0),this.releaseTheLastPhaseOfHour||0!==a||(this.releaseTheLastPhaseOfHour=!0));0===a&&(a="0");return a};f.xz=c}},m={};(function(){h.d=function(d,f){for(var g in f)h.o(f,g)&&!h.o(d,g)&&Object.defineProperty(d,g,{enumerable:!0,get:f[g]})}})();(function(){h.o=function(d,f){return Object.prototype.hasOwnProperty.call(d,f)}})();var r={};(function(){h.d(r,{"default":function(){return d}});
var d={Trigger:h(579).xz}})();window.cronos=r.default})();}).call(this || window)