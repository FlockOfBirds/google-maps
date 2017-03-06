/* tslint:disable:max-line-length */
class MockGoogle {
    maps: MapsMock;
    setup(): void {
        const googleMockObject = MockGoogle.prototype as any;
        googleMockObject.maps = MapsMock.prototype;
        googleMockObject.maps.Geocoder = MockGeocoder;
        googleMockObject.maps.Map = MapsMock;
        googleMockObject.maps.LatLngBounds = LatLngBoundsMock;
        googleMockObject.maps.LatLng = LatLngMock;
        googleMockObject.maps.Marker = MarkerMock;
        googleMockObject.maps.event = EventMock;
        googleMockObject.maps.GeocoderStatus = GeocoderStatus;
    }
}

// tslint:disable-next-line:max-classes-per-file
class MapsMock implements google.maps.Map {
    controls: google.maps.MVCArray[];
    data: google.maps.Data;
    mapTypes: google.maps.MapTypeRegistry;
    overlayMapTypes: google.maps.MVCArray;

    constructor(mapDiv: Element, opts?: google.maps.MapOptions) {
        console.log("Google Maps mock is used.");
    }

    fitBounds(bounds: google.maps.LatLngBounds): void {/** */ }
    getBounds(): google.maps.LatLngBounds { return new google.maps.LatLngBounds(); }
    getCenter(): google.maps.LatLng { return new google.maps.LatLng(0, 0); }
    getDiv(): Element { return new Element(); }
    getHeading(): number { return 0; }
    getMapTypeId(): google.maps.MapTypeId | string { return ""; }
    getProjection(): google.maps.Projection {
        const a: any = "";
        return a;
    }
    getStreetView(): google.maps.StreetViewPanorama { return new google.maps.StreetViewPanorama(new Element()); }
    getTilt(): number { return 0; }
    getZoom(): number { return 0; }
    panBy(x: number, y: number): void {/** */ }
    panTo(latLng: google.maps.LatLng | google.maps.LatLngLiteral): void {/** */ }
    panToBounds(latLngBounds: google.maps.LatLngBounds): void {/** */ }
    setCenter(latlng: google.maps.LatLng | google.maps.LatLngLiteral): void {/** */ }
    setHeading(heading: number): void {/** */ }
    setMapTypeId(mapTypeId: google.maps.MapTypeId | string): void {/** */ }
    setOptions(options: google.maps.MapOptions): void {/** */ }
    setStreetView(panorama: google.maps.StreetViewPanorama): void {/** */ }
    setTilt(tilt: number): void {/** */ }
    setZoom(zoom: number): void {/** */ }

