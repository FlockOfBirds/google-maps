import { GoogleMapContainerProps } from "../components/GoogleMapContainer";

export class ValidateConfigs {

    public static validate(props: GoogleMapContainerProps): string {
        const message: string[] = [];
        const getInvalidCustomKeys = (attributeEnums: Array<{ key: string, caption: string }>): string[] => {
            const customEnums = props.markerImages;
            const invalidCustomKeys: string[] = [];

            customEnums.forEach(customEnum => {
                const foundEnums = attributeEnums.filter(value => value.key === customEnum.enumKey);
                if (foundEnums.length === 0) {
                    invalidCustomKeys.push(customEnum.enumKey);
                }
            });

            return invalidCustomKeys;
        };
        const getEnumValidationMessage = (invalidCustomKeys: string[]): string => {
            if (invalidCustomKeys.length > 0) {
                return ("Invalid enumeration keys on custom markers. " +
                    `${invalidCustomKeys.join(", ")} keys must match with ones specified in the enumeration attribute`);
            }

            return "";
        };

        if (props.dataSource === "static") {
            const invalidLocations = props.staticLocations.filter(location =>
                !location.address && !(location.latitude && location.longitude)
            );
            if (invalidLocations.length > 0) {
                message.push(`${invalidLocations} invalid static locations.
            The 'Address' or 'Latitude' and 'Longitude' is required for each 'Static' data source`);
            }
        }

        if (props.dataSource === "XPath" && !props.locationsEntity) {
            message.push("The 'Locations entity' is required for 'Data source' 'XPath'");
        }

        if (props.dataSource === "microflow" && !props.dataSourceMicroflow) {
            message.push("A 'Microflow' is required for 'Data source' 'Microflow'");
        }

        if ((props.dataSource === "XPath" || props.dataSource === "microflow") && (!props.addressAttribute &&
            !(props.longitudeAttribute && props.latitudeAttribute))) {
            message.push("The 'Address attribute' or 'Latitude Attribute' and 'Longitude attribute' "
                + "is required for this data source 'Database / Microflow'");
        }

        if (props.dataSource === "context" && (!props.addressAttributeContext &&
                !(props.longitudeAttributeContext && props.latitudeAttributeContext))) {
            message.push("The 'Address attribute' or 'Latitude Attribute' and 'Longitude attribute' "
                + "is required for this data source 'Context'");
        }

        if (props.dataSource === "context" && props.markerImageAttributeContext) {
            const attributeEnums = props.mxObject.getEnumMap(props.markerImageAttributeContext);
            const invalidCustomKeys = getInvalidCustomKeys(attributeEnums);

            message.push(getEnumValidationMessage(invalidCustomKeys));
        }

        if (props.dataSource === "XPath" && props.markerImageAttribute && props.locationsEntity) {
            const entity = mx.meta.getEntity(props.locationsEntity);
            const attributeEnums = entity.getEnumMap(props.markerImageAttribute);
            const invalidCustomKeys = getInvalidCustomKeys(attributeEnums);

            message.push(getEnumValidationMessage(invalidCustomKeys));
        }

        if (props.autoZoom && props.zoomLevel < 2) {
            message.push("Zoom level must be greater than 1");
        }

        if (props.mapStyles.trim()) {
            try {
                JSON.parse(props.mapStyles);
            } catch (error) {
                message.push("Error parsing Maps style: " + error.message);
            }
        }

        return message.join(", ");
    }
}
