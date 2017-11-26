/**
 * Created by StevenChapman on 26/05/15.
 * This function looks for a result (res) and continus to check an output div for a result from the qr reader code contained in qrcode.js
 */
var app = angular.module('scanner');
app.factory('qrfactory', function ($q, $timeout, orderid,log) {

    //This resets the 'res' so that we can clear the state of having a result.
    var reset = function(){
        log.logMsg('Scan reset called')
        this.res = false;
    };

    //Parent function which returns for the deferred promise. The load function is called to start the process of looking for a result.
    var scan = function () {
        log.logMsg('Scan called')

        var defered = $q.defer();
        var gCtx = null;
        var gCanvas = null;
        var c = 0;
        var stype = 0;
        var gUM = false;
        var webkit = false;
        var moz = false;
        var v = null;
        var vidhtml = '<video id="v" autoplay></video>';
        this.res = false;

        //This function is called by doScan method and starts the process
        load();

        function initCanvas(w, h) {
            gCanvas = document.getElementById("qr-canvas");
            gCanvas.style.width = w + "px";
            gCanvas.style.height = h + "px";
            gCanvas.width = w;
            gCanvas.height = h;
            gCtx = gCanvas.getContext("2d");
            gCtx.clearRect(0, 0, w, h);
        }


        function captureToCanvas() {
            if (stype != 1)
                return;
            if (gUM) {
                try {
                    gCtx.drawImage(v, 0, 0);
                    try {
                        qrcode.decode();
                        document.getElementById("outdiv").style.display = "none";
                        this.res = true;
                        return;
                    }
                    catch (e) {
                        if (this.res !== true)
                            setTimeout(captureToCanvas, 500);
                    }
                    ;
                }
                catch (e) {
                    if (this.res !== true)
                        setTimeout(captureToCanvas, 500);
                }
                ;
            }
        }

        //Strips out html from resulting scan
        function htmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        //Reads result, sets orderid in service as constant and returns final result.
        function read(a) {
            if (htmlEntities(a)) {
                defered.resolve(htmlEntities(a));
                orderid.setOrderId(a);
                return;
            }
        }

        //Streams webcam output to screen
        function success(stream) {
            if (webkit)
                v.src = window.webkitURL.createObjectURL(stream);
            else if (moz) {
                v.mozSrcObject = stream;
                v.play();
            }
            else
                v.src = stream;
            gUM = true;
            setTimeout(captureToCanvas, 500);
        }

        function error(error) {
            gUM = false;
            return;
        }

        function load() {
            this.res = false;
            initCanvas(800, 600);
            qrcode.callback = read;
            setwebcam();
            return;
        }

        //Gets hold of the OS webcam.
        function setwebcam() {
            if (stype == 1) {
                setTimeout(captureToCanvas, 500);
            }
            var n = navigator;
            document.getElementById("outdiv").innerHTML = vidhtml;
            v = document.getElementById("v");

            if (n.getUserMedia)
                n.getUserMedia({video: true, audio: false}, success, error);
            else if (n.webkitGetUserMedia) {
                webkit = true;
                n.webkitGetUserMedia({video: true, audio: false}, success, error);
            }
            else if (n.mozGetUserMedia) {
                moz = true;
                n.mozGetUserMedia({video: true, audio: false}, success, error);
            }

            stype = 1;
            setTimeout(captureToCanvas, 500);
        }

        return defered.promise;

    };

    return {
        scan: scan,
        reset: reset
    };
})
