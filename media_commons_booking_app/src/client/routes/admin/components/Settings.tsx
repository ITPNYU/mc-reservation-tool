import { Divider, ListItemButton, ListItemText, Stack } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { TableNames } from '../../../../policy';

const tabs = ['Safety Training', 'PA Users', 'Admin Users', 'Liaisons', 'Ban'];

export default function Settings() {
  return (
    <Grid container marginTop={4}>
      <Grid xs={2}>
        <Stack
          divider={<Divider sx={{ borderColor: '#21212114' }} />}
          sx={{ border: '1px solid #21212114', borderRadius: '4px' }}
        >
          {tabs.map((tab) => (
            <div key={tab}>
              <ListItemButton>
                <ListItemText primary={tab} />
              </ListItemButton>
            </div>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
