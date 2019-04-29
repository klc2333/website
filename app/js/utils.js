var Utils = {

    getCookie : function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');

        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    getProgressColor : function(percentage) {

        if (percentage < 25) {
            return 'red'
        } else if (percentage < 70) {
            return 'yellow'
        } else {
            return 'green'
        }
    },

    hideOverlay : function(className) {

        $('#overlay').hide().removeClass().addClass('overlay ' + className)
    },

    showOverlay : function(className) {

        $('#overlay').show().removeClass().addClass('overlay ' + className)
    },

    sizeToBytes : function(size) {

        if (!size) {return 0}

        var bytes = size.match(/\d/g).join("");

        var multiplier = size.match(/[a-zA-Z ]/g).join("").toLowerCase();

        switch (multiplier) {

            case "g": bytes *= 1024
            case "m": bytes *= 1024
            case "k": bytes *= 1024

        }

        return Number(bytes)
    },

    toggleOverlay : function(className) {

        $('#overlay').toggle().removeClass().addClass('overlay ' + className)
    },

    uuid : function() {

        return (((1+Math.random())*0x10000000)|0).toString(16).substring(1) + "-" + (((1+Math.random())*0x100000)|0).toString(16).substring(1) + "-" + (((1+Math.random())*0x10000000)|0).toString(16).substring(1);
    }

}
