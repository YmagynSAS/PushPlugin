if (typeof (YMAGYN) == "undefined" || !YMAGYN) {
    var YMAGYN = {};
}
if (typeof (YMAGYN.SDK) == "undefined" || !YMAGYN.SDK) {
    YMAGYN.SDK = {};
}

if (typeof YMAGYN.SDK.Os == 'undefined') {
    YMAGYN.SDK.Os = {}
}

YMAGYN.SDK.Os = function(userAgent, platform){
    var statics = YMAGYN.SDK.Os.statics,
    names = statics.names,
    prefixes = YMAGYN.SDK.Os.prefixes,
    name,
    i, prefix, match, item;
    this.is = function(name) {
        return this.is[name] === true;
    };
    for (i in prefixes) {
        if (prefixes.hasOwnProperty(i)) {
            prefix = prefixes[i];
            match = userAgent.match(new RegExp('(?:'+prefix+')([^\\s;]+)'));
            if (match) {
                name = names[i];
                if (match[0].indexOf('iPad')!==-1)
                    this.setFlag('iPad');
                break;
            }
        }
    }
    if (!name) {
        name = names[(userAgent.toLowerCase().match(/mac|win|linux/) || ['other'])[0]];
    }
    this.name = name;
    if (platform) {
        this.setFlag(platform.replace(/ simulator$/i, ''));
    }
    this.setFlag(name);
    for (i in names) {
        if (names.hasOwnProperty(i)) {
            item = names[i];

            if (!this.is.hasOwnProperty(name)) {
                this.setFlag(item, (name === item));
            }
        }
    }
    if (this.name == "iOS" && window.screen.height == 568) {
        this.setFlag('iPhone5');
    }
    
    if(this.is.Android)
    {
        var androidApproxVersion = parseInt(userAgent.slice(userAgent.indexOf("Android")+8));
        this.setFlag('Android'+androidApproxVersion);
    }
    
    
    
    var search = window.location.search.match(/deviceType=(Tablet|Phone)/),
    nativeDeviceType = window.deviceType,
    deviceType;
    
    if (search && search[1]) {
        deviceType = search[1];
    }
    else if (nativeDeviceType == 'iPhone') {
        deviceType = 'Phone';
        this.setFlag('WebView', true);
    }
    else if (nativeDeviceType == 'iPad') {
        deviceType = 'Tablet';
        this.setFlag('WebView', true);
    }
    else {
        if (!this.is.Android && !this.is.iOS && !this.is.WindowsPhone && /Windows|Linux|MacOS/.test(this.name)) {
            deviceType = 'Desktop';
            this.setFlag('WebView', false);
        }
        else if (this.is.iPad || this.is.RIMTablet || this.is.Android3 ||(this.is.Android4 && userAgent.search(/mobile/i) == -1)) {
            deviceType = 'Tablet';
            this.setFlag('WebView', true);
        }
        else {
            deviceType = 'Phone';
            this.setFlag('WebView', true);
        }
    }
    this.setFlag(deviceType);
    
    return this;
};

YMAGYN.SDK.Os.statics = {
    names: {
        ios: 'iOS',
        android: 'Android',
        windowsPhone: 'WindowsPhone',
        webos: 'webOS',
        blackberry: 'BlackBerry',
        rimTablet: 'RIMTablet',
        mac: 'MacOS',
        win: 'Windows',
        linux: 'Linux',
        bada: 'Bada',
        chrome: 'ChromeOS',
        other: 'Other'
    }
};
YMAGYN.SDK.Os.prefixes= {
    ios: 'i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ',
    android: '(Android |HTC_|Silk/)',
    windowsPhone: 'Windows Phone ',
    blackberry: '(?:BlackBerry|BB)(?:.*)Version\/',
    rimTablet: 'RIM Tablet OS ',
    webos: '(?:webOS|hpwOS)\/',
    bada: 'Bada\/',
    chrome: 'CrOS '
};

YMAGYN.SDK.Os.prototype={   
    setFlag: function(name, value) {
        if (typeof value == 'undefined') {
            value = true;
        }

        this.is[name] = value;
        this.is[name.toLowerCase()] = value;

        return this;
    }
};

if( typeof YMAGYN.SDK.is=='undefined')
{
    YMAGYN.SDK.is = new YMAGYN.SDK.Os(navigator.userAgent, navigator.platform).is;
}




YMAGYN.SDK.loadJsFile = function(sScriptSrc, callback) {
    var oHead = document.getElementsByTagName('head')[0];
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = sScriptSrc;
    oScript.onload = function(){
        if(typeof(callback)=="function")
            callback();
    };
    oHead.appendChild(oScript);
};
    
YMAGYN.SDK.isEmulate=function(){
    return (typeof(parent.window.ripple)=='function') ? true : false;
};

YMAGYN.SDK.getCompilerConfig=function(callback){
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",location.href+"compiler/compiler-config.json",true);
    xmlhttp.onload = function (){
        var config = JSON.parse(this.responseText);
        if(typeof(callback=="function"))
            callback(config);
        return config;
    };
    xmlhttp.send();
};if (typeof (YMAGYN.SDK.Device) == "undefined" || !YMAGYN.SDK.Device) {
    YMAGYN.SDK.Device = {};
}

YMAGYN.SDK.Device.name = function()
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        return device.name;
    }else{
        return "unknown device name";
    }
};
YMAGYN.SDK.Device.model = function()
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        return device.model;
    }else{
        return "unknown device name";
    }
};
YMAGYN.SDK.Device.cordova = function()
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        return device.cordova;
    }else{
        return "unknown cordova version";
    }
};

YMAGYN.SDK.Device.platform = function(){ 
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        return device.platform;
    }
    else {
        return navigator.platform;
    }
};


YMAGYN.SDK.Device.uuid = function(){
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) {
        return device.uuid;
    }
    else {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;
            return v.toString(16);
        });
    }
};
YMAGYN.SDK.Device.version = function(){
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        return device.version;
    }
    else {
        return navigator.userAgent;
    }
};if (typeof (YMAGYN.SDK.Storage) == "undefined" || !YMAGYN.SDK.Storage) {
    YMAGYN.SDK.Storage = {};
}
YMAGYN.SDK.Storage =  function(){
    return this;
};

YMAGYN.SDK.Storage.localStorage={};

YMAGYN.SDK.Storage.openDatabase = function(database_name, database_version, database_displayname, database_size)
{
    var s = new YMAGYN.SDK.Storage;
    try{
        s._db = window.openDatabase(database_name, database_version, database_displayname, database_size);
        return s;
    }
    catch(e)
    {
        console.log(e);
        return s;
    }
};


YMAGYN.SDK.Storage.prototype = {
    transaction:function(populateDB, errorCB, successCB)
    {
        this._db.transaction(populateDB, errorCB, successCB);
    },
    changeVersion:function(oldVersion, newVersion){
        this._db.changeVersion(oldVersion, newVersion);
    }
};

YMAGYN.SDK.Storage.localStorage.key = function(index)
{
    return window.localStorage.key(index);
};

YMAGYN.SDK.Storage.localStorage.setItem = function(key, value)
{
    window.localStorage.setItem(key, value);
};

YMAGYN.SDK.Storage.localStorage.getItem = function(key)
{
    return window.localStorage.getItem(key);
};

YMAGYN.SDK.Storage.localStorage.removeItem = function(key)
{
    window.localStorage.removeItem(key);
};

YMAGYN.SDK.Storage.localStorage.clear = function()
{
    window.localStorage.clear();
};if (typeof (YMAGYN.SDK.Device) == "undefined" || !YMAGYN.SDK.Device) {
    YMAGYN.SDK.Device = {};
}

if (typeof (YMAGYN.SDK.Device.Capture) == "undefined" || !YMAGYN.SDK.Device.Capture) {
    YMAGYN.SDK.Device.Capture = {};
}


if (typeof (YMAGYN.SDK.Device.Capture.CaptureError) == "undefined" || !YMAGYN.SDK.Device.Capture.CaptureError) {
    YMAGYN.SDK.Device.Capture.CaptureError = {};
}

YMAGYN.SDK.Device.Capture.init = function()
{
    if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) {
        YMAGYN.SDK.Device.Capture.CaptureError.CAPTURE_INTERNAL_ERR = CaptureError.CAPTURE_INTERNAL_ERR;
        YMAGYN.SDK.Device.Capture.CaptureError.CAPTURE_APPLICATION_BUSY = CaptureError.CAPTURE_APPLICATION_BUSY;
        YMAGYN.SDK.Device.Capture.CaptureError.CAPTURE_INVALID_ARGUMENT = CaptureError.CAPTURE_INVALID_ARGUMENT;
        YMAGYN.SDK.Device.Capture.CaptureError.CAPTURE_NO_MEDIA_FILES = CaptureError.CAPTURE_NO_MEDIA_FILES;
        YMAGYN.SDK.Device.Capture.CaptureError.CAPTURE_NOT_SUPPORTED = CaptureError.CAPTURE_NOT_SUPPORTED;
    }
}


if (typeof (YMAGYN.SDK.Device.Capture.MediaFile) == "undefined" || !YMAGYN.SDK.Device.Capture.MediaFile) {
    YMAGYN.SDK.Device.Capture.MediaFile = {};
}



YMAGYN.SDK.Device.Capture.captureAudio = function(captureSuccess, captureError, options)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        navigator.device.capture.captureAudio(captureSuccess, captureError, options);
    }
    else
    {
    }
};

YMAGYN.SDK.Device.Capture.captureImage = function(captureSuccess, captureError, options)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        navigator.device.capture.captureImage(captureSuccess, captureError, options);
    }
    else
    {

    }
};

YMAGYN.SDK.Device.Capture.captureVideo = function(captureSuccess, captureError, options)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        navigator.device.capture.captureVideo(captureSuccess, captureError, options);
    }
    else
    {      
    }
};if (typeof (YMAGYN.SDK.Accelerometer) == "undefined" || !YMAGYN.SDK.Accelerometer) {
    YMAGYN.SDK.Accelerometer = {};
}
YMAGYN.SDK.Accelerometer._watchId = null;
YMAGYN.SDK.Accelerometer.getCurrentAcceleration = function(accelerometerSuccess, accelerometerError)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
    }
    else{
        accelerometerSuccess(
        {
            x: Math.random()*100,
            y: Math.random()*100,
            z: Math.random()*100,
            timestamp : new Date().getTime()
        });
        console.log("getCurrentAcceleration - Running on Desktop");
    }
};

YMAGYN.SDK.Accelerometer.watchAcceleration = function(accelerometerSuccess, accelerometerError, accelerometerOption){
    this.clearWatch();
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        this._watchId = navigator.accelerometer.watchAcceleration(accelerometerSuccess, accelerometerError, accelerometerOption);
    }
    else{
        var interval = (accelerometerOption != null) ? accelerometerOption.frequency : 10000;
        this._watchId =  setInterval(function(){
            accelerometerSuccess({
                x: Math.random()*100,
                y: Math.random()*100,
                z: Math.random()*100,
                timestamp : new Date().getTime()
            });
        },
        interval
        ); 
        console.log("watchAcceleration - Running on Desktop");
    }
    return this._watchId;
};

YMAGYN.SDK.Accelerometer.clearWatch = function (){
    if(this._watchId!=null)
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
            navigator.accelerometer.clearWatch(this._watchId);
        }
        else
        {
            clearInterval(this._watchId);
            console.log("clearWatch - Running on Desktop");
        }
    }
};if (typeof (YMAGYN.SDK.Compass) == "undefined" || !YMAGYN.SDK.Compass) {
    YMAGYN.SDK.Compass = {};
}

YMAGYN.SDK.Compass._watchId = null;

YMAGYN.SDK.Compass.getCurrentHeading = function(compassSuccess, compassError, compassOptions){
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        navigator.compass.getCurrentHeading(compassSuccess, compassError, compassOptions);
    }
    else{
        compassSuccess({
            magneticHeading : parseFloat((Math.random()*359.99)-1).toFixed(2),
            trueHeading : parseFloat((Math.random()*360.99)-2).toFixed(2),
            headingAccuracy : Math.floor((Math.random()*100)),
            timestamp : new Date().getTime()
        });
    }
};

YMAGYN.SDK.Compass.watchHeading = function(compassSuccess, compassError, compassOptions){
    this.clearWatch();
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        this._watchId = navigator.compass.watchHeading(compassSuccess, compassError, compassOptions);
    }
    else{
        var interval = (compassOptions != null) ? compassOptions.frequency : 100;
        this._watchId =  setInterval(function(){
            compassSuccess({
                magneticHeading : parseFloat((Math.random()*359.99)-1).toFixed(2),
                trueHeading : parseFloat((Math.random()*360.99)-2).toFixed(2),
                headingAccuracy : Math.floor((Math.random()*100)),
                timestamp : new Date().getTime()
            });
        },
        interval
        ); 
        console.log("watchHeading - Running on Desktop");
    }
    return this._watchId;
};

YMAGYN.SDK.Compass.clearWatch = function (){
    if(this._watchId!=null)
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
            navigator.Compass.clearWatch(this._watchId);
        }
        else
        {
            clearInterval(this._watchId);
            console.log("clearWatch - Running on Desktop");
        }
    }
};if (typeof (YMAGYN.SDK.Notification) == "undefined" || !YMAGYN.SDK.Notification) {
    YMAGYN.SDK.Notification = {};
}

YMAGYN.SDK.Notification.alert = function(title,message,buttonName,callback)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        if(typeof(callback) != "function")
            callback=function(){};
        navigator.notification.alert(
            message,
            callback,
            title,
            buttonName
            );
    }else{
        alert(message);
        if(typeof(callback) == "function")
            callback();
    }
};

YMAGYN.SDK.Notification.confirm = function(message, confirmCallback, title, buttonLabels)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        if(typeof(callback) != "function")
            confirmCallback=function(){};
        navigator.notification.confirm(
            message,
            confirmCallback,
            title,
            buttonLabels
            );
    }else{
        var c = confirm(message);
        if(c){
            if(typeof(confirmCallback) == "function")
                confirmCallback();
        }
    }
};

YMAGYN.SDK.Notification.beep = function(times)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.notification.beep(times);
    }
    else{
        if(YMAGYN.SDK.Notification._instance==undefined)
        {
            var audio = document.createElement("audio");
            audio.src = "http://www.universal-soundbank.com/mp3/sounds/180.mp3";
            document.body.appendChild(audio);
            YMAGYN.SDK.Notification._instance = audio;
        }
        console.log(YMAGYN.SDK.Notification._instance);
        var t = 0;
        var interval = setInterval(function(){
            YMAGYN.SDK.Notification._instance.play(); 
            t++;
            if(t==times)
            {
                clearInterval(interval);
            }
        }, 1500);      
    }
};

YMAGYN.SDK.Notification.vibrate = function(milliseconds)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.notification.vibrate(milliseconds);
    }
    else
    {
        var interval = 100;
        var counter = 0;
        var id = setInterval(function(){
            setTimeout(function(){
                document.getElementsByTagName('body')[0].style.marginLeft = '10px';
            },10);
            setTimeout(function(){
                document.getElementsByTagName('body')[0].style.marginLeft = '0px';
            },250);
            setTimeout(function(){
                document.getElementsByTagName('body')[0].style.marginLeft = '10px';
            },500);
            setTimeout(function(){
                document.getElementsByTagName('body')[0].style.marginLeft = '8px';
                counter += 1000;
                if(counter>= (milliseconds))
                    clearInterval(id);
            },750);
            
            
           
        }, interval);
    }
};if (typeof (YMAGYN.SDK.File) == "undefined" || !YMAGYN.SDK.File) {
    YMAGYN.SDK.File = {};
}


YMAGYN.SDK.File.init = function()
{

    YMAGYN.SDK.File.LocalFileSystem = {};
    YMAGYN.SDK.File.LocalFileSystem.TEMPORARY = (!YMAGYN.SDK.is.Android && !YMAGYN.SDK.is.iOS) ? window.TEMPORARY : LocalFileSystem.TEMPORARY;
    YMAGYN.SDK.File.LocalFileSystem.PERSISTENT = (!YMAGYN.SDK.is.Android && !YMAGYN.SDK.is.iOS) ? window.PERSISTENT : LocalFileSystem.PERSISTENT;

    YMAGYN.SDK.File.FileError = {};

    YMAGYN.SDK.File.FileError.NOT_FOUND_ERR = FileError.NOT_FOUND_ERR;
    YMAGYN.SDK.File.FileError.SECURITY_ERR = FileError.SECURITY_ERR;
    YMAGYN.SDK.File.FileError.ABORT_ERR = FileError.ABORT_ERR;
    YMAGYN.SDK.File.FileError.NOT_READABLE_ERR = FileError.NOT_READABLE_ERR;
    YMAGYN.SDK.File.FileError.ENCODING_ERR = FileError.ENCODING_ERR;
    YMAGYN.SDK.File.FileError.NO_MODIFICATION_ALLOWED_ERR = FileError.NO_MODIFICATION_ALLOWED_ERR;
    YMAGYN.SDK.File.FileError.INVALID_STATE_ERR = FileError.INVALID_STATE_ERR;
    YMAGYN.SDK.File.FileError.SYNTAX_ERR = FileError.SYNTAX_ERR;
    YMAGYN.SDK.File.FileError.INVALID_MODIFICATION_ERR = FileError.INVALID_MODIFICATION_ERR;
    YMAGYN.SDK.File.FileError.QUOTA_EXCEEDED_ERR = FileError.QUOTA_EXCEEDED_ERR;
    YMAGYN.SDK.File.FileError.TYPE_MISMATCH_ERR = FileError.TYPE_MISMATCH_ERR;
    YMAGYN.SDK.File.FileError.PATH_EXISTS_ERR = FileError.PATH_EXISTS_ERR;

    YMAGYN.SDK.File._type = YMAGYN.SDK.File.LocalFileSystem.PERSISTENT;
    YMAGYN.SDK.File._fileSystem = {};
    YMAGYN.SDK.File._initFS();
};

YMAGYN.SDK.File.requestFileSystem = function(type, size, successCallback, errorCallback)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
    }
    else{
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    }
    window.requestFileSystem(type, size,successCallback,errorCallback);
};



