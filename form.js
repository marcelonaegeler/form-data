var Form = ( function () {
	"use strict";

	var retrieve = function ( f ) {
		var elements = f.elements;
		var data = {};
		var c = 0;
		for ( var i = 0, l = elements.length; i < l; i++ ) {
			var e = elements[ i ];
			var n = e.name;

			if ( !n ) { continue; }
			if ( n.match( /\[\]$/ ) ) {
				n = n.replace( /(\[)(\])/, '$1'+ ( c++ ) +'$2' );
			}

			data[ n ] = e.value;
		}

		return data;
	};

	return {
		retrieve: retrieve
	};
})();