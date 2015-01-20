
var EventEmitter = require( 'eventemitter2' ).EventEmitter2;

module.exports.Ymir = Ymir;

function Ymir( options ) { 
    options = options || {};

    EventEmitter.call( this );
    this.views = {};
    this.list = options.listEl || document.createElement( options.listTagName || 'nav' );
    this.el = options.el || document.createElement( options.tagName  || 'div' );
    this.el.className = options.className;
    this.options = options;
    this.options.showClass = options.showClass || 'show';
    this._isDynamic = options.dynamic === false ? false : true;
}

Ymir.prototype = Object.create( EventEmitter.prototype, {
    viewList: {
        get: function( ) {
            return Object.keys( this.views ).map( this._mapViews.bind( this ) );
        }
    }
} );

Ymir.prototype.addView = function( view ) {
    var isView = Ymir.isView( view );
    if ( this.views.id ) {
        this.emit( 'error', new Error( 'Issue adding view with the id ' + view.id + ': duplicate id' ) );
        return false;
    } 
    if ( this._isDynamic ) {
        this.el.appendChild( view.el );
        if ( view.linkto !== false ) {
            this._appendToList( view );
        }
    }
    this.views[ view.id ] = view;
    if ( view.el.classList.contains( this.options.showClass ) ) {
        view.isShown = false;
        view.el.classList.remove( this.options.showClass );
    }
    return true;
};

Ymir.prototype.open = function( id ) {
    var view;
    if ( id && this.views[ id ] ) {
        view = this.views[ id ];
        if ( view.isShown ) {
            return;
        }
        view.isShown = true;
        view.el.classList.add( this.options.showClass );
        this._closeViews( id );
    }
};

Ymir.prototype._closeViews = function( id ) {
      
    var showClass = this.options.showClass || 'show';
    function eachView( view ) {
        if ( view.isShown && view.id !== id ) {
            view.el.classList.remove( showClass );
            view.isShown = false;
        }
    }

    this.viewList.forEach( eachView );  
};

Ymir.prototype._mapViews = function( viewName ) {
    return this.views[ viewName ];
};

Ymir.prototype._appendToList = function( view ) {
    var el = document.createElement( this.options.listItemTagName || '' );
    el.innerHTML = view.id
    el.addEventListener( 'click', this.open.bind( this, view.id ) ); 
    this.list.appendChild( el );
};

Ymir.isView = function( view ) {
    return view && 
        typeof view === 'object' && 
        typeof view.el === 'object' && 
        view.el.tagName &&
        view.id; // test all requirements of a view
};
