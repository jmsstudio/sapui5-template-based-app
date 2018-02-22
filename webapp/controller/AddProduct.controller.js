sap.ui.define(
  [
    'br/com/jmsstudio/productsmanagement/ProductsManagement/controller/BaseController',
    'sap/ui/core/routing/History',
    'sap/m/MessageToast',
  ],
  function(BaseController, History, MessageToast) {
    'use strict';

    return BaseController.extend('br.com.jmsstudio.productsmanagement.ProductsManagement.controller.AddProduct', {
      /* =========================================================== */
      /* lifecycle methods */
      /* =========================================================== */
      /**
       * Called when the add controller is instantiated.
       * @public
       */
      onInit: function() {
        // Register to the add route matched
        this.getRouter()
          .getRoute('addProduct')
          .attachPatternMatched(this._onRouteMatched, this);
      },

      /* =========================================================== */
      /* event handlers */
      /* =========================================================== */
      _onRouteMatched: function() {
        var model = this.getModel();
        model.metadataLoaded().then(this._onMetadataLoaded.bind(this));
      },

      onCancel: function() {
        this.onNavBack();
      },

      onSave: function() {
        this.getModel().submitChanges();
      },

      /**
       * Event handler for navigating back.
       * It checks if there is a history entry. If yes, history.go(-1) will happen.
       * If not, it will replace the current entry of the browser history with the worklist route.
       * @public
       */
      onNavBack: function() {
        //clears data
        this.getModel().deleteCreatedEntry(this._context);

        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          // The history contains a previous entry
          history.go(-1);
        } else {
          // Otherwise we go backwards with a forward history
          var bReplace = true;
          this.getRouter().navTo('worklist', {}, bReplace);
        }
      },

      _onMetadataLoaded: function() {
        var props = {
          ProductID: '' + parseInt(Math.random() * 10000000000, 10),
          TypeCode: 'PR',
          TaxTarifCode: 1,
          CurrencyCode: 'EUR',
          MeasureUnit: 'EA',
        };

        this._context = this.getModel().createEntry('/ProductSet', {
          properties: props,
          success: this._onCreateSuccess.bind(this),
        });
        this.getView().setBindingContext(this._context);
      },

      _onCreateSuccess: function(product) {
        var id = product.ProductID;

        this.getRouter().navTo('object', { objectId: id }, true);

        //unbind the view to not show the object again
        this.getView().unbindObject();

        var message = this.getResourceBundle().getText('newObjectCreated', [product.Name]);

        MessageToast.show(message, { closeOnBrowserNavigation: false });
      },
    });
  }
);
