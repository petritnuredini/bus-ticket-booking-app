import React from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../../components/PageTitle';
import TicketValidator from '../../components/TicketValidator';

function AdminTicketValidator() {
  return (
    <>
      <Helmet>
        <title>Ticket Validator - Admin Panel</title>
      </Helmet>
      <div>
        <PageTitle title="Ticket Validator" />
        <TicketValidator />
      </div>
    </>
  );
}

export default AdminTicketValidator;