if (typeof (YMAGYN.SDK.File.FileReader) == "undefined" || !YMAGYN.SDK.File.FileTransfer) {
    YMAGYN.SDK.File.FileTransfer = {};
}

YMAGYN.SDK.File.FileTransfer = function(){
    if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        this._FileTransfer = new FileTransfer();
        return this;
    }
    else{
        this._FileTransfer = new XMLHttpRequest();
        return this;
    }
};

YMAGYN.SDK.File.FileTransfer.prototype={
    download:function(url, key, callbackfn, options){
        if(!this._fileSystem)   
            YMAGYN.SDK.File._initFS();
        var self = this;
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){   
        
            var rootPath = self._fileSystem.root.fullPath;          
            this._FileTransfer.download(
                url,
                rootPath+"/"+key,
                function(entry) {
                    var returnUrl = "file://"+escape(entry.toURL().split("file://")[1]);
                    callbackfn(returnUrl);
                },
                function(error) {
                    self.fail(error);
                    callbackfn(url);
                },options);      
        }
        else{
            this._FileTransfer.open('get', url, true);
            this._FileTransfer.responseType = 'arraybuffer';
            this._FileTransfer.onload = function () {
                var res = this.response;
                YMAGYN.SDK.File.SaveFileContent(key,res,callbackfn);
            }
            this._FileTransfer.send();
        } 
    },
    upload:function(filePath, server, callbackFn, options, trustAllHosts){
            if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
                if(typeof(trustAllHosts)=='undefined'){
                    trustAllHosts = false;
                }
                this._FileTransfer.upload(filePath, server, 
                function(response){callbackFn(response)},
                function(error){callbackFn(error)},
                options, trustAllHosts)
            }
            else{
                console.log('FileTransfert.upload() not supported on desktop')
            }
    },
    abort:function(){
            if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){ 
                this._FileTransfer.abort();
            }
            else{
                this._FileTransfer.abort();
            }
    }
};
 
if (typeof (YMAGYN.SDK.File.FileReader) == "undefined" || !YMAGYN.SDK.File.FileReader) {
    YMAGYN.SDK.File.FileReader = {};
}
 
YMAGYN.SDK.File.FileReader = function(){
    return new FileReader();
};
 
if (typeof (YMAGYN.SDK.File.FileUploadOptions) == "undefined" || !YMAGYN.SDK.File.FileUploadOptions) {
    YMAGYN.SDK.File.FileUploadOptions = {};
}
 
YMAGYN.SDK.File.FileUploadOptions = function(){
    return new FileUploadOptions();
};

if (typeof (YMAGYN.SDK.File.DirectoryEntry) == "undefined" || !YMAGYN.SDK.File.DirectoryEntry) {
    YMAGYN.SDK.File.DirectoryEntry = {};
}
 
YMAGYN.SDK.File.DirectoryEntry = function(dirName, dir){
    return new DirectoryEntry(dirName, dir);
};



YMAGYN.SDK.File._initFS=function(){
    var self = this;
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        YMAGYN.SDK.File.requestFileSystem(this._type, 0, function(fileSystem)
        {
            self._fileSystem = fileSystem; 
        },function(error)
        {            
            self.fail(error);
        });  
    }
    else{
        var storageInfo = (self._type==YMAGYN.SDK.File.LocalFileSystem.PERSISTENT) ? navigator.webkitPersistentStorage : navigator.webkitPersistentStorage
        storageInfo.requestQuota(2048*2048, function(grantedBytes) {
            YMAGYN.SDK.File.requestFileSystem(self._type, grantedBytes, function(fileSystem)
            {
                self._fileSystem = fileSystem; 
            },function(error)
            {            
                self.fail(error);
            }); 
        },
        function(error){
            self.fail(error);
        })
    }
};


YMAGYN.SDK.File.changeStorageType=function(type, callback)
{
    switch (type)
    {
        case YMAGYN.SDK.File.LocalFileSystem.PERSISTENT:
            this._type=YMAGYN.SDK.File.LocalFileSystem.PERSISTENT;
            callback(true)
            break;
        case YMAGYN.SDK.File.LocalFileSystem.TEMPORARY:
            callback(true)
            this._type=YMAGYN.SDK.File.LocalFileSystem.TEMPORARY;
            break;
        default :
            callback(false)
            break;
    }  
    YMAGYN.SDK.File._initFS();
   
};

YMAGYN.SDK.File.GetFileUri= function(name,callbackfn)
{
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();      
    var self = this;
    self._fileSystem.root.getFile(name, {
        create: false
    }, function(fileEntry)
    {             
        callbackfn(fileEntry.toURL());
    },function(error)
    {
        callbackfn(null);
        self.fail(error);
    });
};   
    
YMAGYN.SDK.File.GetFileContent= function(name,callbackfn)
{
    if(!this._fileSystem) {  
        YMAGYN.SDK.File._initFS();
    }
    var self = this;

    self._fileSystem.root.getFile(name, {
        create: true
    }, function(fileEntry)
    {
        fileEntry.file(function(file)
        {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                if(evt.target.result!="")
                    callbackfn(evt.target.result);
                else
                    callbackfn(null);
            };
            reader.readAsText(file);
        },function(error)
        {
            callbackfn(null);
            self.fail(error);
        });
    },function(error)
    {
        callbackfn(null);
        self.fail(error);
    });
        
};
    
    
YMAGYN.SDK.File.FileDetele=function(name,callbackfn)
{      
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
    var self = this;
    self._fileSystem.root.getFile(name,
    {
        create: false
    },
    function(fileEntry)
    {
        fileEntry.remove(
            function(entry)
            {
                callbackfn(true);
            },
            function(error)
            {
                callbackfn(false);
                self.fail(error);
            });
    },
    function(error)
    {
        callbackfn(false);
        self.fail(error);
    });
               
};
    
YMAGYN.SDK.File.FileExist=function(name,callbackfn)
{
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
    var self = this;
    self._fileSystem.root.getFile(name,
    {
        create: false
    },
    function(fileEntry)
    {
        callbackfn(true);
    },
    function(error)
    {
        callbackfn(false);
    });
            
};
    
YMAGYN.SDK.File.FileUpload=function()
{
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
};
    
    
YMAGYN.SDK.File.FileCopy=function(path, newDir, callbackfn)
{
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
    var self = this;
    self._fileSystem.root.getFile(path, {}, function (fileEntry) {                  
        self._fileSystem.root.getDirectory(newDir, {}, function(newDirEntry) {       
            fileEntry.copyTo(newDirEntry); 
            callbackfn(newDirEntry.Name);
        },  function(error){
            self.fail(error);
            callbackfn(false);
        });   
    });  
        
};
    
YMAGYN.SDK.File.FileMove=function(path,newDir, callbackfn){

    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
    var self = this;       
    self._fileSystem.root.getFile(path, {},function (fileEntry) {   
        self._fileSystem.root.getDirectory(newDir, {}, function(newDirEntry) {       
            fileEntry.moveTo(newDirEntry);  
            callbackfn(true);
        },  function(error){
            self.fail(error);
            callbackfn(false);
        });   
    });
 
};
    
YMAGYN.SDK.File.FileRename=function(path, name, newName, callbackfn){
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
    newName = (newName) ? newName : name;
    var self = this;
    self._fileSystem.root.getDirectory(path, {},function (dirEntry) {   
        dirEntry.getFile(name, {}, function(fileEntry) {     
            fileEntry.moveTo(dirEntry, newName);  
            callbackfn(true);
        }, function(error){
            self.fail(error);
            callbackfn(false);
        });
    }, function(error){
        self.fail(error);
        callbackfn(false);
    });
};
    
YMAGYN.SDK.File.DownloadRemoteAsset=function(url,key,callbackfn)
{
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
    var self = this;
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){   
        
        var rootPath = self._fileSystem.root.fullPath;
        var fileTransfer = new FileTransfer();
        fileTransfer.download(
            url,
            rootPath+"/"+key,
            function(entry) {
                var returnUrl = "file://"+escape(entry.toURL().split("file://")[1]);
                callbackfn(returnUrl);
            },
            function(error) {
                self.fail(error);
                callbackfn(url);
            });      
    }
    else{
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            var res = this.response;
            YMAGYN.SDK.File.SaveFileContent(key,res,callbackfn);
        }
        xhr.send();
    }         
};
    
    
YMAGYN.SDK.File.SaveFileContent=function(name,content,callbackfn)
{
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
    var self = this;
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){   
        self._fileSystem.root.getFile(name, {
            create: true
        }, function(fileEntry)
        {
            fileEntry.createWriter(function(writer)
            {
                writer.write(content);
                callbackfn(fileEntry);
            }, function(error)
            {
                callbackfn("Can't write content to filename");
                self.fail(error);
            });
        }, function(error)
        {
            callbackfn("Can't get filename");
            self.fail(error);
        });   
    }
    else{
        self._fileSystem.root.getFile(name, {
            create: true
        }, function(fileEntry) {
            fileEntry.createWriter(function(writer) {
                var tcontent = [content];
                var blob = new Blob(tcontent);
                writer.write(blob); 
            } , function(error){
                callbackfn("Can't write content to filename");
                self.fail(error);
            });
        },  function(error)
        {
            callbackfn("Can't get filename");
            self.fail(error);
        });
    }
};
    
    
YMAGYN.SDK.File.mkDir=function(name,callbackfn)
{
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
    var self = this;
    self._fileSystem.root.getDirectory(name,
    {
        create: true
    },
    function(dirEntry) {
        callbackfn(true);
    },self.fail);
};
    
YMAGYN.SDK.File.ls=function(name, callbackfn)
{     
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
    var self = this;
    self._fileSystem.root.getDirectory(name, {},
        function(dirEntry){
            var dirReader = dirEntry.createReader();
            dirReader.readEntries(function(entries) {                  
                var list = new Array();
                for (var i = 0, entry; entry = entries[i]; ++i) {              
                    list[i]= entry;
                }
                callbackfn(list);
            }, self.fail);
        },self.fail);
        
};
    
YMAGYN.SDK.File.rmDir=function(name,callbackfn)
{
    if(!this._fileSystem)   
        YMAGYN.SDK.File._initFS();
    var self = this;
    self._fileSystem.root.getDirectory(name, {}, function(dirEntry) {
        dirEntry.removeRecursively(function(){
            callbackfn(true);
        }, self.fail);
    }, self.fail);


};
    
YMAGYN.SDK.File.fail= function(error) {
    switch(error.code)
    {
        case YMAGYN.SDK.File.FileError.NOT_FOUND_ERR:
            console.log("YMAGYN.SDK.File.FileError.NOT_FOUND_ERR");
            break;
        case YMAGYN.SDK.File.FileError.SECURITY_ERR:
            console.log("YMAGYN.SDK.File.FileError.SECURITY_ERR");
            break;
        case YMAGYN.SDK.File.FileError.ABORT_ERR:
            console.log("YMAGYN.SDK.File.FileError.ABORT_ERR");
            break;
        case YMAGYN.SDK.File.FileError.NOT_READABLE_ERR:
            console.log("YMAGYN.SDK.File.FileError.NOT_READABLE_ERR");
            break;
        case YMAGYN.SDK.File.FileError.ENCODING_ERR:
            console.log("YMAGYN.SDK.File.FileError.ENCODING_ERR");
            break;
        case YMAGYN.SDK.File.FileError.NO_MODIFICATION_ALLOWED_ERR:
            console.log("YMAGYN.SDK.File.FileError.NO_MODIFICATION_ALLOWED_ERR");
            break;
        case YMAGYN.SDK.File.FileError.INVALID_STATE_ERR:
            console.log("YMAGYN.SDK.File.FileError.INVALID_STATE_ERR");
            break;
        case YMAGYN.SDK.File.FileError.SYNTAX_ERR:
            console.log("YMAGYN.SDK.File.FileError.SYNTAX_ERR");
            break;
        case YMAGYN.SDK.File.FileError.INVALID_MODIFICATION_ERR:
            console.log("YMAGYN.SDK.File.FileError.INVALID_MODIFICATION_ERR");
            break;
        case YMAGYN.SDK.File.FileError.QUOTA_EXCEEDED_ERR:
            console.log("YMAGYN.SDK.File.FileError.QUOTA_EXCEEDED_ERR");
            break;
        case YMAGYN.SDK.File.FileError.TYPE_MISMATCH_ERR:
            console.log("YMAGYN.SDK.File.FileError.TYPE_MISMATCH_ERR");
            break;
        case YMAGYN.SDK.File.FileError.PATH_EXISTS_ERR:
            console.log("YMAGYN.SDK.File.FileError.PATH_EXISTS_ERR");
            break;
    }
};

if (typeof (YMAGYN.SDK.Geolocation) == "undefined" || !YMAGYN.SDK.Geolocation) {
    YMAGYN.SDK.Geolocation = {};
}

YMAGYN.SDK.Geolocation._watchId=null;

YMAGYN.SDK.Geolocation.getCurrentPosition=function(geolocationSuccess, geolocationError, geolocationOptions)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, geolocationOptions);
    }
    else
    {     
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, geolocationOptions);
        console.log("getCurrentPosition - Running on Desktop");
    }
};

YMAGYN.SDK.Geolocation.watchPosition=function(geolocationSuccess, geolocationError, geolocationOptions)
{
    this.clearWatch();
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        this._watchId=navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, geolocationOptions);
    }
    else
    {       
        this._watchId = setInterval(function(){
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, geolocationOptions);  
            console.log("watchPosition - Running on Desktop");
        }, 2500);       
    }
};


YMAGYN.SDK.Geolocation.clearWatch = function (){
    if(this._watchId!=null)
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
            navigator.geolocation.clearWatch(this._watchId);
        }
        else
        {
            clearInterval(this._watchId);
            console.log("clearWatch - Running on Desktop");
        }
    }
};if (typeof (YMAGYN.SDK.InAppBrowser) == "undefined" || !YMAGYN.SDK.InAppBrowser) {
    YMAGYN.SDK.InAppBrowser  = {};
}

YMAGYN.SDK.InAppBrowser=function(){
    return this;
};

YMAGYN.SDK.InAppBrowser.open = function(url, target, options){
    var instance = new YMAGYN.SDK.InAppBrowser();
    return instance._open(url, target, options);
};

YMAGYN.SDK.InAppBrowser.prototype={
    _open : function(url, target, options){
        this._openedWindow = window.open(url, target, options);
        if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows ||YMAGYN.SDK.isEmulate()){
            var me = this;
            me._openedWindowHref = this._openedWindow.location.href;
            me._openedWindowId = setInterval(function(){
                if(me._openedWindow.location==null){
                    clearInterval(me._openedWindowId);
                }
                else if(me._openedWindowHref != me._openedWindow.location.href){
                    me._openedWindowHref = me._openedWindow.location.href;               
                    var evt = document.createEvent("CustomEvent");
                    evt.initCustomEvent("loadstart", true, false, {url:me._openedWindow.location.href});
                    document.dispatchEvent(evt);
                }
            },500); 
        }
        return this;     
    },
    close:function(){
        this._openedWindow.close();  
          if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows ||YMAGYN.SDK.isEmulate()){
              clearInterval(this._openedWindowId);
          }
    },
    addEventListener : function(eventname, callback){
        if ((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate())
        {
            this._openedWindow.addEventListener(eventname, callback);
        }
        else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows ||YMAGYN.SDK.isEmulate()){
            console.log('now listening to ' + eventname);
            document.addEventListener(eventname, callback);
        }
    },
    removeEventListener: function(eventname, callback){
        if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._openedWindow.removeEventListener(eventname, callback);
        }
    },
    show:function(){
        if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._openedWindow.show();
        }
    },
    executeScript:function(details, callback){
        if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._openedWindow.executeScript(details, callback);
        }
    },
    insertCSS:function(details, callback){
        if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._openedWindow.insertCSS(details, callback);
        }
    },
    getLocation:function(){
        return this._openedWindow.location.href;
    }
};if (typeof (YMAGYN.SDK.Splashscreen) == "undefined" || !YMAGYN.SDK.Splashscreen) {
    YMAGYN.SDK.Splashscreen = {};
}

