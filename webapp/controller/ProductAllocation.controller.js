sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Fragment, MessageToast, JSONModel, exportLibrary, Spreadsheet, formatter) {
        "use strict";

        var EdmType = exportLibrary.EdmType;

        return Controller.extend("com.mng.prd.all.dat.mngpalplndata.controller.ProductAllocation", {
            formatter: formatter,

            onInit: function () {
                this._expandCollapse = 0;
                this._OrdViewBtn = 0;
                this._selectedCVC = [];
                var oToDate, oFromDate;
                var oDateRangeSelect = this.getView().byId("idSelectionRange");
                var oToday = new Date();
                if (oToday.getDay() === 0) {
                    oFromDate = new Date(new Date().setDate(new Date().getDate() + 1));
                    oToDate = new Date(new Date().setDate(new Date().getDate() + 1));
                } else if (oToday.getDay() === 1) {
                    oFromDate = new Date();
                    oToDate = new Date();
                } else if (oToday.getDay() === 2) {
                    oFromDate = new Date(new Date().setDate(new Date().getDate() - 1));
                    oToDate = new Date(new Date().setDate(new Date().getDate() - 1));
                } else if (oToday.getDay() === 3) {
                    oFromDate = new Date(new Date().setDate(new Date().getDate() - 2));
                    oToDate = new Date(new Date().setDate(new Date().getDate() - 2));
                } else if (oToday.getDay() === 4) {
                    oFromDate = new Date(new Date().setDate(new Date().getDate() - 3));
                    oToDate = new Date(new Date().setDate(new Date().getDate() - 3));
                } else if (oToday.getDay() === 5) {
                    oFromDate = new Date(new Date().setDate(new Date().getDate() - 4));
                    oToDate = new Date(new Date().setDate(new Date().getDate() - 4));
                } else if (oToday.getDay() === 6) {
                    oFromDate = new Date(new Date().setDate(new Date().getDate() - 5));
                    oToDate = new Date(new Date().setDate(new Date().getDate() - 5));
                }
                oFromDate = new Date(oFromDate.setMonth(oFromDate.getMonth() - 7));
                oToDate = new Date(oToDate.setMonth(oToDate.getMonth() + 3));

                oDateRangeSelect.setFrom(oFromDate);
                oDateRangeSelect.setTo(oToDate);
                this._createLocalModels();

            },

            onAfterRendering: function () {
                this._salesOrdTableDom = this.getView().byId("idSalesOrderPanel").getDomRef();
                this._resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            },

            onRefreshProductAlloc: function() {
                var that = this;
                sap.m.MessageBox.confirm(this._resourceBundle.getText("refreshMsg"), {
                    title: this._resourceBundle.getText("confirm"),                                    // default
                    onClose: function(oEvent) {
                        if (oEvent === "YES") {
                            that.onSearch();
                        } else if (oEvent === "NO") {

                        }    
                    },                                       // default
                    styleClass: "",                                      // default
                    actions: [sap.m.MessageBox.Action.YES,
                    sap.m.MessageBox.Action.NO],         // default
                    emphasizedAction: sap.m.MessageBox.Action.OK,        // default
                    initialFocus: null,                                  // default
                    textDirection: sap.ui.core.TextDirection.Inherit     // default
                });
            },

            onCVCStatusPressed: function() {
                var oView = this.getView();
                this._pDialog = this.loadFragment({
                    name: "com.mng.prd.all.dat.mngpalplndata.fragments.CVCStatus"
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    // oView.byId("idLogList").setModel(this._oLogModel, "logList");
                    oDialog.open();
                }.bind(this));
            },

            onCloseCVCStatusDialog: function() {
                var _oDialog = this.getView().byId("idCVCStatus");
                _oDialog.close();
                _oDialog.destroy();
            },

            _populateTable: function (oFromDate, oToDate, aFilters) {
                var that = this;
                var oView = this.getView();
                var oTable = this.getView().byId("idTreeTable");
                var oFromDateToS4;
                if (oFromDate.getDay() === 0) {
                    oFromDateToS4 = new Date(oFromDate.setDate(oFromDate.getDate() + 1));
                } else if (oFromDate.getDay() === 1) {
                    oFromDateToS4 = oFromDate;
                } else if (oFromDate.getDay() === 2) {
                    oFromDateToS4 = new Date(oFromDate.setDate(oFromDate.getDate() + 6));
                } else if (oFromDate.getDay() === 3) {
                    oFromDateToS4 = new Date(oFromDate.setDate(oFromDate.getDate() + 5));
                } else if (oFromDate.getDay() === 4) {
                    oFromDateToS4 = new Date(oFromDate.setDate(oFromDate.getDate() + 4));
                } else if (oFromDate.getDay() === 5) {
                    oFromDateToS4 = new Date(oFromDate.setDate(oFromDate.getDate() + 3));
                } else if (oFromDate.getDay() === 6) {
                    oFromDateToS4 = new Date(oFromDate.setDate(oFromDate.getDate() + 2));
                }
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyyMMdd"
                });
                var fDate = oDateFormat.format(oFromDateToS4);
                var tDate = oDateFormat.format(oToDate);

                var ofilter = new Filter({
                    path: 'ProdAllocPerdStartUTCDateTime',
                    operator: FilterOperator.BT,
                    value1: fDate,
                    value2: tDate
                });
                aFilters.push(ofilter);

                oTable.setBusy(true);

                var oModel = this.getOwnerComponent().getModel();
                oModel.read('/ProdAlloc', {
                    filters: aFilters,
                    success: function (oData, result) {
                        var aDates = [];
                        var aCVCs = [];
                        aDates.push(oData.results[0].ProdAllocDate1);
                        aDates.push(oData.results[0].ProdAllocDate2);
                        aDates.push(oData.results[0].ProdAllocDate3);
                        aDates.push(oData.results[0].ProdAllocDate4);
                        aDates.push(oData.results[0].ProdAllocDate5);
                        aDates.push(oData.results[0].ProdAllocDate6);
                        aDates.push(oData.results[0].ProdAllocDate7);
                        aDates.push(oData.results[0].ProdAllocDate8);
                        aDates.push(oData.results[0].ProdAllocDate9);
                        aDates.push(oData.results[0].ProdAllocDate10);
                        aDates.push(oData.results[0].ProdAllocDate11);
                        aDates.push(oData.results[0].ProdAllocDate12);
                        that._aDates = aDates;

                        aCVCs.push(oData.results[0].ProdAllocCVC01);
                        aCVCs.push(oData.results[0].ProdAllocCVC02);
                        aCVCs.push(oData.results[0].ProdAllocCVC03);
                        aCVCs.push(oData.results[0].ProdAllocCVC04);
                        aCVCs.push(oData.results[0].ProdAllocCVC05);
                        aCVCs.push(oData.results[0].ProdAllocCVC06);
                        aCVCs.push(oData.results[0].ProdAllocCVC07);
                        that._aCVCs = aCVCs;

                        for (let i = 0; i < aCVCs.length; i++) {
                            let idLabel = 'idCVCColLabel' + Number(i + 1);
                            let idColumn = 'idCVCColumn' + Number(i + 1);
                            if (aCVCs[i]) {
                                oView.byId(idColumn).setVisible(true);
                                oView.byId(idLabel).setText(aCVCs[i]);
                            } else {
                                oView.byId(idColumn).setVisible(false);
                            }
                        }

                        for (let i = 0; i < aDates.length; i++) {
                            let idLabel = 'idTableColDatLabel' + Number(i + 1);
                            let idColumn = 'idDateColumn' + Number(i + 1);
                            if (aDates[i]) {
                                oView.byId(idColumn).setVisible(true);
                                oView.byId(idLabel).setText(aDates[i]);
                            } else {
                                oView.byId(idColumn).setVisible(false);
                            }
                        }

                        var oItems = oData.results;
                        var oTreeTable = [];
                        var oPrevProdAllocCharc01, oPrevProdAllocCharc02, oPrevProdAllocCharc03;
                        var j, k, m;
                        j = 0;
                        for (var i = 0; i < oItems.length; i++) {
                            if (oPrevProdAllocCharc01 != oItems[i].ProdAllocCharc01 && oPrevProdAllocCharc02 != oItems[i].ProdAllocCharc02 && oPrevProdAllocCharc03 != oItems[i].ProdAllocCharc03) {
                                if (i) {
                                    j = j + 1;
                                }
                                if (oItems[0].KeyFigureID === '1') {
                                    oPrevProdAllocCharc01 = oItems[i].ProdAllocCharc01;
                                    oPrevProdAllocCharc02 = oItems[i].ProdAllocCharc02;
                                    oPrevProdAllocCharc03 = oItems[i].ProdAllocCharc03;

                                    oTreeTable.push({
                                        "ProdAllocCharc01": oItems[i].ProdAllocCharc01,
                                        "ProdAllocCharc02": oItems[i].ProdAllocCharc02,
                                        "ProdAllocCharc03": oItems[i].ProdAllocCharc03,
                                        "child": [],
                                        "KeyFigureID": oItems[i].KeyFigureID,
                                        "KeyFigure": oItems[i].KeyFigure,
                                        "ProductAllocationQty1": oItems[i].ProductAllocationQty1,
                                        "ProductAllocationQty2": oItems[i].ProductAllocationQty2,
                                        "ProductAllocationQty3": oItems[i].ProductAllocationQty3,
                                        "ProductAllocationQty4": oItems[i].ProductAllocationQty4,
                                        "ProductAllocationQty5": oItems[i].ProductAllocationQty5,
                                        "ProductAllocationQty6": oItems[i].ProductAllocationQty6,
                                        "ProductAllocationQty7": oItems[i].ProductAllocationQty7,
                                        "ProductAllocationQty8": oItems[i].ProductAllocationQty8,
                                        "ProductAllocationQty9": oItems[i].ProductAllocationQty9,
                                        "ProductAllocationQty10": oItems[i].ProductAllocationQty10,
                                        "ProductAllocationQty11": oItems[i].ProductAllocationQty11,
                                        "ProductAllocationQty12": oItems[i].ProductAllocationQty12
                                    });
                                } else {

                                }
                            } else if ((oPrevProdAllocCharc01 === oItems[i].ProdAllocCharc01 && oPrevProdAllocCharc02 === oItems[i].ProdAllocCharc02) && oPrevProdAllocCharc03 != oItems[i].ProdAllocCharc03) {
                                if (i) {
                                    j = j + 1;
                                }
                                oPrevProdAllocCharc01 = oItems[i].ProdAllocCharc01;
                                oPrevProdAllocCharc02 = oItems[i].ProdAllocCharc02;
                                oPrevProdAllocCharc03 = oItems[i].ProdAllocCharc03;
                                oTreeTable.push({
                                    "ProdAllocCharc01": oItems[i].ProdAllocCharc01,
                                    "ProdAllocCharc02": oItems[i].ProdAllocCharc02,
                                    "ProdAllocCharc03": oItems[i].ProdAllocCharc03,
                                    "child": [],
                                    "KeyFigureID": oItems[i].KeyFigureID,
                                    "KeyFigure": oItems[i].KeyFigure,
                                    "ProductAllocationQty1": oItems[i].ProductAllocationQty1,
                                    "ProductAllocationQty2": oItems[i].ProductAllocationQty2,
                                    "ProductAllocationQty3": oItems[i].ProductAllocationQty3,
                                    "ProductAllocationQty4": oItems[i].ProductAllocationQty4,
                                    "ProductAllocationQty5": oItems[i].ProductAllocationQty5,
                                    "ProductAllocationQty6": oItems[i].ProductAllocationQty6,
                                    "ProductAllocationQty7": oItems[i].ProductAllocationQty7,
                                    "ProductAllocationQty8": oItems[i].ProductAllocationQty8,
                                    "ProductAllocationQty9": oItems[i].ProductAllocationQty9,
                                    "ProductAllocationQty10": oItems[i].ProductAllocationQty10,
                                    "ProductAllocationQty11": oItems[i].ProductAllocationQty11,
                                    "ProductAllocationQty12": oItems[i].ProductAllocationQty12

                                });
                            } else if (oPrevProdAllocCharc01 === oItems[i].ProdAllocCharc01 && oPrevProdAllocCharc02 === oItems[i].ProdAllocCharc02 && oPrevProdAllocCharc03 === oItems[i].ProdAllocCharc03) {
                                oPrevProdAllocCharc01 = oItems[i].ProdAllocCharc01;
                                oPrevProdAllocCharc02 = oItems[i].ProdAllocCharc02;
                                oPrevProdAllocCharc03 = oItems[i].ProdAllocCharc03;
                                oTreeTable[j].child.push({
                                    "KeyFigureID": oItems[i].KeyFigureID,
                                    "KeyFigure": oItems[i].KeyFigure,
                                    "CheckBox": false,
                                    "ProductAllocationQty1": oItems[i].ProductAllocationQty1,
                                    "ProductAllocationQty2": oItems[i].ProductAllocationQty2,
                                    "ProductAllocationQty3": oItems[i].ProductAllocationQty3,
                                    "ProductAllocationQty4": oItems[i].ProductAllocationQty4,
                                    "ProductAllocationQty5": oItems[i].ProductAllocationQty5,
                                    "ProductAllocationQty6": oItems[i].ProductAllocationQty6,
                                    "ProductAllocationQty7": oItems[i].ProductAllocationQty7,
                                    "ProductAllocationQty8": oItems[i].ProductAllocationQty8,
                                    "ProductAllocationQty9": oItems[i].ProductAllocationQty9,
                                    "ProductAllocationQty10": oItems[i].ProductAllocationQty10,
                                    "ProductAllocationQty11": oItems[i].ProductAllocationQty11,
                                    "ProductAllocationQty12": oItems[i].ProductAllocationQty12
                                });

                            }
                            oView.byId("idProdAllocPanel").setVisible(true);
                            oTable.setBusy(false);
                        }

                        var oModel_tree = new JSONModel();
                        oModel_tree.setData(oTreeTable);
                        oTable.setVisibleRowCount(oTreeTable.length + 3);
                        oView.setModel(oModel_tree, "oModel_tree");
                        oView.getModel("oModel_tree").refresh();

                    }, error: function (err) {

                    }
                });
            },

            onSearch: function () {
                var oFromDate = this.getView().byId("idSelectionRange").getFrom();
                var oToDate = this.getView().byId("idSelectionRange").getTo();
                var oView = this.getView();
                var aFilters = [], ofilter, oKeyFigFilter;
                var oInputVal = oView.byId("idPlanningScreenListInput").getValue();
                ofilter = new Filter({
                    path: 'PlanningScreen',
                    operator: FilterOperator.EQ,
                    value1: oInputVal
                });
                aFilters.push(ofilter);
                var aSelectedKeyFigures = oView.byId("idSelectKeyFigures").getSelectedKeys();
                for (var i = 0; i < aSelectedKeyFigures.length; i++) {
                    oKeyFigFilter = new Filter({
                        path: 'KeyFigure',
                        operator: FilterOperator.EQ,
                        value1: aSelectedKeyFigures[i]
                    });
                    aFilters.push(oKeyFigFilter);
                }
                this._populateTable(oFromDate, oToDate, aFilters);
            },

            onLogsPress: function () {
                var oView = this.getView();
                this._pDialog = this.loadFragment({
                    name: "com.mng.prd.all.dat.mngpalplndata.fragments.LogOptions"
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oView.byId("idLogList").setModel(this._oLogModel, "logList");
                    oDialog.open();
                }.bind(this));

            },

            onPressLogItem: function (oEvent) {
                var _oDialog = this.getView().byId("idLogsDialog");
                MessageToast.show("Pressed : " + oEvent.getSource().getTitle());
                _oDialog.close();
                _oDialog.destroy();
            },

            onLogOptionsClose: function () {
                var _oDialog = this.getView().byId("idLogsDialog");
                _oDialog.close();
                _oDialog.destroy();
            },

            onCVCsPress: function () {
                var oView = this.getView();
                this._pDialog = this.loadFragment({
                    name: "com.mng.prd.all.dat.mngpalplndata.fragments.CVCOptions"
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oView.byId("idCVCList").setModel(this._oCVCModel, "cvcList");
                    oDialog.open();
                }.bind(this));
            },

            onPressCVCItem: function (oEvent) {
                var oView = this.getView();
                var _oDialog = oView.byId("idCVCsDialog");
                var oSelectedItem = oEvent.getSource().getTitle();
                var oItems = oView.getModel("oModel_tree").oData;
                if (oSelectedItem === "Add all CVCs to order view") {
                    for (var i = 0; i < oItems.length; i++) {
                        for (var j = 0; j < oItems[i].child.length; j++) {
                            if (oItems[i].child[j].KeyFigureID === "2") {
                                oItems[i].child[j].CheckBox = true;
                                break;
                            }
                        }
                    }
                    this._populateSalesOrdTable(oItems);
                } else {
                    for (var i = 0; i < oItems.length; i++) {
                        for (var j = 0; j < oItems[i].child.length; j++) {
                            if (oItems[i].child[j].KeyFigureID === "2") {
                                oItems[i].child[j].CheckBox = false;
                                break;
                            }
                        }
                    }
                    var oJSONModel = new JSONModel();
                    oView.setModel(oJSONModel, "salesOrder");
                }
                oView.getModel("oModel_tree").refresh();
                _oDialog.close();
                _oDialog.destroy();
            },

            _populateSalesOrdTable: function (aItems) {
                var that = this;
                var ofilter, aFilters = [], sCVCFilterString;
                var sCVCValue, sFilterString;
                var oView = this.getView();
                var oFromDate = this.getView().byId("idSelectionRange").getFrom();
                var oToDate = this.getView().byId("idSelectionRange").getTo();
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyyMMdd"
                });
                var fDate = oDateFormat.format(oFromDate);
                var tDate = oDateFormat.format(oToDate);

                ofilter = new Filter({
                    path: 'ProdAllocPerdStartUTCDateTime',
                    operator: FilterOperator.BT,
                    value1: fDate,
                    value2: tDate
                });
                aFilters.push(ofilter);
                for (var i = 0; i < aItems.length; i++) {
                    sCVCFilterString = "";
                    for (var j = 0; j < this._aCVCs.length; j++) {
                        if (this._aCVCs[j]) {
                            sCVCValue = Object.values(aItems[i])[j];
                            sCVCFilterString = sCVCFilterString + this._aCVCs[j] + "=" + sCVCValue + ',';
                        }
                    }
                    sFilterString = sCVCFilterString.slice(0, sCVCFilterString.length - 1);
                    ofilter = new Filter({
                        path: 'CVCFilter',
                        operator: FilterOperator.EQ,
                        value1: sFilterString
                    });
                    aFilters.push(ofilter);
                }
                if (aFilters.length > 1) {
                    var oModel = this.getOwnerComponent().getModel();
                    oModel.read("/SalesOrder", {
                        filters: aFilters,
                        success: function (oData, response) {
                            var oJSONModel = new JSONModel();
                            oJSONModel.setData(oData);
                            oView.setModel(oJSONModel, "salesOrder");
                            oView.byId("idSalesOrdTable").setVisible(true);
                            that._salesOrdTableDom.scrollIntoView(true);
                        },
                        error: function () {
                            oView.byId("idSalesOrdTable").setVisible(false);
                        }
                    });
                }
            },

            onCloseCVCOptions: function () {
                var _oDialog = this.getView().byId("idCVCsDialog");
                _oDialog.close();
                _oDialog.destroy();
            },

            _createLocalModels: function () {
                var oLogList = {
                    results: [{
                        "text": "Diplay timeseries log for selected CVC",
                        "key": "1"
                    }, {
                        "text": "Display timeseries log via selection",
                        "key": "2"
                    }, {
                        "text": "Display CVC status log for selected CVC",
                        "key": "3"
                    }, {
                        "text": "Display CVC status log via selection",
                        "key": "4"
                    }]
                };
                this._oLogModel = new sap.ui.model.json.JSONModel();
                this._oLogModel.setData(oLogList);

                var oCVCList = {
                    results: [{
                        "text": "Add all CVCs to order view",
                        "key": "1"
                    }, {
                        "text": "Remove all CVCs from order view",
                        "key": "2"
                    }]
                };
                this._oCVCModel = new sap.ui.model.json.JSONModel();
                this._oCVCModel.setData(oCVCList);
            },

            onExpandCollapse: function () {
                var oTable = this.getView().byId("idTreeTable");
                if (this._expandCollapse === 0) {
                    oTable.expandToLevel(1);
                    this._expandCollapse = 1;
                } else {
                    oTable.collapseAll();
                    this._expandCollapse = 0;
                }
            },

            onValueHelpPlanningScreen: function () {
                var that = this;
                var oView = this.getView();
                var oInput = oView.byId("idPlanningScreenListInput");
                this._oBasicSearchField = new sap.m.SearchField();
                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("idValueHelp", {
                        key: "PlanningScreen",
                        supportMultiselect: false,
                        descriptionKey: "PlanningScreenDescr",
                        ok: function (oEvent) {
                            var oInputVal = oEvent.getParameter("tokens")[0].getProperty("key");
                            oInput.setValue(oInputVal);
                            this.close();
                            that._onPlanningScreenChanged(oInputVal);
                        },
                        cancel: function () {
                            this.close();
                        }
                    });
                }
                var oDialog = this._oValueHelpDialog;
                oDialog.setTitle(this._resourceBundle.getText("planningScreenText"));
                //Bind the columns for table
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [
                        { label: "Planning Screen", template: "PlanningScreen" },
                        { label: "Description", template: "PlanningScreenDescr" }
                    ]
                });

                var oTable = oDialog.getTable();
                oTable.setModel(oColModel, "columns");

                //creating row model and binding it to row aggregation of table
                var oModel = this.getOwnerComponent().getModel();
                oModel.read('/PlnScrF4Help', {
                    success: function (oData, response) {
                        var oRowModel = new JSONModel();
                        oRowModel.setData(oData);
                        oTable.setModel(oRowModel);
                        oTable.bindRows("/results");
                        oDialog.update();
                        oDialog.open();
                    }, error: function (err) {

                    }
                });
            },

            _onPlanningScreenChanged: function (sValue) {
                var oView = this.getView();
                var ofilter = new Filter({
                    path: 'PlanningScreen',
                    operator: FilterOperator.EQ,
                    value1: sValue
                });
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/KeyFigF4Help", {
                    filters: [ofilter],
                    success: function (oData, response) {
                        var oKeyFiguresModel = new JSONModel();
                        var aSelectedKeys = [];
                        oKeyFiguresModel.setData(oData);
                        oView.setModel(oKeyFiguresModel, "keyFigures");
                        for (var i = 0; i < oData.results.length; i++) {
                            if (oData.results[i].line_name === "ALLOCATION_QTY") {
                                aSelectedKeys.push(oData.results[i].line_name);
                            }
                        }
                        oView.byId("idSelectKeyFigures").setSelectedKeys(aSelectedKeys);
                        oView.byId("idSelectKeyFigures").setEnabled(true);
                    }, error: function (error) {

                    }
                })
            },

            onCheckBoxSelected: function (oEvent) {
                var that = this;
                var oRow = oEvent.getSource().getParent().getIndex();
                var oRowState = oEvent.getSource().getSelected();
                var oColumn = oEvent.getSource().getParent().indexOfCell(oEvent.getSource());
                var ofilter, aFilters = [], sCVCFilter = "", sFilterString;
                var oTable = this.getView().byId("idTreeTable");
                var oFromDate = this.getView().byId("idSelectionRange").getFrom();
                var oToDate = this.getView().byId("idSelectionRange").getTo();
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyyMMdd"
                });
                var fDate = oDateFormat.format(oFromDate);
                var tDate = oDateFormat.format(oToDate);

                ofilter = new Filter({
                    path: 'ProdAllocPerdStartUTCDateTime',
                    operator: FilterOperator.BT,
                    value1: fDate,
                    value2: tDate
                });
                aFilters.push(ofilter);
                if (oRowState === true) {
                    for (var i = oRow; i >= 0; i--) {
                        var oSelectedRowData = oTable.getRows()[i].getCells()[0].getText();
                        if (oSelectedRowData === "") {
                            continue;
                        } else {
                            for (let j = 0; j < oColumn - 1; j++) {
                                sCVCFilter = sCVCFilter + this._aCVCs[j] + '=' + oTable.getRows()[i].getCells()[j].getText() + ',';
                            }
                            sFilterString = sCVCFilter.slice(0, sCVCFilter.length - 1);
                            break;
                        }
                    }
                    this._selectedCVC.push({
                        "rowIndex": oRow,
                        "filter": sFilterString
                    });
                } else if (oRowState === false) {
                    var oJSONObject = this._selectedCVC.filter(function (item) { return item.rowIndex === oRow; });
                    var oRowDelete = oJSONObject[0].rowIndex;
                    var indexes = this._selectedCVC.map(function (item, i) {
                        if (item.rowIndex == oRowDelete) return i;
                    }).filter(function (item) { return item != undefined; });
                    this._selectedCVC.splice(indexes[0], 1);
                }
                for (var j = 0; j < this._selectedCVC.length; j++) {
                    ofilter = new Filter({
                        path: 'CVCFilter',
                        operator: FilterOperator.EQ,
                        value1: this._selectedCVC[j].filter
                    });
                    aFilters.push(ofilter);
                }
                if (aFilters.length > 1) {
                    var oModel = this.getOwnerComponent().getModel();
                    oModel.read("/SalesOrder", {
                        filters: aFilters,
                        success: function (oData, response) {
                            var oJSONModel = new JSONModel();
                            oJSONModel.setData(oData);
                            that.getView().setModel(oJSONModel, "salesOrder");
                            that.getView().byId("idSalesOrdTable").setVisible(true);
                            that._OrdViewBtn = 1;
                            that.getView().byId("idOrderViewBtn").setText(that._resourceBundle.getText("orderViewOFF"));
                            that._salesOrdTableDom.scrollIntoView(true);
                        },
                        error: function () {

                        }
                    });
                } else {
                    this._OrdViewBtn = 0;
                    this.getView().byId("idOrderViewBtn").setText(this._resourceBundle.getText("orderViewON"));
                    var oNoData = new JSONModel();
                    that.getView().setModel(oNoData, "salesOrder");
                    this.getView().byId("idSalesOrdTable").setVisible(false);
                }
            },

            onOrderViewPress: function (oEvent) {
                var oView = this.getView();
                var oButton = oView.byId("idOrderViewBtn");
                if (this._OrdViewBtn === 0) {
                    oView.byId("idSalesOrdTable").setVisible(true);
                    oButton.setText(this._resourceBundle.getText("orderViewOFF"));
                    this._OrdViewBtn = 1;
                    this._salesOrdTableDom.scrollIntoView(true);
                } else {
                    oView.byId("idSalesOrdTable").setVisible(false);
                    oButton.setText(this._resourceBundle.getText("orderViewON"));
                    this._OrdViewBtn = 0;
                }
            },

            handleLinkPress: function (oEvent) {
                var oMaterial, oCustGroup, oCustomer, ofilter, aFilters = [];
                var oRowIndex = oEvent.getSource().getParent().getIndex();
                var oColumnIndex = oEvent.getSource().getParent().indexOfCell(oEvent.getSource());
                var oDate = this._aDates[oColumnIndex - 4];
                ofilter = new Filter({
                    path: 'BillingDocumentDate',
                    operator: FilterOperator.EQ,
                    value1: oDate
                });
                aFilters.push(ofilter);
                var oTable = this.getView().byId("idTreeTable");
                for (var i = oRowIndex; i >= 0; i--) {
                    var oSelectedRowData = oTable.getRows()[i].getCells()[0].getText();
                    if (oSelectedRowData === "") {
                        continue;
                    } else {
                        oMaterial = oTable.getRows()[i].getCells()[0].getText();
                        oCustGroup = oTable.getRows()[i].getCells()[1].getText();
                        oCustomer = oTable.getRows()[i].getCells()[2].getText();
                        aFilters.push(new Filter({ path: 'Material', operator: FilterOperator.EQ, value1: oMaterial }));
                        aFilters.push(new Filter({ path: 'CustomerGroup', operator: FilterOperator.EQ, value1: oCustGroup }));
                        aFilters.push(new Filter({ path: 'Customer', operator: FilterOperator.EQ, value1: oCustomer }));
                        break;
                    }
                }

            },

            onExportProdAlloc: function () {
                var oTable = this.getView().byId("idTreeTable");
                var oModel = oTable.getModel("oModel_tree");
                var oJSONData = oModel.getData();
                this._JSONToCSVConverter(oJSONData);
            },

            _JSONToCSVConverter: function (JSONData) {
                var that = this;
                var arrData = JSONData;
                var CSV = '', row = "", row1 = "";
                var oTable = this.getView().byId("idTreeTable");
                oTable.getColumns().forEach(function (oColumn) {
                    var sColumnText = oColumn.getLabel().getText();
                    if (sColumnText) {
                        row1 += '"' + oColumn.getLabel().getText() + '",';
                    }
                });
                CSV += row1 + '\r\n';

                var i, j, k;

                var createRow = function (level) {

                    if (level === "Parent") {
                        row = "";
                        for (var n = 0; n < that._aCVCs.length; n++) {
                            if (that._aCVCs[n]) {
                                row += '"' + Object.values(arrData[i])[n] + '",';
                            }
                        }
                        row += '"' + arrData[i].KeyFigure + '",';
                        row += '"' + arrData[i].ProductAllocationQty1 + '",';
                        row += '"' + arrData[i].ProductAllocationQty2 + '",';
                        row += '"' + arrData[i].ProductAllocationQty3 + '",';
                        row += '"' + arrData[i].ProductAllocationQty4 + '",';
                        row += '"' + arrData[i].ProductAllocationQty5 + '",';
                        row += '"' + arrData[i].ProductAllocationQty6 + '",';
                        row += '"' + arrData[i].ProductAllocationQty7 + '",';
                        row += '"' + arrData[i].ProductAllocationQty8 + '",';
                        row += '"' + arrData[i].ProductAllocationQty9 + '",';
                        row += '"' + arrData[i].ProductAllocationQty10 + '",';
                        row += '"' + arrData[i].ProductAllocationQty11 + '",';
                        row += '"' + arrData[i].ProductAllocationQty12 + '",';
                        CSV += row + "\r\n";
                    } else if (level === "Child") {
                        for (var n = 0; n < that._aCVCs.length; n++) {
                            if (that._aCVCs[n]) {
                                if (n === 0) {
                                    row = ",";
                                } else {
                                    row += ",";
                                }
                            }
                        }
                        row += '"' + arrData[i].child[j].KeyFigure + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty1 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty2 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty3 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty4 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty5 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty6 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty7 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty8 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty9 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty10 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty11 + '",';
                        row += '"' + arrData[i].child[j].ProductAllocationQty12 + '",';
                        CSV += row + "\r\n";
                    }
                };

                for (i = 0; i < arrData.length; i++) {
                    createRow("Parent");
                    if (arrData[i].child.length > 0) {
                        for (j = 0; j < arrData[i].child.length; j++) {
                            createRow("Child");
                        }
                    }
                }

                if (CSV === "") {
                    sap.m.MessageToast.show("Invalid data");
                    return;
                }

                var fileName = "Product Allocation";
                var blob = new Blob([CSV], {
                    type: "text/csv;charset=utf-8;"
                });

                if (sap.ui.Device.browser.name === "ie") { // IE 10+ 
                    navigator.msSaveBlob(blob, "Product Allocation.csv");
                } else {
                    var uri = 'data:application/csv;charset=utf-8,' + escape(CSV);
                    var link = document.createElement("a");
                    link.href = uri;
                    link.style = "visibility:hidden";
                    link.download = fileName + ".csv";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            },

            _createColumnsForProdAlloc: function () {
                var aCols = [], sProperty;
                for (var i = 0; i < this._aCVCs.length; i++) {
                    if (this._aCVCs[i]) {
                        sProperty = "ProdAllocCharc0";
                        sProperty = sProperty + Number(i + 1);
                        aCols.push({
                            label: this._aCVCs[i],
                            property: sProperty,
                            type: EdmType.String
                        });
                    }
                }
                aCols.push({
                    label: 'Key Figure',
                    property: 'KeyFigure',
                    type: EdmType.String
                });
                return aCols;
            },

            onExportSalesOrd: function () {
                var aCols, oBinding, oModel, oTable;
                oTable = this.getView().byId("idSalesOrdTable");
                oModel = oTable.getModel("salesOrder");
                oBinding = oTable.getBinding("rows");
                aCols = this._createColumnsForSalesOrder();

                new Spreadsheet({
                    workbook: {
                        columns: aCols
                    },
                    dataSource: oBinding.getModel().getProperty(oBinding.getPath()),
                    fileName: "Sales Order.xlsx",
                }).build();
            },

            _createColumnsForSalesOrder: function () {
                var aCols = [];
                var oResourceModel = this._resourceBundle;
                aCols.push({
                    label: oResourceModel.getText("salesDoc"),
                    property: 'SalesOrder',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("salesDocItem"),
                    property: 'SalesOrderItem',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("scheduleLineNumber"),
                    property: 'ScheduleLine',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("material"),
                    property: 'Material',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("materialGroup"),
                    property: 'MaterialGroup',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("plant"),
                    property: 'ProductionPlant',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("storageLocation"),
                    property: 'StorageLocation',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("mrpArea"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("mrpArea"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("orderQuantity"),
                    property: 'ScheduleLineOrderQuantity',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("confirmQuantity"),
                    property: 'ConfdOrderQtyByMatlAvailCheck',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("deliveredQuantity"),
                    property: 'DeliveredQtyInOrderQtyUnit',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("openQuantity"),
                    property: 'OpenConfdDelivQtyInOrdQtyUnit',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("quantity"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("baseUnit"),
                    property: 'OrderQuantityUnit',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("arrivalTime"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("matAvailTime"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("matlStagTime"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("goodsIssueDate"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("goodsIssueTime"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("soldToParty"),
                    property: 'PurchaseOrderByCustomer',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("soldToPartyName"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("shipToParty"),
                    property: 'PurchaseOrderByShipToParty',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("shipToPartyName"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("deliveryPriority"),
                    property: 'DeliveryPriority',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("fixedDateQty"),
                    property: 'FixedValueDate',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("deliveryGroup"),
                    property: 'DeliveryGroup',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("shippingPoint"),
                    property: 'ShippingPoint',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("route"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("shippingCondt"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("deliveryBlock"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("deliveryBlock"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("reasonRejection"),
                    property: 'SalesDocumentRjcnReason',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("overallCredStat"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("overallDeliveryStat"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("sdDocCategory"),
                    property: 'SalesOrderItemCategory',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("salesDocType"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("completeDelivery"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("createdOn"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("maxPartDeliveries"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("salesOrg"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("distributionChannel"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("division"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("customerGroup"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("customerGroup1"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("customerGroup2"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("customerGroup4"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("customerGroup5"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("bopStatus"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("bopStatusIcon"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("bopConfirmationStatus"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("bopConfirmationStatus"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("netValue"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("customer"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("createdBy"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("customerPriceGrp"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("name"),
                    property: '',
                    type: EdmType.String
                });
                aCols.push({
                    label: oResourceModel.getText("city"),
                    property: '',
                    type: EdmType.String
                });
                return aCols;
            },

            onTabSelect: function (oEvent) {
                // var oSelectedKey = oEvent.getSource().getSelectedKey();
                // if (oSelectedKey === "1") {
                //     this.getView().byId("idTreeTable").getDomRef().scrollIntoView(true);
                // } else if (oSelectedKey === "2") {
                //     this.getView().byId("idSalesOrderPanel").getDomRef().scrollIntoView(true);
                // }
            },

            onRowSelectionChange: function (oEvent) {
                var ofilterString;
                var aFilters = [];
                var ofilter;
                var oMaterial, oCustGroup, oCustomer, oFiltMaterial = null, oFiltCustGroup = null, oFiltCustomer = null;
                var oTable = this.getView().byId("idTreeTable");
                var oRows = oEvent.getSource().getSelectedIndices();
                for (var i = 0; i < oRows.length; i++) {
                    var oRowID = oRows[i];
                    var oSelectedRowData = oTable.getRows()[oRowID].getCells()[0].getText();
                    if (oSelectedRowData === "") {
                        for (var j = oRowID - 1; j > 0; j--) {
                            var oRow = oTable.getRows()[j];
                            if (oRow.getCells()[0].getText() != "") {
                                oMaterial = oRow.getCells()[0].getText();
                                oCustGroup = oRow.getCells()[1].getText();
                                oCustomer = oRow.getCells()[2].getText();
                                if (oFiltMaterial != oMaterial || oFiltCustGroup != oCustGroup || oFiltCustomer != oCustomer) {
                                    oFiltMaterial = oMaterial;
                                    oFiltCustGroup = oCustGroup;
                                    oFiltCustomer = oCustomer;
                                    ofilterString = oFiltMaterial + " " + oFiltCustGroup + " " + oFiltCustomer;
                                    ofilter = new Filter({
                                        path: 'NewFilter',
                                        operator: FilterOperator.EQ,
                                        value1: ofilterString
                                    });
                                    aFilters.push(ofilter);
                                }
                                break;
                            } else {
                                continue;
                            }
                        }
                    }
                }
            }
        });
    });
