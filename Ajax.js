/*globals Notification, ABSOLUTE_URL */
var Ajax = ( function () {

	window.CSRF_TOKEN = document.getElementById( 'csrf_token' ).content;
	
	// Update token
	setInterval( function () {
		Ajax.request({
			url: [ ABSOLUTE_URL, 'app', 'update-token' ].join( '/' )
			, success: function ( t ) {
				window.CSRF_TOKEN = t;
				document.getElementById( 'csrf_token' ).content = t;
			}
		});
	}, 30000 );

	var encode = function ( isGET, initialData, addData ) {
		var encoded = ( isGET ? '?' : '' );

		for ( var i in initialData ) {
			encoded += i +'='+ initialData[i] +'&';
		}
		for ( var i in addData ) {
			encoded += i +'='+ addData[i] +'&';
		}

		return encoded.substring( 0, encoded.length - 1 );
	};


	var request = function ( options ) {
		
		// if ( Notification ) {
		// 	Notification.create( 'Carregando...', 'loading' );
		// }
		
		var method = options.method
			, data = options.data
			, url = options.url
			;

		if ( method ) {
			method = method.toUpperCase();
		} else {
			method = 'GET';
		}

		if ( !data ) {
			data = {};
		}

		var isGET = method === 'GET';

		if ( isGET ) {
			data = encode( isGET, data );
			url += data;
		} else {
			var tmpData = new FormData();
			for ( var i in data ) {
				tmpData.append( i, data[ i ] );
			}
			data = tmpData;
		}

		var xhr = new XMLHttpRequest();

		if ( options.success || options.error ) {
			xhr.onreadystatechange = function () {
				if ( xhr.readyState === 4 ) {
					
					// Notification.close();
					
					if ( xhr.status === 200 && options.success ) {
						options.success( xhr.response );
					} else if( xhr.status !== 200 && options.error ) {
						options.error( { response: xhr.response, status: xhr.status } );
					}

				}
			};
		}

		xhr.open( method, url, true );
		xhr.setRequestHeader( 'X-CSRF-TOKEN', window.CSRF_TOKEN );
		xhr.send( isGET ? null : data );
	};

	return {
		request: request
	};
})();