YMAGYN.SDK.Splashscreen.show = function(){
    if ((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate() )
    {
        navigator.splashscreen.show();      
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate() )
    {
        var splashContainer = document.createElement('div');
        splashContainer.id = "YmagynSplashContainer";
        splashContainer.style.position = "absolute";
        splashContainer.style.zIndex = 15;
        splashContainer.style.height = '100%';
        splashContainer.style.width = '100%';
        splashContainer.style.top = '0px';
        splashContainer.style.left = '0px';
        splashContainer.style.backgroundSize="cover";
        splashContainer.style.backgroundRepeat="no-repeat";
        splashContainer.style.backgroundPosition="center";
        YMAGYN.SDK.getCompilerConfig(function(config){
            if(config){
                if(YMAGYN.SDK.is.iPad){
                    var ipadPortrait = (YMAGYN.SDK.Device.name()=="iPad 3") ? "1536x2008" : "768x1004";
                    var ipadLandscape = (YMAGYN.SDK.Device.name()=="iPad 3") ? "2048x1496" : "1024x748";
                    switch(config.device_orientation){
                        case "landscape" :
                            console.log(config.splash.ipad.landscape[ipadLandscape])
                            splashContainer.style.backgroundImage="url(compiler/"+config.splash.ipad.landscape[ipadLandscape]+")";
                            break;
                        case 'portrait':
                            console.log(config.splash.ipad.portrait[ipadPortrait])
                            splashContainer.style.backgroundImage="url(compiler/"+config.splash.ipad.portrait[ipadPortrait]+")";
                            break;
                    }
                }
                else if(YMAGYN.SDK.is.iOS){
                    var splash="";
                    switch(YMAGYN.SDK.Device.name()){
                        case "iPhone 3G/3Gs" :
                            splash=config.splash.iphone.portrait["320x480"];
                            break;
                        case 'iPhone 4/4s':
                            splash=config.splash.iphone.portrait["640x960"];
                            break;
                        case 'iPhone 5':
                            splash=config.splash.iphone.portrait["640x960"];
                            break;
                    }
                    splashContainer.style.backgroundImage="url(compiler/"+config.splash.ipad.portrait[splash]+")";
                }
            }
            document.body.appendChild(splashContainer);
        });
    }
};

YMAGYN.SDK.Splashscreen.hide = function(){
    if ((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate() )
    {
        navigator.splashscreen.hide();
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate())
    {
        var splashContainer = document.getElementById('YmagynSplashContainer');
        if(splashContainer){
            splashContainer.remove();
        }
    }
};
if (typeof (YMAGYN.SDK.Connection) == "undefined" || !YMAGYN.SDK.Connection) {
    YMAGYN.SDK.Connection={};
}

YMAGYN.SDK.Connection.init = function(){
    if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        YMAGYN.SDK.Connection.type = navigator.connection.type;
    }
    else if (YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows){
        if(navigator.onLine)
        {
            YMAGYN.SDK.Connection.type=2;
        }
        else{
            YMAGYN.SDK.Connection.type=0;
        }
    }  
    if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        YMAGYN.SDK.Connection.UNKNOWN  = Connection.UNKNOWN;
        YMAGYN.SDK.Connection.ETHERNET = Connection.ETHERNET;
        YMAGYN.SDK.Connection.WIFI    = Connection.WIFI;
        YMAGYN.SDK.Connection.CELL_2G  = Connection.CELL_2G;
        YMAGYN.SDK.Connection.CELL_3G  = Connection.CELL_3G;
        YMAGYN.SDK.Connection.CELL_4G  = Connection.CELL_4G;
        YMAGYN.SDK.Connection.CELL     = Connection.CELL;
        YMAGYN.SDK.Connection.NONE     = Connection.NONE;
    }
    else if (YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows){
        YMAGYN.SDK.Connection.UNKNOWN  = 1;
        YMAGYN.SDK.Connection.ETHERNET = 2;
        YMAGYN.SDK.Connection.WIFI    = 3;
        YMAGYN.SDK.Connection.CELL_2G  = 4;
        YMAGYN.SDK.Connection.CELL_3G  = 5;
        YMAGYN.SDK.Connection.CELL_4G  = 6;
        YMAGYN.SDK.Connection.CELL     = 7;
        YMAGYN.SDK.Connection.NONE     = 0;
    }
};if (typeof (YMAGYN.SDK.Media) == "undefined" || !YMAGYN.SDK.Media) {
    YMAGYN.SDK.Media = {};
}
YMAGYN.SDK.Media._instance = null;
YMAGYN.SDK.Media = function(src, mediaSuccess, mediaError, mediaStatus){
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        if(YMAGYN.SDK.is.Android)
            {
                if(src.indexOf('http://')!=-1){
                    src = '/android_asset/www/'+src;
                }
            }
        this._instance =  new Media(src, mediaSuccess, mediaError, mediaStatus);
        return this;
    }
    else{
        this.src = src;
        if(mediaSuccess)
            this.mediaSuccess = mediaSuccess;
        if(mediaError)
            this.mediaError = mediaError;
        if(mediaStatus)
            this.mediaStatus = mediaStatus;
        
        var audio = document.createElement("audio");
        audio.src = this.src;
        document.body.appendChild(audio);
        this._instance=audio;
        console.log("Desktop - Create new media");
        return this;
    }
};

YMAGYN.SDK.Media.MEDIA_NONE =  0;
YMAGYN.SDK.Media.MEDIA_STARTING = 1;
YMAGYN.SDK.Media.MEDIA_RUNNING = 2;
YMAGYN.SDK.Media.MEDIA_PAUSED = 3;
YMAGYN.SDK.Media.MEDIA_STOPPED = 4;

YMAGYN.SDK.Media.prototype = {
    play:function()
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._instance.play();
        }
        else
        {              
            console.log("Desktop play");
            try{
                if(!this._instance.error){
                    this._instance.play();                       
                    if(this.mediaSuccess)
                        this.mediaSuccess();
                    if(this.mediaStatus)
                        this.mediaStatus(YMAGYN.SDK.Media.MEDIA_STARTING);
                }
                else
                {
                    if(this.mediaError)
                        this.mediaError(this._instance.error);
                    if(this.mediaStatus)
                        this.mediaStatus(YMAGYN.SDK.Media.MEDIA_NONE);
                }
            }
            catch(e)
            {
                if(this.mediaError)
                    this.mediaError(e);
                if(this.mediaStatus)
                    this.mediaStatus(YMAGYN.SDK.Media.MEDIA_NONE);
            }
        }
    },
  
    getCurrentPosition:function(mediaSuccess,mediaError)
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._instance.getCurrentPosition(mediaSuccess, mediaError);
        }
        else
        {              
            
            try{
                if(!this._instance.error)
                {
                    if(mediaSuccess)
                        mediaSuccess(this._instance.currentTime);     
                }
                else
                {
                    if(mediaError)
                        mediaError(this._instance.error);
                }
            }
            catch(e){
                if(mediaError)
                    mediaError(e);
            }
        }
    },
    
    getDuration:function()
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            return this._instance.getDuration();
        }
        else
        {             
            try{
                console.log("Desktop getDuration : " +this._instance.duration)
                if(this._instance.error)
                {
                    this.mediaError(this._instance.error);
                    return 0;
                }
                else
                {
                    return this._instance.duration;   
                }
            }
            catch(e){
                this.mediaError(e);
                return 0;
            }
        }
    },
    
        
    
    pause:function()
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._instance.pause();
        }
        else
        {              
            console.log("Desktop pause");
            try{
                if(!this._instance.error)
                {
                    this._instance.pause(); 
                    if(this.mediaSuccess)
                        this.mediaSuccess();
                    if(this.mediaStatus)
                        this.mediaStatus(YMAGYN.SDK.Media.MEDIA_PAUSED);
                }
                else{
                    if(this.mediaError)
                        this.mediaError(this._instance.error);
                }
            }
            catch(e){
                if(this.mediaError)
                    this.mediaError(e);
            }
        }
    },
    
    release:function()
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._instance.release();
        }
        else
        {              
            console.log("Desktop release");
            try{
                this._instance.remove();
                this._instance = null;
                if(this.mediaStatus)
                    this.mediaStatus(YMAGYN.SDK.Media.MEDIA_NONE);
            }
            catch(e)
            {
                if(this.mediaError)
                    this.mediaError(e);
            }
        }
    },
    
    seekTo:function(milliseconds)
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._instance.release(milliseconds);
        }
        else
        {              
            console.log("Desktop seekTo");
            try{
                this._instance.currentTime = milliseconds/1000;
            }
            catch(e)
            {
                if(this.mediaError)
                    this.mediaError(e);
            }
        }
    }, 
    
    startRecord:function()
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._instance.startRecord();
        }
        else
        {              
            console.log("Desktop startRecord");
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||     navigator.mozGetUserMedia || navigator.msGetUserMedia;
            window.URL= window.URL || window.webkitURL; 
            this._recorder=null;
            var self = this;
            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    audio: true,
                    video: false
                }, onStartRecordSuccess, onStartRecordError);
            } else {
                alert("sorry, not supported in your browser");
            }
            
            function onStartRecordError(e)
            {
                if(this.mediaError)
                    this.mediaError(e);
            }
            
            function onStartRecordSuccess(s) {
                var context = new webkitAudioContext();
                var mediaStreamSource = context.createMediaStreamSource(s);
                mediaStreamSource.connect(context.destination);
                self._recorder = new Recorder(mediaStreamSource);
                self._recorder.record();
            }
        }
    },
    
    stop:function()
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._instance.stop();
        }
        else
        {   
            console.log("Desktop stop")
            try{
                this._instance.pause();
                this._instance.currentTime = 0;
                if(this.mediaStatus)
                    this.mediaStatus(YMAGYN.SDK.Media.MEDIA_STOPPED);
                
            }
            catch(e)
            {
                if(this.mediaError)
                    this.mediaError(e);
            }
        }   
    },
    
    stopRecord:function()
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
        {
            this._instance.stopRecord();
        }
        else
        {   
            console.log("Desktop stopRecord");
            
            try{
                window.URL= window.URL || window.webkitURL; 
                this._recorder.stop();
                var self = this;
                this._recorder.exportWAV(function(s) {
                    self._instance.src = window.URL.createObjectURL(s);
                });
            }
            catch(e)
            {
                if(this.mediaError)
                    this.mediaError(e);
            }
            
        }   
    }
    
};if (typeof (YMAGYN.SDK.CameraPopoverOptions) == "undefined" || !YMAGYN.SDK.CameraPopoverOptions) {
    YMAGYN.SDK.CameraPopoverOptions = function(_x, _y, _width, _height, _arrowDir){
        this.x = _x;
        this.y = _y;
        this.width =_width;
        this.height = _height;
        this.arrowDir = _arrowDir;
        return this;
    };
}




YMAGYN.SDK.CameraPopoverOptions.PopoverArrowDirection = {
    ARROW_UP : 1,
    ARROW_DOWN : 2,
    ARROW_LEFT : 4,
    ARROW_RIGHT : 8,
    ARROW_ANY : 15
};

if (typeof (YMAGYN.SDK.Camera) == "undefined" || !YMAGYN.SDK.Camera) {
    YMAGYN.SDK.Camera = {};
}

YMAGYN.SDK.Camera.DestinationType = {
    DATA_URL : 0,
    FILE_URI : 1
};

YMAGYN.SDK.Camera.PictureSourceType = {
    PHOTOLIBRARY : 0,
    CAMERA : 1,
    SAVEDPHOTOALBUM : 2
};

YMAGYN.SDK.Camera.EncodingType = {
    JPEG : 0,               
    PNG : 1               
};
    
YMAGYN.SDK.Camera.MediaType = { 
    PICTURE: 0,         
    VIDEO: 1,          
    ALLMEDIA : 2     
};

YMAGYN.SDK.Camera.getPicture = function( cameraSuccess, cameraError,  cameraOptions){
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        navigator.camera.getPicture( cameraSuccess, cameraError, cameraOptions);
    }
    else{
    }
        
};

YMAGYN.SDK.Camera.cleanup = function( cameraSuccess, cameraError){
    if(YMAGYN.SDK.is.iOS){
        navigator.camera.cleanup( cameraSuccess, cameraError);
    }
    else{
        cameraSuccess(
        {
              
            });
    }
};if (typeof (YMAGYN.SDK.Contacts) == "undefined" || !YMAGYN.SDK.Contacts) {
    YMAGYN.SDK.Contacts = {};
}

if (typeof (YMAGYN.SDK.Contacts.ContactError) == "undefined" || !YMAGYN.SDK.Contacts.ContactError) {
    YMAGYN.SDK.Contacts.ContactError ={};
}
 
YMAGYN.SDK.Contacts.init = function()
{
    if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) {
        YMAGYN.SDK.Contacts.ContactError.UNKNOWN_ERROR = ContactError.UNKNOWN_ERROR;
        YMAGYN.SDK.Contacts.ContactError.INVALID_ARGUMENT_ERROR = ContactError.INVALID_ARGUMENT_ERROR;
        YMAGYN.SDK.Contacts.ContactError.TIMEOUT_ERROR = ContactError.TIMEOUT_ERROR;
        YMAGYN.SDK.Contacts.ContactError.PENDING_OPERATION_ERROR = ContactError.PENDING_OPERATION_ERROR;
        YMAGYN.SDK.Contacts.ContactError.IO_ERROR = ContactError.IO_ERROR;
        YMAGYN.SDK.Contacts.ContactError.NOT_SUPPORTED_ERROR = ContactError.NOT_SUPPORTED_ERROR;
        YMAGYN.SDK.Contacts.ContactError.PERMISSION_DENIED_ERROR = ContactError.PERMISSION_DENIED_ERROR;
    }
}

YMAGYN.SDK.Contacts.create = function(properties){
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        return navigator.contacts.create(properties);
    }
    else{
        return new YMAGYN.SDK.Contacts.Contact(properties);
    }
}


YMAGYN.SDK.Contacts.find = function(contactFields, contactSuccess, contactError, contactFindOptions){
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.contacts.find(contactFields, contactSuccess, contactError, contactFindOptions);
    }
    else{
        _ContactsDatabase.transaction(function(tx){
            if(contactFields=='undefined' || contactFields==null || contactFields.length==0 || contactFindOptions=='undefined' || contactFindOptions==null || contactFindOptions.filter=="")
            {
                tx.executeSql('SELECT * FROM CONTACTS', 
                    [],
                    function(tx, results){
                        var contacts=[];
                        for (var i=0; i<results.rows.length; i++){
                            var properties = {
                                "displayName": results.rows.item(i).displayName,
                                "nickname" : results.rows.item(i).nickname,
                                "birthday" : results.rows.item(i).birthday,
                                "note" : results.rows.item(i).note
                            };
                            var contact= new YMAGYN.SDK.Contacts.Contact(properties);
                            contact.name=window.JSON.parse(results.rows.item(i).name);
                            contact.phoneNumbers=window.JSON.parse(results.rows.item(i).phoneNumbers);
                            contact.emails=window.JSON.parse(results.rows.item(i).emails);
                            contact.addresses=window.JSON.parse(results.rows.item(i).addresses);
                            contact.ims=window.JSON.parse(results.rows.item(i).ims);
                            contact.organizations=window.JSON.parse(results.rows.item(i).organizations);
                            contact.photos=window.JSON.parse(results.rows.item(i).photos);
                            contact.categories=window.JSON.parse(results.rows.item(i).categories);
                            contact.urls=window.JSON.parse(results.rows.item(i).urls);
                            contact.id = results.rows.item(i).id;
                            contacts[i]=contact;
                        } 
                        contactSuccess(contacts);
                    }
                    , contactError);
            }
            else{
                var condition = [];
                contactFindOptions.filter = (typeof(contactFindOptions.filter) === 'number') ?' = '+ contactFindOptions.filter : ' LIKE \'%'+contactFindOptions.filter+'%\'';
                for(var i =0; i< contactFields.length; i++)
                {
                    condition[i]= contactFields[i] + contactFindOptions.filter;
                }
                var request = 'SELECT * FROM CONTACTS WHERE ' + condition.join(' OR ');
                tx.executeSql(request, 
                    [],
                    function(tx, results){
                        var contacts=[];
                        for (var i=0; i<results.rows.length; i++){
                            var properties = {
                                "displayName": results.rows.item(i).displayName,
                                "nickname" : results.rows.item(i).nickname,
                                "birthday" : results.rows.item(i).birthday,
                                "note" : results.rows.item(i).note
                            };
                            var contact= new YMAGYN.SDK.Contacts.Contact(properties);
                            contact.name=window.JSON.parse(results.rows.item(i).name);
                            contact.phoneNumbers=window.JSON.parse(results.rows.item(i).phoneNumbers);
                            contact.emails=window.JSON.parse(results.rows.item(i).emails);
                            contact.addresses=window.JSON.parse(results.rows.item(i).addresses);
                            contact.ims=window.JSON.parse(results.rows.item(i).ims);
                            contact.organizations=window.JSON.parse(results.rows.item(i).organizations);
                            contact.photos=window.JSON.parse(results.rows.item(i).photos);
                            contact.categories=window.JSON.parse(results.rows.item(i).categories);
                            contact.urls=window.JSON.parse(results.rows.item(i).urls);
                            contact.id = results.rows.item(i).id;
                            contacts[i]=contact;
                        } 
                        contactSuccess(contacts);
                    }
                    , contactError);
            }
        }, contactError);
    }
}


if (typeof (YMAGYN.SDK.Contacts.ContactOrganization) == "undefined" || !YMAGYN.SDK.Contacts.ContactOrganization){
    YMAGYN.SDK.Contacts.ContactOrganization={};
}

YMAGYN.SDK.Contacts.ContactOrganization=function()
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        return new ContactORganization();
    }
    else{
        return {};
    }
}

if (typeof (YMAGYN.SDK.Contacts.ContactFindOptions) == "undefined" || !YMAGYN.SDK.Contacts.ContactFindOptions){
    YMAGYN.SDK.Contacts.ContactFindOptions={};
}

YMAGYN.SDK.Contacts.ContactFindOptions=function()
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        return new ContactFindOptions();
    }
    else{
        return{
            filter:'', 
            multiple:false
        }
    }
}

if (typeof (YMAGYN.SDK.Contacts.ContactName) == "undefined" || !YMAGYN.SDK.Contacts.ContactName){
    YMAGYN.SDK.Contacts.ContactName={};
}

YMAGYN.SDK.Contacts.ContactName=function()
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        return new ContactName();
    }
    else{
        return {};
    }
}

if (typeof (YMAGYN.SDK.Contacts.ContactName) == "undefined" || !YMAGYN.SDK.Contacts.ContactName){
    YMAGYN.SDK.Contacts.ContactName={};
}

if (typeof (YMAGYN.SDK.Contacts.ContactAddress) == "undefined" || !YMAGYN.SDK.Contacts.ContactAddress) {
    YMAGYN.SDK.Contacts.ContactAddress ={};
}

YMAGYN.SDK.Contacts.ContactAddress= function(){
    
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        return new ContactAddress();
    }
    else{
        
        return {};   
    }
}

if (typeof (YMAGYN.SDK.Contacts.ContactField) == "undefined" || !YMAGYN.SDK.Contacts.ContactField) {
    YMAGYN.SDK.Contacts.ContactField ={};
}

YMAGYN.SDK.Contacts.ContactField= function(type, value, pref){
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        return new ContactField(type, value, pref);
    }
    else{
        return {
            type:type,
            value:value,
            pref:pref
        };
    }
}

YMAGYN.SDK.Contacts.Contact = function(properties)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
        this._contact = navigator.contacts.create(properties);
        return this;
    }
    else{
        this.id = 0;
        this.displayName = (properties.displayName) ? properties.displayName : "";
        this.name = (properties.name) ? properties.name : null;
        this.nickname = (properties.nickname) ? properties.nickname : "";
        this.phoneNumbers = (properties.phoneNumbers) ? properties.phoneNumbers : [];
        this.emails = (properties.emails) ? properties.emails : [];
        this.addresses = (properties.addresses) ? properties.addresses : [];
        this.ims = (properties.ims) ? properties.ims : [];
        this.organizations = (properties.organizations) ? properties.organizations : [];
        this.birthday = (properties.birthday) ? properties.birthday : null;
        this.note = (properties.note) ? properties.note : "";
        this.photos = (properties.photos) ? properties.photos : [];
        this.categories = (properties.categories) ? properties.categories : [];
        this.urls = (properties.urls) ? properties.urls : [];
        return this;
    }  
}

