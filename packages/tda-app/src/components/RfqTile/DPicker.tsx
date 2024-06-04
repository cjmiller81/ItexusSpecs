import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


interface HelperTextProps {
  dateValue: Date;
  onChange: (date: Date) => void;
}

const HelperText: React.FC<HelperTextProps> = ({ dateValue,onChange}) => {
  
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      onChange(newDate);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
      className="custom-datepicker"
      onChange={handleDateChange}
       value={dateValue}
      sx={{
        outline:'none',
        border:'none',
        width:160,
        height:20,
      }}
        
        slotProps={{ textField: { size: 'small', style: {height:30} } }}
        
      />
    </LocalizationProvider>
  );
}

export default HelperText;