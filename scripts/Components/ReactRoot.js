import { default as React, Component } from "react";

export default class ReactRoot extends Component {
  constructor(props) {
    super(props);
    this.start = null;
  }

  animate(time){
    if(!this.start) { this.start = time; }
    setTimeout(() => {
      this.animationId = requestAnimationFrame((t) => {this.animate(t)});
    }, 1000 / 15);

    this.refs.pch.animate(time);
  }

  componentDidMount() {
    // this.animate();
  }

  render() {
    return (
      <div className="react-root">
        <div className="article">
          <div className="article-header">
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

          <div className="article-body">
            <em>This article was originally published on VICE Greece.</em>
            <p>Thirteen people, including six minors, were arrested on Sunday evening in Athens after extensive and violent clashes between demonstrators and the police on the seventh anniversary of the murder of Alexandros Grigoropoulos.</p>
            <p>Back in 2008, 15-year-old Grigoropoulos was killed by a police officer named Epaminondas Korkoneas in the neighborhood of Exarcheia. The murder sparked a series of protests and riots, largely led by students around Grigoropoulos's age.</p>
            <p>Since December 2008, annual demonstrations have been organized by many different leftist groups, students, and particularly anarchists, to commemorate the teen's killing and protest police violence. The protests often culminate in clashes between demonstrators and police.</p>
            <p>This year, a crowd of mostly students and leftists groups started gathering at the center of Athens (Propylea) at 12 PM. The police were fully prepared for unrest—the number of officers in the city streets exceeded 5,000, while two central metro stations remained closed for security reasons. Around 3 PM, people started marching. It was mostly peaceful, though a few rocks were thrown at a police cordon guarding the National Library.</p>
            <p>By around 6 PM, the Propylea was filled with members of anarchist and anti-authoritarian groups who gathered for their own march. The demonstrators' faces were now covered with gas masks and an uneasy silence hung in the air.</p>
            <p>As soon as the march hit the intersection of Panepistimiou and Voukourestiou Streets, petrol bombs were launched by the demonstrators toward the riot police, who answered with teargas and flashbangs.</p>
            <p>By the time the heavy chemical smoke cleared, the demonstrators had regrouped and continued on their way until they were forced to draw a halt at the intersection of Panepistimiou and Benaki Streets due to a roadblock. It was at that point that it became evident the police had cut off all escape routes, effectively surrounding the main body of the demonstrations. Tension begun building up again and further clashes took place until the police moved further into the area of Exarcheia, where fighting continued into the early hours of the morning.</p>
            <p>Meanwhile, a little further away from Exarcheia, in the area surrounding Omonia square, two dozen police on motorcycles surrounded a group of ten people who were mostly photographers and journalists. They were asked for identification and those that could not provide the necessary documents were arrested and led to police headquarters.</p>
            <p>At the end of the day, flowers and notes covered the monument that's been erected in Grigoropoulos's memory at the spot he was shot.</p>
            <p>Further marches in his memory were held in most cities around Greece on Sunday, with only small-scale clashes reported.</p>
          </div>
        </div>
        <div className="media"></div>
      </div>
    );
  }
}
