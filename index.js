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
    if ( !isView ){
        this.emit( 'error', new Error( 'Issue adding view: invalid view' ) );
        return false;
    }
    if ( this.views[ view.id ] ) {
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

Ymir.prototype.removeView = function( id ) {
    var view = this.views[ id ],
        link;

    if ( !view ) {
        return false;
    }
    if ( this._isDynamic ) {
        this.el.removeChild( view.el );
        if ( view.linkto !== false ) {
            link = this.list.querySelector( '[data-linkto=' + view.id + ']' );
            this.list.removeChild( link );
        }
    }
    delete this.views[ id ];
    return true;
};

Ymir.prototype.open = function( id, listItem, e ) {
    var view;

    e = e || {};

    if ( e.ymirHandled ) {
        return;
    }
    e.ymirHandled = true;

    if ( id && this.views[ id ] ) {
        view = this.views[ id ];
        if ( view.isShown ) {
            return;
        }
        view.isShown = true;
        view.el.classList.add( this.options.showClass );
        this._closeViews( id );
        this.list.children.forEach( Ymir.removeActive );
        if ( listItem ) {
          listItem.classList.add( 'active' );
        }
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

Ymir.prototype._appendToList = function( view, el ) {
    var el = document.createElement( this.options.listItemTagName || 'div' );
    el.innerHTML = view.id;
    el.setAttribute( 'data-linkto', view.id );
    el.addEventListener( 'touchstart', this.open.bind( this, view.id, el ) );
    el.addEventListener( 'click', this.open.bind( this, view.id, el ) );
    this.list.appendChild( el );
};

Ymir.removeActive = function( listItem ) {
    listItem.classList.remove( 'active' );
};

Ymir.isView = function( view ) {
    return view &&
        typeof view === 'object' &&
        typeof view.el === 'object' &&
        view.el.tagName &&
        view.id; // test all requirements of a view
};
