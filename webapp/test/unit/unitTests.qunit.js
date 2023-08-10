/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"commngprdalldat/mngpalplndata/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