YMAGYN.SDK.Contacts.Contact.prototype = {
    clone:function(){
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
            return this._contact.clone();
        }
        else{         
            var clone = new YMAGYN.SDK.Contacts.Contact({
                "displayName": this.displayName
            });
            clone.id = null;
            clone.name = this.name;
            clone.nickname = this.nickname;
            clone.phoneNumbers = this.phoneNumbers;
            clone.emails = this.emails;
            clone.addresses = this.addresses;
            clone.ims = this.ims;
            clone.organizations = this.organizations;
            clone.birthday = this.birthday;
            clone.note = this.note;
            clone.photos = this.photos;
            clone.categories = this.categories;
            clone.urls = this.urls;
            return clone;
        }
    },
    remove:function(onSuccess,onError)
    {
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
            this._contact.remove(onSuccess,onError);
        }
        else{
            var self = this;
            _ContactsDatabase.transaction(function(tx){
                tx.executeSql('DELETE FROM CONTACTS WHERE id =' + self.id)
                onSuccess();
            }, onError);
        }
    },
    save:function(onSuccess,onError){
        if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){
            this._contact.save(onSuccess,onError);
        }
        else{
            var self = this;
            _ContactsDatabase.transaction(function(tx){
                var name = window.JSON.stringify(self.name);
                var phoneNumbers=window.JSON.stringify(self.phoneNumbers);
                var emails=window.JSON.stringify(self.emails);
                var addresses=window.JSON.stringify(self.addresses);
                var ims=window.JSON.stringify(self.ims);
                var organizations=window.JSON.stringify(self.organizations);
                var photos=window.JSON.stringify(self.photos);
                var categories=window.JSON.stringify(self.categories);
                var urls=window.JSON.stringify(self.urls);
                var birthday = (self.birthday!=null) ? self.birthday.toString() : "";                
                tx.executeSql('INSERT INTO CONTACTS (displayName, name, nickname, phoneNumbers, emails, addresses, ims, organizations, birthday, note, photos, categories, urls) VALUES(\''+self.displayName+'\',\''+name+'\',\''+self.nickname+'\',\''+phoneNumbers+'\',\''+emails+'\',\''+addresses+'\',\''+ims+'\',\''+organizations+'\',\''+birthday+'\',\''+self.note+'\',\''+photos+'\',\''+categories+'\',\''+urls+'\')');
                if(typeof(onSuccess)=='function'){
                    onSuccess();
                }
            },function(e){
                if(typeof(onError)=='function'){
                    onError(e);
                }
            });
        } 
    }
}


if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS){}
else{
    var _ContactsDatabase = YMAGYN.SDK.Storage.openDatabase("Contacts", 1, "Contacts", 2048);
    _ContactsDatabase.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS CONTACTS (id INTEGER PRIMARY KEY, displayName VARCHAR(255), name TEXT, nickname VARCHAR(255),phoneNumbers TEXT, emails TEXT, addresses TEXT, ims TEXT, organizations TEXT, birthday DATETIME , note TEXT,photos TEXT, categories TEXT, urls TEXT)');
    })
}
(function(w){var k=function(b,c){typeof c=="undefined"&&(c={});this.init(b,c)},a=k.prototype,o,p=["canvas","vml"],f=["oval","spiral","square","rect","roundRect"],x=/^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,v=navigator.appVersion.indexOf("MSIE")!==-1&&parseFloat(navigator.appVersion.split("MSIE")[1])===8?true:false,y=!!document.createElement("canvas").getContext,q=true,n=function(b,c,a){var b=document.createElement(b),d;for(d in a)b[d]=a[d];typeof c!=="undefined"&&c.appendChild(b);return b},m=function(b,
c){for(var a in c)b.style[a]=c[a];return b},t=function(b,c){for(var a in c)b.setAttribute(a,c[a]);return b},u=function(b,c,a,d){b.save();b.translate(c,a);b.rotate(d);b.translate(-c,-a);b.beginPath()};a.init=function(b,c){if(typeof c.safeVML==="boolean")q=c.safeVML;try{this.mum=document.getElementById(b)!==void 0?document.getElementById(b):document.body}catch(a){this.mum=document.body}c.id=typeof c.id!=="undefined"?c.id:"canvasLoader";this.cont=n("div",this.mum,{id:c.id});if(y)o=p[0],this.can=n("canvas",
this.cont),this.con=this.can.getContext("2d"),this.cCan=m(n("canvas",this.cont),{display:"none"}),this.cCon=this.cCan.getContext("2d");else{o=p[1];if(typeof k.vmlSheet==="undefined"){document.getElementsByTagName("head")[0].appendChild(n("style"));k.vmlSheet=document.styleSheets[document.styleSheets.length-1];var d=["group","oval","roundrect","fill"],e;for(e in d)k.vmlSheet.addRule(d[e],"behavior:url(#default#VML); position:absolute;")}this.vml=n("group",this.cont)}this.setColor(this.color);this.draw();
m(this.cont,{display:"none"})};a.cont={};a.can={};a.con={};a.cCan={};a.cCon={};a.timer={};a.activeId=0;a.diameter=40;a.setDiameter=function(b){this.diameter=Math.round(Math.abs(b));this.redraw()};a.getDiameter=function(){return this.diameter};a.cRGB={};a.color="#000000";a.setColor=function(b){this.color=x.test(b)?b:"#000000";this.cRGB=this.getRGB(this.color);this.redraw()};a.getColor=function(){return this.color};a.shape=f[0];a.setShape=function(b){for(var c in f)if(b===f[c]){this.shape=b;this.redraw();
break}};a.getShape=function(){return this.shape};a.density=40;a.setDensity=function(b){this.density=q&&o===p[1]?Math.round(Math.abs(b))<=40?Math.round(Math.abs(b)):40:Math.round(Math.abs(b));if(this.density>360)this.density=360;this.activeId=0;this.redraw()};a.getDensity=function(){return this.density};a.range=1.3;a.setRange=function(b){this.range=Math.abs(b);this.redraw()};a.getRange=function(){return this.range};a.speed=2;a.setSpeed=function(b){this.speed=Math.round(Math.abs(b))};a.getSpeed=function(){return this.speed};
a.fps=24;a.setFPS=function(b){this.fps=Math.round(Math.abs(b));this.reset()};a.getFPS=function(){return this.fps};a.getRGB=function(b){b=b.charAt(0)==="#"?b.substring(1,7):b;return{r:parseInt(b.substring(0,2),16),g:parseInt(b.substring(2,4),16),b:parseInt(b.substring(4,6),16)}};a.draw=function(){var b=0,c,a,d,e,h,k,j,r=this.density,s=Math.round(r*this.range),l,i,q=0;i=this.cCon;var g=this.diameter;if(o===p[0]){i.clearRect(0,0,1E3,1E3);t(this.can,{width:g,height:g});for(t(this.cCan,{width:g,height:g});b<
r;){l=b<=s?1-1/s*b:l=0;k=270-360/r*b;j=k/180*Math.PI;i.fillStyle="rgba("+this.cRGB.r+","+this.cRGB.g+","+this.cRGB.b+","+l.toString()+")";switch(this.shape){case f[0]:case f[1]:c=g*0.07;e=g*0.47+Math.cos(j)*(g*0.47-c)-g*0.47;h=g*0.47+Math.sin(j)*(g*0.47-c)-g*0.47;i.beginPath();this.shape===f[1]?i.arc(g*0.5+e,g*0.5+h,c*l,0,Math.PI*2,false):i.arc(g*0.5+e,g*0.5+h,c,0,Math.PI*2,false);break;case f[2]:c=g*0.12;e=Math.cos(j)*(g*0.47-c)+g*0.5;h=Math.sin(j)*(g*0.47-c)+g*0.5;u(i,e,h,j);i.fillRect(e,h-c*0.5,
c,c);break;case f[3]:case f[4]:a=g*0.3,d=a*0.27,e=Math.cos(j)*(d+(g-d)*0.13)+g*0.5,h=Math.sin(j)*(d+(g-d)*0.13)+g*0.5,u(i,e,h,j),this.shape===f[3]?i.fillRect(e,h-d*0.5,a,d):(c=d*0.55,i.moveTo(e+c,h-d*0.5),i.lineTo(e+a-c,h-d*0.5),i.quadraticCurveTo(e+a,h-d*0.5,e+a,h-d*0.5+c),i.lineTo(e+a,h-d*0.5+d-c),i.quadraticCurveTo(e+a,h-d*0.5+d,e+a-c,h-d*0.5+d),i.lineTo(e+c,h-d*0.5+d),i.quadraticCurveTo(e,h-d*0.5+d,e,h-d*0.5+d-c),i.lineTo(e,h-d*0.5+c),i.quadraticCurveTo(e,h-d*0.5,e+c,h-d*0.5))}i.closePath();i.fill();
i.restore();++b}}else{m(this.cont,{width:g,height:g});m(this.vml,{width:g,height:g});switch(this.shape){case f[0]:case f[1]:j="oval";c=140;break;case f[2]:j="roundrect";c=120;break;case f[3]:case f[4]:j="roundrect",c=300}a=d=c;e=500-d;for(h=-d*0.5;b<r;){l=b<=s?1-1/s*b:l=0;k=270-360/r*b;switch(this.shape){case f[1]:a=d=c*l;e=500-c*0.5-c*l*0.5;h=(c-c*l)*0.5;break;case f[0]:case f[2]:v&&(h=0,this.shape===f[2]&&(e=500-d*0.5));break;case f[3]:case f[4]:a=c*0.95,d=a*0.28,v?(e=0,h=500-d*0.5):(e=500-a,h=
-d*0.5),q=this.shape===f[4]?0.6:0}i=t(m(n("group",this.vml),{width:1E3,height:1E3,rotation:k}),{coordsize:"1000,1000",coordorigin:"-500,-500"});i=m(n(j,i,{stroked:false,arcSize:q}),{width:a,height:d,top:h,left:e});n("fill",i,{color:this.color,opacity:l});++b}}this.tick(true)};a.clean=function(){if(o===p[0])this.con.clearRect(0,0,1E3,1E3);else{var b=this.vml;if(b.hasChildNodes())for(;b.childNodes.length>=1;)b.removeChild(b.firstChild)}};a.redraw=function(){this.clean();this.draw()};a.reset=function(){typeof this.timer===
"number"&&(this.hide(),this.show())};a.tick=function(b){var a=this.con,f=this.diameter;b||(this.activeId+=360/this.density*this.speed);o===p[0]?(a.clearRect(0,0,f,f),u(a,f*0.5,f*0.5,this.activeId/180*Math.PI),a.drawImage(this.cCan,0,0,f,f),a.restore()):(this.activeId>=360&&(this.activeId-=360),m(this.vml,{rotation:this.activeId}))};a.show=function(){if(typeof this.timer!=="number"){var a=this;this.timer=self.setInterval(function(){a.tick()},Math.round(1E3/this.fps));m(this.cont,{display:"block"})}};
a.hide=function(){typeof this.timer==="number"&&(clearInterval(this.timer),delete this.timer,m(this.cont,{display:"none"}))};a.kill=function(){var a=this.cont;typeof this.timer==="number"&&this.hide();o===p[0]?(a.removeChild(this.can),a.removeChild(this.cCan)):a.removeChild(this.vml);for(var c in this)delete this[c]};w.CanvasLoader=k})(window);(function(window){

  var WORKER_PATH = '../Lib/recorderWorker.js';

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    this.context = source.context;
    this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
    var worker = new Worker(config.workerPath || WORKER_PATH);
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    });
    var recording = false,
      currCallback;

    this.node.onaudioprocess = function(e){
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      });
    }

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    }

    this.record = function(){
      recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffer = function(cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffer' })
    }

    this.exportWAV = function(cb, type){
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    }

    worker.onmessage = function(e){
      var blob = e.data;
      currCallback(blob);
    }

    source.connect(this.node);
    this.node.connect(this.context.destination);    //this should not be necessary
  };

  Recorder.forceDownload = function(blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'output.wav';
    var click = document.createEvent("Event");
    click.initEvent("click", true, true);
    link.dispatchEvent(click);
  }

  window.Recorder = Recorder;

})(window);/**
 *  @license
 *  jsOAuth version 1.3.6
 *  Copyright (c) 2010, 2011 Rob Griffiths (http://bytespider.eu)
 *  jsOAuth is freely distributable under the terms of an MIT-style license.
 */
