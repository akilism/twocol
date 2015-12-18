import { default as React, Component } from "react";

export default class ArticleHeader extends Component {
  render() {
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
      </div>
    );
  }
}
