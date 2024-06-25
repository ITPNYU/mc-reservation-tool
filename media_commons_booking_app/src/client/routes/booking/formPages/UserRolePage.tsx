import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import { Department, Role } from '../../../../types';
import React, { useContext } from 'react';

import { BookingContext } from '../bookingProvider';
import { C } from '@fullcalendar/core/internal-common';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const Center = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled(Box)(({ theme }) => ({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '4px',
  border: `1px solid ${theme.palette.custom.border}`,
}));

interface DropdownProps<T extends React.ReactNode> {
  value: T;
  updateValue: (value: T) => void;
  options: T[];
  placeholder: string;
}

export default function UserRolePage() {
  const { role, department, setDepartment, setRole } =
    useContext(BookingContext);

  const navigate = useNavigate();

  const handleNextClick = () => {
    if (!role || !department) {
      alert('Please make sure all fields are selected.');
      return;
    }
    navigate('/book/selectRoom');
  };

  const dropdown = <T extends React.ReactNode>({
    value,
    updateValue,
    options,
    placeholder,
  }: DropdownProps<T>) => (
    <Select
      size="small"
      value={value != null ? value : ''}
      onChange={(e) => updateValue(e.target.value as T)}
      renderValue={(selected) => {
        if (selected === '') {
          return <p style={{ color: 'gray' }}>{placeholder}</p>;
        }
        return selected;
      }}
      sx={{ marginTop: 4 }}
      displayEmpty
      fullWidth
    >
      {options.map((label, index) => (
        <MenuItem key={index} value={label as string}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );

  return (
    <Center>
      <Container padding={4} marginTop={6}>
        <Typography fontWeight={500}>Affiliation</Typography>
        {dropdown({
          value: department,
          updateValue: setDepartment,
          options: Object.values(Department),
          placeholder: 'Choose a Department',
        })}
        {dropdown({
          value: role,
          updateValue: setRole,
          options: Object.values(Role),
          placeholder: 'Choose a Role',
        })}
        <Button
          onClick={handleNextClick}
          variant="contained"
          color="primary"
          sx={{ marginTop: 6 }}
        >
          Next
        </Button>
      </Container>
    </Center>
    // <div
    //   id="staticModal"
    //   data-modal-backdrop="static"
    //   tabIndex={-1}
    //   aria-hidden="true"
    //   className="bg-white w-full h-120 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    // >
    //   <div className="relative w-full max-w-2xl max-h-full">
    //     <div className="p-3 relative bg-white rounded-lg shadow dark:bg-gray-700">
    //       <div className="mb-3">
    //         <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    //           Select Department
    //         </label>
    //         <select
    //           value={department}
    //           onChange={(e) => setDepartment(e.target.value as Department)}
    //           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //         >
    //           <option value="">Choose a Department</option>
    //           {Object.values(Department).map((label, index) => (
    //             <option key={index} value={label}>
    //               {label}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //       {/* <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"></div> */}

    //       <div className="mb-3">
    //         <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    //           Select Role
    //         </label>
    //         <select
    //           value={role}
    //           onChange={(e) => setRole(e.target.value as Role)}
    //           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //         >
    //           <option value="">Choose a Role</option>
    //           {Object.values(Role).map((label, index) => (
    //             <option key={index} value={label}>
    //               {label}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //       <div className="block">
    //         <button
    //           onClick={handleNextClick}
    //           className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //         >
    //           Next
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
