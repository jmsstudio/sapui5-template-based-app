sap.ui.define([
		"br/com/jmsstudio/productsmanagement/ProductsManagement/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("br.com.jmsstudio.productsmanagement.ProductsManagement.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);