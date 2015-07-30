
// The localStorage key under which state is kept.
const stateKey = 'globalState';

// Globally available scope, singleton usage is required for sane
// functionality.
class State {

	constructor(priceSource) {

		// We keep the internal state here so we can easily marshal and
		// unmarshal to persistent storage without having to worry
		// about how babel handles
		this._internals = {
			// The global source all price sources fetch from.
			priceSource: priceSource,
			// Credentials for the logged in user.
			user: {
				name: '',
				session: '',
			},
		};

		let oldState = localStorage[stateKey];
		if (oldState !== undefined) {
			let s;
			try{
				s = JSON.parse(oldState);
			}catch(e){
				// Exit if the oldState is unparsable.
				s = {};
			}
			console.log(Object.keys(s).sort(), Object.keys(this._internals).sort())

			// Ensure our current internals and the obtained
			// share the same high level structure.
			let sKeys = Object.keys(s).sort();
			let refKeys = Object.keys(this._internals).sort();
			let equalKeys = sKeys.length === refKeys.length;
			if (equalKeys) {
				equalKeys = sKeys.every((key, i)=> refKeys[i] === key);
			}

			if (equalKeys){
				this._internals = s;
			}
		}

	}

	// We handle every internal change to be able
	// to persist internal state across sessions.
	_changed(){
		let persist = JSON.stringify(this._internals);
		localStorage[stateKey] = persist;
	}

	get priceSource(){
		return this._internals.priceSource;
	}
	set priceSource(val){
		this._internals.priceSource = val;

		this._changed();
	}

	// We flatten the internal users. object so it can
	// be accessed using getters and setters.
	get name(){
		return this._internals.user.name;
	}
	set name(val){
		this._internals.user.name = val;

		this._changed();
	}
	get session(){
		return this._internals.user.session;
	}
	set session(val){
		this._internals.user.session = val;

		this._changed();
	}

}

// A holster for all globally mutable state.
//
// Only variables whose storage in non-global scope would
// be prohibitively expensive or prone to significant mental overhead
// can be reasonably kept here.
let mutable = new State(sources.mtgprice);