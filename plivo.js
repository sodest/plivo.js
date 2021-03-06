/*Copyright 2007 Adobe Systems Incorporated Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

/*Name: JsSIP Maintainer: José Luis Millán <jmillan@aliax.net> Copyright (c) 2012-2013 José Luis Millán <jmillan@aliax.net> License: The MIT License Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

/*(c) 2009–2013 by Jeff Mott. All rights reserved.  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met: Redistributions of source code must retain the above copyright notice, this list of conditions, and the following disclaimer.  Redistributions in binary form must reproduce the above copyright notice, this list of conditions, and the following disclaimer in the documentation or other materials provided with the distribution.  Neither the name CryptoJS nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS," AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/

/*The following source has been unminified and modified to remove the red dot from Google Chrome's browser tab when not in an active call.*/

function FABridge(a, b) {
    return this.target = a, this.remoteTypeCache = {}, this.remoteInstanceCache = {}, this.remoteFunctionCache = {}, this.localFunctionCache = {}, this.bridgeID = FABridge.nextBridgeID++, this.name = b, this.nextLocalFuncID = 0, FABridge.instances[this.name] = this, FABridge.idMap[this.bridgeID] = this, this
}

function instanceFactory(a) {
    return this.fb_instance_id = a, this
}

function FABridge__invokeJSFunction(a) {
    var b = a[0],
        c = a.concat();
    c.shift();
    var d = FABridge.extractBridgeFromID(b);
    return d.invokeLocalFunction(b, c)
}

function FABridge__bridgeInitialized(a) {
    var b = document.getElementsByTagName("object"),
        c = b.length,
        d = [];
    if (c > 0)
        for (var e = 0; c > e; e++) "undefined" != typeof b[e].SetVariable && (d[d.length] = b[e]);
    var f = document.getElementsByTagName("embed"),
        g = f.length,
        h = [];
    if (g > 0)
        for (var i = 0; g > i; i++) "undefined" != typeof f[i].SetVariable && (h[h.length] = f[i]);
    var j = d.length,
        k = h.length,
        l = "bridgeName=" + a;
    if (1 == j && !k || 1 == j && 1 == k) FABridge.attachBridge(d[0], a);
    else if (1 != k || j) {
        var m = !1;
        if (j > 1)
            for (var n = 0; j > n; n++) {
                for (var o = d[n].childNodes, p = 0; p < o.length; p++) {
                    var q = o[p];
                    if (1 == q.nodeType && "param" == q.tagName.toLowerCase() && "flashvars" == q.name.toLowerCase() && q.value.indexOf(l) >= 0) {
                        FABridge.attachBridge(d[n], a), m = !0;
                        break
                    }
                }
                if (m) break
            }
        if (!m && k > 1)
            for (var r = 0; k > r; r++) {
                var s = h[r].attributes.getNamedItem("flashVars").nodeValue;
                if (s.indexOf(l) >= 0) {
                    FABridge.attachBridge(h[r], a);
                    break
                }
            }
    } else FABridge.attachBridge(h[0], a);
    return !0
}
var BrowserDetect = {
    init: function() {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser", this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version", this.fullVersion = this.searchFullVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version", this.OS = this.searchString(this.dataOS) || "an unknown OS", this.fullOS = this.searchOSVersion() || void 0
    },
    searchString: function(a) {
        for (var b = 0; b < a.length; b++) {
            var c = a[b].string,
                d = a[b].prop;
            if (this.versionSearchString = a[b].versionSearch || a[b].identity, c) {
                if (-1 != c.indexOf(a[b].subString)) return a[b].identity
            } else if (d) return a[b].identity
        }
    },
    searchOSVersion: function() {
        var a, b, c, d = navigator.userAgent.indexOf(this.OS);
        return b = c = navigator.userAgent.indexOf(")", d), "Windows" == this.OS && (a = navigator.userAgent.indexOf(";", d), a > 0 && (b = c > a ? a : c)), navigator.userAgent.substring(d, b)
    },
    searchVersion: function(a) {
        var b = a.indexOf(this.versionSearchString);
        if (-1 != b) return parseFloat(a.substring(b + this.versionSearchString.length + 1))
    },
    searchFullVersion: function(a) {
        var b = a.indexOf(this.versionSearchString);
        if (-1 != b) {
            var c = a.substring(b + this.versionSearchString.length + 1),
                d = c.indexOf(" ");
            if (0 >= d) return c;
            var e = c.substring(0, d);
            return e
        }
    },
    dataBrowser: [{
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
    }, {
        string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
    }, {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
    }, {
        prop: window.opera,
        identity: "Opera",
        versionSearch: "Version"
    }, {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
    }, {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
    }, {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    }, {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
    }, {
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
    }, {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
    }, {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
    }, {
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
    }],
    dataOS: [{
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
    }, {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
    }, {
        string: navigator.userAgent,
        subString: "iPhone",
        identity: "iPhone/iPod"
    }, {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
    }],
    isWebrtcSupported: function() {
        var a = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        return a ? "Chrome" == this.browser && this.version >= 25 ? !0 : !1 : !1
    }
};
BrowserDetect.init();
var CryptoJS = CryptoJS || function(a, b) {
        var c = {}, d = c.lib = {}, e = d.Base = function() {
                function a() {}
                return {
                    extend: function(b) {
                        a.prototype = this;
                        var c = new a;
                        return b && c.mixIn(b), c.$super = this, c
                    },
                    create: function() {
                        var a = this.extend();
                        return a.init.apply(a, arguments), a
                    },
                    init: function() {},
                    mixIn: function(a) {
                        for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
                        a.hasOwnProperty("toString") && (this.toString = a.toString)
                    },
                    clone: function() {
                        return this.$super.extend(this)
                    }
                }
            }(),
            f = d.WordArray = e.extend({
                init: function(a, c) {
                    a = this.words = a || [], this.sigBytes = c != b ? c : 4 * a.length
                },
                toString: function(a) {
                    return (a || h).stringify(this)
                },
                concat: function(a) {
                    var b = this.words,
                        c = a.words,
                        d = this.sigBytes,
                        a = a.sigBytes;
                    if (this.clamp(), d % 4)
                        for (var e = 0; a > e; e++) b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4);
                    else if (65535 < c.length)
                        for (e = 0; a > e; e += 4) b[d + e >>> 2] = c[e >>> 2];
                    else b.push.apply(b, c);
                    return this.sigBytes += a, this
                },
                clamp: function() {
                    var b = this.words,
                        c = this.sigBytes;
                    b[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4), b.length = a.ceil(c / 4)
                },
                clone: function() {
                    var a = e.clone.call(this);
                    return a.words = this.words.slice(0), a
                },
                random: function(b) {
                    for (var c = [], d = 0; b > d; d += 4) c.push(4294967296 * a.random() | 0);
                    return f.create(c, b)
                }
            }),
            g = c.enc = {}, h = g.Hex = {
                stringify: function(a) {
                    for (var b = a.words, a = a.sigBytes, c = [], d = 0; a > d; d++) {
                        var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                        c.push((e >>> 4).toString(16)), c.push((15 & e).toString(16))
                    }
                    return c.join("")
                },
                parse: function(a) {
                    for (var b = a.length, c = [], d = 0; b > d; d += 2) c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
                    return f.create(c, b / 2)
                }
            }, i = g.Latin1 = {
                stringify: function(a) {
                    for (var b = a.words, a = a.sigBytes, c = [], d = 0; a > d; d++) c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                    return c.join("")
                },
                parse: function(a) {
                    for (var b = a.length, c = [], d = 0; b > d; d++) c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - 8 * (d % 4);
                    return f.create(c, b)
                }
            }, j = g.Utf8 = {
                stringify: function(a) {
                    try {
                        return decodeURIComponent(escape(i.stringify(a)))
                    } catch (b) {
                        throw Error("Malformed UTF-8 data")
                    }
                },
                parse: function(a) {
                    return i.parse(unescape(encodeURIComponent(a)))
                }
            }, k = d.BufferedBlockAlgorithm = e.extend({
                reset: function() {
                    this._data = f.create(), this._nDataBytes = 0
                },
                _append: function(a) {
                    "string" == typeof a && (a = j.parse(a)), this._data.concat(a), this._nDataBytes += a.sigBytes
                },
                _process: function(b) {
                    var c = this._data,
                        d = c.words,
                        e = c.sigBytes,
                        g = this.blockSize,
                        h = e / (4 * g),
                        h = b ? a.ceil(h) : a.max((0 | h) - this._minBufferSize, 0),
                        b = h * g,
                        e = a.min(4 * b, e);
                    if (b) {
                        for (var i = 0; b > i; i += g) this._doProcessBlock(d, i);
                        i = d.splice(0, b), c.sigBytes -= e
                    }
                    return f.create(i, e)
                },
                clone: function() {
                    var a = e.clone.call(this);
                    return a._data = this._data.clone(), a
                },
                _minBufferSize: 0
            });
        d.Hasher = k.extend({
            init: function() {
                this.reset()
            },
            reset: function() {
                k.reset.call(this), this._doReset()
            },
            update: function(a) {
                return this._append(a), this._process(), this
            },
            finalize: function(a) {
                return a && this._append(a), this._doFinalize(), this._hash
            },
            clone: function() {
                var a = k.clone.call(this);
                return a._hash = this._hash.clone(), a
            },
            blockSize: 16,
            _createHelper: function(a) {
                return function(b, c) {
                    return a.create(c).finalize(b)
                }
            },
            _createHmacHelper: function(a) {
                return function(b, c) {
                    return l.HMAC.create(a, c).finalize(b)
                }
            }
        });
        var l = c.algo = {};
        return c
    }(Math);
