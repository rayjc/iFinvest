import { Chip, CircularProgress, Container, CssBaseline, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { loadInvestment } from '../reducers/investments/actions';
import EditInvestment from './EditInvestment';
import InvestmentDisplay from './InvestmentDisplay';
import RemoveInvestment from './RemoveInvestment';


const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    boxShadow: ` 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)`,
    borderRadius: '1rem',
  },
  title: {
    padding: theme.spacing(2),
  },
  card: {
    padding: theme.spacing(2),
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
  },
  chip: {
    backgroundColor: 'palegreen',
  },
}));


const InvestmentsList = ({ portfolioId }) => {
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
        <Grid container alignItems="center" className={classes.title}>
          <Grid item xs={8}>
            <Typography gutterBottom variant="h5">
              {portfolio.name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography gutterBottom variant="h6">
              $
              {(Object.values(investments).reduce((sum, { id }) =>
              table.hasOwnProperty(id)
                ? sum + table[id].initial_value * (table[id].interest + 1.0)
                : sum, 0)).toFixed(2)
              }
            </Typography>
          </Grid>
        </Grid>
        {Object.values(investments)
          .sort((a, b) => a.id - b.id)
          .map(({ id }) =>
            table.hasOwnProperty(id) ?
              <div key={id} className={classes.card}>
                <Grid className={classes.actions} container justify='space-between' alignItems='center' >
                  <EditInvestment investmentId={id} />
                  <Chip
                    className={classes.chip}
                    icon={<AttachMoneyIcon />}
                    label={(table[id].initial_value * (table[id].interest + 1.0)).toFixed(2)}
                  />
                  <RemoveInvestment investmentId={id} portfolioId={portfolioId} />
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


export default InvestmentsList;