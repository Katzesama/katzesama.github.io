//references https://gist.github.com/CodeMyUI/4b546d06f38013d3bd492b5eba2772c7
//Atuthor: Hakim El Hattab

var sidebar = document.querySelector( '#sidebar div' );
var inPath = document.querySelector( '.indicator path' );
var sidebarItems;

// Factor of screen size that the element must cross
// before it's considered visible
var TOP_MARGIN = 0.1,
    BOTTOM_MARGIN = 0.0;

var pathLength;

window.addEventListener( 'resize', drawPath, false );
window.addEventListener( 'scroll', sync, false );

drawPath();

function drawPath() {

  sidebarItems = [].slice.call( sidebar.querySelectorAll( 'li' ) );

  // Cache element references and measurements
  sidebarItems = sidebarItems.map( function( item ) {
    var anchor = item.querySelector( 'a' );
    var target = document.getElementById( anchor.getAttribute( 'href' ).slice( 1 ) );

    return {
      listItem: item,
      anchor: anchor,
      target: target
    };
  } );

  // Remove missing targets
  sidebarItems = sidebarItems.filter( function( item ) {
    return !!item.target;
  } );

  var path = [];
  var pathIndent;

  sidebarItems.forEach( function( item, i ) {

    var x = item.anchor.offsetLeft - 3,
        y = item.anchor.offsetTop,
        height = item.anchor.offsetHeight;

    if( i === 0 ) {
      path.push( 'M', x, y, 'L', x, y + height );
      item.pathStart = 0;
    }
    else {
      // Draw an additional line when there's a change in
      // indent levels
      if( pathIndent !== x ) path.push( 'L', pathIndent, y );

      path.push( 'L', x, y );

      // Set the current path so that we can measure it
      inPath.setAttribute( 'd', path.join( ' ' ) );
      item.pathStart = inPath.getTotalLength() || 0;

      path.push( 'L', x, y + height );
    }

    pathIndent = x;

    inPath.setAttribute( 'd', path.join( ' ' ) );
    item.pathEnd = inPath.getTotalLength();

  } );

  pathLength = inPath.getTotalLength();

  sync();

}

function sync() {

  var windowHeight = window.innerHeight;

  var pathStart = pathLength,
      pathEnd = 0;

  var visibleItems = 0;

  sidebarItems.forEach( function( item ) {

    var targetBounds = item.target.getBoundingClientRect();

    if( targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * ( 1 - BOTTOM_MARGIN ) ) {
      pathStart = Math.min( item.pathStart, pathStart );
      pathEnd = Math.max( item.pathEnd, pathEnd );

      visibleItems += 1;

      item.listItem.classList.add( 'visible' );
    }
    else {
      item.listItem.classList.remove( 'visible' );
    }

  } );

  // Specify the visible path or hide the path altogether
  // if there are no visible items
  if( visibleItems > 0 && pathStart < pathEnd ) {
    inPath.setAttribute( 'stroke-dashoffset', '1' );
    inPath.setAttribute( 'stroke-dasharray', '1, '+ pathStart +', '+ ( pathEnd - pathStart ) +', ' + pathLength );
    inPath.setAttribute( 'opacity', 1 );
  }
  else {
    inPath.setAttribute( 'opacity', 0 );
  }

}
