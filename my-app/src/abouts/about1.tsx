import { DetailsList, Dropdown, IColumn, PrimaryButton } from "@fluentui/react";
import { time } from "console";
import { useEffect, useState } from "react";
import { Timer } from "../views/timer";


const options = [
  { key: "fruitsHeader", text: "Fruits" },
  { key: "apple", text: "Apple" },
  { key: "banana", text: "Banana" },
  { key: "orange", text: "Orange", disabled: true },
  { key: "grape", text: "Grape" },
  { key: "divider_1", text: "-" },
  { key: "vegetablesHeader", text: "Vegetables" },
  { key: "broccoli", text: "Broccoli" },
  { key: "carrot", text: "Carrot" },
  { key: "lettuce", text: "Lettuce" },
];

const dropdownStyles = {
  dropdown: { width: 300 },
};

const columns: IColumn[] = [
  { key: 'column1', name: 'Column 1', fieldName: 'column1', minWidth: 100 },
  { key: 'column2', name: 'Column 2', fieldName: 'column2' , minWidth: 100 },
  { key: 'column3', name: 'Column 3', fieldName: 'column3', minWidth: 100  },
];

const items = [
  { key: 'item1', column1: 'Item 1', column2: 'Description for Item 1', column3: '100' },
  { key: 'item2', column1: 'Item 2', column2: 'Description for Item 2', column3: '200' },
  { key: 'item3', column1: 'Item 3', column2: 'Description for Item 3', column3: '300' },
];

export const About1 = () => {
  return (
    <div className="update-User-wrapper">
      <h2>Ovo je About1 stranica</h2>
      <Timer />
      <Dropdown
        placeholder="Select an option"
        label="Basic uncontrolled example"
        options={options}
        styles={dropdownStyles}
      ></Dropdown>
      <DetailsList items={items} />
    </div>
  );
};
