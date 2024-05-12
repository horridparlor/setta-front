import {ToggleButton} from "@mui/material";
import React from "react";

export enum ComparisonType {
    MORE = '>',
    LESS = '<',
    EQUAL = '='
}

export enum SortOrder {
    ASCENDING = 'asc',
    DESCENDING = 'desc',
}

export enum SortOption {
    NAME = 'Name',
    CARD_TYPE = 'Type',
    LEVEL = 'Level',
    ATK = 'Atk',
    DEF = 'Def',
    COMBINED = 'Combined',
    CARD_CLASS = 'Class',
    OWNER = 'Owner',
    EXPANSION = 'Expansion',
    RANDOM = 'Random',
    CREATED_AT = 'Created At',
    UPDATED_AT = 'Updated At',
}