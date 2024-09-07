import React, { forwardRef } from "react";
import { Table } from "@medusajs/ui";

export interface Props {
  children: React.ReactNode;
  columns?: number;
  style?: React.CSSProperties;
}

export const List = forwardRef<HTMLTableSectionElement, Props>(
  ({ children, columns = 1, style }: Props, ref) => {
    return (
      <Table.Body
        ref={ref}
        style={
          {
            ...style,
            "--columns": columns,
          } as React.CSSProperties
        }
        className=""
      >
        {children}
      </Table.Body>
    );
  }
);
