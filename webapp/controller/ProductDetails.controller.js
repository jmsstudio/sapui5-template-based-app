sap.ui.define(
  ['sap/ui/core/mvc/Controller', 'br/com/jmsstudio/productsmanagement/ProductsManagement/model/formatter'],
  function(Controller, formatter) {
    'use strict';

    return Controller.extend('br.com.jmsstudio.productsmanagement.ProductsManagement.controller.ProductDetails', {
      formatter: formatter,
      onInit: function() {
        this.byId('categoryLabel').setVisible(false);
        this.byId('category').setVisible(false);
      },
    });
  }
);
