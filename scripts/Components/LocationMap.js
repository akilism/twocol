import { default as React, Component } from "react";
import {GoogleMapLoader, GoogleMap, Marker, Polyline, Polygon} from "react-google-maps";


export default class LocationMap extends Component {
  makeMarker() {
    // onRightclick={this.handleMarkerRightclick.bind(this, index)}
    return (
      <Marker {...this.props.center} />
    );
  }

  makePolygon() {
    return (
      <Polygon {...this.props.center} />
    );
  }

  getChildren() {
    switch(this.props.center.type) {
      case "polygon":
        return this.makePolygon();
      case "marker":
        return this.makeMarker();
      // case "streetView":
      //   return this.makePolygon();
      default:
        return "&nbsp;";
    }
  }

  render() {
    const children = this.getChildren();

    return (
      <GoogleMapLoader
        containerElement={<div {...this.props} style={{ height: "100%" }} />}
        googleMapElement={
          <GoogleMap
            ref={(map) => map && console.log(map.getZoom())}
            defaultZoom={this.props.center.zoom}
            defaultCenter={this.props.center.position}>
            {children}
          </GoogleMap>
        }
      />
    );
  }
}
