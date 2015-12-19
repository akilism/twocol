function requireAll(r) { return r.keys().map(r); }

import { default as React, Component } from "react";
import Article from "./Article";
import ArticleHeader from "./ArticleHeader";
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
          dim: {w: "63%", h:"10%"}
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
  { key: "omonoia",
    description: "Omonoia Square",
    type: "marker",
    zoom: 16,
    position: { lat: 37.977216, lng: 23.725584 }},
  { key: "tzavella",
    description: "Tzavella St",
    type: "streetview",
    zoom: 16,
    position: { lat: 37.985331, lng: 23.734454 }},
];

class Media extends Component {
  drawer(){
    if(! this.animating){
      window.Root.setState({open: ! Root.state.open})
      this.animating = true
      setTimeout(() => {
          this.animating = false
      },1000)
    }
  }

  buildImages(activeIdx) {
    const images = this.props.images.map((img, idx) => {
      let annos = null,
          component = null,
          classNames = null;

      if(imageData[idx] && imageData[idx].full){
        const openerClass = (window.Root && Root.state.open) ? "opener open" : "opener";
        classNames = (activeIdx === idx) ? "active-image full-image" : "full-image";
        component = (<div style={{backgroundImage: `url(${this.props.images[idx]})`}} className={classNames}>
                            <div className={openerClass} onClick={_.bind(this.drawer,this)}></div>
                    </div>);
      } else {
        classNames = (activeIdx === idx) ? "active-image media-image" : "media-image";
        component = (<img src={this.props.images[idx]} className={classNames} />);
      }

      if(imageData[idx] && imageData[idx].annotations && activeIdx === idx){
        annos = _.map(imageData[idx].annotations, function(a) {
            return (
              <div>
                <div className="hover-dot" style={{left: a.position.x, top: a.position.y}}>
                    <span>?</span>
                </div>
                <div className="hover-text" style={{left: a.position.x, top: a.position.y, width: a.dim.w, height: a.dim.h}}>
                    {a.text}
                </div>
              </div>
            );
        });
      }

      const divclass = (annos) ? "a" : "";

      return (
        <div className={divclass}>
            {component}
            {annos}
        </div>
      )
    });

    return (
      <div className="media-images" ref="images">
          {images}
      </div>
    );
  }

  buildMap() {
    const center = this.props.locations[0];
    return (
      <div className="media-map" ref="mediaMap">
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

  setMedia(href) {
    console.log(href);
  }

  render() {
    return (
      <div ref="root" className="react-root" style={{ height: this.state.measurements.contentHeight,
                                                      width: this.state.measurements.viewportWidth }}>
        <Article ref="article" setMedia={this.setMedia.bind(this)} />
        <Media open={this.state.open} measurements={this.state.measurements} images={_.take(galleryImages,3)} locations={mapLocations} />
      </div>
    );
  }
}
