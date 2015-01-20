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
    t.end();
});
