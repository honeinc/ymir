# Ymir

Ymir is the a base view manager. It is very general and can be used for differnt UI components.

## Install

    $ npm install ymir

## Usage

Ymir is intended to be used with [browserify](http://browserify.org).

```javascript
var Ymir = require( '..' ).Ymir,
    ymir = new Ymir( { 
        tagName: 'section', 
        listTagName: 'ul', 
        listItemTagName: 'li', 
        className: 'view-manager-el' 
    } ),
    view1 = {
        id: 'about',
        el: document.createElement( 'div' )
    },
    view2 = {
        id: 'home',
        el: document.createElement( 'div' )
    },
    view3 = {
        id: 'hidden',
        linkto: false,
        el: document.createElement( 'div' )
    },
    button = document.createElement( 'button' );

ymir.addView( view1 );
ymir.addView( view2 );
ymir.addView( view3 );
view1.el.textContent = 'view 1 - about';
view2.el.textContent = 'view 2 - home';
view3.el.textContent = 'view 3 - hidden';

button.textContent = 'view hidden';
view2.el.appendChild( button );
button.onclick = ymir.open.bind( ymir, 'hidden' );

ymir.list.classList.add( 'clearfix' );
ymir.open( 'about' );


document.body.appendChild( ymir.list );
document.body.appendChild( ymir.el );
```
