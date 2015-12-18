function requireAll(r) { return r.keys().map(r); }

import { default as React, Component } from "react";
import Article from "./Article";
import ArticleHeader from "./ArticleHeader";
import _ from "lodash";

const galleryImages = requireAll(require.context('../../assets/', true, /.*/));


class Media extends Component {
  buildImages(activeIdx) {
    return this.props.images.map((img, idx) => {
      let classNames = (activeIdx === idx) ? "active-image media-image" : "media-image";

      return (
        <img src={this.props.images[idx]} className={classNames} />
      );
    });
  }

  render() {
    const { pctScroll } = this.props.measurements,
          idx = Math.floor(pctScroll * (this.props.images.length - 1)),
          headerClasses = (pctScroll > 0.1) ? "media-header article-header full-opacity" : "media-header article-header zero-opacity";

    return (
      <div ref="media" className="media">
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
  }

  clamp (x, min, max) { return Math.min(max, Math.max(min, x)); }

  _handleScroll(ev) {
    var {measurements} = this.calculateMeasurements(),
        pctScroll = measurements.pctScroll;
    if (window.ga && pctScroll > this.scroll_marker) {
      ga('send','event','CityGuideNYCScrollPct','Load',this.scroll_marker);
      this.scroll_marker += 0.1;
    }
    this.setState({measurements});
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
        <Media measurements={this.state.measurements} images={galleryImages} />
      </div>
    );
  }
}
