"use client";

import * as Popover from "@radix-ui/react-popover";
import { Check, LucideProps } from "lucide-react";
import { useState } from "react";

export type Column = {
  key: string;
  label: string;
  visible: boolean;
  icon: any;
  sortable?: boolean;
};

interface Props {
  columns: Column[];
  onChange: (updatedColumns: Column[]) => void;
}

export default function LeaderboardColumnSelector({
  columns,
  onChange
}: Props) {
  const [open, setOpen] = useState(false);

  const toggleVisibility = (key: string) => {
    const updated = columns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    onChange(updated);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className='px-3 py-2 text-sm bg-white border rounded-lg shadow hover:bg-gray-50 min-w-[160px]'>
          Select Columns
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className='bg-white border rounded shadow-lg p-4 w-60'
        >
          <h3 className='font-semibold mb-2 text-sm text-gray-700'>
            Show Columns
          </h3>
          <div className='space-y-2 max-h-60 overflow-y-auto'>
            {columns.map((column) => (
              <button
                key={column.key}
                className='flex items-center justify-between w-full text-left px-2 py-1 rounded hover:bg-gray-100'
                onClick={() => toggleVisibility(column.key)}
              >
                <span>{column.label}</span>
                {column.visible && <Check className='w-4 h-4 text-green-600' />}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
