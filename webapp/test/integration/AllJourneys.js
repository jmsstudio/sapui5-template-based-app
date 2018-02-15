/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"br/com/jmsstudio/productsmanagement/ProductsManagement/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"br/com/jmsstudio/productsmanagement/ProductsManagement/test/integration/pages/Worklist",
	"br/com/jmsstudio/productsmanagement/ProductsManagement/test/integration/pages/Object",
	"br/com/jmsstudio/productsmanagement/ProductsManagement/test/integration/pages/NotFound",
	"br/com/jmsstudio/productsmanagement/ProductsManagement/test/integration/pages/Browser",
	"br/com/jmsstudio/productsmanagement/ProductsManagement/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "br.com.jmsstudio.productsmanagement.ProductsManagement.view."
	});

	sap.ui.require([
		"br/com/jmsstudio/productsmanagement/ProductsManagement/test/integration/WorklistJourney",
		"br/com/jmsstudio/productsmanagement/ProductsManagement/test/integration/ObjectJourney",
		"br/com/jmsstudio/productsmanagement/ProductsManagement/test/integration/NavigationJourney",
		"br/com/jmsstudio/productsmanagement/ProductsManagement/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});