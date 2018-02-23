sap.ui.define(['sap/ui/core/Control', 'sap/m/RatingIndicator', 'sap/m/Button'], function(
  Control,
  RatingIndicator,
  Button
) {
  'use strict';

  return Control.extend('br.com.jmsstudio.productsmanagement.ProductsManagement.control.ProductRate', {
    metadata: {
      properties: {
        value: {
          type: 'float',
          defaultValue: 0,
        },
      },
      aggregations: {
        _rating: { type: 'sap.m.RatingIndicator', multiple: false, visibility: 'hidden' },
        _button: { type: 'sap.m.Button', multiple: false, visibility: 'hidden' },
      },
      events: {
        valueSubmit: {
          parameters: {
            value: { type: 'float' },
          },
        },
      },
    },

    init: function() {
      this.setAggregation(
        '_rating',
        new RatingIndicator({ value: this.getValue(), maxValue: 5, liveChange: this._onRate.bind(this) })
      ).addStyleClass('sapUiTinyMarginEnd');

      this.setAggregation(
        '_button',
        new Button({ text: '{i18n>productRatingButtonText}', enabled: false, press: this._onSubmit.bind(this) })
      );
    },

    _onRate: function(event) {
      this.setValue(event.getParameter('value'));
      this.getAggregation('_button').setEnabled(true);
    },

    _onSubmit: function() {
      this.fireEvent('valueSubmit', { value: this.getValue() });
      this.getAggregation('_button').setEnabled(false);
    },

    renderer: function(rendererManager, controlObject) {
      rendererManager.write('<div');
      rendererManager.writeControlData(controlObject);
      rendererManager.addClass('sapUiSmallMarginBeginEnd');
      rendererManager.writeClasses();
      rendererManager.write('>');

      rendererManager.renderControl(controlObject.getAggregation('_rating'));
      rendererManager.renderControl(controlObject.getAggregation('_button'));

      rendererManager.write('</div>');
    },
  });
});
