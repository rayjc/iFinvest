import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, IconButton, Popover } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import EditInvestmentForm from './EditInvestmentForm';


const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  container: {
    padding: theme.spacing(2),
  }
}));


const EditInvestment = ({ investmentId }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `edit-popover-${investmentId}` : undefined;

  return (
    <>
      <IconButton aria-describedby={id} color="primary" onClick={handleClick}>
        <EditIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Container className={classes.container} maxWidth="xs">
          <EditInvestmentForm investmentId={investmentId} handleClose={handleClose} />
        </Container>
      </Popover>
    </>
  );
};


export default EditInvestment;