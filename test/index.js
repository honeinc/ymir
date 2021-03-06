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
    t.equals( Array.isArray( new Ymir().viewList ), true, 'new Ymir instance has a viewList array' );
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

test( 'testing Ymir::addView invalid view', function( t ) {
    var ymir = new Ymir();

    ymir.on( 'error', function( err ) {
        t.equals( err instanceof Error, true, 'When an invalid view is added to an instance of Ymir the error event is called and passes and error object' );
        t.equals( /invalid view/i.test( err.message ), true, 'When an invalid view is added the error that is given has "invalid view" in it' );
        t.end();
    });

    t.equals( ymir.addView(), false, 'when adding a view to Ymir via the addView method if the view is not added the function will return false' );
});

test( 'testing Ymir::addView duplicate id', function( t ) {
    var ymir = new Ymir(),
        view = {
            id: 'foo',
            el: document.createElement( 'section' )
        };

    ymir.on( 'error', function( err ) {
        t.equals( err instanceof Error, true, 'When a view, with a duplicate id, is added to an instance of Ymir the error event is called and passes and error object' );
        t.equals( /duplicate id/i.test( err.message ), true, 'When a view, with a duplicate id, is added the error that is given has "duplicate id" in it' );
        t.end();
    });

    ymir.addView( view );
    ymir.addView( view );
});

test( 'testing Ymir::addView dynamic', function( t ) {
    var ymir = new Ymir( { dynamic: false } ),
        dymir = new Ymir( { dynamic: true } ),
        view = {
            id: 'foo',
            el: document.createElement( 'div' ),
            linkto: false
        };

    ymir.addView( view );
    t.equals( ymir.el.children.length, 0, 'When the option dynamic false is passed to Ymir constructor when adding a view the view el is not appended to the instances el' );
    dymir.addView( view );
    t.equals( dymir.el.children.length, 1, 'When the option dynamic true is passed to Ymir constructor when adding a view the view el gets appended to the instances el' );
    t.equals( dymir.list.children.length, 0, 'When the option dynamic true and linkto false is passed to Ymir constructor when adding a view there is no elements generated and appended to the instances list' );
    t.end();

});

test( 'testing Ymir::addView', function( t ) {
    var ymir = new Ymir( { showClass: 'bar' } ),
        view = {
            id: 'foo',
            el: document.createElement( 'div' )
        };

    view.el.classList.add( 'bar' );
    t.equals( ymir.addView( view ), true, 'when adding a valid view to ymir using addView the function will return true if successful' );
    t.equals( ymir.viewList[ 0 ].id, 'foo', 'when a view is added to ymir using addView the viewList should contain that view' );
    t.equals( typeof ymir.views['foo'], 'object', 'when adding a view to ymir via addView the view should be accessable from the views property by id' );
    t.equals( view.el.classList.contains( 'bar' ), false, 'when adding a view with an element that has the "showClass" it will be removed from the element' );
    t.end();
});

test( 'testing Ymir::removeView', function( t ) {
    var ymir = new Ymir( );
        view = {
            id: 'foo',
            el: document.createElement( 'div' )
        };

    ymir.addView( view );
    ymir.removeView( 'foo' );

    t.equals( ymir.el.children.length, 0, 'when removing a previously added view the view should be removed from the Ymir.el' );
    t.equals( ymir.list.children.length, 0, 'when removing a previously added view the views link in the list should be removed from Ymir.list' );
    t.equals( typeof ymir.views[ 'foo' ], 'undefined', 'when a previously added view is removed from the Ymir.views cache' );
    t.end();
});

test( 'testing Ymir.removeActive', function( t ) {
    var foo = document.createElement( 'div' ),
        bar = document.createElement( 'span' );
    foo.classList.add( 'active' );
    bar.classList.add( 'active-bar' );
    t.equals( typeof Ymir.removeActive(), 'function', 'when Ymir.removeActive is called it returns a function or iterator' )
    Ymir.removeActive( 'active' )( foo );
    Ymir.removeActive( 'active-bar' )( bar );
    t.equals( foo.classList.contains( 'active' ), false, 'when Ymir.removeActive return fn is passed a DOM element the class passes in fist argument or intial function will be removed from that element' );
    t.equals( bar.classList.contains( 'active-bar' ), false, 'when Ymir.removeActive return fn is passed a DOM element the class passes in fist argument or intial function will be removed from that element' );
    t.end();
});

test( 'testing Ymir.filterById', function( t ) {
    var foo = document.createElement( 'div' ),
        bar = foo.cloneNode();

    foo.setAttribute( 'data-linkto', 'baz' );
    bar.setAttribute( 'data-linkto', 'qux' );
    t.equals( typeof Ymir.filterById(), 'function', 'when Ymir.filterById is called it returns a function or iterator' );
    t.equals( Ymir.filterById( 'baz' )( foo ), true, 'when Ymir.filterById return fn is called with a dom node that has an aatribute `data-linkto` thats value is the same as the `id` passed in the initial fn it will return true');
    t.equals( Ymir.filterById( 'baz' )( bar ), false, 'when Ymir.filterById return fn is called with a dom node that has an aatribute `data-linkto` thats value is differnt then the `id` passed in the initial fn it will return false');    
    t.end();
} );
