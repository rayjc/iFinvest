import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';


const Alerts = ({ points, severity = "error", title = "" }) => (
  <Alert severity={severity}>
    {title && <AlertTitle>{title}</AlertTitle>}
    {points.map(point => <p key={point}><span>&#8226;</span> {point}</p>)}
  </Alert>
)


export default Alerts