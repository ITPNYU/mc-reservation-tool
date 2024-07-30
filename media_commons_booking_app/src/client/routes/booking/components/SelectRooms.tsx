import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

import React from 'react';
import { RoomSetting } from '../../../../types';

interface Props {
  allRooms: RoomSetting[];
  selected: RoomSetting[];
  setSelected: any;
}

export const SelectRooms = ({ allRooms, selected, setSelected }: Props) => {
  const handleCheckChange = (e: any, room: RoomSetting) => {
    const newVal: boolean = e.target.checked;
    setSelected((prev: RoomSetting[]) => {
      if (newVal) {
        return [...prev, room].sort(
          (a, b) => Number(a.roomId) - Number(b.roomId)
        );
      } else {
        return prev.filter((x: RoomSetting) => x.roomId != room.roomId);
      }
    });
  };

  const selectedIds = selected.map((room) => room.roomId);

  return (
    <FormGroup>
      {allRooms.map((room: RoomSetting) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedIds.includes(room.roomId)}
              onChange={(e) => handleCheckChange(e, room)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
          label={`${room.roomId} ${room.name}`}
          key={room.name}
        />
      ))}
    </FormGroup>
  );
};
