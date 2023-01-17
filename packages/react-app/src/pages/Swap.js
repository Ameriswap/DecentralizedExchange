import React, { useState, useEffect }  from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import UIToken from './UIToken';

export default function Swap() {
  return (
    <Card style={{margin: '0 auto',marginTop:53,borderRadius:24}} sx={{ maxWidth: 418 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Button>
            Swap
          </Button>
        }
      />
      <UIToken/>
    </Card>
  );
}
