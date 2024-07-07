import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React, { useContext, useMemo } from 'react';

import { BookingContext } from '../bookingProvider';
import { ConfirmDialogControlled } from '../../components/ConfirmDialog';
import { MOCAP_ROOMS } from '../../../../policy';
import { RoomSetting } from '../../../../types';

interface Props {
  allRooms: RoomSetting[];
  selected: RoomSetting[];
  setSelected: any;
}

export const SelectRooms = ({ allRooms, selected, setSelected }: Props) => {
  // if this isn't stored in the Provider then the modal will reshow when backtracking in the form which is annoying
  const { hasShownMocapModal, setHasShownMocapModal } =
    useContext(BookingContext);
  const selectedIds = selected.map((room) => room.roomId);

  const showMocapModal = useMemo(() => {
    const mocapRoomSelected = MOCAP_ROOMS.some((roomId) =>
      selectedIds.includes(roomId)
    );
    const shouldShow = !hasShownMocapModal && mocapRoomSelected;
    return shouldShow;
  }, [selectedIds, hasShownMocapModal]);

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
      <ConfirmDialogControlled
        open={showMocapModal}
        onClose={() => setHasShownMocapModal(true)}
        message="Please note: If you intend to use the motion capture rig in Rooms 221 or 222, you'll need to book both rooms concurrently."
        title="Motion Capture"
      />
    </FormGroup>
  );
};