    // mvcObject
    addListener(eventName: string, handler: (...args: any[]) => void): google.maps.MapsEventListener {
        return { remove: () => {/** */ } };
    }
    bindTo(key: string, target: google.maps.MVCObject, targetKey?: string, noNotify?: boolean): void {/** */ }
    changed(key: string): void {/** */ }
    get(key: string): any {/** */ }
    notify(key: string): void {/** */ }
    set(key: string, value: any): void {/** */ }
    setValues(values: any): void {/** */ }
    unbind(key: string): void {/** */ }
    unbindAll(): void {/** */ }
}
// tslint:disable-next-line:max-classes-per-file
class MockGeocoder implements google.maps.Geocoder {
    // cant make it static, at time of require not all classes are mocked.
    successResult: google.maps.GeocoderResult[] = [ {
        address_components: [ {
                long_name: "1600",
                short_name: "1600",
                types: [ "street_number" ]
            }, {
                long_name: "Amphitheatre Pkwy",
                short_name: "Amphitheatre Pkwy",
                types: [ "route" ]
            }, {
                long_name: "Mountain View",
                short_name: "Mountain View",
                types: [ "locality", "political" ]
            }, {
                long_name: "Santa Clara County",
                short_name: "Santa Clara County",
                types: [ "administrative_area_level_2", "political" ]
            }, {
                long_name: "California",
                short_name: "CA",
                types: [ "administrative_area_level_1", "political" ]
            }, {
                long_name: "United States",
                short_name: "US",
                types: [ "country", "political" ]
            }, {
                long_name: "94043",
                short_name: "94043",
                types: [ "postal_code" ]
            } ],
            formatted_address: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
            geometry: {
                bounds: new google.maps.LatLngBounds(),
                location: new google.maps.LatLng(30, 118),
                location_type: 0,
                viewport: new google.maps.LatLngBounds()
            },
            partial_match: true,
            place_id: "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
            postcode_localities: [ "" ],
            types: [ "street_address" ]
        }
    ];
    zeroResult: google.maps.GeocoderResult[] = [ {
        address_components: [],
        formatted_address: "",
        geometry: {
            bounds: new google.maps.LatLngBounds(),
            location:  new google.maps.LatLng(3, 18),
            location_type: 0,
            viewport: new google.maps.LatLngBounds()
        },
        partial_match: false,
        place_id: "",
        postcode_localities: [],
        types: []
    } ];
    multipleResult: google.maps.GeocoderResult[] = [ {
            address_components: [ {
                long_name: "Winnetka",
                short_name: "Winnetka",
                types: [ "sublocality", "political" ]
            }, {
                long_name: "Los Angeles",
                short_name: "Los Angeles",
                types: [ "administrative_area_level_3", "political" ]
            }, {
                long_name: "Los Angeles",
                short_name: "Los Angeles",
                types: [ "administrative_area_level_2", "political" ]
            }, {
                long_name: "California",
                short_name: "CA",
                types: [ "administrative_area_level_1", "political" ]
            }, {
                long_name: "United States",
                short_name: "US",
                types: [ "country", "political" ]
            } ],
            formatted_address: "Winnetka, California, USA",
            geometry: {
                bounds: new google.maps.LatLngBounds(),
                location: new google.maps.LatLng(34.213171, -118.571022),
                location_type: 0,
                viewport: new google.maps.LatLngBounds()
            },
            partial_match: true,
            place_id: "ChIJ0fd4S_KbwoAR2hRDrsr3HmQ",
            postcode_localities: [ "" ],
            types: [ "sublocality", "political" ]
        }, {
            address_components: [ {
                long_name: "1600",
                short_name: "1600",
                types: [ "street_number" ]
            }, {
                long_name: "Amphitheatre Pkwy",
                short_name: "Amphitheatre Pkwy",
                types: [ "route" ]
            }, {
                long_name: "Mountain View",
                short_name: "Mountain View",
                types: [ "locality", "political" ]
            }, {
                long_name: "Santa Clara County",
                short_name: "Santa Clara County",
                types: [ "administrative_area_level_2", "political" ]
            }, {
                long_name: "California",
                short_name: "CA",
                types: [ "administrative_area_level_1", "political" ]
            }, {
                long_name: "United States",
                short_name: "US",
                types: [ "country", "political" ]
            }, {
                long_name: "94043",
                short_name: "94043",
                types: [ "postal_code" ]
            } ],
            formatted_address: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
            geometry: {
                bounds: new google.maps.LatLngBounds(),
                location: new google.maps.LatLng(0, 0),
                location_type: 0,
                viewport: new google.maps.LatLngBounds()
            },
            partial_match: true,
            place_id: "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
            postcode_localities: [ "" ],
            types: [ "street_address" ]
        }
    ];
    geocode(request: google.maps.GeocoderRequest, callback: (results: google.maps.GeocoderResult[],
        status: google.maps.GeocoderStatus) => void): void {
        if (request.address === "multipleAddress") {
            callback(this.multipleResult, google.maps.GeocoderStatus.OK);
        } else if (request.address === "invalidAddress") {
            callback(this.zeroResult, google.maps.GeocoderStatus.ZERO_RESULTS);
        } else if (request.address) {
            callback(this.successResult, google.maps.GeocoderStatus.OK);
        } else {
            callback(this.zeroResult, google.maps.GeocoderStatus.ZERO_RESULTS);
        }
    }
}

// tslint:disable-next-line:max-classes-per-file
class LatLngBoundsMock implements google.maps.LatLngBounds {
    constructor(sw?: google.maps.LatLng | google.maps.LatLngLiteral, ne?: google.maps.LatLng | google.maps.LatLngLiteral) {/** */ }
    contains(latLng: google.maps.LatLng): boolean { return true; }
    equals(other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): boolean { return true; }
    extend(point: google.maps.LatLng): google.maps.LatLngBounds { return new google.maps.LatLngBounds(); }
    getCenter(): google.maps.LatLng { return new google.maps.LatLng(0, 0); }
    getNorthEast(): google.maps.LatLng { return new google.maps.LatLng(0, 0); }
    getSouthWest(): google.maps.LatLng { return new google.maps.LatLng(0, 0); }
    intersects(other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): boolean { return true; }
    isEmpty(): boolean { return false; }
    toJSON(): google.maps.LatLngBoundsLiteral { return { east: 0, north: 0, south: 0, west: 0 }; }
    toSpan(): google.maps.LatLng { return new google.maps.LatLng(0, 0); }
    toString(): string { return "Fake"; }
    toUrlValue(precision?: number): string { return ""; }
    union(other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): google.maps.LatLngBounds {
        return new google.maps.LatLngBounds();
    }
}

// tslint:disable-next-line:max-classes-per-file
class LatLngMock implements google.maps.LatLng {
    _lat: number;
    _lng: number;
    constructor(lat: number, lng: number, noWrap?: boolean) {
        this._lat = lat;
        this._lng = lng;
    }
    equals(other: google.maps.LatLng): boolean {
        return other.lat() === this.lat() && other.lng() === this.lng();
     }
    lat(): number { return this._lat; }
    lng(): number { return this._lng; }
    toString(): string { return `Mock lat:{this._lat} lng {this._lng}`; }
    toUrlValue(precision?: number): string { return ""; }
    toJSON(): google.maps.LatLngLiteral { return({ lat: 0, lng: 0 }); }
}

