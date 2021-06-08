import React, { useEffect } from 'react';
import store from '../store';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Chat from './Chat';
import Auth from './auth/Auth';
import { loadUser } from '../actions/authActions';


const Application = function({auth}) {

  const { isAuthenticated } = auth;

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <>
      {
        isAuthenticated ?
          <Chat />
        :
          <Auth />
      }
    </>
  );
}

Application.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, null)(Application);
