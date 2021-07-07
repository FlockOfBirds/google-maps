declare module "google-map-react" {

    export interface LatLng {
        lat: number | undefined;
        lng: number | undefined;
    }

    export interface GoogleMapLoader {
        map: google.maps.Map;
        maps: {
            event: {
                trigger: (instance: any, eventName: string, ...args: any[]) => void;
            }
        };
    }

    export interface BootstrapURLKeysProps {
        key: string;
        v?: string;
    }

    export interface MapLoaderProps {
        fullscreenControl: boolean;
        minZoom: number;
        minZoomOverride?: boolean;
        maxZoom?: number;
        scrollwheel?: boolean;
        streetViewControl?: boolean;
        mapTypeControl?: boolean;
        draggable?: boolean;
        zoomControl?: boolean;
    }

    export interface GoogleMapProps {
        bootstrapURLKeys?: BootstrapURLKeysProps;
        center?: LatLng;
        defaultZoom?: number;
        googleMapLoader?: () => void;
        onGoogleApiLoaded?: (mapLoader: GoogleMapLoader) => void;
        onChildClick?: (hoverKey: number, childProps: LatLng) => void;
        options?: MapLoaderProps;
        resetBoundsOnResize?: boolean;
        yesIWantToUseGoogleMapApiInternals?: boolean;
    }

    export const GoogleMap: React.ComponentClass<GoogleMapProps>;

    export { GoogleMap as default };
}
