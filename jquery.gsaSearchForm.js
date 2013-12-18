/* 
 *
 * GSA Search Form
 * Wire up an html form to query Google Search Appliance and parse json results
 *
 * created by: Sarah Goldman, sgoldman@rp3agency.com
 *
 */
(function($) {
	
	//gsaSearchForm: Object Instance
	$.gsaSearchForm = function(el, options) {
		var search = $(el);

		// making variables public
		search.vars = $.extend({}, $.gsaSearchForm.defaults, options);

		var namespace       = search.vars.namespace,
			api		        = search.vars.api,
			inputSelector   = search.vars.inputSelector,
			form	        = search.find('form'),
			searchBox	    = form.find(inputSelector),
			resultsInfo,
			results,
			pagination,
			nextLink,
			prevLink,
			queryParams = {
				q: null,
				start: 0,
				num: parseInt(search.vars.resultsPerPage),
				site: search.vars.site,
				client: search.vars.client,
				output: search.vars.output,
				proxyStylesheet: search.vars.proxyStylesheet,
				filter: search.vars.filter
			},
			noResultsMessage   = search.vars.noResultsMessage;

		// Store a reference to the search form object
		$.data(el, 'gsaSearchForm', search);

		// Private methods
		methods = {
			init: function() {				
				
				//build dom
				search.append('<div class="'+namespace+'results-info results-info" />');
				search.append('<div class="'+namespace+'search-results search-results" />');
				search.append('<div class="'+namespace+'results-pagination results-pagination"><div class="'+namespace+'page-link page-link prev">&laquo; Previous</div><div class="'+namespace+'page-link page-link next">Next &raquo;</div></div>');
				
				resultsInfo = search.find('.'+namespace+'results-info');
				results = search.find('.'+namespace+'search-results');
				pagination = search.find('.'+namespace+'results-pagination');
				nextLink = pagination.find('.next');
				prevLink = pagination.find('.prev');
				
				var params = search.parseQueryString(window.location.search.substring(1));
				
				if (params.num) {
					queryParams.num = parseInt(params.num);
				}
				
				if (params.start) {
					queryParams.start = parseInt(params.start);
				}
				
				if (params.q) {
					queryParams.q = params.q;
					searchBox.val(decodeURIComponent(queryParams.q).replace(/\+/g,' '));
					search.submitQuery(queryParams.q, queryParams.start, queryParams.num);
				}
				
				//bind pagination
				nextLink.click( function(e) {
					e.preventDefault();
					search.nextPage();
				});
				
				prevLink.click( function(e) {
					e.preventDefault();
					search.prevPage();
				});
				
				//bind form submit
				form.submit(function(e) {
					e.preventDefault();	
					queryParams.start = 0;
					queryParams.q = encodeURIComponent(searchBox.val());	
					search.submitQuery(queryParams.q, queryParams.start, queryParams.num);
				});
				
			}
		}

		// public methods
		search.submitQuery = function(query, start, num) {
			
			var callback = 'gsaJsonpCallback',
				url = api + '?site='+queryParams.site+'&client='+queryParams.client+'&output='+queryParams.output+'&proxystylesheet='+queryParams.proxyStylesheet+'&filter='+queryParams.filter+'&q='+query+'&start='+start+'&num='+num+'&jsonp=1';
			
			$.ajax({
				type: 'GET',
				url: url,
				async: false,
				jsonpCallback: callback,
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(json) {
					
					if (json.results) {
						
						resultsInfo.text('Showing results '+json.results_nav.results_start+'-'+json.results_nav.results_end+' of about '+json.results_nav.total_results+' total results.');
						search.populateResults(json.results);
					
					} else {
						
						resultsInfo.html(noResultsMessage);
						results.html('');
						
					}
					
					
					if (json.results_nav.have_next) {
						nextLink.show();
					} else {
						nextLink.hide();
					}
					
					if (json.results_nav.have_prev) {
						prevLink.show();
					} else {
						prevLink.hide();
					}
					
					queryParams.start = parseInt(json.results_nav.current_view);
					
					if (history.pushState) {
					    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q='+json.query+'&start='+queryParams.start+'&num='+num;
					    window.history.pushState({path:newurl},'',newurl);
					}
					
				},
				error: function(e) {
					console.log(e.message);
				}
			});
		}
		
		search.populateResults = function(resultsObj) {
			
			results.fadeOut('fast', function() {
				
				results.html('');

				$.each(resultsObj, function( index, value ) {

					var result = value;

					results.append('<div class="'+namespace+'result result"><div class="'+namespace+'result-title result-title"><a href="'+result.url+'">'+result.title+'</a></div><div class="'+namespace+'result-url result-url">'+result.url+'</div><div class="'+namespace+'result-summary result-summary">'+result.summary+'</div></div>');

				});
				
				results.fadeIn();
				
			});
			
		}
		
		search.nextPage = function() {
			var start = parseInt(queryParams.start) + parseInt(queryParams.num);
			search.submitQuery(queryParams.q, start, queryParams.num);
		}
		
		search.prevPage = function() {
			var start = parseInt(queryParams.start) - parseInt(queryParams.num);
			search.submitQuery(queryParams.q, start, queryParams.num);
		}
		
		search.parseQueryString = function(queryString) {
		    var params = {}, queries, temp, i, l;

		    // Split into key/value pairs
		    queries = queryString.split("&");

		    // Convert the array of strings into an object
		    for ( i = 0, l = queries.length; i < l; i++ ) {
		        temp = queries[i].split('=');
		        params[temp[0]] = temp[1];
		    }

		    return params;
		};
	
		//gsaSearchForm: Initialize
		methods.init();
	}
	
	//gsaSearchForm: Default Settings
	$.gsaSearchForm.defaults = {
		api: null,
		site: '',
		client: '',
		output: 'xml_no_dtd',
		proxyStylesheet: '',
		filter: 0,
		resultsPerPage: 10,
		namespace: 'gsa-',
		inputSelector: '.search-input',
		noResultsMessage: 'No results found.'
	}
	
	//gsaSearchForm: Default Settings
	$.fn.gsaSearchForm = function(options) {
		
		if (options === undefined) options = {};

		if (typeof options === 'object') {
			return this.each(function() {
				var $this = $(this);				
				if ($this.data('gsaSearchForm') === undefined) {
					new $.gsaSearchForm(this, options);
				}
			});
		}
		
	}

}(jQuery));
