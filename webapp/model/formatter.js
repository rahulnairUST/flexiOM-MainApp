sap.ui.define([], function () {
    "use strict";

    return {
        ProductAllocStatus: function (oStatus) {
            if (oStatus === "01") {
                return "Inactive";
            } else if (oStatus === "02") {
                return "Active";
            } else if (oStatus === "03") {
                return "Blocked";
            }
        },

        cellColor: function(oValue) {
            if (oValue < 0) {
                return "red";
            } else {
                return "";
            }
        },

        checkBoxVisibility: function(oValue) {
            if (oValue === "Order Incoming Qty") {  
                return true;
            } else {
                return false;
            }
        }
    }

});