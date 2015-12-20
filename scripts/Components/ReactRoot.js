function requireAll(r) { return r.keys().map(r); }

import { default as React, Component } from "react";
import Article from "./Article";
import ArticleHeader from "./ArticleHeader";
import ImageGallery from "./ImageGallery";
import LocationMap from "./LocationMap";
import _ from "lodash";

const galleryImages = requireAll(require.context('../../assets/', true, /.*/));
const imageData = [
    {full: true},
    {},
    {annotations: [
        {
          text: "TRANSLATION: TOTAL DENIAL OF CIVILIZATION FOR TOTAL LIBERATION OF ANIMALS",
          position: {x:"32%",y:"32%",},
          type: "rect",
          dim: {w: "63%" }
        }
    ]}
];

const mapLocations = [
  { key: "exarcheia",
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
    position: { lat: 37.985331, lng: 23.734454 }},
];

class Media extends Component {
  buildImages(activeIdx) {
    const classes = (this.props.activeType === "images") ? "media-images media-active media-wrapper" : "media-images media-wrapper";

    return (
      <div className={classes} ref="images">
          <ImageGallery images={this.props.images} imageData={this.props.imageData}  activeIdx={activeIdx} />
      </div>
    );
  }

  buildMap() {
    const center = (this.props.activeType === "map") ? _.find(this.props.locations, { key: this.props.activeKey }) : this.props.locations[0],
          classes = (this.props.activeType === "map") ? "media-map media-active media-wrapper" : "media-map media-wrapper";
    return (
      <div className={classes} ref="mediaMap">
        <LocationMap center={center} locations={this.props.locations} />
      </div>);
  }

  render() {
    const { pctScroll } = this.props.measurements,
          idx = Math.floor(pctScroll * (this.props.images.length - 1)),
          headerClasses = (pctScroll > 0.1) ? "media-header article-header full-opacity" : "media-header article-header zero-opacity",
          images = (this.props.images) ? this.buildImages(idx) : "&nbsp;",
          mapElem = (this.props.locations) ? this.buildMap() : "&nbsp;";

    return (
      <div ref="media" className="media" style={{width: this.props.open ? "99vw" : "50vw"}}>
        <ArticleHeader headerClasses={headerClasses} />
        {images}
        {mapElem}
      </div>
    );
  }
}

export default class ReactRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      mediaType: "images",
      mediaKey: 0,
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

  clamp (x, min, max) { return Math.min(max, Math.max(min, x)); }

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
    const pctScroll = this.clamp(viewportTop / (contentHeight - viewportHeight), 0, 1);
    return { measurements: {
      ...measurements,
      contentHeight,
      viewportTop,
      pctScroll }};
  }

  setMedia(hash) {
    let [type, key] = hash.split("#").slice(1);
    console.log(type, key);
    this.setState({mediaType: type, mediaKey: key});
  }

  render() {
    return (
      <div ref="root" className="react-root" style={{ height: this.state.measurements.contentHeight,
                                                      width: this.state.measurements.viewportWidth }}>
        <Article ref="article" setMedia={this.setMedia.bind(this)} />
        <Media activeType={this.state.mediaType} activeKey={this.state.mediaKey} open={this.state.open} measurements={this.state.measurements} images={_.take(galleryImages,3)} imageData={imageData} locations={mapLocations} />
      </div>
    );
  }
}
