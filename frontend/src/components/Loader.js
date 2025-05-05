import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ size = 'md' }) => {
  return (
    <div className="d-flex justify-content-center my-4">
      <Spinner
        animation="border"
        role="status"
        variant="primary"
        size={size}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loader; 