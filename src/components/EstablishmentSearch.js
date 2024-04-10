import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const EstablishmentSearch = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      setIsLoading(true);
      axios.get(`/api/establishments/search`, { params: { term: searchTerm } })
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) => {
          setErrorMessage('Failed to load establishments. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Autocomplete
        id="establishment-search"
        getOptionLabel={(option) => option.tradeName || ""}
        options={searchResults}
        loading={isLoading}
        onInputChange={(event, newInputValue) => {
          setSearchTerm(newInputValue);
        }}
        onChange={(event, newValue) => {
        onSelect(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Establishment"
            variant="outlined"
            InputProps={{
            ...params.InputProps,
            endAdornment: (
                <React.Fragment>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
                </React.Fragment>
                ),
              }}
            />
          )}
        />
    </>
  );
};

export default EstablishmentSearch;




