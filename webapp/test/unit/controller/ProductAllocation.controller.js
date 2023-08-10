/*global QUnit*/

sap.ui.define([
	"commngprdalldat/mngpalplndata/controller/ProductAllocation.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ProductAllocation Controller");

	QUnit.test("I should test the ProductAllocation controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
