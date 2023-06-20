import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export default function AvlDate(props: any) {
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    React.useEffect(() => {
      props.setDate(value);
    }, [props, value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker sx={{ m: 0.5, minWidth: 100, maxWidth: 200 }}
        label="Avl Date "
        value={value}
        onChange={(newValue) => setValue(newValue)}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            helperText: 'DD/MM/YYYY',
          },
        }}
      />
    </LocalizationProvider>
  );
}