import { ShallowWrapper, shallow } from "enzyme";
import GoogleMap from "google-map-react";
import { createElement } from "react";

import { Location, Map, MapProps, heightUnitType, widthUnitType } from "../Map";
import { Marker } from "../Marker";
import { Alert } from "../Alert";

import { mockGoogleMaps } from "tests/mocks/GoogleMaps";
import { mockMendix } from "tests/mocks/Mendix";

describe("Map", () => {
    const address = "Lumumba Ave, Kampala, Uganda";
    const invalidAddress = "invalidAddress";
    const APIKey = "AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec";
    const renderMap = (props: MapProps) => shallow(createElement(Map, props));
    const defaultCenterLocation = { lat: 51.9107963, lng: 4.4789878 };
    const successMockLocation = { lat: 30, lng: 118 };
    const multipleAddressMockLocation = { lat: 34.213171, lng: -118.571022 };
    let mxOriginal: mx.mx;

    const setUpMap = (
        locationsParam: Location[], APIKeyParam?: string,
        widthParam?: number,
        heightParam?: number,
        widthUnitParam?: widthUnitType,
        heightUnitParam?: heightUnitType,
        defaultCenterParam?: string): ShallowWrapper<MapProps, any> => {
        const output = renderMap({
            apiKey: APIKeyParam,
            autoZoom: true,
            defaultCenterAddress: defaultCenterParam !== undefined ? defaultCenterParam : "",
            height: heightParam ? heightParam : 75,
            heightUnit: heightUnitParam ? heightUnitParam : "pixels",
            locations: locationsParam,
            optionDrag: true,
            optionMapControl: true,
            optionScroll: true,
            optionStreetView: true,
            optionZoomControl: true,
            style: {},
            width: widthParam ? widthParam : 100,
            widthUnit: widthUnitParam ? widthUnitParam : "pixels",
            zoomLevel: 7
        });
        mockGoogleMaps.setup();
        (output.find(GoogleMap).prop("onGoogleApiLoaded") as any).apply();
        return output;
    };

    beforeAll(() => {
        mxOriginal = window.mx;
        window.google = mockGoogleMaps;
        window.mx = mockMendix;
    });

    it("should render with the map structure", () => {
        const map = setUpMap([ { address } ], undefined, 100, 75, "percentage", "percentageOfWidth");
        const style = { paddingBottom: "75%", width: "100%" };

        expect(map).toBeElement(
            createElement("div", { className: "widget-google-maps-wrapper", style },
                createElement("div", { className: "widget-google-maps" },
                    createElement(Alert, {
                        bootstrapStyle: "danger",
                        className: "widget-google-maps-alert",
                        message: undefined
                    }),
                    createElement(GoogleMap, {
                        bootstrapURLKeys: { key: undefined },
                        center: defaultCenterLocation,
                        defaultZoom: 7,
                        onGoogleApiLoaded: jasmine.any(Function) as any,
                        resetBoundsOnResize: true,
                        yesIWantToUseGoogleMapApiInternals: true
                    })
                )
            ));
    });

    it("should render a structure correctly with pixels", () => {
        const map = setUpMap([ { address } ], undefined, 100, 75, "pixels", "pixels");
        const style = { paddingBottom: "75", width: "100" };

        expect(map).toBeElement(
            createElement("div", { className: "widget-google-maps-wrapper", style },
                createElement("div", { className: "widget-google-maps" },
                    createElement(Alert, {
                        bootstrapStyle: "danger",
                        className: "widget-google-maps-alert",
                        message: undefined
                    }),
                    createElement(GoogleMap, {
                        bootstrapURLKeys: { key: undefined },
                        center: defaultCenterLocation,
                        defaultZoom: 7,
                        onGoogleApiLoaded: jasmine.any(Function) as any,
                        resetBoundsOnResize: true,
                        yesIWantToUseGoogleMapApiInternals: true
                    })
                )
            ));
    });

    it("should render a structure correctly with percentage", () => {
        const map = setUpMap([ { address } ], undefined, 20, 30, "percentage", "pixels");
        const style = { width: "20%", paddingBottom: "30" };

        expect(map).toBeElement(
            createElement("div", { className: "widget-google-maps-wrapper", style },
                createElement("div", { className: "widget-google-maps" },
                    createElement(Alert, {
                        bootstrapStyle: "danger",
                        className: "widget-google-maps-alert",
                        message: undefined
                    }),
                    createElement(GoogleMap, {
                        bootstrapURLKeys: { key: undefined },
                        center: defaultCenterLocation,
                        defaultZoom: 7,
                        onGoogleApiLoaded: jasmine.any(Function) as any,
                        resetBoundsOnResize: true,
                        yesIWantToUseGoogleMapApiInternals: true
                    })
                )
            ));
    });

    it("should render a structure correctly with percentage of parent", () => {
        const map = setUpMap([ { address } ], undefined, 20, 30, "percentage", "percentageOfParent");
        const style = { width: "20%", height: "30%" };

        expect(map).toBeElement(
            createElement("div", { className: "widget-google-maps-wrapper", style },
                createElement("div", { className: "widget-google-maps" },
                    createElement(Alert, {
                        bootstrapStyle: "danger",
                        className: "widget-google-maps-alert",
                        message: undefined
                    }),
                    createElement(GoogleMap, {
                        bootstrapURLKeys: { key: undefined },
                        center: defaultCenterLocation,
                        defaultZoom: 7,
                        onGoogleApiLoaded: jasmine.any(Function) as any,
                        resetBoundsOnResize: true,
                        yesIWantToUseGoogleMapApiInternals: true
                    })
                )
            ));
    });

    describe("with no address", () => {
        it("should not look up the location", () => {
            setUpMap([ { address: "" } ]);
            spyOn(window.google.maps.Geocoder.prototype, "geocode").and.callThrough();

            expect(window.google.maps.Geocoder.prototype.geocode).not.toHaveBeenCalled();
        });

        it("should not display a marker", () => {
            const output = setUpMap([ { address: "" } ]);

            const marker = output.find(Marker);

            expect(marker.length).toBe(0);
        });

        it("should center to the default address if no coordinates", () => {
            const output = setUpMap([ { address: "" } ], undefined, 100, 75, "pixels", "pixels", "");

            expect(output.state("center").lat).toBe(defaultCenterLocation.lat);
            expect(output.state("center").lng).toBe(defaultCenterLocation.lng);
        });

        it("should center to the coordinates if provided", () => {
            const coordinateLocation = { lat: 21.2, lng: 1.5 };

            const output = setUpMap([ { latitude: coordinateLocation.lat, longitude: coordinateLocation.lng } ]);

            expect(output.state("locations")[0].latitude).toBe(coordinateLocation.lat);
            expect(output.state("locations")[0].longitude).toBe(coordinateLocation.lng);
        });
    });

    describe("with a valid address", () => {
        it("should lookup the location", () => {
            spyOn(window.google.maps.Geocoder.prototype, "geocode");

            setUpMap([ { address } ]);

            expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
        });

        it("should render a marker", () => {
            const output = setUpMap([ { address } ]);

            const marker = output.find(Marker);

            expect(marker.length).toBe(1);
            expect(marker.prop("lat")).toBe(successMockLocation.lat);
            expect(marker.prop("lng")).toBe(successMockLocation.lng);
        });

        it("should display the first marker if multiple locations are found", () => {
            const output = setUpMap([ { address: "multipleAddress" } ] );

            const marker = output.find(Marker);

            expect(marker.prop("lat")).toBe(multipleAddressMockLocation.lat);
            expect(marker.prop("lng")).toBe(multipleAddressMockLocation.lng);
        });
    });

    describe("with an invalid address", () => {
        it("should not render a marker", () => {
            const output = setUpMap([ { address: invalidAddress } ]);

            const marker = output.find(Marker);
            expect(marker.length).toBe(0);
        });

        it("should have no marker if no coordinate is provided", () => {
            const output = setUpMap([ { address: invalidAddress } ]);

            const marker = output.find(Marker);

            expect(marker.length).toBe(0);
        });

        it("should display an error", () => {
            const actionErrorMessage = `Can not find address ${invalidAddress}`;
            spyOn(window.mx.ui, "error").and.callThrough();

            const output = setUpMap([ { address: invalidAddress } ]);

            expect(output.state().alertMessage).toBe(actionErrorMessage);
            expect(output.find(Alert).props().message).toBe(output.state().alertMessage);
        });

        it("should have a marker if coordinates are provided", () => {
            const coordinateLocation = { lat: 21.2, lng: 1.5 };

            const output = setUpMap([ { latitude: coordinateLocation.lat, longitude: coordinateLocation.lng } ]);

            expect(output.state("locations")[0].latitude).toBe(coordinateLocation.lat);
            expect(output.state("locations")[0].longitude).toBe(coordinateLocation.lng);
        });
    });

    describe("with multiple locations", () => {
        it("shows coordinates", () => {
            const coordinateLocation1 = { latitude: 31.2, longitude: 11.5 };
            const coordinateLocation2 = { latitude: 44.44, longitude: 60.11 };

            const output = setUpMap([ coordinateLocation1, coordinateLocation2 ]);
            const marker1 = output.find(Marker).at(0);

            expect(marker1.prop("lat")).toBe(Number(coordinateLocation1.latitude));
            expect(marker1.prop("lng")).toBe(Number(coordinateLocation1.longitude));

            const marker2 = output.find(Marker).at(1);

            expect(marker2.prop("lat")).toBe(Number(coordinateLocation2.latitude));
            expect(marker2.prop("lng")).toBe(Number(coordinateLocation2.longitude));
        });
    });

    describe("loads", () => {
        it("if no API key is configured", () => {
            const output = setUpMap([ { address } ]);

            expect((output.find(GoogleMap).prop("bootstrapURLKeys") as any).key).not.toBe(APIKey);
        });

        it("when API key is configured", () => {
            const output = setUpMap([ { address } ], APIKey);

            expect((output.find(GoogleMap).prop("bootstrapURLKeys") as any).key).toBe(APIKey);
        });
    });

    describe("with an updated address", () => {
        it("should change marker location to the new address", () => {
            const output = setUpMap([ { address } ]);

            const marker = output.find(Marker).at(0);

            expect(marker.prop("lat")).toBe(successMockLocation.lat);
            expect(marker.prop("lng")).toBe(successMockLocation.lng);

            output.setProps({ locations: [ { address: "multipleAddress" } ], defaultCenterAddress: address });
            (output.find(GoogleMap).prop("onGoogleApiLoaded") as any).apply();

            const markerNew = output.find(Marker);

            expect(markerNew.prop("lat")).toBe(multipleAddressMockLocation.lat);
            expect(markerNew.prop("lng")).toBe(multipleAddressMockLocation.lng);
        });

    });

    describe("with updated coordinates", () => {
        it("should change the marker location to the new coordinates", () => {
            const coordinateLocation1 = { lat: 31.2, lng: 11.5 };
            const coordinateLocation2 = { lat: 44.44, lng: 60.11 };

            const output = setUpMap([ { latitude: coordinateLocation1.lat, longitude: coordinateLocation1.lng } ]);
            const marker = output.find(Marker).at(0);

            expect(marker.prop("lat")).toBe(Number(coordinateLocation1.lat));
            expect(marker.prop("lng")).toBe(Number(coordinateLocation1.lng));

            output.setState({
                defaultCenterAddress: address,
                locations: [ { latitude: coordinateLocation2.lat, longitude: coordinateLocation2.lng } ]
            });
            const markerNew = output.find(Marker).at(0);

            expect(markerNew.prop("lat")).toBe(Number(coordinateLocation2.lat));
            expect(markerNew.prop("lng")).toBe(Number(coordinateLocation2.lng));
        });

        it("should not lookup the location if the coordinates are not changed", () => {
            const coordinateLocation = { lat: 21.2, lng: 1.5 };
            const locations = { latitude: coordinateLocation.lat, longitude: coordinateLocation.lng };
            const output = setUpMap([ locations ], undefined, 100, 75, "pixels", "pixels");
            mockGoogleMaps.setup();

            (output.find(GoogleMap).prop("onGoogleApiLoaded") as any).apply();
            output.setState({
                defaultCenterAddress: address,
                locations: [ { latitude: coordinateLocation.lat, longitude: coordinateLocation.lng } ]
             });
            const markerNew = output.find(Marker).at(0);

            expect(markerNew.prop("lat")).toBe(Number(coordinateLocation.lat));
            expect(markerNew.prop("lng")).toBe(Number(coordinateLocation.lng));
        });

    });

    afterAll(() => {
        window.mx = mxOriginal;
        window.google = undefined;
    });
});
