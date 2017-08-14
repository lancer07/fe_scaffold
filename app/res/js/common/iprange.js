define('res/js/common/iprange', function() {

    (function($) {
        $.fn.checkIpRange = function() {

            return check(this);

            function check($this) {
                var ips = null,
                    ipStart = null,
                    ipEnd = null;
                var flag = false;

                ips = $this.find('.ip');

                if (ips.length <= 0) return false;

                ipStart = ips.splice(0, 4);
                ipEnd = ips.splice(0, 4);

                for (var i = 0; i < 4; i++) {
                    var num1 = parseInt(ipStart[i].value, 10);
                    var num2 = parseInt(ipEnd[i].value, 10);
                    if (num1 == NaN || num2 == NaN || num1 > 255 || num2 > 255 || num1 < 0 || num2 < 0) {
                        $.tips('请检查所输入IP地址的正确性', false);
                        return false;
                    } else if (num2 < num1) {
                        $.tips('起始IP地址不能大于结束IP地址，请重新输入', false);
                        return false;
                    } else if (num2 > num1) {
                        return true;
                    }
                }
                                return true;
            }
        }
    })(jQuery);

    // var iprange = fucntion() {

    //  this.init = function(el){
    //      if (typeof el === "string") {
    //          this.obj = $(el);
    //      } else if (typeof el === "object") {
    //          this.obj = el;
    //      } else {
    //          return false;
    //      }
    //      if (this.obj == null) {
    //          return false;
    //      }

    //      this.getIps();
    //      return this;
    //  };

    //  function getIps(){
    //      this.ips = this.obj.find('.ip');
    //      if (this.ips.length <= 0) {
    //          return false;
    //      }
    //      var ipStart = this.ips.splice(0,4),
    //          ipEnd = this.ips.splice(4,4);


    //  },

    //  check: function(){
    //      for (var i = 0; i < 4; i++) {
    //          var num1 = parseInt(ipStart[i].value, 10);
    //          var num2 = parseInt(ipEnd[i].value, 10);
    //          if (!num1 || !num2 || num1 > 255 || num2 > 255 || num1 < 0 || num2 < 0) {
    //              alert("请检查所输入IP地址的正确性");
    //          } else if (num2 < num1) {
    //              alert("起始IP地址不能大于结束IP地址\n请重新输入");
    //          }
    //      };
    //  }

    // }

    // return iprange;

})
