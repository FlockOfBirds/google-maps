import * as DojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Location } from "./components/Map";
import GoogleMapContainer from "./components/GoogleMapContainer";
import { DataSource } from "./components/GoogleMapContainer";

class GoogleMaps extends WidgetBase {
    // Properties from Mendix modeler
    apiKey: string;
    dataSource: DataSource;
    dataSourceMicroflow: string;
    defaultCenterAddress: string;
    entityConstraint: string;
    locationsEntity: string;
    addressAttribute: string;
    latitudeAttribute: string;
    longitudeAttribute: string;
    staticLocations: Location[];

    update(contextObject: mendix.lib.MxObject, callback?: () => void) {
        this.updateRendering(contextObject);

        if (callback) callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering(contextObject: mendix.lib.MxObject) {
        render(createElement(GoogleMapContainer, {
            addressAttribute: this.addressAttribute,
            apiKey: this.apiKey,
            contextObject,
            dataSource: this.dataSource,
            dataSourceMicroflow: this.dataSourceMicroflow,
            defaultCenterAddress: this.defaultCenterAddress,
            entityConstraint: this.entityConstraint,
            latitudeAttribute: this.latitudeAttribute,
            locationsEntity: this.locationsEntity,
            longitudeAttribute: this.longitudeAttribute,
            staticLocations: this.staticLocations
        }), this.domNode);
    }
}

// Declare widget prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
DojoDeclare("com.mendix.widget.GoogleMaps.GoogleMaps", [ WidgetBase ], (function(Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(GoogleMaps)));
