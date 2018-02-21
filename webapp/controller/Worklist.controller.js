sap.ui.define(
  [
    'br/com/jmsstudio/productsmanagement/ProductsManagement/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'br/com/jmsstudio/productsmanagement/ProductsManagement/model/formatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
  ],
  function(BaseController, JSONModel, formatter, Filter, FilterOperator) {
    'use strict';

    return BaseController.extend('br.com.jmsstudio.productsmanagement.ProductsManagement.controller.Worklist', {
      formatter: formatter,

      _filters: {
        cheap: [new Filter('Price', 'LT', 100)],
        moderate: [new Filter('Price', 'BT', 100, 1000)],
        expensive: [new Filter('Price', 'GT', 1000)],
      },

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function() {
        var oViewModel,
          iOriginalBusyDelay,
          oTable = this.byId('table');

        // Put down worklist table's original value for busy indicator delay,
        // so it can be restored later on. Busy handling on the table is
        // taken care of by the table itself.
        iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
        // keeps the search state
        this._aTableSearchState = [];

        // Model used to manipulate control states
        oViewModel = new JSONModel({
          worklistTableTitle: this.getResourceBundle().getText('worklistTableTitle'),
          shareOnJamTitle: this.getResourceBundle().getText('worklistTitle'),
          shareSendEmailSubject: this.getResourceBundle().getText('shareSendEmailWorklistSubject'),
          shareSendEmailMessage: this.getResourceBundle().getText('shareSendEmailWorklistMessage', [location.href]),
          tableNoDataText: this.getResourceBundle().getText('tableNoDataText'),
          tableBusyDelay: 0,
          cheap: 0,
          moderate: 0,
          expensive: 0,
        });
        this.setModel(oViewModel, 'worklistView');

        // Make sure, busy indication is showing immediately so there is no
        // break after the busy indication for loading the view's meta data is
        // ended (see promise 'oWhenMetadataIsLoaded' in AppController)
        oTable.attachEventOnce('updateFinished', function() {
          // Restore original busy indicator delay for worklist's table
          oViewModel.setProperty('/tableBusyDelay', iOriginalBusyDelay);
        });
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Triggered by the table's 'updateFinished' event: after new table
       * data is available, this handler method updates the table counter.
       * This should only happen if the update was successful, which is
       * why this handler is attached to 'updateFinished' and not to the
       * table's list binding's 'dataReceived' method.
       * @param {sap.ui.base.Event} oEvent the update finished event
       * @public
       */
      onUpdateFinished: function(oEvent) {
        // update the worklist's object counter after the table update
        var sTitle;
        var oTable = oEvent.getSource();
        var model = this.getModel();
        var viewModel = this.getModel('worklistView');
        var iTotalItems = oEvent.getParameter('total');
        // only update the counter if the length is final and
        // the table is not empty
        if (iTotalItems && oTable.getBinding('items').isLengthFinal()) {
          sTitle = this.getResourceBundle().getText('worklistTableTitleCount', [iTotalItems]);

          //iterate the filters and get count from the server
          jQuery.each(this._filters, function(filterKey, filterObj) {
            model.read('/ProductSet/$count', {
              filters: filterObj,
              success: function(data) {
                var path = '/' + filterKey;
                viewModel.setProperty(path, data);
              },
            });
          });
        } else {
          sTitle = this.getResourceBundle().getText('worklistTableTitle');
        }
        this.getModel('worklistView').setProperty('/worklistTableTitle', sTitle);
      },

      /**
       * Event handler when a table item gets pressed
       * @param {sap.ui.base.Event} oEvent the table selectionChange event
       * @public
       */
      onPress: function(oEvent) {
        // The source is the list item that got pressed
        this._showObject(oEvent.getSource());
      },

      /**
       * Event handler for navigating back.
       * We navigate back in the browser historz
       * @public
       */
      onNavBack: function() {
        history.go(-1);
      },

      onSearch: function(oEvent) {
        if (oEvent.getParameters().refreshButtonPressed) {
          // Search field's 'refresh' button has been pressed.
          // This is visible if you select any master list item.
          // In this case no new search is triggered, we only
          // refresh the list binding.
          this.onRefresh();
        } else {
          var aTableSearchState = [];
          var sQuery = oEvent.getParameter('query');

          if (sQuery && sQuery.length > 0) {
            aTableSearchState = [new Filter('Name', FilterOperator.Contains, sQuery)];
          }
          this._applySearch(aTableSearchState);
        }
      },

      /**
       * Event handler for refresh event. Keeps filter, sort
       * and group settings and refreshes the list binding.
       * @public
       */
      onRefresh: function() {
        var oTable = this.byId('table');
        oTable.getBinding('items').refresh();
      },

      /**
       * Event handler for press event on object identifier. Opens details popover to show product dimensions.
       * @public
       */
      onShowDetailPopover: function(event) {
        var popover = this._getPopover();
        var source = event.getSource();
        popover.bindElement(source.getBindingContext().getPath());

        //opens the dialog
        popover.openBy(event.getParameter('domRef'));
      },

      onIconTabBarSelect: function(event) {
        var key = event.getParameter('key');
        var filter = this._filters[key];
        var tableElement = this.byId('table');
        var bindingObject = tableElement.getBinding('items');

        if (filter) {
          bindingObject.filter(filter);
        } else {
          bindingObject.filter([]);
        }
      },

      /* =========================================================== */
      /* internal methods                                            */
      /* =========================================================== */

      /**
       * Shows the selected item on the object page
       * On phones a additional history entry is created
       * @param {sap.m.ObjectListItem} oItem selected Item
       * @private
       */
      _showObject: function(oItem) {
        this.getRouter().navTo('object', {
          objectId: oItem.getBindingContext().getProperty('ProductID'),
        });
      },

      /**
       * creates a popover
       */
      _getPopover: function() {
        if (!this._popover) {
          this._popover = sap.ui.xmlfragment(
            'br.com.jmsstudio.productsmanagement.ProductsManagement.view.ResponsivePopover',
            this
          );
          this.getView().addDependent(this._popover);
        }

        return this._popover;
      },

      /**
       * Internal helper method to apply both filter and search state together on the list binding
       * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
       * @private
       */
      _applySearch: function(aTableSearchState) {
        var oTable = this.byId('table'),
          oViewModel = this.getModel('worklistView');
        oTable.getBinding('items').filter(aTableSearchState, 'Application');
        // changes the noDataText of the list in case there are no filter results
        if (aTableSearchState.length !== 0) {
          oViewModel.setProperty('/tableNoDataText', this.getResourceBundle().getText('worklistNoDataWithSearchText'));
        }
      },
    });
  }
);
