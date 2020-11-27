module.exports.check = function(req, success, failure) {
    // Unaccept no User-Agent requests
    var userAgent = req.get('User-Agent');
    if (!userAgent) {
        failure('Threat detected');
        return;
    }

    // Check concurent connection
    if (!ccCheck(req)) {
        failure('Service deny');
        return;
    }

    success();
};

module.exports.getLockedIPList = function() {return lockedIPList;};

var trackMap = {};
var lockedIPList = [];
const TOTAL_TRACK_IPS = 100;
const TOTAL_IP_CC = 10000; // allowed concurrent connections for an IP per X second
const INTERVAL = 1;

function ccCheck(req) {
    const moment = require('moment');

    // Add or remove ip track
    var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress ||
    req.socket.remoteAddress || 
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

    if (lockedIPList.includes(ip)) {
        return false;
    }

    if (trackMap.hasOwnProperty(ip)) {
        var track = trackMap[ip];
        var first = track[0];
        var now = moment().unix();
        if (now - first < INTERVAL) {
            track.push(now);
        }
        else {
            delete trackMap[ip];
        }
    }
    else {
        trackMap[ip] = [moment().unix()];
    }

    // Clear inactive IPs
    var totalTrackIPs = Object.keys(trackMap).length;
    if (totalTrackIPs > TOTAL_TRACK_IPS) {
        for (var ip in trackMap) {
            if (trackMap.hasOwnProperty(ip)) {
                var track = trackMap[ip];
                var last = track[track.length-1];
                if (moment().unix() - last >= INTERVAL) {
                    delete trackMap[ip];
                }
            }
        }
    }

    totalTrackIPs = Object.keys(trackMap).length;
    if (totalTrackIPs > TOTAL_TRACK_IPS) {
        return false;
    }

    if (trackMap.hasOwnProperty(ip)) {
        if (trackMap[ip].length > TOTAL_IP_CC) {
            lockedIPList.push(ip);
            return false;
        }
    }

    return true;
}
