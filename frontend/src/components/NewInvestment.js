import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import NewInvestmentForm from './NewInvestmentForm';


const NewInvestment = ({ portfolioId }) => {
  const [open, setOpen] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Button variant="contained" color="primary" startIcon={<AddIcon />}
        onClick={handleClickOpen}>
        New Investment
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Investment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide some information about your investment!
          </DialogContentText>
          <NewInvestmentForm portfolioId={portfolioId} handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default NewInvestment;