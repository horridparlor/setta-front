import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LanguageSelect() {
  const { i18n } = useTranslation();

  const handleChange = async (e: SelectChangeEvent) => {
    await i18n.changeLanguage(e.target.value);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleChange}
      sx={{ backgroundColor: 'white' }}
    >
      <MenuItem value="fi">Finnish</MenuItem>
      <MenuItem value="en">English</MenuItem>
    </Select>
  );
}
