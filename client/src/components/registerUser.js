import { useState } from 'react';
import { connect } from "react-redux";
import { addUser } from "../actions/userActions";
import useForm from '../lib/useForm';

import PropTypes from "prop-types";

const [inputs, handleChange] = useForm({});


const AddUser = function () {
  return <>Users List</>;
};

AddUser.PropTypes = {
  addUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state = {
  user: state.user,
});

export default connect(mapStateToProps, { addUser })(AddUser);
