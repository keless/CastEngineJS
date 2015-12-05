"use strict"; //ES6

class JsonManager
{
	static Get() {
		return JsonManager.instance;
	}
	
	constructor() {
		this.m_domains = {};
		this.verbose = true;
	}
	
	addJsonBlob( json ) {
		if( json.constructor === {}.constructor ) {
			for( var domain in json ) {
				this.m_domains[ domain ] = json[ domain ];
				if(this.verbose) {
					console.log("loaded json domain " + domain);
				}
			}
		}
	}
	
	addJsonDomain( domainName, json ) {
		this.m_domains[domainName] = json;
	}
	
	getJson( domain, path ) {
		if(this.m_domains.hasOwnProperty(domain)) {
			if(!path) {
				return this.m_domains[domain];
			}else {
				// TODO: recursive path splitting
				return this.m_domains[domain][path];
			}
		}
		return nil;
	}
}

JsonManager.instance = new JsonManager();