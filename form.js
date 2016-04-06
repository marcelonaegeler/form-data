var Form = ( function ( Ajax ) {
	"use strict";

	var formData = [];

	var retrieve = function ( f ) {
		var elements = f.elements
			, data = {}
			, submitButton
			, c = 0
			;

		for ( var i = 0, l = elements.length; i < l; i++ ) {
			var e = elements[ i ];
			var n = e.name;

			if ( e.type === 'submit' ) {
				submitButton = e;
			}

			if ( !n ) { continue; }
			if ( n.match( /\[\]$/ ) ) {
				n = n.replace( /(\[)(\])/, '$1'+ ( c++ ) +'$2' );
			}

			data[ n ] = e.value;
		}

		return {
			data: data
			, button: submitButton
		};
	};


	var submit = function ( f, cbs, cbe ) {

		f.onsubmit = function () {
			var d = retrieve( f );
			var data = d.data;
			
			var btn = buttonStatus( d.button );
			btn.disable();

			Ajax.request({
				url: this.action
				, method: this.method
				, data: data
				, success: function ( res ) {
					if ( cbs ) {
						cbs( res );
					}

					f.reset();
					btn.enable();
				}
				, error: function ( res ) {
					if ( cbe ) {
						cbe( res );
					}
					btn.enable();
				}
			});

			return false;
		};
	};



	var buttonStatus = function ( button ) {
		var defaultText = button.innerHTML;
		var disabledText = button.dataset.disabledHtml;

		var disable = function () {
			button.disabled = true;
			button.innerHTML = disabledText;
		};

		var enable = function () {
			button.disabled = false;
			button.innerHTML = defaultText;
		};

		return {
			disable: disable
			, enable: enable
		};
	};

	return {
		retrieve: retrieve
		, submit: submit
	};
})( window.Ajax );