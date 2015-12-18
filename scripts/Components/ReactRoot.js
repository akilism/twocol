function requireAll(r) { return r.keys().map(r); }

import { default as React, Component } from "react";
import Article from "./Article";
import ArticleHeader from "./ArticleHeader";
import _ from "lodash";

const galleryImages = requireAll(require.context('../../assets/', true, /.*/));
const imageData = [
    {full: true},
    {},
    {annotations: [
        {
          text: "TRANSLATION: CAPITAL IS THE REAL OPIATE OF THE MASSES. REVOLUTION NOW.",
          position: {x:"32%",y:"32%",},
          type: "rect",
          dim: {w: "63%", h:"10%"}
        }
    ]}
]

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
    return this.props.images.map((img, idx) => {

      if(imageData[idx] && imageData[idx].full){
        let classNames = (activeIdx === idx) ? "active-image full-image" : "full-image";
        var openerClass = (window.Root && Root.state.open) ? "opener open" : "opener" ;
        var component = (<div style={{backgroundImage: `url(${this.props.images[idx]})`}} className={classNames}>
                            <div className={openerClass} onMouseOver={_.bind(this.drawer,this)}></div>
                        </div>)
      } else {
        let classNames = (activeIdx === idx) ? "active-image media-image" : "media-image";
        var component = <img src={this.props.images[idx]} className={classNames} />
      }

      if(imageData[idx] && imageData[idx].annotations && activeIdx === idx){
        var annos = _.map(imageData[idx].annotations,function(a){
            return (
              <div>
                <div className="hover-dot" style={{left: a.position.x, top: a.position.y}}>
                    <span>?</span>
                </div>
                <div className="hover-text" style={{left: a.position.x, top: a.position.y, width: a.dim.w, height: a.dim.h}}>
                    {a.text}
                </div>
              </div>
            )
        })
      } else {
        var annos = null
      }
      var divclass = annos ? "a" : "";
      return (
        <div className={divclass}>
            {component}
            {annos}
        </div>
      )
    });
  }

  render() {
    const { pctScroll } = this.props.measurements,
          idx = Math.floor(pctScroll * (this.props.images.length - 1)),
          headerClasses = (pctScroll > 0.1) ? "media-header article-header full-opacity" : "media-header article-header zero-opacity";

    return (
      <div ref="media" className="media" style={{width: this.props.open ? "99vw" : "50vw"}}>
        <ArticleHeader headerClasses={headerClasses} />
        <div className="media-images" ref="images">
          {this.buildImages(idx)}
        </div>
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

  animate(time){
    if(!this.start) { this.start = time; }
    setTimeout(() => {
      this.animationId = requestAnimationFrame((t) => {this.animate(t)});
    }, 1000 / 15);

    this.refs.pch.animate(time);
  }

  componentWillMount() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    this.setState({ measurements: { viewportHeight,
                                    viewportWidth,
                                    viewportTop: 0,
                                    contentHeight: 0,
                                    pctScroll: 0 } });
  }

  componentDidMount() {
    // this.animate();
    window.addEventListener('scroll', this.handleScroll.bind(this));
    const { measurements } = this.calculateMeasurements();
    this.setState({measurements});
    window.Root = this;
    this.animating = false
  }

  clamp (x, min, max) { return Math.min(max, Math.max(min, x)); }

  _handleScroll(ev) {
    var {measurements} = this.calculateMeasurements(),
        pctScroll = measurements.pctScroll;
    this.setState({measurements, open: false});
  }

  calculateMeasurements() {
    const viewportTop = window.pageYOffset;
    const {measurements} = this.state;
    const {viewportHeight} = measurements;
    const contentHeight = (measurements.contentHeight === 0) ? this.refs.article.refs.article.clientHeight : measurements.contentHeight;
    const pctScroll = this.clamp(viewportTop / (contentHeight - viewportHeight), 0, 1);
    return { measurements: { ...measurements,
                             contentHeight,
                             viewportTop,
                             pctScroll }
    };
  }

  render() {
    return (
      <div ref="root" className="react-root" style={{ height: this.state.measurements.contentHeight,
                                                      width: this.state.measurements.viewportWidth }}>
        <Article ref="article" />
        <Media open={this.state.open} measurements={this.state.measurements} images={_.take(galleryImages,3)} />
      </div>
    );
  }
}