// tslint:disable-next-line:max-classes-per-file
class MarkerMock implements google.maps.Marker {
    static MAX_ZINDEX: number;
    map: google.maps.Map;
    constructor(opts?: google.maps.MarkerOptions) {/** */ }
    getAnimation(): google.maps.Animation { return 0; }
    getAttribution(): google.maps.Attribution { return 0; }
    getClickable(): boolean { return true; }
    getCursor(): string { return "Fake"; }
    getDraggable(): boolean { return true; }
    getIcon(): string | google.maps.Icon | symbol { return "Fake"; }
    getLabel(): google.maps.MarkerLabel { return true; }
    getMap(): google.maps.Map | google.maps.StreetViewPanorama { return this.map; }
    getOpacity(): number { return 0; }
    getPlace(): google.maps.Place { return true; }
    getPosition(): google.maps.LatLng { return new google.maps.LatLng(0, 0); }
    getShape(): google.maps.MarkerShape { return true; }
    getTitle(): string { return "Fake"; }
    getVisible(): boolean { return true; }
    getZIndex(): number { return 0; }
    setAnimation(animation: google.maps.Animation): void { /** */ }
    setAttribution(attribution: google.maps.Attribution): void { /** */ }
    setClickable(flag: boolean): void { /** */ }
    setCursor(cursor: string): void { /** */ }
    setDraggable(flag: boolean): void { /** */ }
    setIcon(icon: string | google.maps.Icon | symbol): void { /** */ }
    setLabel(label: string | google.maps.MarkerLabel): void { /** */ }
    setMap(map: google.maps.Map | google.maps.StreetViewPanorama): void { /** */ }
    setOpacity(opacity: number): void { /** */ }
    setOptions(options: google.maps.MarkerOptions): void { /** */ }
    setPlace(place: google.maps.Place): void { /** */ }
    setPosition(latlng: google.maps.LatLng | google.maps.LatLngLiteral): void { /** */ }
    setShape(shape: google.maps.MarkerShape): void { /** */ }
    setTitle(title: string): void { /** */ }
    setVisible(visible: boolean): void { /** */ }
    setZIndex(zIndex: number): void { /** */ }

    // mvcObject
    addListener(eventName: string, handler: (...args: any[]) => void): google.maps.MapsEventListener {
        return { remove: () => {/** */ } };
    }
    bindTo(key: string, target: google.maps.MVCObject, targetKey?: string, noNotify?: boolean): void {/** */ }
    changed(key: string): void {/** */ }
    get(key: string): any {/** */ }
    notify(key: string): void {/** */ }
    set(key: string, value: any): void {/** */ }
    setValues(values: any): void {/** */ }
    unbind(key: string): void {/** */ }
    unbindAll(): void {/** */ }
}

export enum GeocoderStatus {
    ERROR,
    INVALID_REQUEST,
    OK,
    OVER_QUERY_LIMIT,
    REQUEST_DENIED,
    UNKNOWN_ERROR,
    ZERO_RESULTS
}

enum GeocoderLocationType {
    APPROXIMATE,
    GEOMETRIC_CENTER,
    RANGE_INTERPOLATED,
    ROOFTOP
}

// Add basic static handler store for testing.
// tslint:disable-next-line:max-classes-per-file
class EventMock {
    static handlers: Array<() => void> = [];
    static addDomListener(instance: object, eventName: string, handler: () => void, capture?: boolean): google.maps.MapsEventListener {
        EventMock.handlers.push(handler);
        return { remove: () => { /** */ } };
    }
    static addDomListenerOnce(instance: object, eventName: string, handler: () => void, capture?: boolean): google.maps.MapsEventListener {
        EventMock.handlers.push(handler);
        return { remove: () => { /** */ } };
    }
    static addListener(instance: object, eventName: string, handler: () => void): google.maps.MapsEventListener {
        EventMock.handlers.push(handler);
        return { remove: () => { /** */ } };
    }
    static addListenerOnce(instance: object, eventName: string, handler: () => void): google.maps.MapsEventListener {
        EventMock.handlers.push(handler);
        return { remove: () => { /** */ } };
    }
    static clearInstanceListeners(instance: object): void {
        EventMock.handlers = [];
    }
    static clearListeners(instance: object, eventName: string): void {
        EventMock.handlers = [];
    }
    static removeListener(listener: google.maps.MapsEventListener): void {/** */ }
    static trigger(instance: any, eventName: string, ...args: any[]): void {/** */ }
    static mockEvent() {
        console.log("Mocking event");
        EventMock.handlers.forEach(f => f());
    }
    static mockClearListeners() {
        EventMock.handlers = [];
    }
}

const googleMockObject = MockGoogle.prototype as any;

export const mockGoogleMaps = googleMockObject;
