import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export function DropZone({ id, actionType }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id, // 'edit-zone' or 'delete-zone'
  });

  const IconComponent = actionType === 'edit' ? EditIcon : DeleteIcon;
  const label = actionType === 'edit' ? 'Drop here to Edit' : 'Drop here to Delete';

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: '150px',
        height: '150px',
        border: `2px dashed ${isOver ? '#28a745' : '#6C757D'}`, // Highlight when over
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        backgroundColor: isOver ? 'rgba(40, 167, 69, 0.1)' : 'rgba(108, 117, 125, 0.05)',
        transition: 'border-color 0.3s, background-color 0.3s',
      }}
    >
      <IconComponent sx={{ fontSize: '3rem', color: isOver ? '#28a745' : '#6C757D' }} />
      <Typography variant="caption" sx={{ mt: 1, color: isOver ? '#28a745' : '#6C757D' }}>
        {label}
      </Typography>
    </Box>
  );
}
