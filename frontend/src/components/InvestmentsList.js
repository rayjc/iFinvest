import { CircularProgress, Container, CssBaseline, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { loadInvestment } from '../reducers/investments/actions';
import EditInvestment from './EditInvestment';
import InvestmentDisplay from './InvestmentDisplay';


const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  actions: {
    marginBottom: theme.spacing(1),
  },
  loading: {
    margin: theme.spacing(3),
  },
  header: {
    margin: theme.spacing(6),
  }
}));


const InvestmentsForm = ({ portfolioId }) => {
  const classes = useStyles();
  const portfolio = useSelector(
    state => state.portfolios.portfolios.find(p => p.id === portfolioId)
  );
  const { investments } = portfolio;
  const table = useSelector(state => state.investments.investments, shallowEqual);
  const error = useSelector(state => state.investments.error);
  const dispatch = useDispatch();

  useEffect(() => {
    for (let { id: investmentId } of investments) {
      if (!table.hasOwnProperty(investmentId)) {
        dispatch(loadInvestment(investmentId));
      }
    }
  }, [investments, dispatch, table]);


  return (
    <Container className={classes.root} component="main" maxWidth="xs">
      <CssBaseline />
      {error && <Alert severity="error">{error}</Alert>}
      {investments.length === 0
        && <h3 className={classes.header}><i>No investments yet!</i></h3>}
      <div className={classes.paper}>
        {Object.values(investments).map(({ id }) =>
          table.hasOwnProperty(id) ?
            <div key={id}>
              <Grid className={classes.actions} container justify='space-between' alignItems='center' >
                <EditInvestment investmentId={id} />
                <Button>Delete</Button>
              </Grid>
              <InvestmentDisplay key={id} investmentId={id} />
            </div> :
            <div className={classes.loading} key={`loading-${id}`}>
              <CircularProgress />
            </div>
        )}
      </div>
    </Container>
  );

};


export default InvestmentsForm;