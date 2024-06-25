import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

import React from 'react';
import { RoomSetting } from '../../../../types';

interface Props {
  allRooms: RoomSetting[];
  selected: string[];
  setSelected: any;
}

export const SelectRooms = ({ allRooms, selected, setSelected }: Props) => {
  const handleCheckChange = (e: any, room: RoomSetting) => {
    const newVal: boolean = e.target.checked;
    setSelected((prev) => {
      if (newVal) {
        return [...prev, room.roomId];
      } else {
        return prev.filter((x) => x !== room.roomId);
      }
    });
  };

  return (
    <FormGroup>
      {allRooms.map((room: RoomSetting) => (
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              value={selected.includes(room.roomId)}
              onChange={(e) => handleCheckChange(e, room)}
            />
          }
          label={`${room.roomId} ${room.name}`}
          key={room.name}
        />
      ))}
    </FormGroup>
  );
};
