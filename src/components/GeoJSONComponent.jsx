/**
 * Add features from geojson from a URL to a given map.
 *
 *
 * If the features are points and there are >10 features or circle=true then
 * features are displayed as circleMarkers, else Markers.
 *
 * @param fetchURL default = 'http://localhost:8000/api/data'
 * @param radius default 8
 *
 * geoplumber R package React code.
 */
import React from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

export default class GeoJSONComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geojson: null
        }
        this._fetchData = this._fetchData.bind(this)
    }

    _fetchData() {
        const url = this.props.fetchURL ? this.props.fetchURL : 'http://localhost:8000/api/data'
        // console.log("fetching... " + url)
        fetch(url)
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                // Examine the text in the response
                response.json()
                    .then((geojson) => {
                        if ((geojson.features && geojson.features.length === 0) || response.status === 'ZERO_RESULTS') {
                            this.setState({ error: response.status })
                        } else {
                            var geojsonLayer = L.geoJson(geojson)
                            const bbox = geojsonLayer.getBounds()
                            // assuming parent has provided "map" object
                            this.props.map && this.props.map.fitBounds(bbox)
                            this.setState({ geojson })
                        }
                    });
            })
            .catch((err) => {
                console.log('Fetch Error: ', err);
            });
    }

    componentDidMount() {
        this._fetchData()
        if(this.props.fetchURL.endsWith('trips')) {
            var legend = L.control({position: 'topright'});

            legend.onAdd = () => {

                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
                    labels = [];

                // loop through our density intervals and generate a label with a colored square for each interval
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + this._getColor(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                }
                div.innerHTML += "<br/>(Thousands)"
                return div;
            };

            legend.addTo(this.props.map);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.fetchURL !== prevProps.fetchURL) {
            this._fetchData()
        }
        if(this.props.radius !== prevProps.radius) {
            this.forceUpdate()
        }
    }

    _getColor(d) {
        return d > 1000 ? '#800026' :
               d > 500  ? '#BD0026' :
               d > 200  ? '#E31A1C' :
               d > 100  ? '#FC4E2A' :
               d > 50   ? '#FD8D3C' :
               d > 20   ? '#FEB24C' :
               d > 10   ? '#FED976' :
                          '#FFEDA0';
    }

    render() {
        const { geojson } = this.state;
        let { radius, style, year } = this.props;

        if (!geojson) {
            return (null) // as per React docs
        }

         // get radius from parent, or is it above 100 markers? 2 else 8
         radius = radius ? radius : geojson.features && geojson.features.length > 100 ? 2 : 8

        if(!geojson.features || geojson.type !== "FeatureCollection") {
            if(geojson.coordinates) { //single feature.
                return(
                <GeoJSON //react-leaflet component
                    style={style}
                    key={JSON.stringify(geojson)}
                    data={geojson}
                />
                )
            } else {
                return(null) //nothing is passed to me.
            }
        }
        // we have type: "FeatureCollection"        
        return (
            geojson.features.map((feature, i) => {
                return (
                    <GeoJSON //react-leaflet component
                        key={feature.properties['Between.North.East.and'] + year}
                        // gp_add_geojson can define values from `feature`
                        style={typeof(style) === 'function' ?
	                        {
	                            fillColor: this._getColor(feature.properties[year]),
	                            weight: 2,
	                            opacity: 1,
	                            color: 'white',
	                            dashArray: '3',
	                            fillOpacity: 0.7
	                        } : style }
                        /**
                         * https://leafletjs.com/examples/geojson/
                         * style for leaflet is
                         * {"color": "#hexstr", "weight": 5, "opacity": 0.65}
                         * or of course a function returning these.
                         */
                        data={feature}
                        onEachFeature={(feature, layer) => {
                            const properties = Object.keys(feature.properties).map((key) => {
                                return (key + " : " + feature.properties[key])
                            })
                            layer.bindPopup(
                                properties.join('<br/>')
                            );
                        }}
                        pointToLayer={
                            // use cricles prop if not 10 markers is enough
                            this.props.circle || geojson.features.length > 10 ?
                                (_, latlng) => {
                                    // Change the values of these options to change the symbol's appearance
                                    let options = {
                                        radius: radius,
                                        fillColor: "green",
                                        color: "black",
                                        weight: 1,
                                        opacity: 1,
                                        fillOpacity: 0.8
                                    }
                                    return L.circleMarker(latlng, options);
                                }
                                :
                                (_, latlng) => {
                                    return L.marker(latlng);
                                }
                        }
                    />
                )
            })
        )
    }
}
