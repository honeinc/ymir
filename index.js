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

Ymir.prototype.open = function( id, e ) {
    var activeClass = this.options.activeClass || 'active',
        view,
        listItems,
        listItem;

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

        view.el.classList.add( this.options.showClass );
        view.isShown = true;
        this._closeViews( id );

        if ( view.linkto ) { // only on top level links remove active
            listItems = makeArray( this.list.children );
            listItem = listItems.filter( Ymir.filterById( id ) )[0];
            listItems.forEach( Ymir.removeActive( activeClass ) );
            if ( listItem ) {
                listItem.classList.add( activeClass );
            }
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
    el.addEventListener( 'touchstart', this.open.bind( this, view.id ) );
    el.addEventListener( 'click', this.open.bind( this, view.id ) );
    this.list.appendChild( el );
};

Ymir.removeActive = function( activeClass ) {
    return function( listItem ) {
        listItem.classList.remove( activeClass );
    };
};

Ymir.filterById = function( id ) {
    return function( listItem ) {
        return listItem.getAttribute( 'data-linkto' ) === id;
    };
};

Ymir.isView = function( view ) {
    return view &&
        typeof view === 'object' &&
        typeof view.el === 'object' &&
        view.el.tagName &&
        view.id; // test all requirements of a view
};

function makeArray( arr ) {
    return Array.prototype.slice.call( arr, 0 );
}
