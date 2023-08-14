sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Fragment, MessageToast, JSONModel, formatter) {
        "use strict";

        return Controller.extend("com.mng.prd.all.dat.mngpalplndata.controller.ProductAllocation", {
            formatter: formatter,

            // onInit: function () {
            //     var that = this;
            //     var oTable = this.getView().byId("idProductAllocationPlnTable");
            //     this._oTableTemplate = oTable.clone();
            //     var oToDate, oFromDate;
            //     var oDateRangeSelect = this.getView().byId("idSelectionRange");
            //     var oToday = new Date();
            //     if (oToday.getDay() === 0) {
            //         oFromDate = new Date();
            //         oToDate = new Date();
            //     } else if (oToday.getDay() === 1) {
            //         oFromDate = new Date(new Date().setDate(new Date().getDate() - 1));
            //         oToDate = new Date(new Date().setDate(new Date().getDate() - 1));
            //     } else if (oToday.getDay() === 2) {
            //         oFromDate = new Date(new Date().setDate(new Date().getDate() - 2));
            //         oToDate = new Date(new Date().setDate(new Date().getDate() - 2));
            //     } else if (oToday.getDay() === 3) {
            //         oFromDate = new Date(new Date().setDate(new Date().getDate() - 3));
            //         oToDate = new Date(new Date().setDate(new Date().getDate() - 3));
            //     } else if (oToday.getDay() === 4) {
            //         oFromDate = new Date(new Date().setDate(new Date().getDate() - 4));
            //         oToDate = new Date(new Date().setDate(new Date().getDate() - 4));
            //     } else if (oToday.getDay() === 5) {
            //         oFromDate = new Date(new Date().setDate(new Date().getDate() - 5));
            //         oToDate = new Date(new Date().setDate(new Date().getDate() - 5 ));
            //     } else if (oToday.getDay() === 6) {
            //         oFromDate = new Date(new Date().setDate(new Date().getDate() - 6));
            //         oToDate = new Date(new Date().setDate(new Date().getDate() - 6));
            //     }
            //     oToDate = new Date(oToDate.setMonth(oToDate.getMonth() + 3));

            //     oDateRangeSelect.setFrom(oFromDate);
            //     oDateRangeSelect.setTo(oToDate);

            //     this._createLocalModels();

            //     this._populateTable(oFromDate, oToDate);

            // },

            // _populateTable: function (oFromDate, oToDate) {
            //     var that = this;
            //     var oTable = this.getView().byId("idProductAllocationPlnTable");
            //     var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            //         pattern: "yyyyMMdd"
            //     });
            //     var fDate = oDateFormat.format(oFromDate);
            //     var tDate = oDateFormat.format(oToDate);

            //     this._oProductAllocationObject = 'MT_AMC_MAT_CUSTGROUP_CUSTOMER';

            //     var aFilters = [];
            //     var ofilter1, ofilter2;
            //     ofilter1 = new Filter({
            //         path: 'ProductAllocationObject',
            //         operator: FilterOperator.EQ,
            //         value1: this._oProductAllocationObject
            //     });
            //     aFilters.push(ofilter1);

            //     ofilter2 = new Filter({
            //         path: 'ProdAllocPerdStartUTCDateTime',
            //         operator: FilterOperator.BT,
            //         value1: fDate,
            //         value2: tDate
            //     });
            //     aFilters.push(ofilter2);
            //     oTable.setBusy(true);
            //     var oModel = this.getOwnerComponent().getModel();
            //     oModel.read('/ProdAlloc', {
            //         filters: aFilters,
            //         urlParameters: { "$top": "1" },
            //         success: function (oData, result) {
            //             var oView = that.getView();
            //             var aDates = [];
            //             aDates.push(oData.results[0].ProdAllocDate1);
            //             aDates.push(oData.results[0].ProdAllocDate2);
            //             aDates.push(oData.results[0].ProdAllocDate3);
            //             aDates.push(oData.results[0].ProdAllocDate4);
            //             aDates.push(oData.results[0].ProdAllocDate5);
            //             aDates.push(oData.results[0].ProdAllocDate6);
            //             aDates.push(oData.results[0].ProdAllocDate7);
            //             aDates.push(oData.results[0].ProdAllocDate8);
            //             aDates.push(oData.results[0].ProdAllocDate9);
            //             aDates.push(oData.results[0].ProdAllocDate10);
            //             aDates.push(oData.results[0].ProdAllocDate11);
            //             aDates.push(oData.results[0].ProdAllocDate12);

            //             for (let i = 0; i < aDates.length; i++) {
            //                 let idLabel = 'idTableColDatLabel' + Number(i + 1);
            //                 let idColumn = 'idDateColumn' + Number(i + 1);
            //                 if (aDates[i]) {
            //                     oView.byId(idColumn).setVisible(true);
            //                     oView.byId(idLabel).setText(aDates[i]);
            //                 } else {
            //                     oView.byId(idColumn).setVisible(false);
            //                 }
            //                 oTable.setBusy(false);
            //             }
            //         }, error: function (err) {

            //         }
            //     });

            //     oTable.bindRows({
            //         path: "/ProdAlloc",
            //         filters: aFilters,
            //         template: this._oTableTemplate
            //     });
            // },
            onInit: function () {
                var that = this;
                // this._initMultiInput();
                this._expandCollapse = 0;
                var oTable = this.getView().byId("idTreeTable");
                var oToDate, oFromDate;
                var oDateRangeSelect = this.getView().byId("idSelectionRange");
                var oToday = new Date();
                // //Demo Temporary Logic
                // oFromDate = new Date(new Date().setDate(new Date().getDate() - 17));
                // oFromDate = new Date(oFromDate.setMonth(oFromDate.getMonth() - 5));
                // oToDate = new Date(new Date().setDate(new Date().getDate() - 17));
                // oToDate = new Date(oToDate.setMonth(oToDate.getMonth() - 2));
                // //End of Demo Temporary Logic
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
                oToDate = new Date(oToDate.setMonth(oToDate.getMonth() + 3));

                oDateRangeSelect.setFrom(oFromDate);
                oDateRangeSelect.setTo(oToDate);
                this._createLocalModels();

                // this._populateTable(oFromDate, oToDate);

            },

            // _initMultiInput: function () {
            //     var oMultiInput = this.getView().byId("idPlanningScreenListInput");
            //     var fnValidator = function (oArgs) {
            //         var oObject = oArgs.suggestionObject.getBindingContext().getObject();
            //         var key = oObject.PlanningScreen;
            //         var text = oObject.PlanningScreenDescr;
            //         return new sap.m.Token({ key: key, text: text });
            //     };
            //     oMultiInput.addValidator(fnValidator);
            // },

            onAfterRendering: function () {
                this._resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            },

            _populateTable: function (oFromDate, oToDate, aFilters) {
                var that = this;
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
                        var oView = that.getView();
                        var aDates = [];
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
                        oTable.setBusy(false);
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

                            }
                        }

                        var oModel_tree = new JSONModel();
                        oModel_tree.setData(oTreeTable);
                        oTable.setVisibleRowCount(oTreeTable.length + 3);
                        that.getView().setModel(oModel_tree, "oModel_tree");
                        that.getView().getModel("oModel_tree").refresh();

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
                var aSelectedKeyFigures = oView.byId("idSelectKeyFigues").getSelectedKeys();
                for(var i=0;i<aSelectedKeyFigures.length;i++) {
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
                var _oDialog = this.getView().byId("idCVCsDialog");
                MessageToast.show("Pressed : " + oEvent.getSource().getTitle());
                _oDialog.close();
                _oDialog.destroy();
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
                            debugger;
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
                        // oDialog.setTokens([]);
                        // oDialog.setTokens(oInput.getTokens());
                        oDialog.update();
                        oDialog.open();
                    }, error: function (err) {

                    }
                });
            },

            _onPlanningScreenChanged: function (sValue) {
                debugger;
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
                        oKeyFiguresModel.setData(oData);
                        oView.setModel(oKeyFiguresModel, "keyFigures");
                        oView.byId("idSelectKeyFigues").setEnabled(true);
                    }, error: function (error) {

                    }
                })
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
