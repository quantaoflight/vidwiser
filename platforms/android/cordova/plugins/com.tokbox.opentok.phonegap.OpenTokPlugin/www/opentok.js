// Generated by CoffeeScript 1.6.1
(function() {
  var TBError, TBGenerateDomHelper, TBGetZIndex, TBPublisher, TBSession, TBSubscriber, TBSuccess, TBUpdateObjects, getPosition, replaceWithObject,
    _this = this;

  getPosition = function(divName) {
    var curleft, curtop, height, pubDiv, width;
    pubDiv = document.getElementById(divName);
    width = pubDiv.style.width;
    height = pubDiv.style.height;
    curtop = curleft = 0;
    if (pubDiv.offsetParent) {
      curleft += pubDiv.offsetLeft;
      curtop += pubDiv.offsetTop;
      while ((pubDiv = pubDiv.offsetParent)) {
        curleft += pubDiv.offsetLeft;
        curtop += pubDiv.offsetTop;
      }
    }
    return {
      top: curtop,
      left: curleft,
      width: width,
      height: height
    };
  };

  replaceWithObject = function(divName, streamId, properties) {
    var newId, objDiv, oldDiv;
    newId = "TBStreamConnection" + streamId;
    objDiv = document.getElementById(newId);
    if (objDiv != null) {
      return objDiv;
    } else {
      oldDiv = document.getElementById(divName);
      objDiv = document.createElement("object");
      objDiv.id = newId;
      objDiv.style.width = properties.width + "px";
      objDiv.style.height = properties.height + "px";
      objDiv.setAttribute('streamId', streamId);
      objDiv.textContext = streamId;
      objDiv.className = 'TBstreamObject';
      oldDiv.parentNode.replaceChild(objDiv, oldDiv);
      return objDiv;
    }
  };

  TBError = function(error) {
    return navigator.notification.alert(error);
  };

  TBSuccess = function() {
    return console.log("success");
  };

  TBUpdateObjects = function() {
    var e, id, objects, position, streamId, _i, _len;
    console.log("JS: Objects being updated");
    objects = document.getElementsByClassName('TBstreamObject');
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      e = objects[_i];
      console.log("JS: Object updated");
      streamId = e.getAttribute('streamId');
      id = e.id;
      position = getPosition(id);
      Cordova.exec(TBSuccess, TBError, "OpenTokPlugin", "updateView", [streamId, position.top, position.left, position.width, position.height, TBGetZIndex(e)]);
    }
  };

  TBGenerateDomHelper = function() {
    var div, domId;
    domId = "PubSub" + Date.now();
    div = document.createElement('div');
    div.setAttribute('id', domId);
    document.body.appendChild(div);
    return domId;
  };

  window.TB = {
    updateViews: function() {
      return TBUpdateObjects();
    },
    addEventListener: function(event, handler) {
      if (event === "exception") {
        console.log("JS: TB Exception Handler added");
        return Cordova.exec(handler, TBError, "OpenTokPlugin", "exceptionHandler", []);
      }
    },
    initSession: function(sid) {
      return new TBSession(sid);
    },
    initPublisher: function(one, two, three) {
      var domId, objDiv;
      if ((three != null)) {
        return new TBPublisher(one, two, three);
      }
      if ((two != null)) {
        if (typeof two === "object") {
          objDiv = document.getElementById(one);
          if (objDiv != null) {
            return new TBPublisher("", one, two);
          }
          domId = TBGenerateDomHelper();
          return new TBPublisher(one, domId, two);
        } else {
          return new TBPublisher(one, two, {});
        }
      }
      objDiv = document.getElementById(one);
      if (objDiv != null) {
        return new TBPublisher("", one, {});
      } else {
        domId = TBGenerateDomHelper();
        return new TBPublisher(one, domId, {});
      }
    },
    setLogLevel: function(a) {
      return console.log("Log Level Set");
    }
  };

  window.TBTesting = function(handler) {
    return Cordova.exec(handler, TBError, "OpenTokPlugin", "TBTesting", []);
  };

  TBGetZIndex = function(ele) {
    var val;
    while ((ele != null)) {
      val = document.defaultView.getComputedStyle(ele, null).getPropertyValue('z-index');
      console.log(val);
      if (parseInt(val)) {
        return val;
      }
      ele = ele.offsetParent;
    }
    return 0;
  };

  TBPublisher = (function() {

    function TBPublisher(key, domId, properties) {
      var height, name, position, publishAudio, publishVideo, width, zIndex, _ref, _ref1, _ref2;
      this.key = key;
      this.domId = domId;
      this.properties = properties != null ? properties : {};
      console.log("JS: Publish Called");
      width = 160;
      height = 120;
      name = "TBNameHolder";
      publishAudio = "true";
      publishVideo = "true";
      zIndex = TBGetZIndex(document.getElementById(this.domId));
      if ((this.properties != null)) {
        width = (_ref = this.properties.width) != null ? _ref : 160;
        height = (_ref1 = this.properties.height) != null ? _ref1 : 120;
        name = (_ref2 = this.properties.name) != null ? _ref2 : "";
        if ((this.properties.publishAudio != null) && this.properties.publishAudio === false) {
          publishAudio = "false";
        }
        if ((this.properties.publishVideo != null) && this.properties.publishVideo === false) {
          publishVideo = "false";
        }
      }
      this.obj = replaceWithObject(this.domId, "TBPublisher", {
        width: width,
        height: height
      });
      position = getPosition(this.obj.id);
      TBUpdateObjects();
      Cordova.exec(TBSuccess, TBError, "OpenTokPlugin", "initPublisher", [position.top, position.left, width, height, name, publishAudio, publishVideo, zIndex]);
    }

    TBPublisher.prototype.destroy = function() {
      return Cordova.exec(TBSuccess, TBError, "OpenTokPlugin", "destroyPublisher", []);
    };

    return TBPublisher;

  })();

  TBSession = (function() {

    function TBSession(sessionId) {
      var _this = this;
      this.sessionId = sessionId;
      this.connect = function(apiKey, token, properties) {
        if (properties == null) {
          properties = {};
        }
        return TBSession.prototype.connect.apply(_this, arguments);
      };
      Cordova.exec(TBSuccess, TBSuccess, "OpenTokPlugin", "initSession", [this.sessionId]);
    }

    TBSession.prototype.cleanUpDom = function() {
      var e, objects, _i, _len, _results;
      objects = document.getElementsByClassName('TBstreamObject');
      _results = [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        e = objects[_i];
        _results.push(e.parentNode.removeChild(e));
      }
      return _results;
    };

    TBSession.prototype.sessionDisconnectedHandler = function(event) {};

    TBSession.prototype.addEventListener = function(event, handler) {
      var _this = this;
      console.log("JS: Add Event Listener Called");
      if (event === 'sessionConnected') {
        return this.sessionConnectedHandler = function(event) {
          _this.connection = event.connection;
          return handler(event);
        };
      } else if (event === 'streamDestroyed') {
        return this.streamDisconnectedHandler = function(response) {
          var arr, stream;
          console.log("streamDestroyedHandler ");
          arr = response.split(' ');
          stream = {
            connection: {
              connectionId: arr[0]
            },
            streamId: arr[1]
          };
          return handler({
            streams: [stream]
          });
        };
      } else if (event === 'streamCreated') {
        this.streamCreatedHandler = function(response) {
          var arr, stream;
          arr = response.split(' ');
          stream = {
            connection: {
              connectionId: arr[0]
            },
            streamId: arr[1]
          };
          return handler({
            streams: [stream]
          });
        };
        return Cordova.exec(this.streamCreatedHandler, TBSuccess, "OpenTokPlugin", "streamCreatedHandler", []);
      } else if (event === 'sessionDisconnected') {
        return this.sessionDisconnectedHandler = function(event) {
          return handler(event);
        };
      }
    };

    TBSession.prototype.connect = function(apiKey, token, properties) {
      if (properties == null) {
        properties = {};
      }
      console.log("JS: Connect Called");
      this.apiKey = apiKey;
      this.token = token;
      Cordova.exec(this.sessionConnectedHandler, TBError, "OpenTokPlugin", "connect", [this.apiKey, this.token]);
      Cordova.exec(this.streamDisconnectedHandler, TBError, "OpenTokPlugin", "streamDisconnectedHandler", []);
      Cordova.exec(this.sessionDisconnectedHandler, TBError, "OpenTokPlugin", "sessionDisconnectedHandler", []);
    };

    TBSession.prototype.disconnect = function() {
      return Cordova.exec(TBSuccess, TBError, "OpenTokPlugin", "disconnect", []);
    };

    TBSession.prototype.publish = function(divName, properties) {
      this.publisher = new TBPublisher(divName, properties, this);
      return this.publisher;
    };

    TBSession.prototype.publish = function(publisher) {
      var newId;
      this.publisher = publisher;
      newId = "TBStreamConnection" + this.connection.connectionId;
      this.publisher.obj.id = newId;
      return Cordova.exec(TBSuccess, TBError, "OpenTokPlugin", "publish", []);
    };

    TBSession.prototype.unpublish = function() {
      var element, elementId;
      console.log("JS: Unpublish");
      elementId = "TBStreamConnection" + this.connection.connectionId;
      element = document.getElementById(elementId);
      if (element) {
        element.parentNode.removeChild(element);
        TBUpdateObjects();
      }
      return Cordova.exec(TBSuccess, TBError, "OpenTokPlugin", "unpublish", []);
    };

    TBSession.prototype.subscribe = function(one, two, three) {
      var domId, subscriber;
      if ((three != null)) {
        subscriber = new TBSubscriber(one, two, three);
        return subscriber;
      }
      if ((two != null)) {
        if (typeof two === "object") {
          domId = TBGenerateDomHelper();
          subscriber = new TBSubscriber(one, domId, two);
          return subscriber;
        } else {
          subscriber = new TBSubscriber(one, two, {});
          return subscriber;
        }
      }
      domId = TBGenerateDomHelper();
      subscriber = new TBSubscriber(one, domId, {});
      return subscriber;
    };

    TBSession.prototype.unsubscribe = function(subscriber) {
      var element, elementId;
      console.log("JS: Unsubscribe");
      elementId = subscriber.streamId;
      element = document.getElementById("TBStreamConnection" + elementId);
      if (element) {
        alert("removing element");
        element.parentNode.removeChild(element);
        TBUpdateObjects();
      }
      return Cordova.exec(TBSuccess, TBError, "OpenTokPlugin", "unsubscribe", [subscriber.streamId]);
    };

    TBSession.prototype.streamDisconnectedHandler = function(streamId) {
      var element, elementId;
      console.log("JS: Stream Disconnected Handler Executed");
      elementId = "TBStreamConnection" + streamId;
      element = document.getElementById(elementId);
      if (element) {
        element.parentNode.removeChild(element);
        TBUpdateObjects();
      }
    };

    return TBSession;

  })();

  TBSubscriber = function(stream, divName, properties) {
    var height, name, obj, position, subscribeToVideo, width, zIndex, _ref, _ref1, _ref2;
    console.log("JS: Subscribing");
    this.streamId = stream.streamId;
    width = 160;
    height = 120;
    subscribeToVideo = "true";
    zIndex = TBGetZIndex(document.getElementById(divName));
    if ((properties != null)) {
      width = (_ref = properties.width) != null ? _ref : 160;
      height = (_ref1 = properties.height) != null ? _ref1 : 120;
      name = (_ref2 = properties.name) != null ? _ref2 : "";
      if ((properties.subscribeToVideo != null) && properties.subscribeToVideo === false) {
        subscribeToVideo = "false";
      }
    }
    obj = replaceWithObject(divName, stream.streamId, {
      width: width,
      height: height
    });
    position = getPosition(obj.id);
    return Cordova.exec(TBSuccess, TBError, "OpenTokPlugin", "subscribe", [stream.streamId, position.top, position.left, width, height, subscribeToVideo, zIndex]);
  };

}).call(this);