var exports = exports || this;
exports.OAuth = (function (global) {

    /** signed.applets.codebase_principal_support to enable support in Firefox **/

    function Collection(obj) {
        var args = arguments, args_callee = args.callee, args_length = args.length,
            i, collection = this;

        if (!(this instanceof args_callee)) {
            return new args_callee(obj);
        }

        for(i in obj) {
            if (obj.hasOwnProperty(i)) {
                collection[i] = obj[i];
            }
        }

        return collection;
    }

    function Hash() {}
    Hash.prototype = {
        join: function(string){
            string = string || '';
            return this.values().join(string);
        },
        keys: function(){
            var i, arr = [], self = this;
            for (i in self) {
                if (self.hasOwnProperty(i)) {
                    arr.push(i);
                }
            }

            return arr;
        },
        values: function(){
            var i, arr = [], self = this;
            for (i in self) {
                if (self.hasOwnProperty(i)) {
                    arr.push(self[i]);
                }
            }

            return arr;
        },
        shift: function(){throw 'not implimented';},
        unshift: function(){throw 'not implimented';},
        push: function(){throw 'not implimented';},
        pop: function(){throw 'not implimented';},
        sort: function(){throw 'not implimented';},

        ksort: function(func){
            var self = this, keys = self.keys(), i, value, key;

            if (func == undefined) {
                keys.sort();
            } else {
                keys.sort(func);
            }

            for (i = 0; i  < keys.length; i++) {
                key = keys[i];
                value = self[key];
                delete self[key];
                self[key] = value;
            }

            return self;
        },
        toObject: function () {
            var obj = {}, i, self = this;
            for (i in self) {
                if (self.hasOwnProperty(i)) {
                    obj[i] = self[i];
                }
            }

            return obj;
        }
    };
    Collection.prototype = new Hash;
    /**
     * Url
     *
     * @constructor
     * @param {String} url
     */
    function URI(url) {
        var args = arguments, args_callee = args.callee,
            parsed_uri, scheme, host, port, path, query, anchor,
            parser = /^([^:\/?#]+?:\/\/)*([^\/:?#]*)?(:[^\/?#]*)*([^?#]*)(\?[^#]*)?(#(.*))*/,
            uri = this;

        if (!(this instanceof args_callee)) {
            return new args_callee(url);
        }

        uri.scheme = '';
        uri.host = '';
        uri.port = '';
        uri.path = '';
        uri.query = new QueryString();
        uri.anchor = '';

        if (url !== null) {
            parsed_uri = url.match(parser);

            scheme = parsed_uri[1];
            host = parsed_uri[2];
            port = parsed_uri[3];
            path = parsed_uri[4];
            query = parsed_uri[5];
            anchor = parsed_uri[6];

            scheme = (scheme !== undefined) ? scheme.replace('://', '').toLowerCase() : 'http';
            port = (port ? port.replace(':', '') : (scheme === 'https' ? '443' : '80'));
            // correct the scheme based on port number
            scheme = (scheme == 'http' && port === '443' ? 'https' : scheme);
            query = query ? query.replace('?', '') : '';
            anchor = anchor ? anchor.replace('#', '') : '';


            // Fix the host name to include port if non-standard ports were given
            if ((scheme === 'https' && port !== '443') || (scheme === 'http' && port !== '80')) {
                host = host + ':' + port;
            }

            uri.scheme = scheme;
            uri.host = host;
            uri.port = port;
            uri.path = path || '/';
            uri.query.setQueryParams(query);
            uri.anchor = anchor || '';
        }
    }

    URI.prototype = {
        scheme: '',
        host: '',
        port: '',
        path: '',
        query: '',
        anchor: '',
        toString: function () {
            var self = this, query = self.query + '';
            return self.scheme + '://' + self.host + self.path + (query != '' ? '?' + query : '') + (self.anchor !== '' ? '#' + self.anchor : '');
        }
    };

    /**
     * Create and manage a query string
     *
     * @param {Object} obj
     */
    function QueryString(obj){
        var args = arguments, args_callee = args.callee, args_length = args.length,
            i, querystring = this, decode = OAuth.urlDecode;

        if (!(this instanceof args_callee)) {
            return new args_callee(obj);
        }

        if (obj != undefined) {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    querystring[i] = obj[i];
                }
            }
        }

        return querystring;
    }
    // QueryString is a type of collection So inherit
    QueryString.prototype = new Collection();

    QueryString.prototype.toString = function () {
        var i, self = this, q_arr = [], ret = '',
        val = '', encode = OAuth.urlEncode;
        self.ksort(); // lexicographical byte value ordering of the keys

        for (i in self) {
            if (self.hasOwnProperty(i)) {
                if (i != undefined && self[i] != undefined) {
                    val = encode(i) + '=' + encode(self[i]);
                    q_arr.push(val);
                }
            }
        }

        if (q_arr.length > 0) {
            ret = q_arr.join('&');
        }

        return ret;
    };

    /**
     *
     * @param {Object} query
     */
    QueryString.prototype.setQueryParams = function (query) {
        var args = arguments, args_length = args.length, i, query_array,
            query_array_length, querystring = this, key_value, decode = OAuth.urlDecode;

        if (args_length == 1) {
            if (typeof query === 'object') {
                // iterate
                for (i in query) {
                    if (query.hasOwnProperty(i)) {
                        querystring[i] = decode(query[i]);
                    }
                }
            } else if (typeof query === 'string') {
                // split string on '&'
                query_array = query.split('&');
                // iterate over each of the array items
                for (i = 0, query_array_length = query_array.length; i < query_array_length; i++) {
                    // split on '=' to get key, value
                    key_value = query_array[i].split('=');
                    if (key_value[0] != "") {
                        querystring[key_value[0]] = decode(key_value[1]);
                    }
                }
            }
        } else {
            for (i = 0; i < args_length; i += 2) {
                // treat each arg as key, then value
                querystring[args[i]] = decode(args[i+1]);
            }
        }
    };

    /** @const */ var OAUTH_VERSION_1_0 = '1.0';

    /**
     * OAuth
     *
     * @constructor
     */
    function OAuth(options) {
        if (!(this instanceof OAuth)) {
            return new OAuth(options);
        }

        return this.init(options);
    }

    OAuth.prototype = {
        realm: '',
        requestTokenUrl: '',
        authorizationUrl: '',
        accessTokenUrl: '',

        init: function (options) {
            var empty = '';
            var oauth = {
                enablePrivilege: options.enablePrivilege || false,

                proxyUrl: options.proxyUrl,
                callbackUrl: options.callbackUrl || 'oob',

                consumerKey: options.consumerKey,
                consumerSecret: options.consumerSecret,
                accessTokenKey: options.accessTokenKey || empty,
                accessTokenSecret: options.accessTokenSecret || empty,
                verifier: empty,
                signatureMethod: options.signatureMethod || 'HMAC-SHA1'
            };

            this.realm = options.realm || empty;
            this.requestTokenUrl = options.requestTokenUrl || empty;
            this.authorizationUrl = options.authorizationUrl || empty;
            this.accessTokenUrl = options.accessTokenUrl || empty;

            this.getAccessToken = function () {
                return [oauth.accessTokenKey, oauth.accessTokenSecret];
            };

            this.getAccessTokenKey = function () {
                return oauth.accessTokenKey;
            };

            this.getAccessTokenSecret = function () {
                return oauth.accessTokenSecret;
            };

            this.setAccessToken = function (tokenArray, tokenSecret) {
                if (tokenSecret) {
                    tokenArray = [tokenArray, tokenSecret];
                }
                oauth.accessTokenKey = tokenArray[0];
                oauth.accessTokenSecret = tokenArray[1];
            };

            this.getVerifier = function () {
                return oauth.verifier;
            };

            this.setVerifier = function (verifier) {
                oauth.verifier = verifier;
            };

            this.setCallbackUrl = function (url) {
                oauth.callbackUrl = url;
            };

            /**
             * Makes an authenticated http request
             *
             * @param options {object}
             *      method {string} ['GET', 'POST', 'PUT', ...]
             *      url {string} A valid http(s) url
             *      data {object} A key value paired object of data
             *                      example: {'q':'foobar'}
             *                      for GET this will append a query string
             *      headers {object} A key value paired object of additional headers
             *      success {function} callback for a sucessful request
             *      failure {function} callback for a failed request
             */
            this.request = function (options) {
                var method, url, data, headers, success, failure, xhr, i,
                    headerParams, signatureMethod, signatureString, signature,
                    query = [], appendQueryString, signatureData = {}, params, withFile, urlString;

                method = options.method || 'GET';
                url = URI(options.url);
                data = options.data || {};
                headers = options.headers || {};
                success = options.success || function () {};
                failure = options.failure || function () {};

                // According to the spec
                withFile = (function(){
                    var hasFile = false;
                    for(var name in data) {
                        // Thanks to the FileAPI any file entry
                        // has a fileName property
                        if(data[name] instanceof  File || typeof data[name].fileName != 'undefined') hasFile = true;
                    }

                    return hasFile;
                })();

                appendQueryString = options.appendQueryString ? options.appendQueryString : false;

                if (oauth.enablePrivilege) {
                    netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead UniversalBrowserWrite');
                }

                xhr = Request();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        var regex = /^(.*?):\s*(.*?)\r?$/mg,
                            requestHeaders = headers,
                            responseHeaders = {},
                            responseHeadersString = '',
                            match;

                        if (!!xhr.getAllResponseHeaders) {
                            responseHeadersString = xhr.getAllResponseHeaders();
                            while((match = regex.exec(responseHeadersString))) {
                                responseHeaders[match[1]] = match[2];
                            }
                        } else if(!!xhr.getResponseHeaders) {
                            responseHeadersString = xhr.getResponseHeaders();
                            for (var i = 0, len = responseHeadersString.length; i < len; ++i) {
                                responseHeaders[responseHeadersString[i][0]] = responseHeadersString[i][1];
                            }
                        }

                        var includeXML = false;
                        if ('Content-Type' in responseHeaders)
                        {
                            if (responseHeaders['Content-Type'] == 'text/xml')
                            {
                                includeXML = true;
                            }

                        }
                        var responseObject = {text: xhr.responseText, xml: (includeXML ? xhr.responseXML : ''), requestHeaders: requestHeaders, responseHeaders: responseHeaders};

                        // we are powerless against 3xx redirects
                        if((xhr.status >= 200 && xhr.status <= 226) || xhr.status == 304 || xhr.status === 0) {
                            success(responseObject);
                        // everything what is 400 and above is a failure code
                        } else if(xhr.status >= 400 && xhr.status !== 0) {
                            failure(responseObject);
                        }
                    }
                };

                headerParams = {
                    'oauth_callback': oauth.callbackUrl,
                    'oauth_consumer_key': oauth.consumerKey,
                    'oauth_token': oauth.accessTokenKey,
                    'oauth_signature_method': oauth.signatureMethod,
                    'oauth_timestamp': getTimestamp(),
                    'oauth_nonce': getNonce(),
                    'oauth_verifier': oauth.verifier,
                    'oauth_version': OAUTH_VERSION_1_0
                };

                signatureMethod = oauth.signatureMethod;

                // Handle GET params first
                params = url.query.toObject();
                for (i in params) {
                    signatureData[i] = params[i];
                }

                // According to the OAuth spec
                // if data is transfered using
                // multipart the POST data doesn't
                // have to be signed:
                // http://www.mail-archive.com/oauth@googlegroups.com/msg01556.html
                if((!('Content-Type' in headers) || headers['Content-Type'] == 'application/x-www-form-urlencoded') && !withFile) {
                    for (i in data) {
                        signatureData[i] = data[i];
                    }
                }

                urlString = url.scheme + '://' + url.host + url.path;
                signatureString = toSignatureBaseString(method, urlString, headerParams, signatureData);

                signature = OAuth.signatureMethod[signatureMethod](oauth.consumerSecret, oauth.accessTokenSecret, signatureString);

                headerParams.oauth_signature = signature;

                if (this.realm)
                {
                    headerParams['realm'] = this.realm;
                }

                if (oauth.proxyUrl) {
                    url = URI(oauth.proxyUrl + url.path);
                }

                if(appendQueryString || method == 'GET') {
                    url.query.setQueryParams(data);
                    query = null;
                } else if(!withFile){
                    if (typeof data == 'string') {
                        query = data;
                        if (!('Content-Type' in headers)) {
                            headers['Content-Type'] = 'text/plain';
                        }
                    } else {
                        for(i in data) {
                            query.push(OAuth.urlEncode(i) + '=' + OAuth.urlEncode(data[i] + ''));
                        }
                        query = query.sort().join('&');
                        if (!('Content-Type' in headers)) {
                            headers['Content-Type'] = 'application/x-www-form-urlencoded';
                        }
                    }

                } else if(withFile) {
                    // When using FormData multipart content type
                    // is used by default and required header
                    // is set to multipart/form-data etc
                    query = new FormData();
                    for(i in data) {
                        query.append(i, data[i]);
                    }
                }

                xhr.open(method, url+'', true);

                xhr.setRequestHeader('Authorization', 'OAuth ' + toHeaderString(headerParams));
                xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
                for (i in headers) {
                    xhr.setRequestHeader(i, headers[i]);
                }

                xhr.send(query);
            };

            return this;
        },

        /**
         * Wrapper for GET OAuth.request
         *
         * @param url {string} vaild http(s) url
         * @param success {function} callback for a successful request
         * @param failure {function} callback for a failed request
         */
        get: function (url, success, failure) {
            this.request({'url': url, 'success': success, 'failure': failure});
        },

        /**
         * Wrapper for POST OAuth.request
         *
         * @param url {string} vaild http(s) url
         * @param data {object} A key value paired object of data
         *                      example: {'q':'foobar'}
         *                      for GET this will append a query string
         * @param success {function} callback for a successful request
         * @param failure {function} callback for a failed request
         */
        post: function (url, data, success, failure) {
            this.request({'method': 'POST', 'url': url, 'data': data, 'success': success, 'failure': failure});
        },

        /**
         * Wrapper to parse a JSON string and pass it to the callback
         *
         * @param url {string} vaild http(s) url
         * @param success {function} callback for a successful request
         * @param failure {function} callback for a failed request
         */
        getJSON: function (url, success, failure) {
            this.get(url, function (data) {
                success(JSON.parse(data.text));
            }, failure);
        },

        /**
         * Wrapper to parse a JSON string and pass it to the callback
         *
         * @param url {string} vaild http(s) url
         * @param success {function} callback for a successful request
         * @param failure {function} callback for a failed request
         */
        postJSON: function (url, data, success, failure) {
            this.request({
                'method': 'POST',
                'url': url,
                'data': JSON.stringify(data),
                'success': function (data) {
                    success(JSON.parse(data.text));
                },
                'failure': failure,
                'headers': {
                    'Content-Type': 'application/json'
                }
            });
        },

        parseTokenRequest: function (tokenRequest, content_type) {

            switch(content_type)
            {
                case "text/xml":
                    var token = tokenRequest.xml.getElementsByTagName('token');
                    var secret = tokenRequest.xml.getElementsByTagName('secret');

                    obj[OAuth.urlDecode(token[0])] = OAuth.urlDecode(secret[0]);
                    break;

                default:
                    var i = 0, arr = tokenRequest.text.split('&'), len = arr.length, obj = {};
                    for (; i < len; ++i) {
                        var pair = arr[i].split('=');
                        obj[OAuth.urlDecode(pair[0])] = OAuth.urlDecode(pair[1]);
                    }
            }


            return obj;
        },

        fetchRequestToken: function (success, failure) {
            var oauth = this;
            oauth.setAccessToken('', '');

            var url = oauth.authorizationUrl;
            this.get(this.requestTokenUrl, function (data) {
                var token = oauth.parseTokenRequest(data, data.responseHeaders['Content-Type'] || undefined);
                oauth.setAccessToken([token.oauth_token, token.oauth_token_secret]);
                success(url + '?' + data.text);
            }, failure);
        },

        fetchAccessToken: function (success, failure) {
            var oauth = this;
            this.get(this.accessTokenUrl, function (data) {
                var token = oauth.parseTokenRequest(data, data.responseHeaders['Content-Type'] || undefined);
                oauth.setAccessToken([token.oauth_token, token.oauth_token_secret]);

                // clean up a few un-needed things
                oauth.setVerifier('');

                success(data);
            }, failure);
        }
    };

    OAuth.signatureMethod = {
        /**
         * Sign the request
         *
         * @param consumer_secret {string} the consumer secret
         * @param token_secret {string}  the token secret
         * @param signature_base {string}  the signature base string
         */
        'HMAC-SHA1': function (consumer_secret, token_secret, signature_base) {
            var passphrase, signature, encode = OAuth.urlEncode;

            consumer_secret = encode(consumer_secret);
            token_secret = encode(token_secret || '');

            passphrase = consumer_secret + '&' + token_secret;
            signature = HMAC(SHA1.prototype, passphrase, signature_base);

            return global.btoa(signature);
        }
    };

    /**
     * Get a string of the parameters for the OAuth Authorization header
     *
     * @param params {object} A key value paired object of data
     *                           example: {'q':'foobar'}
     *                           for GET this will append a query string
     */
    function toHeaderString(params) {
        var arr = [], i, realm;

        for (i in params) {
            if (params[i] && params[i] !== undefined && params[i] !== '') {
                if (i === 'realm') {
                    realm = i + '="' + params[i] + '"';
                } else {
                    arr.push(i + '="' + OAuth.urlEncode(params[i]+'') + '"');
                }
            }
        }

        arr.sort();
        if (realm) {
            arr.unshift(realm);
        }

        return arr.join(', ');
    }

    /**
     * Generate a signature base string for the request
     *
     * @param method {string} ['GET', 'POST', 'PUT', ...]
     * @param url {string} A valid http(s) url
     * @param header_params A key value paired object of additional headers
     * @param query_params {object} A key value paired object of data
     *                               example: {'q':'foobar'}
     *                               for GET this will append a query string
     */
    function toSignatureBaseString(method, url, header_params, query_params) {
        var arr = [], i, encode = OAuth.urlEncode;

        for (i in header_params) {
            if (header_params[i] !== undefined && header_params[i] !== '') {
                arr.push([OAuth.urlEncode(i), OAuth.urlEncode(header_params[i]+'')]);
            }
        }

        for (i in query_params) {
            if (query_params[i] !== undefined && query_params[i] !== '') {
                if (!header_params[i]) {
                    arr.push([encode(i), encode(query_params[i] + '')]);
                }
            }
        }

        arr = arr.sort(function(a, b) {
          if (a[0] < b[0]) {
            return -1;
          } else if (a[0] > b[0]) {
            return 1;
          } else {
            if (a[1] < b[1]) {
              return -1;
            } else if (a[1] > b[1]) {
              return 1;
            } else {
              return 0;
            }
          }
        }).map(function(el) {
          return el.join("=");
        });

        return [
            method,
            encode(url),
            encode(arr.join('&'))
        ].join('&');
    }

    /**
     * Generate a timestamp for the request
     */
    function getTimestamp() {
        return parseInt(+new Date() / 1000, 10); // use short form of getting a timestamp
    }

    /**
     * Generate a nonce for the request
     *
     * @param key_length {number} Optional nonce length
     */
    function getNonce(key_length) {
        function rand() {
            return Math.floor(Math.random() * chars.length);
        }

        key_length = key_length || 64;

        var key_bytes = key_length / 8, value = '', key_iter = key_bytes / 4,
        key_remainder = key_bytes % 4, i,
        chars = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                     '2A', '2B', '2C', '2D', '2E', '2F', '30', '31', '32', '33',
                     '34', '35', '36', '37', '38', '39', '3A', '3B', '3C', '3D',
                     '3E', '3F', '40', '41', '42', '43', '44', '45', '46', '47',
                     '48', '49', '4A', '4B', '4C', '4D', '4E', '4F', '50', '51',
                     '52', '53', '54', '55', '56', '57', '58', '59', '5A', '5B',
                     '5C', '5D', '5E', '5F', '60', '61', '62', '63', '64', '65',
                     '66', '67', '68', '69', '6A', '6B', '6C', '6D', '6E', '6F',
                     '70', '71', '72', '73', '74', '75', '76', '77', '78', '79',
                     '7A', '7B', '7C', '7D', '7E'];

        for (i = 0; i < key_iter; i++) {
            value += chars[rand()] + chars[rand()] + chars[rand()]+ chars[rand()];
        }

        // handle remaing bytes
        for (i = 0; i < key_remainder; i++) {
            value += chars[rand()];
        }

        return value;
    }

    /**
     * rfc3986 compatable encode of a string
     *
     * @param {String} string
     */
    OAuth.urlEncode = function (string) {
        function hex(code) {
            var hex = code.toString(16).toUpperCase();
            if (hex.length < 2) {
                hex = 0 + hex;
            }
            return '%' + hex;
        }

        if (!string) {
            return '';
        }

        string = string + '';
        var reserved_chars = /[ \r\n!*"'();:@&=+$,\/?%#\[\]<>{}|`^\\\u0080-\uffff]/,
            str_len = string.length, i, string_arr = string.split(''), c;

        for (i = 0; i < str_len; i++) {
            if (c = string_arr[i].match(reserved_chars)) {
                c = c[0].charCodeAt(0);

                if (c < 128) {
                    string_arr[i] = hex(c);
                } else if (c < 2048) {
                    string_arr[i] = hex(192+(c>>6)) + hex(128+(c&63));
                } else if (c < 65536) {
                    string_arr[i] = hex(224+(c>>12)) + hex(128+((c>>6)&63)) + hex(128+(c&63));
                } else if (c < 2097152) {
                    string_arr[i] = hex(240+(c>>18)) + hex(128+((c>>12)&63)) + hex(128+((c>>6)&63)) + hex(128+(c&63));
                }
            }
        }

        return string_arr.join('');
    };

    /**
     * rfc3986 compatable decode of a string
     *
     * @param {String} string
     */
    OAuth.urlDecode = function (string){
        if (!string) {
            return '';
        }

        return string.replace(/%[a-fA-F0-9]{2}/ig, function (match) {
            return String.fromCharCode(parseInt(match.replace('%', ''), 16));
        });
    };
    /**
     * Factory object for XMLHttpRequest
     */
    function Request() {
        var XHR;


        if (typeof global.Titanium !== 'undefined' && typeof global.Titanium.Network.createHTTPClient != 'undefined') {
            XHR = global.Titanium.Network.createHTTPClient();
        } else if (typeof require !== 'undefined') {
            // CommonJS require
            try {
                XHR = new require("xhr").XMLHttpRequest();
            } catch (e) {
                // module didn't expose correct API or doesn't exists
                if (typeof global.XMLHttpRequest !== "undefined") {
                    XHR = new global.XMLHttpRequest();
                } else {
                    throw "No valid request transport found.";
                }
            }
        } else if (typeof global.XMLHttpRequest !== "undefined") {
            // W3C
            XHR = new global.XMLHttpRequest();
        } else {
            throw "No valid request transport found.";
        }

        return XHR;
    }
    function zeroPad(length) {
        var arr = new Array(++length);
        return arr.join(0).split('');
    }

    function stringToByteArray(str) {
        var bytes = [], code, i;

        for(i = 0; i < str.length; i++) {
            code = str.charCodeAt(i);

            if (code < 128) {
                bytes.push(code);
            } else if (code < 2048) {
                bytes.push(192+(code>>6), 128+(code&63));
            } else if (code < 65536) {
                bytes.push(224+(code>>12), 128+((code>>6)&63), 128+(code&63));
            } else if (code < 2097152) {
                bytes.push(240+(code>>18), 128+((code>>12)&63), 128+((code>>6)&63), 128+(code&63));
            }
        }

        return bytes;
    }

    function wordsToByteArray(words) {
        var bytes = [], i;
        for (i = 0; i < words.length * 32; i += 8) {
            bytes.push((words[i >>> 5] >>> (24 - i % 32)) & 255);
        }
        return bytes;
    }

    function byteArrayToHex(byteArray) {
        var hex = [], l = byteArray.length, i;
        for (i = 0; i < l; i++) {
            hex.push((byteArray[i] >>> 4).toString(16));
            hex.push((byteArray[i] & 0xF).toString(16));
        }
        return hex.join('');
    }

    function byteArrayToString(byteArray) {
        var string = '', l = byteArray.length, i;
        for (i = 0; i < l; i++) {
            string += String.fromCharCode(byteArray[i]);
        }
        return string;
    }

    function leftrotate(value, shift) {
        return (value << shift) | (value >>> (32 - shift));
    }

    function SHA1(message) {
        if (message !== undefined) {
            var m = message, crypto, digest;
            if (m.constructor === String) {
                m = stringToByteArray(m);
            }

            if (!(this instanceof SHA1)) {
                crypto =  new SHA1(message);
            } else {
                crypto = this;
            }
            digest = crypto.hash(m);

            return byteArrayToHex(digest);
        } else {
            if (!(this instanceof SHA1)) {
                return new SHA1();
            }
        }

        return this;
    }

    SHA1.prototype = new SHA1();
    SHA1.prototype.blocksize = 64;
    SHA1.prototype.hash = function (m) {
        var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],
            K = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6],
            lb, hb,
            l, pad, ml, blocks, b, block, bl, w, i, A, B, C, D, E, t, n, TEMP;

        function fn(t, B, C, D) {
            switch (t) {
                case 0:
                    return (B & C) | ((~B) & D);
                case 1:
                case 3:
                    return B ^ C ^ D;
                case 2:
                    return (B & C) | (B & D) | (C & D);
            }

            return -1;
        }


        if (m.constructor === String) {
            m = stringToByteArray(m.encodeUTF8());
        }

        l = m.length;

        pad = (Math.ceil((l + 9) / this.blocksize) * this.blocksize) - (l + 9);

        hb = (Math.floor(l / 4294967296));
        lb = (Math.floor(l % 4294967296));

        ml = [
            ((hb * 8) >> 24) & 255,
            ((hb * 8) >> 16) & 255,
            ((hb * 8) >> 8) & 255,
            (hb * 8) & 255,
            ((lb * 8) >> 24) & 255,
            ((lb * 8) >> 16) & 255,
            ((lb * 8) >> 8) & 255,
            (lb * 8) & 255
        ];

        m = m.concat([0x80], zeroPad(pad), ml);

        blocks = Math.ceil(m.length / this.blocksize);

        for (b = 0; b < blocks; b++) {
            block = m.slice(b * this.blocksize, (b+1) * this.blocksize);
            bl = block.length;

            w = [];

            for (i = 0; i < bl; i++) {
                w[i >>> 2] |= block[i] << (24 - (i - ((i >> 2) * 4)) * 8);
            }

            A = H[0];
            B = H[1];
            C = H[2];
            D = H[3];
            E = H[4];

            for (t=0; t < 80; t++) {
            if (t >= 16) {
                w[t] = leftrotate(w[t-3] ^ w[t-8] ^ w[t-14] ^ w[t-16], 1);
            }

            n = Math.floor(t / 20);
            TEMP = leftrotate(A, 5) + fn(n, B, C, D) + E + K[n] + w[t];

            E = D;
            D = C;
            C = leftrotate(B, 30);
            B = A;
            A = TEMP;
            }

            H[0] += A;
            H[1] += B;
            H[2] += C;
            H[3] += D;
            H[4] += E;
        }

        return wordsToByteArray(H);
    };

    function HMAC(fn, key, message, toHex){
        var k = stringToByteArray(key), m = stringToByteArray(message),
            l = k.length, byteArray, oPad, iPad, i;

        if (l > fn.blocksize) {
            k = fn.hash(k);
            l = k.length;
        }

        k = k.concat(zeroPad(fn.blocksize - l));

        oPad = k.slice(0); // copy
        iPad = k.slice(0); // copy

        for (i = 0; i < fn.blocksize; i++) {
            oPad[i] ^= 0x5C;
            iPad[i] ^= 0x36;
        }

        byteArray = fn.hash(oPad.concat(fn.hash(iPad.concat(m))));

        if (toHex) {
            return byteArrayToHex(byteArray);
        }
        return byteArrayToString(byteArray);
    }

    return OAuth;
})(exports);
var exports = exports || this;
(function (global) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    /**
     * Base64 encode a string
     * @param string {string} the string to be base64 encoded
     */
    global.btoa = global.btoa || function (string) {
        var i = 0, length = string.length, ascii, index, output = '';

        for (; i < length; i+=3) {
            ascii = [
                string.charCodeAt(i),
                string.charCodeAt(i+1),
                string.charCodeAt(i+2)
            ];

            index = [
                ascii[0] >> 2,
                ((ascii[0] & 3) << 4) | ascii[1] >> 4,
                ((ascii[1] & 15) << 2) | ascii[2] >> 6,
                ascii[2] & 63
            ];

            if (isNaN(ascii[1])) {
                index[2] = 64;
            }
            if (isNaN(ascii[2])) {
                index[3] = 64;
            }

            output += b64.charAt(index[0]) + b64.charAt(index[1]) + b64.charAt(index[2]) + b64.charAt(index[3]);
        }

        return output;
    };
})(exports);if (typeof (YMAGYN.SDK.WaitingDialog) == "undefined" || !YMAGYN.SDK.WaitingDialog) {
    YMAGYN.SDK.WaitingDialog = {};
}

