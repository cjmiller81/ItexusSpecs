
import * as React from 'react';
import { ListChildComponentProps, FixedSizeList } from 'react-window';

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    },
  });
}

export const VirtualizedListbox = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  function VirtualizedListbox(props, ref) {
    const { children, ...other } = props;
    const itemCount = Array.isArray(children) ? children.length : 0;
    const itemSize = 48; // px per item

    return (
      <div
        ref={ref}
        {...other}
        style={{
          overflow: 'hidden', // убираем внешний скроллбар
        }}
      >
        <FixedSizeList
          height={Math.min(8, itemCount) * itemSize + 2 * LISTBOX_PADDING}
          width="100%"
          itemSize={itemSize}
          itemCount={itemCount}
          overscanCount={5}
          itemData={children}
        >
          {renderRow}
        </FixedSizeList>
      </div>
    );
  }
);
