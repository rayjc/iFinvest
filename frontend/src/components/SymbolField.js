import React, { useEffect, useState } from 'react';
import { CircularProgress, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ApiHelper from '../api/apiHelper';
import useDebounce from '../helpers/useDebounce';


const SymbolField = ({ value, setValue }) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const debouncedInput = useDebounce(inputValue, 500);
  const [isFetching, setIsFetching] = useState(false);


  useEffect(() => {
    // console.log('attempting to fetch...');
    if (!open) return;

    (async () => {
      setIsFetching(true);
      const stocks = (await ApiHelper.request(`stocks`, { symbol: debouncedInput })).stocks;

      setOptions(state => stocks);

      setIsFetching(false);
    })();

  }, [open, debouncedInput]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="symbol-input"
      name="symbol"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      autoHighlight={true}
      loading={isFetching}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      getOptionLabel={(option) => option.symbol}
      getOptionSelected={(option, value) => option.symbol === value.symbol.toUpperCase()}
      renderInput={(params) =>
        <TextField {...params} required label="Symbol"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }} />
      }
    />
  );
};


export default SymbolField;