import { default as React, Component } from "react";

export default class ArticleHeader extends Component {

  handleToggleClick(type, evt) {
    this.props.toggleMedia(type);
  }

  buildToggles(isMap) {
    const cameraClasses = (isMap) ? "media-toggle toggle-inactive" : "media-toggle toggle-active",
          mapClasses = (isMap) ? "media-toggle toggle-active"   : "media-toggle toggle-inactive";
    return (
      <ul className="media-toggles">
        <li className={cameraClasses} onClick={this.handleToggleClick.bind(this, "image")}><i className="fa fa-camera fa-lg"></i></li>
        <li className={mapClasses} onClick={this.handleToggleClick.bind(this, "map")}><i className="fa fa-map-marker fa-lg"></i></li>
      </ul>
    );
  }

  render() {
    const toggles = (this.props.media) ? this.buildToggles(this.props.map) : "";
    return (
      <div className={this.props.headerClasses}>
        <h1>Athenians Rioted on the Anniversary of the Police Killing of a 15-Year-Old</h1>

        <div className="publish-date-time">
          <span className="publish-date" data-publish-date="2015-12-07" data-publish-date-format="MMMM D, YYYY">December 7, 2015</span>
        </div>

        <div className="contributor-information-container">
          <p className="byline">
            Photos by <span>Panagiotis Maidis and Thanasis Kamvisis, Words: Pavlos Toubekis</span>
          </p>
        </div>

        {toggles}
      </div>
    );
  }
}
