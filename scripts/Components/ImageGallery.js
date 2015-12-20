import { default as React, Component } from "react";
import _ from "lodash";

export default class ImageGallery extends Component {
  drawer(){
    if(!this.animating){
      window.Root.setState({open: ! Root.state.open});
      this.animating = true;
      setTimeout(() => {
          this.animating = false;
      },1000)
    }
  }

  buildImage(img, idx, activeIdx) {
    let annos = null,
        component = null,
        classNames = null;

    if(this.props.imageData[idx] && this.props.imageData[idx].full){
      const openerClass = (window.Root && Root.state.open) ? "opener open" : "opener";
      classNames = (activeIdx === idx) ? "active-image full-image" : "full-image";
      component = (<div style={{backgroundImage: `url(${this.props.images[idx]})`}} className={classNames}>
                          <div className={openerClass} onClick={_.bind(this.drawer,this)}></div>
                  </div>);
    } else {
      classNames = (activeIdx === idx) ? "active-image media-image" : "media-image";
      component = (<img src={this.props.images[idx]} className={classNames} />);
    }

    if(this.props.imageData[idx] && this.props.imageData[idx].annotations && activeIdx === idx){
      annos = _.map(this.props.imageData[idx].annotations, function(a) {
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
      <div key={idx} className={divclass}>
          {component}
          {annos}
      </div>
    )
  }

  render() {
    const images = this.props.images.map((img, idx) => { return this.buildImage(img, idx, this.props.activeIdx); });
    return(
      <div>{images}</div>
    );
  }
}
