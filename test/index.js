var test = require( 'tape' ),   
    Ymir = require( '..' ).Ymir,
    EventEmitter2 = require( 'eventemitter2' ).EventEmitter2;


test( 'testing Ymir', function( t ) {
      t.equals( typeof Ymir, 'function', 'Ymir is exported as a function' );
      t.equals( typeof new Ymir(), 'object', 'new instance of Ymir is created when calling new' );
      t.equals( typeof new Ymir().el, 'object', 'new instance of Ymir has an el object' );
      t.equals( new Ymir().el.tagName, 'DIV', 'Ymir.el property is an element that has the default tagName of DIV' );
      t.equals( typeof new Ymir().list, 'object', 'new instance of Ymir has an list object' );
      t.equals( new Ymir().list.tagName, 'NAV', 'Ymir.list property is an element that has the default tagName of NAV' );
      t.equals( typeof new Ymir().views, 'object', 'new Ymir instance has a views object' );
      t.equals( new Ymir() instanceof EventEmitter2, true, 'Ymir is an instanceof an event emitter' );
      t.equals( typeof new Ymir().options, 'object', 'new Ymir instance has an options object' );
      t.equals( new Ymir()._isDynamic, true, 'new Ymir instance sets a context property of _isDynamic and will be set to true by default' );
      t.end();
} );

test( 'testing Ymir input options', function( t ){
      var elTest = document.createElement( 'div' );
      t.equals( new Ymir({ el: elTest, }).el, elTest, 'when an el property is passed to Ymil constructor in the option object it is set to the el property of the Ymir instance' );
      t.equals( new Ymir({ listEl: elTest }).list, elTest, 'when a listEl property is passed to Ymir constructor in the option object it is set to the list property of the Ymil instance' );
      t.equals( new Ymir({ tagName: 'section' }).el.tagName, 'SECTION', 'when an tagName property is passed to Ymir constructor in the option object it is sets the el tagName property to the tagName specified' );
       t.equals( new Ymir({ listTagName: 'ul' }).list.tagName, 'UL', 'when an ListTagName property is passed to Ymir constructor in the option object it is sets the list tagName property to the tagName specified' );
       t.equals( new Ymir({ className: 'foo' }).el.className, 'foo', 'when the className property is passed to Ymir constructor in the options object it sets the className of the el property' );
       t.equals( new Ymir({ showClass: 'bar' }).options.showClass, 'bar', 'when passing the showClass property the options.showClass property is set to that value');
       t.equals( new Ymir({ dynamic: false })._isDynamic, false, 'when the proprty dynamic is set to false on the options object passed to Ymir constructor it will set the property _isDynamic to that value' );
       t.end();
});
