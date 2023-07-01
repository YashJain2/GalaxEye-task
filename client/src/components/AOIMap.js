import React, { useEffect, useRef, useState } from 'react'
import { FeatureGroup, MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'

function AOIMap() {
    const noTilesToDisplay = {
        "type": "FeatureCollection",
        "features": [],
    };

    const color = "purple"; // colour of AOI shapes
    let staticTiles;
    const geoDataRefLayer = useRef(null);

    // to hold the state for intersecting tile section for the corresponding AOI
    const [intersectingTiles, setintersectingTiles] = useState(noTilesToDisplay);

    const featureGroupRef = useRef(null);


    const updateMap = async (AOIGeoJSONObject) => {
        // Initializing an empty array for tiles intersection on GEOJSON data
        var intersectingTilesArray = [];
        var response
        try {
            const AOIgeometry = { AOIGeoJSONObject }
            response = await fetch("http://localhost:3005/intersect", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(AOIgeometry)
            })
            const data = await response.json();
            intersectingTilesArray.push(data)
        }
        catch (e) {
            console.error(e.message)
        }

        //intersecting tiles section
        console.log(intersectingTilesArray);

        setintersectingTiles(intersectingTilesArray);
    }

    // Creating the intersecting tiles for the first time 
    // when the new shape (circle,rectangle) is created
    const onAOICreated = async (e) => {
        updateMap(e.layer.toGeoJSON());
    }

    // Updating the intersecting tiles upon editing
    const onAOIEdited = (e) => {
        updateMap(e.layers.toGeoJSON().features[0]);
    }

    // clearing the intersecting tiles when we delete all shapes
    const onAOIDeleted = () => {
        setintersectingTiles(noTilesToDisplay);
    }

    // Checks if AOI already exists, and if exists remove the old one
    const checkAndRemoveAOI = (featureGroupReference) => {
        const layers = featureGroupReference.current._layers;
        if (Object.keys(layers).length > 1) {
            Object.keys(layers).forEach((layerid, i) => {
                if (i > 0) {
                    return;
                }
                const layer = layers[layerid];
                featureGroupReference.current.removeLayer(layer);
            });
        }
    }

    // Fetch static tiles on initialization
    useEffect(() => {
        const fetchDataFromTable = async () => {
            try {
                const response = await fetch("http://localhost:3005/fetch");
                const JSONObject = await response.json();
                staticTiles = JSONObject;
            }
            catch (err) {
                console.error(err.message);
            }
        }
        fetchDataFromTable();
    }, []);

    // Renders geoJSON and AOI async when intersectingTiles changes
    useEffect(() => {
        if (geoDataRefLayer.current) {
            geoDataRefLayer.current.clearLayers().addData(intersectingTiles);
            checkAndRemoveAOI(featureGroupRef);
        }
    }, [intersectingTiles])


    return (
        <MapContainer 
        center={[12.972442, 77.580643]} 
        zoom={10} 
        style={{ width: "100vw", height: "100vh" }} 
        scrollWheelZoom={false}>
            <FeatureGroup
                ref={featureGroupRef}
            >
                <EditControl
                    position='topleft'
                    onCreated={onAOICreated}
                    onDeleted={onAOIDeleted}
                    onEdited={onAOIEdited}
                    draw={{
                        rectangle: {
                            shapeOptions: { color: color },
                            repeatMode: false,  
                        },
                        circle: {
                            shapeOptions: { color: color },
                            repeatMode: false,  
                        },
                        polygon: false,
                        polyline: false,
                        circlemarker: false,
                        marker: false,
                    }}
                    edit={{
                        selectedPathOptions: {
                            color: color,
                            fillColor: color,
                        },
                        shapeOptions: { color: color },
                    }} />
            </FeatureGroup>
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
            <GeoJSON ref={geoDataRefLayer} data={intersectingTiles} />
        </MapContainer>
    )
}

export default AOIMap