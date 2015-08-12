var AmpersandView = require('ampersand-view');
var EJSON = require('mongodb-extended-json');
var _ = require('lodash');
var Query = require('mongodb-language-model').Query;
// var debug = require('debug')('scout:refine-view:index');

module.exports = AmpersandView.extend({
  template: require('./index.jade'),
  props: {
    valid: {
      type: 'boolean',
      default: true
    }
  },
  derived: {
    notEmpty: {
      deps: ['model.queryString'],
      fn: function() {
        return this.model.queryString !== '{}';
      }
    }
  },
  bindings: {
    'model.queryString': {
      type: 'value',
      hook: 'refine-input'
    },
    notEmpty: [{
      type: 'toggle',
      hook: 'reset-button'
    }, {
      type: 'booleanClass',
      hook: 'refine-button',
      yes: 'btn-info',
      no: 'btn-default'
    }],
    valid: [
      // red input border while query is invalid
      {
        type: 'booleanClass',
        hook: 'refine-input-group',
        yes: '',
        no: 'has-error'
      },
      // disable button while query is invalid
      {
        type: 'booleanAttribute',
        hook: 'refine-button',
        no: 'disabled',
        yes: null
      }
    ]
  },
  events: {
    'click [data-hook=refine-button]': 'refineClicked',
    'click [data-hook=reset-button]': 'resetClicked',
    'input [data-hook=refine-input]': 'inputChanged',
    'submit form': 'submit'
  },
  _cleanupInput: function(input) {
    var output = input;
    // accept whitespace-only input as empty query
    if (_.trim(output) === '') {
      output = '{}';
    }
    // replace single quotes with double quotes
    output = output.replace(/'/g, '"');
    // wrap field names in double quotes
    output = output.replace(/([{,])\s*([^,{\s\'"]+)\s*:/g, ' $1 "$2" : ');
    return output;
  },
  /*eslint no-new: 0*/
  inputChanged: function() {
    // validate user input on the fly
    var queryStr = this._cleanupInput(this.queryByHook('refine-input').value);
    try {
      // is it valid eJSON?
      var queryObj = EJSON.parse(queryStr);
      // is it a valid parsable Query according to the language?
      new Query(queryObj, {
        parse: true
      });
    } catch (e) {
      this.valid = false;
      return;
    }
    this.valid = true;
  },
  resetClicked: function() {
    this.model.query = new Query();
    this.trigger('submit', this);
  },
  refineClicked: function() {
    var queryStr = this._cleanupInput(this.queryByHook('refine-input').value);
    var queryObj = new Query(EJSON.parse(queryStr), {
      parse: true
    });
    this.model.query = queryObj;
    this.trigger('submit', this);
  },
  submit: function(evt) {
    evt.preventDefault();
    if (this.valid) {
      this.buttonClicked();
    }
  }
});
