import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { CircularProgress, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PortfolioApi from '../api/portfolioApi';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import './PortfolioChart.css';
import { useSelector, shallowEqual } from 'react-redux';


const colors = [
  "#8884d8", "#82ca9d", "tomato", "cyan", "yellow", "purple", "green", "orange"
];

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(1),
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));


const PortfolioChart = ({ portfolioId }) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [labels, setLabels] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const investments = useSelector(state => state.investments.investments, shallowEqual);
  const table = Object.values(investments).reduce((table, row) => {
    table[row.symbol] = row.initial_value;
    return table;
  }, {});

  const handleClick = async () => {

    setIsFetching(true);
    const { interests, cutoffs } = await PortfolioApi.getChart(portfolioId);
    // {date: '2019-01-30', AAPL: 0.0, GOOG: 0.0, ...}
    const marketValues = [];
    for (let interest of interests) {
      marketValues.push(Object.entries(interest).reduce((row, [key, val]) => {
        if (key === 'date') {
          row[key] = val;
        } else {
          row[key] = +(table[key] * (val + 1.0)).toFixed(2);
        }
        return row;
      }, {}));
    }
    setData(d => marketValues);
    setLabels(l => cutoffs);
    setIsFetching(false);
  };


  return (
    <div className="PortfolioChart">
      <Fab color="secondary" aria-label="add" onClick={handleClick}
        variant="extended" className={classes.fab} disabled={isFetching}>
        {isFetching
          ? <CircularProgress className={classes.extendedIcon} size="2rem" />
          : <TrendingUpIcon className={classes.extendedIcon} />}
        Compute
      </Fab>
      {data && labels &&
        <ResponsiveContainer width='80%' height={400} className="PortfolioChart-Container">
          <LineChart
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {labels.map(cutoff =>
              <ReferenceLine key={cutoff.symbol} x={cutoff.date} stroke="red"
                label={`Sold ${cutoff.symbol}, ${(cutoff.interest * 100).toFixed(1)}% growth`} />
            )}
            {Object.keys(data[data.length - 1])
              .filter(key => key !== 'date')
              .map((key, idx) =>
                <Line key={key} type="monotone" dataKey={key} stroke={colors[idx % colors.length]} />
              )
            }
          </LineChart>
        </ResponsiveContainer>
      }
    </div>
  );
};


export default PortfolioChart;