! function(a) {
    function b(a, b, c, d, e, f, g) {
        return a = a + (b & c | ~b & d) + e + g, (a << f | a >>> 32 - f) + b
    }

    function c(a, b, c, d, e, f, g) {
        return a = a + (b & d | c & ~d) + e + g, (a << f | a >>> 32 - f) + b
    }

    function d(a, b, c, d, e, f, g) {
        return a = a + (b ^ c ^ d) + e + g, (a << f | a >>> 32 - f) + b
    }

    function e(a, b, c, d, e, f, g) {
        return a = a + (c ^ (b | ~d)) + e + g, (a << f | a >>> 32 - f) + b
    }
    var f = CryptoJS,
        g = f.lib,
        h = g.WordArray,
        g = g.Hasher,
        i = f.algo,
        j = [];
    ! function() {
        for (var b = 0; 64 > b; b++) j[b] = 4294967296 * a.abs(a.sin(b + 1)) | 0
    }(), i = i.MD5 = g.extend({
        _doReset: function() {
            this._hash = h.create([1732584193, 4023233417, 2562383102, 271733878])
        },
        _doProcessBlock: function(a, f) {
            for (var g = 0; 16 > g; g++) {
                var h = f + g,
                    i = a[h];
                a[h] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8)
            }
            for (var h = this._hash.words, i = h[0], k = h[1], l = h[2], m = h[3], g = 0; 64 > g; g += 4) 16 > g ? (i = b(i, k, l, m, a[f + g], 7, j[g]), m = b(m, i, k, l, a[f + g + 1], 12, j[g + 1]), l = b(l, m, i, k, a[f + g + 2], 17, j[g + 2]), k = b(k, l, m, i, a[f + g + 3], 22, j[g + 3])) : 32 > g ? (i = c(i, k, l, m, a[f + (g + 1) % 16], 5, j[g]), m = c(m, i, k, l, a[f + (g + 6) % 16], 9, j[g + 1]), l = c(l, m, i, k, a[f + (g + 11) % 16], 14, j[g + 2]), k = c(k, l, m, i, a[f + g % 16], 20, j[g + 3])) : 48 > g ? (i = d(i, k, l, m, a[f + (3 * g + 5) % 16], 4, j[g]), m = d(m, i, k, l, a[f + (3 * g + 8) % 16], 11, j[g + 1]), l = d(l, m, i, k, a[f + (3 * g + 11) % 16], 16, j[g + 2]), k = d(k, l, m, i, a[f + (3 * g + 14) % 16], 23, j[g + 3])) : (i = e(i, k, l, m, a[f + 3 * g % 16], 6, j[g]), m = e(m, i, k, l, a[f + (3 * g + 7) % 16], 10, j[g + 1]), l = e(l, m, i, k, a[f + (3 * g + 14) % 16], 15, j[g + 2]), k = e(k, l, m, i, a[f + (3 * g + 5) % 16], 21, j[g + 3]));
            h[0] = h[0] + i | 0, h[1] = h[1] + k | 0, h[2] = h[2] + l | 0, h[3] = h[3] + m | 0
        },
        _doFinalize: function() {
            var a = this._data,
                b = a.words,
                c = 8 * this._nDataBytes,
                d = 8 * a.sigBytes;
            for (b[d >>> 5] |= 128 << 24 - d % 32, b[(d + 64 >>> 9 << 4) + 14] = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8), a.sigBytes = 4 * (b.length + 1), this._process(), a = this._hash.words, b = 0; 4 > b; b++) c = a[b], a[b] = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
        }
    }), f.MD5 = g._createHelper(i), f.HmacMD5 = g._createHmacHelper(i)
}(Math),
function() {
    if (!BrowserDetect.isWebrtcSupported()) {
        var a;
        a = function() {
            function a(a) {
                var c = b.getFlashPlayerVersion();
                return Plivo.logDebug("- Flash Version : " + c.major + "." + c.minor + "." + c.release), 0 === c.major ? void Plivo.onFlashNotInstalled() : (Plivo.logDebug("Initializing flash engine"), l = a, void z(a))
            }

            function c() {
                O("_onInit")
            }

            function d() {
                Plivo.logDebug("_onDisconnected"), Plivo.onLogout()
            }

            function e() {
                Plivo.logNull("_onPrivPopUpClosed"), Plivo.config.mask_page_on_perm && Plivo.unmaskPage(), K(), r.isMuted() ? Plivo.onMediaPermission(!1) : (Plivo.onMediaPermission(!0), Plivo.config.perm_on_click && ("IN" == s ? Plivo.conn.answer() : Plivo.conn.call(x, y)))
            }

            function f() {
                var a = document.createElement("div");
                a.id = "plivo_flash_placeholder", document.body.insertBefore(a, document.body.firstChild)
            }
            var g, h, i, j, k, l, m = "phone.plivo.com",
                n = "rtmp.plivo.com",
                o = {
                    rtmp_url: "rtmp://" + n + "/phone",
                    bridgeName: "flex",
                    codec: "speex",
                    aec: "yes",
                    init_tone: "no"
                }, p = {
                    allowScriptAccess: "always"
                }, q = {}, r = null,
                s = null,
                t = "",
                u = !1,
                v = !1,
                w = !1,
                x = null,
                y = null,
                z = function(a) {
                    f(), o.init_tone = "yes", a.flash_aec === !1 && (o.aec = "no"), "" === a.swf_path ? (Plivo.logDebug("Before Embedding ..."), b.embedSWF("//s3.amazonaws.com/plivosdk/web/plivo.v0.18.8.swf", "plivo_flash_placeholder", "215", "138", "10.0.0", "", o, p, q, function(a) {
                        console.log(a && a.success ? "Embed Success!" : "Embed Event not Success." + a)
                    })) : (Plivo.logDebug("Before Embedding " + a.swf_path), b.embedSWF(a.swf_path, "plivo_flash_placeholder", "215", "138", "10.0.0", "", o, p, q, function(a) {
                        console.log(a && a.success ? "Embed Success!" : "Embed Event not Success." + a)
                    })), Plivo.logDebug("Post Embedding ..."), FABridge.addInitializationCallback("flex", B);
                    try {
                        FABridge.instance && FABridge.instances.flex || Plivo.logDebug("Unable to initialize. Ensure Flash Plugin is permitted by Browser.")
                    } catch (c) {
                        Plivo.logDebug("Unknown Initialization Error.")
                    }
                }, A = function() {
                    Plivo.config.mask_page_on_perm && Plivo.maskThePage(), L(), Plivo.onRequirePermission(), r.showPrivacy()
                }, B = function() {
                    Plivo.logNull("plivo_flash initCallback"), r = FABridge.flex.root(), r.addEventListener("EvtInit", c), r.addEventListener("EvtConnected", G), r.addEventListener("EvtLogin", H), r.addEventListener("EvtLogout", I), r.addEventListener("EvtMakeCall", F), r.addEventListener("EvtCallState", E), r.addEventListener("EvtHangup", D), r.addEventListener("EvtIncomingCall", C), r.addEventListener("EvtDisconnected", d), r.addEventListener("EvtPrivPopUpClosed", e), r.addEventListener("EvtLog", J), r.addEventListener("EvtMicAvailable", M), r.addEventListener("EvtMicNotAvailable", N), r.isMuted() && !Plivo.config.listen_mode ? (Plivo.logDebug("mic is muted"), document.getElementById("plivo_flash_placeholder").style.zIndex = "999", Plivo.config.perm_on_click ? K() : A()) : (Plivo.logDebug("mic permission is OK"), K())
                };
            a.prototype.login = function(a, b) {
                if (!v) return Plivo.logDebug("error : flash backend is not ready yet. You need to wait for onReady event to be fired before login."), !1;
                if (void 0 === a || void 0 === b || null === a || null === b) return Plivo.logDebug("username & password cant be null"), !1;
                if (a.length <= 0 || 0 >= b) return Plivo.logDebug("username & password length should be more than 0"), !1;
                h = a + "@" + m, k = a;
                var c = CryptoJS.MD5(a + ":" + m + ":" + b).toString();
                return r.login(h, c), !0
            }, a.prototype.logout = function() {
                return Plivo.conn.ringToneStop(), Plivo.conn.ringBackToneStop(), r.unregister(h, k), r.logout(h), !0
            }, a.prototype.call = function(a, b) {
                if (!v) return Plivo.logDebug("error : flash backend is not ready yet"), !1;
                if (!w) return Plivo.logDebug("error : you need to be logged in before make a call"), !1;
                if (void 0 === a || null === a || a.length <= 0) return Plivo.logDebug("destination address can't be null and it's lenght must be > 0"), !1;
                if (r.isMuted() && !Plivo.config.listen_mode) return Plivo.logDebug("Mic is muted, show privacy page"), A(), x = a, y = b, !0;
                a.indexOf("@") < 0 && (a = a + "@" + m), 0 !== a.indexOf("sip:") && (a = "sip:" + a), Plivo.conn.ringBackTonePlay(), b = b || {};
                var c = {};
                for (var d in b) {
                    var e = b[d].toString();
                    Plivo.checkExtraHeader(d, e) === !0 && (c[d] = e)
                }
                return r.makeCall(a, h, c), !0
            }, a.prototype.hangup = function() {
                return Plivo.conn.ringBackToneStop(), r.hangup(i), !0
            }, a.prototype.send_dtmf = function(a) {
                return void 0 === a || null === a ? (Plivo.logDebug("DTMF digit can't be null"), !1) : (r.sendDTMF(a, 2e3), Plivo.conn.dtmfTonePlay(a), !0)
            }, a.prototype.answer = function() {
                return r.isMuted() && !Plivo.config.listen_mode ? (Plivo.logDebug("Mic is muted, show privacy page"), A(), !0) : (Plivo.logNull("answering=" + j), Plivo.conn.ringToneStop(), r.answer(j), !0)
            }, a.prototype.reject = function() {
                return Plivo.conn.ringToneStop(), r.hangup(j), !0
            }, a.prototype.mute = function() {
                return Plivo.logNull("mute the mic"), r.setMute(), !0
            }, a.prototype.unmute = function() {
                return Plivo.logNull("unmute"), r.setUnMute(), !0
            }, a.prototype.setTone = function(a) {
                return r.toneSet("ring_tone", a, ""), !0
            }, a.prototype.setRingToneBack = function(a) {
                return r.toneSet("ring_back_tone", a, ""), !0
            }, a.prototype.setDtmfTone = function(a, b) {
                return r.toneSet("dtmf_tone", a, b), !0
            }, a.prototype.checkMic = function() {
                return r.checkMicStatus(), !0
            }, a.prototype.getCallStats = function() {
                return r.getStats(), !0
            };
            var C = function(a) {
                var b, c = {};
                if (j = a.getUuid(), Plivo.logDebug("_onIncomingCall.uuid=" + j), s) return Plivo.logNull("Another call in progress/active, reject new call"), r.hangup(j);
                s = "IN", b = JSON.parse(a.getExtraHeaders());
                for (var d in b) 0 === d.indexOf("rtmp_u__") && (c[d.substring(8)] = b[d]);
                Plivo.conn.ringTonePlay(), Plivo.onIncomingCall(a.getName(), c)
            }, D = function() {
                    Plivo.logNull("_onHangup"), u === !0 ? (u = !1, Plivo.conn.ringToneStop(), Plivo.onCallTerminated()) : "IN" == s ? (Plivo.logNull("hangup.not in call.IN"), Plivo.conn.ringToneStop(), Plivo.onIncomingCallCanceled()) : (Plivo.logNull("hangup.not in call.OUT"), Plivo.conn.ringBackToneStop(), Plivo.onCallFailed()), s = null
                }, E = function(a) {
                    uuid = a.getUuid();
                    var b = a.getState();
                    return Plivo.logNull("new call state=" + b), b === t ? void Plivo.logNull("new_state == old state. Ignore it") : (t = b, void("ACTIVE" == t ? (u = !0, Plivo.conn.ringBackToneStop(), Plivo.conn.ringToneStop(), Plivo.onCallAnswered()) : "RINGING" == t ? "OUT" == s && Plivo.onCallRemoteRinging() : "HANGUP" == t ? E() : "EARLY" == t && Plivo.conn.ringBackToneStop()))
                }, F = function(a) {
                    s = "OUT", number = a.getNumber(), h = a.getAccount(), i = a.getUuid(), Plivo.conn.ringBackTonePlay(), Plivo.onCalling()
                }, G = function(a) {
                    Plivo.logDebug("___onConnected"), g = a.getSid(), v = !0, Plivo.onReady()
                }, H = function(a) {
                    result = a.getResult(), user = a.getUser(), "success" != result ? (w = !1, Plivo.logNull("login failed"), Plivo.onLoginFailed()) : (w = !0, Plivo.logNull("login OK."), r.register(h, k), Plivo.onLogin())
                }, I = function() {
                    w = !1, O("onLogout"), Plivo.onLogout()
                }, J = function(a) {
                    Plivo.logNull(a.getMessage())
                }, K = function() {
                    Plivo.logDebug("_moveBackFlashObject");
                    var a = document.getElementById("plivo_flash_placeholder");
                    a.style.zIndex = "-99", "Safari" != BrowserDetect.browser && (a.style.position = "relative"), a.style.top = "0", a.style.left = "0", "Explorer" == BrowserDetect.browser || "Safari" == BrowserDetect.browser ? (a.width = "1", a.height = "1") : (a.width = "0", a.height = "0")
                }, L = function() {
                    Plivo.logDebug("resurrect flash object");
                    var a = document.getElementById("plivo_flash_placeholder");
                    a.style.zIndex = "999", a.style.position = "absolute", a.style.visibility = "visible", window.self == window.top ? (a.style.top = "40%", a.style.left = "40%") : (a.style.top = "0", a.style.left = "0"), a.width = "215", a.height = "138"
                }, M = function() {
                    Plivo.logDebug("_onMicAvailable"), Plivo.onMicAvailable()
                }, N = function() {
                    Plivo.logDebug("_onMicNotAvailable"), Plivo.onMicNotAvailable()
                }, O = function(a) {
                    Plivo.logNull(a)
                };
            return a.prototype.ringTonePlay = function() {
                Plivo.ringToneFlag !== !1 && (Plivo.logNull("send play ringtone command to flash"), r.toneCtrl("ring_tone", "play", ""))
            }, a.prototype.ringToneStop = function() {
                Plivo.ringToneFlag !== !1 && r.toneCtrl("ring_tone", "stop", "")
            }, a.prototype.ringBackTonePlay = function() {
                Plivo.ringToneBackFlag !== !1 && r.toneCtrl("ring_back_tone", "play", "")
            }, a.prototype.ringBackToneStop = function() {
                Plivo.ringToneBackFlag !== !1 && r.toneCtrl("ring_back_tone", "stop", "")
            }, a.prototype.dtmfTonePlay = function(a) {
                return Plivo.logNull("play dtmf tone:" + a), Plivo.getDtmfToneFlag(a) === !1 ? void Plivo.logNull("dtmfToneFlag == false") : void r.toneCtrl("dtmf_tone", "play", a)
            }, a
        }(), window.plivo_flash = a;
        var b = function() {
            function a() {
                if (!S) {
                    try {
                        var a = L.getElementsByTagName("body")[0].appendChild(r("span"));
                        a.parentNode.removeChild(a)
                    } catch (b) {
                        return
                    }
                    S = !0;
                    for (var c = O.length, d = 0; c > d; d++) O[d]()
                }
            }

            function c(a) {
                S ? a() : O[O.length] = a
            }

            function d(a) {
                if (typeof K.addEventListener != D) K.addEventListener("load", a, !1);
                else if (typeof L.addEventListener != D) L.addEventListener("load", a, !1);
                else if (typeof K.attachEvent != D) s(K, "onload", a);
                else if ("function" == typeof K.onload) {
                    var b = K.onload;
                    K.onload = function() {
                        b(), a()
                    }
                } else K.onload = a
            }

            function e() {
                N ? f() : g()
            }

            function f() {
                var a = L.getElementsByTagName("body")[0],
                    b = r(E);
                b.setAttribute("type", H);
                var c = a.appendChild(b);
                if (c) {
                    var d = 0;
                    ! function() {
                        if (typeof c.GetVariable != D) {
                            var e = c.GetVariable("$version");
                            e && (e = e.split(" ")[1].split(","), V.pv = [parseInt(e[0], 10), parseInt(e[1], 10), parseInt(e[2], 10)])
                        } else if (10 > d) return d++, void setTimeout(arguments.callee, 10);
                        a.removeChild(b), c = null, g()
                    }()
                } else g()
            }

            function g() {
                var a = P.length;
                if (a > 0)
                    for (var b = 0; a > b; b++) {
                        var c = P[b].id,
                            d = P[b].callbackFn,
                            e = {
                                success: !1,
                                id: c
                            };
                        if (V.pv[0] > 0) {
                            var f = q(c);
                            if (f)
                                if (!t(P[b].swfVersion) || V.wk && V.wk < 312)
                                    if (P[b].expressInstall && i()) {
                                        var g = {};
                                        g.data = P[b].expressInstall, g.width = f.getAttribute("width") || "0", g.height = f.getAttribute("height") || "0", f.getAttribute("class") && (g.styleclass = f.getAttribute("class")), f.getAttribute("align") && (g.align = f.getAttribute("align"));
                                        for (var l = {}, m = f.getElementsByTagName("param"), n = m.length, o = 0; n > o; o++) "movie" != m[o].getAttribute("name").toLowerCase() && (l[m[o].getAttribute("name")] = m[o].getAttribute("value"));
                                        j(g, l, c, d)
                                    } else k(f), d && d(e);
                                    else v(c, !0), d && (e.success = !0, e.ref = h(c), d(e))
                        } else if (v(c, !0), d) {
                            var p = h(c);
                            p && typeof p.SetVariable != D && (e.success = !0, e.ref = p), d(e)
                        }
                    }
            }

            function h(a) {
                var b = null,
                    c = q(a);
                if (c && "OBJECT" == c.nodeName)
                    if (typeof c.SetVariable != D) b = c;
                    else {
                        var d = c.getElementsByTagName(E)[0];
                        d && (b = d)
                    }
                return b
            }

            function i() {
                return !T && t("6.0.65") && (V.win || V.mac) && !(V.wk && V.wk < 312)
            }

            function j(a, b, c, d) {
                T = !0, z = d || null, A = {
                    success: !1,
                    id: c
                };
                var e = q(c);
                if (e) {
                    "OBJECT" == e.nodeName ? (x = l(e), y = null) : (x = e, y = c), a.id = I, (typeof a.width == D || !/%$/.test(a.width) && parseInt(a.width, 10) < 310) && (a.width = "310"), (typeof a.height == D || !/%$/.test(a.height) && parseInt(a.height, 10) < 137) && (a.height = "137"), L.title = L.title.slice(0, 47) + " - Flash Player Installation";
                    var f = V.ie && V.win ? "ActiveX" : "PlugIn",
                        g = "MMredirectURL=" + encodeURI(window.location).toString().replace(/&/g, "%26") + "&MMplayerType=" + f + "&MMdoctitle=" + L.title;
                    if (typeof b.flashvars != D ? b.flashvars += "&" + g : b.flashvars = g, V.ie && V.win && 4 != e.readyState) {
                        var h = r("div");
                        c += "SWFObjectNew", h.setAttribute("id", c), e.parentNode.insertBefore(h, e), e.style.display = "none",
                        function() {
                            4 == e.readyState ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10)
                        }()
                    }
                    m(a, b, c)
                }
            }

            function k(a) {
                if (V.ie && V.win && 4 != a.readyState) {
                    var b = r("div");
                    a.parentNode.insertBefore(b, a), b.parentNode.replaceChild(l(a), b), a.style.display = "none",
                    function() {
                        4 == a.readyState ? a.parentNode.removeChild(a) : setTimeout(arguments.callee, 10)
                    }()
                } else a.parentNode.replaceChild(l(a), a)
            }

            function l(a) {
                var b = r("div");
                if (V.win && V.ie) b.innerHTML = a.innerHTML;
                else {
                    var c = a.getElementsByTagName(E)[0];
                    if (c) {
                        var d = c.childNodes;
                        if (d)
                            for (var e = d.length, f = 0; e > f; f++) 1 == d[f].nodeType && "PARAM" == d[f].nodeName || 8 == d[f].nodeType || b.appendChild(d[f].cloneNode(!0))
                    }
                }
                return b
            }

            function m(a, b, c) {
                var d, e = q(c);
                if (V.wk && V.wk < 312) return d;
                if (e)
                    if (typeof a.id == D && (a.id = c), V.ie && V.win) {
                        var f = "";
                        for (var g in a) a[g] != Object.prototype[g] && ("data" == g.toLowerCase() ? b.movie = a[g] : "styleclass" == g.toLowerCase() ? f += ' class="' + a[g] + '"' : "classid" != g.toLowerCase() && (f += " " + g + '="' + a[g] + '"'));
                        var h = "";
                        for (var i in b) b[i] != Object.prototype[i] && (h += '<param name="' + i + '" value="' + b[i] + '" />');
                        e.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + f + ">" + h + "</object>", Q[Q.length] = a.id, d = q(a.id)
                    } else {
                        var j = r(E);
                        j.setAttribute("type", H);
                        for (var k in a) a[k] != Object.prototype[k] && ("styleclass" == k.toLowerCase() ? j.setAttribute("class", a[k]) : "classid" != k.toLowerCase() && j.setAttribute(k, a[k]));
                        for (var l in b) b[l] != Object.prototype[l] && "movie" != l.toLowerCase() && n(j, l, b[l]);
                        e.parentNode.replaceChild(j, e), d = j
                    }
                return d
            }

            function n(a, b, c) {
                var d = r("param");
                d.setAttribute("name", b), d.setAttribute("value", c), a.appendChild(d)
            }

            function o(a) {
                var b = q(a);
                b && "OBJECT" == b.nodeName && (V.ie && V.win ? (b.style.display = "none", function() {
                    4 == b.readyState ? p(a) : setTimeout(arguments.callee, 10)
                }()) : b.parentNode.removeChild(b))
            }

            function p(a) {
                var b = q(a);
                if (b) {
                    for (var c in b) "function" == typeof b[c] && (b[c] = null);
                    b.parentNode.removeChild(b)
                }
            }

            function q(a) {
                var b = null;
                try {
                    b = L.getElementById(a)
                } catch (c) {}
                return b
            }

            function r(a) {
                return L.createElement(a)
            }

            function s(a, b, c) {
                a.attachEvent(b, c), R[R.length] = [a, b, c]
            }

            function t(a) {
                var b = V.pv,
                    c = a.split(".");
                return c[0] = parseInt(c[0], 10), c[1] = parseInt(c[1], 10) || 0, c[2] = parseInt(c[2], 10) || 0, b[0] > c[0] || b[0] == c[0] && b[1] > c[1] || b[0] == c[0] && b[1] == c[1] && b[2] >= c[2] ? !0 : !1
            }

            function u(a, b, c, d) {
                if (!V.ie || !V.mac) {
                    var e = L.getElementsByTagName("head")[0];
                    if (e) {
                        var f = c && "string" == typeof c ? c : "screen";
                        if (d && (B = null, C = null), !B || C != f) {
                            var g = r("style");
                            g.setAttribute("type", "text/css"), g.setAttribute("media", f), B = e.appendChild(g), V.ie && V.win && typeof L.styleSheets != D && L.styleSheets.length > 0 && (B = L.styleSheets[L.styleSheets.length - 1]), C = f
                        }
                        V.ie && V.win ? B && typeof B.addRule == E && B.addRule(a, b) : B && typeof L.createTextNode != D && B.appendChild(L.createTextNode(a + " {" + b + "}"))
                    }
                }
            }

            function v(a, b) {
                if (U) {
                    var c = b ? "visible" : "hidden";
                    if (S && q(a)) {
                        var d = document.getElementById(a);
                        d.style.visibility = c, d.style.position = "absolute", d.style.top = "-15000", d.style.left = "-15000", d.style.zIndex = "-999"
                    } else u("#" + a, "visibility:" + c)
                }
            }

            function w(a) {
                var b = /[\\\"<>\.;]/,
                    c = null !== b.exec(a);
                return c && typeof encodeURIComponent != D ? encodeURIComponent(a) : a
            } {
                var x, y, z, A, B, C, D = "undefined",
                    E = "object",
                    F = "Shockwave Flash",
                    G = "ShockwaveFlash.ShockwaveFlash",
                    H = "application/x-shockwave-flash",
                    I = "SWFObjectExprInst",
                    J = "onreadystatechange",
                    K = window,
                    L = document,
                    M = navigator,
                    N = !1,
                    O = [e],
                    P = [],
                    Q = [],
                    R = [],
                    S = !1,
                    T = !1,
                    U = !0,
                    V = function() {
                        var a = typeof L.getElementById != D && typeof L.getElementsByTagName != D && typeof L.createElement != D,
                            b = M.userAgent.toLowerCase(),
                            c = M.platform.toLowerCase(),
                            d = /win/.test(c ? c : b),
                            e = /mac/.test(c ? c : b),
                            f = /webkit/.test(b) ? parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
                            g = !1,
                            h = [0, 0, 0],
                            i = null;
                        if (typeof M.plugins != D && typeof M.plugins[F] == E) i = M.plugins[F].description, !i || typeof M.mimeTypes != D && M.mimeTypes[H] && !M.mimeTypes[H].enabledPlugin || (N = !0, g = !1, i = i.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), h[0] = parseInt(i.replace(/^(.*)\..*$/, "$1"), 10), h[1] = parseInt(i.replace(/^.*\.(.*)\s.*$/, "$1"), 10), h[2] = /[a-zA-Z]/.test(i) ? parseInt(i.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0);
                        else if (typeof K.ActiveXObject != D) try {
                            var j = new ActiveXObject(G);
                            j && (i = j.GetVariable("$version"), i && (g = !0, i = i.split(" ")[1].split(","), h = [parseInt(i[0], 10), parseInt(i[1], 10), parseInt(i[2], 10)]))
                        } catch (k) {}
                        return {
                            w3: a,
                            pv: h,
                            wk: f,
                            ie: g,
                            win: d,
                            mac: e
                        }
                    }();
                ! function() {
                    V.w3 && ((typeof L.readyState != D && "complete" == L.readyState || typeof L.readyState == D && (L.getElementsByTagName("body")[0] || L.body)) && a(), S || (typeof L.addEventListener != D && L.addEventListener("DOMContentLoaded", a, !1), V.ie && V.win && (L.attachEvent(J, function() {
                        "complete" == L.readyState && (L.detachEvent(J, arguments.callee), a())
                    }), K == top && ! function() {
                        if (!S) {
                            try {
                                L.documentElement.doScroll("left")
                            } catch (b) {
                                return void setTimeout(arguments.callee, 0)
                            }
                            a()
                        }
                    }()), V.wk && ! function() {
                        return S ? void 0 : /loaded|complete/.test(L.readyState) ? void a() : void setTimeout(arguments.callee, 0)
                    }(), d(a)))
                }(),
                function() {
                    V.ie && V.win && window.attachEvent("onunload", function() {
                        for (var a = R.length, c = 0; a > c; c++) R[c][0].detachEvent(R[c][1], R[c][2]);
                        for (var d = Q.length, e = 0; d > e; e++) o(Q[e]);
                        for (var f in V) V[f] = null;
                        V = null;
                        for (var g in b) b[g] = null;
                        b = null
                    })
                }()
            }
            return {
                registerObject: function(a, b, c, d) {
                    if (V.w3 && a && b) {
                        var e = {};
                        e.id = a, e.swfVersion = b, e.expressInstall = c, e.callbackFn = d, P[P.length] = e, v(a, !1)
                    } else d && d({
                        success: !1,
                        id: a
                    })
                },
                getObjectById: function(a) {
                    return V.w3 ? h(a) : void 0
                },
                embedSWF: function(a, b, d, e, f, g, h, k, l, n) {
                    var o = {
                        success: !1,
                        id: b
                    };
                    V.w3 && !(V.wk && V.wk < 312) && a && b && d && e && f ? (v(b, !1), c(function() {
                        d += "", e += "";
                        var c = {};
                        if (l && typeof l === E)
                            for (var p in l) c[p] = l[p];
                        c.data = a, c.width = d, c.height = e;
                        var q = {};
                        if (k && typeof k === E)
                            for (var r in k) q[r] = k[r];
                        if (h && typeof h === E)
                            for (var s in h) typeof q.flashvars != D ? q.flashvars += "&" + s + "=" + h[s] : q.flashvars = s + "=" + h[s];
                        if (t(f)) {
                            var u = m(c, q, b);
                            c.id == b && v(b, !0), o.success = !0, o.ref = u
                        } else {
                            if (g && i()) return c.data = g, void j(c, q, b, n);
                            v(b, !0)
                        }
                        n && n(o)
                    })) : n && n(o)
                },
                switchOffAutoHideShow: function() {
                    U = !1
                },
                ua: V,
                getFlashPlayerVersion: function() {
                    return {
                        major: V.pv[0],
                        minor: V.pv[1],
                        release: V.pv[2]
                    }
                },
                hasFlashPlayerVersion: t,
                createSWF: function(a, b, c) {
                    return V.w3 ? m(a, b, c) : void 0
                },
                showExpressInstall: function(a, b, c, d) {
                    V.w3 && i() && j(a, b, c, d)
                },
                removeSWF: function(a) {
                    V.w3 && o(a)
                },
                createCSS: function(a, b, c, d) {
                    V.w3 && u(a, b, c, d)
                },
                addDomLoadEvent: c,
                addLoadEvent: d,
                getQueryParamValue: function(a) {
                    var b = L.location.search || L.location.hash;
                    if (b) {
                        if (/\?/.test(b) && (b = b.split("?")[1]), null === a) return w(b);
                        for (var c = b.split("&"), d = 0; d < c.length; d++)
                            if (c[d].substring(0, c[d].indexOf("=")) == a) return w(c[d].substring(c[d].indexOf("=") + 1))
                    }
                    return ""
                },
                expressInstallCallback: function() {
                    if (T) {
                        var a = q(I);
                        a && x && (a.parentNode.replaceChild(x, a), y && (v(y, !0), V.ie && V.win && (x.style.display = "block")), z && z(A)), T = !1
                    }
                }
            }
        }()
    }
}.call(this), FABridge.TYPE_ASINSTANCE = 1, FABridge.TYPE_ASFUNCTION = 2, FABridge.TYPE_JSFUNCTION = 3, FABridge.TYPE_ANONYMOUS = 4, FABridge.initCallbacks = {}, FABridge.argsToArray = function(a) {
    for (var b = [], c = 0; c < a.length; c++) b[c] = a[c];
    return b
}, FABridge.addInitializationCallback = function(a, b) {
    var c = FABridge.instances[a];
    if (void 0 != c) return void b.call(c);
    var d = FABridge.initCallbacks[a];
    null == d && (FABridge.initCallbacks[a] = d = []), d.push(b)
}, FABridge.nextBridgeID = 0, FABridge.instances = {}, FABridge.idMap = {}, FABridge.refCount = 0, FABridge.extractBridgeFromID = function(a) {
    var b = a >> 16;
    return FABridge.idMap[b]
}, FABridge.attachBridge = function(a, b) {
    var c = new FABridge(a, b);
    FABridge[b] = c;
    var d = FABridge.initCallbacks[b];
    if (null != d) {
        for (var e = 0; e < d.length; e++) d[e].call(c);
        delete FABridge.initCallbacks[b]
    }
}, FABridge.blockedMethods = {
    toString: !0,
    get: !0,
    set: !0,
    call: !0
}, FABridge.prototype = {
    root: function() {
        return this.deserialize(this.target.getRoot())
    },
    releaseASObjects: function() {
        return this.target.releaseASObjects()
    },
    releaseNamedASObject: function(a) {
        if ("object" != typeof a) return !1;
        var b = this.target.releaseNamedASObject(a.fb_instance_id);
        return b
    },
    create: function(a) {
        return this.deserialize(this.target.create(a))
    },
    makeID: function(a) {
        return (this.bridgeID << 16) + a
    },
    getPropertyFromAS: function(a, b) {
        if (FABridge.refCount > 0) throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.");
        return FABridge.refCount++, retVal = this.target.getPropFromAS(a, b), retVal = this.handleError(retVal), FABridge.refCount--, retVal
    },
    setPropertyInAS: function(a, b, c) {
        if (FABridge.refCount > 0) throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.");
        return FABridge.refCount++, retVal = this.target.setPropInAS(a, b, this.serialize(c)), retVal = this.handleError(retVal), FABridge.refCount--, retVal
    },
    callASFunction: function(a, b) {
        if (FABridge.refCount > 0) throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.");
        return FABridge.refCount++, retVal = this.target.invokeASFunction(a, this.serialize(b)), retVal = this.handleError(retVal), FABridge.refCount--, retVal
    },
    callASMethod: function(a, b, c) {
        if (FABridge.refCount > 0) throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.");
        return FABridge.refCount++, c = this.serialize(c), retVal = this.target.invokeASMethod(a, b, c), retVal = this.handleError(retVal), FABridge.refCount--, retVal
    },
    invokeLocalFunction: function(a, b) {
        var c, d = this.localFunctionCache[a];
        return void 0 != d && (c = this.serialize(d.apply(null, this.deserialize(b)))), c
    },
    getTypeFromName: function(a) {
        return this.remoteTypeCache[a]
    },
    createProxy: function(a, b) {
        var c = this.getTypeFromName(b);
        instanceFactory.prototype = c;
        var d = new instanceFactory(a);
        return this.remoteInstanceCache[a] = d, d
    },
    getProxy: function(a) {
        return this.remoteInstanceCache[a]
    },
    addTypeDataToCache: function(a) {
        newType = new ASProxy(this, a.name);
        for (var b = a.accessors, c = 0; c < b.length; c++) this.addPropertyToType(newType, b[c]);
        for (var d = a.methods, c = 0; c < d.length; c++) void 0 == FABridge.blockedMethods[d[c]] && this.addMethodToType(newType, d[c]);
        return this.remoteTypeCache[newType.typeName] = newType, newType
    },
    addPropertyToType: function(a, b) {
        var c, d, e = b.charAt(0);
        e >= "a" && "z" >= e ? (d = "get" + e.toUpperCase() + b.substr(1), c = "set" + e.toUpperCase() + b.substr(1)) : (d = "get" + b, c = "set" + b), a[c] = function(a) {
            this.bridge.setPropertyInAS(this.fb_instance_id, b, a)
        }, a[d] = function() {
            return this.bridge.deserialize(this.bridge.getPropertyFromAS(this.fb_instance_id, b))
        }
    },
    addMethodToType: function(a, b) {
        a[b] = function() {
            return this.bridge.deserialize(this.bridge.callASMethod(this.fb_instance_id, b, FABridge.argsToArray(arguments)))
        }
    },
    getFunctionProxy: function(a) {
        var b = this;
        return null == this.remoteFunctionCache[a] && (this.remoteFunctionCache[a] = function() {
            b.callASFunction(a, FABridge.argsToArray(arguments))
        }), this.remoteFunctionCache[a]
    },
    getFunctionID: function(a) {
        return void 0 == a.__bridge_id__ && (a.__bridge_id__ = this.makeID(this.nextLocalFuncID++), this.localFunctionCache[a.__bridge_id__] = a), a.__bridge_id__
    },
    serialize: function(a) {
        var b = {}, c = typeof a;
        if ("number" == c || "string" == c || "boolean" == c || null == c || void 0 == c) b = a;
        else if (a instanceof Array) {
            b = [];
            for (var d = 0; d < a.length; d++) b[d] = this.serialize(a[d])
        } else "function" == c ? (b.type = FABridge.TYPE_JSFUNCTION, b.value = this.getFunctionID(a)) : a instanceof ASProxy ? (b.type = FABridge.TYPE_ASINSTANCE, b.value = a.fb_instance_id) : (b.type = FABridge.TYPE_ANONYMOUS, b.value = a);
        return b
    },
    deserialize: function(a) {
        var b, c = typeof a;
        if ("number" == c || "string" == c || "boolean" == c || null == a || void 0 == a) b = this.handleError(a);
        else if (a instanceof Array) {
            b = [];
            for (var d = 0; d < a.length; d++) b[d] = this.deserialize(a[d])
        } else if ("object" == c) {
            for (var d = 0; d < a.newTypes.length; d++) this.addTypeDataToCache(a.newTypes[d]);
            for (var e in a.newRefs) this.createProxy(e, a.newRefs[e]);
            a.type == FABridge.TYPE_PRIMITIVE ? b = a.value : a.type == FABridge.TYPE_ASFUNCTION ? b = this.getFunctionProxy(a.value) : a.type == FABridge.TYPE_ASINSTANCE ? b = this.getProxy(a.value) : a.type == FABridge.TYPE_ANONYMOUS && (b = a.value)
        }
        return b
    },
    addRef: function(a) {
        this.target.incRef(a.fb_instance_id)
    },
    release: function(a) {
        this.target.releaseRef(a.fb_instance_id)
    },
    handleError: function(a) {
        if ("string" == typeof a && 0 == a.indexOf("__FLASHERROR")) {
            var b = a.split("||");
            throw FABridge.refCount > 0 && FABridge.refCount--, new Error(b[1])
        }
        return a
    }
}, ASProxy = function(a, b) {
    return this.bridge = a, this.typeName = b, this
}, ASProxy.prototype = {
    get: function(a) {
        return this.bridge.deserialize(this.bridge.getPropertyFromAS(this.fb_instance_id, a))
    },
    set: function(a, b) {
        this.bridge.setPropertyInAS(this.fb_instance_id, a, b)
    },
    call: function(a, b) {
        this.bridge.callASMethod(this.fb_instance_id, a, b)
    },
    addRef: function() {
        this.bridge.addRef(this)
    },
    release: function() {
        this.bridge.release(this)
    }
},
function() {
    var a;
    a = function() {
        function a() {}
        var b, c, d, e = null,
            f = !0,
            g = !0,
            h = {
                0: !0,
                1: !0,
                2: !0,
                3: !0,
                4: !0,
                5: !0,
                6: !0,
                7: !0,
                8: !0,
                9: !0,
                "#": !0,
                "*": !0
            };
        a.prototype.onReady = function() {}, a.prototype.onLogin = function() {}, a.prototype.onLoginFailed = function() {}, a.prototype.onLogout = function() {}, a.prototype.onCalling = function() {}, a.prototype.onCallRemoteRinging = function() {}, a.prototype.onCallAnswered = function() {}, a.prototype.onCallTerminated = function() {}, a.prototype.onIncomingCall = function() {}, a.prototype.onIncomingCallCanceled = function() {
            Plivo.logDevel("onIncomingCallCanceled stub")
        }, a.prototype.onCallFailed = function() {
            Plivo.logDevel("onCallFailed stub")
        }, a.prototype.onMediaPermission = function() {
            Plivo.logDevel("onMediaPermission")
        }, a.prototype.onRequirePermission = function() {}, a.prototype.onWebrtcNotSupported = function() {
            console.warn("your browser doesn't support webrtc")
        }, a.prototype.onFlashNotInstalled = function() {
            console.warn("your browser doesn't have flash installed")
        }, a.prototype.onMicAvailable = function() {}, a.prototype.onMicNotAvailable = function() {};
        var i = function(a) {
            return "undefined" == typeof a && (a = {}), "undefined" == typeof a.fallback_to_flash && (a.fallback_to_flash = !0), "undefined" == typeof a.debug && (a.debug = !0), "undefined" == typeof a.mask_page_on_perm && (a.mask_page_on_perm = !1), "undefined" == typeof a.perm_on_click && (a.perm_on_click = !1), "undefined" == typeof a.listen_mode && (a.listen_mode = !1), "undefined" == typeof a.flash_aec && (a.flash_aec = !0), "undefined" == typeof a.swf_path && (a.swf_path = ""), a
        };
        a.prototype.init = function(a) {
            d = BrowserDetect.browser, c = BrowserDetect.version, "MSIE" == d && p(), Plivo.config = e = i(a), Plivo.logDebug("Plivo SDK initialization"), Plivo.logDebug("- User Agent : " + navigator.userAgent), Plivo.logDebug("- Browser : " + d + "  " + c), Plivo.logDebug("- OS : " + BrowserDetect.OS), BrowserDetect.isWebrtcSupported() ? (Plivo.conn = new plivojs(e), Plivo.conn.init(e), b = "webrtc", j()) : e.fallback_to_flash ? (Plivo.conn = new plivo_flash(e), b = "flash") : Plivo.onWebrtcNotSupported()
        };
        var j = function() {
            var a = "https://s3.amazonaws.com/plivosdk/audio/us-ring.mp3";
            "Firefox" == d && (a = "https://s3.amazonaws.com/plivosdk/audio/us-ring.ogg"), o(), m(a), n(a)
        };
        a.prototype.setRingTone = function(a) {
            if (a === !1 || null === a) f = !1;
            else if ("string" == typeof a) {
                if (f = "user", "flash" == b) return Plivo.conn.setRingtone(a);
                var c = document.getElementById("plivo_ringtone");
                c.src = a
            } else f = !0;
            return !0
        }, a.prototype.setRingToneBack = function(a) {
            if (a === !1 || null === a) g = !1;
            else if ("string" == typeof a) {
                if (g = "user", "flash" == b) return Plivo.conn.setRingToneBack(a);
                var c = document.getElementById("plivo_ringbacktone");
                c.src = a
            } else g = !0;
            return !0
        }, a.prototype.setDtmfTone = function(a, c) {
            if (c === !1 || null === c) h[a] = !1;
            else if ("string" == typeof c) {
                if (h[a] = "user", "flash" == b) return Plivo.conn.setDtmfTone(c, a);
                var d = "dtmf" + a,
                    e = document.getElementById(d);
                e.src = c
            } else h[a] = !0;
            return !0
        }, a.prototype.logNull = function() {}, a.prototype.logDevel = function(a) {
            var b = new Date,
                c = b.getHours() + ":" + b.getMinutes() + ":" + b.getSeconds() + "." + b.getMilliseconds();
            console.log("PlivoWebSDK | " + c + " | " + a)
        }, a.prototype.logDebug = function(a) {
            e.debug === !0 && console.log("PlivoWebSDK:" + a)
        }, a.prototype.setDebug = function(a) {
            e.debug = a
        }, a.prototype.getDtmfToneFlag = function(a) {
            return h[a]
        }, a.prototype.maskThePage = function() {
            var a = document.createElement("div");
            a.id = "plivo_mask", document.body.insertBefore(a, document.body.firstChild), a.style.position = "fixed", a.style.top = "0", a.style.left = "0", a.style.width = "100%", a.style.height = "100%", a.style.background = "#000", a.style.opacity = "0.8", a.style.filter = "alpha(opacity=80)", a.style.zindex = "50"
        }, a.prototype.unmaskPage = function() {
            var a = document.getElementById("plivo_mask");
            a.parentNode.removeChild(a)
        }, a.prototype.checkExtraHeader = function(a, b) {
            return k(a) && l(b) ? !0 : !1
        };
        var k = function(a) {
            if ("X-Ph-" != a.substr(0, 5) && "X-PH-" != a.substr(0, 5)) return !1;
            var b = /^([a-z0-9A-Z]){1,19}$/;
            return b.test(a.substr(5)) === !1 ? (Plivo.logDebug("invalid key = " + a), !1) : !0
        }, l = function(a) {
                var b = /^([a-z0-9A-Z%]){1,48}$/;
                return b.test(a) === !1 ? (Plivo.logDebug("invalid value = " + a), !1) : !0
            }, m = function(a) {
                var b = document.createElement("audio");
                b.id = "plivo_ringbacktone", b.loop = "loop", b.src = a, document.body.appendChild(b)
            }, n = function(a) {
                var b = document.createElement("audio");
                b.id = "plivo_ringtone", b.loop = "loop", b.src = a, document.body.appendChild(b)
            }, o = function() {
                var a, b = "https://s3.amazonaws.com/plivosdk/audio/dtmf-";
                a = "Firefox" == d ? "ogg" : "mp3";
                for (var c = function(a, b, c) {
                    var d = "dtmf" + b,
                        e = a + b + "." + c,
                        f = document.createElement("audio");
                    f.id = d, f.src = e, document.body.appendChild(f)
                }, e = 0; 9 >= e; e++) c(b, e, a);
                c(b, "star", a), c(b, "pound", a)
            }, p = function() {
                var a = document.createElement("meta");
                a.setAttribute("http-equiv", "X-UA-Compatible"), a.content = "chrome1", document.getElementsByTagName("head")[0].appendChild(a)
            };
        return a
    }(), window.plivo_stub = a
}.call(this), window.Plivo = new plivo_stub,
function(a) {
    var b = function() {
        "use strict";
        var a = {};
        return Object.defineProperties ? Object.defineProperties(a, {
            version: {
                get: function() {
                    return "0.3.1-devel-tag-v0.18.8"
                }
            },
            name: {
                get: function() {
                    return "WebSDK"
                }
            }
        }) : (a.version = function() {
            return "0.3.1-devel-tag-v0.18.8"
        }, a.name = function() {
            return "WebSDK"
        }), a
    }();
    ! function(a) {
        var b, c, d = a.name + " | EVENT EMITTER | ";
        b = function() {}, b.prototype = {
            initEvents: function(a) {
                var b = a.length;
                for (this.events = {}, this.onceNotFired = [], this.maxListeners = 10, this.events.newListener = function(a) {
                    Plivo.logNull(d + "new listener added to event " + a)
                }; b--;) Plivo.logNull(d + "adding event " + a[b]), this.events[a[b]] = []
            },
            checkEvent: function(a) {
                return this.events[a] ? !0 : (Plivo.logNull(d + "no event named " + a), !1)
            },
            addListener: function(a, b) {
                this.checkEvent(a) && (this.events[a].length >= this.maxListeners && Plivo.logNull(d + "max listeners exceeded for event " + a), this.events[a].push(b), this.events.newListener.call(null, a))
            },
            on: function(a, b) {
                this.addListener(a, b)
            },
            once: function(a, b) {
                this.events[a].unshift(b), this.onceNotFired.push(a)
            },
            removeListener: function(a, b) {
                if (this.checkEvent(a))
                    for (var c = this.events[a], d = 0, e = c.length; e > d;) c[d] && c[d].toString() === b.toString() ? c.splice(d, 1) : d++
            },
            removeAllListener: function(a) {
                this.checkEvent(a) && (this.events[a] = [])
            },
            setMaxListeners: function(a) {
                Number(a) && (this.maxListeners = a)
            },
            listeners: function(a) {
                return this.events[a]
            },
            emit: function(b, c, e) {
                var f, g, h = 0;
                if (this.checkEvent(b)) {
                    Plivo.logNull(d + "emitting event " + b), f = this.events[b], g = f.length;
                    var i = new a.Event(b, c, e);
                    if (i)
                        for (h; g > h; h++) f[h].apply(null, [i]);
                    else
                        for (h; g > h; h++) f[h].call();
                    h = this.onceNotFired.indexOf(b), -1 !== h && (this.onceNotFired.splice(h, 1), this.events[b].shift())
                }
            },
            newListener: function(a) {
                this.events.newListener = a
            }
        }, c = function(a, b, c) {
            this.type = a, this.sender = b, this.data = c
        }, a.EventEmitter = b, a.Event = c
    }(b), b.C = {
        USER_AGENT: b.name + " " + b.version,
        SIP: "sip",
        INVALID_TARGET_URI: "sip:invalid@invalid",
        causes: {
            CONNECTION_ERROR: "Connection Error",
            REQUEST_TIMEOUT: "Request Timeout",
            SIP_FAILURE_CODE: "SIP Failure Code",
            INVALID_TARGET: "Invalid Target",
            INTERNAL_ERROR: "Internal Error",
            BUSY: "Busy",
            REJECTED: "Rejected",
            REDIRECTED: "Redirected",
            UNAVAILABLE: "Unavailable",
            NOT_FOUND: "Not Found",
            ADDRESS_INCOMPLETE: "Address Incomplete",
            INCOMPATIBLE_SDP: "Incompatible SDP",
            AUTHENTICATION_ERROR: "Authentication Error",
            DIALOG_ERROR: "Dialog Error",
            WEBRTC_NOT_SUPPORTED: "WebRTC Not Supported",
            WEBRTC_ERROR: "WebRTC Error",
            CANCELED: "Canceled",
            NO_ANSWER: "No Answer",
            EXPIRES: "Expires",
            NO_ACK: "No ACK",
            USER_DENIED_MEDIA_ACCESS: "User Denied Media Access",
            BAD_MEDIA_DESCRIPTION: "Bad Media Description",
            RTP_TIMEOUT: "RTP Timeout"
        },
        SIP_ERROR_CAUSES: {
            REDIRECTED: [300, 301, 302, 305, 380],
            BUSY: [486, 600],
            REJECTED: [403, 603],
            NOT_FOUND: [404, 604],
            UNAVAILABLE: [480, 410, 408, 430],
            ADDRESS_INCOMPLETE: [484],
            INCOMPATIBLE_SDP: [488, 606],
            AUTHENTICATION_ERROR: [401, 407]
        },
        ACK: "ACK",
        BYE: "BYE",
        CANCEL: "CANCEL",
        INFO: "INFO",
        INVITE: "INVITE",
        MESSAGE: "MESSAGE",
        NOTIFY: "NOTIFY",
        OPTIONS: "OPTIONS",
        REGISTER: "REGISTER",
        UPDATE: "UPDATE",
        SUBSCRIBE: "SUBSCRIBE",
        REASON_PHRASE: {
            100: "Trying",
            180: "Ringing",
            181: "Call Is Being Forwarded",
            182: "Queued",
            183: "Session Progress",
            199: "Early Dialog Terminated",
            200: "OK",
            202: "Accepted",
            204: "No Notification",
            300: "Multiple Choices",
            301: "Moved Permanently",
            302: "Moved Temporarily",
            305: "Use Proxy",
            380: "Alternative Service",
            400: "Bad Request",
            401: "Unauthorized",
            402: "Payment Required",
            403: "Forbidden",
            404: "Not Found",
            405: "Method Not Allowed",
            406: "Not Acceptable",
            407: "Proxy Authentication Required",
            408: "Request Timeout",
            410: "Gone",
            412: "Conditional Request Failed",
            413: "Request Entity Too Large",
            414: "Request-URI Too Long",
            415: "Unsupported Media Type",
            416: "Unsupported URI Scheme",
            417: "Unknown Resource-Priority",
            420: "Bad Extension",
            421: "Extension Required",
            422: "Session Interval Too Small",
            423: "Interval Too Brief",
            428: "Use Identity Header",
            429: "Provide Referrer Identity",
            430: "Flow Failed",
            433: "Anonymity Disallowed",
            436: "Bad Identity-Info",
            437: "Unsupported Certificate",
            438: "Invalid Identity Header",
            439: "First Hop Lacks Outbound Support",
            440: "Max-Breadth Exceeded",
            469: "Bad Info Package",
            470: "Consent Needed",
            478: "Unresolvable Destination",
            480: "Temporarily Unavailable",
            481: "Call/Transaction Does Not Exist",
            482: "Loop Detected",
            483: "Too Many Hops",
            484: "Address Incomplete",
            485: "Ambiguous",
            486: "Busy Here",
            487: "Request Terminated",
            488: "Not Acceptable Here",
            489: "Bad Event",
            491: "Request Pending",
            493: "Undecipherable",
            494: "Security Agreement Required",
            500: "Server Internal Error",
            501: "Not Implemented",
            502: "Bad Gateway",
            503: "Service Unavailable",
            504: "Server Time-out",
            505: "Version Not Supported",
            513: "Message Too Large",
            580: "Precondition Failure",
            600: "Busy Everywhere",
            603: "Decline",
            604: "Does Not Exist Anywhere",
            606: "Not Acceptable"
        }
    },
    function(b) {
        var c;
        c = {
            ConfigurationError: function() {
                var b = function(b, c) {
                    this.code = 1, this.name = "CONFIGURATION_ERROR", this.parameter = b, this.value = c, this.message = this.value ? "Invalid value " + a.JSON.stringify(this.value) + ' for parameter "' + this.parameter + '"' : "Missing parameter: " + this.parameter
                };
                return b.prototype = new Error, b
            }(),
            InvalidTargetError: function() {
                var a = function(a) {
                    this.code = 2, this.name = "INVALID_TARGET_ERROR", this.target = a, this.message = "Invalid target: " + this.target
                };
                return a.prototype = new Error, a
            }(),
            InvalidStateError: function() {
                var a = function(a) {
                    this.code = 3, this.name = "INVALID_STATE_ERROR", this.status = a
                };
                return a.prototype = new Error, a
            }()
        }, b.Exceptions = c
    }(b),
    function(a) {
        var b, c = 500,
            d = 4e3,
            e = 5e3;
        b = {
            T1: c,
            T2: d,
            T4: e,
            TIMER_B: 64 * c,
            TIMER_D: 0 * c,
            TIMER_F: 64 * c,
            TIMER_H: 64 * c,
            TIMER_I: 0 * c,
            TIMER_J: 0 * c,
            TIMER_K: 0 * e,
            TIMER_L: 64 * c,
            TIMER_M: 64 * c
        }, a.Timers = b
    }(b),
    function(b) {
        var c, d = b.name + " | TRANSPORT | ",
            e = {
                STATUS_READY: 0,
                STATUS_DISCONNECTED: 1,
                STATUS_ERROR: 2
            };
        c = function(a, b) {
            this.ua = a, this.ws = null, this.server = b, this.reconnection_attempts = 0, this.closed = !1, this.connected = !1, this.reconnectTimer = null, this.lastTransportError = {}, this.ua.transport = this, this.connect()
        }, c.prototype = {
            send: function(a) {
                var b = a.toString();
                return this.ws && this.ws.readyState === WebSocket.OPEN ? (this.ua.configuration.trace_sip === !0 && Plivo.logNull(d + "sending WebSocket message:\n\n" + b + "\n"), this.ws.send(b), !0) : (Plivo.logNull(d + "unable to send message, WebSocket is not open"), !1)
            },
            disconnect: function() {
                this.ws && (this.closed = !0, Plivo.logNull(d + "closing WebSocket " + this.server.ws_uri), this.ws.close())
            },
            connect: function() {
                var a = this;
                if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return Plivo.logNull(d + "WebSocket " + this.server.ws_uri + " is already connected"), !1;
                this.ws && this.ws.close(), Plivo.logNull(d + "connecting to WebSocket " + this.server.ws_uri);
                try {
                    this.ws = new WebSocket(this.server.ws_uri, "sip")
                } catch (b) {
                    Plivo.logNull(d + "error connecting to WebSocket " + this.server.ws_uri + ": " + b)
                }
                this.ws.binaryType = "arraybuffer", this.ws.onopen = function() {
                    a.onOpen()
                }, this.ws.onclose = function(b) {
                    a.onClose(b)
                }, this.ws.onmessage = function(b) {
                    a.onMessage(b)
                }, this.ws.onerror = function(b) {
                    a.onError(b)
                }
            },
            onOpen: function() {
                this.connected = !0, Plivo.logNull(d + "WebSocket " + this.server.ws_uri + " connected"), a.clearTimeout(this.reconnectTimer), this.closed = !1, this.ua.onTransportConnected(this)
            },
            onClose: function(a) {
                var b = this.connected;
                this.connected = !1, this.lastTransportError.code = a.code, this.lastTransportError.reason = a.reason, Plivo.logNull(d + "WebSocket disconnected (code: " + a.code + (a.reason ? "| reason: " + a.reason : "") + ")"), a.wasClean === !1 && Plivo.logNull(d + "WebSocket abrupt disconnection"), b === !0 ? (this.ua.onTransportClosed(this), this.closed ? this.ua.emit("disconnected", this.ua, {
                    transport: this,
                    code: this.lastTransportError.code,
                    reason: this.lastTransportError.reason
                }) : (this.reconnection_attempts = 0, this.reConnect())) : this.ua.onTransportError(this)
            },
            onMessage: function(a) {
                var c, e, f = a.data;
                if ("\r\n" === f) return void(this.ua.configuration.trace_sip === !0 && Plivo.logNull(d + "received WebSocket message with CRLF Keep Alive response"));
                if ("string" != typeof f) {
                    try {
                        f = String.fromCharCode.apply(null, new Uint8Array(f))
                    } catch (g) {
                        return void Plivo.logNull(d + "received WebSocket binary message failed to be converted into string, message discarded")
                    }
                    this.ua.configuration.trace_sip === !0 && Plivo.logNull(d + "received WebSocket binary message:\n\n" + f + "\n")
                } else this.ua.configuration.trace_sip === !0 && Plivo.logNull(d + "received WebSocket text message:\n\n" + f + "\n"); if (c = b.Parser.parseMessage(f), !(this.ua.status === b.UA.C.STATUS_USER_CLOSED && c instanceof b.IncomingRequest) && c && b.sanityCheck(c, this.ua, this))
                    if (c instanceof b.IncomingRequest) c.transport = this, this.ua.receiveRequest(c);
                    else if (c instanceof b.IncomingResponse) switch (c.method) {
                    case b.C.INVITE:
                        e = this.ua.transactions.ict[c.via_branch], e && e.receiveResponse(c);
                        break;
                    case b.C.ACK:
                        break;
                    default:
                        e = this.ua.transactions.nict[c.via_branch], e && e.receiveResponse(c)
                }
            },
            onError: function(a) {
                Plivo.logNull(d + "WebSocket connection error: " + a)
            },
            reConnect: function() {
                var b = this;
                this.reconnection_attempts += 1, this.reconnection_attempts > this.ua.configuration.ws_server_max_reconnection ? (Plivo.logNull(d + "maximum reconnection attempts for WebSocket " + this.server.ws_uri), this.ua.onTransportError(this)) : (Plivo.logNull(d + "trying to reconnect to WebSocket " + this.server.ws_uri + " (reconnection attempt " + this.reconnection_attempts + ")"), this.reconnectTimer = a.setTimeout(function() {
                    b.connect()
                }, 1e3 * this.ua.configuration.ws_server_reconnection_timeout))
            }
        }, c.C = e, b.Transport = c
    }(b),
    function(a) {
        function b(a, b) {
            var c = b,
                d = 0,
                e = 0;
            if (a.substring(c, c + 2).match(/(^\r\n)/)) return -2;
            for (; 0 === d;) {
                if (e = a.indexOf("\r\n", c), -1 === e) return e;
                !a.substring(e + 2, e + 4).match(/(^\r\n)/) && a.charAt(e + 2).match(/(^\s+)/) ? c = e + 2 : d = e
            }
            return d
        }

        function c(b, c, d, e) {
            var f, g, h, i, j = c.indexOf(":", d),
                k = c.substring(d, j).trim(),
                l = c.substring(j + 1, e).trim();
            switch (k.toLowerCase()) {
                case "via":
                case "v":
                    b.addHeader("via", l), 1 === b.countHeader("via") ? (i = b.parseHeader("Via"), i && (b.via = i, b.via_branch = i.branch)) : i = 0;
                    break;
                case "from":
                case "f":
                    b.setHeader("from", l), i = b.parseHeader("from"), i && (b.from = i, b.from_tag = i.getParam("tag"));
                    break;
                case "to":
                case "t":
                    b.setHeader("to", l), i = b.parseHeader("to"), i && (b.to = i, b.to_tag = i.getParam("tag"));
                    break;
                case "record-route":
                    for (i = a.Grammar.parse(l, "Record_Route"), -1 === i && (i = void 0), h = i.length, g = 0; h > g; g++) f = i[g], b.addHeader("record-route", l.substring(f.possition, f.offset)), b.headers["Record-Route"][b.countHeader("record-route") - 1].parsed = f.parsed;
                    break;
                case "call-id":
                case "i":
                    b.setHeader("call-id", l), i = b.parseHeader("call-id"), i && (b.call_id = l);
                    break;
                case "contact":
                case "m":
                    for (i = a.Grammar.parse(l, "Contact"), -1 === i && (i = void 0), h = i.length, g = 0; h > g; g++) f = i[g], b.addHeader("contact", l.substring(f.possition, f.offset)), b.headers.Contact[b.countHeader("contact") - 1].parsed = f.parsed;
                    break;
                case "content-length":
                case "l":
                    b.setHeader("content-length", l), i = b.parseHeader("content-length");
                    break;
                case "content-type":
                case "c":
                    b.setHeader("content-type", l), i = b.parseHeader("content-type");
                    break;
                case "cseq":
                    b.setHeader("cseq", l), i = b.parseHeader("cseq"), i && (b.cseq = i.value), b instanceof a.IncomingResponse && (b.method = i.method);
                    break;
                case "max-forwards":
                    b.setHeader("max-forwards", l), i = b.parseHeader("max-forwards");
                    break;
                case "www-authenticate":
                    b.setHeader("www-authenticate", l), i = b.parseHeader("www-authenticate");
                    break;
                case "proxy-authenticate":
                    b.setHeader("proxy-authenticate", l), i = b.parseHeader("proxy-authenticate");
                    break;
                default:
                    b.setHeader(k, l), i = 0
            }
            return void 0 === i ? !1 : !0
        }
        var d, e = a.name + " | PARSER | ";
        d = {}, d.parseMessage = function(d) {
            var f, g, h, i, j, k = 0,
                l = d.indexOf("\r\n");
            if (-1 === l) return void Plivo.logNull(e + "no CRLF found, not a SIP message, discarded");
            if (g = d.substring(0, l), j = a.Grammar.parse(g, "Request_Response"), -1 === j) return void Plivo.logNull(e + 'error parsing first line of SIP message: "' + g + '"');
            for (j.status_code ? (f = new a.IncomingResponse, f.status_code = j.status_code, f.reason_phrase = j.reason_phrase) : (f = new a.IncomingRequest, f.method = j.method, f.ruri = j.uri), f.data = d, k = l + 2;;) {
                if (l = b(d, k), -2 === l) {
                    i = k + 2;
                    break
                }
                if (-1 === l) return;
                if (j = c(f, d, k, l), !j) return;
                k = l + 2
            }
            return f.hasHeader("content-length") ? (h = f.getHeader("content-length"), f.body = d.substr(i, h)) : f.body = d.substring(i), f
        }, a.Parser = d
    }(b),
    function(a) {
        var b, c, d, e, f = a.name + " | SIP MESSAGE | ";
        b = function(b, c, d, e, f, g) {
            var h, i, j, k;
            return e = e || {}, b && c && d ? (this.headers = {}, this.method = b, this.ruri = c, this.body = g, this.extraHeaders = f || [], e.route_set ? this.setHeader("route", e.route_set) : d.configuration.use_preloaded_route && this.setHeader("route", d.transport.server.sip_uri), this.setHeader("via", ""), this.setHeader("max-forwards", a.UA.C.MAX_FORWARDS), h = e.to_display_name || 0 === e.to_display_name ? '"' + e.to_display_name + '" ' : "", h += "<" + (e.to_uri || c) + ">", h += e.to_tag ? ";tag=" + e.to_tag : "", this.to = new a.NameAddrHeader.parse(h), this.setHeader("to", h), i = e.from_display_name || 0 === e.from_display_name ? '"' + e.from_display_name + '" ' : d.configuration.display_name ? '"' + d.configuration.display_name + '" ' : "", i += "<" + (e.from_uri || d.configuration.uri) + ">;tag=", i += e.from_tag || a.Utils.newTag(), this.from = new a.NameAddrHeader.parse(i), this.setHeader("from", i), j = e.call_id || d.configuration.websdk_id + a.Utils.createRandomToken(15), this.call_id = j, this.setHeader("call-id", j), k = e.cseq || Math.floor(1e4 * Math.random()), this.cseq = k, void this.setHeader("cseq", k + " " + b)) : null
        }, b.prototype = {
            setHeader: function(b, c) {
                this.headers[a.Utils.headerize(b)] = c instanceof Array ? c : [c]
            },
            toString: function() {
                var b, c, d, e = "";
                e += this.method + " " + this.ruri + " SIP/2.0\r\n";
                for (b in this.headers)
                    for (c = this.headers[b].length, d = 0; c > d; d++) e += b + ": " + this.headers[b][d] + "\r\n";
                for (c = this.extraHeaders.length, d = 0; c > d; d++) e += this.extraHeaders[d] + "\r\n";
                return e += "Supported: " + a.UA.C.SUPPORTED + "\r\n", e += "User-Agent: " + a.C.USER_AGENT + "\r\n", this.body ? (c = a.Utils.str_utf8_length(this.body), e += "Content-Length: " + c + "\r\n\r\n", e += this.body) : e += "Content-Length: 0\r\n\r\n", e
            }
        }, c = function() {
            this.data = null, this.headers = null, this.method = null, this.via = null, this.via_branch = null, this.call_id = null, this.cseq = null, this.from = null, this.from_tag = null, this.to = null, this.to_tag = null, this.body = null
        }, c.prototype = {
            addHeader: function(b, c) {
                var d = {
                    raw: c
                };
                b = a.Utils.headerize(b), this.headers[b] ? this.headers[b].push(d) : this.headers[b] = [d]
            },
            countHeader: function(b) {
                var c = this.headers[a.Utils.headerize(b)];
                return c ? c.length : 0
            },
            getHeader: function(b, c) {
                var d = this.headers[a.Utils.headerize(b)];
                return c = c || 0, d ? d[c] ? d[c].raw : void 0 : void 0
            },
            getHeaderAll: function(b) {
                var c, d, e = this.headers[a.Utils.headerize(b)],
                    f = [];
                if (!e) return [];
                for (d = e.length, c = 0; d > c; c++) f.push(e[c].raw);
                return f
            },
            hasHeader: function(b) {
                return this.headers[a.Utils.headerize(b)] ? !0 : !1
            },
            parseHeader: function(b, c) {
                var d, e, g;
                return b = a.Utils.headerize(b), c = c || 0, this.headers[b] ? c >= this.headers[b].length ? void Plivo.logNull(f + 'not so many "' + b + '" headers present') : (d = this.headers[b][c], e = d.raw, d.parsed ? d.parsed : (g = a.Grammar.parse(e, b.replace(/-/g, "_")), -1 === g ? (this.headers[b].splice(c, 1), void Plivo.logNull(f + 'error parsing "' + b + '" header field with value "' + e + '"')) : (d.parsed = g, g))) : void Plivo.logNull(f + 'header "' + b + '" not present')
            },
            s: function(a, b) {
                return this.parseHeader(a, b)
            },
            setHeader: function(b, c) {
                var d = {
                    raw: c
                };
                this.headers[a.Utils.headerize(b)] = [d]
            },
            toString: function() {
                return this.data
            }
        }, d = function() {
            this.headers = {}, this.ruri = null, this.transport = null, this.server_transaction = null
        }, d.prototype = new c, d.prototype.reply = function(b, c, d, e, f, g) {
            var h, i, j, k, l, m = this.getHeader("To"),
                n = 0,
                o = 0;
            if (b = b || null, c = c || null, !b || 100 > b || b > 699) throw new TypeError("Invalid status_code: " + b);
            if (c && "string" != typeof c && !(c instanceof String)) throw new TypeError("Invalid reason_phrase: " + c);
            if (c = c || a.C.REASON_PHRASE[b] || "", d = d || [], l = "SIP/2.0 " + b + " " + c + "\r\n", this.method === a.C.INVITE && b > 100 && 200 >= b)
                for (h = this.countHeader("record-route"), n; h > n; n++) l += "Record-Route: " + this.getHeader("record-route", n) + "\r\n";
            for (i = this.countHeader("via"), o; i > o; o++) l += "Via: " + this.getHeader("via", o) + "\r\n";
            for (!this.to_tag && b > 100 ? m += ";tag=" + a.Utils.newTag() : this.to_tag && !this.s("to").hasParam("tag") && (m += ";tag=" + this.to_tag), l += "To: " + m + "\r\n", l += "From: " + this.getHeader("From") + "\r\n", l += "Call-ID: " + this.call_id + "\r\n", l += "CSeq: " + this.cseq + " " + this.method + "\r\n", j = d.length, k = 0; j > k; k++) l += d[k] + "\r\n";
            e ? (j = a.Utils.str_utf8_length(e), l += "Content-Type: application/sdp\r\n", l += "Content-Length: " + j + "\r\n\r\n", l += e) : l += "Content-Length: 0\r\n\r\n", this.server_transaction.receiveResponse(b, l, f, g)
        }, d.prototype.reply_sl = function(b, c) {
            var d, e, f = this.countHeader("via");
            if (b = b || null, c = c || null, !b || 100 > b || b > 699) throw new TypeError("Invalid status_code: " + b);
            if (c && "string" != typeof c && !(c instanceof String)) throw new TypeError("Invalid reason_phrase: " + c);
            c = c || a.C.REASON_PHRASE[b] || "", e = "SIP/2.0 " + b + " " + c + "\r\n";
            for (var g = 0; f > g; g++) e += "Via: " + this.getHeader("via", g) + "\r\n";
            d = this.getHeader("To"), !this.to_tag && b > 100 ? d += ";tag=" + a.Utils.newTag() : this.to_tag && !this.s("to").hasParam("tag") && (d += ";tag=" + this.to_tag), e += "To: " + d + "\r\n", e += "From: " + this.getHeader("From") + "\r\n", e += "Call-ID: " + this.call_id + "\r\n", e += "CSeq: " + this.cseq + " " + this.method + "\r\n", e += "Content-Length: 0\r\n\r\n", this.transport.send(e)
        }, e = function() {
            this.headers = {}, this.status_code = null, this.reason_phrase = null
        }, e.prototype = new c, a.OutgoingRequest = b, a.IncomingRequest = d, a.IncomingResponse = e
    }(b),
    function(b) {
        var c;
        c = function(a, c, d, e, f, g) {
            var h, i;
            if (!d) throw new TypeError('missing or invalid "host" parameter');
            a = a || b.C.SIP, this.parameters = {}, this.headers = {};
            for (h in f) this.setParam(h, f[h]);
            for (i in g) this.setHeader(i, g[i]);
            Object.defineProperties(this, {
                scheme: {
                    get: function() {
                        return a
                    },
                    set: function(b) {
                        a = b.toLowerCase()
                    }
                },
                user: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c = a
                    }
                },
                host: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a.toLowerCase()
                    }
                },
                port: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = 0 === a ? a : parseInt(a, 10) || null
                    }
                }
            })
        }, c.prototype = {
            setParam: function(a, b) {
                a && (this.parameters[a.toLowerCase()] = "undefined" == typeof b || null === b ? null : b.toString().toLowerCase())
            },
            getParam: function(a) {
                return a ? this.parameters[a.toLowerCase()] : void 0
            },
            hasParam: function(a) {
                return a ? this.parameters.hasOwnProperty(a.toLowerCase()) && !0 || !1 : void 0
            },
            deleteParam: function(a) {
                var b;
                return a = a.toLowerCase(), this.parameters.hasOwnProperty(a) ? (b = this.parameters[a], delete this.parameters[a], b) : void 0
            },
            clearParams: function() {
                this.parameters = {}
            },
            setHeader: function(a, c) {
                this.headers[b.Utils.headerize(a)] = c instanceof Array ? c : [c]
            },
            getHeader: function(a) {
                return a ? this.headers[b.Utils.headerize(a)] : void 0
            },
            hasHeader: function(a) {
                return a ? this.headers.hasOwnProperty(b.Utils.headerize(a)) && !0 || !1 : void 0
            },
            deleteHeader: function(a) {
                var c;
                return a = b.Utils.headerize(a), this.headers.hasOwnProperty(a) ? (c = this.headers[a], delete this.headers[a], c) : void 0
            },
            clearHeaders: function() {
                this.headers = {}
            },
            clone: function() {
                return new c(this.scheme, this.user, this.host, this.port, a.JSON.parse(a.JSON.stringify(this.parameters)), a.JSON.parse(a.JSON.stringify(this.headers)))
            },
            toString: function() {
                var a, c, d, e, f = [];
                e = this.scheme + ":", this.user && (e += b.Utils.escapeUser(this.user) + "@"), e += this.host, (this.port || 0 === this.port) && (e += ":" + this.port);
                for (c in this.parameters) e += ";" + c, null !== this.parameters[c] && (e += "=" + this.parameters[c]);
                for (a in this.headers)
                    for (d in this.headers[a]) f.push(a + "=" + this.headers[a][d]);
                return f.length > 0 && (e += "?" + f.join("&")), e
            },
            toAor: function(a) {
                var c;
                return c = this.scheme + ":", this.user && (c += b.Utils.escapeUser(this.user) + "@"), c += this.host, a && (this.port || 0 === this.port) && (c += ":" + this.port), c
            }
        }, c.parse = function(a) {
            return a = b.Grammar.parse(a, "SIP_URI"), -1 !== a ? a : void 0
        }, b.URI = c
    }(b),
    function(b) {
        var c;
        c = function(a, c, d) {
            var e;
            if (!(a && a instanceof b.URI)) throw new TypeError('missing or invalid "uri" parameter');
            this.uri = a, this.parameters = {};
            for (e in d) this.setParam(e, d[e]);
            Object.defineProperties(this, {
                display_name: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c = 0 === a ? "0" : a
                    }
                }
            })
        }, c.prototype = {
            setParam: function(a, b) {
                a && (this.parameters[a.toLowerCase()] = "undefined" == typeof b || null === b ? null : b.toString())
            },
            getParam: function(a) {
                return a ? this.parameters[a.toLowerCase()] : void 0
            },
            hasParam: function(a) {
                return a ? this.parameters.hasOwnProperty(a.toLowerCase()) && !0 || !1 : void 0
            },
            deleteParam: function(a) {
                var b;
                return a = a.toLowerCase(), this.parameters.hasOwnProperty(a) ? (b = this.parameters[a], delete this.parameters[a], b) : void 0
            },
            clearParams: function() {
                this.parameters = {}
            },
            clone: function() {
                return new c(this.uri.clone(), this.display_name, a.JSON.parse(a.JSON.stringify(this.parameters)))
            },
            toString: function() {
                var a, b;
                a = this.display_name || 0 === this.display_name ? '"' + this.display_name + '" ' : "", a += "<" + this.uri.toString() + ">";
                for (b in this.parameters) a += ";" + b, null !== this.parameters[b] && (a += "=" + this.parameters[b]);
                return a
            }
        }, c.parse = function(a) {
            return a = b.Grammar.parse(a, "Name_Addr_Header"), -1 !== a ? a : void 0
        }, b.NameAddrHeader = c
    }(b),
    function(b) {
        var c, d = b.name + " | TRANSACTION | ",
            e = {
                STATUS_TRYING: 1,
                STATUS_PROCEEDING: 2,
                STATUS_CALLING: 3,
                STATUS_ACCEPTED: 4,
                STATUS_COMPLETED: 5,
                STATUS_TERMINATED: 6,
                STATUS_CONFIRMED: 7
            };
        c = {};
        var f = function() {
            this.init = function(a, b, c) {
                var d;
                this.transport = c, this.id = "z9hG4bK" + Math.floor(1e7 * Math.random()), this.request_sender = a, this.request = b, d = "SIP/2.0/" + (a.ua.configuration.hack_via_tcp ? "TCP" : c.server.scheme), d += " " + a.ua.configuration.via_host + ";branch=" + this.id, this.request.setHeader("via", d)
            }
        }, g = function() {
                this.send = function() {
                    var c = this;
                    this.state = e.STATUS_TRYING, this.F = a.setTimeout(function() {
                        c.timer_F()
                    }, b.Timers.TIMER_F), this.transport.send(this.request) || this.onTransportError()
                }, this.onTransportError = function() {
                    Plivo.logNull(d + "transport error occurred, deleting non-INVITE client transaction " + this.id), a.clearTimeout(this.F), a.clearTimeout(this.K), delete this.request_sender.ua.transactions.nict[this.id], this.request_sender.onTransportError()
                }, this.timer_F = function() {
                    Plivo.logNull(d + "Timer F expired for non-INVITE client transaction " + this.id), this.state = e.STATUS_TERMINATED, this.request_sender.onRequestTimeout(), delete this.request_sender.ua.transactions.nict[this.id]
                }, this.timer_K = function() {
                    this.state = e.STATUS_TERMINATED, delete this.request_sender.ua.transactions.nict[this.id]
                }, this.receiveResponse = function(c) {
                    var d = this,
                        f = c.status_code;
                    if (200 > f) switch (this.state) {
                        case e.STATUS_TRYING:
                        case e.STATUS_PROCEEDING:
                            this.state = e.STATUS_PROCEEDING, this.request_sender.receiveResponse(c)
                    } else switch (this.state) {
                        case e.STATUS_TRYING:
                        case e.STATUS_PROCEEDING:
                            this.state = e.STATUS_COMPLETED, a.clearTimeout(this.F), 408 === f ? this.request_sender.onRequestTimeout() : this.request_sender.receiveResponse(c), this.K = a.setTimeout(function() {
                                d.timer_K()
                            }, b.Timers.TIMER_K);
                            break;
                        case e.STATUS_COMPLETED:
                    }
                }
            };
        g.prototype = new f;
        var h = function() {
            this.send = function() {
                var c = this;
                this.state = e.STATUS_CALLING, this.B = a.setTimeout(function() {
                    c.timer_B()
                }, b.Timers.TIMER_B), this.transport.send(this.request) || this.onTransportError()
            }, this.onTransportError = function() {
                Plivo.logNull(d + "transport error occurred, deleting INVITE client transaction " + this.id), a.clearTimeout(this.B), a.clearTimeout(this.D), a.clearTimeout(this.M), delete this.request_sender.ua.transactions.ict[this.id], this.request_sender.onTransportError()
            }, this.timer_M = function() {
                Plivo.logNull(d + "Timer M expired for INVITE client transaction " + this.id), this.state === e.STATUS_ACCEPTED && (this.state = e.STATUS_TERMINATED, a.clearTimeout(this.B), delete this.request_sender.ua.transactions.ict[this.id])
            }, this.timer_B = function() {
                Plivo.logNull(d + "Timer B expired for INVITE client transaction " + this.id), this.state === e.STATUS_CALLING && (Plivo.logNull("current status is calling..."), this.state = e.STATUS_TERMINATED, this.request_sender.onRequestTimeout(), delete this.request_sender.ua.transactions.ict[this.id])
            }, this.timer_D = function() {
                Plivo.logNull(d + "Timer D expired for INVITE client transaction " + this.id), this.state = e.STATUS_TERMINATED, a.clearTimeout(this.B), delete this.request_sender.ua.transactions.ict[this.id]
            }, this.sendACK = function(c) {
                var d = this;
                this.ack = "ACK " + this.request.ruri + " SIP/2.0\r\n", this.ack += "Via: " + this.request.headers.Via.toString() + "\r\n", this.request.headers.Route && (this.ack += "Route: " + this.request.headers.Route.toString() + "\r\n"), this.ack += "To: " + c.getHeader("to") + "\r\n", this.ack += "From: " + this.request.headers.From.toString() + "\r\n", this.ack += "Call-ID: " + this.request.headers["Call-ID"].toString() + "\r\n", this.ack += "CSeq: " + this.request.headers.CSeq.toString().split(" ")[0], this.ack += " ACK\r\n\r\n", this.D = a.setTimeout(function() {
                    d.timer_D()
                }, b.Timers.TIMER_D), this.transport.send(this.ack)
            }, this.cancel_request = function(a, c) {
                var d = a.request;
                this.cancel = b.C.CANCEL + " " + d.ruri + " SIP/2.0\r\n", this.cancel += "Via: " + d.headers.Via.toString() + "\r\n", this.request.headers.Route && (this.cancel += "Route: " + d.headers.Route.toString() + "\r\n"), this.cancel += "To: " + d.headers.To.toString() + "\r\n", this.cancel += "From: " + d.headers.From.toString() + "\r\n", this.cancel += "Call-ID: " + d.headers["Call-ID"].toString() + "\r\n", this.cancel += "CSeq: " + d.headers.CSeq.toString().split(" ")[0] + " CANCEL\r\n", c && (this.cancel += "Reason: " + c + "\r\n"), this.cancel += "Content-Length: 0\r\n\r\n", this.state === e.STATUS_PROCEEDING && this.transport.send(this.cancel)
            }, this.receiveResponse = function(c) {
                var d = this,
                    f = c.status_code;
                if (f >= 100 && 199 >= f) switch (this.state) {
                    case e.STATUS_CALLING:
                        this.state = e.STATUS_PROCEEDING, this.request_sender.receiveResponse(c), this.cancel && this.transport.send(this.cancel);
                        break;
                    case e.STATUS_PROCEEDING:
                        this.request_sender.receiveResponse(c)
                } else if (f >= 200 && 299 >= f) switch (this.state) {
                    case e.STATUS_CALLING:
                    case e.STATUS_PROCEEDING:
                        this.state = e.STATUS_ACCEPTED, this.M = a.setTimeout(function() {
                            d.timer_M()
                        }, b.Timers.TIMER_M), this.request_sender.receiveResponse(c);
                        break;
                    case e.STATUS_ACCEPTED:
                        this.request_sender.receiveResponse(c)
                } else if (f >= 300 && 699 >= f) switch (this.state) {
                    case e.STATUS_CALLING:
                    case e.STATUS_PROCEEDING:
                        this.state = e.STATUS_COMPLETED, this.sendACK(c), this.request_sender.receiveResponse(c);
                        break;
                    case e.STATUS_COMPLETED:
                        this.sendACK(c)
                }
            }
        };
        h.prototype = new f;
        var i = function() {
            this.init = function(a, b) {
                this.id = a.via_branch, this.request = a, this.transport = a.transport, this.ua = b, this.last_response = "", a.server_transaction = this
            }
        }, j = function() {
                this.timer_J = function() {
                    Plivo.logNull(d + "Timer J expired for non-INVITE server transaction " + this.id), this.state = e.STATUS_TERMINATED, delete this.ua.transactions.nist[this.id]
                }, this.onTransportError = function() {
                    this.transportError || (this.transportError = !0, Plivo.logNull(d + "transport error occurred, deleting non-INVITE server transaction " + this.id), a.clearTimeout(this.J), delete this.ua.transactions.nist[this.id])
                }, this.receiveResponse = function(c, d, f, g) {
                    var h = this;
                    if (100 === c) switch (this.state) {
                        case e.STATUS_TRYING:
                            this.state = e.STATUS_PROCEEDING, this.transport.send(d) || this.onTransportError();
                            break;
                        case e.STATUS_PROCEEDING:
                            this.last_response = d, this.transport.send(d) ? f && f() : (this.onTransportError(), g && g())
                    } else if (c >= 200 && 699 >= c) switch (this.state) {
                        case e.STATUS_TRYING:
                        case e.STATUS_PROCEEDING:
                            this.state = e.STATUS_COMPLETED, this.last_response = d, this.J = a.setTimeout(function() {
                                h.timer_J()
                            }, b.Timers.TIMER_J), this.transport.send(d) ? f && f() : (this.onTransportError(), g && g());
                            break;
                        case e.STATUS_COMPLETED:
                    }
                }
            };
        j.prototype = new i;
        var k = function() {
            this.timer_H = function() {
                Plivo.logNull(d + "Timer H expired for INVITE server transaction " + this.id), this.state === e.STATUS_COMPLETED && (Plivo.logNull(d + "transactions", "ACK for INVITE server transaction was never received, call will be terminated"), this.state = e.STATUS_TERMINATED), delete this.ua.transactions.ist[this.id]
            }, this.timer_I = function() {
                this.state = e.STATUS_TERMINATED, delete this.ua.transactions.ist[this.id]
            }, this.timer_L = function() {
                Plivo.logNull(d + "Timer L expired for INVITE server transaction " + this.id), this.state === e.STATUS_ACCEPTED && (this.state = e.STATUS_TERMINATED, delete this.ua.transactions.ist[this.id])
            }, this.onTransportError = function() {
                this.transportError || (this.transportError = !0, Plivo.logNull(d + "transport error occurred, deleting INVITE server transaction " + this.id), a.clearTimeout(this.reliableProvisionalTimer), a.clearTimeout(this.L), a.clearTimeout(this.H), a.clearTimeout(this.I), delete this.ua.transactions.ist[this.id])
            }, this.timer_reliableProvisional = function(c) {
                var d = this,
                    e = this.last_response,
                    f = b.Timers.T1 * Math.pow(2, c + 1);
                c > 8 ? a.clearTimeout(this.reliableProvisionalTimer) : (c += 1, this.transport.send(e) || this.onTransportError(), this.reliableProvisionalTimer = a.setTimeout(function() {
                    d.timer_reliableProvisional(c)
                }, f))
            }, this.receiveResponse = function(c, d, f, g) {
                var h = this;
                if (c >= 100 && 199 >= c) switch (this.state) {
                    case e.STATUS_PROCEEDING:
                        this.transport.send(d) || this.onTransportError(), this.last_response = d
                }
                if (c > 100 && 199 >= c) this.reliableProvisionalTimer || (this.reliableProvisionalTimer = a.setTimeout(function() {
                    h.timer_reliableProvisional(1)
                }, b.Timers.T1));
                else if (c >= 200 && 299 >= c) switch (this.state) {
                    case e.STATUS_PROCEEDING:
                        this.state = e.STATUS_ACCEPTED, this.last_response = d, this.L = a.setTimeout(function() {
                            h.timer_L()
                        }, b.Timers.TIMER_L), a.clearTimeout(this.reliableProvisionalTimer);
                    case e.STATUS_ACCEPTED:
                        this.transport.send(d) ? f && f() : (this.onTransportError(), g && g())
                } else if (c >= 300 && 699 >= c) switch (this.state) {
                    case e.STATUS_PROCEEDING:
                        a.clearTimeout(this.reliableProvisionalTimer), this.transport.send(d) ? (this.state = e.STATUS_COMPLETED, this.H = a.setTimeout(function() {
                            h.timer_H()
                        }, b.Timers.TIMER_H), f && f()) : (this.onTransportError(), g && g())
                }
            }
        };
        k.prototype = new i, c.NonInviteClientTransaction = function(a, b, c) {
            this.init(a, b, c), this.request_sender.ua.transactions.nict[this.id] = this
        }, c.NonInviteClientTransaction.prototype = new g, c.InviteClientTransaction = function(a, b, c) {
            var d = this;
            this.init(a, b, c), this.request_sender.ua.transactions.ict[this.id] = this, this.request.cancel = function(a) {
                d.cancel_request(d, a)
            }
        }, c.InviteClientTransaction.prototype = new h, c.AckClientTransaction = function(a, b, c) {
            this.init(a, b, c), this.send = function() {
                this.transport.send(b)
            }
        }, c.AckClientTransaction.prototype = new g, c.NonInviteServerTransaction = function(a, b) {
            this.init(a, b), this.state = e.STATUS_TRYING, b.transactions.nist[this.id] = this
        }, c.NonInviteServerTransaction.prototype = new j, c.InviteServerTransaction = function(a, b) {
            this.init(a, b), this.state = e.STATUS_PROCEEDING, b.transactions.ist[this.id] = this, this.reliableProvisionalTimer = null, a.reply(100)
        }, c.InviteServerTransaction.prototype = new k, c.checkTransaction = function(c, d) {
            var f;
            switch (d.method) {
                case b.C.INVITE:
                    if (f = c.transactions.ist[d.via_branch]) {
                        switch (f.state) {
                            case e.STATUS_PROCEEDING:
                                f.transport.send(f.last_response);
                                break;
                            case e.STATUS_ACCEPTED:
                        }
                        return !0
                    }
                    break;
                case b.C.ACK:
                    if (f = c.transactions.ist[d.via_branch], !f) return !1;
                    if (f.state === e.STATUS_ACCEPTED) return !1;
                    if (f.state === e.STATUS_COMPLETED) return f.state = e.STATUS_CONFIRMED, f.I = a.setTimeout(function() {
                        f.timer_I()
                    }, b.Timers.TIMER_I), !0;
                    break;
                case b.C.CANCEL:
                    return f = c.transactions.ist[d.via_branch], f ? f.state === e.STATUS_PROCEEDING ? !1 : !0 : (d.reply_sl(481), !0);
                default:
                    if (f = c.transactions.nist[d.via_branch]) {
                        switch (f.state) {
                            case e.STATUS_TRYING:
                                break;
                            case e.STATUS_PROCEEDING:
                            case e.STATUS_COMPLETED:
                                f.transport.send(f.last_response)
                        }
                        return !0
                    }
            }
        }, c.C = e, b.Transactions = c
    }(b),
    function(a) {
        var b, c = a.name + " | DIALOG | ",
            d = {
                STATUS_EARLY: 1,
                STATUS_CONFIRMED: 2
            };
        b = function(b, e, f, g) {
            var h;
            return e.hasHeader("contact") ? (g = e instanceof a.IncomingResponse ? e.status_code < 200 ? d.STATUS_EARLY : d.STATUS_CONFIRMED : g || d.STATUS_CONFIRMED, h = e.parseHeader("contact"), "UAS" === f ? (this.id = {
                call_id: e.call_id,
                local_tag: e.to_tag,
                remote_tag: e.from_tag,
                toString: function() {
                    return this.call_id + this.local_tag + this.remote_tag
                }
            }, this.state = g, this.remote_seqnum = e.cseq, this.local_uri = e.parseHeader("to").uri, this.remote_uri = e.parseHeader("from").uri, this.remote_target = h.uri, this.route_set = e.getHeaderAll("record-route")) : "UAC" === f && (this.id = {
                call_id: e.call_id,
                local_tag: e.from_tag,
                remote_tag: e.to_tag,
                toString: function() {
                    return this.call_id + this.local_tag + this.remote_tag
                }
            }, this.state = g, this.local_seqnum = e.cseq, this.local_uri = e.parseHeader("from").uri, this.remote_uri = e.parseHeader("to").uri, this.remote_target = h.uri, this.route_set = e.getHeaderAll("record-route").reverse()), this.session = b, b.ua.dialogs[this.id.toString()] = this, void Plivo.logNull(c + "new " + f + " dialog created with status " + (this.state === d.STATUS_EARLY ? "EARLY" : "CONFIRMED"))) : (Plivo.logNull(c + "unable to create a Dialog without Contact header field"), !1)
        }, b.prototype = {
            update: function(a, b) {
                this.state = d.STATUS_CONFIRMED, Plivo.logNull(c + "dialog " + this.id.toString() + "  changed to CONFIRMED state"), "UAC" === b && (this.route_set = a.getHeaderAll("record-route").reverse())
            },
            terminate: function() {
                Plivo.logNull(c + "dialog " + this.id.toString() + " deleted"), delete this.session.ua.dialogs[this.id.toString()]
            },
            createRequest: function(b, c) {
                var d, e;
                return c = c || [], this.local_seqnum || (this.local_seqnum = Math.floor(1e4 * Math.random())), d = b === a.C.CANCEL || b === a.C.ACK ? this.local_seqnum : this.local_seqnum += 1, e = new a.OutgoingRequest(b, this.remote_target, this.session.ua, {
                    cseq: d,
                    call_id: this.id.call_id,
                    from_uri: this.local_uri,
                    from_tag: this.id.local_tag,
                    to_uri: this.remote_uri,
                    to_tag: this.id.remote_tag,
                    route_set: this.route_set
                }, c), e.dialog = this, e
            },
            checkInDialogRequest: function(b) {
                if (this.remote_seqnum) {
                    if (b.method !== a.C.INVITE && b.cseq < this.remote_seqnum) return b.method !== a.C.ACK && b.reply(500), !1;
                    b.cseq > this.remote_seqnum && (this.remote_seqnum = b.cseq)
                } else this.remote_seqnum = b.cseq;
                switch (b.method) {
                    case a.C.INVITE:
                        if (b.cseq < this.remote_seqnum) {
                            if (this.state === d.STATUS_EARLY) {
                                var c = (10 * Math.random() | 0) + 1;
                                b.reply(500, null, ["Retry-After:" + c])
                            } else b.reply(500);
                            return !1
                        }
                        if (this.state === d.STATUS_EARLY) return b.reply(491), !1;
                        b.hasHeader("contact") && (this.remote_target = b.parseHeader("contact").uri);
                        break;
                    case a.C.NOTIFY:
                        b.hasHeader("contact") && (this.remote_target = b.parseHeader("contact").uri)
                }
                return !0
            },
            receiveRequest: function(a) {
                this.checkInDialogRequest(a) && this.session.receiveRequest(a)
            }
        }, b.C = d, a.Dialog = b
    }(b),
    function(a) {
        var b, c = a.name + " | REQUEST SENDER | ";
        b = function(b, c) {
            this.ua = c, this.applicant = b, this.method = b.request.method, this.request = b.request, this.credentials = null, this.challenged = !1, this.staled = !1, c.status !== a.UA.C.STATUS_USER_CLOSED || this.method === a.C.BYE && this.method === a.C.ACK || this.onTransportError()
        }, b.prototype = {
            send: function() {
                switch (this.method) {
                    case "INVITE":
                        this.clientTransaction = new a.Transactions.InviteClientTransaction(this, this.request, this.ua.transport);
                        break;
                    case "ACK":
                        this.clientTransaction = new a.Transactions.AckClientTransaction(this, this.request, this.ua.transport);
                        break;
                    default:
                        this.clientTransaction = new a.Transactions.NonInviteClientTransaction(this, this.request, this.ua.transport)
                }
                this.clientTransaction.send()
            },
            onRequestTimeout: function() {
                this.applicant.onRequestTimeout()
            },
            onTransportError: function() {
                this.applicant.onTransportError()
            },
            receiveResponse: function(b) {
                var d, e, f, g = b.status_code;
                if (401 !== g && 407 !== g || null === this.ua.configuration.password) this.applicant.receiveResponse(b);
                else {
                    if (401 === b.status_code ? (e = b.parseHeader("www-authenticate"), f = "authorization") : (e = b.parseHeader("proxy-authenticate"), f = "proxy-authorization"), !e) return Plivo.logNull(c + b.status_code + " with wrong or missing challenge, cannot authenticate"), void this.applicant.receiveResponse(b);
                    if (!this.challenged || !this.staled && e.stale === !0) {
                        if (this.credentials || (this.credentials = new a.DigestAuthentication(this.ua)), !this.credentials.authenticate(this.request, e)) return void this.applicant.receiveResponse(b);
                        this.challenged = !0, e.stale && (this.staled = !0), b.method === a.C.REGISTER ? d = this.applicant.cseq += 1 : this.request.dialog ? d = this.request.dialog.local_seqnum += 1 : (d = this.request.cseq + 1, this.request.cseq = d), this.request.setHeader("cseq", d + " " + this.method), this.request.setHeader(f, this.credentials.toString()), this.send()
                    } else this.applicant.receiveResponse(b)
                }
            }
        }, a.RequestSender = b
    }(b),
    function(a) {
        var b;
        b = function(a) {
            this.applicant = a, this.request = a.request
        }, b.prototype = {
            send: function() {
                var b = new a.RequestSender(this, this.applicant.session.ua);
                b.send()
            },
            onRequestTimeout: function() {
                this.applicant.session.onRequestTimeout(), this.applicant.onRequestTimeout()
            },
            onTransportError: function() {
                this.applicant.session.onTransportError(), this.applicant.onTransportError()
            },
            receiveResponse: function(b) {
                (408 === b.status_code || 481 === b.status_code) && this.applicant.session.ended("remote", b, a.C.causes.DIALOG_ERROR), this.applicant.receiveResponse(b)
            }
        }, a.InDialogRequestSender = b
    }(b),
    function(b) {
        var c, d = b.name + " | REGISTRATOR | ";
        c = function(a, c) {
            var d = 1;
            this.ua = a, this.transport = c, this.registrar = a.configuration.registrar_server, this.expires = a.configuration.register_expires, this.min_expires = a.configuration.register_min_expires, this.call_id = b.Utils.createRandomToken(22), this.cseq = 80, this.to_uri = a.configuration.uri, this.registrationTimer = null, this.registered = this.registered_before = !1, this.ua.registrator = this, this.contact = this.ua.contact.toString(), d && (this.contact += ";reg-id=" + d, this.contact += ';+sip.instance="<urn:uuid:' + this.ua.configuration.instance_id + '>"')
        }, c.prototype = {
            register: function(c) {
                var e, f, g, h = this;
                c = c || {}, g = c.extraHeaders || [], g.push("Contact: " + this.contact + ";expires=" + this.expires), g.push("Allow: " + b.Utils.getAllowedMethods(this.ua)), this.request = new b.OutgoingRequest(b.C.REGISTER, this.registrar, this.ua, {
                    to_uri: this.to_uri,
                    call_id: this.call_id,
                    cseq: this.cseq += 1
                }, g), e = new b.RequestSender(this, this.ua), this.receiveResponse = function(c) {
                    var e, g, i, j = c.countHeader("contact");
                    if (c.cseq === this.cseq) switch (!0) {
                        case /^1[0-9]{2}$/.test(c.status_code):
                            break;
                        case /^2[0-9]{2}$/.test(c.status_code):
                            if (c.hasHeader("expires") && (g = c.getHeader("expires")), !j) {
                                Plivo.logNull(d + "no Contact header in response to REGISTER, response ignored");
                                break
                            }
                            for (; j--;) {
                                if (e = c.parseHeader("contact", j), e.uri.user === this.ua.contact.uri.user) {
                                    g = e.getParam("expires");
                                    break
                                }
                                e = null
                            }
                            if (!e) {
                                Plivo.logNull(d + "no Contact header pointing to us, response ignored");
                                break
                            }
                            g || (g = this.expires), this.registrationTimer = a.setTimeout(function() {
                                h.register()
                            }, 1e3 * g - 3e3), e.hasParam("temp-gruu") && (this.ua.contact.temp_gruu = e.getParam("temp-gruu").replace(/"/g, "")), e.hasParam("pub-gruu") && (this.ua.contact.pub_gruu = e.getParam("pub-gruu").replace(/"/g, "")), this.registered = !0, this.ua.emit("registered", this.ua, {
                                response: c
                            });
                            break;
                        case /^423$/.test(c.status_code):
                            c.hasHeader("min-expires") ? (i = c.getHeader("min-expires"), g = i - this.expires, this.registrationTimer = a.setTimeout(function() {
                                h.register()
                            }, 1e3 * this.expires)) : (Plivo.logNull(d + "423 response received for REGISTER without Min-Expires"), this.registrationFailure(c, b.C.causes.SIP_FAILURE_CODE));
                            break;
                        default:
                            f = b.Utils.sipErrorCause(c.status_code), this.registrationFailure(c, f)
                    }
                }, this.onRequestTimeout = function() {
                    this.registrationFailure(null, b.C.causes.REQUEST_TIMEOUT)
                }, this.onTransportError = function() {
                    this.registrationFailure(null, b.C.causes.CONNECTION_ERROR)
                }, e.send()
            },
            unregister: function(c) {
                var e;
                if (!this.registered) return void Plivo.logNull(d + "already unregistered");
                c = c || {}, e = c.extraHeaders || [], this.registered = !1, a.clearTimeout(this.registrationTimer), c.all ? (e.push("Contact: *"), e.push("Expires: 0"), this.request = new b.OutgoingRequest(b.C.REGISTER, this.registrar, this.ua, {
                    to_uri: this.to_uri,
                    call_id: this.call_id,
                    cseq: this.cseq += 1
                }, e)) : (e.push("Contact: " + this.contact + ";expires=0"), this.request = new b.OutgoingRequest(b.C.REGISTER, this.registrar, this.ua, {
                    to_uri: this.to_uri,
                    call_id: this.call_id,
                    cseq: this.cseq += 1
                }, e));
                var f = new b.RequestSender(this, this.ua);
                this.receiveResponse = function(a) {
                    var c;
                    switch (!0) {
                        case /^1[0-9]{2}$/.test(a.status_code):
                            break;
                        case /^2[0-9]{2}$/.test(a.status_code):
                            this.unregistered(a);
                            break;
                        default:
                            c = b.Utils.sipErrorCause(a.status_code), this.unregistered(a, c)
                    }
                }, this.onRequestTimeout = function() {
                    this.unregistered(null, b.C.causes.REQUEST_TIMEOUT)
                }, this.onTransportError = function() {
                    this.unregistered(null, b.C.causes.CONNECTION_ERROR)
                }, f.send()
            },
            registrationFailure: function(a, b) {
                this.ua.emit("registrationFailed", this.ua, {
                    response: a || null,
                    cause: b
                }), this.registered && (this.registered = !1, this.ua.emit("unregistered", this.ua, {
                    response: a || null,
                    cause: b
                }))
            },
            unregistered: function(a, b) {
                this.registered = !1, this.ua.emit("unregistered", this.ua, {
                    response: a || null,
                    cause: b || null
                })
            },
            onTransportClosed: function() {
                this.registered_before = this.registered, a.clearTimeout(this.registrationTimer), this.registered && (this.registered = !1, this.ua.emit("unregistered", this.ua))
            },
            onTransportConnected: function() {
                this.register()
            },
            close: function() {
                this.registered_before = this.registered, this.unregister()
            }
        }, b.Registrator = c
    }(b),
    function(b) {
        var c, d = function(b) {
                var c = function(a, c) {
                    this.applicant = a, this.request = c || a.request, this.session = a instanceof b.RTCSession ? a : a.session, this.reattempt = !1, this.reatemptTimer = null, this.request_sender = new b.InDialogRequestSender(this)
                };
                return c.prototype = {
                    receiveResponse: function(c) {
                        var d = this,
                            e = c.status_code;
                        c.method === b.C.INVITE && 491 === e ? this.reattempt ? this.applicant.receiveResponse(c) : (this.request.cseq.value = this.request.dialog.local_seqnum += 1, this.reatemptTimer = a.setTimeout(function() {
                            d.session.status !== b.RTCSession.C.STATUS_TERMINATED && (d.reattempt = !0, d.request_sender.send())
                        }, this.getReattemptTimeout())) : this.applicant.receiveResponse(c)
                    },
                    send: function() {
                        this.request_sender.send()
                    },
                    onRequestTimeout: function() {
                        this.applicant.onRequestTimeout()
                    },
                    onTransportError: function() {
                        this.applicant.onTransportError()
                    },
                    getReattemptTimeout: function() {
                        return "outgoing" === this.session.direction ? (1.9 * Math.random() + 2.1).toFixed(2) : (2 * Math.random()).toFixed(2)
                    }
                }, c
            }(b),
            e = function(b) {
                var c = function(a, b) {
                    b = b || {}, this.session = a, this.localMedia = null, this.peerConnection = null, this.init(b)
                };
                return c.prototype = {
                    createOffer: function(a, b) {
                        var c = this,
                            d = !1;
                        this.onIceCompleted = function() {
                            d || (d = !0, a(c.peerConnection.localDescription.sdp))
                        }, this.peerConnection.createOffer(function(a) {
                            c.setLocalDescription(a, b)
                        }, function(a) {
                            Plivo.logNull(g + "unable to create offer"), Plivo.logNull(a), b()
                        })
                    },
                    createAnswer: function(a, b) {
                        var c = this,
                            d = !1;
                        this.onIceCompleted = function() {
                            d || (d = !0, a(c.peerConnection.localDescription.sdp))
                        }, this.peerConnection.createAnswer(function(a) {
                            c.setLocalDescription(a, b)
                        }, function(a) {
                            Plivo.logNull(g + "unable to create answer"), Plivo.logNull(a), b()
                        })
                    },
                    setLocalDescription: function(a, b) {
                        this.peerConnection.setLocalDescription(a, function() {}, function(a) {
                            Plivo.logNull(g + "unable to set local description"), Plivo.logNull(a), b()
                        })
                    },
                    addStream: function(a, b, c, d) {
                        try {
                            this.peerConnection.addStream(a, d)
                        } catch (e) {
                            return Plivo.logNull(g + "error adding stream"), Plivo.logNull(e), void c()
                        }
                        b()
                    },
                    init: function(a) {
                        var c, d, e, f, h, i = this,
                            j = [],
                            k = this.session.ua.configuration;
                        for (d = k.stun_servers.length, c = 0; d > c; c++) e = k.stun_servers[c], j.push({
                            url: e
                        });
                        for (d = k.turn_servers.length, c = 0; d > c; c++) e = k.turn_servers[c], h = e.server, f = h.substr(0, h.indexOf(":")), j.push({
                            url: f + ":" + e.username + "@" + h.substr(f.length + 1),
                            credential: e.password
                        });
                        this.peerConnection = new b.WebRTC.RTCPeerConnection({
                            iceServers: j
                        }, a), this.peerConnection.onaddstream = function(a) {
                            Plivo.logNull(g + "stream added: " + a.stream.id), "Firefox" == BrowserDetect.browser && (document.getElementById("plivo_webrtc_remoteview").mozSrcObject = a.stream)
                        }, this.peerConnection.onremovestream = function(a) {
                            Plivo.logNull(g + "stream removed: " + a.stream.id)
                        }, this.peerConnection.onicecandidate = function(a) {
                            function b(a) {
                                return a.indexOf("udp") > 0 && a.indexOf("typ srflx raddr") > 0 ? (Plivo.logNull("Found needed candidate"), !0) : !1
                            }
                            a.candidate ? (Plivo.logNull(g + "ICE candidate received: " + a.candidate.candidate), b(a.candidate.candidate) && i.onIceCompleted()) : i.onIceCompleted && i.onIceCompleted()
                        }, this.peerConnection.ongatheringchange = function(a) {
                            "Firefox" != BrowserDetect.browser && "complete" === a.currentTarget.iceGatheringState && "closed" !== this.iceConnectionState && i.onIceCompleted()
                        }, this.peerConnection.onicechange = function() {
                            Plivo.logNull(g + 'ICE connection state changed to "' + this.iceConnectionState + '"')
                        }, this.peerConnection.oniceconnectionstatechange = function(a) {
                            Plivo.logNull(g + 'ICE connection state changed to "' + this.iceConnectionState + '"'), Plivo.onIceConnStateChange && Plivo.onIceConnStateChange(this.iceConnectionState), "complete" === a.currentTarget.iceGatheringState && "closed" !== this.iceConnectionState && i.onIceCompleted()
                        }, this.peerConnection.onstatechange = function() {
                            Plivo.logNull(g + 'PeerConnection state changed to "' + this.readyState + '"')
                        }
                    },
                    close: function() {
                        Plivo.logNull(g + "closing PeerConnection"), this.peerConnection && (this.peerConnection.close(), this.localMedia)
                    },
                    getUserMedia: function(c, d, e) {
                        function f(a) {
                            Plivo.logNull(g + "got local media stream"), Plivo.config.perm_on_click && Plivo.config.mask_page_on_perm && Plivo.unmaskPage(), i.localMedia = a, c(a), Plivo.onMediaPermission(!0), "Firefox" == BrowserDetect.browser && (document.getElementById("plivo_webrtc_selfview").mozSrcObject = a)
                        }

                        function h(a) {
                            Plivo.logNull(g + "unable to get user media"), Plivo.logNull(a), Plivo.config.perm_on_click && Plivo.config.mask_page_on_perm && Plivo.unmaskPage(), d(), Plivo.onMediaPermission(!1)
                        }
                        var i = this;
                        return Plivo.config.listen_mode ? void c(null) : (Plivo.logNull(g + "requesting access to local media"), void(a.storedStream ? f(a.storedStream) : (Plivo.config.mask_page_on_perm && Plivo.maskThePage(), Plivo.onRequirePermission(), b.WebRTC.getUserMedia(e, f, h))))
                    },
                    onMessage: function(a, c, d, e) {
                        Plivo.gotEarlyMedia ? d() : this.peerConnection.setRemoteDescription(new b.WebRTC.RTCSessionDescription({
                            type: a,
                            sdp: c
                        }), d, e)
                    },
                    onMessageEarlyMedia: function(a, c, d, e) {
                        this.peerConnection.setRemoteDescription(new b.WebRTC.RTCSessionDescription({
                            type: a,
                            sdp: c
                        }), d, e)
                    }
                }, c
            }(b),
            f = function(a) {
                var b, c = {
                        MIN_DURATION: 70,
                        MAX_DURATION: 6e3,
                        DEFAULT_DURATION: 100,
                        MIN_INTER_TONE_GAP: 50,
                        DEFAULT_INTER_TONE_GAP: 500
                    };
                return b = function(a) {
                    var b = ["succeeded", "failed"];
                    this.session = a, this.direction = null, this.tone = null, this.duration = null, this.initEvents(b)
                }, b.prototype = new a.EventEmitter, b.prototype.send = function(b, e) {
                    var f, h, i, j;
                    if (void 0 === b) throw new TypeError("Not enough arguments");
                    if (this.direction = "outgoing", this.session.status !== a.RTCSession.C.STATUS_CONFIRMED && this.session.status !== a.RTCSession.C.STATUS_WAITING_FOR_ACK) throw new a.Exceptions.InvalidStateError(this.session.status);
                    if (e = e || {}, j = e.extraHeaders ? e.extraHeaders.slice() : [], i = e.eventHandlers || {}, "string" == typeof b) b = b.toUpperCase();
                    else {
                        if ("number" != typeof b) throw new TypeError("Invalid tone: " + b);
                        b = b.toString()
                    } if (!b.match(/^[0-9A-D#*]$/)) throw new TypeError("Invalid tone: " + b);
                    if (this.tone = b, e.duration && !a.Utils.isDecimal(e.duration)) throw new TypeError("Invalid tone duration: " + e.duration);
                    e.duration ? e.duration < c.MIN_DURATION ? (Plivo.logNull(g + '"duration" value is lower than the minimum allowed, setting it to ' + c.MIN_DURATION + " milliseconds"), e.duration = c.MIN_DURATION) : e.duration > c.MAX_DURATION ? (Plivo.logNull(g + '"duration" value is greater than the maximum allowed, setting it to ' + c.MAX_DURATION + " milliseconds"), e.duration = c.MAX_DURATION) : e.duration = Math.abs(e.duration) : e.duration = c.DEFAULT_DURATION, this.duration = e.duration;
                    for (h in i) this.on(h, i[h]);
                    j.push("Content-Type: application/dtmf-relay"), this.request = this.session.dialog.createRequest(a.C.INFO, j), this.request.body = "Signal= " + this.tone + "\r\n", this.request.body += "Duration= " + this.duration, f = new d(this), this.session.emit("newDTMF", this.session, {
                        originator: "local",
                        dtmf: this,
                        request: this.request
                    }), f.send()
                }, b.prototype.receiveResponse = function(b) {
                    var c;
                    switch (!0) {
                        case /^1[0-9]{2}$/.test(b.status_code):
                            break;
                        case /^2[0-9]{2}$/.test(b.status_code):
                            this.emit("succeeded", this, {
                                originator: "remote",
                                response: b
                            });
                            break;
                        default:
                            c = a.Utils.sipErrorCause(b.status_code), this.emit("failed", this, {
                                originator: "remote",
                                response: b,
                                cause: c
                            })
                    }
                }, b.prototype.onRequestTimeout = function() {
                    this.emit("failed", this, {
                        originator: "system",
                        cause: a.C.causes.REQUEST_TIMEOUT
                    })
                }, b.prototype.onTransportError = function() {
                    this.emit("failed", this, {
                        originator: "system",
                        cause: a.C.causes.CONNECTION_ERROR
                    })
                }, b.prototype.init_incoming = function(a) {
                    var b, c = /^(Signal\s*?=\s*?)([0-9A-D#*]{1})(\s)?.*/,
                        d = /^(Duration\s?=\s?)([0-9]{1,4})(\s)?.*/;
                    this.direction = "incoming", this.request = a, a.reply(200), a.body && (b = a.body.split("\r\n"), 2 === b.length && (c.test(b[0]) && (this.tone = b[0].replace(c, "$2")), d.test(b[1]) && (this.duration = parseInt(b[1].replace(d, "$2"), 10)))), this.tone && this.duration ? this.session.emit("newDTMF", this.session, {
                        originator: "remote",
                        dtmf: this,
                        request: a
                    }) : Plivo.logNull(g + "invalid INFO DTMF received, discarded")
                }, b.C = c, b
            }(b),
            g = b.name + " | RTC SESSION | ",
            h = {
                STATUS_NULL: 0,
                STATUS_INVITE_SENT: 1,
                STATUS_1XX_RECEIVED: 2,
                STATUS_INVITE_RECEIVED: 3,
                STATUS_WAITING_FOR_ANSWER: 4,
                STATUS_WAITING_FOR_ACK: 5,
                STATUS_CANCELED: 6,
                STATUS_TERMINATED: 7,
                STATUS_CONFIRMED: 8
            };
        c = function(a) {
            var b = ["progress", "failed", "started", "ended", "newDTMF"];
            this.ua = a, this.status = h.STATUS_NULL, this.dialog = null, this.earlyDialogs = {}, this.rtcMediaHandler = null, this.timers = {
                ackTimer: null,
                expiresTimer: null,
                invite2xxTimer: null,
                userNoAnswerTimer: null
            }, this.direction = null, this.local_identity = null, this.remote_identity = null, this.start_time = null, this.end_time = null, this.data = {}, this.initEvents(b)
        }, c.prototype = new b.EventEmitter, c.prototype.terminate = function(a) {
            a = a || {};
            var c, d = a.status_code,
                e = a.reason_phrase,
                f = a.extraHeaders || [],
                i = a.body;
            if (this.status === h.STATUS_TERMINATED) throw new b.Exceptions.InvalidStateError(this.status);
            switch (this.status) {
                case h.STATUS_NULL:
                case h.STATUS_INVITE_SENT:
                case h.STATUS_1XX_RECEIVED:
                    if (Plivo.logNull(g + "canceling RTCSession"), d && (200 > d || d >= 700)) throw new TypeError("Invalid status_code: " + d);
                    d && (e = e || b.C.REASON_PHRASE[d] || "", c = "SIP ;cause=" + d + ' ;text="' + e + '"'), this.status === h.STATUS_NULL ? (this.isCanceled = !0, this.cancelReason = c) : this.status === h.STATUS_INVITE_SENT ? this.received_100 ? this.request.cancel(c) : (this.isCanceled = !0, this.cancelReason = c) : this.status === h.STATUS_1XX_RECEIVED && this.request.cancel(c), this.failed("local", null, b.C.causes.CANCELED);
                    break;
                case h.STATUS_WAITING_FOR_ANSWER:
                    if (Plivo.logNull(g + "rejecting RTCSession"), d = d || 480, 300 > d || d >= 700) throw new TypeError("Invalid status_code: " + d);
                    this.request.reply(d, e, f, i), this.failed("local", null, b.C.causes.REJECTED);
                    break;
                case h.STATUS_WAITING_FOR_ACK:
                case h.STATUS_CONFIRMED:
                    Plivo.logNull(g + "terminating RTCSession"), this.sendBye(a), this.ended("local", null, b.C.causes.BYE)
            }
            this.close()
        }, c.prototype.answer = function(c) {
            c = c || {};
            var d = this,
                e = this.request,
                f = c.extraHeaders || [],
                i = c.mediaConstraints || {
                    audio: !0,
                    video: !0
                }, j = function(a) {
                    return Plivo.config.listen_mode ? void l() : void d.rtcMediaHandler.addStream(a, l, m)
                }, k = function() {
                    e.reply(480), d.failed("local", null, b.C.causes.USER_DENIED_MEDIA_ACCESS)
                }, l = function() {
                    d.rtcMediaHandler.createAnswer(n, o)
                }, m = function() {
                    d.status !== h.STATUS_TERMINATED && d.failed("local", null, b.C.causes.WEBRTC_ERROR)
                }, n = function(c) {
                    var i = function() {
                        d.status = h.STATUS_WAITING_FOR_ACK, d.timers.invite2xxTimer = a.setTimeout(function f(g) {
                            g = g || 1;
                            var h = b.Timers.T1 * Math.pow(2, g);
                            g * b.Timers.T1 <= b.Timers.T2 ? (g += 1, e.reply(200, null, ["Contact: " + d.contact], c), d.timers.invite2xxTimer = a.setTimeout(function() {
                                f(g)
                            }, h)) : a.clearTimeout(d.timers.invite2xxTimer)
                        }, b.Timers.T1), d.timers.ackTimer = a.setTimeout(function() {
                            d.status === h.STATUS_WAITING_FOR_ACK && (Plivo.logNull(g + "no ACK received, terminating the call"), a.clearTimeout(d.timers.invite2xxTimer), d.sendBye(), d.ended("remote", null, b.C.causes.NO_ACK))
                        }, b.Timers.TIMER_H), d.started("local")
                    }, j = function() {
                            d.failed("system", null, b.C.causes.CONNECTION_ERROR)
                        };
                    f.push("Contact: " + d.contact), e.reply(200, null, f, c, i, j)
                }, o = function() {
                    d.status !== h.STATUS_TERMINATED && d.failed("local", null, b.C.causes.WEBRTC_ERROR)
                };
            if ("incoming" !== this.direction) throw new TypeError('Invalid method "answer" for an outgoing call');
            if (this.status !== h.STATUS_WAITING_FOR_ANSWER) throw new b.Exceptions.InvalidStateError(this.status);
            return this.createDialog(e, "UAS") ? (a.clearTimeout(this.timers.userNoAnswerTimer), void this.rtcMediaHandler.getUserMedia(j, k, i)) : void e.reply(500, "Missing Contact header field")
        }, c.prototype.sendDTMF = function(c, d) {
            function e() {
                var a, b = new f(l);
                b.on("failed", function() {
                    m = !1
                }), a = c[k], k += 1, b.send(a, d)
            }
            var i, j, k = 0,
                l = this,
                m = !0;
            if (d = d || {}, j = d.interToneGap || null, void 0 === c) throw new TypeError("Not enough arguments");
            if (this.status !== h.STATUS_CONFIRMED && this.status !== h.STATUS_WAITING_FOR_ACK) throw new b.Exceptions.InvalidStateError(this.status);
            if (!c || "string" != typeof c && "number" != typeof c || !c.toString().match(/^[0-9A-D#*]+$/i)) throw new TypeError("Invalid tones: " + c);
            if (c = c.toString(), j && !b.Utils.isDecimal(j)) throw new TypeError("Invalid interToneGap: " + j);
            j ? j < f.C.MIN_INTER_TONE_GAP ? (Plivo.logNull(g + '"interToneGap" value is lower than the minimum allowed, setting it to ' + f.C.MIN_INTER_TONE_GAP + " milliseconds"), j = f.C.MIN_INTER_TONE_GAP) : j = Math.abs(j) : j = f.C.DEFAULT_INTER_TONE_GAP, e(), i = a.setInterval(function() {
                l.status !== h.STATUS_TERMINATED && m && c.length > k ? e() : a.clearInterval(i)
            }, j)
        }, c.prototype.getLocalStreams = function() {
            return this.rtcMediaHandler && this.rtcMediaHandler.peerConnection && this.rtcMediaHandler.peerConnection.getLocalStreams() || []
        }, c.prototype.getRemoteStreams = function() {
            return this.rtcMediaHandler && this.rtcMediaHandler.peerConnection && this.rtcMediaHandler.peerConnection.getRemoteStreams() || []
        }, c.prototype.init_incoming = function(c) {
            var d, f = this,
                i = c.getHeader("Content-Type");
            return c.body && "application/sdp" === i ? (this.status = h.STATUS_INVITE_RECEIVED, this.from_tag = c.from_tag, this.id = c.call_id + this.from_tag, this.request = c, this.contact = this.ua.contact.toString(), this.ua.sessions[this.id] = this, c.hasHeader("expires") && (d = 1e3 * c.getHeader("expires")), c.to_tag = b.Utils.newTag(), this.createDialog(c, "UAS", !0) ? (this.rtcMediaHandler = new e(this), void this.rtcMediaHandler.onMessage("offer", c.body, function() {
                c.reply(180, null, ["Contact: " + f.contact]), f.status = h.STATUS_WAITING_FOR_ANSWER, f.timers.userNoAnswerTimer = a.setTimeout(function() {
                    c.reply(408), f.failed("local", null, b.C.causes.NO_ANSWER)
                }, f.ua.configuration.no_answer_timeout), d && (f.timers.expiresTimer = a.setTimeout(function() {
                    f.status === h.STATUS_WAITING_FOR_ANSWER && (c.reply(487), f.failed("system", null, b.C.causes.EXPIRES))
                }, d)), f.newRTCSession("remote", c)
            }, function(a) {
                Plivo.logNull(g + "invalid SDP"), Plivo.logNull(a), c.reply(488)
            })) : void c.reply(500, "Missing Contact header field")) : void c.reply(415)
        }, c.prototype.connect = function(a, c) {
            c = c || {};
            var d, f, g = !1,
                i = c.eventHandlers || {}, j = c.extraHeaders || [],
                k = c.mediaConstraints || {
                    audio: !0,
                    video: !0
                }, l = c.RTCConstraints || {};
            if (void 0 === a) throw new TypeError("Not enough arguments");
            if (this.status !== h.STATUS_NULL) throw new b.Exceptions.InvalidStateError(this.status);
            for (d in i) this.on(d, i[d]);
            try {
                a = b.Utils.normalizeURI(a, this.ua.configuration.hostport_params)
            } catch (m) {
                a = b.URI.parse(b.C.INVALID_TARGET_URI), g = !0
            }
            this.from_tag = b.Utils.newTag(), this.rtcMediaHandler = new e(this, l), this.anonymous = c.anonymous, this.isCanceled = !1, this.received_100 = !1, f = {
                from_tag: this.from_tag
            }, this.contact = this.ua.contact.toString({
                anonymous: this.anonymous,
                outbound: !0
            }), this.anonymous && (f.from_display_name = "Anonymous", f.from_uri = "sip:anonymous@anonymous.invalid", j.push("P-Preferred-Identity: " + this.ua.configuration.uri.toString()), j.push("Privacy: id")), j.push("Contact: " + this.contact), j.push("Allow: " + b.Utils.getAllowedMethods(this.ua)), j.push("Content-Type: application/sdp"), this.request = new b.OutgoingRequest(b.C.INVITE, a, this.ua, f, j), this.id = this.request.call_id + this.from_tag, this.ua.sessions[this.id] = this, this.newRTCSession("local", this.request), g ? this.failed("local", null, b.C.causes.INVALID_TARGET) : b.WebRTC.isSupported ? this.sendInitialRequest(k) : this.failed("local", null, b.C.causes.WEBRTC_NOT_SUPPORTED)
        }, c.prototype.close = function() {
            var b;
            if (this.status !== h.STATUS_TERMINATED) {
                Plivo.logNull(g + "closing INVITE session " + this.id), this.rtcMediaHandler && this.rtcMediaHandler.close();
                for (b in this.timers) a.clearTimeout(this.timers[b]);
                this.dialog && (this.dialog.terminate(), delete this.dialog);
                for (b in this.earlyDialogs) this.earlyDialogs[b].terminate(), delete this.earlyDialogs[b];
                this.status = h.STATUS_TERMINATED, delete this.ua.sessions[this.id]
            }
        }, c.prototype.createDialog = function(a, c, d) {
            var e, f, g = "UAS" === c ? a.to_tag : a.from_tag,
                h = "UAS" === c ? a.from_tag : a.to_tag,
                i = a.call_id + g + h;
            return f = this.earlyDialogs[i], d ? f ? !0 : (f = new b.Dialog(this, a, c, b.Dialog.C.STATUS_EARLY), f.id ? (this.earlyDialogs[i] = f, !0) : (this.failed("remote", a, b.C.causes.INTERNAL_ERROR), !1)) : f ? (f.update(a, c), this.dialog = f, delete this.earlyDialogs[i], !0) : (e = new b.Dialog(this, a, c), e.id ? (this.to_tag = a.to_tag, this.dialog = e, !0) : (this.failed("remote", a, b.C.causes.INTERNAL_ERROR), !1))
        }, c.prototype.receiveRequest = function(c) {
            var d;
            if (c.method === b.C.CANCEL) this.request.reply(487), this.status === h.STATUS_WAITING_FOR_ANSWER && (this.status = h.STATUS_CANCELED, this.failed("remote", c, b.C.causes.CANCELED));
            else switch (c.method) {
                case b.C.ACK:
                    this.status === h.STATUS_WAITING_FOR_ACK && (a.clearTimeout(this.timers.ackTimer), a.clearTimeout(this.timers.invite2xxTimer), this.status = h.STATUS_CONFIRMED);
                    break;
                case b.C.BYE:
                    this.status === h.STATUS_CONFIRMED && (c.reply(200), this.ended("remote", c, b.C.causes.BYE));
                    break;
                case b.C.INVITE:
                    this.status === h.STATUS_CONFIRMED && Plivo.logNull(g + "re-INVITE received");
                    break;
                case b.C.INFO:
                    (this.status === h.STATUS_CONFIRMED || this.status === h.STATUS_WAITING_FOR_ACK) && (d = c.getHeader("content-type"), d && d.match(/^application\/dtmf-relay/i) && new f(this).init_incoming(c))
            }
        }, c.prototype.sendInitialRequest = function(a) {
            var c = this,
                d = new b.RequestSender(c, this.ua),
                e = function(a) {
                    return Plivo.config.listen_mode ? void g() : void c.rtcMediaHandler.addStream(a, g, i)
                }, f = function() {
                    c.status !== h.STATUS_TERMINATED && c.failed("local", null, b.C.causes.USER_DENIED_MEDIA_ACCESS)
                }, g = function() {
                    c.rtcMediaHandler.createOffer(j, k)
                }, i = function() {
                    c.status !== h.STATUS_TERMINATED && c.failed("local", null, b.C.causes.WEBRTC_ERROR)
                }, j = function(a) {
                    c.isCanceled || c.status === h.STATUS_TERMINATED || (c.request.body = a, c.status = h.STATUS_INVITE_SENT, d.send())
                }, k = function() {
                    c.status !== h.STATUS_TERMINATED && c.failed("local", null, b.C.causes.WEBRTC_ERROR)
                };
            this.rtcMediaHandler.getUserMedia(e, f, a)
        }, c.prototype.receiveResponse = function(a) {
            var c, d = this;
            if (this.status === h.STATUS_INVITE_SENT || this.status === h.STATUS_1XX_RECEIVED) {
                if (this.isCanceled) return void(a.status_code >= 100 && a.status_code < 200 ? this.request.cancel(this.cancelReason) : a.status_code >= 200 && a.status_code < 299 && this.acceptAndTerminate(a));
                switch (!0) {
                    case /^100$/.test(a.status_code):
                        this.received_100 = !0;
                        break;
                    case /^1[0-9]{2}$/.test(a.status_code):
                        if (!a.to_tag) {
                            Plivo.logNull(g + "1xx response received without to tag");
                            break
                        }
                        a.hasHeader("contact") && this.createDialog(a, "UAC", !0), 183 != a.status_code || Plivo.gotEarlyMedia || "application/sdp" !== a.getHeader("Content-Type") || (Plivo.logNull("Got SDP in SIP 183"), this.rtcMediaHandler.onMessageEarlyMedia("answer", a.body, function() {
                            Plivo.gotEarlyMedia = !0
                        }, function() {
                            Plivo.logNull("Failed to proceed SDP in SIP 183. We will proceed it in SIP 200")
                        })), this.status = h.STATUS_1XX_RECEIVED, this.progress("remote", a);
                        break;
                    case /^2[0-9]{2}$/.test(a.status_code):
                        if (this.dialog) break;
                        if (!a.body) {
                            this.acceptAndTerminate(a, 400, "Missing session description"), this.failed("remote", a, b.C.causes.BAD_MEDIA_DESCRIPTION);
                            break
                        }
                        this.rtcMediaHandler.onMessage("answer", a.body, function() {
                            d.createDialog(a, "UAC") && (d.sendACK(), d.status = h.STATUS_CONFIRMED, d.started("remote", a))
                        }, function(c) {
                            Plivo.logNull(c), d.acceptAndTerminate(a, 488, "Not Acceptable Here"), d.failed("remote", a, b.C.causes.BAD_MEDIA_DESCRIPTION)
                        });
                        break;
                    default:
                        c = b.Utils.sipErrorCause(a.status_code), this.failed("remote", a, c)
                }
            }
        }, c.prototype.acceptAndTerminate = function(a, b, c) {
            (this.dialog || this.createDialog(a, "UAC")) && (this.sendACK(), this.sendBye({
                status_code: b,
                reason_phrase: c
            }))
        }, c.prototype.sendACK = function() {
            var a = this.dialog.createRequest(b.C.ACK);
            this.sendRequest(a)
        }, c.prototype.sendBye = function(a) {
            a = a || {};
            var c, d, e = a.status_code,
                f = a.reason_phrase || b.C.REASON_PHRASE[e] || "",
                g = a.extraHeaders || [],
                h = a.body;
            if (e && (200 > e || e >= 700)) throw new TypeError("Invalid status_code: " + e);
            e && (d = "SIP ;cause=" + e + '; text="' + f + '"', g.push("Reason: " + d)), c = this.dialog.createRequest(b.C.BYE, g), c.body = h, this.sendRequest(c)
        }, c.prototype.sendRequest = function(a) {
            var b = new d(this, a);
            b.send()
        }, c.prototype.onTransportError = function() {
            this.status !== h.STATUS_TERMINATED && (this.status === h.STATUS_CONFIRMED ? this.ended("system", null, b.C.causes.CONNECTION_ERROR) : this.failed("system", null, b.C.causes.CONNECTION_ERROR))
        }, c.prototype.onRequestTimeout = function() {
            this.status !== h.STATUS_TERMINATED && (this.status === h.STATUS_CONFIRMED ? this.ended("system", null, b.C.causes.REQUEST_TIMEOUT) : this.failed("system", null, b.C.causes.CONNECTION_ERROR))
        }, c.prototype.newRTCSession = function(a, b) {
            var c = this,
                d = "newRTCSession";
            "remote" === a ? (c.direction = "incoming", c.local_identity = b.to, c.remote_identity = b.from) : "local" === a && (c.direction = "outgoing", c.local_identity = b.from, c.remote_identity = b.to), c.ua.emit(d, c.ua, {
                originator: a,
                session: c,
                request: b
            })
        }, c.prototype.connecting = function(a, b) {
            var c = this,
                d = "connecting";
            c.emit(d, c, {
                originator: "local",
                request: b
            })
        }, c.prototype.progress = function(a, b) {
            var c = this,
                d = "progress";
            c.emit(d, c, {
                originator: a,
                response: b || null
            })
        }, c.prototype.started = function(a, b) {
            var c = this,
                d = "started";
            c.start_time = new Date, c.emit(d, c, {
                response: b || null
            })
        }, c.prototype.ended = function(a, b, c) {
            var d = this,
                e = "ended";
            d.end_time = new Date, d.close(), d.emit(e, d, {
                originator: a,
                message: b || null,
                cause: c
            })
        }, c.prototype.failed = function(a, b, c) {
            var d = this,
                e = "failed";
            d.close(), d.emit(e, d, {
                originator: a,
                message: b || null,
                cause: c
            })
        }, c.C = h, b.RTCSession = c
    }(b),
    function(a) {
        var b;
        b = function(a) {
            this.ua = a, this.direction = null, this.local_identity = null, this.remote_identity = null, this.data = {}
        }, b.prototype = new a.EventEmitter, b.prototype.send = function(b, c, d) {
            var e, f, g, h, i, j = ["succeeded", "failed"],
                k = !1;
            if (void 0 === b || void 0 === c) throw new TypeError("Not enough arguments");
            this.initEvents(j), d = d || {}, i = d.extraHeaders || [], h = d.eventHandlers || {}, g = d.contentType || "text/plain";
            for (f in h) this.on(f, h[f]);
            try {
                b = a.Utils.normalizeURI(b, this.ua.configuration.hostport_params)
            } catch (l) {
                b = a.URI.parse(a.C.INVALID_TARGET_URI), k = !0
            }
            this.direction = "outgoing", this.local_identity = this.ua.configuration.uri, this.remote_identity = b, this.closed = !1, this.ua.applicants[this] = this, i.push("Content-Type: " + g), this.request = new a.OutgoingRequest(a.C.MESSAGE, b, this.ua, null, i), c && (this.request.body = c), e = new a.RequestSender(this, this.ua), this.ua.emit("newMessage", this.ua, {
                originator: "local",
                message: this,
                request: this.request
            }), k ? this.emit("failed", this, {
                originator: "local",
                cause: a.C.causes.INVALID_TARGET
            }) : e.send()
        }, b.prototype.receiveResponse = function(b) {
            var c;
            if (!this.closed) switch (!0) {
                case /^1[0-9]{2}$/.test(b.status_code):
                    break;
                case /^2[0-9]{2}$/.test(b.status_code):
                    delete this.ua.applicants[this], this.emit("succeeded", this, {
                        originator: "remote",
                        response: b
                    });
                    break;
                default:
                    delete this.ua.applicants[this], c = a.Utils.sipErrorCause(b.status_code), this.emit("failed", this, {
                        originator: "remote",
                        response: b,
                        cause: c
                    })
            }
        }, b.prototype.onRequestTimeout = function() {
            this.closed || this.emit("failed", this, {
                originator: "system",
                cause: a.C.causes.REQUEST_TIMEOUT
            })
        }, b.prototype.onTransportError = function() {
            this.closed || this.emit("failed", this, {
                originator: "system",
                cause: a.C.causes.CONNECTION_ERROR
            })
        }, b.prototype.close = function() {
            this.closed = !0, delete this.ua.applicants[this]
        }, b.prototype.init_incoming = function(b) {
            var c, d = b.getHeader("content-type");
            this.direction = "incoming", this.request = b, this.local_identity = b.to.uri, this.remote_identity = b.from.uri, d && (d.match(/^text\/plain(\s*;\s*.+)*$/i) || d.match(/^text\/html(\s*;\s*.+)*$/i)) ? (this.ua.emit("newMessage", this.ua, {
                originator: "remote",
                message: this,
                request: b
            }), c = this.ua.transactions.nist[b.via_branch], !c || c.state !== a.Transactions.C.STATUS_TRYING && c.state !== a.Transactions.C.STATUS_PROCEEDING || b.reply(200)) : b.reply(415, null, ["Accept: text/plain, text/html"])
        }, b.prototype.accept = function(a) {
            a = a || {};
            var b = a.extraHeaders || [],
                c = a.body;
            if ("incoming" !== this.direction) throw new TypeError('Invalid method "accept" for an outgoing message');
            this.request.reply(200, null, b, c)
        }, b.prototype.reject = function(a) {
            a = a || {};
            var b = a.status_code || 480,
                c = a.reason_phrase,
                d = a.extraHeaders || [],
                e = a.body;
            if ("incoming" !== this.direction) throw new TypeError('Invalid method "reject" for an outgoing message');
            if (300 > b || b >= 700) throw new TypeError("Invalid status_code: " + b);
            this.request.reply(b, c, d, e)
        }, a.Message = b
    }(b),
    function(b) {
        var c, d = b.name + " | UA | ",
            e = {
                STATUS_INIT: 0,
                STATUS_READY: 1,
                STATUS_USER_CLOSED: 2,
                STATUS_NOT_READY: 3,
                CONFIGURATION_ERROR: 1,
                NETWORK_ERROR: 2,
                EVENT_METHODS: {
                    newRTCSession: "INVITE",
                    newMessage: "MESSAGE"
                },
                ALLOWED_METHODS: ["ACK", "CANCEL", "BYE", "OPTIONS"],
                ACCEPTED_BODY_TYPES: ["application/sdp", "application/dtmf-relay"],
                SUPPORTED: "path, outbound, gruu",
                MAX_FORWARDS: 69,
                TAG_LENGTH: 10
            };
        c = function(a) {
            var b = ["connected", "disconnected", "registered", "unregistered", "registrationFailed", "newRTCSession", "newMessage"];
            if (e.ACCEPTED_BODY_TYPES = e.ACCEPTED_BODY_TYPES.toString(), this.cache = {
                credentials: {}
            }, this.configuration = {}, this.dialogs = {}, this.registrator = null, this.applicants = {}, this.sessions = {}, this.transport = null, this.contact = null, this.status = e.STATUS_INIT, this.error = null, this.transactions = {
                nist: {},
                nict: {},
                ist: {},
                ict: {}
            }, this.transportRecoverAttempts = 0, void 0 === a) throw new TypeError("Not enough arguments");
            try {
                this.loadConfig(a), this.initEvents(b)
            } catch (c) {
                throw this.status = e.STATUS_NOT_READY, this.error = e.CONFIGURATION_ERROR, c
            }
        }, c.prototype = new b.EventEmitter, c.prototype.register = function(a) {
            this.configuration.register = !0, this.registrator.register(a)
        }, c.prototype.unregister = function(a) {
            this.configuration.register = !1, this.registrator.unregister(a)
        }, c.prototype.isRegistered = function() {
            return this.registrator && this.registrator.registered ? !0 : !1
        }, c.prototype.isConnected = function() {
            return this.transport ? this.transport.connected : !1
        }, c.prototype.call = function(a, c) {
            var d;
            d = new b.RTCSession(this), d.connect(a, c)
        }, c.prototype.sendMessage = function(a, c, d) {
            var e;
            e = new b.Message(this), e.send(a, c, d)
        }, c.prototype.stop = function() {
            var b, c, f = this;
            if (Plivo.logNull(d + "user requested closure..."), this.status === e.STATUS_USER_CLOSED) return void Plivo.logNull("UA already closed");
            this.registrator && (Plivo.logNull(d + "closing registrator"), this.registrator.close());
            for (b in this.sessions) Plivo.logNull(d + "closing session " + b), this.sessions[b].terminate();
            for (c in this.applicants) this.applicants[c].close();
            this.status = e.STATUS_USER_CLOSED, this.shutdownGraceTimer = a.setTimeout(function() {
                f.transport.disconnect()
            }, "5000")
        }, c.prototype.start = function() {
            var a;
            Plivo.logNull(d + "user requested startup..."), this.status === e.STATUS_INIT ? (a = this.getNextWsServer(), new b.Transport(this, a)) : this.status === e.STATUS_USER_CLOSED ? (Plivo.logNull(d + "resuming"), this.status = e.STATUS_READY, this.transport.connect()) : Plivo.logNull(this.status === e.STATUS_READY ? d + "UA is in READY status, not resuming" : "Connection is down. Auto-Recovery system is trying to connect")
        }, c.prototype.saveCredentials = function(a) {
            this.cache.credentials[a.realm] = this.cache.credentials[a.realm] || {}, this.cache.credentials[a.realm][a.uri] = a
        }, c.prototype.getCredentials = function(a) {
            var b, c;
            return b = a.ruri.host, this.cache.credentials[b] && this.cache.credentials[b][a.ruri] && (c = this.cache.credentials[b][a.ruri], c.method = a.method), c
        }, c.prototype.onTransportClosed = function(a) {
            var c, e, f, g = ["nict", "ict", "nist", "ist"];
            for (a.server.status = b.Transport.C.STATUS_DISCONNECTED, Plivo.logNull(d + "connection state set to " + b.Transport.C.STATUS_DISCONNECTED), f = g.length, c = 0; f > c; c++)
                for (e in this.transactions[g[c]]) this.transactions[g[c]][e].onTransportError();
            this.contact.pub_gruu || this.closeSessionsOnTransportError()
        }, c.prototype.onTransportError = function(a) {
            var c;
            Plivo.logNull(d + "transport " + a.server.ws_uri + " failed | connection state set to " + b.Transport.C.STATUS_ERROR), a.server.status = b.Transport.C.STATUS_ERROR, this.emit("disconnected", this, {
                transport: a,
                code: a.lastTransportError.code,
                reason: a.lastTransportError.reason
            }), c = this.getNextWsServer(), c ? new b.Transport(this, c) : (this.closeSessionsOnTransportError(), this.error && this.error === e.NETWORK_ERROR || (this.status = e.STATUS_NOT_READY, this.error = e.NETWORK_ERROR), this.recoverTransport())
        }, c.prototype.onTransportConnected = function(a) {
            this.transport = a, this.transportRecoverAttempts = 0, a.server.status = b.Transport.C.STATUS_READY, Plivo.logNull(d + "connection state set to " + b.Transport.C.STATUS_READY), this.status !== e.STATUS_USER_CLOSED && (this.status = e.STATUS_READY, this.error = null, this.emit("connected", this, {
                transport: a
            }), this.configuration.register ? this.registrator ? this.registrator.onTransportConnected() : (this.registrator = new b.Registrator(this, a), this.register()) : this.registrator = new b.Registrator(this, a))
        }, c.prototype.receiveRequest = function(a) {
            var c, f, g, h = a.method;
            if (a.ruri.user !== this.configuration.uri.user && a.ruri.user !== this.contact.uri.user) return Plivo.logNull(d + "Request-URI does not point to us"), void(a.method !== b.C.ACK && a.reply_sl(404));
            if (!b.Transactions.checkTransaction(this, a)) {
                if (h === b.C.INVITE ? new b.Transactions.InviteServerTransaction(a, this) : h !== b.C.ACK && new b.Transactions.NonInviteServerTransaction(a, this), h === b.C.OPTIONS) a.reply(200, null, ["Allow: " + b.Utils.getAllowedMethods(this), "Accept: " + e.ACCEPTED_BODY_TYPES]);
                else if (h === b.C.MESSAGE) {
                    if (!this.checkEvent("newMessage") || 0 === this.listeners("newMessage").length) return void a.reply(405, null, ["Allow: " + b.Utils.getAllowedMethods(this)]);
                    g = new b.Message(this), g.init_incoming(a)
                }
                if (a.to_tag) c = this.findDialog(a), c ? c.receiveRequest(a) : h === b.C.NOTIFY ? (f = this.findSession(a), f ? f.receiveRequest(a) : (Plivo.logNull(d + "received NOTIFY request for a non existent session"), a.reply(481, "Subscription does not exist"))) : h !== b.C.ACK && a.reply(481);
                else {
                    if (!this.isRegistered()) return void a.reply(410);
                    switch (h) {
                        case b.C.INVITE:
                            b.WebRTC.isSupported ? (f = new b.RTCSession(this), f.init_incoming(a)) : (Plivo.logNull(d + "INVITE received but WebRTC is not supported"), a.reply(488));
                            break;
                        case b.C.BYE:
                            a.reply(481);
                            break;
                        case b.C.CANCEL:
                            a.reply(200), f = this.findSession(a), f ? f.receiveRequest(a) : Plivo.logNull(d + "received CANCEL request for a non existent session");
                            break;
                        case b.C.ACK:
                            break;
                        default:
                            a.reply(405)
                    }
                }
            }
        }, c.prototype.findSession = function(a) {
            var b = a.call_id + a.from_tag,
                c = this.sessions[b],
                d = a.call_id + a.to_tag,
                e = this.sessions[d];
            return c ? c : e ? e : null
        }, c.prototype.findDialog = function(a) {
            var b = a.call_id + a.from_tag + a.to_tag,
                c = this.dialogs[b];
            return c ? c : (b = a.call_id + a.to_tag + a.from_tag, c = this.dialogs[b], c ? c : null)
        }, c.prototype.getNextWsServer = function() {
            var a, c, d, e = [];
            for (c = this.configuration.ws_servers.length, a = 0; c > a; a++) d = this.configuration.ws_servers[a], d.status !== b.Transport.C.STATUS_ERROR && (0 === e.length ? e.push(d) : d.weight > e[0].weight ? e = [d] : d.weight === e[0].weight && e.push(d));
            return a = Math.floor(Math.random() * e.length), e[a]
        }, c.prototype.closeSessionsOnTransportError = function() {
            var a;
            for (a in this.sessions) this.sessions[a].onTransportError();
            this.registrator && this.registrator.onTransportClosed()
        }, c.prototype.recoverTransport = function(c) {
            var e, f, g, h, i, j;
            for (c = c || this, i = c.transportRecoverAttempts, f = c.configuration.ws_servers.length, e = 0; f > e; e++) c.configuration.ws_servers[e].status = 0;
            j = c.getNextWsServer(), g = Math.floor(Math.random() * Math.pow(2, i) + 1), h = g * c.configuration.connection_recovery_min_interval, h > c.configuration.connection_recovery_max_interval && (Plivo.logNull(d + "time for next connection attempt exceeds connection_recovery_max_interval, resetting counter"), h = c.configuration.connection_recovery_min_interval, i = 0), Plivo.logNull(d + "next connection attempt in " + h + " seconds"), a.setTimeout(function() {
                c.transportRecoverAttempts = i + 1, new b.Transport(c, j)
            }, 1e3 * h)
        }, c.prototype.loadConfig = function(e) {
            var f, g, h, i, j, k = {
                    via_host: b.Utils.createRandomToken(12) + ".invalid",
                    password: null,
                    register_expires: 120,
                    register_min_expires: 60,
                    register: !0,
                    registrar_server: null,
                    ws_server_max_reconnection: 3,
                    ws_server_reconnection_timeout: 4,
                    connection_recovery_min_interval: 2,
                    connection_recovery_max_interval: 30,
                    use_preloaded_route: !1,
                    no_answer_timeout: 60,
                    stun_servers: ["stun:stun.l.google.com:19302"],
                    turn_servers: [],
                    trace_sip: !1,
                    hack_via_tcp: !1,
                    hack_ip_in_contact: !1
                };
            for (f in c.configuration_check.mandatory) {
                if (!e.hasOwnProperty(f)) throw new b.Exceptions.ConfigurationError(f);
                if (g = e[f], h = c.configuration_check.mandatory[f](g), void 0 === h) throw new b.Exceptions.ConfigurationError(f, g);
                k[f] = h
            }
            for (f in c.configuration_check.optional)
                if (e.hasOwnProperty(f)) {
                    if (g = e[f], null === g || "" === g || void 0 === g) continue;
                    if ("number" == typeof g && a.isNaN(g)) continue;
                    if (h = c.configuration_check.optional[f](g), void 0 === h) throw new b.Exceptions.ConfigurationError(f, g);
                    k[f] = h
                }
            if (k.connection_recovery_max_interval < k.connection_recovery_min_interval) throw new b.Exceptions.ConfigurationError("connection_recovery_max_interval", k.connection_recovery_max_interval);
            0 === k.display_name && (k.display_name = "0"), k.instance_id = b.Utils.newUUID(), k.websdk_id = b.Utils.createRandomToken(5), i = k.uri.clone(), i.user = null, k.hostport_params = i.toString().replace(/^sip:/i, ""), k.authorization_user || (k.authorization_user = k.uri.user), k.registrar_server || (j = k.uri.clone(), j.user = null, k.registrar_server = j), k.no_answer_timeout = 1e3 * k.no_answer_timeout, k.hack_ip_in_contact && (k.via_host = b.Utils.getRandomTestNetIP()), this.contact = {
                pub_gruu: null,
                temp_gruu: null,
                uri: new b.URI("sip", b.Utils.createRandomToken(8), k.via_host, null, {
                    transport: "ws"
                }),
                toString: function(a) {
                    a = a || {};
                    var b = a.anonymous || null,
                        c = a.outbound || null,
                        d = "<";
                    return d += b ? this.temp_gruu || "sip:anonymous@anonymous.invalid;transport=ws" : this.pub_gruu || this.uri.toString(), c && (d += ";ob"), d += ">"
                }
            }, Plivo.logNull(d + "configuration parameters after validation:");
            for (f in k) {
                switch (f) {
                    case "uri":
                    case "registrar_server":
                        Plivo.logNull("· " + f + ": " + k[f]);
                        break;
                    case "password":
                        Plivo.logNull("· " + f + ": NOT SHOWN");
                        break;
                    default:
                        Plivo.logNull("· " + f + ": " + a.JSON.stringify(k[f]))
                }
                c.configuration_skeleton[f].value = k[f]
            }
            Object.defineProperties(this.configuration, c.configuration_skeleton);
            for (f in k) c.configuration_skeleton[f].value = ""
        }, c.configuration_skeleton = function() {
            var a, b, c = {}, d = ["instance_id", "websdk_id", "register_min_expires", "ws_server_max_reconnection", "ws_server_reconnection_timeout", "hostport_params", "uri", "ws_servers", "authorization_user", "connection_recovery_max_interval", "connection_recovery_min_interval", "display_name", "hack_via_tcp", "hack_ip_in_contact", "no_answer_timeout", "password", "register_expires", "registrar_server", "stun_servers", "trace_sip", "turn_servers", "use_preloaded_route", "via_core_value", "via_host"];
            for (a in d) b = d[a], c[b] = {
                value: "",
                writable: !1,
                configurable: !1
            };
            return c.register = {
                value: "",
                writable: !0,
                configurable: !1
            }, c
        }(), c.configuration_check = {
            mandatory: {
                uri: function(a) {
                    var c;
                    return /^sip:/i.test(a) || (a = b.C.SIP + ":" + a), c = b.URI.parse(a), c ? c.user ? c : void 0 : void 0
                },
                ws_servers: function(a) {
                    var c, e, f;
                    if ("string" == typeof a) a = [{
                        ws_uri: a
                    }];
                    else {
                        if (!(a instanceof Array)) return;
                        for (e = a.length, c = 0; e > c; c++) "string" == typeof a[c] && (a[c] = {
                            ws_uri: a[c]
                        })
                    } if (0 === a.length) return !1;
                    for (e = a.length, c = 0; e > c; c++) {
                        if (!a[c].ws_uri) return void Plivo.logNull(d + 'missing "ws_uri" attribute in ws_servers parameter');
                        if (a[c].weight && !Number(a[c].weight)) return void Plivo.logNull(d + '"weight" attribute in ws_servers parameter must be a Number');
                        if (f = b.Grammar.parse(a[c].ws_uri, "absoluteURI"), -1 === f) return void Plivo.logNull(d + 'invalid "ws_uri" attribute in ws_servers parameter: ' + a[c].ws_uri);
                        if ("wss" !== f.scheme && "ws" !== f.scheme) return void Plivo.logNull(d + "invalid URI scheme in ws_servers parameter: " + f.scheme);
                        a[c].sip_uri = "<sip:" + f.host + (f.port ? ":" + f.port : "") + ";transport=ws;lr>", a[c].weight || (a[c].weight = 0), a[c].status = 0, a[c].scheme = f.scheme.toUpperCase()
                    }
                    return a
                }
            },
            optional: {
                authorization_user: function(a) {
                    return -1 === b.Grammar.parse('"' + a + '"', "quoted_string") ? void 0 : a
                },
                connection_recovery_max_interval: function(c) {
                    var d;
                    return b.Utils.isDecimal(c) && (d = a.Number(c), d > 0) ? d : void 0
                },
                connection_recovery_min_interval: function(c) {
                    var d;
                    return b.Utils.isDecimal(c) && (d = a.Number(c), d > 0) ? d : void 0
                },
                display_name: function(a) {
                    return -1 === b.Grammar.parse('"' + a + '"', "display_name") ? void 0 : a
                },
                hack_via_tcp: function(a) {
                    return "boolean" == typeof a ? a : void 0
                },
                hack_ip_in_contact: function(a) {
                    return "boolean" == typeof a ? a : void 0
                },
                no_answer_timeout: function(c) {
                    var d;
                    return b.Utils.isDecimal(c) && (d = a.Number(c), d > 0) ? d : void 0
                },
                password: function(a) {
                    return String(a)
                },
                register: function(a) {
                    return "boolean" == typeof a ? a : void 0
                },
                register_expires: function(c) {
                    var d;
                    return b.Utils.isDecimal(c) && (d = a.Number(c), d > 0) ? d : void 0
                },
                registrar_server: function(a) {
                    var c;
                    return /^sip:/i.test(a) || (a = b.C.SIP + ":" + a), c = b.URI.parse(a), c ? c.user ? void 0 : c : void 0
                },
                stun_servers: function(a) {
                    var c, d, e;
                    if ("string" == typeof a) a = [a];
                    else if (!(a instanceof Array)) return;
                    for (d = a.length, c = 0; d > c; c++) {
                        if (e = a[c], /^stuns?:/.test(e) || (e = "stun:" + e), -1 === b.Grammar.parse(e, "stun_URI")) return;
                        a[c] = e
                    }
                    return a
                },
                trace_sip: function(a) {
                    return "boolean" == typeof a ? a : void 0
                },
                turn_servers: function(a) {
                    var c, d, e;
                    for (a instanceof Array || (a = [a]), d = a.length, c = 0; d > c; c++) {
                        if (e = a[c], !(e.server && e.username && e.password)) return;
                        if (/^turns?:/.test(e.server) || (e.server = "turn:" + e.server), -1 === b.Grammar.parse(e.server, "turn_URI")) return;
                        if (-1 === b.Grammar.parse(e.username, "user")) return;
                        if (-1 === b.Grammar.parse(e.password, "password")) return
                    }
                    return a
                },
                use_preloaded_route: function(a) {
                    return "boolean" == typeof a ? a : void 0
                }
            }
        }, c.C = e, b.UA = c
    }(b),
    function(b) {
        var c;
        c = {
            str_utf8_length: function(b) {
                return a.unescape(encodeURIComponent(b)).length
            },
            isFunction: function(a) {
                return void 0 !== a ? "[object Function]" === Object.prototype.toString.call(a) ? !0 : !1 : !1
            },
            isDecimal: function(a) {
                return !isNaN(a) && parseFloat(a) === parseInt(a, 10)
            },
            createRandomToken: function(a, b) {
                var c, d, e = "";
                for (b = b || 32, c = 0; a > c; c++) d = Math.random() * b | 0, e += d.toString(b);
                return e
            },
            newTag: function() {
                return b.Utils.createRandomToken(b.UA.C.TAG_LENGTH)
            },
            newUUID: function() {
                var a = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
                    var b = 16 * Math.random() | 0,
                        c = "x" === a ? b : 3 & b | 8;
                    return c.toString(16)
                });
                return a
            },
            hostType: function(a) {
                return a ? (a = b.Grammar.parse(a, "host"), -1 !== a ? a.host_type : void 0) : void 0
            },
            normalizeURI: function(a, c) {
                var d, e, f, g, h = a;
                if (a) {
                    if (a instanceof b.URI) return a;
                    if ("string" == typeof a) {
                        switch (e = a.split("@"), e.length) {
                            case 1:
                                if (!c) throw new b.Exceptions.InvalidTargetError(h);
                                f = a, g = c;
                                break;
                            case 2:
                                f = e[0], g = e[1];
                                break;
                            default:
                                f = e.slice(0, e.length - 1).join("@"), g = e[e.length - 1]
                        }
                        if (f = f.replace(/^(sips?|tel):/i, ""), /^[\-\.\(\)]*\+?[0-9\-\.\(\)]+$/.test(f) && (f = f.replace(/[\-\.\(\)]/g, "")), a = b.C.SIP + ":" + b.Utils.escapeUser(f) + "@" + g, d = b.URI.parse(a)) return d;
                        throw new b.Exceptions.InvalidTargetError(h)
                    }
                    throw new b.Exceptions.InvalidTargetError(h)
                }
                throw new b.Exceptions.InvalidTargetError(h)
            },
            escapeUser: function(b) {
                return a.encodeURIComponent(a.decodeURIComponent(b)).replace(/%3A/gi, ":").replace(/%2B/gi, "+").replace(/%3F/gi, "?").replace(/%2F/gi, "/")
            },
            headerize: function(a) {
                var b, c = {
                        "Call-Id": "Call-ID",
                        Cseq: "CSeq",
                        "Www-Authenticate": "WWW-Authenticate"
                    }, d = a.toLowerCase().replace(/_/g, "-").split("-"),
                    e = "",
                    f = d.length;
                for (b = 0; f > b; b++) 0 !== b && (e += "-"), e += d[b].charAt(0).toUpperCase() + d[b].substring(1);
                return c[e] && (e = c[e]), e
            },
            sipErrorCause: function(a) {
                var c;
                for (c in b.C.SIP_ERROR_CAUSES)
                    if (-1 !== b.C.SIP_ERROR_CAUSES[c].indexOf(a)) return b.C.causes[c];
                return b.C.causes.SIP_FAILURE_CODE
            },
            getRandomTestNetIP: function() {
                function b(b, c) {
                    return a.Math.floor(a.Math.random() * (c - b + 1) + b)
                }
                return "192.0.2." + b(1, 254)
            },
            getAllowedMethods: function(a) {
                var c, d = b.UA.C.ALLOWED_METHODS.toString();
                for (c in b.UA.C.EVENT_METHODS) a.checkEvent(c) && a.listeners(c).length > 0 && (d += "," + b.UA.C.EVENT_METHODS[c]);
                return d
            },
            calculateMD5: function(a) {
                function b(a, b) {
                    return a << b | a >>> 32 - b
                }

                function c(a, b) {
                    var c, d, e, f, g;
                    return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f
                }

                function d(a, b, c) {
                    return a & b | ~a & c
                }

                function e(a, b, c) {
                    return a & c | b & ~c
                }

                function f(a, b, c) {
                    return a ^ b ^ c
                }

                function g(a, b, c) {
                    return b ^ (a | ~c)
                }

                function h(a, e, f, g, h, i, j) {
                    return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e)
                }

                function i(a, d, f, g, h, i, j) {
                    return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d)
                }

                function j(a, d, e, g, h, i, j) {
                    return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d)
                }

                function k(a, d, e, f, h, i, j) {
                    return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d)
                }

                function l(a) {
                    for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = Array(f - 1), h = 0, i = 0; c > i;) b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++;
                    return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g
                }

                function m(a) {
                    var b, c, d = "",
                        e = "";
                    for (c = 0; 3 >= c; c++) b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2);
                    return d
                }

                function n(a) {
                    a = a.replace(/\r\n/g, "\n");
                    for (var b = "", c = 0; c < a.length; c++) {
                        var d = a.charCodeAt(c);
                        128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128))
                    }
                    return b
                }
                var o, p, q, r, s, t, u, v, w, x = [],
                    y = 7,
                    z = 12,
                    A = 17,
                    B = 22,
                    C = 5,
                    D = 9,
                    E = 14,
                    F = 20,
                    G = 4,
                    H = 11,
                    I = 16,
                    J = 23,
                    K = 6,
                    L = 10,
                    M = 15,
                    N = 21;
                for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16) p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s);
                var O = m(t) + m(u) + m(v) + m(w);
                return O.toLowerCase()
            }
        }, b.Utils = c
    }(b),
    function(a) {
        function b() {
            return "sip" !== l.s("to").uri.scheme ? (j(416), !1) : void 0
        }

        function c() {
            return l.to_tag || l.call_id.substr(0, 5) !== m.configuration.websdk_id ? void 0 : (j(482), !1)
        }

        function d() {
            var b = a.Utils.str_utf8_length(l.body),
                c = l.getHeader("content-length");
            return c > b ? (j(400), !1) : void 0
        }

        function e() {
            var b, c, d = l.from_tag,
                e = l.call_id,
                f = l.cseq;
            if (!l.to_tag)
                if (l.method === a.C.INVITE) {
                    if (b = m.transactions.ist[l.via_branch], !b) return;
                    for (c in m.transactions.ist)
                        if (b = m.transactions.ist[c], b.request.from_tag === d && b.request.call_id === e && b.request.cseq === f) return j(482), !1
                } else {
                    if (b = m.transactions.nist[l.via_branch], !b) return;
                    for (c in m.transactions.nist)
                        if (b = m.transactions.nist[c], b.request.from_tag === d && b.request.call_id === e && b.request.cseq === f) return j(482), !1
                }
        }

        function f() {
            return l.countHeader("via") > 1 ? (Plivo.logNull(o + "More than one Via header field present in the response. Dropping the response"), !1) : void 0
        }

        function g() {
            var a = m.configuration.via_host;
            return l.via.host !== a ? (Plivo.logNull(o + "Via host in the response does not match UA Via host value. Dropping the response"), !1) : void 0
        }

        function h() {
            var b = a.Utils.str_utf8_length(l.body),
                c = l.getHeader("content-length");
            return c > b ? (Plivo.logNull(o + "Message body length is lower than the value in Content-Length header field. Dropping the response"), !1) : void 0
        }

        function i() {
            for (var a = ["from", "to", "call_id", "cseq", "via"], b = a.length; b--;)
                if (!l.hasHeader(a[b])) return Plivo.logNull(o + "Missing mandatory header field : " + a[b] + ". Dropping the response"), !1
        }

        function j(b) {
            var c, d = "SIP/2.0 " + b + " " + a.C.REASON_PHRASE[b] + "\r\n",
                e = l.countHeader("via"),
                f = 0;
            for (f; e > f; f++) d += "Via: " + l.getHeader("via", f) + "\r\n";
            c = l.getHeader("To"), l.to_tag || (c += ";tag=" + a.Utils.newTag()), d += "To: " + c + "\r\n", d += "From: " + l.getHeader("From") + "\r\n", d += "Call-ID: " + l.call_id + "\r\n", d += "CSeq: " + l.cseq + " " + l.method + "\r\n", d += "\r\n", n.send(d)
        }
        var k, l, m, n, o = a.name + " | SANITY CHECK | ",
            p = [],
            q = [],
            r = [];
        p.push(b), p.push(c), p.push(d), p.push(e), q.push(f), q.push(g), q.push(h), r.push(i), k = function(b, c, d) {
            var e, f;
            for (l = b, m = c, n = d, e = r.length; e--;)
                if (f = r[e](l), f === !1) return !1;
            if (l instanceof a.IncomingRequest) {
                for (e = p.length; e--;)
                    if (f = p[e](l), f === !1) return !1
            } else if (l instanceof a.IncomingResponse)
                for (e = q.length; e--;)
                    if (f = q[e](l), f === !1) return !1;
            return !0
        }, a.sanityCheck = k
    }(b),
    function(a) {
        var b, c = a.name + " | DIGEST AUTHENTICATION | ";
        b = function(a) {
            this.username = a.configuration.authorization_user, this.password = a.configuration.password, this.cnonce = null, this.nc = 0, this.ncHex = "00000000", this.response = null
        }, b.prototype.authenticate = function(b, d) {
            if (this.algorithm = d.algorithm, this.realm = d.realm, this.nonce = d.nonce, this.opaque = d.opaque, this.stale = d.stale, this.algorithm) {
                if ("MD5" !== this.algorithm) return Plivo.logNull(c + 'challenge with Digest algorithm different than "MD5", authentication aborted'), !1
            } else this.algorithm = "MD5"; if (!this.realm) return Plivo.logNull(c + "challenge without Digest realm, authentication aborted"), !1;
            if (!this.nonce) return Plivo.logNull(c + "challenge without Digest nonce, authentication aborted"), !1;
            if (d.qop)
                if (d.qop.indexOf("auth") > -1) this.qop = "auth";
                else {
                    if (!(d.qop.indexOf("auth-int") > -1)) return Plivo.logNull(c + 'challenge without Digest qop different than "auth" or "auth-int", authentication aborted'), !1;
                    this.qop = "auth-int"
                } else this.qop = null;
            return this.method = b.method, this.uri = b.ruri, this.cnonce = a.Utils.createRandomToken(12), this.nc += 1, this.updateNcHex(), 4294967296 === this.nc && (this.nc = 1, this.ncHex = "00000001"), this.calculateResponse(), !0
        }, b.prototype.calculateResponse = function() {
            var b, c;
            b = a.Utils.calculateMD5(this.username + ":" + this.realm + ":" + this.password), "auth" === this.qop ? (c = a.Utils.calculateMD5(this.method + ":" + this.uri), this.response = a.Utils.calculateMD5(b + ":" + this.nonce + ":" + this.ncHex + ":" + this.cnonce + ":auth:" + c)) : "auth-int" === this.qop ? (c = a.Utils.calculateMD5(this.method + ":" + this.uri + ":" + a.Utils.calculateMD5(this.body ? this.body : "")), this.response = a.Utils.calculateMD5(b + ":" + this.nonce + ":" + this.ncHex + ":" + this.cnonce + ":auth-int:" + c)) : null === this.qop && (c = a.Utils.calculateMD5(this.method + ":" + this.uri), this.response = a.Utils.calculateMD5(b + ":" + this.nonce + ":" + c))
        }, b.prototype.toString = function() {
            var a = [];
            if (!this.response) throw new Error("response field does not exist, cannot generate Authorization header");
            return a.push("algorithm=" + this.algorithm), a.push('username="' + this.username + '"'), a.push('realm="' + this.realm + '"'), a.push('nonce="' + this.nonce + '"'), a.push('uri="' + this.uri + '"'), a.push('response="' + this.response + '"'), this.opaque && a.push('opaque="' + this.opaque + '"'), this.qop && (a.push("qop=" + this.qop), a.push('cnonce="' + this.cnonce + '"'), a.push("nc=" + this.ncHex)), "Digest " + a.join(", ")
        }, b.prototype.updateNcHex = function() {
            var a = Number(this.nc).toString(16);
            this.ncHex = "00000000".substr(0, 8 - a.length) + a
        }, a.DigestAuthentication = b
    }(b),
    function(b) {
        var c;
        c = {}, a.navigator.webkitGetUserMedia ? c.getUserMedia = a.navigator.webkitGetUserMedia.bind(navigator) : a.navigator.mozGetUserMedia ? c.getUserMedia = a.navigator.mozGetUserMedia.bind(navigator) : a.navigator.getUserMedia && (c.getUserMedia = a.navigator.getUserMedia.bind(navigator)), a.webkitRTCPeerConnection ? c.RTCPeerConnection = a.webkitRTCPeerConnection : a.mozRTCPeerConnection ? c.RTCPeerConnection = a.mozRTCPeerConnection : a.RTCPeerConnection && (c.RTCPeerConnection = a.RTCPeerConnection), a.webkitRTCSessionDescription ? c.RTCSessionDescription = a.webkitRTCSessionDescription : a.mozRTCSessionDescription ? c.RTCSessionDescription = a.mozRTCSessionDescription : a.RTCSessionDescription && (c.RTCSessionDescription = a.RTCSessionDescription), c.RTCPeerConnection && c.RTCPeerConnection.prototype && (c.RTCPeerConnection.prototype.getLocalStreams || (c.RTCPeerConnection.prototype.getLocalStreams = function() {
            return this.localStreams
        }, c.RTCPeerConnection.prototype.getRemoteStreams = function() {
            return this.remoteStreams
        })), c.isSupported = c.getUserMedia && c.RTCPeerConnection && c.RTCSessionDescription ? !0 : !1, b.WebRTC = c
    }(b), a.WebSDK = b
}(window), WebSDK.Grammar = function() {
    function a(a) {
        return '"' + a.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"'
    }
    var b = {
        parse: function(b, c) {
            function d(a) {
                fe > de || (de > fe && (fe = de, ge = []), ge.push(a))
            }

            function e() {
                var a;
                return "\r\n" === b.substr(de, 2) ? (a = "\r\n", de += 2) : (a = null, 0 === ee && d('"\\r\\n"')), a
            }

            function f() {
                var a;
                return /^[0-9]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[0-9]")), a
            }

            function g() {
                var a;
                return /^[a-zA-Z]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[a-zA-Z]")), a
            }

            function h() {
                var a;
                return /^[0-9a-fA-F]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[0-9a-fA-F]")), a
            }

            function i() {
                var a;
                return a = l(), null === a && (a = m()), a
            }

            function j() {
                var a;
                return /^[\0-\xFF]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[\\0-\\xFF]")), a
            }

            function k() {
                var a;
                return /^["]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d('["]')), a
            }

            function l() {
                var a;
                return 32 === b.charCodeAt(de) ? (a = " ", de++) : (a = null, 0 === ee && d('" "')), a
            }

            function m() {
                var a;
                return 9 === b.charCodeAt(de) ? (a = "	", de++) : (a = null, 0 === ee && d('"\\t"')), a
            }

            function n() {
                var a;
                return /^[a-zA-Z0-9]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[a-zA-Z0-9]")), a
            }

            function o() {
                var a;
                return 59 === b.charCodeAt(de) ? (a = ";", de++) : (a = null, 0 === ee && d('";"')), null === a && (47 === b.charCodeAt(de) ? (a = "/", de++) : (a = null, 0 === ee && d('"/"')), null === a && (63 === b.charCodeAt(de) ? (a = "?", de++) : (a = null, 0 === ee && d('"?"')), null === a && (58 === b.charCodeAt(de) ? (a = ":", de++) : (a = null, 0 === ee && d('":"')), null === a && (64 === b.charCodeAt(de) ? (a = "@", de++) : (a = null, 0 === ee && d('"@"')), null === a && (38 === b.charCodeAt(de) ? (a = "&", de++) : (a = null, 0 === ee && d('"&"')), null === a && (61 === b.charCodeAt(de) ? (a = "=", de++) : (a = null, 0 === ee && d('"="')), null === a && (43 === b.charCodeAt(de) ? (a = "+", de++) : (a = null, 0 === ee && d('"+"')), null === a && (36 === b.charCodeAt(de) ? (a = "$", de++) : (a = null, 0 === ee && d('"$"')), null === a && (44 === b.charCodeAt(de) ? (a = ",", de++) : (a = null, 0 === ee && d('","'))))))))))), a
            }

            function p() {
                var a;
                return a = n(), null === a && (a = q()), a
            }

            function q() {
                var a;
                return 45 === b.charCodeAt(de) ? (a = "-", de++) : (a = null, 0 === ee && d('"-"')), null === a && (95 === b.charCodeAt(de) ? (a = "_", de++) : (a = null, 0 === ee && d('"_"')), null === a && (46 === b.charCodeAt(de) ? (a = ".", de++) : (a = null, 0 === ee && d('"."')), null === a && (33 === b.charCodeAt(de) ? (a = "!", de++) : (a = null, 0 === ee && d('"!"')), null === a && (126 === b.charCodeAt(de) ? (a = "~", de++) : (a = null, 0 === ee && d('"~"')), null === a && (42 === b.charCodeAt(de) ? (a = "*", de++) : (a = null, 0 === ee && d('"*"')), null === a && (39 === b.charCodeAt(de) ? (a = "'", de++) : (a = null, 0 === ee && d('"\'"')), null === a && (40 === b.charCodeAt(de) ? (a = "(", de++) : (a = null, 0 === ee && d('"("')), null === a && (41 === b.charCodeAt(de) ? (a = ")", de++) : (a = null, 0 === ee && d('")"')))))))))), a
            }

            function r() {
                var a, c, e, f;
                return f = de, 37 === b.charCodeAt(de) ? (a = "%", de++) : (a = null, 0 === ee && d('"%"')), null !== a ? (c = h(), null !== c ? (e = h(), null !== e ? a = [a, c, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function s() {
                var a, b, c, d, f, g;
                for (d = de, f = de, g = de, a = [], b = i(); null !== b;) a.push(b), b = i();
                if (null !== a ? (b = e(), null !== b ? a = [a, b] : (a = null, de = g)) : (a = null, de = g), a = null !== a ? a : "", null !== a) {
                    if (c = i(), null !== c)
                        for (b = []; null !== c;) b.push(c), c = i();
                    else b = null;
                    null !== b ? a = [a, b] : (a = null, de = f)
                } else a = null, de = f;
                return null !== a && (a = function() {
                    return " "
                }(d)), null === a && (de = d), a
            }

            function t() {
                var a;
                return a = s(), a = null !== a ? a : ""
            }

            function u() {
                var a, c, e, f, g;
                for (f = de, g = de, a = [], c = l(), null === c && (c = m()); null !== c;) a.push(c), c = l(), null === c && (c = m());
                return null !== a ? (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = t(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function() {
                    return ":"
                }(f)), null === a && (de = f), a
            }

            function v() {
                var a, c, d, e, f, g, h;
                if (f = de, g = de, c = w(), null !== c)
                    for (a = []; null !== c;) a.push(c), c = w();
                else a = null; if (null !== a) {
                    for (c = [], h = de, d = [], e = s(); null !== e;) d.push(e), e = s();
                    for (null !== d ? (e = w(), null !== e ? d = [d, e] : (d = null, de = h)) : (d = null, de = h); null !== d;) {
                        for (c.push(d), h = de, d = [], e = s(); null !== e;) d.push(e), e = s();
                        null !== d ? (e = w(), null !== e ? d = [d, e] : (d = null, de = h)) : (d = null, de = h)
                    }
                    null !== c ? a = [a, c] : (a = null, de = g)
                } else a = null, de = g;
                return null !== a && (a = function(a) {
                    return b.substring(de, a)
                }(f)), null === a && (de = f), a
            }

            function w() {
                var a;
                return /^[!-~]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[!-~]")), null === a && (a = x()), a
            }

            function x() {
                var a;
                return /^[\x80-\uFFFF]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[\\x80-\\uFFFF]")), a
            }

            function y() {
                var a;
                return /^[\x80-\xBF]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[\\x80-\\xBF]")), a
            }

            function z() {
                var a;
                return a = f(), null === a && (/^[a-f]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[a-f]"))), a
            }

            function A() {
                var a, c, e;
                if (e = de, c = n(), null === c && (45 === b.charCodeAt(de) ? (c = "-", de++) : (c = null, 0 === ee && d('"-"')), null === c && (46 === b.charCodeAt(de) ? (c = ".", de++) : (c = null, 0 === ee && d('"."')), null === c && (33 === b.charCodeAt(de) ? (c = "!", de++) : (c = null, 0 === ee && d('"!"')), null === c && (37 === b.charCodeAt(de) ? (c = "%", de++) : (c = null, 0 === ee && d('"%"')), null === c && (42 === b.charCodeAt(de) ? (c = "*", de++) : (c = null, 0 === ee && d('"*"')), null === c && (95 === b.charCodeAt(de) ? (c = "_", de++) : (c = null, 0 === ee && d('"_"')), null === c && (43 === b.charCodeAt(de) ? (c = "+", de++) : (c = null, 0 === ee && d('"+"')), null === c && (96 === b.charCodeAt(de) ? (c = "`", de++) : (c = null, 0 === ee && d('"`"')), null === c && (39 === b.charCodeAt(de) ? (c = "'", de++) : (c = null, 0 === ee && d('"\'"')), null === c && (126 === b.charCodeAt(de) ? (c = "~", de++) : (c = null, 0 === ee && d('"~"')))))))))))), null !== c)
                    for (a = []; null !== c;) a.push(c), c = n(), null === c && (45 === b.charCodeAt(de) ? (c = "-", de++) : (c = null, 0 === ee && d('"-"')), null === c && (46 === b.charCodeAt(de) ? (c = ".", de++) : (c = null, 0 === ee && d('"."')), null === c && (33 === b.charCodeAt(de) ? (c = "!", de++) : (c = null, 0 === ee && d('"!"')), null === c && (37 === b.charCodeAt(de) ? (c = "%", de++) : (c = null, 0 === ee && d('"%"')), null === c && (42 === b.charCodeAt(de) ? (c = "*", de++) : (c = null, 0 === ee && d('"*"')), null === c && (95 === b.charCodeAt(de) ? (c = "_", de++) : (c = null, 0 === ee && d('"_"')), null === c && (43 === b.charCodeAt(de) ? (c = "+", de++) : (c = null, 0 === ee && d('"+"')), null === c && (96 === b.charCodeAt(de) ? (c = "`", de++) : (c = null, 0 === ee && d('"`"')), null === c && (39 === b.charCodeAt(de) ? (c = "'", de++) : (c = null, 0 === ee && d('"\'"')), null === c && (126 === b.charCodeAt(de) ? (c = "~", de++) : (c = null, 0 === ee && d('"~"'))))))))))));
                else a = null;
                return null !== a && (a = function(a) {
                    return b.substring(de, a)
                }(e)), null === a && (de = e), a
            }

            function B() {
                var a, c, e;
                if (e = de, c = n(), null === c && (45 === b.charCodeAt(de) ? (c = "-", de++) : (c = null, 0 === ee && d('"-"')), null === c && (33 === b.charCodeAt(de) ? (c = "!", de++) : (c = null, 0 === ee && d('"!"')), null === c && (37 === b.charCodeAt(de) ? (c = "%", de++) : (c = null, 0 === ee && d('"%"')), null === c && (42 === b.charCodeAt(de) ? (c = "*", de++) : (c = null, 0 === ee && d('"*"')), null === c && (95 === b.charCodeAt(de) ? (c = "_", de++) : (c = null, 0 === ee && d('"_"')), null === c && (43 === b.charCodeAt(de) ? (c = "+", de++) : (c = null, 0 === ee && d('"+"')), null === c && (96 === b.charCodeAt(de) ? (c = "`", de++) : (c = null, 0 === ee && d('"`"')), null === c && (39 === b.charCodeAt(de) ? (c = "'", de++) : (c = null, 0 === ee && d('"\'"')), null === c && (126 === b.charCodeAt(de) ? (c = "~", de++) : (c = null, 0 === ee && d('"~"'))))))))))), null !== c)
                    for (a = []; null !== c;) a.push(c), c = n(), null === c && (45 === b.charCodeAt(de) ? (c = "-", de++) : (c = null, 0 === ee && d('"-"')), null === c && (33 === b.charCodeAt(de) ? (c = "!", de++) : (c = null, 0 === ee && d('"!"')), null === c && (37 === b.charCodeAt(de) ? (c = "%", de++) : (c = null, 0 === ee && d('"%"')), null === c && (42 === b.charCodeAt(de) ? (c = "*", de++) : (c = null, 0 === ee && d('"*"')), null === c && (95 === b.charCodeAt(de) ? (c = "_", de++) : (c = null, 0 === ee && d('"_"')), null === c && (43 === b.charCodeAt(de) ? (c = "+", de++) : (c = null, 0 === ee && d('"+"')), null === c && (96 === b.charCodeAt(de) ? (c = "`", de++) : (c = null, 0 === ee && d('"`"')), null === c && (39 === b.charCodeAt(de) ? (c = "'", de++) : (c = null, 0 === ee && d('"\'"')), null === c && (126 === b.charCodeAt(de) ? (c = "~", de++) : (c = null, 0 === ee && d('"~"')))))))))));
                else a = null;
                return null !== a && (a = function(a) {
                    return b.substring(de, a)
                }(e)), null === a && (de = e), a
            }

            function C() {
                var a;
                return 40 === b.charCodeAt(de) ? (a = "(", de++) : (a = null, 0 === ee && d('"("')), null === a && (41 === b.charCodeAt(de) ? (a = ")", de++) : (a = null, 0 === ee && d('")"')), null === a && (60 === b.charCodeAt(de) ? (a = "<", de++) : (a = null, 0 === ee && d('"<"')), null === a && (62 === b.charCodeAt(de) ? (a = ">", de++) : (a = null, 0 === ee && d('">"')), null === a && (64 === b.charCodeAt(de) ? (a = "@", de++) : (a = null, 0 === ee && d('"@"')), null === a && (44 === b.charCodeAt(de) ? (a = ",", de++) : (a = null, 0 === ee && d('","')), null === a && (59 === b.charCodeAt(de) ? (a = ";", de++) : (a = null, 0 === ee && d('";"')), null === a && (58 === b.charCodeAt(de) ? (a = ":", de++) : (a = null, 0 === ee && d('":"')), null === a && (92 === b.charCodeAt(de) ? (a = "\\", de++) : (a = null, 0 === ee && d('"\\\\"')), null === a && (a = k(), null === a && (47 === b.charCodeAt(de) ? (a = "/", de++) : (a = null, 0 === ee && d('"/"')), null === a && (91 === b.charCodeAt(de) ? (a = "[", de++) : (a = null, 0 === ee && d('"["')), null === a && (93 === b.charCodeAt(de) ? (a = "]", de++) : (a = null, 0 === ee && d('"]"')), null === a && (63 === b.charCodeAt(de) ? (a = "?", de++) : (a = null, 0 === ee && d('"?"')), null === a && (61 === b.charCodeAt(de) ? (a = "=", de++) : (a = null, 0 === ee && d('"="')), null === a && (123 === b.charCodeAt(de) ? (a = "{", de++) : (a = null, 0 === ee && d('"{"')), null === a && (125 === b.charCodeAt(de) ? (a = "}", de++) : (a = null, 0 === ee && d('"}"')), null === a && (a = l(), null === a && (a = m())))))))))))))))))), a
            }

            function D() {
                var a, c, e;
                if (e = de, c = n(), null === c && (45 === b.charCodeAt(de) ? (c = "-", de++) : (c = null, 0 === ee && d('"-"')), null === c && (46 === b.charCodeAt(de) ? (c = ".", de++) : (c = null, 0 === ee && d('"."')), null === c && (33 === b.charCodeAt(de) ? (c = "!", de++) : (c = null, 0 === ee && d('"!"')), null === c && (37 === b.charCodeAt(de) ? (c = "%", de++) : (c = null, 0 === ee && d('"%"')), null === c && (42 === b.charCodeAt(de) ? (c = "*", de++) : (c = null, 0 === ee && d('"*"')), null === c && (95 === b.charCodeAt(de) ? (c = "_", de++) : (c = null, 0 === ee && d('"_"')), null === c && (43 === b.charCodeAt(de) ? (c = "+", de++) : (c = null, 0 === ee && d('"+"')), null === c && (96 === b.charCodeAt(de) ? (c = "`", de++) : (c = null, 0 === ee && d('"`"')), null === c && (39 === b.charCodeAt(de) ? (c = "'", de++) : (c = null, 0 === ee && d('"\'"')), null === c && (126 === b.charCodeAt(de) ? (c = "~", de++) : (c = null, 0 === ee && d('"~"')), null === c && (40 === b.charCodeAt(de) ? (c = "(", de++) : (c = null, 0 === ee && d('"("')), null === c && (41 === b.charCodeAt(de) ? (c = ")", de++) : (c = null, 0 === ee && d('")"')), null === c && (60 === b.charCodeAt(de) ? (c = "<", de++) : (c = null, 0 === ee && d('"<"')), null === c && (62 === b.charCodeAt(de) ? (c = ">", de++) : (c = null, 0 === ee && d('">"')), null === c && (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null === c && (92 === b.charCodeAt(de) ? (c = "\\", de++) : (c = null, 0 === ee && d('"\\\\"')), null === c && (c = k(), null === c && (47 === b.charCodeAt(de) ? (c = "/", de++) : (c = null, 0 === ee && d('"/"')), null === c && (91 === b.charCodeAt(de) ? (c = "[", de++) : (c = null, 0 === ee && d('"["')), null === c && (93 === b.charCodeAt(de) ? (c = "]", de++) : (c = null, 0 === ee && d('"]"')), null === c && (63 === b.charCodeAt(de) ? (c = "?", de++) : (c = null, 0 === ee && d('"?"')), null === c && (123 === b.charCodeAt(de) ? (c = "{", de++) : (c = null, 0 === ee && d('"{"')), null === c && (125 === b.charCodeAt(de) ? (c = "}", de++) : (c = null, 0 === ee && d('"}"'))))))))))))))))))))))))), null !== c)
                    for (a = []; null !== c;) a.push(c), c = n(), null === c && (45 === b.charCodeAt(de) ? (c = "-", de++) : (c = null, 0 === ee && d('"-"')), null === c && (46 === b.charCodeAt(de) ? (c = ".", de++) : (c = null, 0 === ee && d('"."')), null === c && (33 === b.charCodeAt(de) ? (c = "!", de++) : (c = null, 0 === ee && d('"!"')), null === c && (37 === b.charCodeAt(de) ? (c = "%", de++) : (c = null, 0 === ee && d('"%"')), null === c && (42 === b.charCodeAt(de) ? (c = "*", de++) : (c = null, 0 === ee && d('"*"')), null === c && (95 === b.charCodeAt(de) ? (c = "_", de++) : (c = null, 0 === ee && d('"_"')), null === c && (43 === b.charCodeAt(de) ? (c = "+", de++) : (c = null, 0 === ee && d('"+"')), null === c && (96 === b.charCodeAt(de) ? (c = "`", de++) : (c = null, 0 === ee && d('"`"')), null === c && (39 === b.charCodeAt(de) ? (c = "'", de++) : (c = null, 0 === ee && d('"\'"')), null === c && (126 === b.charCodeAt(de) ? (c = "~", de++) : (c = null, 0 === ee && d('"~"')), null === c && (40 === b.charCodeAt(de) ? (c = "(", de++) : (c = null, 0 === ee && d('"("')), null === c && (41 === b.charCodeAt(de) ? (c = ")", de++) : (c = null, 0 === ee && d('")"')), null === c && (60 === b.charCodeAt(de) ? (c = "<", de++) : (c = null, 0 === ee && d('"<"')), null === c && (62 === b.charCodeAt(de) ? (c = ">", de++) : (c = null, 0 === ee && d('">"')), null === c && (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null === c && (92 === b.charCodeAt(de) ? (c = "\\", de++) : (c = null, 0 === ee && d('"\\\\"')), null === c && (c = k(), null === c && (47 === b.charCodeAt(de) ? (c = "/", de++) : (c = null, 0 === ee && d('"/"')), null === c && (91 === b.charCodeAt(de) ? (c = "[", de++) : (c = null, 0 === ee && d('"["')), null === c && (93 === b.charCodeAt(de) ? (c = "]", de++) : (c = null, 0 === ee && d('"]"')), null === c && (63 === b.charCodeAt(de) ? (c = "?", de++) : (c = null, 0 === ee && d('"?"')), null === c && (123 === b.charCodeAt(de) ? (c = "{", de++) : (c = null, 0 === ee && d('"{"')), null === c && (125 === b.charCodeAt(de) ? (c = "}", de++) : (c = null, 0 === ee && d('"}"')))))))))))))))))))))))));
                else a = null;
                return null !== a && (a = function(a) {
                    return b.substring(de, a)
                }(e)), null === a && (de = e), a
            }

            function E() {
                var a, c, e, f, g;
                return f = de, g = de, a = t(), null !== a ? (42 === b.charCodeAt(de) ? (c = "*", de++) : (c = null, 0 === ee && d('"*"')), null !== c ? (e = t(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function() {
                    return "*"
                }(f)), null === a && (de = f), a
            }

            function F() {
                var a, c, e, f, g;
                return f = de, g = de, a = t(), null !== a ? (47 === b.charCodeAt(de) ? (c = "/", de++) : (c = null, 0 === ee && d('"/"')), null !== c ? (e = t(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function() {
                    return "/"
                }(f)), null === a && (de = f), a
            }

            function G() {
                var a, c, e, f, g;
                return f = de, g = de, a = t(), null !== a ? (61 === b.charCodeAt(de) ? (c = "=", de++) : (c = null, 0 === ee && d('"="')), null !== c ? (e = t(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function() {
                    return "="
                }(f)), null === a && (de = f), a
            }

            function H() {
                var a, c, e, f, g;
                return f = de, g = de, a = t(), null !== a ? (40 === b.charCodeAt(de) ? (c = "(", de++) : (c = null, 0 === ee && d('"("')), null !== c ? (e = t(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function() {
                    return "("
                }(f)), null === a && (de = f), a
            }

            function I() {
                var a, c, e, f, g;
                return f = de, g = de, a = t(), null !== a ? (41 === b.charCodeAt(de) ? (c = ")", de++) : (c = null, 0 === ee && d('")"')), null !== c ? (e = t(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function() {
                    return ")"
                }(f)), null === a && (de = f), a
            }

            function J() {
                var a, c, e, f;
                return e = de, f = de, 62 === b.charCodeAt(de) ? (a = ">", de++) : (a = null, 0 === ee && d('">"')), null !== a ? (c = t(), null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), null !== a && (a = function() {
                    return ">"
                }(e)), null === a && (de = e), a
            }

            function K() {
                var a, c, e, f;
                return e = de, f = de, a = t(), null !== a ? (60 === b.charCodeAt(de) ? (c = "<", de++) : (c = null, 0 === ee && d('"<"')), null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), null !== a && (a = function() {
                    return "<"
                }(e)), null === a && (de = e), a
            }

            function L() {
                var a, c, e, f, g;
                return f = de, g = de, a = t(), null !== a ? (44 === b.charCodeAt(de) ? (c = ",", de++) : (c = null, 0 === ee && d('","')), null !== c ? (e = t(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function() {
                    return ","
                }(f)), null === a && (de = f), a
            }

            function M() {
                var a, c, e, f, g;
                return f = de, g = de, a = t(), null !== a ? (59 === b.charCodeAt(de) ? (c = ";", de++) : (c = null, 0 === ee && d('";"')), null !== c ? (e = t(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function() {
                    return ";"
                }(f)), null === a && (de = f), a
            }

            function N() {
                var a, c, e, f, g;
                return f = de, g = de, a = t(), null !== a ? (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = t(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function() {
                    return ":"
                }(f)), null === a && (de = f), a
            }

            function O() {
                var a, b, c, d;
                return c = de, d = de, a = t(), null !== a ? (b = k(), null !== b ? a = [a, b] : (a = null, de = d)) : (a = null, de = d), null !== a && (a = function() {
                    return '"'
                }(c)), null === a && (de = c), a
            }

            function P() {
                var a, b, c, d;
                return c = de, d = de, a = k(), null !== a ? (b = t(), null !== b ? a = [a, b] : (a = null, de = d)) : (a = null, de = d), null !== a && (a = function() {
                    return '"'
                }(c)), null === a && (de = c), a
            }

            function Q() {
                var a, b, c, d;
                if (d = de, a = H(), null !== a) {
                    for (b = [], c = R(), null === c && (c = V(), null === c && (c = Q())); null !== c;) b.push(c), c = R(), null === c && (c = V(), null === c && (c = Q()));
                    null !== b ? (c = I(), null !== c ? a = [a, b, c] : (a = null, de = d)) : (a = null, de = d)
                } else a = null, de = d;
                return a
            }

            function R() {
                var a;
                return /^[!-']/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[!-']")), null === a && (/^[*-[]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[*-[]")), null === a && (/^[\]-~]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[\\]-~]")), null === a && (a = x(), null === a && (a = s())))), a
            }

            function S() {
                var a, c, d, e, f, g;
                if (f = de, g = de, a = t(), null !== a)
                    if (c = k(), null !== c) {
                        for (d = [], e = U(), null === e && (e = V()); null !== e;) d.push(e), e = U(), null === e && (e = V());
                        null !== d ? (e = k(), null !== e ? a = [a, c, d, e] : (a = null, de = g)) : (a = null, de = g)
                    } else a = null, de = g;
                    else a = null, de = g;
                return null !== a && (a = function(a) {
                    return b.substring(de, a)
                }(f)), null === a && (de = f), a
            }

            function T() {
                var a, c, d, e, f, g;
                if (f = de, g = de, a = t(), null !== a)
                    if (c = k(), null !== c) {
                        for (d = [], e = U(), null === e && (e = V()); null !== e;) d.push(e), e = U(), null === e && (e = V());
                        null !== d ? (e = k(), null !== e ? a = [a, c, d, e] : (a = null, de = g)) : (a = null, de = g)
                    } else a = null, de = g;
                    else a = null, de = g;
                return null !== a && (a = function(a) {
                    return b.substring(de - 1, a + 1)
                }(f)), null === a && (de = f), a
            }

            function U() {
                var a;
                return a = s(), null === a && (33 === b.charCodeAt(de) ? (a = "!", de++) : (a = null, 0 === ee && d('"!"')), null === a && (/^[#-[]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[#-[]")), null === a && (/^[\]-~]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[\\]-~]")), null === a && (a = x())))), a
            }

            function V() {
                var a, c, e;
                return e = de, 92 === b.charCodeAt(de) ? (a = "\\", de++) : (a = null, 0 === ee && d('"\\\\"')), null !== a ? (/^[\0-\t]/.test(b.charAt(de)) ? (c = b.charAt(de), de++) : (c = null, 0 === ee && d("[\\0-\\t]")), null === c && (/^[\x0B-\f]/.test(b.charAt(de)) ? (c = b.charAt(de), de++) : (c = null, 0 === ee && d("[\\x0B-\\f]")), null === c && (/^[\x0E-]/.test(b.charAt(de)) ? (c = b.charAt(de), de++) : (c = null, 0 === ee && d("[\\x0E-]")))), null !== c ? a = [a, c] : (a = null, de = e)) : (a = null, de = e), a
            }

            function W() {
                var a, c, e, f, g, h;
                return g = de, h = de, a = Y(), null !== a ? (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = Z(), e = null !== e ? e : "", null !== e ? (f = bb(), null !== f ? a = [a, c, e, f] : (a = null, de = h)) : (a = null, de = h)) : (a = null, de = h)) : (a = null, de = h), null !== a && (a = function() {
                    try {
                        he.uri = new WebSDK.URI(he.scheme, he.user, he.host, he.port), delete he.scheme, delete he.user, delete he.host, delete he.host_type, delete he.port
                    } catch (a) {
                        he = -1
                    }
                }(g)), null === a && (de = g), a
            }

            function X() {
                var a, e, f, g, h, i, j, k;
                return j = de, k = de, a = Y(), null !== a ? (58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = Z(), f = null !== f ? f : "", null !== f ? (g = bb(), null !== g ? (h = nb(), null !== h ? (i = Ab(), i = null !== i ? i : "", null !== i ? a = [a, e, f, g, h, i] : (a = null, de = k)) : (a = null, de = k)) : (a = null, de = k)) : (a = null, de = k)) : (a = null, de = k)) : (a = null, de = k), null !== a && (a = function() {
                    try {
                        he.uri = new WebSDK.URI(he.scheme, he.user, he.host, he.port, he.uri_params, he.uri_headers), delete he.scheme, delete he.user, delete he.host, delete he.host_type, delete he.port, delete he.uri_params, "SIP_URI" === c && (he = he.uri)
                    } catch (a) {
                        he = -1
                    }
                }(j)), null === a && (de = j), a
            }

            function Y() {
                var a, c;
                return c = de, "sip" === b.substr(de, 3).toLowerCase() ? (a = b.substr(de, 3), de += 3) : (a = null, 0 === ee && d('"sip"')), null !== a && (a = function(a, b) {
                    he.scheme = b.toLowerCase()
                }(c, a)), null === a && (de = c), a
            }

            function Z() {
                var a, c, e, f, g, h;
                return f = de, g = de, a = $(), null !== a ? (h = de, 58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = ab(), null !== e ? c = [c, e] : (c = null, de = h)) : (c = null, de = h), c = null !== c ? c : "", null !== c ? (64 === b.charCodeAt(de) ? (e = "@", de++) : (e = null, 0 === ee && d('"@"')), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a) {
                    he.user = window.decodeURIComponent(b.substring(de - 1, a))
                }(f)), null === a && (de = f), a
            }

            function $() {
                var a, b;
                if (b = p(), null === b && (b = r(), null === b && (b = _())), null !== b)
                    for (a = []; null !== b;) a.push(b), b = p(), null === b && (b = r(), null === b && (b = _()));
                else a = null;
                return a
            }

            function _() {
                var a;
                return 38 === b.charCodeAt(de) ? (a = "&", de++) : (a = null, 0 === ee && d('"&"')), null === a && (61 === b.charCodeAt(de) ? (a = "=", de++) : (a = null, 0 === ee && d('"="')), null === a && (43 === b.charCodeAt(de) ? (a = "+", de++) : (a = null, 0 === ee && d('"+"')), null === a && (36 === b.charCodeAt(de) ? (a = "$", de++) : (a = null, 0 === ee && d('"$"')), null === a && (44 === b.charCodeAt(de) ? (a = ",", de++) : (a = null, 0 === ee && d('","')), null === a && (59 === b.charCodeAt(de) ? (a = ";", de++) : (a = null, 0 === ee && d('";"')), null === a && (63 === b.charCodeAt(de) ? (a = "?", de++) : (a = null, 0 === ee && d('"?"')), null === a && (47 === b.charCodeAt(de) ? (a = "/", de++) : (a = null, 0 === ee && d('"/"'))))))))), a
            }

            function ab() {
                var a, c, e;
                for (e = de, a = [], c = p(), null === c && (c = r(), null === c && (38 === b.charCodeAt(de) ? (c = "&", de++) : (c = null, 0 === ee && d('"&"')), null === c && (61 === b.charCodeAt(de) ? (c = "=", de++) : (c = null, 0 === ee && d('"="')), null === c && (43 === b.charCodeAt(de) ? (c = "+", de++) : (c = null, 0 === ee && d('"+"')), null === c && (36 === b.charCodeAt(de) ? (c = "$", de++) : (c = null, 0 === ee && d('"$"')), null === c && (44 === b.charCodeAt(de) ? (c = ",", de++) : (c = null, 0 === ee && d('","')))))))); null !== c;) a.push(c), c = p(), null === c && (c = r(), null === c && (38 === b.charCodeAt(de) ? (c = "&", de++) : (c = null, 0 === ee && d('"&"')), null === c && (61 === b.charCodeAt(de) ? (c = "=", de++) : (c = null, 0 === ee && d('"="')), null === c && (43 === b.charCodeAt(de) ? (c = "+", de++) : (c = null, 0 === ee && d('"+"')), null === c && (36 === b.charCodeAt(de) ? (c = "$", de++) : (c = null, 0 === ee && d('"$"')), null === c && (44 === b.charCodeAt(de) ? (c = ",", de++) : (c = null, 0 === ee && d('","'))))))));
                return null !== a && (a = function(a) {
                    he.password = b.substring(de, a)
                }(e)), null === a && (de = e), a
            }

            function bb() {
                var a, c, e, f, g;
                return f = de, a = cb(), null !== a ? (g = de, 58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = mb(), null !== e ? c = [c, e] : (c = null, de = g)) : (c = null, de = g), c = null !== c ? c : "", null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), a
            }

            function cb() {
                var a, c;
                return c = de, a = db(), null === a && (a = kb(), null === a && (a = gb())), null !== a && (a = function(a) {
                    return he.host = b.substring(de, a).toLowerCase(), he.host
                }(c)), null === a && (de = c), a
            }

            function db() {
                var a, c, e, f, g, h;
                for (f = de, g = de, a = [], h = de, c = eb(), null !== c ? (46 === b.charCodeAt(de) ? (e = ".", de++) : (e = null, 0 === ee && d('"."')), null !== e ? c = [c, e] : (c = null, de = h)) : (c = null, de = h); null !== c;) a.push(c), h = de, c = eb(), null !== c ? (46 === b.charCodeAt(de) ? (e = ".", de++) : (e = null, 0 === ee && d('"."')), null !== e ? c = [c, e] : (c = null, de = h)) : (c = null, de = h);
                return null !== a ? (c = fb(), null !== c ? (46 === b.charCodeAt(de) ? (e = ".", de++) : (e = null, 0 === ee && d('"."')), e = null !== e ? e : "", null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a) {
                    return he.host_type = "domain", b.substring(de, a)
                }(f)), null === a && (de = f), a
            }

            function eb() {
                var a, c;
                if (/^[a-zA-Z0-9_\-]/.test(b.charAt(de)) ? (c = b.charAt(de), de++) : (c = null, 0 === ee && d("[a-zA-Z0-9_\\-]")), null !== c)
                    for (a = []; null !== c;) a.push(c), /^[a-zA-Z0-9_\-]/.test(b.charAt(de)) ? (c = b.charAt(de), de++) : (c = null, 0 === ee && d("[a-zA-Z0-9_\\-]"));
                else a = null;
                return a
            }

            function fb() {
                var a, c;
                if (/^[a-zA-Z_\-]/.test(b.charAt(de)) ? (c = b.charAt(de), de++) : (c = null, 0 === ee && d("[a-zA-Z_\\-]")), null !== c)
                    for (a = []; null !== c;) a.push(c), /^[a-zA-Z_\-]/.test(b.charAt(de)) ? (c = b.charAt(de), de++) : (c = null, 0 === ee && d("[a-zA-Z_\\-]"));
                else a = null;
                return a
            }

            function gb() {
                var a, c, e, f, g;
                return f = de, g = de, 91 === b.charCodeAt(de) ? (a = "[", de++) : (a = null, 0 === ee && d('"["')), null !== a ? (c = hb(), null !== c ? (93 === b.charCodeAt(de) ? (e = "]", de++) : (e = null, 0 === ee && d('"]"')), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a) {
                    return he.host_type = "IPv6", b.substring(de, a)
                }(f)), null === a && (de = f), a
            }

            function hb() {
                var a, c, e, f, g, h, i, j, k, l, m, n, o, p, q, r;
                return p = de, q = de, a = ib(), null !== a ? (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = ib(), null !== e ? (58 === b.charCodeAt(de) ? (f = ":", de++) : (f = null, 0 === ee && d('":"')), null !== f ? (g = ib(), null !== g ? (58 === b.charCodeAt(de) ? (h = ":", de++) : (h = null, 0 === ee && d('":"')), null !== h ? (i = ib(), null !== i ? (58 === b.charCodeAt(de) ? (j = ":", de++) : (j = null, 0 === ee && d('":"')), null !== j ? (k = ib(), null !== k ? (58 === b.charCodeAt(de) ? (l = ":", de++) : (l = null, 0 === ee && d('":"')), null !== l ? (m = ib(), null !== m ? (58 === b.charCodeAt(de) ? (n = ":", de++) : (n = null, 0 === ee && d('":"')), null !== n ? (o = jb(), null !== o ? a = [a, c, e, f, g, h, i, j, k, l, m, n, o] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, "::" === b.substr(de, 2) ? (a = "::", de += 2) : (a = null, 0 === ee && d('"::"')), null !== a ? (c = ib(), null !== c ? (58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = ib(), null !== f ? (58 === b.charCodeAt(de) ? (g = ":", de++) : (g = null, 0 === ee && d('":"')), null !== g ? (h = ib(), null !== h ? (58 === b.charCodeAt(de) ? (i = ":", de++) : (i = null, 0 === ee && d('":"')), null !== i ? (j = ib(), null !== j ? (58 === b.charCodeAt(de) ? (k = ":", de++) : (k = null, 0 === ee && d('":"')), null !== k ? (l = ib(), null !== l ? (58 === b.charCodeAt(de) ? (m = ":", de++) : (m = null, 0 === ee && d('":"')), null !== m ? (n = jb(), null !== n ? a = [a, c, e, f, g, h, i, j, k, l, m, n] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, "::" === b.substr(de, 2) ? (a = "::", de += 2) : (a = null, 0 === ee && d('"::"')), null !== a ? (c = ib(), null !== c ? (58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = ib(), null !== f ? (58 === b.charCodeAt(de) ? (g = ":", de++) : (g = null, 0 === ee && d('":"')), null !== g ? (h = ib(), null !== h ? (58 === b.charCodeAt(de) ? (i = ":", de++) : (i = null, 0 === ee && d('":"')), null !== i ? (j = ib(), null !== j ? (58 === b.charCodeAt(de) ? (k = ":", de++) : (k = null, 0 === ee && d('":"')), null !== k ? (l = jb(), null !== l ? a = [a, c, e, f, g, h, i, j, k, l] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, "::" === b.substr(de, 2) ? (a = "::", de += 2) : (a = null, 0 === ee && d('"::"')), null !== a ? (c = ib(), null !== c ? (58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = ib(), null !== f ? (58 === b.charCodeAt(de) ? (g = ":", de++) : (g = null, 0 === ee && d('":"')), null !== g ? (h = ib(), null !== h ? (58 === b.charCodeAt(de) ? (i = ":", de++) : (i = null, 0 === ee && d('":"')), null !== i ? (j = jb(), null !== j ? a = [a, c, e, f, g, h, i, j] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, "::" === b.substr(de, 2) ? (a = "::", de += 2) : (a = null, 0 === ee && d('"::"')), null !== a ? (c = ib(), null !== c ? (58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = ib(), null !== f ? (58 === b.charCodeAt(de) ? (g = ":", de++) : (g = null, 0 === ee && d('":"')), null !== g ? (h = jb(), null !== h ? a = [a, c, e, f, g, h] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, "::" === b.substr(de, 2) ? (a = "::", de += 2) : (a = null, 0 === ee && d('"::"')), null !== a ? (c = ib(), null !== c ? (58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = jb(), null !== f ? a = [a, c, e, f] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, "::" === b.substr(de, 2) ? (a = "::", de += 2) : (a = null, 0 === ee && d('"::"')), null !== a ? (c = jb(), null !== c ? a = [a, c] : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, "::" === b.substr(de, 2) ? (a = "::", de += 2) : (a = null, 0 === ee && d('"::"')), null !== a ? (c = ib(), null !== c ? a = [a, c] : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, a = ib(), null !== a ? ("::" === b.substr(de, 2) ? (c = "::", de += 2) : (c = null, 0 === ee && d('"::"')), null !== c ? (e = ib(), null !== e ? (58 === b.charCodeAt(de) ? (f = ":", de++) : (f = null, 0 === ee && d('":"')), null !== f ? (g = ib(), null !== g ? (58 === b.charCodeAt(de) ? (h = ":", de++) : (h = null, 0 === ee && d('":"')), null !== h ? (i = ib(), null !== i ? (58 === b.charCodeAt(de) ? (j = ":", de++) : (j = null, 0 === ee && d('":"')), null !== j ? (k = ib(), null !== k ? (58 === b.charCodeAt(de) ? (l = ":", de++) : (l = null, 0 === ee && d('":"')), null !== l ? (m = jb(), null !== m ? a = [a, c, e, f, g, h, i, j, k, l, m] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, a = ib(), null !== a ? (r = de, 58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = ib(), null !== e ? c = [c, e] : (c = null, de = r)) : (c = null, de = r), c = null !== c ? c : "", null !== c ? ("::" === b.substr(de, 2) ? (e = "::", de += 2) : (e = null, 0 === ee && d('"::"')), null !== e ? (f = ib(), null !== f ? (58 === b.charCodeAt(de) ? (g = ":", de++) : (g = null, 0 === ee && d('":"')), null !== g ? (h = ib(), null !== h ? (58 === b.charCodeAt(de) ? (i = ":", de++) : (i = null, 0 === ee && d('":"')), null !== i ? (j = ib(), null !== j ? (58 === b.charCodeAt(de) ? (k = ":", de++) : (k = null, 0 === ee && d('":"')), null !== k ? (l = jb(), null !== l ? a = [a, c, e, f, g, h, i, j, k, l] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, a = ib(), null !== a ? (r = de, 58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = ib(), null !== e ? c = [c, e] : (c = null, de = r)) : (c = null, de = r), c = null !== c ? c : "", null !== c ? (r = de, 58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = ib(), null !== f ? e = [e, f] : (e = null, de = r)) : (e = null, de = r), e = null !== e ? e : "", null !== e ? ("::" === b.substr(de, 2) ? (f = "::", de += 2) : (f = null, 0 === ee && d('"::"')), null !== f ? (g = ib(), null !== g ? (58 === b.charCodeAt(de) ? (h = ":", de++) : (h = null, 0 === ee && d('":"')), null !== h ? (i = ib(), null !== i ? (58 === b.charCodeAt(de) ? (j = ":", de++) : (j = null, 0 === ee && d('":"')), null !== j ? (k = jb(), null !== k ? a = [a, c, e, f, g, h, i, j, k] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, a = ib(), null !== a ? (r = de, 58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = ib(), null !== e ? c = [c, e] : (c = null, de = r)) : (c = null, de = r), c = null !== c ? c : "", null !== c ? (r = de, 58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = ib(), null !== f ? e = [e, f] : (e = null, de = r)) : (e = null, de = r), e = null !== e ? e : "", null !== e ? (r = de, 58 === b.charCodeAt(de) ? (f = ":", de++) : (f = null, 0 === ee && d('":"')), null !== f ? (g = ib(), null !== g ? f = [f, g] : (f = null, de = r)) : (f = null, de = r), f = null !== f ? f : "", null !== f ? ("::" === b.substr(de, 2) ? (g = "::", de += 2) : (g = null, 0 === ee && d('"::"')), null !== g ? (h = ib(), null !== h ? (58 === b.charCodeAt(de) ? (i = ":", de++) : (i = null, 0 === ee && d('":"')), null !== i ? (j = jb(), null !== j ? a = [a, c, e, f, g, h, i, j] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, a = ib(), null !== a ? (r = de, 58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = ib(), null !== e ? c = [c, e] : (c = null, de = r)) : (c = null, de = r), c = null !== c ? c : "", null !== c ? (r = de, 58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = ib(), null !== f ? e = [e, f] : (e = null, de = r)) : (e = null, de = r), e = null !== e ? e : "", null !== e ? (r = de, 58 === b.charCodeAt(de) ? (f = ":", de++) : (f = null, 0 === ee && d('":"')), null !== f ? (g = ib(), null !== g ? f = [f, g] : (f = null, de = r)) : (f = null, de = r), f = null !== f ? f : "", null !== f ? (r = de, 58 === b.charCodeAt(de) ? (g = ":", de++) : (g = null, 0 === ee && d('":"')), null !== g ? (h = ib(), null !== h ? g = [g, h] : (g = null, de = r)) : (g = null, de = r), g = null !== g ? g : "", null !== g ? ("::" === b.substr(de, 2) ? (h = "::", de += 2) : (h = null, 0 === ee && d('"::"')), null !== h ? (i = jb(), null !== i ? a = [a, c, e, f, g, h, i] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, a = ib(), null !== a ? (r = de, 58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = ib(), null !== e ? c = [c, e] : (c = null, de = r)) : (c = null, de = r), c = null !== c ? c : "", null !== c ? (r = de, 58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = ib(), null !== f ? e = [e, f] : (e = null, de = r)) : (e = null, de = r), e = null !== e ? e : "", null !== e ? (r = de, 58 === b.charCodeAt(de) ? (f = ":", de++) : (f = null, 0 === ee && d('":"')), null !== f ? (g = ib(), null !== g ? f = [f, g] : (f = null, de = r)) : (f = null, de = r), f = null !== f ? f : "", null !== f ? (r = de, 58 === b.charCodeAt(de) ? (g = ":", de++) : (g = null, 0 === ee && d('":"')), null !== g ? (h = ib(), null !== h ? g = [g, h] : (g = null, de = r)) : (g = null, de = r), g = null !== g ? g : "", null !== g ? (r = de, 58 === b.charCodeAt(de) ? (h = ":", de++) : (h = null, 0 === ee && d('":"')), null !== h ? (i = ib(), null !== i ? h = [h, i] : (h = null, de = r)) : (h = null, de = r), h = null !== h ? h : "", null !== h ? ("::" === b.substr(de, 2) ? (i = "::", de += 2) : (i = null, 0 === ee && d('"::"')), null !== i ? (j = ib(), null !== j ? a = [a, c, e, f, g, h, i, j] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q), null === a && (q = de, a = ib(), null !== a ? (r = de, 58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = ib(), null !== e ? c = [c, e] : (c = null, de = r)) : (c = null, de = r), c = null !== c ? c : "", null !== c ? (r = de, 58 === b.charCodeAt(de) ? (e = ":", de++) : (e = null, 0 === ee && d('":"')), null !== e ? (f = ib(), null !== f ? e = [e, f] : (e = null, de = r)) : (e = null, de = r), e = null !== e ? e : "", null !== e ? (r = de, 58 === b.charCodeAt(de) ? (f = ":", de++) : (f = null, 0 === ee && d('":"')), null !== f ? (g = ib(), null !== g ? f = [f, g] : (f = null, de = r)) : (f = null, de = r), f = null !== f ? f : "", null !== f ? (r = de, 58 === b.charCodeAt(de) ? (g = ":", de++) : (g = null, 0 === ee && d('":"')), null !== g ? (h = ib(), null !== h ? g = [g, h] : (g = null, de = r)) : (g = null, de = r), g = null !== g ? g : "", null !== g ? (r = de, 58 === b.charCodeAt(de) ? (h = ":", de++) : (h = null, 0 === ee && d('":"')), null !== h ? (i = ib(), null !== i ? h = [h, i] : (h = null, de = r)) : (h = null, de = r), h = null !== h ? h : "", null !== h ? (r = de, 58 === b.charCodeAt(de) ? (i = ":", de++) : (i = null, 0 === ee && d('":"')), null !== i ? (j = ib(), null !== j ? i = [i, j] : (i = null, de = r)) : (i = null, de = r), i = null !== i ? i : "", null !== i ? ("::" === b.substr(de, 2) ? (j = "::", de += 2) : (j = null, 0 === ee && d('"::"')), null !== j ? a = [a, c, e, f, g, h, i, j] : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q)) : (a = null, de = q))))))))))))))), null !== a && (a = function(a) {
                    return he.host_type = "IPv6", b.substring(de, a)
                }(p)), null === a && (de = p), a
            }

            function ib() {
                var a, b, c, d, e;
                return e = de, a = h(), null !== a ? (b = h(), b = null !== b ? b : "", null !== b ? (c = h(), c = null !== c ? c : "", null !== c ? (d = h(), d = null !== d ? d : "", null !== d ? a = [a, b, c, d] : (a = null, de = e)) : (a = null, de = e)) : (a = null, de = e)) : (a = null, de = e), a
            }

            function jb() {
                var a, c, e, f;
                return f = de, a = ib(), null !== a ? (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = ib(), null !== e ? a = [a, c, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), null === a && (a = kb()), a
            }

            function kb() {
                var a, c, e, f, g, h, i, j, k;
                return j = de, k = de, a = lb(), null !== a ? (46 === b.charCodeAt(de) ? (c = ".", de++) : (c = null, 0 === ee && d('"."')), null !== c ? (e = lb(), null !== e ? (46 === b.charCodeAt(de) ? (f = ".", de++) : (f = null, 0 === ee && d('"."')), null !== f ? (g = lb(), null !== g ? (46 === b.charCodeAt(de) ? (h = ".", de++) : (h = null, 0 === ee && d('"."')), null !== h ? (i = lb(), null !== i ? a = [a, c, e, f, g, h, i] : (a = null, de = k)) : (a = null, de = k)) : (a = null, de = k)) : (a = null, de = k)) : (a = null, de = k)) : (a = null, de = k)) : (a = null, de = k), null !== a && (a = function(a) {
                    return he.host_type = "IPv4", b.substring(de, a)
                }(j)), null === a && (de = j), a
            }

            function lb() {
                var a, c, e, g;
                return g = de, "25" === b.substr(de, 2) ? (a = "25", de += 2) : (a = null, 0 === ee && d('"25"')), null !== a ? (/^[0-5]/.test(b.charAt(de)) ? (c = b.charAt(de), de++) : (c = null, 0 === ee && d("[0-5]")), null !== c ? a = [a, c] : (a = null, de = g)) : (a = null, de = g), null === a && (g = de, 50 === b.charCodeAt(de) ? (a = "2", de++) : (a = null, 0 === ee && d('"2"')), null !== a ? (/^[0-4]/.test(b.charAt(de)) ? (c = b.charAt(de), de++) : (c = null, 0 === ee && d("[0-4]")), null !== c ? (e = f(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null === a && (g = de, 49 === b.charCodeAt(de) ? (a = "1", de++) : (a = null, 0 === ee && d('"1"')), null !== a ? (c = f(), null !== c ? (e = f(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null === a && (g = de, /^[1-9]/.test(b.charAt(de)) ? (a = b.charAt(de), de++) : (a = null, 0 === ee && d("[1-9]")), null !== a ? (c = f(), null !== c ? a = [a, c] : (a = null, de = g)) : (a = null, de = g), null === a && (a = f())))), a
            }

            function mb() {
                var a, b, c, d, e, g, h;
                return g = de, h = de, a = f(), a = null !== a ? a : "", null !== a ? (b = f(), b = null !== b ? b : "", null !== b ? (c = f(), c = null !== c ? c : "", null !== c ? (d = f(), d = null !== d ? d : "", null !== d ? (e = f(), e = null !== e ? e : "", null !== e ? a = [a, b, c, d, e] : (a = null, de = h)) : (a = null, de = h)) : (a = null, de = h)) : (a = null, de = h)) : (a = null, de = h), null !== a && (a = function(a, b) {
                    return b = parseInt(b.join("")), he.port = b, b
                }(g, a)), null === a && (de = g), a
            }

            function nb() {
                var a, c, e, f;
                for (a = [], f = de, 59 === b.charCodeAt(de) ? (c = ";", de++) : (c = null, 0 === ee && d('";"')), null !== c ? (e = ob(), null !== e ? c = [c, e] : (c = null, de = f)) : (c = null, de = f); null !== c;) a.push(c), f = de, 59 === b.charCodeAt(de) ? (c = ";", de++) : (c = null, 0 === ee && d('";"')), null !== c ? (e = ob(), null !== e ? c = [c, e] : (c = null, de = f)) : (c = null, de = f);
                return a
            }

            function ob() {
                var a;
                return a = pb(), null === a && (a = qb(), null === a && (a = rb(), null === a && (a = sb(), null === a && (a = tb(), null === a && (a = ub(), null === a && (a = vb())))))), a
            }

            function pb() {
                var a, c, e, f;
                return e = de, f = de, "transport=" === b.substr(de, 10).toLowerCase() ? (a = b.substr(de, 10), de += 10) : (a = null, 0 === ee && d('"transport="')), null !== a ? ("udp" === b.substr(de, 3).toLowerCase() ? (c = b.substr(de, 3), de += 3) : (c = null, 0 === ee && d('"udp"')), null === c && ("tcp" === b.substr(de, 3).toLowerCase() ? (c = b.substr(de, 3), de += 3) : (c = null, 0 === ee && d('"tcp"')), null === c && ("sctp" === b.substr(de, 4).toLowerCase() ? (c = b.substr(de, 4), de += 4) : (c = null, 0 === ee && d('"sctp"')), null === c && ("tls" === b.substr(de, 3).toLowerCase() ? (c = b.substr(de, 3), de += 3) : (c = null, 0 === ee && d('"tls"')), null === c && (c = A())))), null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), null !== a && (a = function(a, b) {
                    he.uri_params || (he.uri_params = {}), he.uri_params.transport = b.toLowerCase()
                }(e, a[1])), null === a && (de = e), a
            }

            function qb() {
                var a, c, e, f;
                return e = de, f = de, "user=" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"user="')), null !== a ? ("phone" === b.substr(de, 5).toLowerCase() ? (c = b.substr(de, 5), de += 5) : (c = null, 0 === ee && d('"phone"')), null === c && ("ip" === b.substr(de, 2).toLowerCase() ? (c = b.substr(de, 2), de += 2) : (c = null, 0 === ee && d('"ip"')), null === c && (c = A())), null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), null !== a && (a = function(a, b) {
                    he.uri_params || (he.uri_params = {}), he.uri_params.user = b.toLowerCase()
                }(e, a[1])), null === a && (de = e), a
            }

            function rb() {
                var a, c, e, f;
                return e = de, f = de, "method=" === b.substr(de, 7).toLowerCase() ? (a = b.substr(de, 7), de += 7) : (a = null, 0 === ee && d('"method="')), null !== a ? (c = fc(), null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), null !== a && (a = function(a, b) {
                    he.uri_params || (he.uri_params = {}), he.uri_params.method = b
                }(e, a[1])), null === a && (de = e), a
            }

            function sb() {
                var a, c, e, f;
                return e = de, f = de, "ttl=" === b.substr(de, 4).toLowerCase() ? (a = b.substr(de, 4), de += 4) : (a = null, 0 === ee && d('"ttl="')), null !== a ? (c = Od(), null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), null !== a && (a = function(a, b) {
                    he.params || (he.params = {}), he.params.ttl = b
                }(e, a[1])), null === a && (de = e), a
            }

            function tb() {
                var a, c, e, f;
                return e = de, f = de, "maddr=" === b.substr(de, 6).toLowerCase() ? (a = b.substr(de, 6), de += 6) : (a = null, 0 === ee && d('"maddr="')), null !== a ? (c = cb(), null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), null !== a && (a = function(a, b) {
                    he.uri_params || (he.uri_params = {}), he.uri_params.maddr = b
                }(e, a[1])), null === a && (de = e), a
            }

            function ub() {
                var a, c, e, f, g, h;
                return f = de, g = de, "lr" === b.substr(de, 2).toLowerCase() ? (a = b.substr(de, 2), de += 2) : (a = null, 0 === ee && d('"lr"')), null !== a ? (h = de, 61 === b.charCodeAt(de) ? (c = "=", de++) : (c = null, 0 === ee && d('"="')), null !== c ? (e = A(), null !== e ? c = [c, e] : (c = null, de = h)) : (c = null, de = h), c = null !== c ? c : "", null !== c ? a = [a, c] : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function() {
                    he.uri_params || (he.uri_params = {}), he.uri_params.lr = void 0
                }(f)), null === a && (de = f), a
            }

            function vb() {
                var a, c, e, f, g, h;
                return f = de, g = de, a = wb(), null !== a ? (h = de, 61 === b.charCodeAt(de) ? (c = "=", de++) : (c = null, 0 === ee && d('"="')), null !== c ? (e = xb(), null !== e ? c = [c, e] : (c = null, de = h)) : (c = null, de = h), c = null !== c ? c : "", null !== c ? a = [a, c] : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b, c) {
                    he.uri_params || (he.uri_params = {}), c = "undefined" == typeof c ? void 0 : c[1], he.uri_params[b.toLowerCase()] = c && c.toLowerCase()
                }(f, a[0], a[1])), null === a && (de = f), a
            }

            function wb() {
                var a, b, c;
                if (c = de, b = yb(), null !== b)
                    for (a = []; null !== b;) a.push(b), b = yb();
                else a = null;
                return null !== a && (a = function(a, b) {
                    return b.join("")
                }(c, a)), null === a && (de = c), a
            }

            function xb() {
                var a, b, c;
                if (c = de, b = yb(), null !== b)
                    for (a = []; null !== b;) a.push(b), b = yb();
                else a = null;
                return null !== a && (a = function(a, b) {
                    return b.join("")
                }(c, a)), null === a && (de = c), a
            }

            function yb() {
                var a;
                return a = zb(), null === a && (a = p(), null === a && (a = r())), a
            }

            function zb() {
                var a;
                return 91 === b.charCodeAt(de) ? (a = "[", de++) : (a = null, 0 === ee && d('"["')), null === a && (93 === b.charCodeAt(de) ? (a = "]", de++) : (a = null, 0 === ee && d('"]"')), null === a && (47 === b.charCodeAt(de) ? (a = "/", de++) : (a = null, 0 === ee && d('"/"')), null === a && (58 === b.charCodeAt(de) ? (a = ":", de++) : (a = null, 0 === ee && d('":"')), null === a && (38 === b.charCodeAt(de) ? (a = "&", de++) : (a = null, 0 === ee && d('"&"')), null === a && (43 === b.charCodeAt(de) ? (a = "+", de++) : (a = null, 0 === ee && d('"+"')), null === a && (36 === b.charCodeAt(de) ? (a = "$", de++) : (a = null, 0 === ee && d('"$"')))))))), a
            }

            function Ab() {
                var a, c, e, f, g, h, i;
                if (h = de, 63 === b.charCodeAt(de) ? (a = "?", de++) : (a = null, 0 === ee && d('"?"')), null !== a)
                    if (c = Bb(), null !== c) {
                        for (e = [], i = de, 38 === b.charCodeAt(de) ? (f = "&", de++) : (f = null, 0 === ee && d('"&"')), null !== f ? (g = Bb(), null !== g ? f = [f, g] : (f = null, de = i)) : (f = null, de = i); null !== f;) e.push(f), i = de, 38 === b.charCodeAt(de) ? (f = "&", de++) : (f = null, 0 === ee && d('"&"')), null !== f ? (g = Bb(), null !== g ? f = [f, g] : (f = null, de = i)) : (f = null, de = i);
                        null !== e ? a = [a, c, e] : (a = null, de = h)
                    } else a = null, de = h;
                    else a = null, de = h;
                return a
            }

            function Bb() {
                var a, c, e, f, g;
                return f = de, g = de, a = Cb(), null !== a ? (61 === b.charCodeAt(de) ? (c = "=", de++) : (c = null, 0 === ee && d('"="')), null !== c ? (e = Db(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b, c) {
                    b = b.join("").toLowerCase(), c = c.join(""), he.uri_headers || (he.uri_headers = {}), he.uri_headers[b] ? he.uri_headers[b].push(c) : he.uri_headers[b] = [c]
                }(f, a[0], a[2])), null === a && (de = f), a
            }

            function Cb() {
                var a, b;
                if (b = Eb(), null === b && (b = p(), null === b && (b = r())), null !== b)
                    for (a = []; null !== b;) a.push(b), b = Eb(), null === b && (b = p(), null === b && (b = r()));
                else a = null;
                return a
            }

            function Db() {
                var a, b;
                for (a = [], b = Eb(), null === b && (b = p(), null === b && (b = r())); null !== b;) a.push(b), b = Eb(), null === b && (b = p(), null === b && (b = r()));
                return a
            }

            function Eb() {
                var a;
                return 91 === b.charCodeAt(de) ? (a = "[", de++) : (a = null, 0 === ee && d('"["')), null === a && (93 === b.charCodeAt(de) ? (a = "]", de++) : (a = null, 0 === ee && d('"]"')), null === a && (47 === b.charCodeAt(de) ? (a = "/", de++) : (a = null, 0 === ee && d('"/"')), null === a && (63 === b.charCodeAt(de) ? (a = "?", de++) : (a = null, 0 === ee && d('"?"')), null === a && (58 === b.charCodeAt(de) ? (a = ":", de++) : (a = null, 0 === ee && d('":"')), null === a && (43 === b.charCodeAt(de) ? (a = "+", de++) : (a = null, 0 === ee && d('"+"')), null === a && (36 === b.charCodeAt(de) ? (a = "$", de++) : (a = null, 0 === ee && d('"$"')))))))), a
            }

            function Fb() {
                var a;
                return a = gc(), null === a && (a = Gb()), a
            }

            function Gb() {
                var a, b, c, d, e, f;
                return f = de, a = fc(), null !== a ? (b = l(), null !== b ? (c = Hb(), null !== c ? (d = l(), null !== d ? (e = Yb(), null !== e ? a = [a, b, c, d, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function Hb() {
                var a;
                return a = X(), null === a && (a = Ib()), a
            }

            function Ib() {
                var a, c, e, f;
                return f = de, a = Tb(), null !== a ? (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = Jb(), null === e && (e = Mb()), null !== e ? a = [a, c, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function Jb() {
                var a, c, e, f, g;
                return f = de, a = Kb(), null === a && (a = Lb()), null !== a ? (g = de, 63 === b.charCodeAt(de) ? (c = "?", de++) : (c = null, 0 === ee && d('"?"')), null !== c ? (e = Xb(), null !== e ? c = [c, e] : (c = null, de = g)) : (c = null, de = g), c = null !== c ? c : "", null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), a
            }

            function Kb() {
                var a, c, e, f;
                return f = de, "//" === b.substr(de, 2) ? (a = "//", de += 2) : (a = null, 0 === ee && d('"//"')), null !== a ? (c = Ub(), null !== c ? (e = Lb(), e = null !== e ? e : "", null !== e ? a = [a, c, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function Lb() {
                var a, c, e;
                return e = de, 47 === b.charCodeAt(de) ? (a = "/", de++) : (a = null, 0 === ee && d('"/"')), null !== a ? (c = Pb(), null !== c ? a = [a, c] : (a = null, de = e)) : (a = null, de = e), a
            }

            function Mb() {
                var a, b, c, d;
                if (d = de, a = Ob(), null !== a) {
                    for (b = [], c = Nb(); null !== c;) b.push(c), c = Nb();
                    null !== b ? a = [a, b] : (a = null, de = d)
                } else a = null, de = d;
                return a
            }

            function Nb() {
                var a;
                return a = o(), null === a && (a = p(), null === a && (a = r())), a
            }

            function Ob() {
                var a;
                return a = p(), null === a && (a = r(), null === a && (59 === b.charCodeAt(de) ? (a = ";", de++) : (a = null, 0 === ee && d('";"')), null === a && (63 === b.charCodeAt(de) ? (a = "?", de++) : (a = null, 0 === ee && d('"?"')), null === a && (58 === b.charCodeAt(de) ? (a = ":", de++) : (a = null, 0 === ee && d('":"')), null === a && (64 === b.charCodeAt(de) ? (a = "@", de++) : (a = null, 0 === ee && d('"@"')), null === a && (38 === b.charCodeAt(de) ? (a = "&", de++) : (a = null, 0 === ee && d('"&"')), null === a && (61 === b.charCodeAt(de) ? (a = "=", de++) : (a = null, 0 === ee && d('"="')), null === a && (43 === b.charCodeAt(de) ? (a = "+", de++) : (a = null, 0 === ee && d('"+"')), null === a && (36 === b.charCodeAt(de) ? (a = "$", de++) : (a = null, 0 === ee && d('"$"')), null === a && (44 === b.charCodeAt(de) ? (a = ",", de++) : (a = null, 0 === ee && d('","')))))))))))), a
            }

            function Pb() {
                var a, c, e, f, g, h;
                if (g = de, a = Qb(), null !== a) {
                    for (c = [], h = de, 47 === b.charCodeAt(de) ? (e = "/", de++) : (e = null, 0 === ee && d('"/"')), null !== e ? (f = Qb(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h); null !== e;) c.push(e), h = de, 47 === b.charCodeAt(de) ? (e = "/", de++) : (e = null, 0 === ee && d('"/"')), null !== e ? (f = Qb(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h);
                    null !== c ? a = [a, c] : (a = null, de = g)
                } else a = null, de = g;
                return a
            }

            function Qb() {
                var a, c, e, f, g, h;
                for (g = de, a = [], c = Sb(); null !== c;) a.push(c), c = Sb();
                if (null !== a) {
                    for (c = [], h = de, 59 === b.charCodeAt(de) ? (e = ";", de++) : (e = null, 0 === ee && d('";"')), null !== e ? (f = Rb(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h); null !== e;) c.push(e), h = de, 59 === b.charCodeAt(de) ? (e = ";", de++) : (e = null, 0 === ee && d('";"')), null !== e ? (f = Rb(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h);
                    null !== c ? a = [a, c] : (a = null, de = g)
                } else a = null, de = g;
                return a
            }

            function Rb() {
                var a, b;
                for (a = [], b = Sb(); null !== b;) a.push(b), b = Sb();
                return a
            }

            function Sb() {
                var a;
                return a = p(), null === a && (a = r(), null === a && (58 === b.charCodeAt(de) ? (a = ":", de++) : (a = null, 0 === ee && d('":"')), null === a && (64 === b.charCodeAt(de) ? (a = "@", de++) : (a = null, 0 === ee && d('"@"')), null === a && (38 === b.charCodeAt(de) ? (a = "&", de++) : (a = null, 0 === ee && d('"&"')), null === a && (61 === b.charCodeAt(de) ? (a = "=", de++) : (a = null, 0 === ee && d('"="')), null === a && (43 === b.charCodeAt(de) ? (a = "+", de++) : (a = null, 0 === ee && d('"+"')), null === a && (36 === b.charCodeAt(de) ? (a = "$", de++) : (a = null, 0 === ee && d('"$"')), null === a && (44 === b.charCodeAt(de) ? (a = ",", de++) : (a = null, 0 === ee && d('","')))))))))), a
            }

            function Tb() {
                var a, c, e, h, i;
                if (h = de, i = de, a = g(), null !== a) {
                    for (c = [], e = g(), null === e && (e = f(), null === e && (43 === b.charCodeAt(de) ? (e = "+", de++) : (e = null, 0 === ee && d('"+"')), null === e && (45 === b.charCodeAt(de) ? (e = "-", de++) : (e = null, 0 === ee && d('"-"')), null === e && (46 === b.charCodeAt(de) ? (e = ".", de++) : (e = null, 0 === ee && d('"."')))))); null !== e;) c.push(e), e = g(), null === e && (e = f(), null === e && (43 === b.charCodeAt(de) ? (e = "+", de++) : (e = null, 0 === ee && d('"+"')), null === e && (45 === b.charCodeAt(de) ? (e = "-", de++) : (e = null, 0 === ee && d('"-"')), null === e && (46 === b.charCodeAt(de) ? (e = ".", de++) : (e = null, 0 === ee && d('"."'))))));
                    null !== c ? a = [a, c] : (a = null, de = i)
                } else a = null, de = i;
                return null !== a && (a = function(a) {
                    he.scheme = b.substring(de, a)
                }(h)), null === a && (de = h), a
            }

            function Ub() {
                var a;
                return a = Vb(), null === a && (a = Wb()), a
            }

            function Vb() {
                var a, c, e, f;
                return e = de, f = de, a = Z(), null !== a ? (64 === b.charCodeAt(de) ? (c = "@", de++) : (c = null, 0 === ee && d('"@"')), null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), a = null !== a ? a : "", null !== a ? (c = bb(), null !== c ? a = [a, c] : (a = null, de = e)) : (a = null, de = e), a = null !== a ? a : ""
            }

            function Wb() {
                var a, c;
                if (c = p(), null === c && (c = r(), null === c && (36 === b.charCodeAt(de) ? (c = "$", de++) : (c = null, 0 === ee && d('"$"')), null === c && (44 === b.charCodeAt(de) ? (c = ",", de++) : (c = null, 0 === ee && d('","')), null === c && (59 === b.charCodeAt(de) ? (c = ";", de++) : (c = null, 0 === ee && d('";"')), null === c && (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null === c && (64 === b.charCodeAt(de) ? (c = "@", de++) : (c = null, 0 === ee && d('"@"')), null === c && (38 === b.charCodeAt(de) ? (c = "&", de++) : (c = null, 0 === ee && d('"&"')), null === c && (61 === b.charCodeAt(de) ? (c = "=", de++) : (c = null, 0 === ee && d('"="')), null === c && (43 === b.charCodeAt(de) ? (c = "+", de++) : (c = null, 0 === ee && d('"+"'))))))))))), null !== c)
                    for (a = []; null !== c;) a.push(c), c = p(), null === c && (c = r(), null === c && (36 === b.charCodeAt(de) ? (c = "$", de++) : (c = null, 0 === ee && d('"$"')), null === c && (44 === b.charCodeAt(de) ? (c = ",", de++) : (c = null, 0 === ee && d('","')), null === c && (59 === b.charCodeAt(de) ? (c = ";", de++) : (c = null, 0 === ee && d('";"')), null === c && (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null === c && (64 === b.charCodeAt(de) ? (c = "@", de++) : (c = null, 0 === ee && d('"@"')), null === c && (38 === b.charCodeAt(de) ? (c = "&", de++) : (c = null, 0 === ee && d('"&"')), null === c && (61 === b.charCodeAt(de) ? (c = "=", de++) : (c = null, 0 === ee && d('"="')), null === c && (43 === b.charCodeAt(de) ? (c = "+", de++) : (c = null, 0 === ee && d('"+"')))))))))));
                else a = null;
                return a
            }

            function Xb() {
                var a, b;
                for (a = [], b = Nb(); null !== b;) a.push(b), b = Nb();
                return a
            }

            function Yb() {
                var a, c, e, g, h, i, j, k;
                if (j = de, k = de, "sip" === b.substr(de, 3).toLowerCase() ? (a = b.substr(de, 3), de += 3) : (a = null, 0 === ee && d('"SIP"')), null !== a)
                    if (47 === b.charCodeAt(de) ? (c = "/", de++) : (c = null, 0 === ee && d('"/"')), null !== c) {
                        if (g = f(), null !== g)
                            for (e = []; null !== g;) e.push(g), g = f();
                        else e = null; if (null !== e)
                            if (46 === b.charCodeAt(de) ? (g = ".", de++) : (g = null, 0 === ee && d('"."')), null !== g) {
                                if (i = f(), null !== i)
                                    for (h = []; null !== i;) h.push(i), i = f();
                                else h = null;
                                null !== h ? a = [a, c, e, g, h] : (a = null, de = k)
                            } else a = null, de = k;
                            else a = null, de = k
                    } else a = null, de = k;
                    else a = null, de = k;
                return null !== a && (a = function(a) {
                    he.sip_version = b.substring(de, a)
                }(j)), null === a && (de = j), a
            }

            function Zb() {
                var a;
                return "INVITE" === b.substr(de, 6) ? (a = "INVITE", de += 6) : (a = null, 0 === ee && d('"INVITE"')), a
            }

            function $b() {
                var a;
                return "ACK" === b.substr(de, 3) ? (a = "ACK", de += 3) : (a = null, 0 === ee && d('"ACK"')), a
            }

            function _b() {
                var a;
                return "OPTIONS" === b.substr(de, 7) ? (a = "OPTIONS", de += 7) : (a = null, 0 === ee && d('"OPTIONS"')), a
            }

            function ac() {
                var a;
                return "BYE" === b.substr(de, 3) ? (a = "BYE", de += 3) : (a = null, 0 === ee && d('"BYE"')), a
            }

            function bc() {
                var a;
                return "CANCEL" === b.substr(de, 6) ? (a = "CANCEL", de += 6) : (a = null, 0 === ee && d('"CANCEL"')), a
            }

            function cc() {
                var a;
                return "REGISTER" === b.substr(de, 8) ? (a = "REGISTER", de += 8) : (a = null, 0 === ee && d('"REGISTER"')), a
            }

            function dc() {
                var a;
                return "SUBSCRIBE" === b.substr(de, 9) ? (a = "SUBSCRIBE", de += 9) : (a = null, 0 === ee && d('"SUBSCRIBE"')), a
            }

            function ec() {
                var a;
                return "NOTIFY" === b.substr(de, 6) ? (a = "NOTIFY", de += 6) : (a = null, 0 === ee && d('"NOTIFY"')), a
            }

            function fc() {
                var a, c;
                return c = de, a = Zb(), null === a && (a = $b(), null === a && (a = _b(), null === a && (a = ac(), null === a && (a = bc(), null === a && (a = cc(), null === a && (a = dc(), null === a && (a = ec(), null === a && (a = A())))))))), null !== a && (a = function(a) {
                    return he.method = b.substring(de, a), he.method
                }(c)), null === a && (de = c), a
            }

            function gc() {
                var a, b, c, d, e, f;
                return f = de, a = Yb(), null !== a ? (b = l(), null !== b ? (c = hc(), null !== c ? (d = l(), null !== d ? (e = jc(), null !== e ? a = [a, b, c, d, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function hc() {
                var a, b;
                return b = de, a = ic(), null !== a && (a = function(a, b) {
                    he.status_code = parseInt(b.join(""))
                }(b, a)), null === a && (de = b), a
            }

            function ic() {
                var a, b, c, d;
                return d = de, a = f(), null !== a ? (b = f(), null !== b ? (c = f(), null !== c ? a = [a, b, c] : (a = null, de = d)) : (a = null, de = d)) : (a = null, de = d), a
            }

            function jc() {
                var a, c, d;
                for (d = de, a = [], c = o(), null === c && (c = p(), null === c && (c = r(), null === c && (c = x(), null === c && (c = y(), null === c && (c = l(), null === c && (c = m())))))); null !== c;) a.push(c), c = o(), null === c && (c = p(), null === c && (c = r(), null === c && (c = x(), null === c && (c = y(), null === c && (c = l(), null === c && (c = m()))))));
                return null !== a && (a = function(a) {
                    he.reason_phrase = b.substring(de, a)
                }(d)), null === a && (de = d), a
            }

            function kc() {
                var a, b, c, d, e, f;
                if (e = de, a = Rc(), null !== a) {
                    for (b = [], f = de, c = L(), null !== c ? (d = Rc(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f); null !== c;) b.push(c), f = de, c = L(), null !== c ? (d = Rc(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f);
                    null !== b ? a = [a, b] : (a = null, de = e)
                } else a = null, de = e;
                return a
            }

            function lc() {
                var a, c, e, f, g, h;
                return f = de, g = de, a = D(), null !== a ? (h = de, 64 === b.charCodeAt(de) ? (c = "@", de++) : (c = null, 0 === ee && d('"@"')), null !== c ? (e = D(), null !== e ? c = [c, e] : (c = null, de = h)) : (c = null, de = h), c = null !== c ? c : "", null !== c ? a = [a, c] : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a) {
                    he = b.substring(de, a)
                }(f)), null === a && (de = f), a
            }

            function mc() {
                var a, b, c, d, e, f, g;
                if (e = de, a = E(), null === a)
                    if (f = de, a = nc(), null !== a) {
                        for (b = [], g = de, c = L(), null !== c ? (d = nc(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g); null !== c;) b.push(c), g = de, c = L(), null !== c ? (d = nc(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g);
                        null !== b ? a = [a, b] : (a = null, de = f)
                    } else a = null, de = f;
                return null !== a && (a = function() {
                    var a, b;
                    for (b = he.multi_header.length, a = 0; b > a; a++)
                        if (null === he.multi_header[a].parsed) {
                            he = null;
                            break
                        }
                    he = null !== he ? he.multi_header : -1
                }(e)), null === a && (de = e), a
            }

            function nc() {
                var a, b, c, d, e, f, g;
                if (e = de, f = de, a = W(), null === a && (a = oc()), null !== a) {
                    for (b = [], g = de, c = M(), null !== c ? (d = qc(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g); null !== c;) b.push(c), g = de, c = M(), null !== c ? (d = qc(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g);
                    null !== b ? a = [a, b] : (a = null, de = f)
                } else a = null, de = f;
                return null !== a && (a = function(a) {
                    var b;
                    he.multi_header || (he.multi_header = []);
                    try {
                        b = new WebSDK.NameAddrHeader(he.uri, he.display_name, he.params), delete he.uri, delete he.display_name, delete he.params
                    } catch (c) {
                        b = null
                    }
                    he.multi_header.push({
                        possition: de,
                        offset: a,
                        parsed: b
                    })
                }(e)), null === a && (de = e), a
            }

            function oc() {
                var a, b, c, d, e;
                return e = de, a = pc(), a = null !== a ? a : "", null !== a ? (b = K(), null !== b ? (c = X(), null !== c ? (d = J(), null !== d ? a = [a, b, c, d] : (a = null, de = e)) : (a = null, de = e)) : (a = null, de = e)) : (a = null, de = e), a
            }

            function pc() {
                var a, c, d, e, f, g, h;
                if (f = de, g = de, a = A(), null !== a) {
                    for (c = [], h = de, d = s(), null !== d ? (e = A(), null !== e ? d = [d, e] : (d = null, de = h)) : (d = null, de = h); null !== d;) c.push(d), h = de, d = s(), null !== d ? (e = A(), null !== e ? d = [d, e] : (d = null, de = h)) : (d = null, de = h);
                    null !== c ? a = [a, c] : (a = null, de = g)
                } else a = null, de = g;
                return null === a && (a = S()), null !== a && (a = function(a, c) {
                    c = b.substring(de, a).trim(), '"' === c[0] && (c = c.substring(1, c.length - 1)), he.display_name = c
                }(f, a)), null === a && (de = f), a
            }

            function qc() {
                var a;
                return a = rc(), null === a && (a = sc(), null === a && (a = vc())), a
            }

            function rc() {
                var a, c, e, f, g;
                return f = de, g = de, "q" === b.substr(de, 1).toLowerCase() ? (a = b.substr(de, 1), de++) : (a = null, 0 === ee && d('"q"')), null !== a ? (c = G(), null !== c ? (e = uc(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    he.params || (he.params = {}), he.params.q = b
                }(f, a[2])), null === a && (de = f), a
            }

            function sc() {
                var a, c, e, f, g;
                return f = de, g = de, "expires" === b.substr(de, 7).toLowerCase() ? (a = b.substr(de, 7), de += 7) : (a = null, 0 === ee && d('"expires"')), null !== a ? (c = G(), null !== c ? (e = tc(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    he.params || (he.params = {}), he.params.expires = b
                }(f, a[2])), null === a && (de = f), a
            }

            function tc() {
                var a, b, c;
                if (c = de, b = f(), null !== b)
                    for (a = []; null !== b;) a.push(b), b = f();
                else a = null;
                return null !== a && (a = function(a, b) {
                    return parseInt(b.join(""))
                }(c, a)), null === a && (de = c), a
            }

            function uc() {
                var a, c, e, g, h, i, j, k;
                return i = de, j = de, 48 === b.charCodeAt(de) ? (a = "0", de++) : (a = null, 0 === ee && d('"0"')), null !== a ? (k = de, 46 === b.charCodeAt(de) ? (c = ".", de++) : (c = null, 0 === ee && d('"."')), null !== c ? (e = f(), e = null !== e ? e : "", null !== e ? (g = f(), g = null !== g ? g : "", null !== g ? (h = f(), h = null !== h ? h : "", null !== h ? c = [c, e, g, h] : (c = null, de = k)) : (c = null, de = k)) : (c = null, de = k)) : (c = null, de = k), c = null !== c ? c : "", null !== c ? a = [a, c] : (a = null, de = j)) : (a = null, de = j), null !== a && (a = function(a) {
                    return parseFloat(b.substring(de, a))
                }(i)), null === a && (de = i), a
            }

            function vc() {
                var a, b, c, d, e, f;
                return d = de, e = de, a = A(), null !== a ? (f = de, b = G(), null !== b ? (c = wc(), null !== c ? b = [b, c] : (b = null, de = f)) : (b = null, de = f), b = null !== b ? b : "", null !== b ? a = [a, b] : (a = null, de = e)) : (a = null, de = e), null !== a && (a = function(a, b, c) {
                    he.params || (he.params = {}), c = "undefined" == typeof c ? void 0 : c[1], he.params[b.toLowerCase()] = c
                }(d, a[0], a[1])), null === a && (de = d), a
            }

            function wc() {
                var a;
                return a = A(), null === a && (a = cb(), null === a && (a = S())), a
            }

            function xc() {
                var a, b, c, d, e, f;
                if (e = de, a = yc(), null !== a) {
                    for (b = [], f = de, c = M(), null !== c ? (d = zc(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f); null !== c;) b.push(c), f = de, c = M(), null !== c ? (d = zc(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f);
                    null !== b ? a = [a, b] : (a = null, de = e)
                } else a = null, de = e;
                return a
            }

            function yc() {
                var a;
                return "render" === b.substr(de, 6).toLowerCase() ? (a = b.substr(de, 6), de += 6) : (a = null, 0 === ee && d('"render"')), null === a && ("session" === b.substr(de, 7).toLowerCase() ? (a = b.substr(de, 7), de += 7) : (a = null, 0 === ee && d('"session"')), null === a && ("icon" === b.substr(de, 4).toLowerCase() ? (a = b.substr(de, 4), de += 4) : (a = null, 0 === ee && d('"icon"')), null === a && ("alert" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"alert"')), null === a && (a = A())))), a
            }

            function zc() {
                var a;
                return a = Ac(), null === a && (a = vc()), a
            }

            function Ac() {
                var a, c, e, f;
                return f = de, "handling" === b.substr(de, 8).toLowerCase() ? (a = b.substr(de, 8), de += 8) : (a = null, 0 === ee && d('"handling"')), null !== a ? (c = G(), null !== c ? ("optional" === b.substr(de, 8).toLowerCase() ? (e = b.substr(de, 8), de += 8) : (e = null, 0 === ee && d('"optional"')), null === e && ("required" === b.substr(de, 8).toLowerCase() ? (e = b.substr(de, 8), de += 8) : (e = null, 0 === ee && d('"required"')), null === e && (e = A())), null !== e ? a = [a, c, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function Bc() {
                var a, b, c, d, e, f;
                if (e = de, a = A(), null !== a) {
                    for (b = [], f = de, c = L(), null !== c ? (d = A(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f); null !== c;) b.push(c), f = de, c = L(), null !== c ? (d = A(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f);
                    null !== b ? a = [a, b] : (a = null, de = e)
                } else a = null, de = e;
                return a
            }

            function Cc() {
                var a, b, c;
                if (c = de, b = f(), null !== b)
                    for (a = []; null !== b;) a.push(b), b = f();
                else a = null;
                return null !== a && (a = function(a, b) {
                    he = parseInt(b.join(""))
                }(c, a)), null === a && (de = c), a
            }

            function Dc() {
                var a, c;
                return c = de, a = Ec(), null !== a && (a = function(a) {
                    he = b.substring(de, a)
                }(c)), null === a && (de = c), a
            }

            function Ec() {
                var a, b, c, d, e, f, g, h;
                if (g = de, a = Fc(), null !== a)
                    if (b = F(), null !== b)
                        if (c = Kc(), null !== c) {
                            for (d = [], h = de, e = M(), null !== e ? (f = Lc(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h); null !== e;) d.push(e), h = de, e = M(), null !== e ? (f = Lc(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h);
                            null !== d ? a = [a, b, c, d] : (a = null, de = g)
                        } else a = null, de = g;
                        else a = null, de = g;
                        else a = null, de = g;
                return a
            }

            function Fc() {
                var a;
                return a = Gc(), null === a && (a = Hc()), a
            }

            function Gc() {
                var a;
                return "text" === b.substr(de, 4).toLowerCase() ? (a = b.substr(de, 4), de += 4) : (a = null, 0 === ee && d('"text"')), null === a && ("image" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"image"')), null === a && ("audio" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"audio"')), null === a && ("video" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"video"')), null === a && ("application" === b.substr(de, 11).toLowerCase() ? (a = b.substr(de, 11), de += 11) : (a = null, 0 === ee && d('"application"')), null === a && (a = Ic()))))), a
            }

            function Hc() {
                var a;
                return "message" === b.substr(de, 7).toLowerCase() ? (a = b.substr(de, 7), de += 7) : (a = null, 0 === ee && d('"message"')), null === a && ("multipart" === b.substr(de, 9).toLowerCase() ? (a = b.substr(de, 9), de += 9) : (a = null, 0 === ee && d('"multipart"')), null === a && (a = Ic())), a
            }

            function Ic() {
                var a;
                return a = A(), null === a && (a = Jc()), a
            }

            function Jc() {
                var a, c, e;
                return e = de, "x-" === b.substr(de, 2).toLowerCase() ? (a = b.substr(de, 2), de += 2) : (a = null, 0 === ee && d('"x-"')), null !== a ? (c = A(), null !== c ? a = [a, c] : (a = null, de = e)) : (a = null, de = e), a
            }

            function Kc() {
                var a;
                return a = Ic(), null === a && (a = A()), a
            }

            function Lc() {
                var a, b, c, d;
                return d = de, a = A(), null !== a ? (b = G(), null !== b ? (c = Mc(), null !== c ? a = [a, b, c] : (a = null, de = d)) : (a = null, de = d)) : (a = null, de = d), a
            }

            function Mc() {
                var a;
                return a = A(), null === a && (a = S()), a
            }

            function Nc() {
                var a, b, c, d;
                return d = de, a = Oc(), null !== a ? (b = s(), null !== b ? (c = fc(), null !== c ? a = [a, b, c] : (a = null, de = d)) : (a = null, de = d)) : (a = null, de = d), a
            }

            function Oc() {
                var a, b, c;
                if (c = de, b = f(), null !== b)
                    for (a = []; null !== b;) a.push(b), b = f();
                else a = null;
                return null !== a && (a = function(a, b) {
                    he.value = parseInt(b.join(""))
                }(c, a)), null === a && (de = c), a
            }

            function Pc() {
                var a, b;
                return b = de, a = tc(), null !== a && (a = function(a, b) {
                    he = b
                }(b, a)), null === a && (de = b), a
            }

            function Qc() {
                var a, b, c, d, e, f, g;
                if (e = de, f = de, a = Rc(), null !== a) {
                    for (b = [], g = de, c = M(), null !== c ? (d = vc(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g); null !== c;) b.push(c), g = de, c = M(), null !== c ? (d = vc(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g);
                    null !== b ? a = [a, b] : (a = null, de = f)
                } else a = null, de = f;
                return null !== a && (a = function(a, b) {
                    he.event = b.join("").toLowerCase()
                }(e, a[0])), null === a && (de = e), a
            }

            function Rc() {
                var a, c, e, f, g, h;
                if (g = de, a = B(), null !== a) {
                    for (c = [], h = de, 46 === b.charCodeAt(de) ? (e = ".", de++) : (e = null, 0 === ee && d('"."')), null !== e ? (f = B(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h); null !== e;) c.push(e), h = de, 46 === b.charCodeAt(de) ? (e = ".", de++) : (e = null, 0 === ee && d('"."')), null !== e ? (f = B(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h);
                    null !== c ? a = [a, c] : (a = null, de = g)
                } else a = null, de = g;
                return a
            }

            function Sc() {
                var a, b, c, d, e, f, g;
                if (e = de, f = de, a = W(), null === a && (a = oc()), null !== a) {
                    for (b = [], g = de, c = M(), null !== c ? (d = Tc(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g); null !== c;) b.push(c), g = de, c = M(), null !== c ? (d = Tc(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g);
                    null !== b ? a = [a, b] : (a = null, de = f)
                } else a = null, de = f;
                return null !== a && (a = function() {
                    var a = he.tag;
                    try {
                        he = new WebSDK.NameAddrHeader(he.uri, he.display_name, he.params), a && he.setParam("tag", a)
                    } catch (b) {
                        he = -1
                    }
                }(e)), null === a && (de = e), a
            }

            function Tc() {
                var a;
                return a = Uc(), null === a && (a = vc()), a
            }

            function Uc() {
                var a, c, e, f, g;
                return f = de, g = de, "tag" === b.substr(de, 3).toLowerCase() ? (a = b.substr(de, 3), de += 3) : (a = null, 0 === ee && d('"tag"')), null !== a ? (c = G(), null !== c ? (e = A(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    he.tag = b
                }(f, a[2])), null === a && (de = f), a
            }

            function Vc() {
                var a, b, c;
                if (c = de, b = f(), null !== b)
                    for (a = []; null !== b;) a.push(b), b = f();
                else a = null;
                return null !== a && (a = function(a, b) {
                    he = parseInt(b.join(""))
                }(c, a)), null === a && (de = c), a
            }

            function Wc() {
                var a, b;
                return b = de, a = tc(), null !== a && (a = function(a, b) {
                    he = b
                }(b, a)), null === a && (de = b), a
            }

            function Xc() {
                var a, b, c, d, e, f, g, h, i, j;
                for (h = de, i = de, a = [], b = pc(); null !== b;) a.push(b), b = pc();
                if (null !== a)
                    if (b = K(), null !== b)
                        if (c = X(), null !== c)
                            if (d = J(), null !== d) {
                                for (e = [], j = de, f = M(), null !== f ? (g = vc(), null !== g ? f = [f, g] : (f = null, de = j)) : (f = null, de = j); null !== f;) e.push(f), j = de, f = M(), null !== f ? (g = vc(), null !== g ? f = [f, g] : (f = null, de = j)) : (f = null, de = j);
                                null !== e ? a = [a, b, c, d, e] : (a = null, de = i)
                            } else a = null, de = i;
                            else a = null, de = i;
                            else a = null, de = i;
                            else a = null, de = i;
                return null !== a && (a = function() {
                    try {
                        he = new WebSDK.NameAddrHeader(he.uri, he.display_name, he.params)
                    } catch (a) {
                        he = -1
                    }
                }(h)), null === a && (de = h), a
            }

            function Yc() {
                var a;
                return a = Zc()
            }

            function Zc() {
                var a, c, e, f, g, h, i, j;
                if (i = de, "digest" === b.substr(de, 6).toLowerCase() ? (a = b.substr(de, 6), de += 6) : (a = null, 0 === ee && d('"Digest"')), null !== a)
                    if (c = s(), null !== c)
                        if (e = ad(), null !== e) {
                            for (f = [], j = de, g = L(), null !== g ? (h = ad(), null !== h ? g = [g, h] : (g = null, de = j)) : (g = null, de = j); null !== g;) f.push(g), j = de, g = L(), null !== g ? (h = ad(), null !== h ? g = [g, h] : (g = null, de = j)) : (g = null, de = j);
                            null !== f ? a = [a, c, e, f] : (a = null, de = i)
                        } else a = null, de = i;
                        else a = null, de = i;
                        else a = null, de = i;
                return null === a && (a = $c()), a
            }

            function $c() {
                var a, b, c, d, e, f, g, h;
                if (g = de, a = A(), null !== a)
                    if (b = s(), null !== b)
                        if (c = _c(), null !== c) {
                            for (d = [], h = de, e = L(), null !== e ? (f = _c(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h); null !== e;) d.push(e), h = de, e = L(), null !== e ? (f = _c(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h);
                            null !== d ? a = [a, b, c, d] : (a = null, de = g)
                        } else a = null, de = g;
                        else a = null, de = g;
                        else a = null, de = g;
                return a
            }

            function _c() {
                var a, b, c, d;
                return d = de, a = A(), null !== a ? (b = G(), null !== b ? (c = A(), null === c && (c = S()), null !== c ? a = [a, b, c] : (a = null, de = d)) : (a = null, de = d)) : (a = null, de = d), a
            }

            function ad() {
                var a;
                return a = bd(), null === a && (a = dd(), null === a && (a = fd(), null === a && (a = hd(), null === a && (a = id(), null === a && (a = jd(), null === a && (a = kd(), null === a && (a = _c()))))))), a
            }

            function bd() {
                var a, c, e, f;
                return f = de, "realm" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"realm"')), null !== a ? (c = G(), null !== c ? (e = cd(), null !== e ? a = [a, c, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function cd() {
                var a, b;
                return b = de, a = T(), null !== a && (a = function(a, b) {
                    he.realm = b
                }(b, a)), null === a && (de = b), a
            }

            function dd() {
                var a, c, e, f, g, h, i, j, k;
                if (j = de, "domain" === b.substr(de, 6).toLowerCase() ? (a = b.substr(de, 6), de += 6) : (a = null, 0 === ee && d('"domain"')), null !== a)
                    if (c = G(), null !== c)
                        if (e = O(), null !== e)
                            if (f = ed(), null !== f) {
                                if (g = [], k = de, i = l(), null !== i)
                                    for (h = []; null !== i;) h.push(i), i = l();
                                else h = null;
                                for (null !== h ? (i = ed(), null !== i ? h = [h, i] : (h = null, de = k)) : (h = null, de = k); null !== h;) {
                                    if (g.push(h), k = de, i = l(), null !== i)
                                        for (h = []; null !== i;) h.push(i), i = l();
                                    else h = null;
                                    null !== h ? (i = ed(), null !== i ? h = [h, i] : (h = null, de = k)) : (h = null, de = k)
                                }
                                null !== g ? (h = P(), null !== h ? a = [a, c, e, f, g, h] : (a = null, de = j)) : (a = null, de = j)
                            } else a = null, de = j;
                            else a = null, de = j;
                            else a = null, de = j;
                            else a = null, de = j;
                return a
            }

            function ed() {
                var a;
                return a = Ib(), null === a && (a = Lb()), a
            }

            function fd() {
                var a, c, e, f;
                return f = de, "nonce" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"nonce"')), null !== a ? (c = G(), null !== c ? (e = gd(), null !== e ? a = [a, c, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function gd() {
                var a, b;
                return b = de, a = T(), null !== a && (a = function(a, b) {
                    he.nonce = b
                }(b, a)), null === a && (de = b), a
            }

            function hd() {
                var a, c, e, f, g;
                return f = de, g = de, "opaque" === b.substr(de, 6).toLowerCase() ? (a = b.substr(de, 6), de += 6) : (a = null, 0 === ee && d('"opaque"')), null !== a ? (c = G(), null !== c ? (e = T(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    he.opaque = b
                }(f, a[2])), null === a && (de = f), a
            }

            function id() {
                var a, c, e, f, g;
                return f = de, "stale" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"stale"')), null !== a ? (c = G(), null !== c ? (g = de, "true" === b.substr(de, 4).toLowerCase() ? (e = b.substr(de, 4), de += 4) : (e = null, 0 === ee && d('"true"')), null !== e && (e = function() {
                    he.stale = !0
                }(g)), null === e && (de = g), null === e && (g = de, "false" === b.substr(de, 5).toLowerCase() ? (e = b.substr(de, 5), de += 5) : (e = null, 0 === ee && d('"false"')), null !== e && (e = function() {
                    he.stale = !1
                }(g)), null === e && (de = g)), null !== e ? a = [a, c, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function jd() {
                var a, c, e, f, g;
                return f = de, g = de, "algorithm" === b.substr(de, 9).toLowerCase() ? (a = b.substr(de, 9), de += 9) : (a = null, 0 === ee && d('"algorithm"')), null !== a ? (c = G(), null !== c ? ("md5" === b.substr(de, 3).toLowerCase() ? (e = b.substr(de, 3), de += 3) : (e = null, 0 === ee && d('"MD5"')), null === e && ("md5-sess" === b.substr(de, 8).toLowerCase() ? (e = b.substr(de, 8), de += 8) : (e = null, 0 === ee && d('"MD5-sess"')), null === e && (e = A())), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    he.algorithm = b.toUpperCase()
                }(f, a[2])), null === a && (de = f), a
            }

            function kd() {
                var a, c, e, f, g, h, i, j, k, l;
                if (j = de, "qop" === b.substr(de, 3).toLowerCase() ? (a = b.substr(de, 3), de += 3) : (a = null, 0 === ee && d('"qop"')), null !== a)
                    if (c = G(), null !== c)
                        if (e = O(), null !== e) {
                            if (k = de, f = ld(), null !== f) {
                                for (g = [], l = de, 44 === b.charCodeAt(de) ? (h = ",", de++) : (h = null, 0 === ee && d('","')), null !== h ? (i = ld(), null !== i ? h = [h, i] : (h = null, de = l)) : (h = null, de = l); null !== h;) g.push(h), l = de, 44 === b.charCodeAt(de) ? (h = ",", de++) : (h = null, 0 === ee && d('","')), null !== h ? (i = ld(), null !== i ? h = [h, i] : (h = null, de = l)) : (h = null, de = l);
                                null !== g ? f = [f, g] : (f = null, de = k)
                            } else f = null, de = k;
                            null !== f ? (g = P(), null !== g ? a = [a, c, e, f, g] : (a = null, de = j)) : (a = null, de = j)
                        } else a = null, de = j;
                        else a = null, de = j;
                        else a = null, de = j;
                return a
            }

            function ld() {
                var a, c;
                return c = de, "auth-int" === b.substr(de, 8).toLowerCase() ? (a = b.substr(de, 8), de += 8) : (a = null, 0 === ee && d('"auth-int"')), null === a && ("auth" === b.substr(de, 4).toLowerCase() ? (a = b.substr(de, 4), de += 4) : (a = null, 0 === ee && d('"auth"')), null === a && (a = A())), null !== a && (a = function(a, b) {
                    he.qop || (he.qop = []), he.qop.push(b.toLowerCase())
                }(c, a)), null === a && (de = c), a
            }

            function md() {
                var a, b, c, d, e, f;
                if (e = de, a = A(), null !== a) {
                    for (b = [], f = de, c = L(), null !== c ? (d = A(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f); null !== c;) b.push(c), f = de, c = L(), null !== c ? (d = A(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f);
                    null !== b ? a = [a, b] : (a = null, de = e)
                } else a = null, de = e;
                return a
            }

            function nd() {
                var a, b, c, d, e, f, g;
                if (e = de, f = de, a = od(), null !== a) {
                    for (b = [], g = de, c = L(), null !== c ? (d = od(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g); null !== c;) b.push(c), g = de, c = L(), null !== c ? (d = od(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g);
                    null !== b ? a = [a, b] : (a = null, de = f)
                } else a = null, de = f;
                return null !== a && (a = function() {
                    var a, b;
                    for (b = he.multi_header.length, a = 0; b > a; a++)
                        if (null === he.multi_header[a].parsed) {
                            he = null;
                            break
                        }
                    he = null !== he ? he.multi_header : -1
                }(e)), null === a && (de = e), a
            }

            function od() {
                var a, b, c, d, e, f, g;
                if (e = de, f = de, a = oc(), null !== a) {
                    for (b = [], g = de, c = M(), null !== c ? (d = vc(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g); null !== c;) b.push(c), g = de, c = M(), null !== c ? (d = vc(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g);
                    null !== b ? a = [a, b] : (a = null, de = f)
                } else a = null, de = f;
                return null !== a && (a = function(a) {
                    var b;
                    he.multi_header || (he.multi_header = []);
                    try {
                        b = new WebSDK.NameAddrHeader(he.uri, he.display_name, he.params), delete he.uri, delete he.display_name, delete he.params
                    } catch (c) {
                        b = null
                    }
                    he.multi_header.push({
                        possition: de,
                        offset: a,
                        parsed: b
                    })
                }(e)), null === a && (de = e), a
            }

            function pd() {
                var a, b, c, d, e, f;
                if (e = de, a = A(), null !== a) {
                    for (b = [], f = de, c = L(), null !== c ? (d = A(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f); null !== c;) b.push(c), f = de, c = L(), null !== c ? (d = A(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f);
                    null !== b ? a = [a, b] : (a = null, de = e)
                } else a = null, de = e;
                return a
            }

            function qd() {
                var a, b, c, d, e, f;
                if (e = de, a = rd(), null !== a) {
                    for (b = [], f = de, c = L(), null !== c ? (d = rd(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f); null !== c;) b.push(c), f = de, c = L(), null !== c ? (d = rd(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f);
                    null !== b ? a = [a, b] : (a = null, de = e)
                } else a = null, de = e;
                return a
            }

            function rd() {
                var a, b, c, d, e, f;
                if (e = de, a = oc(), null !== a) {
                    for (b = [], f = de, c = M(), null !== c ? (d = vc(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f); null !== c;) b.push(c), f = de, c = M(), null !== c ? (d = vc(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f);
                    null !== b ? a = [a, b] : (a = null, de = e)
                } else a = null, de = e;
                return a
            }

            function sd() {
                var a, b, c, d, e, f;
                if (e = de, a = td(), null !== a) {
                    for (b = [], f = de, c = M(), null !== c ? (d = ud(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f); null !== c;) b.push(c), f = de, c = M(), null !== c ? (d = ud(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f);
                    null !== b ? a = [a, b] : (a = null, de = e)
                } else a = null, de = e;
                return a
            }

            function td() {
                var a, c;
                return c = de, "active" === b.substr(de, 6).toLowerCase() ? (a = b.substr(de, 6), de += 6) : (a = null, 0 === ee && d('"active"')), null === a && ("pending" === b.substr(de, 7).toLowerCase() ? (a = b.substr(de, 7), de += 7) : (a = null, 0 === ee && d('"pending"')), null === a && ("terminated" === b.substr(de, 10).toLowerCase() ? (a = b.substr(de, 10), de += 10) : (a = null, 0 === ee && d('"terminated"')), null === a && (a = A()))), null !== a && (a = function(a) {
                    he.state = b.substring(de, a)
                }(c)), null === a && (de = c), a
            }

            function ud() {
                var a, c, e, f, g;
                return f = de, g = de, "reason" === b.substr(de, 6).toLowerCase() ? (a = b.substr(de, 6), de += 6) : (a = null, 0 === ee && d('"reason"')), null !== a ? (c = G(), null !== c ? (e = vd(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    "undefined" != typeof b && (he.reason = b)
                }(f, a[2])), null === a && (de = f), null === a && (f = de, g = de, "expires" === b.substr(de, 7).toLowerCase() ? (a = b.substr(de, 7), de += 7) : (a = null, 0 === ee && d('"expires"')), null !== a ? (c = G(), null !== c ? (e = tc(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    "undefined" != typeof b && (he.expires = b)
                }(f, a[2])), null === a && (de = f), null === a && (f = de, g = de, "retry_after" === b.substr(de, 11).toLowerCase() ? (a = b.substr(de, 11), de += 11) : (a = null, 0 === ee && d('"retry_after"')), null !== a ? (c = G(), null !== c ? (e = tc(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    "undefined" != typeof b && (he.retry_after = b)
                }(f, a[2])), null === a && (de = f), null === a && (a = vc()))), a
            }

            function vd() {
                var a;
                return "deactivated" === b.substr(de, 11).toLowerCase() ? (a = b.substr(de, 11), de += 11) : (a = null, 0 === ee && d('"deactivated"')), null === a && ("probation" === b.substr(de, 9).toLowerCase() ? (a = b.substr(de, 9), de += 9) : (a = null, 0 === ee && d('"probation"')), null === a && ("rejected" === b.substr(de, 8).toLowerCase() ? (a = b.substr(de, 8), de += 8) : (a = null, 0 === ee && d('"rejected"')), null === a && ("timeout" === b.substr(de, 7).toLowerCase() ? (a = b.substr(de, 7), de += 7) : (a = null, 0 === ee && d('"timeout"')), null === a && ("giveup" === b.substr(de, 6).toLowerCase() ? (a = b.substr(de, 6), de += 6) : (a = null, 0 === ee && d('"giveup"')), null === a && ("noresource" === b.substr(de, 10).toLowerCase() ? (a = b.substr(de, 10), de += 10) : (a = null, 0 === ee && d('"noresource"')), null === a && ("invariant" === b.substr(de, 9).toLowerCase() ? (a = b.substr(de, 9), de += 9) : (a = null, 0 === ee && d('"invariant"')), null === a && (a = A()))))))), a
            }

            function wd() {
                var a;
                return a = v(), a = null !== a ? a : ""
            }

            function xd() {
                var a, b, c, d, e, f;
                if (e = de, a = A(), null !== a) {
                    for (b = [], f = de, c = L(), null !== c ? (d = A(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f); null !== c;) b.push(c), f = de, c = L(), null !== c ? (d = A(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f);
                    null !== b ? a = [a, b] : (a = null, de = e)
                } else a = null, de = e;
                return a = null !== a ? a : ""
            }

            function yd() {
                var a, b, c, d, e, f, g;
                if (e = de, f = de, a = W(), null === a && (a = oc()), null !== a) {
                    for (b = [], g = de, c = M(), null !== c ? (d = zd(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g); null !== c;) b.push(c), g = de, c = M(), null !== c ? (d = zd(), null !== d ? c = [c, d] : (c = null, de = g)) : (c = null, de = g);
                    null !== b ? a = [a, b] : (a = null, de = f)
                } else a = null, de = f;
                return null !== a && (a = function() {
                    var a = he.tag;
                    try {
                        he = new WebSDK.NameAddrHeader(he.uri, he.display_name, he.params), a && he.setParam("tag", a)
                    } catch (b) {
                        he = -1
                    }
                }(e)), null === a && (de = e), a
            }

            function zd() {
                var a;
                return a = Uc(), null === a && (a = vc()), a
            }

            function Ad() {
                var a, b, c, d, e, f;
                if (e = de, a = Bd(), null !== a) {
                    for (b = [], f = de, c = L(), null !== c ? (d = Bd(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f); null !== c;) b.push(c), f = de, c = L(), null !== c ? (d = Bd(), null !== d ? c = [c, d] : (c = null, de = f)) : (c = null, de = f);
                    null !== b ? a = [a, b] : (a = null, de = e)
                } else a = null, de = e;
                return a
            }

            function Bd() {
                var a, b, c, d, e, f, g, h;
                if (g = de, a = Id(), null !== a)
                    if (b = s(), null !== b)
                        if (c = Ld(), null !== c) {
                            for (d = [], h = de, e = M(), null !== e ? (f = Cd(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h); null !== e;) d.push(e), h = de, e = M(), null !== e ? (f = Cd(), null !== f ? e = [e, f] : (e = null, de = h)) : (e = null, de = h);
                            null !== d ? a = [a, b, c, d] : (a = null, de = g)
                        } else a = null, de = g;
                        else a = null, de = g;
                        else a = null, de = g;
                return a
            }

            function Cd() {
                var a;
                return a = Dd(), null === a && (a = Ed(), null === a && (a = Fd(), null === a && (a = Gd(), null === a && (a = Hd(), null === a && (a = vc()))))), a
            }

            function Dd() {
                var a, c, e, f, g;
                return f = de, g = de, "ttl" === b.substr(de, 3).toLowerCase() ? (a = b.substr(de, 3), de += 3) : (a = null, 0 === ee && d('"ttl"')), null !== a ? (c = G(), null !== c ? (e = Od(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    he.ttl = b
                }(f, a[2])), null === a && (de = f), a
            }

            function Ed() {
                var a, c, e, f, g;
                return f = de, g = de, "maddr" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"maddr"')), null !== a ? (c = G(), null !== c ? (e = cb(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    he.maddr = b
                }(f, a[2])), null === a && (de = f), a
            }

            function Fd() {
                var a, c, e, f, g;
                return f = de, g = de, "received" === b.substr(de, 8).toLowerCase() ? (a = b.substr(de, 8), de += 8) : (a = null, 0 === ee && d('"received"')), null !== a ? (c = G(), null !== c ? (e = kb(), null === e && (e = hb()), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    he.received = b
                }(f, a[2])), null === a && (de = f), a
            }

            function Gd() {
                var a, c, e, f, g;
                return f = de, g = de, "branch" === b.substr(de, 6).toLowerCase() ? (a = b.substr(de, 6), de += 6) : (a = null, 0 === ee && d('"branch"')), null !== a ? (c = G(), null !== c ? (e = A(), null !== e ? a = [a, c, e] : (a = null, de = g)) : (a = null, de = g)) : (a = null, de = g), null !== a && (a = function(a, b) {
                    he.branch = b
                }(f, a[2])), null === a && (de = f), a
            }

            function Hd() {
                var a, c, e, g, h, i, j;
                if (h = de, i = de, "rport" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"rport"')), null !== a) {
                    if (j = de, c = G(), null !== c) {
                        for (e = [], g = f(); null !== g;) e.push(g), g = f();
                        null !== e ? c = [c, e] : (c = null, de = j)
                    } else c = null, de = j;
                    c = null !== c ? c : "", null !== c ? a = [a, c] : (a = null, de = i)
                } else a = null, de = i;
                return null !== a && (a = function() {
                    "undefined" != typeof response_port && (he.rport = response_port.join(""))
                }(h)), null === a && (de = h), a
            }

            function Id() {
                var a, b, c, d, e, f;
                return f = de, a = Jd(), null !== a ? (b = F(), null !== b ? (c = A(), null !== c ? (d = F(), null !== d ? (e = Kd(), null !== e ? a = [a, b, c, d, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function Jd() {
                var a, c;
                return c = de, "sip" === b.substr(de, 3).toLowerCase() ? (a = b.substr(de, 3), de += 3) : (a = null, 0 === ee && d('"SIP"')), null === a && (a = A()), null !== a && (a = function(a, b) {
                    he.protocol = b
                }(c, a)), null === a && (de = c), a
            }

            function Kd() {
                var a, c;
                return c = de, "udp" === b.substr(de, 3).toLowerCase() ? (a = b.substr(de, 3), de += 3) : (a = null, 0 === ee && d('"UDP"')), null === a && ("tcp" === b.substr(de, 3).toLowerCase() ? (a = b.substr(de, 3), de += 3) : (a = null, 0 === ee && d('"TCP"')), null === a && ("tls" === b.substr(de, 3).toLowerCase() ? (a = b.substr(de, 3), de += 3) : (a = null, 0 === ee && d('"TLS"')), null === a && ("sctp" === b.substr(de, 4).toLowerCase() ? (a = b.substr(de, 4), de += 4) : (a = null, 0 === ee && d('"SCTP"')), null === a && (a = A())))), null !== a && (a = function(a, b) {
                    he.transport = b
                }(c, a)), null === a && (de = c), a
            }

            function Ld() {
                var a, b, c, d, e;
                return d = de, a = Md(), null !== a ? (e = de, b = N(), null !== b ? (c = Nd(), null !== c ? b = [b, c] : (b = null, de = e)) : (b = null, de = e), b = null !== b ? b : "", null !== b ? a = [a, b] : (a = null, de = d)) : (a = null, de = d), a
            }

            function Md() {
                var a, c;
                return c = de, a = db(), null === a && (a = kb(), null === a && (a = gb())), null !== a && (a = function(a) {
                    he.host = b.substring(de, a)
                }(c)), null === a && (de = c), a
            }

            function Nd() {
                var a, b, c, d, e, g, h;
                return g = de, h = de, a = f(), a = null !== a ? a : "", null !== a ? (b = f(), b = null !== b ? b : "", null !== b ? (c = f(), c = null !== c ? c : "", null !== c ? (d = f(), d = null !== d ? d : "", null !== d ? (e = f(), e = null !== e ? e : "", null !== e ? a = [a, b, c, d, e] : (a = null, de = h)) : (a = null, de = h)) : (a = null, de = h)) : (a = null, de = h)) : (a = null, de = h), null !== a && (a = function(a, b) {
                    he.port = parseInt(b.join(""))
                }(g, a)), null === a && (de = g), a
            }

            function Od() {
                var a, b, c, d, e;
                return d = de, e = de, a = f(), null !== a ? (b = f(), b = null !== b ? b : "", null !== b ? (c = f(), c = null !== c ? c : "", null !== c ? a = [a, b, c] : (a = null, de = e)) : (a = null, de = e)) : (a = null, de = e), null !== a && (a = function(a, b) {
                    return parseInt(b.join(""))
                }(d, a)), null === a && (de = d), a
            }

            function Pd() {
                var a;
                return a = Zc()
            }

            function Qd() {
                var a, b, c, d;
                return d = de, a = A(), null !== a ? (b = u(), null !== b ? (c = Rd(), null !== c ? a = [a, b, c] : (a = null, de = d)) : (a = null, de = d)) : (a = null, de = d), a
            }

            function Rd() {
                var a, b;
                for (a = [], b = w(), null === b && (b = y(), null === b && (b = s())); null !== b;) a.push(b), b = w(), null === b && (b = y(), null === b && (b = s()));
                return a
            }

            function Sd() {
                var a, b;
                for (a = [], b = j(); null !== b;) a.push(b), b = j();
                return a
            }

            function Td() {
                var a, c, e, f;
                return f = de, a = Ud(), null !== a ? (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = Vd(), null !== e ? a = [a, c, e] : (a = null, de = f)) : (a = null, de = f)) : (a = null, de = f), a
            }

            function Ud() {
                var a, c;
                return c = de, "stuns" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"stuns"')), null === a && ("stun" === b.substr(de, 4).toLowerCase() ? (a = b.substr(de, 4), de += 4) : (a = null, 0 === ee && d('"stun"'))), null !== a && (a = function(a, b) {
                    he.scheme = b
                }(c, a)), null === a && (de = c), a
            }

            function Vd() {
                var a, c, e, f, g;
                return f = de, a = Wd(), null !== a ? (g = de, 58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = mb(), null !== e ? c = [c, e] : (c = null, de = g)) : (c = null, de = g), c = null !== c ? c : "", null !== c ? a = [a, c] : (a = null, de = f)) : (a = null, de = f), a
            }

            function Wd() {
                var a, b;
                return b = de, a = kb(), null === a && (a = gb(), null === a && (a = Wb())), null !== a && (a = function(a, b) {
                    he.host = b
                }(b, a)), null === a && (de = b), a
            }

            function Wb() {
                var a, c, d;
                for (d = de, a = [], c = Xd(), null === c && (c = r(), null === c && (c = Yd())); null !== c;) a.push(c), c = Xd(), null === c && (c = r(), null === c && (c = Yd()));
                return null !== a && (a = function(a) {
                    return b.substring(de, a)
                }(d)), null === a && (de = d), a
            }

            function Xd() {
                var a;
                return a = g(), null === a && (a = f(), null === a && (45 === b.charCodeAt(de) ? (a = "-", de++) : (a = null, 0 === ee && d('"-"')), null === a && (46 === b.charCodeAt(de) ? (a = ".", de++) : (a = null, 0 === ee && d('"."')), null === a && (95 === b.charCodeAt(de) ? (a = "_", de++) : (a = null, 0 === ee && d('"_"')), null === a && (126 === b.charCodeAt(de) ? (a = "~", de++) : (a = null, 0 === ee && d('"~"'))))))), a
            }

            function Yd() {
                var a;
                return 33 === b.charCodeAt(de) ? (a = "!", de++) : (a = null, 0 === ee && d('"!"')), null === a && (36 === b.charCodeAt(de) ? (a = "$", de++) : (a = null, 0 === ee && d('"$"')), null === a && (38 === b.charCodeAt(de) ? (a = "&", de++) : (a = null, 0 === ee && d('"&"')), null === a && (39 === b.charCodeAt(de) ? (a = "'", de++) : (a = null, 0 === ee && d('"\'"')), null === a && (40 === b.charCodeAt(de) ? (a = "(", de++) : (a = null, 0 === ee && d('"("')), null === a && (41 === b.charCodeAt(de) ? (a = ")", de++) : (a = null, 0 === ee && d('")"')), null === a && (42 === b.charCodeAt(de) ? (a = "*", de++) : (a = null, 0 === ee && d('"*"')), null === a && (43 === b.charCodeAt(de) ? (a = "+", de++) : (a = null, 0 === ee && d('"+"')), null === a && (44 === b.charCodeAt(de) ? (a = ",", de++) : (a = null, 0 === ee && d('","')), null === a && (59 === b.charCodeAt(de) ? (a = ";", de++) : (a = null, 0 === ee && d('";"')), null === a && (61 === b.charCodeAt(de) ? (a = "=", de++) : (a = null, 0 === ee && d('"="')))))))))))), a
            }

            function Zd() {
                var a, c, e, f, g, h, i;
                return h = de, a = $d(), null !== a ? (58 === b.charCodeAt(de) ? (c = ":", de++) : (c = null, 0 === ee && d('":"')), null !== c ? (e = Vd(), null !== e ? (i = de, "?transport=" === b.substr(de, 11) ? (f = "?transport=", de += 11) : (f = null, 0 === ee && d('"?transport="')), null !== f ? (g = Kd(), null !== g ? f = [f, g] : (f = null, de = i)) : (f = null, de = i), f = null !== f ? f : "", null !== f ? a = [a, c, e, f] : (a = null, de = h)) : (a = null, de = h)) : (a = null, de = h)) : (a = null, de = h), a
            }

            function $d() {
                var a, c;
                return c = de, "turns" === b.substr(de, 5).toLowerCase() ? (a = b.substr(de, 5), de += 5) : (a = null, 0 === ee && d('"turns"')), null === a && ("turn" === b.substr(de, 4).toLowerCase() ? (a = b.substr(de, 4), de += 4) : (a = null, 0 === ee && d('"turn"'))), null !== a && (a = function(a, b) {
                    he.scheme = b
                }(c, a)), null === a && (de = c), a
            }

            function _d() {
                var a, c, e, f, g;
                if (f = de, g = de, a = Kd(), null !== a) {
                    if ("udp" === b.substr(de, 3).toLowerCase() ? (c = b.substr(de, 3), de += 3) : (c = null, 0 === ee && d('"udp"')), null === c && ("tcp" === b.substr(de, 3).toLowerCase() ? (c = b.substr(de, 3), de += 3) : (c = null, 0 === ee && d('"tcp"')), null === c))
                        for (c = [], e = p(); null !== e;) c.push(e), e = p();
                    null !== c ? a = [a, c] : (a = null, de = g)
                } else a = null, de = g;
                return null !== a && (a = function() {
                    he.transport = transport
                }(f)), null === a && (de = f), a
            }

            function ae(a) {
                a.sort();
                for (var b = null, c = [], d = 0; d < a.length; d++) a[d] !== b && (c.push(a[d]), b = a[d]);
                return c
            }

            function be() {
                for (var a = 1, c = 1, d = !1, e = 0; e < Math.max(de, fe); e++) {
                    var f = b.charAt(e);
                    "\n" === f ? (d || a++, c = 1, d = !1) : "\r" === f || "\u2028" === f || "\u2029" === f ? (a++, c = 1, d = !0) : (c++, d = !1)
                }
                return {
                    line: a,
                    column: c
                }
            }
            var ce = {
                CRLF: e,
                DIGIT: f,
                ALPHA: g,
                HEXDIG: h,
                WSP: i,
                OCTET: j,
                DQUOTE: k,
                SP: l,
                HTAB: m,
                alphanum: n,
                reserved: o,
                unreserved: p,
                mark: q,
                escaped: r,
                LWS: s,
                SWS: t,
                HCOLON: u,
                TEXT_UTF8_TRIM: v,
                TEXT_UTF8char: w,
                UTF8_NONASCII: x,
                UTF8_CONT: y,
                LHEX: z,
                token: A,
                token_nodot: B,
                separators: C,
                word: D,
                STAR: E,
                SLASH: F,
                EQUAL: G,
                LPAREN: H,
                RPAREN: I,
                RAQUOT: J,
                LAQUOT: K,
                COMMA: L,
                SEMI: M,
                COLON: N,
                LDQUOT: O,
                RDQUOT: P,
                comment: Q,
                ctext: R,
                quoted_string: S,
                quoted_string_clean: T,
                qdtext: U,
                quoted_pair: V,
                SIP_URI_noparams: W,
                SIP_URI: X,
                uri_scheme: Y,
                userinfo: Z,
                user: $,
                user_unreserved: _,
                password: ab,
                hostport: bb,
                host: cb,
                hostname: db,
                domainlabel: eb,
                toplabel: fb,
                IPv6reference: gb,
                IPv6address: hb,
                h16: ib,
                ls32: jb,
                IPv4address: kb,
                dec_octet: lb,
                port: mb,
                uri_parameters: nb,
                uri_parameter: ob,
                transport_param: pb,
                user_param: qb,
                method_param: rb,
                ttl_param: sb,
                maddr_param: tb,
                lr_param: ub,
                other_param: vb,
                pname: wb,
                pvalue: xb,
                paramchar: yb,
                param_unreserved: zb,
                headers: Ab,
                header: Bb,
                hname: Cb,
                hvalue: Db,
                hnv_unreserved: Eb,
                Request_Response: Fb,
                Request_Line: Gb,
                Request_URI: Hb,
                absoluteURI: Ib,
                hier_part: Jb,
                net_path: Kb,
                abs_path: Lb,
                opaque_part: Mb,
                uric: Nb,
                uric_no_slash: Ob,
                path_segments: Pb,
                segment: Qb,
                param: Rb,
                pchar: Sb,
                scheme: Tb,
                authority: Ub,
                srvr: Vb,
                reg_name: Wb,
                query: Xb,
                SIP_Version: Yb,
                INVITEm: Zb,
                ACKm: $b,
                OPTIONSm: _b,
                BYEm: ac,
                CANCELm: bc,
                REGISTERm: cc,
                SUBSCRIBEm: dc,
                NOTIFYm: ec,
                Method: fc,
                Status_Line: gc,
                Status_Code: hc,
                extension_code: ic,
                Reason_Phrase: jc,
                Allow_Events: kc,
                Call_ID: lc,
                Contact: mc,
                contact_param: nc,
                name_addr: oc,
                display_name: pc,
                contact_params: qc,
                c_p_q: rc,
                c_p_expires: sc,
                delta_seconds: tc,
                qvalue: uc,
                generic_param: vc,
                gen_value: wc,
                Content_Disposition: xc,
                disp_type: yc,
                disp_param: zc,
                handling_param: Ac,
                Content_Encoding: Bc,
                Content_Length: Cc,
                Content_Type: Dc,
                media_type: Ec,
                m_type: Fc,
                discrete_type: Gc,
                composite_type: Hc,
                extension_token: Ic,
                x_token: Jc,
                m_subtype: Kc,
                m_parameter: Lc,
                m_value: Mc,
                CSeq: Nc,
                CSeq_value: Oc,
                Expires: Pc,
                Event: Qc,
                event_type: Rc,
                From: Sc,
                from_param: Tc,
                tag_param: Uc,
                Max_Forwards: Vc,
                Min_Expires: Wc,
                Name_Addr_Header: Xc,
                Proxy_Authenticate: Yc,
                challenge: Zc,
                other_challenge: $c,
                auth_param: _c,
                digest_cln: ad,
                realm: bd,
                realm_value: cd,
                domain: dd,
                URI: ed,
                nonce: fd,
                nonce_value: gd,
                opaque: hd,
                stale: id,
                algorithm: jd,
                qop_options: kd,
                qop_value: ld,
                Proxy_Require: md,
                Record_Route: nd,
                rec_route: od,
                Require: pd,
                Route: qd,
                route_param: rd,
                Subscription_State: sd,
                substate_value: td,
                subexp_params: ud,
                event_reason_value: vd,
                Subject: wd,
                Supported: xd,
                To: yd,
                to_param: zd,
                Via: Ad,
                via_parm: Bd,
                via_params: Cd,
                via_ttl: Dd,
                via_maddr: Ed,
                via_received: Fd,
                via_branch: Gd,
                response_port: Hd,
                sent_protocol: Id,
                protocol_name: Jd,
                transport: Kd,
                sent_by: Ld,
                via_host: Md,
                via_port: Nd,
                ttl: Od,
                WWW_Authenticate: Pd,
                extension_header: Qd,
                header_value: Rd,
                message_body: Sd,
                stun_URI: Td,
                stun_scheme: Ud,
                stun_host_port: Vd,
                stun_host: Wd,
                reg_name: Wb,
                stun_unreserved: Xd,
                sub_delims: Yd,
                turn_URI: Zd,
                turn_scheme: $d,
                turn_transport: _d
            };
            if (void 0 !== c) {
                if (void 0 === ce[c]) throw new Error("Invalid rule name: " + a(c) + ".")
            } else c = "CRLF";
            var de = 0,
                ee = 0,
                fe = 0,
                ge = [],
                he = {}, ie = ce[c]();
            if (null === ie || de !== b.length) {
                var je = Math.max(de, fe),
                    ke = je < b.length ? b.charAt(je) : null,
                    le = be();
                return new this.SyntaxError(ae(ge), ke, je, le.line, le.column), -1
            }
            return he
        },
        toSource: function() {
            return this._source
        }
    };
    return b.SyntaxError = function(b, c, d, e, f) {
        function g(b, c) {
            var d, e;
            switch (b.length) {
                case 0:
                    d = "end of input";
                    break;
                case 1:
                    d = b[0];
                    break;
                default:
                    d = b.slice(0, b.length - 1).join(", ") + " or " + b[b.length - 1]
            }
            return e = c ? a(c) : "end of input", "Expected " + d + " but " + e + " found."
        }
        this.name = "SyntaxError", this.expected = b, this.found = c, this.message = g(b, c), this.offset = d, this.line = e, this.column = f
    }, b.SyntaxError.prototype = Error.prototype, b
}(),
function() {
    var a;
    a = function() {
        function a() {
            l()
        }

        function b(a, b) {
            var c = {};
            Plivo.logDevel("recvExtraHeader");
            for (var d in b) {
                var e = a.getHeader(d);
                Plivo.checkExtraHeader(d, e) && (c[d] = e)
            }
            return c
        }
        var c, d, e = "plivojs",
            f = "phone.plivo.com",
            g = !1,
            h = "plivo_webrtc_selfview",
            i = "plivo_webrtc_remoteview",
            j = null,
            k = !1;
        a.prototype.init = function() {
            k = !0, Plivo.onReady(), Plivo.config.perm_on_click || Plivo.config.listen_mode || this._getLocalMedia()
        };
        var l = function() {
            var a = document.createElement("video");
            a.id = h, a.hidden = !0, a.autoplay = !0, a.muted = !0, a.width = 0, a.height = 0, document.body.appendChild(a);
            var b = document.createElement("video");
            b.id = i, b.hidden = !0, b.autoplay = !0, b.muted = "Chrome" == BrowserDetect.browser && 25 == BrowserDetect.version ? !0 : !1, b.width = 0, b.height = 0, document.body.appendChild(b)
        };
        a.prototype._getLocalMedia = function() {
            window.storedStream = null;
            var a = function(a) {
                window.storedStream = a, Plivo.config.mask_page_on_perm && Plivo.unmaskPage(), Plivo.onMediaPermission(!0), "Firefox" == BrowserDetect.browser && (document.getElementById("plivo_webrtc_selfview").mozSrcObject = a, j = a)
            }, b = function() {
                    Plivo.config.mask_page_on_perm && Plivo.unmaskPage(), Plivo.onMediaPermission(!1)
                };
            Plivo.config.mask_page_on_perm && Plivo.maskThePage(), Plivo.onRequirePermission(), WebSDK.WebRTC.getUserMedia({
                audio: !0,
                video: !1
            }, a, b)
        }, a.prototype.login = function(a, b) {
            if (!k) return Plivo.logDebug("error : plivo websdk is not ready yet"), !1;
            if (void 0 === a || void 0 === b || null === a || null === b) return Plivo.logDebug("username & password cant be null"), !1;
            if (a.length <= 0 || 0 >= b) return Plivo.logDebug("username & password length should be more than 0"), !1;
            var d = {
                ws_servers: ["wss://phone.plivo.com:443"],
                register_expires: 120,
                stun_servers: ["stun:23.21.150.121:3478", "stun:216.93.246.18:3478", "stun:66.228.45.110:3478", "stun:173.194.78.127:19302"],
                uri: a + "@" + f,
                password: b,
                trace_sip: !0
            };
            try {
                c = new WebSDK.UA(d)
            } catch (e) {
                return Plivo.logDebug("failed to create UA"), !1
            }
            return c.on("connected", n), c.on("disconnected", o), c.on("registered", p), c.on("unregistered", r), c.on("registrationFailed", q), c.on("newRTCSession", u), c.start(), !0
        }, a.prototype.logout = function() {
            return d ? (Plivo.logDebug("logging out when there is active call. Terminate the call"), d.terminate(), !0) : (c.unregister("all"), !0)
        }, a.prototype.call = function(a, b) {
            var e, f = {};
            if (Plivo.gotEarlyMedia = !1, !k) return Plivo.logDebug("error : plivo websdk is not ready yet"), !1;
            if (!g) return Plivo.logDebug("error : you need to be logged in before make a call"), !1;
            if (void 0 === a || null === a || a.length <= 0) return Plivo.logDebug("destination address can't be null and it's lenght must be > 0"), !1;
            if (d) return Plivo.logDebug("Can't make another call while in call"), !1;
            b = b || {};
            var j = [];
            for (var l in b) {
                var m = b[l];
                Plivo.checkExtraHeader(l, m) === !0 ? (j.push(l + ": " + m), Plivo.logDevel("valid hdr = " + l + " -> " + m)) : Plivo.logDebug("invalid hdr = " + l + " -> " + m)
            }
            e = "sip:" != a.substring(0, 4) ? "sip:" + a : a;
            ({
                selfView: document.getElementById(h),
                remoteView: document.getElementById(i)
            });
            f.mediaConstraints = {
                audio: !0,
                video: !1
            }, f.eventHandlers = {
                progress: v,
                failed: x,
                started: z,
                ended: A
            }, f.extraHeaders = j, c.call(e, f);
            try {
                Plivo.onCalling()
            } catch (n) {
                return Plivo.logDebug("Failed to execute Plivo.onCalling event handler"), !1
            }
            return !0
        }, a.prototype.answer = function() {
            return Plivo.gotEarlyMedia = !1, d ? (opts = {
                mediaConstraints: {
                    audio: !0,
                    video: !1
                }
            }, d.answer(opts), Plivo.conn.ringToneStop(), !0) : (Plivo.logDebug("answer() failed : no incoming call"), !1)
        }, a.prototype.hangup = function() {
            return d ? (D(), d.terminate(), Plivo.conn.rbToneStop(), !0) : (Plivo.logDebug("hangup() failed:no call session exist"), !1)
        }, a.prototype.reject = function() {
            if (!d) return Plivo.logDebug("reject() failed : no incoming call"), !1;
            var a = {
                status_code: 486,
                reason_phrase: "Busy Here"
            };
            return d.terminate(a), Plivo.conn.ringToneStop(), !0
        }, a.prototype.send_dtmf = function(a) {
            return void 0 === a || null === a ? (Plivo.logDebug("DTMF digit can't be null"), !1) : d ? (d.sendDTMF(a), Plivo.conn.dtmfTonePlay(a), !0) : !1
        }, a.prototype.mute = function() {
            if (!d) return Plivo.logDebug("there is no active call session"), !1;
            var a = E();
            if (a)
                for (var b = 0; b < a.length; b++) a[b].enabled = !1;
            return !0
        }, a.prototype.unmute = function() {
            if (!d) return Plivo.logDebug("There is no active call session"), !1;
            var a = E();
            if (a)
                for (var b = 0; b < a.length; b++) a[b].enabled = !0;
            return !0
        };
        var m, n = function() {
                Plivo.logDevel("websocket connection established")
            }, o = function() {
                Plivo.logDevel("websocket connection closed")
            }, p = function() {
                g === !1 && (g = !0, Plivo.logDevel("onLogin"), Plivo.onLogin())
            }, q = function() {
                g = !1, Plivo.logDebug("Login failed"), Plivo.onLoginFailed()
            }, r = function() {
                Plivo.logDevel("_onLogout"), g = !1, Plivo.conn.rbToneStop(), Plivo.conn.ringToneStop(), Plivo.onLogout()
            }, s = function(a) {
                m = "incoming", d.on("progress", w), d.on("failed", x), d.on("started", z), d.on("ended", A);
                var c = a.data.request,
                    e = c.headers,
                    f = b(c, e);
                Plivo.conn.ringTonePlay();
                var g = d.remote_identity.uri.toString();
                Plivo.onIncomingCall(g.substring(4, g.indexOf("@")) + "@phone.plivo.com", f)
            }, t = function() {
                m = "outgoing"
            }, u = function(a) {
                if (Plivo.logDevel(e + ":_onNewSession"), d) {
                    Plivo.logDebug("Multiple calls detected. Can't support it yet. Reject it");
                    var b = a.data.session;
                    return opts = {
                        status_code: 408,
                        reason_phrase: "Busy Here"
                    }, void b.terminate(opts)
                }
                d = a.data.session, "remote" == a.data.originator ? s(a) : t(a)
            }, v = function() {
                Plivo.logDevel(e + "_onOutCallProgress"), Plivo.conn.rbTonePlay(), Plivo.onCallRemoteRinging()
            }, w = function() {
                Plivo.logDevel(e + "_onIncCallProgress")
            }, x = function(a) {
                Plivo.gotEarlyMedia = !1, Plivo.logDevel(e + ":call failed:" + a.data.cause), "Chrome" == BrowserDetect.browser && 25 == BrowserDetect.version && (document.getElementById(i).muted = !0), d = null, a.data.cause == WebSDK.C.causes.CANCELED && "incoming" == m ? (Plivo.conn.ringToneStop(), Plivo.onIncomingCallCanceled()) : (Plivo.conn.rbToneStop(), Plivo.onCallFailed(a.data.cause)), m = null
            }, y = function() {
                var a = document.getElementById(i);
                d.getRemoteStreams().length > 0 && (a.src = window.URL.createObjectURL(d.getRemoteStreams()[0])), 25 == BrowserDetect.version && (a.muted = !1)
            }, z = function() {
                {
                    var a = document.getElementById(h);
                    document.getElementById(i)
                }
                Plivo.logDevel(e + ":onCallStarted"), "Chrome" == BrowserDetect.browser && (d.getLocalStreams().length > 0 && (a.src = window.URL.createObjectURL(d.getLocalStreams()[0])), y()), Plivo.conn.rbToneStop(), Plivo.conn.ringToneStop(), "undefined" != typeof PlivoDebug && null !== PlivoDebug && PlivoDebug.setPC(d.rtcMediaHandler.peerConnection), Plivo.onCallAnswered()
            }, A = function() {
                Plivo.gotEarlyMedia = !1, Plivo.logDevel("onCallEnded"), "Chrome" == BrowserDetect.browser && 25 == BrowserDetect.version && (document.getElementById(i).muted = !0), Plivo.config.listen_mode || D(), Plivo.conn.ringToneStop(), d = null, m = null, Plivo.onCallTerminated()
            }, B = function(a) {
                try {
                    document.getElementById(a).play()
                } catch (b) {
                    Plivo.logDebug("failed to play audio:" + b)
                }
            }, C = function(a) {
                try {
                    document.getElementById(a).pause()
                } catch (b) {
                    Plivo.logDebug("failed to stop audio:" + b)
                }
            };
        a.prototype.ringTonePlay = function() {
            Plivo.ringToneFlag !== !1 && B("plivo_ringtone")
        }, a.prototype.ringToneStop = function() {
            Plivo.ringToneFlag !== !1 && C("plivo_ringtone")
        }, a.prototype.rbTonePlay = function() {
            Plivo.ringToneBackFlag !== !1 && B("plivo_ringbacktone")
        }, a.prototype.rbToneStop = function() {
            Plivo.ringToneBackFlag !== !1 && C("plivo_ringbacktone")
        }, a.prototype.dtmfTonePlay = function(a) {
            Plivo.getDtmfToneFlag(a) !== !1 && (elem_name = null, elem_name = "*" == a ? "dtmfstar" : "#" == a ? "dtmfpound" : "dtmf" + a, B(elem_name))
        };
        var D = function() {
            return "Chrome" == BrowserDetect.browser ? d.getLocalStreams()[0].stop() : "Firefox" == BrowserDetect.browser && j.stop()
        };
        var E = function() {
            var a = null;
            return "Chrome" == BrowserDetect.browser ? a = d.getLocalStreams()[0].audioTracks || d.getLocalStreams()[0].getAudioTracks() : "Firefox" == BrowserDetect.browser && (a = j.getAudioTracks()), a
        };
        return a
    }(), window.plivojs = a
}.call(this);