YMAGYN.SDK.WaitingDialog.isDisplayed = false;

YMAGYN.SDK.WaitingDialog.show = function(loadingText)
{
    if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        try
        {
            if (!YMAGYN.SDK.WaitingDialog.isDisplayed) {
                window.plugins.waitingDialog.show(loadingText);
                YMAGYN.SDK.WaitingDialog.isDisplayed = true;
            }
        } catch (e) {
            console.warn("waitingDialog plugin not loaded");
        }
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {                 
        if(!YMAGYN.SDK.WaitingDialog.isDisplayed){
            var canvasContainer = document.createElement('div');       
            canvasContainer.id = 'YmagynSdkCanvasContainer';
            document.body.appendChild(canvasContainer);   
        
     
            var cl = new CanvasLoader('YmagynSdkCanvasContainer');
            cl.setShape('spiral'); 
            cl.setDiameter(80);
            cl.setDensity(12);
            cl.setRange(1.4);
            cl.setSpeed(1);
            cl.show();
		
            // This bit is only for positioning - not necessary
            var loaderObj = document.getElementById("canvasLoader");
            loaderObj.style.position = "absolute";
            loaderObj.style["top"] = cl.getDiameter() * -0.5 + "px";
            loaderObj.style["left"] = cl.getDiameter() * -0.5 + "px";
        
            var textContainer = document.createElement('p');
            textContainer.id = 'YmagynSdkLoaderTextContainer';
            textContainer.innerHTML = loadingText;
            textContainer.style.margin = '0';
            document.getElementById('YmagynSdkCanvasContainer').insertBefore(textContainer, document.getElementById('canvasLoader'));
        
            canvasContainer.style.position = 'absolute';
                   
            textContainer.style.left ='-'+ (textContainer.clientWidth/2)+'px';
            textContainer.style.top ='-'+ ((textContainer.clientHeight/2)+60)+'px';
            textContainer.style.textAlign = 'center';
            textContainer.style.position = 'absolute';
              
            canvasContainer.style.position = 'absolute';
            canvasContainer.style.zIndex = 100;
            canvasContainer.style.width = '50%';
            canvasContainer.style.top = '50%';
            canvasContainer.style.left = '50%';
            
            var loaderBg = document.createElement('div');       
            loaderBg.id = 'YmagynSdkLoaderBackground';
            loaderBg.style.width = (textContainer.clientWidth+30)+'px'
            loaderBg.style.left = '-'+ ((textContainer.clientWidth/2)+15)+'px';          
            loaderBg.style.position = 'absolute';
            loaderBg.style.height = (textContainer.clientHeight + 140) +'px';
            loaderBg.style.top = '-' + ((textContainer.clientHeight/2) + 70) +'px';
            document.getElementById('YmagynSdkCanvasContainer').insertBefore(loaderBg, document.getElementById('canvasLoader'));
            
            YMAGYN.SDK.WaitingDialog.isDisplayed = true;           
            
        }
    }
};
YMAGYN.SDK.WaitingDialog.hide = function()
{
    if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        try
        {
            if (YMAGYN.SDK.WaitingDialog.isDisplayed){
                window.plugins.waitingDialog.hide();
                YMAGYN.SDK.WaitingDialog.isDisplayed = false;
            }
        } catch (e) {
            console.warn("waitingDialog plugin not loaded");
        }
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        if(YMAGYN.SDK.WaitingDialog.isDisplayed)
        {
            var cc = document.getElementById('YmagynSdkCanvasContainer').remove();
            if(cc)
            {
                cc.remove();
            }
            YMAGYN.SDK.WaitingDialog.isDisplayed = false;
            
        }
    }
};if (typeof (YMAGYN.SDK.Facebook) == "undefined" || !YMAGYN.SDK.Facebook) {
    YMAGYN.SDK.Facebook = {};
}

YMAGYN.SDK.Facebook.initWithAppId = function(appId,callback)
{
    if((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate())
    {
        FB.init({
            appId: appId,
            nativeInterface: window.CDV.FB,
            useCachedDialogs: false
        });
        callback();
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate())
    {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : appId,                       
                status     : true,                                 
                xfbml      : true                                
            });
            callback();
        };
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/all.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
};
YMAGYN.SDK.Facebook.logout = function(callback)
{
    
    if((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate())
    {
        FB.logout(function(response)
        {
            callback(response);
        });
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate())
    {
        FB.logout(function(response) {
            callback(response);
        }); 
        return;
    }
    console.log("YMAGYN.Facebook.logout::NotImplemented [OTHER DEVICES]");
};

YMAGYN.SDK.Facebook.login = function(appId,permissions,callback)
{
    if((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate())
    {   
        FB.login(function(response) {
            if (response.authResponse) {
                callback(response); 
            } else {
                callback(null);
            }
        },{
            scope:permissions.join(",")
        });
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate())
    {
        FB.login(function(response) {
            if (response.authResponse) {
                callback(response); 
            } else {
                callback(null);
            }
        },{
            scope:permissions.join(",")
        });
        return;
    }
    console.log("YMAGYN.Facebook.login::NotImplemented [OTHER DEVICES]");
};

YMAGYN.SDK.Facebook.requestWithGraphPath = function(path,params,method,callback)
{
    
    if((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate())
    {
        FB.api(path, params, method,function(response) {
            callback(response);
        });
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate())
    {
        FB.api(path, method,params, function(response) {
            callback(response);
            console.log("YMAGYN.Facebook.requestWithGraphPath:" + JSON.stringify(response));
        });
        return;
    }
    console.log("YMAGYN.Facebook.requestWithGraphPath:NotImplemented [OTHER DEVICES]");
};

YMAGYN.SDK.Facebook.dialog = function(method,dialogOptions,callback)
{
    
    
    if((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate())
    {
        dialogOptions.method = method;
        FB.ui(dialogOptions, function(response)
        {
            callback(response);
        });
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate())
    {
        dialogOptions.method = method;
        FB.ui(dialogOptions, function(response)
        {
            console.log(arguments);
            callback(response);
        });
        return;
    }
    console.log("YMAGYN.Facebook.dialog:NotImplemented [OTHER DEVICES]");
};

YMAGYN.SDK.Facebook.getLoginStatus=function(callback, error){
    FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
        callback({error:'none', response:response});
  } else if (response.status === 'not_authorized') {
      error({error:'not_authorized', response:response});
  } else {
      error({error:'user_not_logged_in', response:response});
  }
 });
}


YMAGYN.SDK.Facebook.setAccessToken = function(value)
{
    YMAGYN.SDK.Storage.localStorage.setItem(appHashKey+"FBAccessToken",value);
    if(value=="")
        YMAGYN.SDK.Storage.localStorage.removeItem(appHashKey+"FBAccessToken");
};

YMAGYN.SDK.Facebook.getAccessToken = function()
{
    return (YMAGYN.SDK.Storage.localStorage.getItem(appHashKey+"FBAccessToken")!=null)?YMAGYN.SDK.Storage.localStorage.getItem(appHashKey+"FBAccessToken"):"";
};if (typeof (YMAGYN.SDK.ChildBrowser) == "undefined" || !YMAGYN.SDK.ChildBrowser) {
    YMAGYN.SDK.ChildBrowser = {};
}

YMAGYN.SDK.ChildBrowser._openedWindow = null;
YMAGYN.SDK.ChildBrowser._openedWindowHref="";
YMAGYN.SDK.ChildBrowser._openedWindowId;

YMAGYN.SDK.ChildBrowser.showWebPage = function (url, options) { 
    if (typeof(options)=='undefined') {
        options = {
            showLocationBar: true
        };
    }
    if ((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate() )
    {
        window.plugins.ChildBrowser.showWebPage(url, options);
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate() )
    {
        var showLocationBar=(options.showLocationBar) ? "location=yes" : "location=no";          
        YMAGYN.SDK.ChildBrowser._openedWindow = window.open(url ,'',showLocationBar); 
        YMAGYN.SDK.ChildBrowser._openedWindowHref = YMAGYN.SDK.ChildBrowser._openedWindow.location.href;
        YMAGYN.SDK.ChildBrowser._openedWindowId = setInterval(function(){
            if(YMAGYN.SDK.ChildBrowser._openedWindow.location==null){
                clearInterval(YMAGYN.SDK.ChildBrowser._openedWindowId);
            }
            else if(YMAGYN.SDK.ChildBrowser._openedWindowHref != YMAGYN.SDK.ChildBrowser._openedWindow.location.href){
                YMAGYN.SDK.ChildBrowser._openedWindowHref = YMAGYN.SDK.ChildBrowser._openedWindow.location.href;               
                var evt = document.createEvent("CustomEvent");
                evt.initCustomEvent("YMAGYN.SDK.ChildBrowser.onLocationChange", true, true, {
                    url:YMAGYN.SDK.ChildBrowser._openedWindowHref
                });
                document.dispatchEvent(evt);
            }
        },250);     
    }
};

YMAGYN.SDK.ChildBrowser.close = function () {
    if ((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate() )
    {
        window.plugins.ChildBrowser.close();
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate() )
    {
        if(YMAGYN.SDK.ChildBrowser._openedWindow != null){
            clearInterval(YMAGYN.SDK.ChildBrowser._openedWindowId);
            YMAGYN.SDK.ChildBrowser._openedWindow.close();
            YMAGYN.SDK.ChildBrowser._openedWindow=null;
            document.dispatchEvent(new CustomEvent('YMAGYN.SDK.ChildBrowser.onClose'));
        }
    }
};

YMAGYN.SDK.ChildBrowser.openExternal = function(url, usePhoneGap) {
    if ((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate() ) {
        window.plugins.ChildBrowser.openExternal(url, usePhoneGap);
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate() ) {
        window.open(url ,'_blank ', 'directories=yes, location=yes, toolbar=yes');
        document.dispatchEvent(new CustomEvent('YMAGYN.SDK.ChildBrowser.openExternal'));
    }
};

YMAGYN.SDK.ChildBrowser.onClose = function(callback){
    if ((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate() )
    {
        window.plugins.ChildBrowser.onClose = function () {
            callback();
        };
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate() )
    {
        document.addEventListener('YMAGYN.SDK.ChildBrowser.onClose', function(){
            callback();
        });
    }
};

YMAGYN.SDK.ChildBrowser.onLocationChange = function(callback){
    if ((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate() )
    {
        window.plugins.ChildBrowser.onLocationChange  = function (url) {
            callback(url);
        };
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate() )
    {
        document.addEventListener('YMAGYN.SDK.ChildBrowser.onLocationChange', function(e){
            callback(e.detail.url);
        });
    }
};

YMAGYN.SDK.ChildBrowser.onOpenExternal = function(callback){
    if(YMAGYN.SDK.is.iOS && !YMAGYN.SDK.isEmulate())
    {
        window.plugins.ChildBrowser.onOpenExternal = function () {
            callback();
        };
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate() )
    {
        document.addEventListener('YMAGYN.SDK.ChildBrowser.onOpenExternal', function(){
            callback();
        });
    }
};if (typeof (YMAGYN.SDK.Globalization) == "undefined" || !YMAGYN.SDK.Globalization) {
    YMAGYN.SDK.Globalization = {};
}

YMAGYN.SDK.Globalization.getPreferredLanguage = function(callback)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.getPreferredLanguage(
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            } 
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        callback(); 
        console.log("YMAGYN.SDK.Globalization.getPreferredLanguage::NotImplemented [DESKTOP]");
    }
};
YMAGYN.SDK.Globalization.getLocaleName = function(callback)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.getLocaleName(
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            } 
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        var userLang = (navigator.language) ? navigator.language : navigator.userLanguage;
        var formatted = userLang.split('-');
        var formattedString = formatted.join('_');
        callback({
            'value' : formattedString
        });    
        console.log("YMAGYN.SDK.Globalization.getLocaleName::NotImplemented [DESKTOP]");
    }
};

YMAGYN.SDK.Globalization.dateToString = function(date, callback, options)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.dateToString(date,
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            },
            options
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        
        callback({
            'value':date.toLocaleString()
        });
    }
};


YMAGYN.SDK.Globalization.stringToDate = function(dateString, callback, options)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.stringToDate(dateString,
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            },
            options
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        callback();
        console.log("YMAGYN.SDK.Globalization.stringToDate::NotImplemented [DESKTOP]");
    }
};

