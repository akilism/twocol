import { default as React, Component } from "react";
import _ from "lodash";
import { default as requireAll } from "../lib/requireall";
import { default as clamp } from "../lib/clamp";

import ArticleHeader from "./ArticleHeader";
import Article from "./Article";
import InfoBox from "./InfoBox";
import MediaTray from "./MediaTray";

const galleryImages = requireAll(require.context('../../assets/', true, /.*/)),
      imageData = [ {full: true},
        {},
        {annotations: [
            { text: "TRANSLATION: TOTAL DENIAL OF CIVILIZATION FOR TOTAL LIBERATION OF ANIMALS",
              position: {x:"32%",y:"32%",},
              type: "rect",
              dim: {w: "63%" } }
        ]}],
      mapLocations = [ { key: "exarcheia",
        description: "Exarcheia Neighborhood",
        zoom: 14,
        path: [{lat: 37.98199, lng: 23.73399},
               {lat: 37.98683, lng: 23.74368},
               {lat: 37.99028, lng: 23.74090},
               {lat: 37.99177, lng: 23.73137},
               {lat: 37.98602, lng: 23.72987},
               {lat: 37.98581, lng: 23.73073},
               {lat: 37.98199, lng: 23.73399}],
        options: { fillColor: "MidnightBlue",
          fillOpacity: 0.25,
          strokeColor: "MidnightBlue",
          strokeOpacity: 0.65,
          strokeWeight: 4 },
        type: "polygon",
        position: { lat: 37.9861256, lng: 23.7336206 }},
        { key: "panep00",
          description: "Panepistimiou and Voukourestiou Streets",
          type: "marker",
          zoom: 16,
          position: { lat: 37.977216, lng: 23.735637 }},
        { key: "panep01",
          description: "Panepistimiou and Benaki Streets",
          type: "marker",
          zoom: 16,
          position: { lat: 37.983186, lng: 23.730469 }},
        { key: "omonia",
          description: "Omonia Square",
          type: "marker",
          zoom: 16,
          position: { lat: 37.977216, lng: 23.725584 }},
        { key: "tzavella",
          description: "Tzavella St",
          type: "streetview",
          zoom: 1,
          position: { lat: 37.985331, lng: 23.734454 }}],
      infoBoxData = [{ key: "alexandros_grigoropoulos" }];

export default class ReactRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      mediaType: "image",
      mediaKey: 0,
      infoBox: false,
      infoBoxKey: null,
      infoBoxRawPos: {x: 0, y: 0},
      measurements: {
        viewportTop: 0,
        viewportHeight: 0,
        pctScroll: 0,
        contentHeight: 0
      }
    }
    this.start = null;
    this.handleScroll = _.throttle(this._handleScroll, 16);
  }

  componentWillMount() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    this.setState({ measurements: {
      viewportHeight,
      viewportWidth,
      viewportTop: 0,
      contentHeight: 0,
      pctScroll: 0 }
    });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.Root = this;
    const { measurements } = this.calculateMeasurements();
    this.setState({measurements});
  }

  _handleScroll(ev) {
    var {measurements} = this.calculateMeasurements(),
        pctScroll = measurements.pctScroll;
    this.setState({ measurements, open: false });
  }

  calculateMeasurements() {
    const viewportTop = window.pageYOffset;
    const {measurements} = this.state;
    const {viewportHeight} = measurements;
    const contentHeight = (measurements.contentHeight === 0) ? this.refs.article.refs.article.clientHeight : measurements.contentHeight;
    const pctScroll = clamp(viewportTop / (contentHeight - viewportHeight), 0, 1);
    return { measurements: {
      ...measurements,
      contentHeight,
      viewportTop,
      pctScroll }};
  }

  setMedia(hash) {
    let [type, key] = hash.split("#").slice(1);
    this.setState({ mediaType: type, mediaKey: key });
  }

  showDetails(hash, pos) {
    let item = hash.replace("#", "");

    if(this.state.infoBox && this.state.infoBoxKey == item) {
      this.setState({infoBox: false});
    } else {
      this.setState({ infoBox: true, infoBoxKey: item, infoBoxRawPos: pos });
    }
  }

  hideDetails() {
    this.setState({infoBox: false});
  }

  toggleMedia(type) {
    switch(type) {
      case "map":
        this.setState({ mediaType: type, mediaKey: mapLocations[0].key });
        break;
      case "image":
        this.setState({ mediaType: type, mediaKey: 0 });
        break;
    }
  }

  render() {
    return (
      <div ref="root" className="react-root" style={{ height: this.state.measurements.contentHeight,
                                                      width: this.state.measurements.viewportWidth }}>
        <Article ref="article" setMedia={this.setMedia.bind(this)} showDetails={this.showDetails.bind(this)} />
        <MediaTray toggleMedia={this.toggleMedia.bind(this)} activeType={this.state.mediaType} activeKey={this.state.mediaKey} open={this.state.open} measurements={this.state.measurements} images={_.take(galleryImages,3)} imageData={imageData} locations={mapLocations} />
        <InfoBox active={this.state.infoBox} rawPos={this.state.infoBoxRawPos} hideInfo={this.hideDetails.bind(this)} />
      </div>
    );
  }
}
