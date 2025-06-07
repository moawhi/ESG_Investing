import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import CompanyCard from '../Dashboard/CompanyCard'; // Path to the original CompanyCard

export function DraggableCompanyCard({ companyDetails, investmentAmount, impactStatement, selected, onSelect, id }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id, // company_id should be passed here
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    // Ensure the card is raised when dragging, if needed
    zIndex: isDragging ? 100 : 'auto',
    // Make sure the item is not text-selectable during drag
    userSelect: isDragging ? 'none' : 'auto',
  };

  // Conditionally apply listeners if not in selection mode or handle interaction carefully
  // For now, let's assume dragging takes precedence if onSelect is for selection mode.
  // If onSelect is purely for click navigation, it might be okay.
  const cardListeners = onSelect && selected ? listeners : { ...listeners, onClick: (e) => {
      // Prevent click if dragging was the intent. This is a common pattern.
      // However, dnd-kit's listeners might already handle this well.
      // For now, let the listeners from useDraggable handle it.
      // If a click without drag is needed, onSelect should be called.
      // This might need more sophisticated event handling later.
      if (onSelect && !isDragging) { // A basic check
        onSelect(companyDetails.company_id);
      }
    }
  };


  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CompanyCard
        companyDetails={companyDetails}
        investmentAmount={investmentAmount}
        impactStatement={impactStatement}
        selected={selected}
        // Pass only the navigation part of onSelect, or make CompanyCard itself not directly clickable if wrapped
        // For now, let's see how the default behavior of passing onSelect works.
        // If 'onSelect' is purely for selection mode, it might be better to handle click on this div
        // and not pass 'onSelect' to the CompanyCard if it also has its own click handler.
        // This is simplified for now.
        onSelect={onSelect}
      />
    </div>
  );
}