YMAGYN.SDK.Globalization.getDatePattern = function(callback, options)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.getDatePattern(
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            },
            options
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        callback();
        console.log("YMAGYN.SDK.Globalization.getDatePattern::NotImplemented [DESKTOP]");
    }
};

YMAGYN.SDK.Globalization.getDateNames = function(callback, options)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.getDateNames(
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            },
            options
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        callback();
        console.log("YMAGYN.SDK.Globalization.getDateNames::NotImplemented [DESKTOP]");
    }
};

YMAGYN.SDK.Globalization.isDayLightSavingsTime = function(date, callback)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.isDayLightSavingsTime(date,
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            }           
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        callback();
        console.log("YMAGYN.SDK.Globalization.isDayLightSavingsTime::NotImplemented [DESKTOP]");
    }
};

YMAGYN.SDK.Globalization.getFirstDayOfWeek = function(callback)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.getFirstDayOfWeek(
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            }           
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        callback();
        console.log("YMAGYN.SDK.Globalization.getFirstDayOfWeek::NotImplemented [DESKTOP]");
    }
};


YMAGYN.SDK.Globalization.numberToString = function(number, callback, options)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.numberToString(number,
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            },
            options
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        callback();
        console.log("YMAGYN.SDK.Globalization.numberToString::NotImplemented [DESKTOP]");
    }
};


YMAGYN.SDK.Globalization.stringToNumber = function(numberString, callback, options)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.stringToNumber(numberString,
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            },
            options
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        callback();
        console.log("YMAGYN.SDK.Globalization.stringToNumber::NotImplemented [DESKTOP]");
    }
};


YMAGYN.SDK.Globalization.getNumberPattern = function(callback, options)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.getNumberPattern(
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            },
            options
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        callback();
        console.log("YMAGYN.SDK.Globalization.getNumberPattern::NotImplemented [DESKTOP]");
    }
};

YMAGYN.SDK.Globalization.getCurrencyPattern = function(currencyCode, callback)
{
    if(YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS)
    {
        navigator.globalization.getCurrencyPattern(currencyCode,
            function(e)
            {
                callback(e);
            }, 
            function(e)
            {
                callback(e);
            }          
            );
        return;
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        callback();
        console.log("YMAGYN.SDK.Globalization.getCurrencyPattern::NotImplemented [DESKTOP]");
    }
};if (typeof (YMAGYN.SDK.GoogleAnalytics) == "undefined" || !YMAGYN.SDK.GoogleAnalytics) {
    YMAGYN.SDK.GoogleAnalytics = {};
}

YMAGYN.SDK.GoogleAnalytics._Loaded = false;


YMAGYN.SDK.GoogleAnalytics.start = function(accountId,callback)
{
    YMAGYN.SDK.GoogleAnalytics.checkIfAnalyticsLoaded = function() {
        if (window._gat && window._gat._getTracker) {
            YMAGYN.SDK.GoogleAnalytics._Loaded = true;
            callback({
                error:false,
                errorMessage:''
            });    
            clearInterval(id);
        }
    }
    
    if(YMAGYN.SDK.is.Android)
    {
        window.plugins.analytics.start(accountId, 
            function(){
                callback({
                    error:false,
                    errorMessage:''
                });
            }, 
            function(){
                callback({
                    error:true,
                    errorMessage:'Error starting '+accountId
                });
            }
            );
    }
    if(YMAGYN.SDK.is.iOS)
    {
        console.log("YMAGYN.SDK.GoogleAnalytics.start::NotImplemented [iOS]");
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
         var _gaq = _gaq || [];
        _gaq.push(['_setAccount', accountId]);
        _gaq.push(['_setDomainName', 'none']);
        _gaq.push(['_setAllowLinker', true]);
        
        var id = setInterval(function(){
            YMAGYN.SDK.GoogleAnalytics.checkIfAnalyticsLoaded();
        },250); 
                           

        (function() {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();           
    }
};
YMAGYN.SDK.GoogleAnalytics.trackPageView = function(key, callback)
{
    if(YMAGYN.SDK.is.Android)
    {
        window.plugins.analytics.trackPageView(key, 
            function(){
                callback({
                    error:false,
                    errorMessage:'',
                    data:arguments
                });
            }, 
            function(){
                callback({
                    error:true,
                    errorMessage:'Error tracking view '+key
                });
            }
            );
    }
    if(YMAGYN.SDK.is.iOS)
    {
        console.log("YMAGYN.SDK.GoogleAnalytics.trackPageView::NotImplemented [iOS]");
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        if(YMAGYN.SDK.GoogleAnalytics._Loaded)
        {
            _gaq.push(['_trackPageview']); 
            callback({
                error:false,
                errorMessage:'',
                data:arguments
            });
        }
        else{
            callback({
                error:true,
                errorMessage:'Error tracking view '+key
            });
        }
    }
};
YMAGYN.SDK.GoogleAnalytics.trackEvent = function(category, action, label, value, callback)
{
    if(YMAGYN.SDK.is.Android)
    {
        window.plugins.analytics.trackEvent(category, action, label, value, 
            function(){
                callback({
                    error:false,
                    errorMessage:'',
                    data:arguments
                });
            }, 
            function(){
                callback({
                    error:true,
                    errorMessage:'Error tracking event '+category+'/'+action+'/'+label+'/'+value
                });
            }
            );
    }
    if(YMAGYN.SDK.is.iOS)
    {
        console.log("YMAGYN.SDK.GoogleAnalytics.trackPageView::NotImplemented [iOS]");
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        if(YMAGYN.SDK.GoogleAnalytics._Loaded)
        {
            value = (typeof(value) != 'undefined' && typeof(value)!='number' ) ? value : 0;
            _gaq.push(['_trackEvent', category, action, label, value]);
            callback({
                error:false,
                errorMessage:'',
                data:arguments
            });          
        }
        else{
            callback({
                error:true,
                errorMessage:'Error tracking event '+category+'/'+action+'/'+label+'/'+value
            });          
        }
    }
};if (typeof (YMAGYN.SDK.Map) == "undefined" || !YMAGYN.SDK.Map) {
    YMAGYN.SDK.Map = {};
}

YMAGYN.SDK.Map.loaded = false;

YMAGYN.SDK.Map.Init = function(apiKey, callback)
{
    YMAGYN.SDK.Map.InitCallback = function()
    { 
        YMAGYN.SDK.Map.loaded = true;
        callback(
        {
            isLoaded:true, 
            message:"Google Maps Api loaded"
        });
    }
    if(!YMAGYN.SDK.Map.loaded){
        YMAGYN.SDK.loadJsFile('http://maps.googleapis.com/maps/api/js?v=3.6&key='+apiKey+'&sensor=true&callback=YMAGYN.SDK.Map.InitCallback');
    }
    else
    {
        callback(
        {           
            isLoaded:true, 
            message:"Google Maps Api is already loaded"
        })
    }
};

YMAGYN.SDK.Map.show = function(address)
{
    if(YMAGYN.SDK.is.Android)
    {
        window.plugins.webintent.startActivity(
        {
            action: window.plugins.webintent.ACTION_VIEW,
            url: 'geo:0,0?q=' + address
        }, 
        function() {
            
            },            
            function() {
                console.log('Failed to open URL via Android Intent');
            });
        return;
    }
    if(YMAGYN.SDK.is.iOS)
    {
        console.log("YMAGYN.SDK.Map.show::NotImplemented [iOS]");
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        var mapContainer = document.createElement('div');
        mapContainer.id = 'YmagynSdkMapContainer'
        mapContainer.style.position = 'absolute';
        mapContainer.style.zIndex = 100;
        mapContainer.style.height = '100%';
        mapContainer.style.width = '100%';
        mapContainer.style.top = '0px';
        mapContainer.style.left = '0px';
        mapContainer.style.backgroundColor='white';
        document.body.appendChild(mapContainer);
        
        var map = document.createElement('div');
        map.id = 'YmagynSdkmap';
        map.style.height = '100%';
        map.style.width = '100%';
        document.getElementById('YmagynSdkMapContainer').appendChild(map) 
        if(!YMAGYN.SDK.Map.loaded){
            console.log('Google Maps Api is not loaded');          
        }
        else
        {
            console.log(arguments);           
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address' : address
            }, function(results , status){
                console.log(status);
                if(status == "OK" ){
                    results[0].geometry.location.lng();
                    var gmapPosition = new google.maps.LatLng(results[0].geometry.location.lat() , results[0].geometry.location.lng());
                    var mapOptions = {
                        center: gmapPosition,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById('YmagynSdkmap'), mapOptions);
                    var marker = new google.maps.Marker({
                        map: map,
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        position: gmapPosition
                    });
                }
                else
                    console.log(status);
            }) 
        }
    }
};



YMAGYN.SDK.Map.hide = function (callback){
    if(YMAGYN.SDK.is.Android)
    {
             
    }
    else if(YMAGYN.SDK.is.iOS)
    {
                  
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        var mc = document.getElementById('YmagynSdkMapContainer');
        if(mc){
            mc.remove();
            callback(true);
        }
        else
            callback(false);
    }
};if (typeof (YMAGYN.SDK.Pushnotifications) == "undefined" || !YMAGYN.SDK.Pushnotifications) {
    YMAGYN.SDK.Pushnotifications = {};
}

YMAGYN.SDK.Pushnotifications.NotificationListener = function(data){
    var evt = document.createEvent("CustomEvent");
    
    if(YMAGYN.SDK.is.Android)
        evt.initCustomEvent("YMAGYN.NotificationListener", true, true,{
            data:data, 
            platform:'Android'
        });
    else if(YMAGYN.SDK.is.iOS)
        evt.initCustomEvent("YMAGYN.NotificationListener", true, true,{
            data:data, 
            platform:'iOS'
        });
    window.dispatchEvent(evt);
}
YMAGYN.SDK.Pushnotifications.register = function(options, callback, notificationListener)
{
    if(YMAGYN.SDK.is.Android && !YMAGYN.SDK.isEmulate()){
        window.PushPlugin.register(
            function(result){
                if(typeof(callback)=='function'){
                    callback(result);
                }
            }, function(error){
                if(typeof(callback)=='function'){
                    callback(error);
                }
            }, {
                senderID:options.senderID,
                ecb:"YMAGYN.SDK.Pushnotifications.NotificationListener"
            });
            
        window.addEventListener("YMAGYN.NotificationListener", 
            function(e){
                notificationListener(e)
            }, false);
    }
    else if(YMAGYN.SDK.is.iOS && !YMAGYN.SDK.isEmulate()){
        window.PushPlugin.register(
            function(token){
                if(typeof(callback)=='function'){
                    callback(token);
                }
            }, function(error){
                if(typeof(callback)=='function'){
                    callback(error);
                }
            }, {
                badge:options.badge,
                sound:options.sound,
                alert:options.alert,
                cb:"YMAGYN.SDK.Pushnotifications.NotificationListener"
            });
        window.addEventListener("YMAGYN.NotificationListener", 
            function(e){
                notificationListener(e)
            }, false);
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate() ){
        console.log("YMAGYN.SDK.Pushnotifications.register::Not implemented on desktop");
    }

};
YMAGYN.SDK.Pushnotifications.unregister = function(callback)
{
    if ((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate() ){
        window.PushPlugin.unregister(function(result){
            callback(result)
        }, function(error){
            callback(error)
        });
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate() ){
        console.log("YMAGYN.SDK.Pushnotifications.unregister::Not implemented on desktop");
    }
};


YMAGYN.SDK.Pushnotifications.setApplicationIconBadgeNumber = function(callback, badge){
    if(YMAGYN.SDK.is.iOS && !YMAGYN.SDK.isEmulate()){
        window.PushPlugin.setApplicationIconBadgeNumber(
            function(){
                callback(arguments)
            },
            badge
            );
    }
};if (typeof (YMAGYN.SDK.ExtractZipFilePlugin) == "undefined" || !YMAGYN.SDK.ExtractZipFilePlugin) {
    YMAGYN.SDK.ExtractZipFilePlugin = {};
}

YMAGYN.SDK.ExtractZipFilePlugin.extract = function(file, callback)
{
    if(YMAGYN.SDK.is.Android)
    {
        cordova.exec(
            function(e)
            {
                callback(e);
            }, function(e)
            {
                callback(e);
            }, "ZipPlugin", "unzip", [file]);
    }
    if(YMAGYN.SDK.is.iOS)
    {
        console.log("YMAGYN.SDK.ExtractZipFilePlugin.extract::NotImplemented [iOS]");
    }
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows)
    {
        console.log("YMAGYN.SDK.ExtractZipFilePlugin.extract::NotImplemented [DESKTOP]");
    }
};if (typeof (YMAGYN.SDK.Share) == "undefined" || !YMAGYN.SDK.Share) {
    YMAGYN.SDK.Share = {};
}

YMAGYN.SDK.Share.sms=function(phone, message, successCallback, errorCallback){
    if(YMAGYN.SDK.is.Android && !YMAGYN.SDK.isEmulate()){
        window.plugins.sms.send(phone, message, function(){
            successCallback();
        },
        function(e){
            errorCallback(e);
        });
    }
    else if(YMAGYN.SDK.is.iOS && !YMAGYN.SDK.isEmulate()){
        window.plugins.smsComposer.showSMSComposerWithCB(function(result){
            switch(result){
                case 0 :
                    errorCallback(result);
                    break;
                case 1:
                    successCallback();
                    break;
                case 2:
                    errorCallback(result);
                    break;
                case 3:
                    errorCallback(result);
                    break;
            }   
        },phone, message);
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate()){
        YMAGYN.SDK.Notification.alert("Sms Sent to: "+phone, "Sms Sent to: "+phone+'\n'+message, 'Ok', function(){})
        successCallback();   
    }
};

YMAGYN.SDK.Share.email = function(subject,body,toRecipients,ccRecipients,bccRecipients,isHtml){
    if((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate()){
        window.plugins.emailComposer.showEmailComposer(subject,body,toRecipients,ccRecipients,bccRecipients,isHtml);
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate()){
        var link = "mailto:"+toRecipients
        + "?cc="+ccRecipients
        + "&subject=" + escape(subject)
        + "&body=" + escape(body)
        ;
        window.location.href = link;
    }
};

YMAGYN.SDK.Share.call = function(phone){
    if(YMAGYN.SDK.is.Android && !YMAGYN.SDK.isEmulate()){
        document.location.href= 'tel:'+phone;
    }
    else if(YMAGYN.SDK.is.iOS && !YMAGYN.SDK.isEmulate()){
        window.plugins.phoneDialer.dial(phone);
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows ||YMAGYN.SDK.isEmulate()){
        YMAGYN.SDK.Notification.alert("Calling"+phone, 'Calling: '+phone, 'Ok', function(){})  
    }
};if (typeof (YMAGYN.SDK.Twitter) == "undefined" || !YMAGYN.SDK.Twitter) {
    YMAGYN.SDK.Twitter = {};
}
YMAGYN.SDK.Twitter.isTwitterAvailable = function(config, callback){
    if(YMAGYN.SDK.is.Android && !YMAGYN.SDK.isEmulate()){
        window.plugins.twitter.isTwitterAvailable(
            function(response){ 
                if(response==1){
                    callback({
                        error:false,
                        errorMessage:"none"
                    });	
                } else {
                    callback({
                        error:true,
                        errorMessage:"Twitter is not available"
                    });
                }
            }
            );
    }
    else if(YMAGYN.SDK.is.iOS && !YMAGYN.SDK.isEmulate())
    {
        window.plugins.twitter.isTwitterAvailable(
            function(response){ 
                if(response==1){
                    callback({
                        error:false,
                        errorMessage:"none"
                    });
				
                } else {
                    callback({
                        error:true,
                        errorMessage:"Twitter is not available"
                    });
                }
            }
            );
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows ||  YMAGYN.SDK.isEmulate()){
        YMAGYN.SDK.Twitter.initWithConfig(config.TwitterConsumerKey, config.TwitterConsumerSecret,config.TwitterCallbackUrl ,function(response){
            YMAGYN.SDK.Twitter.Login(function(r){
                callback(r);
            });              
        });
    }
};

YMAGYN.SDK.Twitter.isTwitterSetup = function(callback){
    if((YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) && !YMAGYN.SDK.isEmulate()){
        window.plugins.twitter.isTwitterSetup(function(response){
            if(response==1){
                callback({
                    error:false,
                    errorMessage:"none"
                });
				
            } else {
                callback({
                    error:true,
                    errorMessage:"Twitter is not available"
                });
            }
        });
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows ||  YMAGYN.SDK.isEmulate()){
        callback({
            error:false,
            errorMessage:"none"
        });
    }
};

YMAGYN.SDK.Twitter.composeTweet = function(message,callback, options){
    if(YMAGYN.SDK.is.Android && !YMAGYN.SDK.isEmulate()){
        window.plugins.twitter.composeTweet(
            function(){
                callback({
                    error:false,
                    errorMessage:'none'
                });
            },
            function(error){
                callback({
                    error:true,
                    errorMessage:error
                });
            },
            message,
            options
            );

    }
    else if(YMAGYN.SDK.is.iOS && !YMAGYN.SDK.isEmulate())
    {
        window.plugins.twitter.composeTweet(
            function(){
                callback({
                    error:false,
                    errorMessage:'none'
                });
            },
            function(error){
                callback({
                    error:true,
                    errorMessage:error
                });
            },
            message,
            options
            );
    }
    else if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows ||  YMAGYN.SDK.isEmulate()){
        YMAGYN.SDK.Twitter.Tweet(message + ((typeof(options)!="undefined" && typeof(options.imageAttach)!="undefined")? " "+options.imimageAttach : "")+((typeof(options)!="undefined" && typeof(options.urlAttach)!="undefined")? " "+options.urlAttach : ""),  callback);
    }
};

if (typeof (YMAGYN.SDK.Twitter._Options) == "undefined" || !YMAGYN.SDK.Twitter._Options) {
    YMAGYN.SDK.Twitter._Options=null;
}

if (typeof (YMAGYN.SDK.Twitter._Oauth) == "undefined" || !YMAGYN.SDK.Twitter._Oauth) {
    YMAGYN.SDK.Twitter._Oauth=null;
}

