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

            onInit: function () {
                var that = this;
                this._expandCollapse = 0;
                this._selectedCVC = [];
                var oTable = this.getView().byId("idTreeTable");
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
                oToDate = new Date(oToDate.setMonth(oToDate.getMonth() + 3));

                oDateRangeSelect.setFrom(oFromDate);
                oDateRangeSelect.setTo(oToDate);
                this._createLocalModels();

            },

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

                        that._aDates = aDates;
                        that._CVCColumns = [];
                        that._CVCColumns.push("Material");
                        that._CVCColumns.push("CustomerGroup");
                        that._CVCColumns.push("Customer");

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
                var oMaterial, oCustGroup, oCustomer, ofilter, aFilters = [];
                var oRowIndex = oEvent.getSource().getParent().getIndex();
                var oRowSelectionState = oEvent.getSource().getSelected();
                var oTable = this.getView().byId("idTreeTable");
                var oFromDate = this.getView().byId("idSelectionRange").getFrom();
                var oToDate = this.getView().byId("idSelectionRange").getTo();
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyyMMdd"
                });
                var fDate = oDateFormat.format(oFromDate);
                var tDate = oDateFormat.format(oToDate);

                var ofilter = new Filter({
                    path: 'ProdAllocPerdStartUTCDateTime',
                    operator: FilterOperator.BT,
                    value1: fDate,
                    value2: tDate
                });
                aFilters.push(ofilter);
                if (oRowSelectionState === true) {
                    for (var i = oRowIndex; i >= 0; i--) {
                        var oSelectedRowData = oTable.getRows()[i].getCells()[0].getText();
                        if (oSelectedRowData === "") {
                            continue;
                        } else {
                            oMaterial = oTable.getRows()[i].getCells()[0].getText();
                            oCustGroup = oTable.getRows()[i].getCells()[1].getText();
                            oCustomer = oTable.getRows()[i].getCells()[2].getText();
                            break;
                        }
                    }
                    debugger;
                    this._selectedCVC.push({
                        "rowIndex": oRowIndex,
                        "Material": oMaterial,
                        "CustomerGroup": oCustGroup,
                        "Customer": oCustomer
                    });
                } else if (oRowSelectionState === false) {
                    var oJSONObject = this._selectedCVC.filter(function (item) { return item.rowIndex === oRowIndex; });
                    var oRowDelete = oJSONObject[0].rowIndex;
                    var indexes = this._selectedCVC.map(function (item, i) {
                        if (item.rowIndex == oRowDelete) return i;
                    }).filter(function (item) { return item != undefined; });
                    this._selectedCVC.splice(indexes[0], 1);
                }
                for (var j = 0; j < this._selectedCVC.length; j++) {
                    var sMaterial = this._selectedCVC[j].Material;
                    var sCustomerGroup = this._selectedCVC[j].CustomerGroup;
                    var sCustomer = this._selectedCVC[j].Customer;
                    var sFilterString = 'Material=' + sMaterial + ',CustomerGroup=' + sCustomerGroup + ',Customer=' + sCustomer;
                    ofilter = new Filter({
                        path: 'CVCFilter',
                        operator: FilterOperator.EQ,
                        value1: sFilterString
                    });
                    aFilters.push(ofilter);
                }
                that.getView().byId("idSalesOrderPanel").setVisible(true);
                if (aFilters.length > 1) {
                    var oModel = this.getOwnerComponent().getModel();
                    oModel.read("/SalesOrder", {
                        filters: aFilters,
                        success: function (oData, response) {
                            that.getView().byId("idSalesOrderPanel").setVisible(true);
                            that.getView().byId("idOrdDetailsTab").setVisible(true);
                            that.getView().byId("idSalesOrderPanel").getDomRef().scrollIntoView(true);
                        },
                        error: function () {

                        }
                    });
                } else {
                    this.getView().byId("idSalesOrderPanel").setVisible(false);
                }
                that.getView().byId("idOrdDetailsTab").setVisible(true);
                this.getView().byId("idSalesOrderPanel").getDomRef().scrollIntoView(true);
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

            onTabSelect: function(oEvent) {
                debugger;
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
