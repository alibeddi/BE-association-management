import * as Yup from 'yup';
import merge from 'lodash/merge';

import { EventInput } from '@fullcalendar/core';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, IconButton, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// time
import { isBefore } from 'date-fns';
import { addOneHour } from '../../../utils';


// @types
import { ICalendarEvent } from '../../../@types/calendar';
// components
import Iconify from '../../../components/iconify';
import FormProvider, { RHFDateTimePicker } from '../../../components/hook-form';


// ----------------------------------------------------------------------

type FormValuesProps = ICalendarEvent;

type Props = {
  event: EventInput | null | undefined;
  range: {
    startDate: Date;
    endDate: Date;
  } | null;
  onCancel: VoidFunction;
  onDeleteEvent: VoidFunction;
  onCreateUpdateEvent: (newEvent: ICalendarEvent) => void;
};

// ----------------------------------------------------------------------

const getInitialValues = (
  event: EventInput | null | undefined,
  range: { startDate: Date; endDate: Date } | null
) => {
  const currentTime = new Date();
  const initialEvent: FormValuesProps = {
    startDate: range ? new Date(range.startDate) : currentTime,
    endDate: range ? new Date(range.endDate) : addOneHour(currentTime),
  };

  if (event || range) {
    return merge({}, initialEvent, event);
  }

  return initialEvent;
};

// ----------------------------------------------------------------------

///
export default function CalendarForm({
  event,
  range,
  onCreateUpdateEvent,
  onDeleteEvent,
  onCancel,
}: Props) {
  const hasEventData = !!event;
  const EventSchema = Yup.object().shape({
    startDate: Yup.date().required(),
    endDate: Yup.date().required().when('startDate',(startDate, schema) => startDate && schema.min(startDate))
  });
  
  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const newEvent = {
        startDate: data.startDate,
        endDate: data.endDate,
      };

      onCreateUpdateEvent(newEvent);
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isDateError =
    values.startDate && values.endDate
      ? isBefore(new Date(values.endDate), new Date(values.startDate))
      : false;
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3} sx={{ px: 3 }}>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => <RHFDateTimePicker name='startDate' label="start date" />
            }
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => <RHFDateTimePicker name='endDate' label="end date" />
          }
          />
        </Stack>
      </LocalizationProvider>
      <DialogActions>
        {hasEventData && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDeleteEvent}>
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {hasEventData ? 'Update' : 'Add'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
