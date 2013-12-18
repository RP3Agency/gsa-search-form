#GSA Search Form

jQuery plugin to hook an HTML form to a Google Search Appliance jsonp Front End and display results.

##Including it on your page

Include jQuery and the plugin on a page. Then select the div containing the search form and call the `gsaSearchForm` method.

```html
<div class="search-page">
	<form class="search-box">
		<input autocomplete="off" type="text" size="10" class="search-input" name="search" title="search">
		<input type="submit" class="search-button" title="search">
	</form>
</div>

<script src="jquery.js"></script>
<script src="jquery.gsaSearchForm.js"></script>
<script>
$(".search-page").gsaSearchForm({
	api: 'http://gsa.host.com/endpoint'
});
</script>
```

##Options

* `api` - url for the GSA service that will return search results. Do not include query string parameters.
* `site` - specified collection
* `client` - name of a valid front end
* `output` - format of the search results, defaults to `xml_no_dtd`
* `proxyStylesheet` - name of a valid front end 
* `filter` - use 1 to turn on automatic results filtering, defaults to 0
* `resultsPerPage` - maximum value of this parameter is 1000, defaults to 10
* `namespace` - prefix for generated css classes, defaults to `gsa-`
* `inputSelector` - jQuery DOM selector for search term text input, defaults to `.search-input`
* `noResultsMessage` - text to display when no results are returned, defaults to `No results found.`

## Notes

Further documentation on [Search Appliance request parameters here](https://developers.google.com/search-appliance/documentation/614/xml_reference#request_parameters).

This plugin is built to parse jsonp results from this Google Search Appliance Front End XSLT template:

[icerunner/google-mini](https://github.com/icerunner/google-mini/blob/master/jsonp.xsl)

## License

This plugin is available under [the MIT license](http://mths.be/mit).



