import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import css from '../../css/components/Career.css';

import { fetchAbilities } from '../actions/actionAbilities';
import { fetchCareers } from '../actions/actionCareers';
import { setSlug } from '../actions/actionSlug';

import Sidebar from './Sidebar';
import Overlay from './Overlay';
import Breadcrumb from './Breadcrumb';
import Loading from './Loading';

class Career extends Component {

  constructor(props) {
    super(props);
  }

  loadCareerData(slug) {
    // Fetch careers and abilities
    this.props.fetchCareers();
    this.props.fetchAbilities(slug);

    // Set career slug in app state
    this.props.setSlug(slug);
  }

  componentWillReceiveProps(nextProps) {

    // This will be run when a new career is selected from the Sidebar
    // Manually force the loading of new data
    if (this.props.match.params && (this.props.match.params.slug != nextProps.match.params.slug)) {
      // Check if it's a valid career name
      if (this.props.careers.hasOwnProperty(nextProps.match.params.slug)) {

        this.loadCareerData(nextProps.match.params.slug);

      } else {
          // TODO redirect to not found page on else here
          console.warn("CAREER DOES NOT EXIST!")
      }
    }
  }

  componentDidMount() {

    const { slug } = this.props.match.params;
    this.loadCareerData(slug);
  }

  render() {

    const containerClass = classNames({
      [css.wrapper]: !this.props.sidebar,
      [css.wrapperSidebar]: this.props.sidebar,
    });

    // TODO: add this to logic after abilities have been imported in Reducer || (!this.props.abilities || this.props.abilities.length == 0)
    // TODO: also have a check in here that abilities match the slug name somehow. Probably the reason why "Loading..." not appearing
    // TODO: maybe we could reset the abilities prop to [] when changing career and the above check would still work...?
    let hasCareerLoaded = (this.props.careers && Object.keys(this.props.careers).length > 0) && this.props.slug;

    // Display loading component if the corresponding JSON hasn't yet loaded
    if (!hasCareerLoaded) {
      return (
        <div className={css.loadingContainer}>
          <Loading />
        </div>
      );
    }

    return (
      <div>
        <div className={containerClass}>
          <div className="paddingTop paddingRight paddingLeft paddingBottom">
            <div className="marginBottom--medium">
              <Breadcrumb />
            </div>
          </div>
        </div>
        <Overlay overlayVisible={true} />
        <Sidebar />
      </div>
    );
  }
}

function mapStateToProps({ sidebar, abilities, careers, slug }) {
  return {
    abilities,
    careers,
    sidebar,
    slug
  };
}

export default connect(mapStateToProps, { fetchAbilities, fetchCareers, setSlug })(Career);