if (typeof (YMAGYN.SDK.Twitter._StorageKey) == "undefined" || !YMAGYN.SDK.Twitter._StorageKey) {
    YMAGYN.SDK.Twitter._StorageKey='YmagynTwtKey';
}

if (typeof (YMAGYN.SDK.Twitter._OauthObject) == "undefined" || !YMAGYN.SDK.Twitter._OauthObject) {
    YMAGYN.SDK.Twitter._OauthObject=null;
}

YMAGYN.SDK.Twitter.initWithConfig=function(consumerKey, consumerSecret, callbackUrl, callback){
    YMAGYN.SDK.Twitter._Options={};
    YMAGYN.SDK.Twitter._Options.consumerKey = consumerKey;
    YMAGYN.SDK.Twitter._Options.consumerSecret = consumerSecret;
    YMAGYN.SDK.Twitter._Options.callbackUrl = callbackUrl;   
    
    if(typeof(YMAGYN.SDK.Storage.localStorage.getItem(YMAGYN.SDK.Twitter._StorageKey))!='undefined' && 
        YMAGYN.SDK.Storage.localStorage.getItem(YMAGYN.SDK.Twitter._StorageKey) !=null)
        {
        YMAGYN.SDK.Twitter._OauthObject =  window.JSON.parse(YMAGYN.SDK.Storage.localStorage.getItem(YMAGYN.SDK.Twitter._StorageKey));
        YMAGYN.SDK.Twitter._Options.accessTokenSecret = YMAGYN.SDK.Twitter._OauthObject.accessTokenSecret;
        YMAGYN.SDK.Twitter._Options.accessTokenKey = YMAGYN.SDK.Twitter._OauthObject.accessTokenKey;
        YMAGYN.SDK.Twitter._Oauth=OAuth(YMAGYN.SDK.Twitter._Options);
        YMAGYN.SDK.Twitter._Oauth.get("https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true",
            function(reply){
                reply.text = window.JSON.parse(reply.text);
                if (typeof(callback)=='function'){
                    callback(
                    {
                        isLogged:true,
                        response:reply
                    }
                    );
                }
            });
    }
    else{
        callback({
            isLogged:false,
            response:null
        });
    }
};

YMAGYN.SDK.Twitter.Login = function(callback)
{
    if(typeof(YMAGYN.SDK.Storage.localStorage.getItem(YMAGYN.SDK.Twitter._StorageKey))!='undefined' && 
        YMAGYN.SDK.Storage.localStorage.getItem(YMAGYN.SDK.Twitter._StorageKey) !=null)
        {
        YMAGYN.SDK.Twitter._OauthObject =  window.JSON.parse(YMAGYN.SDK.Storage.localStorage.getItem(YMAGYN.SDK.Twitter._StorageKey));
        YMAGYN.SDK.Twitter._Options.accessTokenSecret = YMAGYN.SDK.Twitter._OauthObject.accessTokenSecret;
        YMAGYN.SDK.Twitter._Oauth=OAuth(YMAGYN.SDK.Twitter._Options);
        YMAGYN.SDK.Twitter._Oauth.get("https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true",
            function(reply){
                reply.text = window.JSON.parse(reply.text);
                if (typeof(callback)=='function'){
                    callback(
                    {
                        isLogged:true,
                        error:false,
                        response:reply
                    }
                    );
                }
            });
    }
    else{
        YMAGYN.SDK.Twitter._Oauth=OAuth(YMAGYN.SDK.Twitter._Options);
        console.log(YMAGYN.SDK.Twitter._Oauth);
        YMAGYN.SDK.Twitter._Oauth.get("https://api.twitter.com/oauth/request_token",
            function(reply){
                YMAGYN.SDK.Twitter.inAppBrowser = YMAGYN.SDK.InAppBrowser.open('https://api.twitter.com/oauth/authorize?'+reply.text, '_blank', 'location=no')
                YMAGYN.SDK.Twitter.inAppBrowser.addEventListener('loadstart', function(loc){
                    loc = (YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows ||YMAGYN.SDK.isEmulate()) ? loc.detail : loc;
                    if (loc.url.indexOf(YMAGYN.SDK.Twitter._Options.callbackUrl)>=0) {
                        var index, verifier = '';
                        var params = loc.url.substr(loc.url.indexOf('?') + 1);                               
                        params = params.split('&');
                        for (var i = 0; i < params.length; i++) {
                            var y = params[i].split('=');
                            if(y[0] === 'oauth_verifier') {
                                verifier = y[1];
                            }
                        }
                        YMAGYN.SDK.Twitter.inAppBrowser.close();
                        YMAGYN.SDK.WaitingDialog.show('Authorisation en cours...');
                        YMAGYN.SDK.Twitter._Oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+verifier+'&'+reply.text,
                            function(data){
                                var accessParams = {};
                                var qvars_tmp = data.text.split('&');
                                for (var i = 0; i < qvars_tmp.length; i++) {
                                    var y = qvars_tmp[i].split('=');
                                    accessParams[y[0]] = decodeURIComponent(y[1]);
                                }
                                console.log('acessToken ='+ accessParams.oauth_token);
                                YMAGYN.SDK.Twitter._Oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);
                                YMAGYN.SDK.Twitter._OauthObject={};
                                YMAGYN.SDK.Twitter._OauthObject.accessTokenKey = accessParams.oauth_token;
                                YMAGYN.SDK.Twitter._OauthObject.accessTokenSecret = accessParams.oauth_token_secret;
                                YMAGYN.SDK.Storage.localStorage.setItem(YMAGYN.SDK.Twitter._StorageKey, window.JSON.stringify (YMAGYN.SDK.Twitter._OauthObject));

                                YMAGYN.SDK.Twitter._Oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
                                    function(data) {
                                        YMAGYN.SDK.WaitingDialog.hide();
                                        callback(
                                        {
                                            isLogged:true,
                                            error:false,
                                            response:data
                                        }
                                        );
                                    },
                                    function(data) {
                                        YMAGYN.SDK.WaitingDialog.hide()
                                        callback(
                                        {
                                            isLogged:false,
                                            error:true,
                                            response:data
                                        }
                                        );
                                    }
                                    );
                            },
                            function(data){
                                callback(data);
                            }
                            );                   
                    }
                });
                console.log(YMAGYN.SDK.Twitter.inAppBrowser);
            },
            function(reply){
                callback({
                    isLogged:false,
                    error:true,
                    response:reply
                })
            }
            )
    }
};


YMAGYN.SDK.Twitter.Tweet = function(message, callback){
    YMAGYN.SDK.Twitter._Oauth=OAuth(YMAGYN.SDK.Twitter._Options);
    YMAGYN.SDK.Twitter._Oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
        function(data) {
            YMAGYN.SDK.Twitter._Oauth.post('https://api.twitter.com/1.1/statuses/update.json',
            {
                'status' : message,
                'trim_user' : 'true'
            },
            function(data) {
                data.text = window.JSON.parse(data.text);
                callback({
                    response:data,
                    error:false,
                    isLogged:true,
                    errorMessage:'none'
                })
            },
            function(data) {
                callback({
                    response:data,
                    error:true,
                    isLogged:false,
                    errorMessage:'Can\'t Tweet'
                })
            }
            );
        }
        ); 
};

YMAGYN.SDK.Twitter.GetTimeLineFromUser = function(user, count,callback){
    YMAGYN.SDK.Twitter._Oauth=OAuth(YMAGYN.SDK.Twitter._Options);
    YMAGYN.SDK.Twitter._Oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
        function(data) {
            YMAGYN.SDK.Twitter._Oauth.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='+user+'&count='+count,
                function(data) {
                    data.text = window.JSON.parse(data.text);
                    callback({
                        response:data,
                        error:false,
                        isLogged:true
                    })
                },
                function(data) {
                    callback({
                        response:data,
                        error:true,
                        isLogged:false
                    })
                }
                );
        }
        ); 
};

YMAGYN.SDK.Twitter.GetUserHomeTimeLine = function(count,callback){
    count=(count>200) ? 200 : count;
    YMAGYN.SDK.Twitter._Oauth=OAuth(YMAGYN.SDK.Twitter._Options);
    YMAGYN.SDK.Twitter._Oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
        function(data) {
            YMAGYN.SDK.Twitter._Oauth.get('https://api.twitter.com/1.1/statuses/home_timeline.json?count='+count,
                function(data) {
                    data.text = window.JSON.parse(data.text);
                    callback({
                        response:data,
                        error:false,
                        isLogged:true
                    })
                },
                function(data) {
                    callback({
                        response:data,
                        error:true,
                        isLogged:false
                    })
                }
                );
        }
        ); 
};

YMAGYN.SDK.Twitter.Follow = function(userToFollow, follow,callback){
    YMAGYN.SDK.Twitter._Oauth=OAuth(YMAGYN.SDK.Twitter._Options);
    YMAGYN.SDK.Twitter._Oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
        function(data) {
            YMAGYN.SDK.Twitter._Oauth.post('https://api.twitter.com/1.1/friendships/create.json',
            {
                'screen_name' : userToFollow,
                'follow' : follow
            },
            function(data) {
                data.text = window.JSON.parse(data.text);
                callback({
                    response:data,
                    error:false,
                    isLogged:true
                })
            },
            function(data) {
                callback({
                    response:data,
                    error:true,
                    isLogged:false
                })
            }
            );
        }
        ); 
};

YMAGYN.SDK.Twitter.Retweet = function(id,callback){                            
    YMAGYN.SDK.Twitter._Oauth=OAuth(YMAGYN.SDK.Twitter._Options);
    YMAGYN.SDK.Twitter._Oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
        function(data) {
            YMAGYN.SDK.Twitter._Oauth.post('https://api.twitter.com/1.1/statuses/retweet/'+id+'.json',
            {
                id:id
            }
            ,
            function(data) {
                data.text = window.JSON.parse(data.text);
                callback({
                    response:data,
                    error:false,
                    isLogged:true
                })
            },
            function(data) {
                callback({
                    response:data,
                    error:true,
                    isLogged:false
                })
            }
            );
        }
        ); 
};

YMAGYN.SDK.Twitter.RequestAPIMethod = function(params, requestURL, method ,callback){
    YMAGYN.SDK.Twitter._Oauth=OAuth(YMAGYN.SDK.Twitter._Options);
    YMAGYN.SDK.Twitter._Oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
        function(data) {
            if(method=='POST'){
                YMAGYN.SDK.Twitter._Oauth.post(requestURL,
                    params,
                    function(data) {
                        data.text = window.JSON.parse(data.text);
                        callback({
                            response:data,
                            error:false,
                            isLogged:true
                        })
                    },
                    function(data) {
                        callback({
                            response:data,
                            error:true,
                            isLogged:false
                        })
                    }
                    );
            }
            else if(method=='GET'){
                YMAGYN.SDK.Twitter._Oauth.get(requestURL,
                    function(data) {
                        data.text = window.JSON.parse(data.text);
                        callback({
                            response:data,
                            error:false,
                            isLogged:true
                        })
                    },
                    function(data) {
                        callback({
                            response:data,
                            error:true,
                            isLogged:false
                        })
                    }
                    );
            }
        }
        ); 
};if (typeof (YMAGYN.SDK.View) == "undefined" || !YMAGYN.SDK.View) {
    YMAGYN.SDK.View = {};
}

YMAGYN.SDK.View.closeView = function(){
	if(YMAGYN.SDK.is.iOS && !YMAGYN.SDK.isEmulate()){
		window.plugins.ymagyn.closeView();
	}
};

YMAGYN.SDK.View.hideStatusBar = function(){
	if(YMAGYN.SDK.is.iOS && !YMAGYN.SDK.isEmulate()){
		window.plugins.ymagyn.hideStatusBar();
	}
};if (typeof (YMAGYN.SDK.Events) == "undefined" || !YMAGYN.SDK.Events) {
    YMAGYN.SDK.Events = {};
}

YMAGYN.SDK.Events._statusNetwork = "online";
YMAGYN.SDK.Events._batteryLevel = "10";
YMAGYN.SDK.Events._batteryPlugged = false;
YMAGYN.SDK.Events._deviceReady = false;

YMAGYN.SDK.Events.isDeviceReady = function()
{
    return YMAGYN.SDK.Events._deviceReady;
};
YMAGYN.SDK.Events.getStatusNetwork = function()
{
    return YMAGYN.SDK.Events._statusNetwork;
};

YMAGYN.SDK.Events.getBatteryLevel = function()
{
    return YMAGYN.SDK.Events._batteryLevel;
};

YMAGYN.SDK.Events.getBatteryPlugged = function()
{
    return YMAGYN.SDK.Events._batteryPlugged;
};



YMAGYN.SDK.Events.online = function()
{
    console.log('Receive first Event')
    YMAGYN.SDK.Events._statusNetwork = "online";
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.online", true, true);
    document.dispatchEvent(evt);
};
YMAGYN.SDK.Events.offline = function()
{
    YMAGYN.SDK.Events._statusNetwork = "offline";
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.offline", true, true);
    document.dispatchEvent(evt);
};

YMAGYN.SDK.Events.onPause = function()
{
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.onPause", true, true);
    document.dispatchEvent(evt);
};

YMAGYN.SDK.Events.onResume = function()
{
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.onResume", true, true);
    document.dispatchEvent(evt);
}

YMAGYN.SDK.Events.onBackButton = function() {
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.onBackButton", true, true);
    document.dispatchEvent(evt);
}


YMAGYN.SDK.Events.onBatteryCritical = function(info) {
    var evt = document.createEvent("CustomEvent");
    if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) {
        console.log(info.level);
        console.log(info.isPlugged);
        evt.initCustomEvent("Events.onBatteryCritical", true, true, {
            level: info.level,
            isPlugged: info.isPlugged
        });
        document.dispatchEvent(evt);
    }
    else {
        evt.initCustomEvent("Events.onBatteryCritical", true, true, {
            level: YMAGYN.SDK.Events.getBatteryLevel(),
            isPlugged: YMAGYN.SDK.Events.getBatteryPlugged()
        });
        document.dispatchEvent(evt);
    }


};

YMAGYN.SDK.Events.onBatteryLow = function(info) {
    var evt = document.createEvent("CustomEvent");
    if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) {
        evt.initCustomEvent("Events.onBatteryLow", true, true, {
            level: info.level,
            isPlugged: info.isPlugged
        });
        document.dispatchEvent(evt);
    }
    else {
        evt.initCustomEvent("Events.onBatteryLow", true, true, {
            level: YMAGYN.SDK.Events.getBatteryLevel(),
            isPlugged: YMAGYN.SDK.Events.getBatteryPlugged()
        });
        document.dispatchEvent(evt);
    }

}

YMAGYN.SDK.Events.onBatteryStatus = function(info) {
    var evt = document.createEvent("CustomEvent");
    if (YMAGYN.SDK.is.Android || YMAGYN.SDK.is.iOS) {
        console.log(info.level)
        evt.initCustomEvent("Events.onBatteryStatus", true, true, {
            level: info.level,
            isPlugged: info.isPlugged
        });
        document.dispatchEvent(evt);
    }
    else {
        evt.initCustomEvent("Events.onBatteryStatus", true, true, {
            level: YMAGYN.SDK.Events.getBatteryLevel(),
            isPlugged: YMAGYN.SDK.Events.getBatteryPlugged()
        });
        document.dispatchEvent(evt);
    }


}

YMAGYN.SDK.Events.onMenuButton = function() {
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.onMenuButton", true, true);
    document.dispatchEvent(evt);
};

YMAGYN.SDK.Events.onSearchButton = function() {
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.onSearchButton", true, true);
    document.dispatchEvent(evt);
};

YMAGYN.SDK.Events.onStartCallButton = function() {
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.onStartCallButton", true, true);
    document.dispatchEvent(evt);
};

YMAGYN.SDK.Events.onEndCallButton = function() {
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.onEndCallButton", true, true);
    document.dispatchEvent(evt);
};

YMAGYN.SDK.Events.onVolumeDownButton = function() {
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.onVolumeDownButton", true, true);
    document.dispatchEvent(evt);
};

YMAGYN.SDK.Events.onVolumeUpButton = function() {
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("Events.onVolumeUpButton", true, true);
    document.dispatchEvent(evt);
};

YMAGYN.SDK.Events.deviceReady = function() {
    if(YMAGYN.SDK.is.MacOS || YMAGYN.SDK.is.Windows || YMAGYN.SDK.isEmulate()){
        YMAGYN.SDK.Splashscreen.show();
    }
    console.log("YMAGYN IO deviceready fired");
    YMAGYN.SDK.Events._deviceReady = true;
    console.log(YMAGYN.SDK.Device.platform());
    for (var obj in YMAGYN.SDK)
    {
        try
        {
            YMAGYN.SDK[obj].init();
        } catch (e)
{   
            console.warn(obj + ".init() not found");
        }
    }
    document.addEventListener("online", YMAGYN.SDK.Events.online, false);
    document.addEventListener("offline", YMAGYN.SDK.Events.offline, false);
    document.addEventListener("pause", YMAGYN.SDK.Events.onPause, false);
    document.addEventListener("resume", YMAGYN.SDK.Events.onResume, false); 
    document.addEventListener("backbutton", YMAGYN.SDK.Events.onBackButton, false);
    document.addEventListener("menubutton", YMAGYN.SDK.Events.onMenuButton, false);
    document.addEventListener("searchbutton", YMAGYN.SDK.Events.onSearchButton, false);
    document.addEventListener("startcallbutton", YMAGYN.SDK.Events.onStartCallButton, false);
    document.addEventListener("endcallbutton", YMAGYN.SDK.Events.onEndCallButton, false);
    document.addEventListener("volumedownbutton", YMAGYN.SDK.Events.onVolumeDownButton, false);
    document.addEventListener("volumeupbutton", YMAGYN.SDK.Events.onVolumeUpButton, false);
    window.addEventListener("batterycritical", YMAGYN.SDK.Events.onBatteryCritical, false);
    window.addEventListener("batterylow", YMAGYN.SDK.Events.onBatteryLow, false);
    window.addEventListener("batterystatus", YMAGYN.SDK.Events.onBatteryStatus, false);
};
document.addEventListener("deviceready", YMAGYN.SDK.Events.deviceReady, false);
