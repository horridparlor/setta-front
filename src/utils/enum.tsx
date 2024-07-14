import {MenuItem} from "@mui/material";

export const getEnumSelector = (enums: Array<{ [key: string]: string }>, defaultTo: string) => {
    const values = Object.values(enums.reduce((acc, obj) => {
        return { ...acc, ...obj };
    }, {})).sort();
    return [<MenuItem key='none' value={defaultTo}>–</MenuItem>,
        values.map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
        ))
    ];
}