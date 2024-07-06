import {
  CAMPUS_MEDIA_SERVICES_ROOMS,
  CHECKOUT_EQUIPMENT_ROOMS,
  LIGHTING_DMX_ROOMS,
} from '../../../../policy';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Control, Controller, UseFormTrigger } from 'react-hook-form';
import { Inputs, MediaServices } from '../../../../types';
import React, { useContext, useMemo } from 'react';

import { BookingContext } from '../bookingProvider';
import styled from '@emotion/styled';

const Label = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 0.5rem;
`;

interface Props {
  id: keyof Inputs;
  control: Control<Inputs, any>;
  trigger: UseFormTrigger<Inputs>;
}

export default function BookingFormMediaServices(props: Props) {
  const { id, control, trigger } = props;
  const { selectedRooms } = useContext(BookingContext);
  const roomIds = selectedRooms.map((room) => room.roomId);

  const checkboxes = useMemo(() => {
    const options: MediaServices[] = [];
    const checkRoomMediaServices = (list: string[]) =>
      roomIds.some((roomId) => list.includes(roomId));
    if (checkRoomMediaServices(CHECKOUT_EQUIPMENT_ROOMS))
      options.push(MediaServices.CHECKOUT_EQUIPMENT);
    if (checkRoomMediaServices(['103'])) {
      options.push(MediaServices.AUDIO_TECH_103);
      options.push(MediaServices.LIGHTING_TECH_103);
    }
    if (checkRoomMediaServices(['230']))
      options.push(MediaServices.AUDIO_TECH_230);
    if (checkRoomMediaServices(CAMPUS_MEDIA_SERVICES_ROOMS))
      options.push(MediaServices.CAMPUS_MEDIA_SERVICES);
    if (checkRoomMediaServices(LIGHTING_DMX_ROOMS))
      options.push(MediaServices.LIGHTING_DMX);

    return options;
  }, [roomIds]);

  return (
    <div style={{ marginBottom: 8 }}>
      <Label htmlFor={id}>Media Services</Label>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <div>
            {checkboxes.map((checkbox) => (
              <FormControlLabel
                key={checkbox}
                label={checkbox}
                sx={{ display: 'block' }}
                control={
                  <Checkbox
                    checked={field.value?.includes(checkbox) || false}
                    onChange={(e) => {
                      const values = field.value ? field.value.split(', ') : [];
                      let newValue: string[];
                      if (e.target.checked) {
                        newValue = [...values, checkbox];
                      } else {
                        newValue = values.filter((value) => value !== checkbox);
                      }
                      field.onChange(newValue.join(', '));
                      trigger(id);
                    }}
                    onBlur={() => trigger(id)}
                  />
                }
              />
            ))}
          </div>
        )}
      ></Controller>
    </div>
  );
}
