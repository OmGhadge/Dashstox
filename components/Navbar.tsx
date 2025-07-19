import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import TuneIcon from '@mui/icons-material/Tune';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'INTC', 'AMD',
  'IBM', 'ORCL', 'ADBE', 'PYPL', 'CSCO', 'QCOM', 'AVGO', 'TXN', 'CRM', 'SHOP'
];

const INDICATORS = [
  { key: 'sma', label: 'SMA', defaultPeriod: 20 },
  { key: 'ema', label: 'EMA', defaultPeriod: 20 },
];

type IndicatorKey = 'sma' | 'ema';
type IndicatorPeriods = { [key in IndicatorKey]: number };

interface NavBarProps {
  symbol: string;
  setSymbol: (s: string) => void;
  startDate: Date | null;
  setStartDate: (d: Date | null) => void;
  endDate: Date | null;
  setEndDate: (d: Date | null) => void;
  onAddToWatchlist: () => void;
  selectedIndicators: IndicatorKey[];
  setSelectedIndicators: (inds: IndicatorKey[]) => void;
  indicatorPeriods: IndicatorPeriods;
  setIndicatorPeriods: (p: IndicatorPeriods) => void;
}

const NavBar: React.FC<NavBarProps> = ({ symbol, setSymbol, startDate, setStartDate, endDate, setEndDate, onAddToWatchlist, selectedIndicators, setSelectedIndicators, indicatorPeriods, setIndicatorPeriods }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ zIndex: 1201 }}>
      <Toolbar sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Autocomplete
            options={SYMBOLS}
            value={symbol}
            onChange={(_, newValue) => {
              if (newValue) setSymbol(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Symbol" variant="outlined" size="small" />
            )}
            sx={{ width: 140 }}
            freeSolo
          />
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            slotProps={{ textField: { size: 'small' } }}
          />
          <Button variant="contained" color="primary" size="small" onClick={onAddToWatchlist} sx={{ ml: 2 }}>
            Add to Watchlist
          </Button>
          <IconButton onClick={handleOpen} sx={{ ml: 1 }} title="Indicators">
            <TuneIcon />
          </IconButton>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box sx={{ p: 2, minWidth: 200 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Indicators</div>
              {INDICATORS.map((ind) => (
                <Box key={ind.key} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedIndicators.includes(ind.key as IndicatorKey)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedIndicators([...selectedIndicators, ind.key as IndicatorKey]);
                          } else {
                            setSelectedIndicators(selectedIndicators.filter(k => k !== ind.key));
                          }
                        }}
                      />
                    }
                    label={ind.label}
                  />
                  {selectedIndicators.includes(ind.key as IndicatorKey) && (
                    <input
                      type="number"
                      value={indicatorPeriods[ind.key as IndicatorKey]}
                      min={2}
                      onChange={e => {
                        const val = Math.max(2, parseInt(e.target.value) || ind.defaultPeriod);
                        setIndicatorPeriods({ ...indicatorPeriods, [ind.key]: val });
                      }}
                      style={{ width: 60, marginLeft: 8, padding: 4, borderRadius: 4, border: '1px solid #ccc', textAlign: 'center' }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Popover>
        </Box>
        <Box sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0057b8' }}>
          Dashboard
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 